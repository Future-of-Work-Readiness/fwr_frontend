import { z } from "zod";

// User Schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email("Invalid email address"),
  fullName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  onboardingCompleted: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserSchema = z.infer<typeof userSchema>;

// User Update Schema
export const userUpdateSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
});

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;

