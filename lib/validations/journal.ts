import { z } from "zod";

// Journal Mood Enum
export const journalMoodSchema = z.enum(["great", "good", "neutral", "bad", "terrible"]);
export type JournalMoodSchema = z.infer<typeof journalMoodSchema>;

// Journal Entry Schema
export const journalEntrySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: journalMoodSchema.nullable(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type JournalEntrySchema = z.infer<typeof journalEntrySchema>;

// Create Journal Entry Schema
export const createJournalEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required").max(10000, "Content too long"),
  mood: journalMoodSchema.optional(),
  tags: z.array(z.string().max(50)).max(10, "Maximum 10 tags allowed").optional(),
});

export type CreateJournalEntrySchema = z.infer<typeof createJournalEntrySchema>;

// Update Journal Entry Schema
export const updateJournalEntrySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  mood: journalMoodSchema.optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export type UpdateJournalEntrySchema = z.infer<typeof updateJournalEntrySchema>;

