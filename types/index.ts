// ========================
// Core Types for ReadinessAI Platform
// ========================

// Sector Types
export type SectorType =
  | "technology"
  | "finance"
  | "health_social_care"
  | "education"
  | "construction";

// User Types
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Career Profile Types
export interface CareerProfile {
  id: string;
  userId: string;
  sector: SectorType | null;
  field: string | null;
  specialisation: string | null;
  readinessScore: number;
  technicalScore: number;
  softSkillScore: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// Assessment Types
export type AssessmentType = "technical" | "soft_skills" | "knowledge";
export type AssessmentStatus = "not_started" | "in_progress" | "completed";

export interface Assessment {
  id: string;
  userId: string;
  careerProfileId: string;
  type: AssessmentType;
  status: AssessmentStatus;
  score: number | null;
  maxScore: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
  order: number;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

// Goal Types
export type GoalStatus = "not_started" | "in_progress" | "completed" | "cancelled";
export type GoalPriority = "low" | "medium" | "high";

export interface Goal {
  id: string;
  userId: string;
  careerProfileId: string | null;
  title: string;
  description: string | null;
  status: GoalStatus;
  priority: GoalPriority;
  targetDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Journal Entry Types
export type JournalMood = "great" | "good" | "neutral" | "bad" | "terrible";

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  prompt?: string;
  mood: JournalMood | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Activity Types
export type ActivityType =
  | "assessment_completed"
  | "goal_created"
  | "goal_completed"
  | "career_added"
  | "journal_entry"
  | "skill_improved";

export interface UserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  activityTitle: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// Auth Types
export interface AuthPayload {
  email: string;
  password: string;
}

export interface SignUpPayload extends AuthPayload {
  fullName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

