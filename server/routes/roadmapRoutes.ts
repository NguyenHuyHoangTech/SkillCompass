import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserRoadmap, Milestone } from '../../src/types/roadmap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const dataFilePath = path.join(__dirname, '../data/roadmapData.json');

// Helper to read data from JSON file
function readRoadmapData(): UserRoadmap {
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading roadmap json:', err);
    throw err;
  }
}

// Helper to write data back to JSON file
function saveRoadmapData(data: UserRoadmap): void {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing roadmap json:', err);
  }
}

// GET /api/roadmap - Retrieve full user roadmap
router.get('/', (req: Request, res: Response) => {
  try {
    const data = readRoadmapData();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch roadmap data' });
  }
});

// PUT /api/roadmap/subtopic - Toggle / update completion & score of a subtopic
router.put('/subtopic', (req: Request, res: Response) => {
  try {
    const { milestoneId, skillId, subTopicId, isCompleted, assessmentScore, aiFeedback } = req.body;
    const data = readRoadmapData();

    const milestone = data.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    let targetSubTopic: any = null;
    let targetSkill: any = null;

    for (const cat of milestone.categories) {
      for (const sk of cat.skills) {
        if (sk.id === skillId || sk.subTopics.some((st) => st.id === subTopicId)) {
          const sub = sk.subTopics.find((st) => st.id === subTopicId);
          if (sub) {
            targetSubTopic = sub;
            targetSkill = sk;
            break;
          }
        }
      }
    }

    if (!targetSubTopic) {
      return res.status(404).json({ success: false, message: 'SubTopic not found' });
    }

    if (typeof isCompleted === 'boolean') targetSubTopic.isCompleted = isCompleted;
    if (typeof assessmentScore === 'number') {
      targetSubTopic.assessmentScore = assessmentScore;
      targetSubTopic.lastAssessedAt = new Date().toISOString();
    }
    if (aiFeedback) targetSubTopic.aiFeedback = aiFeedback;

    // Recalculate Skill level percentage (capped at 99% until certificate feature)
    if (targetSkill) {
      const completedList = targetSkill.subTopics.filter((s: any) => s.isCompleted);
      if (targetSkill.subTopics.length > 0) {
        let pct = Math.round((completedList.length / targetSkill.subTopics.length) * 100);
        if (pct === 100) {
           pct = 99; // Cap at 99% until certificate is implemented
        }
        targetSkill.levelPercentage = pct;
      } else {
        targetSkill.levelPercentage = 0;
      }
    }

    // Recalculate Milestone overall progress
    const allSubTopics = milestone.categories.flatMap((c) => c.skills.flatMap((s) => s.subTopics));
    const completedCount = allSubTopics.filter((st) => st.isCompleted).length;
    milestone.overallProgress = Math.round((completedCount / allSubTopics.length) * 100);

    saveRoadmapData(data);
    res.json({ success: true, data, updatedSubTopic: targetSubTopic });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update subtopic' });
  }
});

// PUT /api/roadmap/skill/complete - Force complete a skill and update milestone
router.put('/skill/complete', (req: Request, res: Response) => {
  try {
    const { milestoneId, skillId } = req.body;
    const data = readRoadmapData();

    const milestone = data.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    let targetSkill: any = null;

    for (const cat of milestone.categories) {
      const sk = cat.skills.find((s) => s.id === skillId);
      if (sk) {
        targetSkill = sk;
        break;
      }
    }

    if (!targetSkill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    targetSkill.levelPercentage = 100;
    targetSkill.subTopics.forEach((st: any) => {
      st.isCompleted = true;
    });

    // Recalculate Milestone overall progress
    const allSubTopics = milestone.categories.flatMap((c) => c.skills.flatMap((s) => s.subTopics));
    const completedCount = allSubTopics.filter((st) => st.isCompleted).length;
    milestone.overallProgress = Math.round((completedCount / allSubTopics.length) * 100);

    saveRoadmapData(data);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to complete skill' });
  }
});

// POST /api/roadmap/skill/tasks - Add checklist tasks to a skill
router.post('/skill/tasks', (req: Request, res: Response) => {
  try {
    const { milestoneId, skillId, tasks } = req.body;
    const data = readRoadmapData();

    const milestone = data.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

    let targetSkill: any = null;
    for (const cat of milestone.categories) {
      const sk = cat.skills.find((s) => s.id === skillId);
      if (sk) {
        targetSkill = sk;
        break;
      }
    }
    if (!targetSkill) return res.status(404).json({ success: false, message: 'Skill not found' });

    const newSubTopics = tasks.map((t: string) => ({
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: t,
      isCompleted: false
    }));

    targetSkill.subTopics = [...newSubTopics, ...targetSkill.subTopics];

    const completed = targetSkill.subTopics.filter((st: any) => st.isCompleted).length;
    let pct = targetSkill.subTopics.length > 0 ? Math.round((completed / targetSkill.subTopics.length) * 100) : 0;
    if (pct === 0) pct = 50; // In Progress
    targetSkill.levelPercentage = pct;

    saveRoadmapData(data);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add tasks' });
  }
});

// POST /api/roadmap/milestone - Add a new milestone proposed by AI
router.post('/milestone', (req: Request, res: Response) => {
  try {
    const { milestone } = req.body;
    if (!milestone || !milestone.id) {
      return res.status(400).json({ success: false, message: 'Invalid milestone data' });
    }

    const data = readRoadmapData();
    if (!data.milestones.some((m) => m.id === milestone.id)) {
      data.milestones.push(milestone);
      data.currentMilestoneId = milestone.id;
      saveRoadmapData(data);
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add milestone' });
  }
});

// PUT /api/roadmap/milestone - Update a milestone (e.g. force complete)
router.put('/milestone', (req: Request, res: Response) => {
  try {
    const { milestoneId, isForceCompleted } = req.body;
    const data = readRoadmapData();

    const milestone = data.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    if (typeof isForceCompleted === 'boolean') {
      milestone.isForceCompleted = isForceCompleted;
    }

    saveRoadmapData(data);
    res.json({ success: true, data, updatedMilestone: milestone });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update milestone' });
  }
});

export default router;

