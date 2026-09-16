import type { UserRoadmap } from '../types/roadmap';

export const initialMockRoadmap: UserRoadmap = {
  "id": "user-roadmap-uiux-frontend",
  "userId": "usr-1001",
  "userName": "John Doe",
  "targetRole": "UI/UX & Frontend Engineer",
  "currentMilestoneId": "ms-stage-1",
  "updatedAt": "2026-09-16T16:25:55.625Z",
  "milestones": [
    {
      "id": "ms-stage-1",
      "title": "Stage 1: Foundational Mindset (UI/UX Mindset)",
      "roleName": "UI/UX & Frontend Mindset",
      "description": "Master the mindset of user experience (UX) design and basic visual interface (UI) principles before writing the first line of code.",
      "badge": "🎨 UI/UX Mindset",
      "overallProgress": 100,
      "categories": [
        {
          "id": "cat-ux-fundamentals",
          "name": "1.1. Understanding UX (User Experience)",
          "description": "User-centric mindset",
          "skills": [
            {
              "id": "sk-ux-principles",
              "name": "UX Principles & Visuals",
              "icon": "Code",
              "levelPercentage": 67,
              "subTopics": [
                {
                  "id": "sub-dont-make-me-think",
                  "title": "Don't Make Me Think Principle",
                  "description": "Clear, intuitive interfaces where users know the next action without hesitation",
                  "isCompleted": true,
                  "assessmentScore": 90,
                  "aiFeedback": "Good explanation of reducing cognitive load for users."
                },
                {
                  "id": "sub-ux-consistency",
                  "title": "Consistency",
                  "description": "Unified buttons, typography, colors, and spacing across the system",
                  "isCompleted": true,
                  "assessmentScore": 80,
                  "aiFeedback": "Strong grasp of Design System and token synchronization."
                },
                {
                  "id": "sub-auto-sk-ux-principles-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về UX Principles & Visuals",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        },
        {
          "id": "cat-ui-principles",
          "name": "1.2. Fundamental Visual UI Principles",
          "description": "Visual hierarchy, whitespace, and contrast",
          "skills": [
            {
              "id": "sk-visual-hierarchy",
              "name": "Visual Hierarchy & Layout Balance",
              "icon": "Atom",
              "levelPercentage": 99,
              "subTopics": [
                {
                  "id": "sub-visual-hierarchy-topic",
                  "title": "Visual Hierarchy",
                  "description": "Using size, color, and positioning to direct user attention to crucial information (e.g., Call To Action buttons)",
                  "isCompleted": true,
                  "assessmentScore": 85,
                  "aiFeedback": "Clear analysis of the difference between Primary and Secondary Buttons."
                },
                {
                  "id": "sub-whitespace-balance",
                  "title": "Balance & Whitespace",
                  "description": "Utilizing empty space to make the interface breathe, look premium, and focus on main content",
                  "isCompleted": true,
                  "assessmentScore": 75
                },
                {
                  "id": "sub-scale-contrast",
                  "title": "Scale & Contrast",
                  "description": "Creating distinct contrast between elements to avoid monotony and enhance visual clarity",
                  "isCompleted": true,
                  "assessmentScore": 90
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Visual Hierarchy & Layout Balance",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-1-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 33,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-1-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": true,
                  "assessmentScore": 85
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-1-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-1-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-1-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 33,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-1-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": true,
                  "assessmentScore": 80
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-1-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-1-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-1-1",
              "name": "Dynamic Skill 5",
              "icon": "Hexagon",
              "levelPercentage": 33,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-1-1",
                  "title": "Advanced Practice 5",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": true,
                  "assessmentScore": 80
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-1-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 5",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-1-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 5",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ],
      "overallAiEvaluation": {
        "score": 85,
        "readinessLabel": "85% AI Evaluated UI/UX & Frontend Mindset Readiness",
        "summary": "AI has synthesized the test results: Practical capability score reached 85% based on the Don't Make Me Think (90 pts) and Consistency (80 pts) tests.",
        "strengths": [
          "Understands intuitive UI/UX mindset and visual hierarchy principles",
          "Capable of applying modern tools and standardizing user experience"
        ],
        "weaknesses": [
          "Should complete the AI quiz for Scale & Contrast to improve the overall AI score"
        ],
        "actionItems": [
          "Practice the AI Quiz for Scale & Contrast",
          "Apply Mobile-First standards and check WCAG color contrast",
          "Optimize app performance using Lazy Loading & WebP"
        ],
        "evaluatedAt": "2026-09-16T16:25:55.625Z"
      }
    },
    {
      "id": "ms-stage-2",
      "title": "Stage 2: Technical Excellence & Tools",
      "roleName": "Frontend Technical Specialist",
      "description": "Turn concepts into reality by mastering CSS/SASS, Tailwind CSS, React Components, Animation & Media Optimization.",
      "badge": "⚡ Technical Master",
      "overallProgress": 100,
      "categories": [
        {
          "id": "cat-css-sass-mastery",
          "name": "2.1. Mastering CSS, SASS & Layout",
          "description": "Advanced layouts and Box Model control",
          "skills": [
            {
              "id": "sk-flexbox-grid",
              "name": "Flexbox, CSS Grid & SASS",
              "icon": "FileCode",
              "levelPercentage": 99,
              "subTopics": [
                {
                  "id": "sub-flexbox-grid-mastery",
                  "title": "In-depth Flexbox & CSS Grid",
                  "description": "Building precise and flexible 1D & 2D responsive layouts",
                  "isCompleted": true,
                  "assessmentScore": 90,
                  "aiFeedback": "Proficient with grid-template-areas and flex alignment."
                },
                {
                  "id": "sub-sass-mixins",
                  "title": "SASS/SCSS Variables & Mixins",
                  "description": "Writing clean CSS structures, effectively using variables, mixins, and nesting",
                  "isCompleted": true,
                  "assessmentScore": 80
                },
                {
                  "id": "sub-box-model-spacing",
                  "title": "Box Model & Spacing Precision",
                  "description": "Absolute control over margin, padding, border-box, and element sizing",
                  "isCompleted": true,
                  "assessmentScore": 70
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Flexbox, CSS Grid & SASS",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        },
        {
          "id": "cat-frameworks-libs",
          "name": "2.2. Modern Frameworks & Components",
          "description": "Tailwind CSS & React Reusable Architecture",
          "skills": [
            {
              "id": "sk-react-tailwind",
              "name": "Tailwind CSS & React Components",
              "icon": "Zap",
              "levelPercentage": 67,
              "subTopics": [
                {
                  "id": "sub-tailwind-utility",
                  "title": "Tailwind CSS Utility-First",
                  "description": "Rapidly building UI directly in JSX with consistent and customizable code",
                  "isCompleted": true,
                  "assessmentScore": 85,
                  "aiFeedback": "Good application of utility classes and custom theme configuration."
                },
                {
                  "id": "sub-react-component-reuse",
                  "title": "React Component Reusability & State",
                  "description": "Extracting reusable UI components and managing state smoothly",
                  "isCompleted": true,
                  "assessmentScore": 90
                },
                {
                  "id": "sub-auto-sk-react-tailwind-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Tailwind CSS & React Components",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        },
        {
          "id": "cat-animation-typography",
          "name": "2.3 & 2.4. Animation, Micro-interactions & Media",
          "description": "Smooth effects and resource optimization",
          "skills": [
            {
              "id": "sk-animations-media",
              "name": "Micro-interactions & Fonts/WebP",
              "icon": "Server",
              "levelPercentage": 67,
              "subTopics": [
                {
                  "id": "sub-animations-hover",
                  "title": "Animation & Micro-interactions (Framer Motion / CSS)",
                  "description": "Creating subtle hover effects, smooth page transitions, and refined loading states",
                  "isCompleted": true,
                  "assessmentScore": 75
                },
                {
                  "id": "sub-media-font-opt",
                  "title": "Media Optimization (WebP/CDN) & Google Fonts",
                  "description": "Using lightweight, sharp WebP images and integrating a maximum of 2-3 brand fonts",
                  "isCompleted": true,
                  "assessmentScore": 90
                },
                {
                  "id": "sub-auto-sk-animations-media-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Micro-interactions & Fonts/WebP",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-3",
      "title": "Stage 3: Processes & Best Practices",
      "roleName": "Senior Frontend Engineer",
      "description": "Ensure the application runs smoothly on all devices (Mobile-first), loads instantly, is cross-browser compatible, and meets Accessibility standards.",
      "badge": "🚀 Best Practices Pro",
      "overallProgress": 100,
      "categories": [
        {
          "id": "cat-mobile-perf",
          "name": "3.1 & 3.2. Responsive Mobile-First & Performance Tuning",
          "description": "Smooth experience and maximum page load speed",
          "skills": [
            {
              "id": "sk-mobile-performance",
              "name": "Mobile-First & Performance Tuning",
              "icon": "Database",
              "levelPercentage": 67,
              "subTopics": [
                {
                  "id": "sub-mobile-first-approach",
                  "title": "Responsive Design (Mobile-First)",
                  "description": "Building for mobile first, then scaling up for Tablet/Desktop",
                  "isCompleted": true,
                  "assessmentScore": 80
                },
                {
                  "id": "sub-perf-lazy-load",
                  "title": "Lazy Loading & Code Splitting",
                  "description": "Loading images/components only when scrolled into view and compressing assets via CDN",
                  "isCompleted": true,
                  "assessmentScore": 90
                },
                {
                  "id": "sub-auto-sk-mobile-performance-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Mobile-First & Performance Tuning",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        },
        {
          "id": "cat-browser-a11y",
          "name": "3.3 & 3.4. Cross-Browser & Accessibility (A11y)",
          "description": "Browser compatibility and accessibility for all users",
          "skills": [
            {
              "id": "sk-browser-a11y",
              "name": "Cross-Browser & Web Accessibility",
              "icon": "Cpu",
              "levelPercentage": 67,
              "subTopics": [
                {
                  "id": "sub-cross-browser",
                  "title": "Cross-Browser Compatibility",
                  "description": "Flawless rendering on Chrome, Safari, Firefox, Edge, iOS & Android",
                  "isCompleted": true,
                  "assessmentScore": 90
                },
                {
                  "id": "sub-web-a11y",
                  "title": "Accessibility (A11y) & Semantic HTML",
                  "description": "Semantic HTML, keyboard navigation support, and WCAG-compliant color contrast",
                  "isCompleted": true,
                  "assessmentScore": 90
                },
                {
                  "id": "sub-auto-sk-browser-a11y-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Cross-Browser & Web Accessibility",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-3-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 33,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-3-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": true,
                  "assessmentScore": 85
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-3-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-3-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-3-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 33,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-3-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": true,
                  "assessmentScore": 80
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-3-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-3-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-4",
      "title": "Stage 4: AI Tools & Design System Scaling",
      "roleName": "Lead UI/UX Engineer",
      "description": "Applying AI in design, mastering Figma Tokens, Storybook, and enterprise-scale Design Systems.",
      "badge": "🤖 AI & Design System",
      "overallProgress": 25,
      "categories": [
        {
          "id": "cat-ai-design-system",
          "name": "4.1. Design System & Storybook",
          "description": "Standardizing enterprise design systems",
          "skills": [
            {
              "id": "sk-storybook-tokens",
              "name": "Storybook & Design Tokens",
              "icon": "Sparkles",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-storybook-docs",
                  "title": "Building Storybook Library",
                  "description": "Packaging UI Components and writing documentation for the dev team",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-storybook-tokens-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Storybook & Design Tokens",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-storybook-tokens-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Storybook & Design Tokens",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-4-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-4-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-4-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-4-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-4-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-4-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-4-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-4-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-4-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-4-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-4-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-4-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-4-1",
              "name": "Dynamic Skill 5",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-4-1",
                  "title": "Advanced Practice 5",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-4-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 5",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-4-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 5",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-4-2",
              "name": "Dynamic Skill 6",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-4-2",
                  "title": "Advanced Practice 6",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-4-2-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 6",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-4-2-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 6",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-5",
      "title": "Stage 5: Micro-Frontend Architecture & State",
      "roleName": "Principal Frontend Architect",
      "description": "Designing large-scale application architecture, centralized State Management, and integrating GraphQL/REST APIs.",
      "badge": "🏗️ System Architect",
      "overallProgress": 10,
      "categories": [
        {
          "id": "cat-micro-frontend",
          "name": "5.1. Micro-Frontend & GraphQL",
          "description": "Splitting large applications into independent modules",
          "skills": [
            {
              "id": "sk-micro-fe",
              "name": "Module Federation & GraphQL",
              "icon": "Layers",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-module-federation",
                  "title": "Webpack Module Federation",
                  "description": "Decoupling the application to deploy parts independently",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-micro-fe-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Module Federation & GraphQL",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-micro-fe-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Module Federation & GraphQL",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-5-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-5-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-5-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-5-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-5-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-5-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-5-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-5-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-6",
      "title": "Stage 6: Product Leadership & Engineering Management",
      "roleName": "Head of Product & Engineering",
      "description": "Optimizing the product development process, recruiting, training the team, and planning long-term tech strategy.",
      "badge": "👑 Tech Leader",
      "overallProgress": 0,
      "categories": [
        {
          "id": "cat-tech-leadership",
          "name": "6.1. Tech Leadership & Product Strategy",
          "description": "Leading the engineering team and planning the product roadmap",
          "skills": [
            {
              "id": "sk-leadership",
              "name": "Tech Strategy & Mentorship",
              "icon": "Award",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-tech-strategy",
                  "title": "Architecture Roadmap Planning",
                  "description": "Directing the 3-5 year technology architecture for the enterprise",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-leadership-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Tech Strategy & Mentorship",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-leadership-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Tech Strategy & Mentorship",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-6-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-6-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-6-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-6-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-6-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-6-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-6-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-6-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-6-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-6-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-6-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-6-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-6-1",
              "name": "Dynamic Skill 5",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-6-1",
                  "title": "Advanced Practice 5",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-6-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 5",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-6-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 5",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-7",
      "title": "Stage 7: AI Platform Breakthrough & GenAI Apps",
      "roleName": "AI Product & UX Lead",
      "description": "Building next-generation Generative AI applications, optimizing LLM Workflows, and AI-driven UX Systems.",
      "badge": "🌐 GenAI Master",
      "overallProgress": 0,
      "categories": [
        {
          "id": "cat-genai-apps",
          "name": "7.1. GenAI Applications & Agentic UI",
          "description": "Next-gen Generative AI application development",
          "skills": [
            {
              "id": "sk-genai-ux",
              "name": "Agentic Systems & LLM UX",
              "icon": "Bot",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-genai-design",
                  "title": "Designing Interactive 'Learn & Do' AI Interfaces",
                  "description": "Integrating context-aware AI Agents to automatically assist users",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-genai-ux-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Agentic Systems & LLM UX",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-genai-ux-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Agentic Systems & LLM UX",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-7-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-7-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-7-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-7-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-7-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-7-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-7-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-7-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-7-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-7-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-7-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-7-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-8",
      "title": "Stage 8: Tech Startup & Global CTO",
      "roleName": "Chief Technology Officer (CTO)",
      "description": "Running global-scale technology operations, defining international product vision, and leading a unicorn startup.",
      "badge": "💎 Global CTO",
      "overallProgress": 0,
      "categories": [
        {
          "id": "cat-global-cto",
          "name": "8.1. Global Tech Vision & Enterprise Scaling",
          "description": "Global technology vision",
          "skills": [
            {
              "id": "sk-cto-vision",
              "name": "Global Scaling & Tech Investment",
              "icon": "Globe",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-global-scaling",
                  "title": "Global Scaling & International Standards",
                  "description": "Establishing security, operations, and scalability standards for millions of users",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-cto-vision-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Global Scaling & Tech Investment",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-cto-vision-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Global Scaling & Tech Investment",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-8-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-8-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-8-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-8-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-8-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-8-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-8-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-8-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-8-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-8-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-8-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-8-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-8-1",
              "name": "Dynamic Skill 5",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-8-1",
                  "title": "Advanced Practice 5",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-8-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 5",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-8-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 5",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-8-2",
              "name": "Dynamic Skill 6",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-8-2",
                  "title": "Advanced Practice 6",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-8-2-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 6",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-8-2-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 6",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-8-3",
              "name": "Dynamic Skill 7",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-8-3",
                  "title": "Advanced Practice 7",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-8-3-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 7",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-8-3-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 7",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-9",
      "title": "Stage 9: Quantum Web & Zero-Knowledge Architecture",
      "roleName": "Quantum Web Specialist",
      "description": "Anticipating the quantum computing wave, ZK-Rollups encryption, and Web3 UI Security.",
      "badge": "⚛️ Quantum Web",
      "overallProgress": 0,
      "categories": [
        {
          "id": "cat-quantum-web",
          "name": "9.1. Quantum Computing & ZK-Proofs",
          "description": "Next-generation quantum-secure encryption",
          "skills": [
            {
              "id": "sk-quantum-security",
              "name": "Quantum Security & ZK-Rollups",
              "icon": "Shield",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-zk-proofs",
                  "title": "Zero-Knowledge Proofs Integration",
                  "description": "Verifying identity without revealing sensitive data",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-quantum-security-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Quantum Security & ZK-Rollups",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-quantum-security-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Quantum Security & ZK-Rollups",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-9-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-9-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-9-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-9-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-9-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-9-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-9-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-9-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-9-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-9-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-9-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-9-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-9-1",
              "name": "Dynamic Skill 5",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-9-1",
                  "title": "Advanced Practice 5",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-9-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 5",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-9-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 5",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-10",
      "title": "Stage 10: Spatial Computing & WebXR Design",
      "roleName": "Spatial Web & AR/VR Lead",
      "description": "Building 3D spatial web experiences for Apple Vision Pro, Meta Quest & WebXR.",
      "badge": "🥽 Spatial Web3D",
      "overallProgress": 0,
      "categories": [
        {
          "id": "cat-spatial-web",
          "name": "10.1. Spatial WebXR & 3D Interaction",
          "description": "Virtual reality 3D spatial interfaces",
          "skills": [
            {
              "id": "sk-webxr-three",
              "name": "Three.js & VisionOS WebXR",
              "icon": "Box",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-vision-os",
                  "title": "Hand-Tracking Spatial UI Design",
                  "description": "Eye and hand gesture interaction in augmented reality spaces",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-webxr-three-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Three.js & VisionOS WebXR",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-webxr-three-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Three.js & VisionOS WebXR",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-10-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-10-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-10-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-10-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-10-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-10-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-10-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-10-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-10-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-10-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-10-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-10-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-11",
      "title": "Stage 11: Neural Interface & Bio-UX Engineering",
      "roleName": "Neural UX Architect",
      "description": "Brain-Computer Interaction (BCI), bio-interfaces, and advanced motion sensor infrastructure.",
      "badge": "🧠 Bio-Neural UX",
      "overallProgress": 0,
      "categories": [
        {
          "id": "cat-neural-interface",
          "name": "11.1. Brain-Computer Interface (BCI)",
          "description": "Real-time brain signal sensor interfaces",
          "skills": [
            {
              "id": "sk-bci-ux",
              "name": "Neural Signal Processing & Bio-UX",
              "icon": "Cpu",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-neural-flow",
                  "title": "Brainwave UI Navigation",
                  "description": "Analyzing focus states to automatically adjust content",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-bci-ux-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Neural Signal Processing & Bio-UX",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-bci-ux-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Neural Signal Processing & Bio-UX",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-11-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-11-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-11-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-11-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-11-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-11-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-11-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-11-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "ms-stage-12",
      "title": "Stage 12: Interplanetary Web & Universal AI System",
      "roleName": "Universal Tech Visionary",
      "description": "IPFS interplanetary network architecture, universal AI ecosystem, and extreme real-time latency optimization.",
      "badge": "🌌 Universal Vision",
      "overallProgress": 0,
      "categories": [
        {
          "id": "cat-universal-web",
          "name": "12.1. Interplanetary File System & Universal AI",
          "description": "Decentralized network on a universal scale",
          "skills": [
            {
              "id": "sk-ipfs-space",
              "name": "IPFS & Deep Space Latency Opt",
              "icon": "Globe",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-space-net",
                  "title": "Extreme Real-time Data Sync",
                  "description": "Optimizing data transmission latency over vast distances",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-ipfs-space-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng IPFS & Deep Space Latency Opt",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-ipfs-space-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về IPFS & Deep Space Latency Opt",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-12-0",
              "name": "Additional Skill 1",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-12-0",
                  "title": "Practice Topic 1",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-12-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 1",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-12-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 1",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-dummy-ms-stage-12-1",
              "name": "Additional Skill 2",
              "icon": "Star",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-dummy-ms-stage-12-1",
                  "title": "Practice Topic 2",
                  "description": "Additional practice to master this stage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-12-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Additional Skill 2",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-dummy-ms-stage-12-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Additional Skill 2",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-12-0",
              "name": "Dynamic Skill 4",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-12-0",
                  "title": "Advanced Practice 4",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-12-0-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 4",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-12-0-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 4",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-12-1",
              "name": "Dynamic Skill 5",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-12-1",
                  "title": "Advanced Practice 5",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-12-1-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 5",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-12-1-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 5",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            },
            {
              "id": "sk-rnd-ms-stage-12-2",
              "name": "Dynamic Skill 6",
              "icon": "Hexagon",
              "levelPercentage": 0,
              "subTopics": [
                {
                  "id": "sub-rnd-ms-stage-12-2",
                  "title": "Advanced Practice 6",
                  "description": "Advanced practice for comprehensive coverage.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-12-2-1",
                  "title": "Thực hành xây dựng dự án mini ứng dụng Dynamic Skill 6",
                  "description": "Áp dụng kiến thức vừa học vào một project thu nhỏ để hiểu rõ cách thức hoạt động.",
                  "isCompleted": false,
                  "assessmentScore": 0
                },
                {
                  "id": "sub-auto-sk-rnd-ms-stage-12-2-2",
                  "title": "Kiểm tra và review mã nguồn (Code/Design Review)",
                  "description": "Chấm điểm và đánh giá lỗi, tìm phương pháp tối ưu hóa hiệu suất và chất lượng.",
                  "isCompleted": false,
                  "assessmentScore": 0
                }
              ],
              "requirements": [
                "Hoàn thành 100% bài tập thực hành về Dynamic Skill 6",
                "Vượt qua bài test đánh giá năng lực nội bộ (điểm > 80)",
                "Áp dụng thành công vào ít nhất 1 dự án thực tế"
              ]
            }
          ]
        }
      ]
    }
  ]
};
