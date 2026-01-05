import { z } from "zod";

// Goal Status Enum
export const goalStatusSchema = z.enum(["not_started", "in_progress", "completed", "cancelled"]);
export type GoalStatusSchema = z.infer<typeof goalStatusSchema>;

// Goal Priority Enum
export const goalPrioritySchema = z.enum(["low", "medium", "high"]);
export type GoalPrioritySchema = z.infer<typeof goalPrioritySchema>;

// Goal Schema
export const goalSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  careerProfileId: z.string().nullable(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  status: goalStatusSchema,
  priority: goalPrioritySchema,
  targetDate: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type GoalSchema = z.infer<typeof goalSchema>;

// Create Goal Schema
export const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  careerProfileId: z.string().optional(),
  priority: goalPrioritySchema.default("medium"),
  targetDate: z.string().datetime().optional(),
});

export type CreateGoalSchema = z.infer<typeof createGoalSchema>;

// Update Goal Schema
export const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: goalStatusSchema.optional(),
  priority: goalPrioritySchema.optional(),
  targetDate: z.string().datetime().optional(),
});

export type UpdateGoalSchema = z.infer<typeof updateGoalSchema>;

