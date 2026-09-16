import type { UserRoadmap } from '../types/roadmap';

export const initialMockRoadmap: UserRoadmap = {
  id: "user-roadmap-uiux-frontend",
  userId: "usr-1001",
  userName: "Alex Morgan",
  targetRole: "UI/UX & Frontend Engineer",
  currentMilestoneId: "ms-stage-1",
  updatedAt: new Date().toISOString(),
  milestones: [
    {
      id: "ms-stage-1",
      title: "Stage 1: Core Fundamentals (UI/UX Mindset)",
      roleName: "UI/UX & Frontend Mindset",
      description: "Master User Experience (UX) principles and visual layout fundamentals before writing your first line of code.",
      badge: "🎨 UI/UX Mindset",
      overallProgress: 75,
      categories: [
        {
          id: "cat-ux-fundamentals",
          name: "1.1. Understanding UX Fundamentals",
          description: "User-centric design methodology and cognitive ergonomics",
          skills: [
            {
              id: "sk-ux-principles",
              name: "UX Principles & Intuitive Design",
              icon: "Code",
              levelPercentage: 85,
              subTopics: [
                {
                  id: "sub-dont-make-me-think",
                  title: "Don't Make Me Think Principle",
                  description: "Create clear, intuitive interfaces where users instantly recognize the next action without hesitation.",
                  isCompleted: true,
                  assessmentScore: 90,
                  aiFeedback: "Excellent explanation of reducing user cognitive load in interface design."
                },
                {
                  id: "sub-ux-consistency",
                  title: "System Consistency & Tokens",
                  description: "Maintain uniform buttons, typography, colors, and spatial scale across the entire product.",
                  isCompleted: true,
                  assessmentScore: 80,
                  aiFeedback: "Solid grasp of synchronized Design Systems and design tokens."
                }
              ]
            }
          ]
        },
        {
          id: "cat-ui-principles",
          name: "1.2. Visual UI Principles",
          description: "Visual hierarchy, whitespace balance, and contrast control",
          skills: [
            {
              id: "sk-visual-hierarchy",
              name: "Visual Hierarchy & Layout Balance",
              icon: "Atom",
              levelPercentage: 70,
              subTopics: [
                {
                  id: "sub-visual-hierarchy-topic",
                  title: "Visual Hierarchy Control",
                  description: "Use scale, weight, and color positioning to guide user attention directly to key call-to-actions.",
                  isCompleted: true,
                  assessmentScore: 85,
                  aiFeedback: "Clear distinction demonstrated between Primary CTAs and Secondary actions."
                },
                {
                  id: "sub-whitespace-balance",
                  title: "Whitespace & Layout Breathing Room",
                  description: "Leverage negative space to produce clean, elegant, and focus-driven interfaces.",
                  isCompleted: true,
                  assessmentScore: 75
                },
                {
                  id: "sub-scale-contrast",
                  title: "Scale & Contrast Precision",
                  description: "Establish strong visual contrast to prevent monotony and enhance readability.",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        }
      ],
      overallAiEvaluation: {
        score: 85,
        readinessLabel: "85% AI Assessment: UI/UX & Frontend Mindset",
        summary: "AI consolidated assessment: Practical capability score reached 85% based on Don't Make Me Think (90 score) and Consistency (80 score).",
        strengths: [
          "Strong intuitive UI/UX mindset and visual hierarchy mastery",
          "Capable of applying modern design tools and user experience standards"
        ],
        weaknesses: [
          "Complete the AI Quiz for Scale & Contrast Precision to elevate overall score"
        ],
        actionItems: [
          "Take the AI Quiz test for Scale & Contrast Precision",
          "Apply Mobile-First principles and check WCAG color contrast standards",
          "Optimize application load performance using Lazy Loading & WebP format"
        ],
        evaluatedAt: new Date().toISOString()
      }
    },
    {
      id: "ms-stage-2",
      title: "Stage 2: Technical Excellence & Architecture",
      roleName: "Frontend Technical Specialist",
      description: "Implement design mindsets using CSS/SASS, Tailwind CSS, React Components, Framer Motion & Asset Optimization.",
      badge: "⚡ Technical Master",
      overallProgress: 60,
      categories: [
        {
          id: "cat-css-sass-mastery",
          name: "2.1. CSS, SASS & Layout Mastery",
          description: "Advanced layout mechanics and strict Box Model control",
          skills: [
            {
              id: "sk-flexbox-grid",
              name: "Flexbox, CSS Grid & SASS",
              icon: "FileCode",
              levelPercentage: 80,
              subTopics: [
                {
                  id: "sub-flexbox-grid-mastery",
                  title: "Advanced Flexbox & CSS Grid",
                  description: "Build 1D & 2D responsive layouts with precision and adaptability.",
                  isCompleted: true,
                  assessmentScore: 90,
                  aiFeedback: "Proficient in grid-template-areas and flex layout alignments."
                },
                {
                  id: "sub-sass-mixins",
                  title: "SASS/SCSS Mixins & Design Tokens",
                  description: "Write clean, modular CSS using variables, mixins, and nested architecture.",
                  isCompleted: true,
                  assessmentScore: 80
                },
                {
                  id: "sub-box-model-spacing",
                  title: "Box Model & Spacing Scale",
                  description: "Maintain absolute control over margins, padding, border-box, and sizing calculations.",
                  isCompleted: true,
                  assessmentScore: 70
                }
              ]
            }
          ]
        },
        {
          id: "cat-frameworks-libs",
          name: "2.2. Modern Frameworks & Component Systems",
          description: "Tailwind CSS Utility Systems & Reusable React Architecture",
          skills: [
            {
              id: "sk-react-tailwind",
              name: "Tailwind CSS & React Components",
              icon: "Zap",
              levelPercentage: 65,
              subTopics: [
                {
                  id: "sub-tailwind-utility",
                  title: "Utility-First Tailwind CSS",
                  description: "Rapidly craft custom interfaces within JSX using utility classes and theme configuration.",
                  isCompleted: true,
                  assessmentScore: 85,
                  aiFeedback: "Good application of class utilities and custom theme extensions."
                },
                {
                  id: "sub-react-component-reuse",
                  title: "React Component Reusability & State",
                  description: "Encapsulate reusable UI components and manage fluid local state.",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        },
        {
          id: "cat-animation-typography",
          name: "2.3. Micro-interactions & Media Optimization",
          description: "Fluid micro-animations and lightweight media assets",
          skills: [
            {
              id: "sk-animations-media",
              name: "Micro-interactions & WebP/Fonts",
              icon: "Server",
              levelPercentage: 50,
              subTopics: [
                {
                  id: "sub-animations-hover",
                  title: "Framer Motion & Micro-interactions",
                  description: "Add subtle hover effects, page transitions, and loading skeletons.",
                  isCompleted: true,
                  assessmentScore: 75
                },
                {
                  id: "sub-media-font-opt",
                  title: "WebP Asset Compression & Google Fonts",
                  description: "Serve crisp WebP imagery with optimized CDN loading and brand typography.",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "ms-stage-3",
      title: "Stage 3: Performance, A11y & Best Practices",
      roleName: "Senior Frontend Engineer",
      description: "Deliver lightning-fast page speed, seamless cross-browser compatibility, and WCAG accessibility standards.",
      badge: "🚀 Best Practices Pro",
      overallProgress: 40,
      categories: [
        {
          id: "cat-mobile-perf",
          name: "3.1. Mobile-First & Performance Tuning",
          description: "Flawless mobile experiences and maximum page load speeds",
          skills: [
            {
              id: "sk-mobile-performance",
              name: "Mobile-First & Performance Tuning",
              icon: "Database",
              levelPercentage: 45,
              subTopics: [
                {
                  id: "sub-mobile-first-approach",
                  title: "Mobile-First Responsive Design",
                  description: "Design for mobile screens first, then progressively enhance for Tablet and Desktop.",
                  isCompleted: true,
                  assessmentScore: 80
                },
                {
                  id: "sub-perf-lazy-load",
                  title: "Lazy Loading & Code Splitting",
                  description: "Load images and heavy modules on-demand with dynamic imports.",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        },
        {
          id: "cat-browser-a11y",
          name: "3.2. Cross-Browser & Web Accessibility (A11y)",
          description: "Browser compatibility and accessible UI for all users",
          skills: [
            {
              id: "sk-browser-a11y",
              name: "Cross-Browser & Web Accessibility",
              icon: "Cpu",
              levelPercentage: 35,
              subTopics: [
                {
                  id: "sub-cross-browser",
                  title: "Cross-Browser Compatibility Testing",
                  description: "Ensure pixel-perfect rendering across Chrome, Safari, Firefox, Edge, iOS & Android.",
                  isCompleted: false,
                  assessmentScore: 0
                },
                {
                  id: "sub-web-a11y",
                  title: "WCAG Accessibility & Semantic HTML",
                  description: "Build keyboard navigable interfaces with ARIA roles and contrast compliance.",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "ms-stage-4",
      title: "Stage 4: AI Native Systems & Design Scaling",
      roleName: "Lead UI/UX Engineer",
      description: "Integrate Generative AI models into web applications, Figma design tokens, and enterprise Storybook design systems.",
      badge: "🤖 AI & Design System",
      overallProgress: 25,
      categories: [
        {
          id: "cat-ai-design-system",
          name: "4.1. Design Systems & Storybook Engine",
          description: "Standardize enterprise design tokens and component libraries",
          skills: [
            {
              id: "sk-storybook-tokens",
              name: "Storybook & Design Tokens",
              icon: "Sparkles",
              levelPercentage: 30,
              subTopics: [
                {
                  id: "sub-storybook-docs",
                  title: "Storybook Component Documentation",
                  description: "Package UI components and publish interactive design documentation for dev teams.",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "ms-stage-5",
      title: "Stage 5: Micro-Frontend Architecture & State",
      roleName: "Principal Frontend Architect",
      description: "Architect large-scale web applications using Module Federation, global state orchestration, and GraphQL/REST APIs.",
      badge: "🏗️ System Architect",
      overallProgress: 10,
      categories: [
        {
          id: "cat-micro-frontend",
          name: "5.1. Micro-Frontends & GraphQL",
          description: "Decouple monolithic frontends into independently deployable modules",
          skills: [
            {
              id: "sk-micro-fe",
              name: "Module Federation & GraphQL",
              icon: "Layers",
              levelPercentage: 15,
              subTopics: [
                {
                  id: "sub-module-federation",
                  title: "Webpack Module Federation",
                  description: "Partition application code and deploy micro-apps independently.",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "ms-stage-6",
      title: "Stage 6: Product Leadership & Tech Strategy",
      roleName: "Head of Product & Engineering",
      description: "Lead engineering teams, mentor developers, establish technology roadmaps, and align tech with business strategy.",
      badge: "👑 Tech Leader",
      overallProgress: 0,
      categories: [
        {
          id: "cat-tech-leadership",
          name: "6.1. Tech Leadership & Product Strategy",
          description: "Technical team leadership and long-term tech strategy",
          skills: [
            {
              id: "sk-leadership",
              name: "Tech Strategy & Mentorship",
              icon: "Award",
              levelPercentage: 0,
              subTopics: [
                {
                  id: "sub-tech-strategy",
                  title: "Architecture Roadmap Planning",
                  description: "Plan 3-5 year technology architecture roadmaps for global enterprise products.",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
