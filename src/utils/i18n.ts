export type Language = 'vi' | 'en';
export type Theme = 'light' | 'dark';

export const translations = {
  vi: {
    // Navigation & Header
    brandName: 'Skill Compass AI',
    roadmap: 'Lộ Trình Career',
    allSkills: 'Tất Cả Kỹ Năng 3D',
    exerciseLib: 'Bài Tập & Test AI',
    analytics: 'Phân Tích & Thống Kê',
    settings: 'Cài Đặt Hệ Thống',
    aiAdvisor: 'AI Advisor',

    // Theme & Language
    lightMode: 'Sáng',
    darkMode: 'Tối',
    vietnamese: 'Tiếng Việt',
    english: 'English',
    language: 'Ngôn Ngữ',
    theme: 'Giao Diện',

    // Top Navbar Subtabs
    fullOverview: 'Tổng Quan Đầy Đủ',
    skillChecklist: 'Checklist Kỹ Năng',
    radarChart: 'Biểu Đồ Radar Năng Lực',
    phaseEvaluation: 'AI Đánh Giá Giai Đoạn',

    // Auth & User
    login: 'Đăng Nhập',
    register: 'Đăng Ký',
    logout: 'Đăng Xuất',
    profile: 'Hồ Sơ Cá Nhân',
    subAccountLogin: 'Đăng Nhập Tài Khoản Phụ',
    newAccountRegister: 'Đăng Ký Tài Khoản Mới',
    activeStatus: '🟢 Đang Hoạt Động',

    // Sidebar
    mainTab: 'Chính',
    openMenu: 'Mở menu quản lý & điều hướng',
    closeMenu: 'Đóng menu',

    // All Skills Page
    searchSkills: 'Tìm kiếm ngôi sao kỹ năng...',
    selectCategory: 'CHỌN NGÀNH KỸ NĂNG',
    allCategories: 'Tất Cả Ngành',
    doubleClickHint: 'Đúp chuột vào ngôi sao để xem chi tiết bài tập & checklist',
    resetView: 'Đặt lại góc nhìn',
    autoRotate: 'Xoay tự động',
    paused: 'Tạm dừng',
    industry: 'Ngành',

    // Modal
    masteryLevel: 'Mức Độ Thành Thạo Kỹ Năng',
    exercisesDone: 'Danh Sách Bài Tập & Hạng Mục Học Tập',
    testAiQuiz: '🤖 Làm Bài Test AI',
    completed: 'Đã hoàn thành',
    pending: 'Chưa làm',
    close: 'Đóng Cửa Sổ',

    // Practical Exercise / Quiz Library Page
    exerciseTitle: '🤖 Trung Tâm Bài Tập Thực Tế & AI Coach Hướng Dẫn',
    exerciseSubtitle: 'Không gian thực hành tình huống dự án thực tế. Có chatbox AI riêng đồng hành hướng dẫn từng bước, sửa lỗi code và chấm điểm bài làm của bạn.',
    step1Scenario: '1. Đề Bài Dự Án Tình Huống Thực Tế',
    step2Coach: '2. Chatbox AI Riêng Hướng Dẫn Trực Tiếp',
    step3Grading: '3. Chấm Điểm & Đánh Giá Tư Duy',
    backToCatalog: 'Quay Lại Danh Sách Bài Tập',
    criteriaNeeded: 'Tiêu Chí Yêu Cầu Cần Đạt:',
    criteriaItem1: 'Áp dụng đúng cú pháp và nguyên tắc phân cấp cấu trúc.',
    criteriaItem2: 'Đảm bảo tối ưu hóa trên thiết bị di động (Responsive).',
    criteriaItem3: 'Tuân thủ chuẩn SEO & Accessibility (WCAG A11y).',
    enterYourSolution: '💻 Nhập Mã Code / Lời Giải Bài Tập Thực Tế Của Bạn:',
    solutionPlaceholder: 'Viết đoạn mã code HTML/CSS/JS hoặc giải trình tư duy kiến trúc của bạn ở đây... (Hoặc hỏi AI Coach ở khung chat bên phải để lấy gợi ý)',
    submittingGrading: 'AI Coach Đang Chấm Điểm Bài Làm...',
    submitForGrading: '🏆 Nộp Bài Để AI Coach Chấm Điểm',
    tryAnotherSolution: '🔄 Thử Nhập Lời Giải Khác',
    startPracticeAi: '🚀 Bắt Đầu Thực Hành & Chat AI',
    strengths: '💪 Điểm mạnh:',
    improvements: '💡 Gợi ý nâng cấp:',
    passed: '🎉 Đạt Chuẩn Thực Tế!',
    needsWork: '⚠️ Cần Tối Ưu Thêm',

    // Settings Page
    settingsTitle: 'Trang Cài Đặt Tài Khoản & Cấu Hình Hệ Thống',
    settingsSubtitle: 'Tùy chỉnh thông tin cá nhân, theme giao diện và ngôn ngữ hệ thống',
    profileInfo: 'Thông Tin Hồ Sơ',
    fullName: 'Họ và tên người dùng:',
    careerGoal: 'Mục tiêu sự nghiệp:',
    saveChanges: 'Lưu Thay Đổi',
    savedSuccess: 'Đã lưu cấu hình thành công!',
    configTheme: 'Cấu Hình Ngôn Ngữ & Theme Giao Diện',
    selectLanguage: 'Ngôn ngữ hiển thị (Language):',
    selectTheme: 'Chế độ giao diện (Theme):',
    themeLightOption: 'Trắng Sáng Rực Rỡ (Clean Light Glassmorphism)',
    themeDarkOption: 'Tối Hiện Đại (Neon Dark Glassmorphism)',

    // Analytics Page
    analyticsTitle: 'Thống Kê Tiến Độ Học Tập & Phân Tích Năng Lực',
    analyticsSubtitle: 'Báo cáo tổng quan về mức độ hoàn thành kỹ năng và tốc độ học tập',
    overallProgress: 'Tiến Độ Tổng Thể',
    completedSkills: 'Kỹ Năng Đã Đạt',
    totalExercises: 'Bài Tập Đã Nộp',
    avgScore: 'Điểm Trung Bình AI',
  },
  en: {
    // Navigation & Header
    brandName: 'Skill Compass AI',
    roadmap: 'Career Roadmap',
    allSkills: 'All Skills 3D',
    exerciseLib: 'Exercises & AI Test',
    analytics: 'Analytics & Stats',
    settings: 'System Settings',
    aiAdvisor: 'AI Advisor',

    // Theme & Language
    lightMode: 'Light',
    darkMode: 'Dark',
    vietnamese: 'Vietnamese',
    english: 'English',
    language: 'Language',
    theme: 'Theme',

    // Top Navbar Subtabs
    fullOverview: 'Full Overview',
    skillChecklist: 'Skill Checklist',
    radarChart: 'Radar Capability Chart',
    phaseEvaluation: 'AI Phase Evaluation',

    // Auth & User
    login: 'Log In',
    register: 'Register',
    logout: 'Log Out',
    profile: 'User Profile',
    subAccountLogin: 'Log In Secondary Account',
    newAccountRegister: 'Register New Account',
    activeStatus: '🟢 Active Now',

    // Sidebar
    mainTab: 'Main',
    openMenu: 'Open navigation & menu',
    closeMenu: 'Close menu',

    // All Skills Page
    searchSkills: 'Search skill stars...',
    selectCategory: 'SELECT SKILL INDUSTRY',
    allCategories: 'All Industries',
    doubleClickHint: 'Double-click star to view details & exercises',
    resetView: 'Reset View',
    autoRotate: 'Auto Rotate',
    paused: 'Paused',
    industry: 'Industry',

    // Modal
    masteryLevel: 'Skill Mastery Level',
    exercisesDone: 'Exercises & Learning Checklist',
    testAiQuiz: '🤖 Take AI Test',
    completed: 'Completed',
    pending: 'Pending',
    close: 'Close Window',

    // Practical Exercise / Quiz Library Page
    exerciseTitle: '🤖 Practical Exercises Studio & AI Guidance Coach',
    exerciseSubtitle: 'Real-world project scenario workspace with a dedicated AI Coach for step-by-step guidance, code debugging, and solution grading.',
    step1Scenario: '1. Real-World Project Scenario',
    step2Coach: '2. Dedicated AI Coach Assistance',
    step3Grading: '3. Grading & Architectural Feedback',
    backToCatalog: 'Back to Exercises Catalog',
    criteriaNeeded: 'Criteria Required:',
    criteriaItem1: 'Apply correct syntax and structural hierarchy principles.',
    criteriaItem2: 'Ensure mobile responsiveness across devices.',
    criteriaItem3: 'Comply with standard SEO & Accessibility (WCAG A11y).',
    enterYourSolution: '💻 Enter Your Solution / Code Below:',
    solutionPlaceholder: 'Write your HTML/CSS/JS code or explain your architectural logic here... (Or ask the AI Coach in the right panel for tips)',
    submittingGrading: 'AI Coach is grading your submission...',
    submitForGrading: '🏆 Submit Solution for AI Grading',
    tryAnotherSolution: '🔄 Try Another Solution',
    startPracticeAi: '🚀 Start Practice & AI Chat',
    strengths: '💪 Strengths:',
    improvements: '💡 Improvement Suggestions:',
    passed: '🎉 Industry Standard Passed!',
    needsWork: '⚠️ Needs More Refinement',

    // Settings Page
    settingsTitle: 'Account Settings & System Configuration',
    settingsSubtitle: 'Customize personal profile, UI theme, and application language',
    profileInfo: 'Profile Information',
    fullName: 'Full Name:',
    careerGoal: 'Career Goal:',
    saveChanges: 'Save Changes',
    savedSuccess: 'Configuration saved successfully!',
    configTheme: 'Language & Theme Configuration',
    selectLanguage: 'Display Language:',
    selectTheme: 'Interface Theme:',
    themeLightOption: 'Vibrant Light Glassmorphism',
    themeDarkOption: 'Modern Dark Obsidian Glassmorphism',

    // Analytics Page
    analyticsTitle: 'Learning Progress & Capability Analytics',
    analyticsSubtitle: 'Overview report of skill completion rates and learning speed',
    overallProgress: 'Overall Progress',
    completedSkills: 'Completed Skills',
    totalExercises: 'Total Exercises Submitted',
    avgScore: 'Average AI Score',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.vi;
}
