import { z } from "zod";

// Assessment Type Enum
export const assessmentTypeSchema = z.enum(["technical", "soft_skills", "knowledge"]);
export type AssessmentTypeSchema = z.infer<typeof assessmentTypeSchema>;

// Assessment Status Enum
export const assessmentStatusSchema = z.enum(["not_started", "in_progress", "completed"]);
export type AssessmentStatusSchema = z.infer<typeof assessmentStatusSchema>;

// Assessment Schema
export const assessmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  careerProfileId: z.string(),
  type: assessmentTypeSchema,
  status: assessmentStatusSchema,
  score: z.number().min(0).max(100).nullable(),
  maxScore: z.number().min(0),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AssessmentSchema = z.infer<typeof assessmentSchema>;

// Assessment Question Schema
export const assessmentQuestionSchema = z.object({
  id: z.string().uuid(),
  assessmentId: z.string().uuid(),
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()).min(2, "At least 2 options required"),
  correctAnswer: z.number().min(0),
  explanation: z.string().nullable(),
  order: z.number().min(0),
});

export type AssessmentQuestionSchema = z.infer<typeof assessmentQuestionSchema>;

// Assessment Answer Schema
export const assessmentAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedAnswer: z.number().min(0),
  isCorrect: z.boolean(),
});

export type AssessmentAnswerSchema = z.infer<typeof assessmentAnswerSchema>;

// Submit Assessment Schema
export const submitAssessmentSchema = z.object({
  assessmentId: z.string().uuid(),
  answers: z.array(assessmentAnswerSchema).min(1, "At least one answer required"),
});

export type SubmitAssessmentSchema = z.infer<typeof submitAssessmentSchema>;

// Start Assessment Schema
export const startAssessmentSchema = z.object({
  careerProfileId: z.string(),
  type: assessmentTypeSchema,
});

export type StartAssessmentSchema = z.infer<typeof startAssessmentSchema>;

