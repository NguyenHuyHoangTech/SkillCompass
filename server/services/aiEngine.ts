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
        question: "Explain Steve Krug's 'Don't Make Me Think' philosophy in UX design? Give an example of a button or login form that violates this principle.",
        hint: "Hint: Focus on reducing cognitive load, clarity, and aligning with user mental models.",
        keyConcepts: ["Cognitive Load", "UX Intuition", "Mental Model", "Simplicity"]
      },
      "Consistency": {
        question: "What benefits does Consistency in UI/UX design bring to users? Explain how you maintain button and typography consistency across a React project.",
        hint: "Hint: Mention Design Systems, UI Tokens, Reusable Components, and UI predictability.",
        keyConcepts: ["Design System", "UI Tokens", "Predictability", "Brand Uniformity"]
      },
      "Visual Hierarchy": {
        question: "What is Visual Hierarchy? How would you combine Size, Color, and Position to make a Call To Action (CTA) button draw immediate focus?",
        hint: "Hint: Apply contrast rules, focal points, and F-pattern / Z-pattern reading behaviors.",
        keyConcepts: ["Visual Hierarchy", "Focal Point", "Call To Action", "Contrast", "F-pattern"]
      },
      "Whitespace": {
        question: "Why is Whitespace (Negative Space) not 'wasted space'? How does whitespace improve readability and UI sophistication?",
        hint: "Hint: Whitespace provides visual breathing room, groups related elements (Proximity), and eliminates visual clutter.",
        keyConcepts: ["Negative Space", "Law of Proximity", "Readability", "Visual Breathing"]
      },
      "Tailwind CSS": {
        question: "How does Tailwind CSS's Utility-First approach enhance development speed and consistency compared to writing separate CSS/SCSS files?",
        hint: "Hint: Mention eliminating class naming overhead, centralized design tokens in tailwind.config, and JIT/Purge optimization.",
        keyConcepts: ["Utility-First", "No Custom Class Overheads", "JIT Compiler", "Consistent Spacing Scale"]
      },
      "Responsive": {
        question: "What is the core difference between Mobile-First and Desktop-First design mindsets? Why does modern web design favor Mobile-First?",
        hint: "Hint: Mobile-first forces prioritizing core content on small screens first, then expanding using min-width media queries for larger displays.",
        keyConcepts: ["Mobile-First", "Min-Width Queries", "Progressive Enhancement", "Touch Friendly"]
      },
      "Accessibility": {
        question: "How do you ensure your website meets Accessibility (A11y / WCAG) standards? Name 3 key factors regarding Semantic HTML, Keyboard Navigation, and Color Contrast.",
        hint: "Hint: Use semantic HTML tags (<main>, <nav>), aria-label attributes, keyboard tab/focus states, and a minimum 4.5:1 color contrast ratio.",
        keyConcepts: ["WCAG Standards", "Semantic HTML", "Keyboard Focus", "Color Contrast 4.5:1", "Screen Readers"]
      }
    };

    const key = Object.keys(questionDatabase).find((k) => subTopicTitle.toLowerCase().includes(k.toLowerCase()));
    const template = key ? questionDatabase[key] : {
      question: `Please explain the concept, importance, and practical application of "${subTopicTitle}" under the skill ${skillName}?`,
      hint: `Hint: Analyze core principles, UX benefits, and real-world examples.`,
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
        feedback: "Answer is too short. Please analyze the principles deeper and provide a real-world example.",
        strengths: "Provided an initial response.",
        improvements: "Should incorporate technical terminology (Visual Hierarchy, Accessibility, Responsiveness...).",
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
        ? `Excellent! You have mastered the mindset and practical techniques for "${subTopicTitle}".`
        : `Good job! You understand the core problem. Practice further with code examples or UI demos.`,
      strengths: `Demonstrates a solid mindset and terminology understanding (${matched.join(", ") || "good foundation"}).`,
      improvements: "Apply this directly to real-world interface design challenges.",
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
      readinessLabel: `${readinessScore}% Proficiency in ${milestone.roleName}`,
      summary: `You have completed ${completedSub}/${totalSub} professional standards under "${milestone.title}". Capability rating score is ${avgScore}/100.`,
      strengths: [
        "Understands intuitive UI/UX mindset and visual hierarchy principles",
        "Capable of applying modern tools and standardizing user experience"
      ],
      weaknesses: [
        `Need to complete remaining practical items that are not yet 100% in this stage`
      ],
      actionItems: [
        "Practice AI Quizzes for remaining topics",
        "Apply Mobile-First standard and test WCAG color contrast",
        "Optimize app performance using Lazy Loading & WebP"
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
    if (query.includes("stage 4") || query.includes("phase 4") || query.includes("ai native") || query.includes("cloud") || (query.includes("milestone") && query.includes("ai"))) {
      const milestone: Milestone = {
        id: `ms-future-ai-${Date.now()}`,
        title: "Stage 4: Fullstack AI Native & Cloud Architect",
        roleName: "AI Native Fullstack Lead",
        description: "AI-proposed future milestone: Integrating AI LLM Engines (Gemini/OpenAI), Vector Databases, RAG Systems, and AWS Serverless/Docker Cloud Computing.",
        badge: "🤖 AI Cloud Master",
        overallProgress: 0,
        categories: [
          {
            id: "cat-ai-integration",
            name: "4.1. AI Model Integration & Vector DB",
            description: "Building smart AI Native products",
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
                    description: "Designing optimal prompts for AI to return structured data",
                    isCompleted: false,
                    assessmentScore: 0
                  },
                  {
                    id: "sub-vector-db",
                    title: "Vector Database & Embeddings (Pinecone / Chroma)",
                    description: "Building enterprise RAG semantic search systems",
                    isCompleted: false,
                    assessmentScore: 0
                  }
                ]
              }
            ]
          },
          {
            id: "cat-cloud-devops",
            name: "4.2. Containerization & Cloud DevOps",
            description: "Automating cloud infrastructure deployment",
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
                    description: "Packaging fullstack applications into complete Docker Containers",
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
        text: `Based on current IT market trends, I suggest expanding your roadmap to **Stage 4: Fullstack AI Native & Cloud Architect** (integrating Gemini AI Engine, Vector Databases & Docker AWS Cloud). \n\nWould you like to automatically add this milestone to your Roadmap right now? 👇`,
        proposedMilestone: milestone
      };
    }

    // Proposed Milestone 5: UI/UX Design System Lead & Micro-frontends
    if (query.includes("stage 5") || query.includes("phase 5") || query.includes("design system") || query.includes("micro-frontend")) {
      const milestone: Milestone = {
        id: `ms-future-ds-${Date.now()}`,
        title: "Stage 5: Design System Architect & Micro-frontends",
        roleName: "Design System & Micro-frontend Lead",
        description: "AI-proposed future milestone: Standardizing UI Tokens, Storybook Design System, and Module Federation Micro-frontends architecture.",
        badge: "🎨 Design System Lead",
        overallProgress: 0,
        categories: [
          {
            id: "cat-design-system",
            name: "5.1. Enterprise Design System & Tokens",
            description: "Building large-scale reusable UI component libraries",
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
                  },
                  {
                    id: "sub-storybook-docs",
                    title: "Storybook Component Documentation & Testing",
                    description: "Automating component testing and documentation",
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
        text: `I propose expanding to **Stage 5: Design System Architect & Micro-frontends** (Managing Design Tokens, Storybook UI Library, and modularizing into Micro-frontends). \n\nClick the button below to add this stage to your Roadmap! 👇`,
        proposedMilestone: milestone
      };
    }

    // General request -> Default to Next Level Milestone
    if (query.includes("stage") || query.includes("roadmap") || query.includes("add milestone") || query.includes("new milestone") || query.includes("future") || query.includes("suggest")) {
      const milestone: Milestone = {
        id: `ms-future-techlead-${Date.now()}`,
        title: "Stage 4: Fullstack AI Native & Cloud Architect",
        roleName: "AI Native Fullstack Lead",
        description: "AI-proposed future milestone: Integrating AI LLM Engines (Gemini/OpenAI), Vector Databases, RAG Systems, and AWS Serverless/Docker Cloud Computing.",
        badge: "🤖 AI Cloud Master",
        overallProgress: 0,
        categories: [
          {
            id: "cat-ai-integration",
            name: "4.1. AI Model Integration & Vector DB",
            description: "Building smart AI Native products",
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
                    description: "Designing optimal prompts for AI to return structured data",
                    isCompleted: false,
                    assessmentScore: 0
                  },
                  {
                    id: "sub-vector-db",
                    title: "Vector Database & Embeddings (Pinecone / Chroma)",
                    description: "Building enterprise RAG semantic search systems",
                    isCompleted: false,
                    assessmentScore: 0
                  }
                ]
              }
            ]
          },
          {
            id: "cat-cloud-devops",
            name: "4.2. Containerization & Cloud DevOps",
            description: "Automating cloud infrastructure deployment",
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
                    description: "Packaging fullstack applications into complete Docker Containers",
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
        text: `Based on your excellent progress in **${currentMilestoneTitle}**, I propose the next milestone: **Stage 4: Fullstack AI Native & Cloud Architect**! \n\nYou can click the "Add This Stage To Roadmap" button below to add it to your roadmap timeline! 🚀`,
        proposedMilestone: milestone
      };
    }

    if (query.includes("mobile") || query.includes("responsive") || query.includes("optimize")) {
      return {
        text: `To optimize according to **Stage 3** standards, always apply a **Mobile-First Approach** (styling for mobile screens first) combined with **WebP Image Lazy Loading** and color contrast testing for **WCAG A11y**! ✨`
      };
    }

    return {
      text: `I am your AI Advisor! I can help answer questions on **UI/UX Mindset**, **Frontend Tech (Tailwind/React)**, and **Propose New Future Roadmap Stages** (Stage 4 AI Native Lead, Stage 5 Design System Master...). Would you like me to propose a new stage? 😊`
    };
  }
}

