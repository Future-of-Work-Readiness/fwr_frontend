"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

interface FeedbackSubmitPayload {
  attemptId: string;
  rating: number;
  feedbackText: string;
  quizId?: string;
  quizTitle?: string;
  difficultyLevel?: number;
  category?: "technical" | "soft_skill";
  specializationName?: string;
}

interface FeedbackResponse {
  success: boolean;
  message: string;
  feedback_id: string;
  created_at: string;
}

interface FeedbackCheckResponse {
  attempt_id: string;
  has_feedback: boolean;
  feedback_id: string | null;
}

/**
 * Submit quiz feedback to the API
 */
async function submitFeedback(payload: FeedbackSubmitPayload): Promise<FeedbackResponse> {
  return api.post<FeedbackResponse>("/quiz-feedback/", {
    attempt_id: payload.attemptId,
    rating: payload.rating,
    feedback_text: payload.feedbackText,
    quiz_id: payload.quizId,
    quiz_title: payload.quizTitle,
    difficulty_level: payload.difficultyLevel,
    category: payload.category,
    specialization_name: payload.specializationName,
  });
}

/**
 * Check if feedback exists for an attempt
 */
async function checkFeedback(attemptId: string): Promise<FeedbackCheckResponse> {
  return api.get<FeedbackCheckResponse>(`/quiz-feedback/check/${attemptId}`);
}

/**
 * Hook to submit quiz feedback
 */
export function useSubmitFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: (data, variables) => {
      // Invalidate the feedback check query for this attempt
      queryClient.invalidateQueries({ 
        queryKey: ["feedbackCheck", variables.attemptId] 
      });
      
      toast.success("Thank you for your feedback!", {
        description: "Your input helps us improve.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to submit feedback", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to check if feedback exists for an attempt
 */
export function useFeedbackCheck(attemptId: string | null) {
  return useQuery({
    queryKey: ["feedbackCheck", attemptId],
    queryFn: () => checkFeedback(attemptId!),
    enabled: !!attemptId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

