export interface CourseLink {
  title: string;
  provider: string; // e.g. Coursera, Udemy, YouTube, freeCodeCamp, edX
  url: string;
  rating?: number;
  isFree?: boolean;
}

export interface SubTopic {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  assessmentScore?: number; // 0 - 100
  lastAssessedAt?: string;
  aiFeedback?: string;
  courseUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  icon?: string;
  levelPercentage: number; // 0 - 100
  requirements?: string[];
  subTopics: SubTopic[];
  courseLinks?: CourseLink[];
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  skills: Skill[];
}

export interface OverallAiEvaluation {
  score: number; // 0 - 100
  readinessLabel: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actionItems: string[];
  evaluatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  roleName: string;
  description: string;
  badge: string;
  overallProgress: number; // 0 - 100%
  categories: SkillCategory[];
  overallAiEvaluation?: OverallAiEvaluation;
  isOptimizedByAi?: boolean;
  isForceCompleted?: boolean;
  startDate?: string;
  endDate?: string;
  courseLinks?: CourseLink[];
}

export interface UserRoadmap {
  id: string;
  userId: string;
  userName: string;
  targetRole?: string;
  currentMilestoneId: string;
  milestones: Milestone[];
  updatedAt: string;
}

export interface QuizQuestionRequest {
  milestoneId: string;
  skillId: string;
  subTopicId: string;
}

export interface QuizQuestionResponse {
  skillId: string;
  subTopicId: string;
  subTopicTitle: string;
  skillName: string;
  question: string;
  hint?: string;
  keyConcepts: string[];
}

export interface QuizAnswerSubmission {
  milestoneId: string;
  skillId: string;
  subTopicId: string;
  question: string;
  userAnswer: string;
}

export interface QuizEvaluationResponse {
  score: number;
  isPassed: boolean;
  feedback: string;
  strengths: string;
  improvements: string;
  updatedSkillLevel: number;
}

export interface CareerChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  proposedMilestone?: Milestone;
}
