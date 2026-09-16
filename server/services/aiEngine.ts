import { Milestone, QuizQuestionResponse, QuizEvaluationResponse, OverallAiEvaluation } from '../../src/types/roadmap';

/**
 * Smart AI Engine - Specialized for UI/UX Mindset, Technical Excellence & Best Practices
 */

export class SmartAiEngine {
  /**
   * Generates a context-aware technical quiz question for a specific skill topic
   */
  public static async generateQuizQuestion(
    milestoneTitle: string,
    skillName: string,
    subTopicTitle: string
  ): Promise<QuizQuestionResponse> {
    const questionDatabase: Record<string, { question: string; hint: string; keyConcepts: string[] }> = {
      "Don't Make Me Think": {
        question: "Hãy giải thích triết lý 'Don't Make Me Think' của Steve Krug trong thiết kế UX? Cho một ví dụ về một nút bấm hoặc form đăng nhập vi phạm nguyên tắc này.",
        hint: "Gợi ý: Tập trung vào việc giảm tải tư duy (cognitive load), tính rõ ràng và sự quen thuộc (mental models) của người dùng.",
        keyConcepts: ["Cognitive Load", "UX Intuition", "Mental Model", "Simplicity"]
      },
      "Consistency": {
        question: "Tính nhất quán (Consistency) trong thiết kế UI/UX mang lại lợi ích gì cho người dùng? Hãy nêu cách bạn duy trì tính nhất quán về Nút bấm (Button) và Typography trên toàn dự án React.",
        hint: "Gợi ý: Nói về Design System, UI Tokens, Reusable Components và khả năng dự đoán (predictability) của giao diện.",
        keyConcepts: ["Design System", "UI Tokens", "Predictability", "Brand Uniformity"]
      },
      "Visual Hierarchy": {
        question: "Phân cấp thị giác (Visual Hierarchy) là gì? Bạn sẽ kết hợp Kích thước (Size), Màu sắc (Color) và Vị trí (Position) như thế nào để làm cho nút Call To Action (CTA) thu hút ánh nhìn đầu tiên?",
        hint: "Gợi ý: Áp dụng quy tắc tương phản (Contrast), điểm nhấn (Focal point) và quy luật đọc F-pattern / Z-pattern.",
        keyConcepts: ["Visual Hierarchy", "Focal Point", "Call To Action", "Contrast", "F-pattern"]
      },
      "Whitespace": {
        question: "Tại sao Khoảng trắng (Whitespace / Negative Space) không phải là 'khoảng trống lãng phí'? Khoảng trắng giúp ích gì cho khả năng đọc (Readability) và vẻ sang trọng của UI?",
        hint: "Gợi ý: Khoảng trắng tạo nhịp thở cho mắt, nhóm các thành phần liên quan (Proximity) và giảm sự rối mắt (Clutter).",
        keyConcepts: ["Negative Space", "Law of Proximity", "Readability", "Visual Breathing"]
      },
      "Tailwind CSS": {
        question: "Phương pháp Utility-First của Tailwind CSS giúp ích gì cho tốc độ phát triển và tính đồng nhất so với viết file CSS/SCSS riêng biệt?",
        hint: "Gợi ý: Đề cập tới việc tránh đặt tên class thừa vãi, quản lý Design Tokens tập trung trong tailwind.config và tối ưu nén CSS bằng Purge/JIT.",
        keyConcepts: ["Utility-First", "No Custom Class Overheads", "JIT Compiler", "Consistent Spacing Scale"]
      },
      "Responsive": {
        question: "Sự khác nhau cốt lõi giữa tư duy thiết kế Mobile-First và Desktop-First là gì? Tại sao xu hướng hiện đại luôn ưu tiên Mobile-First?",
        hint: "Gợi ý: Mobile-first bắt buộc tối giản nội dung cốt lõi trên màn hình nhỏ trước, sau đó dùng min-width media queries để mở rộng cho màn hình lớn.",
        keyConcepts: ["Mobile-First", "Min-Width Queries", "Progressive Enhancement", "Touch Friendly"]
      },
      "Accessibility": {
        question: "Làm thế nào để đảm bảo website của bạn đạt chuẩn Accessibility (A11y / WCAG)? Hãy nêu 3 yếu tố quan trọng về Semantic HTML, Keyboard Navigation và Độ tương phản màu.",
        hint: "Gợi ý: Dùng tag HTML ngữ nghĩa (<main>, <nav>), attribute aria-label, hỗ trợ tab/focus state và tỷ lệ tương phản tối thiểu 4.5:1.",
        keyConcepts: ["WCAG Standards", "Semantic HTML", "Keyboard Focus", "Color Contrast 4.5:1", "Screen Readers"]
      }
    };

    const key = Object.keys(questionDatabase).find((k) => subTopicTitle.toLowerCase().includes(k.toLowerCase()));
    const template = key ? questionDatabase[key] : {
      question: `Hãy giải thích khái niệm, tầm quan trọng và cách áp dụng thực tế của "${subTopicTitle}" thuộc kỹ năng ${skillName}?`,
      hint: `Gợi ý: Phân tích lý thuyết cốt lõi, lợi ích mang lại cho UX và ví dụ minh họa.`,
      keyConcepts: [skillName, subTopicTitle, "UI/UX Best Practices"]
    };

    return {
      skillId: "sk-dynamic",
      subTopicId: "sub-dynamic",
      subTopicTitle,
      skillName,
      question: template.question,
      hint: template.hint,
      keyConcepts: template.keyConcepts
    };
  }

  /**
   * Evaluates a user's typed quiz answer and computes percentage mastery
   */
  public static async evaluateQuizAnswer(
    subTopicTitle: string,
    question: string,
    userAnswer: string
  ): Promise<QuizEvaluationResponse> {
    const trimmed = userAnswer.trim();
    if (trimmed.length < 15) {
      return {
        score: 40,
        isPassed: false,
        feedback: "Câu trả lời quá ngắn. Hãy phân tích sâu hơn nguyên lý và cho ví dụ thực tế.",
        strengths: "Đã phản hồi ban đầu.",
        improvements: "Nên bổ sung thuật ngữ chuyên môn (Visual Hierarchy, Accessibility, Responsiveness...).",
        updatedSkillLevel: 50
      };
    }

    const wordCount = trimmed.split(/\s+/).length;
    let baseScore = 70;
    if (wordCount > 30) baseScore += 12;
    if (wordCount > 55) baseScore += 10;

    const keywords = [
      "ux", "ui", "hierarchy", "contrast", "whitespace", "consistency", "mobile-first",
      "flexbox", "grid", "tailwind", "react", "component", "animation", "performance",
      "lazy load", "accessibility", "a11y", "semantic", "wcag", "responsive"
    ];

    const matched = keywords.filter((k) => trimmed.toLowerCase().includes(k));
    baseScore += Math.min(matched.length * 3, 12);

    const finalScore = Math.min(Math.max(baseScore, 50), 98);

    return {
      score: finalScore,
      isPassed: finalScore >= 70,
      feedback: finalScore >= 80
        ? `Xuất sắc! Bạn đã nắm vững tư duy và kỹ thuật thực hành cho "${subTopicTitle}".`
        : `Tốt! Bạn hiểu bản chất vấn đề. Hãy thực hành thêm ví dụ code hoặc demo giao diện.`,
      strengths: `Thể hiện góc nhìn đúng đắn và am hiểu thuật ngữ (${matched.join(", ") || "nền tảng tốt"}).`,
      improvements: "Nên áp dụng ngay vào các bài toán thiết kế giao diện thực tế.",
      updatedSkillLevel: finalScore
    };
  }

  /**
   * Generates overall AI evaluation for a milestone phase
   */
  public static async evaluateMilestonePhase(milestone: Milestone): Promise<OverallAiEvaluation> {
    let totalSub = 0;
    let completedSub = 0;
    let scoreSum = 0;

    milestone.categories.forEach((cat) => {
      cat.skills.forEach((sk) => {
        sk.subTopics.forEach((sub) => {
          totalSub++;
          if (sub.isCompleted) {
            completedSub++;
            scoreSum += sub.assessmentScore || 80;
          }
        });
      });
    });

    const completionRate = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;
    const avgScore = completedSub > 0 ? Math.round(scoreSum / completedSub) : 65;
    const readinessScore = Math.round((completionRate * 0.6) + (avgScore * 0.4));

    return {
      score: readinessScore,
      readinessLabel: `${readinessScore}% Thành thạo ${milestone.roleName}`,
      summary: `Bạn đã hoàn thành ${completedSub}/${totalSub} tiêu chuẩn chuyên môn thuộc "${milestone.title}". Điểm đánh giá năng lực đạt ${avgScore}/100.`,
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
  }

  /**
   * Responds to the Career Advisor Chatbot with optional proposed milestones
   */
  public static async chatCareerAdvisor(
    userMessage: string,
    currentMilestoneTitle: string,
    userRoadmapData: any
  ): Promise<{ text: string; proposedMilestone?: Milestone }> {
    const query = userMessage.toLowerCase();

    // Proposed Milestone 4: Fullstack AI Native & Cloud Architect
    if (query.includes("giai đoạn 4") || query.includes("ai native") || query.includes("cloud") || (query.includes("mốc") && query.includes("ai"))) {
      const milestone: Milestone = {
        id: `ms-future-ai-${Date.now()}`,
        title: "Giai Đoạn 4: Fullstack AI Native & Cloud Architect",
        roleName: "AI Native Fullstack Lead",
        description: "Mốc tương lai do AI đề xuất: Tích hợp mô hình AI LLM Engine (Gemini/OpenAI), Vector Database, RAG Systems và Điện toán Đám mây AWS Serverless/Docker Container.",
        badge: "🤖 AI Cloud Master",
        overallProgress: 0,
        categories: [
          {
            id: "cat-ai-integration",
            name: "4.1. Tích Hợp Mô Hình AI & Vector DB",
            description: "Xây dựng ứng dụng AI Native thông minh",
            skills: [
              {
                id: "sk-ai-llm-api",
                name: "Gemini AI API & RAG Architecture",
                icon: "Zap",
                levelPercentage: 0,
                subTopics: [
                  {
                    id: "sub-ai-prompting",
                    title: "Prompt Engineering & Structured JSON Outputs",
                    description: "Thiết kế prompt chuẩn tối ưu cho AI trả về dữ liệu cấu trúc",
                    isCompleted: false,
                    assessmentScore: 0
                  },
                  {
                    id: "sub-vector-db",
                    title: "Vector Database & Embeddings (Pinecone / Chroma)",
                    description: "Xây dựng hệ thống tra cứu ngữ nghĩa RAG cho doanh nghiệp",
                    isCompleted: false,
                    assessmentScore: 0
                  }
                ]
              }
            ]
          },
          {
            id: "cat-cloud-devops",
            name: "4.2. Containerization & DevOps Cloud",
            description: "Tự động hóa triển khai hạ tầng đám mây",
            skills: [
              {
                id: "sk-aws-docker",
                name: "Docker Containers & AWS Deploy",
                icon: "Server",
                levelPercentage: 0,
                subTopics: [
                  {
                    id: "sub-docker-compose",
                    title: "Dockerizing React & Node.js Express",
                    description: "Đóng gói toàn bộ ứng dụng Fullstack vào Docker Container",
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
        text: `Dựa trên phân tích xu hướng tuyển dụng IT hiện tại, tôi đề xuất bạn mở rộng lộ trình sang **Giai Đoạn 4: Fullstack AI Native & Cloud Architect** (tích hợp Gemini AI Engine, Vector Database & Docker AWS Cloud). \n\nBạn có muốn tự động thêm mốc này vào Lộ Trình của bạn ngay bây giờ không? 👇`,
        proposedMilestone: milestone
      };
    }

    // Proposed Milestone 5: UI/UX Design System Lead & Micro-frontends
    if (query.includes("giai đoạn 5") || query.includes("design system") || query.includes("micro-frontend")) {
      const milestone: Milestone = {
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
                  },
                  {
                    id: "sub-storybook-docs",
                    title: "Storybook Component Documentation & Testing",
                    description: "Tự động hóa testing và viết tài liệu UI components",
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
        text: `Tôi đề xuất bạn mở rộng sang **Giai Đoạn 5: Design System Architect & Micro-frontends** (Quản lý Design Tokens, Storybook UI Library và chia nhỏ hệ thống thành Micro-frontends). \n\nBạn bấm nút bên dưới để thêm mốc này vào Lộ Trình nhé! 👇`,
        proposedMilestone: milestone
      };
    }

    // General "Thêm mốc" request -> Default to Next Level Milestone
    if (query.includes("giai đoạn") || query.includes("lộ trình") || query.includes("thêm mốc") || query.includes("mốc mới") || query.includes("tương lai") || query.includes("đề xuất mốc")) {
      const milestone: Milestone = {
        id: `ms-future-techlead-${Date.now()}`,
        title: "Giai Đoạn 4: Fullstack AI Native & Cloud Architect",
        roleName: "AI Native Fullstack Lead",
        description: "Mốc tương lai do AI đề xuất: Tích hợp mô hình AI LLM Engine (Gemini/OpenAI), Vector Database, RAG Systems và Điện toán Đám mây AWS Serverless/Docker Container.",
        badge: "🤖 AI Cloud Master",
        overallProgress: 0,
        categories: [
          {
            id: "cat-ai-integration",
            name: "4.1. Tích Hợp Mô Hình AI & Vector DB",
            description: "Xây dựng ứng dụng AI Native thông minh",
            skills: [
              {
                id: "sk-ai-llm-api",
                name: "Gemini AI API & RAG Architecture",
                icon: "Zap",
                levelPercentage: 0,
                subTopics: [
                  {
                    id: "sub-ai-prompting",
                    title: "Prompt Engineering & Structured JSON Outputs",
                    description: "Thiết kế prompt chuẩn tối ưu cho AI trả về dữ liệu cấu trúc",
                    isCompleted: false,
                    assessmentScore: 0
                  },
                  {
                    id: "sub-vector-db",
                    title: "Vector Database & Embeddings (Pinecone / Chroma)",
                    description: "Xây dựng hệ thống tra cứu ngữ nghĩa RAG cho doanh nghiệp",
                    isCompleted: false,
                    assessmentScore: 0
                  }
                ]
              }
            ]
          },
          {
            id: "cat-cloud-devops",
            name: "4.2. Containerization & DevOps Cloud",
            description: "Tự động hóa triển khai hạ tầng đám mây",
            skills: [
              {
                id: "sk-aws-docker",
                name: "Docker Containers & AWS Deploy",
                icon: "Server",
                levelPercentage: 0,
                subTopics: [
                  {
                    id: "sub-docker-compose",
                    title: "Dockerizing React & Node.js Express",
                    description: "Đóng gói toàn bộ ứng dụng Fullstack vào Docker Container",
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
        text: `Dựa trên tiến độ tuyệt vời của bạn ở mốc **${currentMilestoneTitle}**, tôi xin đề xuất mốc tương lai tiếp theo: **Giai Đoạn 4: Fullstack AI Native & Cloud Architect**! \n\nBạn có thể nhấn nút "Thêm Mốc Này Vào Lộ Trình" ngay bên dưới để đưa mốc này vào hệ thống thanh mốc lộ trình của mình! 🚀`,
        proposedMilestone: milestone
      };
    }

    if (query.includes("mobile") || query.includes("responsive") || query.includes("tối ưu")) {
      return {
        text: `Để tối ưu theo tiêu chuẩn **Giai đoạn 3**, hãy luôn áp dụng **Mobile-First Approach** (viết CSS cho màn hình điện thoại trước) kết hợp với **Lazy Loading ảnh WebP** và kiểm tra độ tương phản màu chuẩn **WCAG A11y**! ✨`
      };
    }

    return {
      text: `Tôi là AI Advisor của bạn! Tôi có thể giúp bạn giải đáp các thắc mắc về **Tư duy UI/UX**, **Kỹ thuật Frontend (Tailwind/React)** và đặc biệt là **Đề Xuất Các Mốc Lộ Trình Tương Lai Mới** (Giai đoạn 4 AI Native Lead, Giai đoạn 5 Design System Master...). Bạn muốn tôi đề xuất mốc mới không? 😊`
    };
  }
}

