'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/keys';
import { ApiError } from '@/lib/api/types';
import { useAuth } from '@/components/providers';
import { toast } from 'sonner';

// ============ BACKEND TYPES ============

/**
 * Option as shown during quiz (without revealing correct answer)
 */
export interface QuizOption {
  key: string; // A, B, C, D, E
  text: string;
}

/**
 * Option with answer revealed (after submission)
 */
export interface QuizOptionWithAnswer extends QuizOption {
  is_correct: boolean;
  rationale?: string;
}

/**
 * Question as shown during quiz
 */
export interface QuizQuestion {
  question_id: string;
  question_text: string;
  question_type: string;
  points: number;
  order_index: number;
  options: QuizOption[];
}

/**
 * Quiz summary (list view)
 */
export interface QuizSummary {
  quiz_id: string;
  title: string;
  description?: string;
  difficulty_level: number;
  time_limit_minutes: number;
  passing_score: number;
  question_count: number;
  specialization_id: string;
  specialization_name?: string;
}

/**
 * Full quiz detail with questions
 */
export interface QuizDetail {
  quiz_id: string;
  title: string;
  description?: string;
  difficulty_level: number;
  time_limit_minutes: number;
  passing_score: number;
  question_count: number;
  specialization_id: string;
  questions: QuizQuestion[];
}

/**
 * Response from starting a quiz
 */
export interface QuizStartResponse {
  attempt_id: string;
  quiz_id: string;
  quiz: QuizDetail;
  message: string;
}

/**
 * Answer submission format
 */
export interface QuizAnswer {
  question_id: string;
  selected_key: string; // A, B, C, D, E
}

/**
 * Question result after submission
 */
export interface QuestionResult {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points: number;
  earned_points: number;
  explanation?: string;
  options: QuizOptionWithAnswer[];
}

/**
 * Readiness scores snapshot
 */
export interface ReadinessSnapshot {
  overall: number;
  technical: number;
  soft: number;
}

/**
 * Feedback from quiz
 */
export interface QuizFeedback {
  overall: string;
  strengths: string;
  weaknesses: string;
  recommendations: string[];
}

/**
 * Score impact information
 */
export interface ScoreImpact {
  category: string;
  old_score: number;
  new_score: number;
  increase: number;
}

/**
 * Updated goal from quiz completion
 */
export interface UpdatedGoal {
  goal_id: string;
  title: string;
  old_value: number;
  new_value: number;
  is_completed: boolean;
}

/**
 * Full quiz submit response
 */
export interface QuizSubmitResponse {
  success: boolean;
  score: number;
  max_score: number;
  percentage: number;
  correct_count: number;
  total_count: number;
  passed: boolean;
  message: string;
  quiz_title: string;
  passing_score: number;
  time_taken_minutes?: number;
  readiness: ReadinessSnapshot;
  feedback?: QuizFeedback;
  question_results: QuestionResult[];
  score_impact?: ScoreImpact;
  updated_goals: UpdatedGoal[];
}

/**
 * Quiz attempt history item
 */
export interface QuizAttemptHistory {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  difficulty_level: number;
  specialization_name?: string;
  score: number;
  percentage: number;
  passed: boolean;
  completed_at: string;
  time_taken_minutes?: number;
}

/**
 * Quiz history response
 */
export interface QuizHistoryResponse {
  attempts: QuizAttemptHistory[];
  total: number;
}

// ============ QUERY KEYS ============

export const quizQueryKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizQueryKeys.all, 'list'] as const,
  list: (specializationId?: string) =>
    [...quizQueryKeys.lists(), specializationId || 'all'] as const,
  details: () => [...quizQueryKeys.all, 'detail'] as const,
  detail: (quizId: string) => [...quizQueryKeys.details(), quizId] as const,
  attempts: () => [...quizQueryKeys.all, 'attempts'] as const,
  attempt: (attemptId: string) =>
    [...quizQueryKeys.attempts(), attemptId] as const,
  history: (userId: string) =>
    [...quizQueryKeys.all, 'history', userId] as const,
  bySpecialization: (specId: string) =>
    [...quizQueryKeys.all, 'specialization', specId] as const,
};

// ============ QUERIES ============

/**
 * Fetch all quizzes, optionally filtered by specialization
 */
export function useQuizzesQuery(
  specializationId?: string,
  options?: Omit<
    UseQueryOptions<QuizSummary[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: quizQueryKeys.list(specializationId),
    queryFn: async () => {
      const url = specializationId
        ? `/quizzes?specialization_id=${specializationId}`
        : '/quizzes';
      const response = await api.get<{ quizzes: QuizSummary[]; total: number }>(
        url
      );
      return response.quizzes;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch quizzes by specialization ID
 */
export function useQuizzesBySpecializationQuery(
  specializationId: string,
  options?: Omit<
    UseQueryOptions<QuizSummary[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: quizQueryKeys.bySpecialization(specializationId),
    queryFn: async () => {
      const response = await api.get<{ quizzes: QuizSummary[]; total: number }>(
        `/quizzes/by-specialization/${specializationId}`
      );
      return response.quizzes;
    },
    enabled: !!specializationId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch quiz detail with questions (for viewing, not starting)
 */
export function useQuizDetailQuery(
  quizId: string,
  options?: Omit<UseQueryOptions<QuizDetail, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: quizQueryKeys.detail(quizId),
    queryFn: async () => {
      const response = await api.get<QuizDetail>(`/quizzes/${quizId}`);
      return response;
    },
    enabled: !!quizId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Find quiz by specialization name and difficulty level
 */
export function useFindQuizQuery(
  specializationName: string,
  difficultyLevel: number,
  options?: Omit<UseQueryOptions<QuizDetail, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [
      ...quizQueryKeys.all,
      'find',
      specializationName,
      difficultyLevel,
    ],
    queryFn: async () => {
      const response = await api.get<QuizDetail>(
        `/quizzes/find?specialization_name=${encodeURIComponent(specializationName)}&difficulty_level=${difficultyLevel}`
      );
      return response;
    },
    enabled: !!specializationName && difficultyLevel > 0,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch user's quiz attempt history
 */
export function useQuizHistoryQuery(
  options?: Omit<
    UseQueryOptions<QuizAttemptHistory[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: quizQueryKeys.history(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<QuizHistoryResponse>('/quizzes/history');
      return response.attempts;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

// ============ MUTATIONS ============

/**
 * Start a quiz attempt
 */
export function useStartQuiz() {
  return useMutation({
    mutationFn: async (quizId: string) => {
      if (!quizId) {
        throw new Error('Quiz ID is required');
      }
      const response = await api.post<QuizStartResponse>(
        `/quizzes/${quizId}/start`
      );
      return response;
    },
    onError: (error) => {
      console.error('Failed to start quiz:', error);
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to start quiz. Please try again.'
      );
    },
  });
}

/**
 * Submit quiz answers
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      attemptId,
      answers,
    }: {
      attemptId: string;
      answers: QuizAnswer[];
    }) => {
      if (!attemptId) {
        throw new Error('Attempt ID is required');
      }
      if (!answers || answers.length === 0) {
        throw new Error('At least one answer is required');
      }
      
      // Validate all answers have required fields
      const invalidAnswers = answers.filter(
        (a) => !a.question_id || !a.selected_key
      );
      if (invalidAnswers.length > 0) {
        throw new Error('Invalid answer format detected');
      }
      
      const response = await api.post<QuizSubmitResponse>(
        `/quizzes/attempts/${attemptId}/submit`,
        { answers }
      );
      return response;
    },
    onSuccess: (data) => {
      if (user?.id) {
        // Invalidate quiz history
        queryClient.invalidateQueries({
          queryKey: quizQueryKeys.history(user.id),
        });

        // Invalidate careers (scores may have changed)
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.all,
        });

        // Invalidate dashboard
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.dashboard(),
        });
      }

      if (data.passed) {
        toast.success(
          `Congratulations! You passed with ${data.percentage.toFixed(0)}%`
        );
      }
    },
    onError: (error) => {
      console.error('Failed to submit quiz:', error);
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to submit quiz. Please try again.'
      );
    },
  });
}

// ============ LEGACY COMPATIBILITY ============
// These exports maintain backward compatibility with existing code

export type AssessmentResult = QuizAttemptHistory;
export type TestResult = QuizAttemptHistory;

/**
 * @deprecated Use useQuizHistoryQuery instead
 */
export function useAssessmentResults(
  options?: Omit<
    UseQueryOptions<QuizAttemptHistory[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuizHistoryQuery(options);
}

/**
 * @deprecated Use useQuizHistoryQuery instead
 */
export function useTestResults(
  options?: Omit<
    UseQueryOptions<QuizAttemptHistory[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuizHistoryQuery(options);
}

/**
 * @deprecated Use useQuizHistoryQuery instead
 */
export function useAllAssessmentResults(
  options?: Omit<
    UseQueryOptions<QuizAttemptHistory[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuizHistoryQuery(options);
}

