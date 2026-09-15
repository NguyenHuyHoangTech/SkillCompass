import type {
  UserRoadmap,
  QuizQuestionResponse,
  QuizEvaluationResponse,
  OverallAiEvaluation,
  Milestone,
} from '../types/roadmap';
import { initialMockRoadmap } from '../data/mockRoadmapData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getLocalMockRoadmap(): UserRoadmap {
  const cached = localStorage.getItem('skill_compass_roadmap');
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
          localStorage.setItem('skill_compass_roadmap', JSON.stringify(parsed));
        }
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
      return {
        skillId: "sk-mock",
        subTopicId: "sub-mock",
        subTopicTitle,
        skillName,
        question: `Hãy phân tích bản chất, ưu điểm và ứng dụng thực tế của "${subTopicTitle}" thuộc kỹ năng ${skillName}?`,
        hint: `Gợi ý: Phân tích định nghĩa, nguyên lý hoạt động và ví dụ áp dụng thực tế.`,
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
          ? `Tốt lắm! Bạn đã thể hiện hiểu biết vững chắc về ${payload.subTopicTitle}.`
          : `Cần bổ sung thêm ví dụ và thuật ngữ chuyên sâu cho ${payload.subTopicTitle}.`,
        strengths: "Giải thích đúng trọng tâm câu hỏi và thể hiện tư duy logic.",
        improvements: "Nên bổ sung thêm ví dụ đoạn mã (code snippet) và các trường hợp biên (edge cases).",
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

      // 2. AI Đánh giá năng lực tổng hợp dựa trên kết quả các bài kiểm tra test
      const avgQuizScore = tested.length > 0
        ? Math.round(tested.reduce((acc, st) => acc + (st.assessmentScore || 80), 0) / tested.length)
        : 85;

      const evalResult: OverallAiEvaluation = {
        score: avgQuizScore,
        readinessLabel: `${avgQuizScore}% AI Đánh Giá Năng Lực ${milestone.roleName}`,
        summary: `AI đã tổng hợp kết quả các bài kiểm tra test: Điểm năng lực thực tế đạt ${avgQuizScore}% (đã tích xong ${completed.length}/${allSub.length} mục bài học trong mốc).`,
        strengths: [
          "Thấu hiểu tư duy UI/UX trực quan và nguyên tắc phân cấp thị giác",
          "Có khả năng áp dụng các công cụ hiện đại và chuẩn hóa trải nghiệm người dùng"
        ],
        weaknesses: [
          `Cần hoàn thiện thêm các hạng mục thực hành chưa đạt 100% trong mốc này`
        ],
        actionItems: [
          "Luyện tập bài test AI Quiz cho các mục còn lại",
          "Áp dụng chuẩn Mobile-First và kiểm tra độ tương phản màu WCAG",
          "Tối ưu hóa hiệu năng ứng dụng bằng Lazy Loading & WebP"
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
      if (msg.includes("giai đoạn 4") || msg.includes("ai native") || msg.includes("cloud") || (msg.includes("mốc") && msg.includes("ai"))) {
        const proposedMilestone: Milestone = {
          id: `ms-future-ai-${Date.now()}`,
          title: "Giai Đoạn 4: Fullstack AI Native & Cloud Architect",
          roleName: "AI Native Fullstack Lead",
          description: "Mốc tương lai do AI đề xuất: Tích hợp mô hình AI LLM Engine (Gemini/OpenAI), Vector Database, RAG Systems và Điện toán Đám mây AWS Serverless/Docker Container.",
          badge: "🤖 AI Cloud Master",
          overallProgress: 0,
          categories: [
            {
              id: "cat-ai-integration",
              name: "4.1. Tích Hợp Mô Hình AI & Vector Database",
              description: "Xây dựng các sản phẩm AI Native thông minh",
              skills: [
                {
                  id: "sk-ai-llm-api",
                  name: "LLM API Integration & Prompt Engineering",
                  icon: "Zap",
                  levelPercentage: 0,
                  subTopics: [
                    {
                      id: "sub-ai-prompting",
                      title: "Kỹ Thuật Prompt Engineering & Structured Outputs",
                      description: "Thiết kế prompt tối ưu cho Gemini AI trả về định dạng JSON chuẩn",
                      isCompleted: false,
                      assessmentScore: 0
                    },
                    {
                      id: "sub-vector-db",
                      title: "Vector Database & RAG System (Chroma / Pinecone)",
                      description: "Xây dựng hệ thống tìm kiếm ngữ nghĩa RAG cho tài liệu doanh nghiệp",
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
              description: "Triển khai tự động hóa hạ tầng đám mây",
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
                      description: "Đóng gói ứng dụng Fullstack vào Docker Container hoàn chỉnh",
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
          text: `Dựa trên phân tích xu hướng tuyển dụng IT hiện tại và tiến độ mốc hiện tại của bạn, tôi đề xuất bạn mở rộng sang **Giai Đoạn 4: Fullstack AI Native & Cloud Architect** (gồm các kỹ năng Tích hợp Gemini AI, Vector Database và Docker/AWS Cloud). \n\nBạn có muốn tự động thêm mốc này vào Lộ Trình của bạn ngay bây giờ không? 👇`,
          proposedMilestone
        };
      }

      if (msg.includes("giai đoạn 5") || msg.includes("design system") || msg.includes("micro-frontend")) {
        const proposedMilestone: Milestone = {
          id: `ms-future-ds-${Date.now()}`,
          title: "Giai Đoạn 5: Design System Architect & Micro-frontends",
          roleName: "Design System & Micro-frontend Lead",
          description: "Mốc tương lai do AI đề xuất: Chuẩn hóa hệ thống UI Tokens, Storybook Design System doanh nghiệp và kiến trúc Micro-frontends Module Federation.",
          badge: "🎨 Design System Lead",
          overallProgress: 0,
          categories: [
            {
              id: "cat-design-system",
              name: "5.1. Enterprise Design System & Tokens",
              description: "Xây dựng thư viện UI tái sử dụng quy mô lớn",
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
                      description: "Đồng bộ design token giữa Figma và codebase React",
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
          text: `Tôi xin đề xuất mốc **Giai Đoạn 5: Design System Architect & Micro-frontends**! \n\nBạn nhấn nút bên dưới để thêm mốc này vào Lộ Trình của bạn nhé! 👇`,
          proposedMilestone
        };
      }

      if (msg.includes("thêm mốc") || msg.includes("mốc mới") || msg.includes("tương lai") || msg.includes("đề xuất mốc")) {
        const proposedMilestone: Milestone = {
          id: `ms-future-ai-${Date.now()}`,
          title: "Giai Đoạn 4: Fullstack AI Native & Cloud Architect",
          roleName: "AI Native Fullstack Lead",
          description: "Mốc tương lai do AI đề xuất: Tích hợp mô hình AI LLM Engine (Gemini/OpenAI), Vector Database, RAG Systems và Điện toán Đám mây AWS Serverless/Docker Container.",
          badge: "🤖 AI Cloud Master",
          overallProgress: 0,
          categories: [
            {
              id: "cat-ai-integration",
              name: "4.1. Tích Hợp Mô Hình AI & Vector Database",
              description: "Xây dựng các sản phẩm AI Native thông minh",
              skills: [
                {
                  id: "sk-ai-llm-api",
                  name: "LLM API Integration & Prompt Engineering",
                  icon: "Zap",
                  levelPercentage: 0,
                  subTopics: [
                    {
                      id: "sub-ai-prompting",
                      title: "Kỹ Thuật Prompt Engineering & Structured Outputs",
                      description: "Thiết kế prompt tối ưu cho Gemini AI trả về định dạng JSON chuẩn",
                      isCompleted: false,
                      assessmentScore: 0
                    },
                    {
                      id: "sub-vector-db",
                      title: "Vector Database & RAG System (Chroma / Pinecone)",
                      description: "Xây dựng hệ thống tìm kiếm ngữ nghĩa RAG cho tài liệu doanh nghiệp",
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
          text: `Dựa trên phân tích xu hướng tuyển dụng IT hiện tại, tôi xin đề xuất mốc tương lai tiếp theo: **Giai Đoạn 4: Fullstack AI Native & Cloud Architect**! \n\nBạn bấm nút bên dưới để tự động thêm mốc mới này vào thanh Tab mốc của Lộ Trình nhé! 👇`,
          proposedMilestone
        };
      }

      if (msg.includes("bao lâu") || msg.includes("thời gian")) {
        return {
          text: `Dựa trên tiến độ hiện tại của bạn (Đạt khoảng 70% các mục kỹ năng), nếu bạn học 2 giờ mỗi ngày, bạn dự kiến sẵn sàng chuyển tiếp sang mốc tương lai tiếp theo sau **3 đến 5 tuần** nữa! 🚀`
        };
      }

      if (msg.includes("lương") || msg.includes("thu nhập")) {
        return {
          text: `Mức lương kỳ vọng ở mốc này trên thị trường IT Việt Nam hiện dao động từ **15 - 28 triệu VNĐ / tháng**. Khi hoàn thành các bài test AI Quiz với điểm số cao, bạn hoàn toàn tự tin đàm phán mức thu nhập tối ưu! 💰`
        };
      }

      return {
        text: `Tôi là AI Career Advisor! Tôi có thể giúp bạn định hướng nghề nghiệp, giải đáp thắc mắc về kỹ năng và **Đề Xuất Các Mốc Lộ Trình Tương Lai Mới** (Ví dụ: Giai đoạn 4 AI Native Lead, Giai đoạn 5 Design System Master...). Bạn muốn tôi đề xuất mốc mới không? 😊`
      };
    }
  }
}

