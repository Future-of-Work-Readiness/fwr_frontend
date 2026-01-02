"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

// Mock API delay
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Types
export interface Goal {
  id: string;
  userId: string;
  title: string;
  target: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  prompt: string;
  createdAt: string;
}

// In-memory store for goals and journal entries (simulating database)
const goalsStore: Map<string, Goal[]> = new Map();
const journalStore: Map<string, JournalEntry[]> = new Map();

// Mock API: Fetch goals
const mockFetchGoalsApi = async (userId: string): Promise<Goal[]> => {
  await mockDelay(300);
  return goalsStore.get(userId) || [];
};

// Mock API: Create goal
const mockCreateGoalApi = async (payload: { userId: string; title: string; target: string }): Promise<Goal> => {
  await mockDelay(500);
  
  const newGoal: Goal = {
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: payload.userId,
    title: payload.title,
    target: payload.target,
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const userGoals = goalsStore.get(payload.userId) || [];
  goalsStore.set(payload.userId, [...userGoals, newGoal]);

  return newGoal;
};

// Mock API: Update goal
const mockUpdateGoalApi = async (payload: { goalId: string; userId: string; updates: Partial<Goal> }): Promise<Goal> => {
  await mockDelay(300);
  
  const userGoals = goalsStore.get(payload.userId) || [];
  const goalIndex = userGoals.findIndex(g => g.id === payload.goalId);
  
  if (goalIndex === -1) throw new Error("Goal not found");
  
  const updatedGoal = { 
    ...userGoals[goalIndex], 
    ...payload.updates, 
    updatedAt: new Date().toISOString() 
  };
  userGoals[goalIndex] = updatedGoal;
  goalsStore.set(payload.userId, userGoals);

  return updatedGoal;
};

// Mock API: Delete goal
const mockDeleteGoalApi = async (payload: { goalId: string; userId: string }): Promise<void> => {
  await mockDelay(300);
  
  const userGoals = goalsStore.get(payload.userId) || [];
  goalsStore.set(payload.userId, userGoals.filter(g => g.id !== payload.goalId));
};

// Mock API: Fetch journal entries
const mockFetchJournalApi = async (userId: string): Promise<JournalEntry[]> => {
  await mockDelay(300);
  return journalStore.get(userId) || [];
};

// Mock API: Create journal entry
const mockCreateJournalEntryApi = async (payload: { userId: string; content: string; prompt: string }): Promise<JournalEntry> => {
  await mockDelay(500);
  
  const newEntry: JournalEntry = {
    id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: payload.userId,
    content: payload.content,
    prompt: payload.prompt,
    createdAt: new Date().toISOString(),
  };

  const userEntries = journalStore.get(payload.userId) || [];
  journalStore.set(payload.userId, [newEntry, ...userEntries]);

  return newEntry;
};

// Hooks
export function useGoalsQuery(userId: string | undefined) {
  return useQuery<Goal[], Error>({
    queryKey: ["goals", userId],
    queryFn: () => mockFetchGoalsApi(userId!),
    enabled: !!userId,
  });
}

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockCreateGoalApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["goals", data.userId] });
      toast.success("Goal created successfully!");
    },
    onError: () => {
      toast.error("Failed to create goal");
    },
  });
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockUpdateGoalApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["goals", data.userId] });
    },
    onError: () => {
      toast.error("Failed to update goal");
    },
  });
}

export function useDeleteGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDeleteGoalApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goals", variables.userId] });
      toast.success("Goal deleted");
    },
    onError: () => {
      toast.error("Failed to delete goal");
    },
  });
}

export function useJournalEntriesQuery(userId: string | undefined) {
  return useQuery<JournalEntry[], Error>({
    queryKey: ["journal", userId],
    queryFn: () => mockFetchJournalApi(userId!),
    enabled: !!userId,
  });
}

export function useCreateJournalEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockCreateJournalEntryApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["journal", data.userId] });
      toast.success("Journal entry saved!");
    },
    onError: () => {
      toast.error("Failed to save journal entry");
    },
  });
}

// Journal prompts
export const JOURNAL_PROMPTS = [
  "What was my biggest challenge this week?",
  "What skill do I want to develop next?",
  "What accomplishment am I most proud of?",
  "What feedback have I received recently?",
  "How can I better prepare for my career goals?",
];

