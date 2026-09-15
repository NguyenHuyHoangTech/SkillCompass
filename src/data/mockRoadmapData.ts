import type { UserRoadmap } from '../types/roadmap';

export const initialMockRoadmap: UserRoadmap = {
  id: "user-roadmap-uiux-frontend",
  userId: "usr-1001",
  userName: "Nguyễn Văn A",
  targetRole: "UI/UX & Frontend Engineer",
  currentMilestoneId: "ms-stage-1",
  updatedAt: new Date().toISOString(),
  milestones: [
    {
      id: "ms-stage-1",
      title: "Giai Đoạn 1: Nền Tảng Tư Duy (UI/UX Mindset)",
      roleName: "UI/UX & Frontend Mindset",
      description: "Nắm vững tư duy thiết kế trải nghiệm người dùng (UX) và các nguyên tắc giao diện thị giác (UI) cơ bản trước khi viết dòng code đầu tiên.",
      badge: "🎨 UI/UX Mindset",
      overallProgress: 75,
      categories: [
        {
          id: "cat-ux-fundamentals",
          name: "1.1. Thấu Hiểu UX (Trải Nghiệm Người Dùng)",
          description: "Tư duy đặt người dùng làm trung tâm",
          skills: [
            {
              id: "sk-ux-principles",
              name: "Nguyên Tắc UX & Trực Quan",
              icon: "Code",
              levelPercentage: 85,
              subTopics: [
                {
                  id: "sub-dont-make-me-think",
                  title: "Nguyên tắc Don't Make Me Think",
                  description: "Giao diện rõ ràng, trực quan, nhìn vào là biết thao tác tiếp theo mà không cần đắn đo",
                  isCompleted: true,
                  assessmentScore: 90,
                  aiFeedback: "Giải thích tốt nguyên lý giảm tải tư duy (cognitive load) cho người dùng."
                },
                {
                  id: "sub-ux-consistency",
                  title: "Tính Nhất Quán (Consistency)",
                  description: "Thống nhất nút bấm (buttons), font chữ, màu sắc, khoảng cách trên toàn hệ thống",
                  isCompleted: true,
                  assessmentScore: 80,
                  aiFeedback: "Nắm vững việc thiết kế Design System và token đồng bộ."
                }
              ]
            }
          ]
        },
        {
          id: "cat-ui-principles",
          name: "1.2. Nguyên Tắc UI Thị Giác Căn Bản",
          description: "Phân cấp thị giác, khoảng trắng và sự tương phản",
          skills: [
            {
              id: "sk-visual-hierarchy",
              name: "Visual Hierarchy & Layout Balance",
              icon: "Atom",
              levelPercentage: 70,
              subTopics: [
                {
                  id: "sub-visual-hierarchy-topic",
                  title: "Sự Phân Cấp Thị Giác (Visual Hierarchy)",
                  description: "Sử dụng kích thước, màu sắc, vị trí điều hướng mắt người dùng vào thông tin quan trọng nhất (như nút Call To Action)",
                  isCompleted: true,
                  assessmentScore: 85,
                  aiFeedback: "Phân tích rõ sự khác biệt giữa Primary Button và Secondary Button."
                },
                {
                  id: "sub-whitespace-balance",
                  title: "Sự Cân Bằng & Khoảng Trắng (Whitespace)",
                  description: "Tận dụng khoảng trống không gian để giao diện dễ thở, sang trọng và tập trung vào nội dung chính",
                  isCompleted: true,
                  assessmentScore: 75
                },
                {
                  id: "sub-scale-contrast",
                  title: "Tỷ Lệ & Độ Tương Phản (Scale & Contrast)",
                  description: "Tạo sự tương phản rõ rệt giữa các phần tử để tránh sự đơn điệu và tăng tính trực quan",
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
        readinessLabel: "85% AI Đánh Giá Năng Lực UI/UX & Frontend Mindset",
        summary: "AI đã tổng hợp kết quả các bài kiểm tra test: Điểm năng lực thực tế đạt 85% dựa trên các bài test Don't Make Me Think (90 điểm) và Consistency (80 điểm).",
        strengths: [
          "Thấu hiểu tư duy UI/UX trực quan và nguyên tắc phân cấp thị giác",
          "Có khả năng áp dụng các công cụ hiện đại và chuẩn hóa trải nghiệm người dùng"
        ],
        weaknesses: [
          "Nên hoàn thiện bài kiểm tra test cho mục Tỷ Lệ & Độ Tương Phản để nâng cao điểm AI"
        ],
        actionItems: [
          "Luyện tập bài test AI Quiz cho mục Tỷ Lệ & Độ Tương Phản",
          "Áp dụng chuẩn Mobile-First và kiểm tra độ tương phản màu WCAG",
          "Tối ưu hóa hiệu năng ứng dụng bằng Lazy Loading & WebP"
        ],
        evaluatedAt: new Date().toISOString()
      }
    },
    {
      id: "ms-stage-2",
      title: "Giai Đoạn 2: Kỹ Thuật & Công Cụ (Technical Excellence)",
      roleName: "Frontend Technical Specialist",
      description: "Hiện thực hóa tư duy bằng kỹ thuật làm chủ CSS/SASS, Tailwind CSS, React Components, Animation & Tối ưu Media.",
      badge: "⚡ Technical Master",
      overallProgress: 60,
      categories: [
        {
          id: "cat-css-sass-mastery",
          name: "2.1. Làm Chủ CSS, SASS & Layout",
          description: "Bố cục nâng cao và kiểm soát Box Model",
          skills: [
            {
              id: "sk-flexbox-grid",
              name: "Flexbox, CSS Grid & SASS",
              icon: "FileCode",
              levelPercentage: 80,
              subTopics: [
                {
                  id: "sub-flexbox-grid-mastery",
                  title: "Chuyên Sâu Flexbox & CSS Grid",
                  description: "Xây dựng layout responsive 1D & 2D chính xác và linh hoạt",
                  isCompleted: true,
                  assessmentScore: 90,
                  aiFeedback: "Thành thạo grid-template-areas và flex alignment."
                },
                {
                  id: "sub-sass-mixins",
                  title: "SASS/SCSS Variables & Mixins",
                  description: "Viết CSS có cấu trúc sạch, sử dụng biến, mixins và nesting hiệu quả",
                  isCompleted: true,
                  assessmentScore: 80
                },
                {
                  id: "sub-box-model-spacing",
                  title: "Box Model & Spacing Precision",
                  description: "Kiểm soát tuyệt đối margin, padding, border-box và sizing phần tử",
                  isCompleted: true,
                  assessmentScore: 70
                }
              ]
            }
          ]
        },
        {
          id: "cat-frameworks-libs",
          name: "2.2. Frameworks & Components Hiện Đại",
          description: "Tailwind CSS & React Reusable Architecture",
          skills: [
            {
              id: "sk-react-tailwind",
              name: "Tailwind CSS & React Components",
              icon: "Zap",
              levelPercentage: 65,
              subTopics: [
                {
                  id: "sub-tailwind-utility",
                  title: "Tailwind CSS Utility-First",
                  description: "Xây dựng giao diện nhanh chóng ngay trong JSX, code đồng nhất và dễ tùy biến",
                  isCompleted: true,
                  assessmentScore: 85,
                  aiFeedback: "Ứng dụng tốt class utilities và custom theme configuration."
                },
                {
                  id: "sub-react-component-reuse",
                  title: "React Component Reusability & State",
                  description: "Tách component UI có thể tái sử dụng và quản lý state mượt mà",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        },
        {
          id: "cat-animation-typography",
          name: "2.3 & 2.4. Animation, Micro-interactions & Media",
          description: "Hiệu ứng mượt mà và tối ưu hóa tài nguyên",
          skills: [
            {
              id: "sk-animations-media",
              name: "Micro-interactions & Fonts/WebP",
              icon: "Server",
              levelPercentage: 50,
              subTopics: [
                {
                  id: "sub-animations-hover",
                  title: "Animation & Micro-interactions (Framer Motion / CSS)",
                  description: "Tạo hiệu ứng hover, transition chuyển trang nhẹ nhàng và loading state tinh tế",
                  isCompleted: true,
                  assessmentScore: 75
                },
                {
                  id: "sub-media-font-opt",
                  title: "Tối Ưu Hình Ảnh (WebP/CDN) & Google Fonts",
                  description: "Dùng ảnh WebP sắc nét dung lượng nhẹ và tích hợp tối đa 2-3 Font chữ thương hiệu",
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
      title: "Giai Đoạn 3: Quy Trình & Tối Ưu Hóa (Best Practices)",
      roleName: "Senior Frontend Engineer",
      description: "Đảm bảo ứng dụng chạy mượt trên mọi thiết bị (Mobile-first), tải cực nhanh, tương thích mọi trình duyệt và đạt chuẩn Accessibility.",
      badge: "🚀 Best Practices Pro",
      overallProgress: 40,
      categories: [
        {
          id: "cat-mobile-perf",
          name: "3.1 & 3.2. Responsive Mobile-First & Tối Ưu Hiệu Năng",
          description: "Trải nghiệm mượt mà và tốc độ tải trang tối đa",
          skills: [
            {
              id: "sk-mobile-performance",
              name: "Mobile-First & Performance Tuning",
              icon: "Database",
              levelPercentage: 45,
              subTopics: [
                {
                  id: "sub-mobile-first-approach",
                  title: "Thiết Kế Responsive (Mobile-First)",
                  description: "Xây dựng cho điện thoại trước rồi mở rộng cho Tablet/Desktop",
                  isCompleted: true,
                  assessmentScore: 80
                },
                {
                  id: "sub-perf-lazy-load",
                  title: "Lazy Loading & Code Splitting",
                  description: "Chỉ tải hình ảnh/component khi cuộn tới và nén asset bằng CDN",
                  isCompleted: false,
                  assessmentScore: 0
                }
              ]
            }
          ]
        },
        {
          id: "cat-browser-a11y",
          name: "3.3 & 3.4. Cross-Browser & Accessibility (A11y)",
          description: "Độ tương thích trình duyệt và trợ năng cho mọi người dùng",
          skills: [
            {
              id: "sk-browser-a11y",
              name: "Cross-Browser & Web Accessibility",
              icon: "Cpu",
              levelPercentage: 35,
              subTopics: [
                {
                  id: "sub-cross-browser",
                  title: "Kiểm Tra Chéo (Cross-Browser Compatibility)",
                  description: "Hiển thị hoàn hảo trên Chrome, Safari, Firefox, Edge, iOS & Android",
                  isCompleted: false,
                  assessmentScore: 0
                },
                {
                  id: "sub-web-a11y",
                  title: "Accessibility (A11y) & Semantic HTML",
                  description: "Semantic HTML, hỗ trợ bàn phím navigation và độ tương phản màu chuẩn WCAG",
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
      title: "Giai Đoạn 4: AI Tools & Design System Scale",
      roleName: "Lead UI/UX Engineer",
      description: "Ứng dụng AI vào thiết kế, làm chủ Figma Tokens, Storybook và hệ thống Design System quy mô doanh nghiệp.",
      badge: "🤖 AI & Design System",
      overallProgress: 25,
      categories: [
        {
          id: "cat-ai-design-system",
          name: "4.1. Design System & Storybook",
          description: "Chuẩn hóa hệ thống thiết kế doanh nghiệp",
          skills: [
            {
              id: "sk-storybook-tokens",
              name: "Storybook & Design Tokens",
              icon: "Sparkles",
              levelPercentage: 30,
              subTopics: [
                {
                  id: "sub-storybook-docs",
                  title: "Xây Dựng Thư viện Storybook",
                  description: "Đóng gói UI Component và viết document cho team dev",
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
      title: "Giai Đoạn 5: Kiến Trúc Micro-Frontend & State",
      roleName: "Principal Frontend Architect",
      description: "Thiết kế kiến trúc ứng dụng quy mô lớn, State Management tập trung và tích hợp GraphQL/REST APIs.",
      badge: "🏗️ System Architect",
      overallProgress: 10,
      categories: [
        {
          id: "cat-micro-frontend",
          name: "5.1. Micro-Frontend & GraphQL",
          description: "Tách ứng dụng lớn thành các module độc lập",
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
                  description: "Chia nhỏ ứng dụng và deploy độc lập từng phần",
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
      title: "Giai Đoạn 6: Lãnh Đạo Sản Phẩm & Quản Lý Kỹ Thuật",
      roleName: "Head of Product & Engineering",
      description: "Tối ưu quy trình phát triển sản phẩm, tuyển dụng, đào tạo team và hoạch định chiến lược công nghệ dài hạn.",
      badge: "👑 Tech Leader",
      overallProgress: 0,
      categories: [
        {
          id: "cat-tech-leadership",
          name: "6.1. Tech Leadership & Product Strategy",
          description: "Lãnh đạo đội ngũ kỹ thuật và hoạch định sản phẩm",
          skills: [
            {
              id: "sk-leadership",
              name: "Tech Strategy & Mentorship",
              icon: "Award",
              levelPercentage: 0,
              subTopics: [
                {
                  id: "sub-tech-strategy",
                  title: "Hoạch Định Architecture Roadmap",
                  description: "Định hướng kiến trúc công nghệ 3-5 năm cho doanh nghiệp",
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
      id: "ms-stage-7",
      title: "Giai Đoạn 7: Đột Phá AI Platform & GenAI Apps",
      roleName: "AI Product & UX Lead",
      description: "Xây dựng các ứng dụng Generative AI thế hệ mới, tối ưu hóa LLM Workflows và AI-driven UX Systems.",
      badge: "🌐 GenAI Master",
      overallProgress: 0,
      categories: [
        {
          id: "cat-genai-apps",
          name: "7.1. GenAI Applications & Agentic UI",
          description: "Ứng dụng trí tuệ nhân tạo tạo sinh thế hệ mới",
          skills: [
            {
              id: "sk-genai-ux",
              name: "Agentic Systems & LLM UX",
              icon: "Bot",
              levelPercentage: 0,
              subTopics: [
                {
                  id: "sub-genai-design",
                  title: "Thiết Kế Giao Diện AI Tương Tác Vừa Học Vừa Làm",
                  description: "Tích hợp AI Agents tự động hỗ trợ người dùng theo ngữ cảnh",
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
      id: "ms-stage-8",
      title: "Giai Đoạn 8: Khởi Nghiệp Công Nghệ & CTO Global",
      roleName: "Chief Technology Officer (CTO)",
      description: "Điều hành quy mô công nghệ toàn cầu, hoạch định tầm nhìn sản phẩm quốc tế và dẫn dắt startup unicorn.",
      badge: "💎 Global CTO",
      overallProgress: 0,
      categories: [
        {
          id: "cat-global-cto",
          name: "8.1. Global Tech Vision & Enterprise Scaling",
          description: "Tầm nhìn công nghệ toàn cầu",
          skills: [
            {
              id: "sk-cto-vision",
              name: "Global Scaling & Tech Investment",
              icon: "Globe",
              levelPercentage: 0,
              subTopics: [
                {
                  id: "sub-global-scaling",
                  title: "Mở Rộng Hệ Thống Toàn Cầu & Chuẩn Quốc Tế",
                  description: "Thiết lập chuẩn mực bảo mật, vận hành và scalability triệu người dùng",
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
      id: "ms-stage-9",
      title: "Giai Đoạn 9: Quantum Web & Zero-Knowledge Architecture",
      roleName: "Quantum Web Specialist",
      description: "Đón đầu làn sóng điện toán lượng tử, mã hóa ZK-Rollups và Web3 UI Security.",
      badge: "⚛️ Quantum Web",
      overallProgress: 0,
      categories: [
        {
          id: "cat-quantum-web",
          name: "9.1. Quantum Computing & ZK-Proofs",
          description: "Mã hóa bảo mật lượng tử thế hệ mới",
          skills: [
            {
              id: "sk-quantum-security",
              name: "Quantum Security & ZK-Rollups",
              icon: "Shield",
              levelPercentage: 0,
              subTopics: [
                {
                  id: "sub-zk-proofs",
                  title: "Tích Hợp Zero-Knowledge Proofs",
                  description: "Xác thực danh tính không cần tiết lộ dữ liệu nhạy cảm",
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
      id: "ms-stage-10",
      title: "Giai Đoạn 10: Spatial Computing & WebXR Design",
      roleName: "Spatial Web & AR/VR Lead",
      description: "Xây dựng trải nghiệm web 3D không gian cho Apple Vision Pro, Meta Quest & WebXR.",
      badge: "🥽 Spatial Web3D",
      overallProgress: 0,
      categories: [
        {
          id: "cat-spatial-web",
          name: "10.1. Spatial WebXR & 3D Interaction",
          description: "Giao diện không gian 3 chiều tương tác thực tế ảo",
          skills: [
            {
              id: "sk-webxr-three",
              name: "Three.js & VisionOS WebXR",
              icon: "Box",
              levelPercentage: 0,
              subTopics: [
                {
                  id: "sub-vision-os",
                  title: "Thiết Kế Spatial UI Cử Chỉ Tay (Hand-Tracking)",
                  description: "Tương tác mắt và cử chỉ tay trên không gian thực tế tăng cường",
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
      id: "ms-stage-11",
      title: "Giai Đoạn 11: Neural Interface & Bio-UX Engineering",
      roleName: "Neural UX Architect",
      description: "Tương tác máy tính - sóng não (BCI), giao diện sinh học và hạ tầng cảm biến chuyển động cao cấp.",
      badge: "🧠 Bio-Neural UX",
      overallProgress: 0,
      categories: [
        {
          id: "cat-neural-interface",
          name: "11.1. Brain-Computer Interface (BCI)",
          description: "Giao diện cảm biến tín hiệu não bộ thời gian thực",
          skills: [
            {
              id: "sk-bci-ux",
              name: "Neural Signal Processing & Bio-UX",
              icon: "Cpu",
              levelPercentage: 0,
              subTopics: [
                {
                  id: "sub-neural-flow",
                  title: "Điều Hướng Giao Diện Bằng Sóng Não",
                  description: "Phân tích trạng thái tập trung để điều chỉnh nội dung tự động",
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
      id: "ms-stage-12",
      title: "Giai Đoạn 12: Interplanetary Web & Universal AI System",
      roleName: "Universal Tech Visionary",
      description: "Kiến trúc mạng liên hành tinh IPFS, hệ sinh thái AI vũ trụ và tối ưu latency thời thực cực hạn.",
      badge: "🌌 Universal Vision",
      overallProgress: 0,
      categories: [
        {
          id: "cat-universal-web",
          name: "12.1. Interplanetary File System & Universal AI",
          description: "Mạng lưới phi tập trung quy mô vũ trụ",
          skills: [
            {
              id: "sk-ipfs-space",
              name: "IPFS & Deep Space Latency Opt",
              icon: "Globe",
              levelPercentage: 0,
              subTopics: [
                {
                  id: "sub-space-net",
                  title: "Đồng Bộ Dữ Liệu Thời Gian Thực Cực Hạn",
                  description: "Tối ưu hóa độ trễ truyền dữ liệu khoảng cách xa",
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
