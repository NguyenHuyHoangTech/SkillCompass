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
        question: "Explain Steve Krug's 'Don't Make Me Think' philosophy in UX design. Give an example of a button or login form that violates this principle.",
        hint: "Hint: Focus on reducing cognitive load, clarity, and familiar user mental models.",
        keyConcepts: ["Cognitive Load", "UX Intuition", "Mental Model", "Simplicity"]
      },
      "Consistency": {
        question: "How does consistency in UI/UX design benefit users? Explain how you maintain consistent buttons and typography across a React project.",
        hint: "Hint: Discuss design systems, UI tokens, reusable components, and interface predictability.",
        keyConcepts: ["Design System", "UI Tokens", "Predictability", "Brand Uniformity"]
      },
      "Visual Hierarchy": {
        question: "What is visual hierarchy? How would you combine size, color, and position to make a call-to-action button attract attention first?",
        hint: "Hint: Apply contrast, focal points, and F-pattern or Z-pattern reading behavior.",
        keyConcepts: ["Visual Hierarchy", "Focal Point", "Call To Action", "Contrast", "F-pattern"]
      },
      "Whitespace": {
        question: "Why is whitespace not wasted space? How does it improve readability and the visual quality of a UI?",
        hint: "Hint: Whitespace gives the eye room to breathe, groups related elements through proximity, and reduces clutter.",
        keyConcepts: ["Negative Space", "Law of Proximity", "Readability", "Visual Breathing"]
      },
      "Tailwind CSS": {
        question: "How does Tailwind CSS's utility-first approach improve development speed and consistency compared with separate CSS/SCSS files?",
        hint: "Hint: Discuss avoiding unnecessary class names, centralizing design tokens in tailwind.config, and optimizing CSS with Purge/JIT.",
        keyConcepts: ["Utility-First", "No Custom Class Overheads", "JIT Compiler", "Consistent Spacing Scale"]
      },
      "Responsive": {
        question: "What is the core difference between mobile-first and desktop-first design? Why do modern products often prioritize mobile-first?",
        hint: "Hint: Mobile-first starts with essential content on small screens, then uses min-width media queries to expand for larger screens.",
        keyConcepts: ["Mobile-First", "Min-Width Queries", "Progressive Enhancement", "Touch Friendly"]
      },
      "Accessibility": {
        question: "How do you ensure a website meets accessibility standards (A11y/WCAG)? Name three important factors involving semantic HTML, keyboard navigation, and color contrast.",
        hint: "Hint: Use semantic HTML tags, aria-label attributes, keyboard focus states, and a minimum 4.5:1 contrast ratio.",
        keyConcepts: ["WCAG Standards", "Semantic HTML", "Keyboard Focus", "Color Contrast 4.5:1", "Screen Readers"]
      }
    };

    const key = Object.keys(questionDatabase).find((k) => subTopicTitle.toLowerCase().includes(k.toLowerCase()));
    const template = key ? questionDatabase[key] : {
      question: `Explain the concept, importance, and practical application of "${subTopicTitle}" within the skill ${skillName}?`,
      hint: `Hint: Analyze the core theory, its UX benefits, and an illustrative example.`,
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
        feedback: "The answer is too short. Analyze the principle in more depth and provide a real-world example.",
        strengths: "Provided an initial response.",
        improvements: "Add relevant technical terms such as visual hierarchy, accessibility, and responsiveness.",
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
        ? `Excellent! You have mastered the reasoning and practical techniques for "${subTopicTitle}".`
        : `Good! You understand the core issue. Practice with more code examples or interface demos.`,
      strengths: `Shows sound reasoning and knowledge of relevant terminology (${matched.join(", ") || "strong fundamentals"}).`,
      improvements: "Apply this knowledge to real-world interface design problems.",
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
      readinessLabel: `${readinessScore}% proficient in ${milestone.roleName}`,
      summary: `You have completed ${completedSub}/${totalSub} professional criteria in "${milestone.title}". The competency assessment score is ${avgScore}/100.`,
      strengths: [
        "Understands visual UI/UX reasoning and visual hierarchy principles",
        "Can apply modern tools and standardize the user experience"
      ],
      weaknesses: [
        `Complete the remaining practice items in this milestone`
      ],
      actionItems: [
        "Practice the AI quizzes for the remaining items",
        "Apply mobile-first standards and verify WCAG color contrast",
        "Optimize application performance with lazy loading and WebP"
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
    if (query.includes("stage 4") || query.includes("ai native") || query.includes("cloud") || (query.includes("milestone") && query.includes("ai"))) {
      const milestone: Milestone = {
        id: `ms-future-ai-${Date.now()}`,
        title: "Stage 4: Fullstack AI Native & Cloud Architect",
        roleName: "AI Native Fullstack Lead",
        description: "AI-suggested future milestone: Integrate AI LLM engines (Gemini/OpenAI), vector databases, RAG systems, and AWS serverless or Docker cloud infrastructure.",
        badge: "🤖 AI Cloud Master",
        overallProgress: 0,
        categories: [
          {
            id: "cat-ai-integration",
            name: "4.1. AI Model & Vector DB Integration",
            description: "Build intelligent AI-native applications",
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
                    description: "Design robust prompts that make AI return structured data",
                    isCompleted: false,
                    assessmentScore: 0
                  },
                  {
                    id: "sub-vector-db",
                    title: "Vector Database & Embeddings (Pinecone / Chroma)",
                    description: "Build an enterprise semantic retrieval system with RAG",
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
            description: "Automate cloud infrastructure deployment",
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
                    description: "Package the full-stack application in a Docker container",
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
        text: `Based on current IT hiring trends, I suggest extending your roadmap to **Stage 4: Fullstack AI Native & Cloud Architect** (integrating Gemini AI, vector databases, Docker, and AWS cloud services). \n\nWould you like to add this milestone to your roadmap now? 👇`,
        proposedMilestone: milestone
      };
    }

    // Proposed Milestone 5: UI/UX Design System Lead & Micro-frontends
    if (query.includes("stage 5") || query.includes("design system") || query.includes("micro-frontend")) {
      const milestone: Milestone = {
        id: `ms-future-ds-${Date.now()}`,
        title: "Stage 5: Design System Architect & Micro-frontends",
        roleName: "Design System & Micro-frontend Lead",
        description: "AI-suggested future milestone: Standardize UI tokens, an enterprise Storybook design system, and a Module Federation micro-frontends architecture.",
        badge: "🎨 Design System Lead",
        overallProgress: 0,
        categories: [
          {
            id: "cat-design-system",
            name: "5.1. Enterprise Design System & Tokens",
            description: "Build a large-scale reusable UI library",
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
                    description: "Synchronize design tokens between Figma and the React codebase",
                    isCompleted: false,
                    assessmentScore: 0
                  },
                  {
                    id: "sub-storybook-docs",
                    title: "Storybook Component Documentation & Testing",
                    description: "Automate testing and document UI components",
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
        text: `I suggest expanding into **Stage 5: Design System Architect & Micro-frontends** (managing design tokens, a Storybook UI library, and splitting the system into micro-frontends). \n\nUse the button below to add this milestone to your roadmap. 👇`,
        proposedMilestone: milestone
      };
    }

    // General "Add milestone" request -> Default to Next Level Milestone
    if (query.includes("stage") || query.includes("roadmap") || query.includes("add milestone") || query.includes("new milestone") || query.includes("future") || query.includes("suggest milestone")) {
      const milestone: Milestone = {
        id: `ms-future-techlead-${Date.now()}`,
        title: "Stage 4: Fullstack AI Native & Cloud Architect",
        roleName: "AI Native Fullstack Lead",
        description: "AI-suggested future milestone: Integrate AI LLM engines (Gemini/OpenAI), vector databases, RAG systems, and AWS serverless or Docker cloud infrastructure.",
        badge: "🤖 AI Cloud Master",
        overallProgress: 0,
        categories: [
          {
            id: "cat-ai-integration",
            name: "4.1. AI Model & Vector DB Integration",
            description: "Build intelligent AI-native applications",
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
                    description: "Design robust prompts that make AI return structured data",
                    isCompleted: false,
                    assessmentScore: 0
                  },
                  {
                    id: "sub-vector-db",
                    title: "Vector Database & Embeddings (Pinecone / Chroma)",
                    description: "Build an enterprise semantic retrieval system with RAG",
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
            description: "Automate cloud infrastructure deployment",
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
                    description: "Package the full-stack application in a Docker container",
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
        text: `Based on your strong progress in **${currentMilestoneTitle}**, I suggest the next future milestone: **Stage 4: Fullstack AI Native & Cloud Architect**! \n\nUse the "Add This Milestone to the Roadmap" button below to add it to your roadmap. 🚀`,
        proposedMilestone: milestone
      };
    }

    if (query.includes("mobile") || query.includes("responsive") || query.includes("optimize")) {
      return {
        text: `To optimize for **Stage 3**, always apply **Mobile-First Approach** (write CSS for phone screens first) combined with **lazy-loading WebP images** and verify color contrast against **WCAG A11y**! ✨`
      };
    }

    return {
      text: `I am your AI advisor. I can answer questions about **UI/UX reasoning**, **frontend engineering (Tailwind/React)** and especially **suggesting new future roadmap milestones** (Stage 4 AI Native Lead, Stage 5 Design System Master...). Would you like me to suggest a new milestone? 😊`
    };
  }
}

