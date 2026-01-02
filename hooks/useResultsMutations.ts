"use client";

import { useQuery } from "@tanstack/react-query";

// Mock API delay
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Types
export interface AssessmentResult {
  id: string;
  userId: string;
  careerId: string;
  testName: string;
  category: "technical" | "soft_skill";
  score: number;
  passed: boolean;
  timeTaken: number;
  completedAt: string;
  level?: string;
  specialisation?: string;
}

// In-memory store for assessment results (simulating database)
const resultsStore: Map<string, AssessmentResult[]> = new Map();

// Helper to add a result (called from test mutations)
export function addAssessmentResult(result: AssessmentResult) {
  const key = `${result.userId}_${result.careerId}`;
  const existing = resultsStore.get(key) || [];
  resultsStore.set(key, [result, ...existing]);
}

// Mock API: Fetch assessment results
const mockFetchResultsApi = async (userId: string, careerId: string): Promise<AssessmentResult[]> => {
  await mockDelay(300);
  const key = `${userId}_${careerId}`;
  return resultsStore.get(key) || [];
};

// Mock API: Fetch all results for a user
const mockFetchAllResultsApi = async (userId: string): Promise<AssessmentResult[]> => {
  await mockDelay(300);
  const allResults: AssessmentResult[] = [];
  
  resultsStore.forEach((results, key) => {
    if (key.startsWith(userId)) {
      allResults.push(...results);
    }
  });
  
  // Sort by completedAt descending
  return allResults.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
};

// Hooks
export function useAssessmentResultsQuery(userId: string | undefined, careerId: string | undefined) {
  return useQuery<AssessmentResult[], Error>({
    queryKey: ["assessmentResults", userId, careerId],
    queryFn: () => mockFetchResultsApi(userId!, careerId!),
    enabled: !!userId && !!careerId,
  });
}

export function useAllAssessmentResultsQuery(userId: string | undefined) {
  return useQuery<AssessmentResult[], Error>({
    queryKey: ["allAssessmentResults", userId],
    queryFn: () => mockFetchAllResultsApi(userId!),
    enabled: !!userId,
  });
}

