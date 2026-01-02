import { z } from "zod";

// Sector Type Enum
export const sectorTypeSchema = z.enum([
  "technology",
  "finance",
  "health_social_care",
  "education",
  "construction",
]);

export type SectorTypeSchema = z.infer<typeof sectorTypeSchema>;

// Career Profile Schema
export const careerProfileSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  sector: sectorTypeSchema.nullable(),
  field: z.string().nullable(),
  specialisation: z.string().nullable(),
  readinessScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  softSkillScore: z.number().min(0).max(100),
  isPrimary: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CareerProfileSchema = z.infer<typeof careerProfileSchema>;

// Create Career Profile Schema
export const createCareerProfileSchema = z.object({
  sector: sectorTypeSchema,
  field: z.string().min(1, "Field is required"),
  specialisation: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export type CreateCareerProfileSchema = z.infer<typeof createCareerProfileSchema>;

// Update Career Profile Schema
export const updateCareerProfileSchema = z.object({
  sector: sectorTypeSchema.optional(),
  field: z.string().min(1).optional(),
  specialisation: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

export type UpdateCareerProfileSchema = z.infer<typeof updateCareerProfileSchema>;

