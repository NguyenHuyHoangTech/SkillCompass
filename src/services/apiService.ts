import type {
  UserRoadmap,
  QuizQuestionResponse,
  QuizEvaluationResponse,
  OverallAiEvaluation,
  Milestone,
} from '../types/roadmap';
import { initialMockRoadmap } from '../data/mockRoadmapData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to determine if we should bypass the backend completely for this session
// This happens if the backend is running an old version (missing endpoints)
const isBackendStale = () => sessionStorage.getItem('skillcompass_backend_stale') === 'true';
const setBackendStale = () => sessionStorage.setItem('skillcompass_backend_stale', 'true');

function getLocalMockRoadmap(): UserRoadmap {
  const cached = localStorage.getItem('skill_compass_roadmap_v3');
  if (cached) {
    try {
      const parsed: UserRoadmap = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.milestones)) {
        let updated = false;
        for (const initialMs of initialMockRoadmap.milestones) {
          if (!parsed.milestones.some((m) => m.id === initialMs.id)) {
            parsed.milestones.push(initialMs);
            updated = true;
          }
        }
        if (updated) {
          localStorage.setItem('skill_compass_roadmap_v3', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  localStorage.setItem('skill_compass_roadmap_v3', JSON.stringify(initialMockRoadmap));
  return initialMockRoadmap;
}

function saveLocalMockRoadmap(data: UserRoadmap): void {
  data.updatedAt = new Date().toISOString();
  localStorage.setItem('skill_compass_roadmap_v3', JSON.stringify(data));
}

export class ApiService {
  public static async getRoadmap(): Promise<UserRoadmap> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap`);
      if (!res.ok) throw new Error('API server unavailable');
      const result = await res.json();
      localStorage.setItem('skill_compass_roadmap_v3', JSON.stringify(result.data));
      return result.data;
    } catch (err) {
      console.warn('Backend not available, using local mock data');
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
      localStorage.setItem('skill_compass_roadmap_v2', JSON.stringify(result.data));
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
              if (sk.subTopics.length > 0) {
                let pct = Math.round((completedList.length / sk.subTopics.length) * 100);
                if (pct === 100) pct = 99;
                sk.levelPercentage = pct;
              } else {
                sk.levelPercentage = 0;
              }
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


  public static async updateMilestone(milestoneId: string, data: { isForceCompleted?: boolean }): Promise<UserRoadmap> {
    try {
      if (isBackendStale()) throw new Error('Backend stale, forcing local');
      const res = await fetch(`${API_BASE_URL}/roadmap/milestone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, ...data }),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      localStorage.setItem('skill_compass_roadmap_v3', JSON.stringify(result.data));
      return result.data;
    } catch {
      const localData = getLocalMockRoadmap();
      const milestone = localData.milestones.find((m) => m.id === milestoneId);
      if (milestone) {
        if (data.isForceCompleted !== undefined) {
          milestone.isForceCompleted = data.isForceCompleted;
        }
        saveLocalMockRoadmap(localData);
      }
      return localData;
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
      return {
        skillId: "sk-mock",
        subTopicId: "sub-mock",
        subTopicTitle,
        skillName,
        question: `Please analyze the nature, advantages, and practical applications of "${subTopicTitle}" under the skill ${skillName}?`,
        hint: `Hint: Analyze its definition, principles, and real-world application examples.`,
        keyConcepts: [skillName, subTopicTitle, "UI/UX Best Practices"]
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
      const length = payload.userAnswer.trim().length;
      let score = 75;
      if (length > 60) score = 92;
      else if (length > 30) score = 84;
      else if (length < 15) score = 45;

      const evaluation: QuizEvaluationResponse = {
        score,
        isPassed: score >= 70,
        feedback: score >= 70
          ? `Well done! You have demonstrated a solid understanding of ${payload.subTopicTitle}.`
          : `You need to add more practical examples and technical terminology for ${payload.subTopicTitle}.`,
        strengths: "Addresses the core of the question and shows logical thinking.",
        improvements: "Consider adding code snippets and handling edge cases.",
        updatedSkillLevel: score,
      };

      await ApiService.updateSubTopic({
        milestoneId: payload.milestoneId,
        skillId: payload.skillId,
        subTopicId: payload.subTopicId,
        isCompleted: true,
        assessmentScore: score,
        aiFeedback: evaluation.feedback,
      });

      return evaluation;
    }
  }

  public static async completeSkill(milestoneId: string, skillId: string): Promise<UserRoadmap> {
    try {
      if (isBackendStale()) throw new Error('Backend stale, forcing local');
      const res = await fetch(`${API_BASE_URL}/roadmap/skill/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, skillId }),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      localStorage.setItem('skill_compass_roadmap_v3', JSON.stringify(result.data));
      return result.data;
    } catch {
      setBackendStale();
      // Fallback local mock update
      const localData = getLocalMockRoadmap();
      const milestone = localData.milestones.find((m) => m.id === milestoneId);
      if (milestone) {
        let targetSkill: any = null;
        for (const cat of milestone.categories) {
          const sk = cat.skills.find((s) => s.id === skillId);
          if (sk) {
            targetSkill = sk;
            break;
          }
        }
        if (targetSkill) {
          targetSkill.levelPercentage = 100;
          targetSkill.subTopics.forEach((st: any) => st.isCompleted = true);
          
          const allSubTopics = milestone.categories.flatMap((c) => c.skills.flatMap((s) => s.subTopics));
          const completedCount = allSubTopics.filter((st) => st.isCompleted).length;
          milestone.overallProgress = Math.round((completedCount / allSubTopics.length) * 100);
        }
        saveLocalMockRoadmap(localData);
      }
      return localData;
    }
  }

  public static async addChecklistTasks(milestoneId: string, skillId: string, tasks: string[]): Promise<UserRoadmap> {
    try {
      if (isBackendStale()) throw new Error('Backend stale, forcing local');
      const res = await fetch(`${API_BASE_URL}/roadmap/skill/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, skillId, tasks }),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      localStorage.setItem('skill_compass_roadmap_v3', JSON.stringify(result.data));
      return result.data;
    } catch {
      setBackendStale();
      const localData = getLocalMockRoadmap();
      const milestone = localData.milestones.find((m) => m.id === milestoneId);
      if (milestone) {
        let targetSkill: any = null;
        for (const cat of milestone.categories) {
          const sk = cat.skills.find((s) => s.id === skillId);
          if (sk) {
            targetSkill = sk;
            break;
          }
        }
        if (targetSkill) {
          const newSubTopics = tasks.map(t => ({
            id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: t,
            isCompleted: false
          }));
          targetSkill.subTopics = [...newSubTopics, ...targetSkill.subTopics];
          
          const completed = targetSkill.subTopics.filter((st: any) => st.isCompleted).length;
          let pct = targetSkill.subTopics.length > 0 ? Math.round((completed / targetSkill.subTopics.length) * 100) : 0;
          if (pct === 0) pct = 50;
          targetSkill.levelPercentage = pct;
        }
        saveLocalMockRoadmap(localData);
      }
      return localData;
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
      const completed = allSub.filter((st) => st.isCompleted);
      const tested = completed.filter((st) => (st.assessmentScore || 0) > 0);

      // AI synthesizes capability score based on test results
      const avgQuizScore = tested.length > 0
        ? Math.round(tested.reduce((acc, st) => acc + (st.assessmentScore || 0), 0) / tested.length)
        : 0;

      const evalResult: OverallAiEvaluation = {
        score: avgQuizScore,
        readinessLabel: `${avgQuizScore}% AI Evaluated Readiness for ${milestone.roleName}`,
        summary: tested.length > 0
          ? `AI has synthesized test results: Actual capability score is ${avgQuizScore}% (completed ${completed.length}/${allSub.length} topics in this phase).`
          : `New milestone initiated! You haven't taken any AI tests yet. Start learning and taking AI Quizzes to improve your capability score!`,
        strengths: tested.length > 0 ? [
          "Understands intuitive UI/UX mindset and visual hierarchy principles",
          "Capable of applying modern tools and standardizing user experience"
        ] : [
          "Ready to absorb new knowledge and skills in this phase",
          "Has established detailed roadmap goals with the AI Coach"
        ],
        weaknesses: [
          `Needs to complete remaining practical topics (${completed.length}/${allSub.length} topics completed)`
        ],
        actionItems: [
          "Practice AI Quizzes for topics in this phase",
          "Apply knowledge to real-world exercises",
          "Complete all checklists to be ready for job applications"
        ],
        evaluatedAt: new Date().toISOString()
      };

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

      // Check if user is asking for a new future milestone / next step
      if (msg.includes("phase 4") || msg.includes("ai native") || msg.includes("cloud") || (msg.includes("milestone") && msg.includes("ai"))) {
        const proposedMilestone: Milestone = {
          id: `ms-future-ai-${Date.now()}`,
          title: "Stage 4: Fullstack AI Native & Cloud Architect",
          roleName: "AI Native Fullstack Lead",
          description: "AI-proposed future milestone: Integrating AI LLM Engines (Gemini/OpenAI), Vector Databases, RAG Systems, and AWS Serverless/Docker Cloud Computing.",
          badge: "🤖 AI Cloud Master",
          overallProgress: 0,
          categories: [
            {
              id: "cat-ai-integration",
              name: "4.1. AI Model Integration & Vector Databases",
              description: "Building smart AI Native products",
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
                      description: "Designing optimal prompts for Gemini AI to return standard JSON formats",
                      isCompleted: false,
                      assessmentScore: 0
                    },
                    {
                      id: "sub-vector-db",
                      title: "Vector Database & RAG System (Chroma / Pinecone)",
                      description: "Building Semantic RAG Search for enterprise documents",
                      isCompleted: false,
                      assessmentScore: 0
                    }
                  ]
                }
              ]
            },
            {
              id: "cat-cloud-devops",
              name: "4.2. Cloud Serverless & CI/CD DevOps",
              description: "Automating cloud infrastructure deployment",
              skills: [
                {
                  id: "sk-aws-docker",
                  name: "Docker Containers & AWS Serverless",
                  icon: "Server",
                  levelPercentage: 0,
                  subTopics: [
                    {
                      id: "sub-docker-compose",
                      title: "Dockerizing React & Node.js Express",
                      description: "Packaging Fullstack applications into complete Docker Containers",
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
          text: `Based on current IT hiring trends and your current progress, I suggest you expand into **Stage 4: Fullstack AI Native & Cloud Architect** (including Gemini AI Integration, Vector Databases, and Docker/AWS Cloud). \n\nWould you like to automatically add this milestone to your Roadmap right now? 👇`,
          proposedMilestone
        };
      }

      if (msg.includes("phase 5") || msg.includes("design system") || msg.includes("micro-frontend")) {
        const proposedMilestone: Milestone = {
          id: `ms-future-ds-${Date.now()}`,
          title: "Stage 5: Design System Architect & Micro-frontends",
          roleName: "Design System & Micro-frontend Lead",
          description: "AI-proposed future milestone: Standardizing UI Tokens, Storybook Enterprise Design Systems, and Module Federation Micro-frontends architecture.",
          badge: "🎨 Design System Lead",
          overallProgress: 0,
          categories: [
            {
              id: "cat-design-system",
              name: "5.1. Enterprise Design System & Tokens",
              description: "Building a large-scale reusable UI library",
              skills: [
                {
                  id: "sk-storybook-tokens",
                  name: "Storybook & UI Token Engine",
                  icon: "Atom",
                  levelPercentage: 0,
                  subTopics: [
                    {
                      id: "sub-ui-tokens",
                      title: "Design Tokens (Colors, Typography, Spacing Scale)",
                      description: "Synchronizing design tokens between Figma and React codebase",
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
          text: `I would like to propose the milestone **Stage 5: Design System Architect & Micro-frontends**! \n\nClick the button below to add this milestone to your Roadmap! 👇`,
          proposedMilestone
        };
      }

      if (msg.includes("add milestone") || msg.includes("new milestone") || msg.includes("future") || msg.includes("suggest milestone")) {
        const proposedMilestone: Milestone = {
          id: `ms-future-ai-${Date.now()}`,
          title: "Stage 4: Fullstack AI Native & Cloud Architect",
          roleName: "AI Native Fullstack Lead",
          description: "AI-proposed future milestone: Integrating AI LLM Engines (Gemini/OpenAI), Vector Databases, RAG Systems, and AWS Serverless/Docker Cloud Computing.",
          badge: "🤖 AI Cloud Master",
          overallProgress: 0,
          categories: [
            {
              id: "cat-ai-integration",
              name: "4.1. AI Model Integration & Vector Databases",
              description: "Building smart AI Native products",
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
                      description: "Designing optimal prompts for Gemini AI to return standard JSON formats",
                      isCompleted: false,
                      assessmentScore: 0
                    },
                    {
                      id: "sub-vector-db",
                      title: "Vector Database & RAG System (Chroma / Pinecone)",
                      description: "Building Semantic RAG Search for enterprise documents",
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
          text: `Based on an analysis of current IT hiring trends, I propose the following future milestone: **Stage 4: Fullstack AI Native & Cloud Architect**! \n\nClick the button below to automatically add this new milestone to your Roadmap tab! 👇`,
          proposedMilestone
        };
      }

      if (msg.includes("how long") || msg.includes("time")) {
        return {
          text: `Based on your current progress (approximately 70% of skill goals achieved), if you study for 2 hours a day, you are expected to be ready to transition to the next future milestone in **3 to 5 weeks**! 🚀`
        };
      }

      if (msg.includes("salary") || msg.includes("income")) {
        return {
          text: `The expected salary at this milestone in the IT market typically ranges from **$2,500 - $4,500 / month**. Upon completing the AI Quiz tests with high scores, you can confidently negotiate for optimal compensation! 💰`
        };
      }

      return {
        text: `I am your AI Career Advisor! I can help you with career orientation, answer skill-related questions, and **Propose New Future Roadmaps** (e.g., Stage 4 AI Native Lead, Stage 5 Design System Master...). Would you like me to propose a new milestone? 😊`
      };
    }
  }
}
