import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { SmartAiEngine } from '../services/aiEngine';
import { UserRoadmap } from '../../src/types/roadmap';

const router = Router();
const dataFilePath = path.join(__dirname, '../data/roadmapData.json');

function readRoadmapData(): UserRoadmap {
  const raw = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(raw);
}

function saveRoadmapData(data: UserRoadmap): void {
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// POST /api/ai/quiz-question
router.post('/quiz-question', async (req: Request, res: Response) => {
  try {
    const { milestoneTitle, skillName, subTopicTitle } = req.body;
    const questionData = await SmartAiEngine.generateQuizQuestion(
      milestoneTitle || 'General',
      skillName || 'Programming',
      subTopicTitle || 'General Knowledge'
    );
    res.json({ success: true, data: questionData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate AI quiz question' });
  }
});

// POST /api/ai/evaluate-answer
router.post('/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { milestoneId, skillId, subTopicId, subTopicTitle, question, userAnswer } = req.body;

    const evaluation = await SmartAiEngine.evaluateQuizAnswer(
      subTopicTitle || 'Skill Topic',
      question || '',
      userAnswer || ''
    );

    // Save evaluation to DB
    const data = readRoadmapData();
    const milestone = data.milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      for (const cat of milestone.categories) {
        for (const sk of cat.skills) {
          const sub = sk.subTopics.find((st) => st.id === subTopicId);
          if (sub) {
            sub.isCompleted = true;
            sub.assessmentScore = evaluation.score;
            sub.lastAssessedAt = new Date().toISOString();
            sub.aiFeedback = evaluation.feedback;

            // Update skill level
            const completedList = sk.subTopics.filter((s) => s.isCompleted);
            const avgScore = completedList.length > 0
              ? Math.round(completedList.reduce((acc, s) => acc + (s.assessmentScore || 80), 0) / completedList.length)
              : 0;
            sk.levelPercentage = Math.round((completedList.length / sk.subTopics.length) * avgScore);
            break;
          }
        }
      }

      // Update milestone progress
      const allSub = milestone.categories.flatMap((c) => c.skills.flatMap((s) => s.subTopics));
      const compCount = allSub.filter((st) => st.isCompleted).length;
      milestone.overallProgress = Math.round((compCount / allSub.length) * 100);

      saveRoadmapData(data);
    }

    res.json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to evaluate answer' });
  }
});

// POST /api/ai/evaluate-phase
router.post('/evaluate-phase', async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.body;
    const data = readRoadmapData();
    const milestone = data.milestones.find((m) => m.id === milestoneId) || data.milestones[0];

    const phaseEvaluation = await SmartAiEngine.evaluateMilestonePhase(milestone);

    // Save to milestone
    milestone.overallAiEvaluation = phaseEvaluation;
    saveRoadmapData(data);

    res.json({ success: true, data: phaseEvaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to evaluate phase' });
  }
});

// POST /api/ai/career-chat
router.post('/career-chat', async (req: Request, res: Response) => {
  try {
    const { userMessage, milestoneId } = req.body;
    const data = readRoadmapData();
    const milestone = data.milestones.find((m) => m.id === milestoneId) || data.milestones[0];

    const result = await SmartAiEngine.chatCareerAdvisor(
      userMessage || 'Tư vấn cho tôi',
      milestone.title,
      data
    );

    res.json({ success: true, reply: result.text, proposedMilestone: result.proposedMilestone });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate career chat response' });
  }
});

export default router;

