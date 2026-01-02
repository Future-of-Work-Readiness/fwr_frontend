"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addAssessmentResult, AssessmentResult } from "./useResultsMutations";

// Mock API delay
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Test result payload
interface SubmitTestResultPayload {
  userId: string;
  careerId: string;
  specialisation: string;
  level: string;
  score: number;
  passed: boolean;
  timeTaken: number;
  questionsCount: number;
  category?: "technical" | "soft_skill";
  testName?: string;
}

// Test result response
interface TestResult {
  id: string;
  userId: string;
  careerId: string;
  specialisation: string;
  level: string;
  score: number;
  passed: boolean;
  timeTaken: number;
  questionsCount: number;
  createdAt: string;
}

// Mock submit test result API
const mockSubmitTestResultApi = async (payload: SubmitTestResultPayload): Promise<TestResult> => {
  await mockDelay(500);

  const result: TestResult = {
    id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: payload.userId,
    careerId: payload.careerId,
    specialisation: payload.specialisation,
    level: payload.level,
    score: payload.score,
    passed: payload.passed,
    timeTaken: payload.timeTaken,
    questionsCount: payload.questionsCount,
    createdAt: new Date().toISOString(),
  };

  // Also add to assessment results store for the Results page
  const assessmentResult: AssessmentResult = {
    id: result.id,
    userId: payload.userId,
    careerId: payload.careerId,
    testName: payload.testName || `${payload.specialisation.replace(/_/g, " ")} - ${payload.level}`,
    category: payload.category || "technical",
    score: payload.score,
    passed: payload.passed,
    timeTaken: payload.timeTaken,
    completedAt: result.createdAt,
    level: payload.level,
    specialisation: payload.specialisation,
  };
  addAssessmentResult(assessmentResult);

  return result;
};

// Submit test result mutation hook
export function useSubmitTestResultMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockSubmitTestResultApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["testResults", data.userId] });
      queryClient.invalidateQueries({ queryKey: ["careers", data.userId] });
      queryClient.invalidateQueries({ queryKey: ["assessmentResults", data.userId] });
      queryClient.invalidateQueries({ queryKey: ["allAssessmentResults", data.userId] });
      
      if (data.passed) {
        toast.success(`Congratulations! You passed with ${data.score}%`);
      }
    },
    onError: (error) => {
      console.error("Failed to submit test result:", error);
      toast.error("Failed to save test results. Please try again.");
    },
  });
}

// Fetch test results for a user
export function useTestResultsQuery(userId: string | undefined) {
  // This would be implemented with useQuery in a real app
  // For now, we'll just return an empty array as we're using mock data
  return {
    data: [],
    isLoading: false,
  };
}
