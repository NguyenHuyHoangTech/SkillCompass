export type Language = 'vi' | 'en';
export type Theme = 'light' | 'dark';

export const translations = {
  vi: {
    // Navigation & Header
    brandName: 'Skill Compass AI',
    roadmap: 'Career Roadmap',
    allSkills: 'All Skills in 3D',
    exerciseLib: 'Exercises & AI Tests',
    analytics: 'Analytics & Statistics',
    settings: 'System Settings',
    aiAdvisor: 'AI Advisor',

    // Theme & Language
    lightMode: 'Light',
    darkMode: 'Dark',
    vietnamese: 'Vietnamese',
    english: 'English',
    language: 'Language',
    theme: 'Interface',

    // Top Navbar Subtabs
    fullOverview: 'Full Overview',
    skillChecklist: 'Skill Checklist',
    radarChart: 'Skill Radar Chart',
    phaseEvaluation: 'AI Stage Assessment',

    // Auth & User
    login: 'Log In',
    register: 'Register',
    logout: 'Log Out',
    profile: 'Profile',
    subAccountLogin: 'Log In to Secondary Account',
    newAccountRegister: 'Register New Account',
    activeStatus: '🟢 Active',

    // Sidebar
    mainTab: 'Main',
    openMenu: 'Open the management and navigation menu',
    closeMenu: 'Close menu',

    // All Skills Page
    searchSkills: 'Search skill stars...',
    selectCategory: 'SELECT A SKILL CATEGORY',
    allCategories: 'All Categories',
    doubleClickHint: 'Double-click a star to view exercise and checklist details',
    resetView: 'Reset View',
    autoRotate: 'Auto-Rotate',
    paused: 'Paused',
    industry: 'Category',

    // Modal
    masteryLevel: 'Skill Mastery Level',
    exercisesDone: 'Exercises & Learning Items',
    testAiQuiz: '🤖 Take AI Test',
    completed: 'Completed',
    pending: 'Pending',
    close: 'Close Window',

    // Practical Exercise / Quiz Library Page
    exerciseTitle: '🤖 Practical Exercise Center & AI Coach',
    exerciseSubtitle: 'Practice real-world project scenarios with a dedicated AI coach that guides you step by step, fixes code issues, and grades your work.',
    step1Scenario: '1. Real-World Project Scenario',
    step2Coach: '2. Dedicated AI Coach Chat',
    step3Grading: '3. Scoring & Reasoning Assessment',
    backToCatalog: 'Back to Exercise List',
    criteriaNeeded: 'Required Criteria:',
    criteriaItem1: 'Use correct syntax and structural hierarchy.',
    criteriaItem2: 'Ensure responsive optimization for mobile devices.',
    criteriaItem3: 'Follow SEO and accessibility standards (WCAG A11y).',
    enterYourSolution: '💻 Enter Your Code / Practical Exercise Solution:',
    solutionPlaceholder: 'Write your HTML/CSS/JS code or explain your architectural reasoning here... (Or ask the AI Coach in the chat on the right for a hint)',
    submittingGrading: 'AI Coach Is Grading Your Work...',
    submitForGrading: '🏆 Submit for AI Grading',
    tryAnotherSolution: '🔄 Try Another Solution',
    startPracticeAi: '🚀 Start Practicing & Chat with AI',
    strengths: '💪 Strengths:',
    improvements: '💡 Suggested Improvements:',
    passed: '🎉 Meets Practical Standards!',
    needsWork: '⚠️ Needs More Improvement',

    // Settings Page
    settingsTitle: 'Account & System Settings',
    settingsSubtitle: 'Customize your profile, interface theme, and system language',
    profileInfo: 'Profile Information',
    fullName: 'Full Name:',
    careerGoal: 'Career Goal:',
    saveChanges: 'Save Changes',
    savedSuccess: 'Settings saved successfully!',
    configTheme: 'Language & Interface Theme',
    selectLanguage: 'Display Language:',
    selectTheme: 'Interface Theme:',
    themeLightOption: 'Bright White (Clean Light Glassmorphism)',
    themeDarkOption: 'Modern Dark (Neon Dark Glassmorphism)',

    // Analytics Page
    analyticsTitle: 'Learning Progress & Skill Analytics',
    analyticsSubtitle: 'Overview of skill completion and learning pace',
    overallProgress: 'Overall Progress',
    completedSkills: 'Skills Completed',
    totalExercises: 'Exercises Submitted',
    avgScore: 'Average AI Score',
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
