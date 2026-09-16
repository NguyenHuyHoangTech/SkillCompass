import type {
  UserRoadmap,
  QuizQuestionResponse,
  QuizEvaluationResponse,
  OverallAiEvaluation,
  Milestone,
} from '../types/roadmap';
import { initialMockRoadmap } from '../data/mockRoadmapData';
import { generateAssessmentTestFromAI, evaluateAssessmentTestWithAI, evaluateMilestonePhaseWithAI } from './ai';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getLocalMockRoadmap(): UserRoadmap {
  const cached = localStorage.getItem('skill_compass_roadmap');
  if (cached) {
    try {
      const parsed: UserRoadmap = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.milestones) && parsed.milestones.length > 0) {
        parsed.milestones.forEach((m) => {
          if (!Array.isArray(m.categories)) {
            m.categories = [];
          }
        });
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  localStorage.setItem('skill_compass_roadmap', JSON.stringify(initialMockRoadmap));
  return initialMockRoadmap;
}

function saveLocalMockRoadmap(data: UserRoadmap): void {
  data.updatedAt = new Date().toISOString();
  localStorage.setItem('skill_compass_roadmap', JSON.stringify(data));
}

export class ApiService {
  public static async getRoadmap(): Promise<UserRoadmap> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap`);
      if (!res.ok) throw new Error('API server unavailable');
      const result = await res.json();
      localStorage.setItem('skill_compass_roadmap', JSON.stringify(result.data));
      return result.data;
    } catch {
      return getLocalMockRoadmap();
    }
  }

  public static async updateSubTopic(payload: {
    milestoneId: string;
    skillId: string;
    subTopicId: string;
    isCompleted: boolean;
    assessmentScore?: number;
    aiFeedback?: string;
  }): Promise<UserRoadmap> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap/subtopic`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      localStorage.setItem('skill_compass_roadmap', JSON.stringify(result.data));
      return result.data;
    } catch {
      const data = getLocalMockRoadmap();
      const milestone = data.milestones.find((m) => m.id === payload.milestoneId);
      if (milestone) {
        for (const cat of milestone.categories) {
          for (const sk of cat.skills) {
            const sub = sk.subTopics.find((st) => st.id === payload.subTopicId);
            if (sub) {
              sub.isCompleted = payload.isCompleted;
              if (payload.assessmentScore !== undefined) sub.assessmentScore = payload.assessmentScore;
              if (payload.aiFeedback) sub.aiFeedback = payload.aiFeedback;

              const completedList = sk.subTopics.filter((s) => s.isCompleted);
              const avgScore = completedList.length > 0
                ? Math.round(completedList.reduce((acc, s) => acc + (s.assessmentScore || 80), 0) / completedList.length)
                : 0;
              sk.levelPercentage = Math.round((completedList.length / sk.subTopics.length) * avgScore);
              break;
            }
          }
        }

        const allSubTopics = milestone.categories.flatMap((c) => c.skills.flatMap((s) => s.subTopics));
        const completedCount = allSubTopics.filter((st) => st.isCompleted).length;
        milestone.overallProgress = Math.round((completedCount / allSubTopics.length) * 100);

        saveLocalMockRoadmap(data);
      }
      return data;
    }
  }

  public static async addMilestoneToRoadmap(newMilestone: Milestone): Promise<UserRoadmap> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap/milestone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone: newMilestone }),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      localStorage.setItem('skill_compass_roadmap', JSON.stringify(result.data));
      return result.data;
    } catch {
      const data = getLocalMockRoadmap();
      if (!data.milestones.some((m) => m.id === newMilestone.id)) {
        data.milestones.push(newMilestone);
        data.currentMilestoneId = newMilestone.id;
        saveLocalMockRoadmap(data);
      }
      return data;
    }
  }

  public static async getQuizQuestion(
    milestoneTitle: string,
    skillName: string,
    subTopicTitle: string
  ): Promise<QuizQuestionResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/quiz-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneTitle, skillName, subTopicTitle }),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      return result.data;
    } catch {
      const aiData = await generateAssessmentTestFromAI(milestoneTitle, skillName, subTopicTitle);
      return {
        skillId: "sk-dynamic",
        subTopicId: "sub-dynamic",
        subTopicTitle,
        skillName,
        question: aiData.question,
        hint: aiData.hint,
        keyConcepts: aiData.keyConcepts
      };
    }
  }

  public static async submitQuizAnswer(payload: {
    milestoneId: string;
    skillId: string;
    subTopicId: string;
    subTopicTitle: string;
    question: string;
    userAnswer: string;
  }): Promise<QuizEvaluationResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/evaluate-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      return result.data;
    } catch {
      const aiEval = await evaluateAssessmentTestWithAI(
        payload.subTopicTitle,
        payload.question,
        payload.userAnswer
      );

      const evaluation: QuizEvaluationResponse = {
        score: aiEval.score,
        isPassed: aiEval.isPassed,
        feedback: aiEval.feedback,
        strengths: aiEval.strengths,
        improvements: aiEval.improvements,
        updatedSkillLevel: aiEval.score,
      };

      await ApiService.updateSubTopic({
        milestoneId: payload.milestoneId,
        skillId: payload.skillId,
        subTopicId: payload.subTopicId,
        isCompleted: true,
        assessmentScore: aiEval.score,
        aiFeedback: evaluation.feedback,
      });

      return evaluation;
    }
  }

  public static async evaluateMilestonePhase(milestoneId: string): Promise<OverallAiEvaluation> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/evaluate-phase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId }),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      return result.data;
    } catch {
      const data = getLocalMockRoadmap();
      const milestone = data.milestones.find((m) => m.id === milestoneId) || data.milestones[0];

      const allSub = milestone.categories.flatMap((c) => c.skills.flatMap((s) => s.subTopics));
      const subTopicsData = allSub.map(st => ({
        title: st.title,
        score: st.assessmentScore || 0,
        isCompleted: st.isCompleted
      }));

      const evalResult = await evaluateMilestonePhaseWithAI(
        milestone.title,
        milestone.roleName,
        subTopicsData
      );

      milestone.overallAiEvaluation = evalResult;
      saveLocalMockRoadmap(data);

      return evalResult;
    }
  }

  public static async askCareerAdvisor(
    userMessage: string,
    milestoneId: string
  ): Promise<{ text: string; proposedMilestone?: Milestone }> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/career-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage, milestoneId }),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      return {
        text: result.reply,
        proposedMilestone: result.proposedMilestone,
      };
    } catch {
      const msg = userMessage.toLowerCase();

      if (msg.includes("stage 4") || msg.includes("ai native") || msg.includes("cloud") || (msg.includes("milestone") && msg.includes("ai"))) {
        const proposedMilestone: Milestone = {
          id: `ms-future-ai-${Date.now()}`,
          title: "Stage 4: Fullstack AI Native & Cloud Architect",
          roleName: "AI Native Fullstack Lead",
          description: "AI proposed milestone: Integrate AI LLM Engines (Gemini/OpenAI), Vector Databases, RAG Systems, and AWS Serverless / Docker Containers.",
          badge: "🤖 AI Cloud Master",
          overallProgress: 0,
          categories: [
            {
              id: "cat-ai-integration",
              name: "4.1. AI Model Integration & Vector Database",
              description: "Build intelligent AI-Native products",
              skills: [
                {
                  id: "sk-ai-llm-api",
                  name: "LLM API Integration & Prompt Engineering",
                  icon: "Zap",
                  levelPercentage: 0,
                  subTopics: [
                    {
                      id: "sub-ai-prompting",
                      title: "Prompt Engineering & Structured Outputs",
                      description: "Design optimized prompts for Gemini AI to return structured JSON data.",
                      isCompleted: false,
                      assessmentScore: 0
                    },
                    {
                      id: "sub-vector-db",
                      title: "Vector Databases & RAG Systems (Chroma / Pinecone)",
                      description: "Build RAG semantic search pipelines for enterprise knowledge bases.",
                      isCompleted: false,
                      assessmentScore: 0
                    }
                  ]
                }
              ]
            }
          ]
        };

        return {
          text: `Based on current tech hiring trends and your progress, I suggest expanding to **Stage 4: Fullstack AI Native & Cloud Architect** (including Gemini AI, Vector DBs, and Docker/AWS Cloud).\n\nWould you like to automatically add this milestone to your roadmap? 👇`,
          proposedMilestone
        };
      }

      return {
        text: `I am your AI Career Advisor! I can assist with career orientation, answer skill questions, and recommend new future milestones (e.g. Stage 4 AI Native Lead, Stage 5 Design System Master...). Would you like a new stage recommendation? 😊`
      };
    }
  }
}
