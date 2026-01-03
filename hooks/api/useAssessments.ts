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
import type { Assessment, AssessmentQuestion } from '@/types';
import { useAuth } from '@/components/providers';
import { toast } from 'sonner';

// ============ TYPES ============

export interface AssessmentResult {
  id: string;
  userId: string;
  careerId: string;
  testName: string;
  category: 'technical' | 'soft_skill';
  score: number;
  passed: boolean;
  timeTaken: number;
  completedAt: string;
  level?: string;
  specialisation?: string;
  questionsCount?: number;
}

export interface SubmitTestResultPayload {
  careerId: string;
  specialisation: string;
  level: string;
  score: number;
  passed: boolean;
  timeTaken: number;
  questionsCount: number;
  category?: 'technical' | 'soft_skill';
  testName?: string;
}

export interface StartAssessmentPayload {
  careerId: string;
  type: 'technical' | 'soft_skills' | 'knowledge';
  specialisation: string;
  level: string;
}

export interface TestResult {
  id: string;
  careerId: string;
  specialisation: string;
  level: string;
  score: number;
  passed: boolean;
  timeTaken: number;
  questionsCount: number;
  createdAt: string;
}

// ============ QUERIES ============

/**
 * Fetch all assessment results for the current user
 */
export function useAssessmentResults(
  options?: Omit<
    UseQueryOptions<AssessmentResult[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.assessments.results(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<
        { results: AssessmentResult[] } | AssessmentResult[]
      >('/assessments/results');
      return Array.isArray(response) ? response : response.results;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch all assessment results for the current user (alias for backward compatibility)
 */
export function useAllAssessmentResults(
  options?: Omit<
    UseQueryOptions<AssessmentResult[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useAssessmentResults(options);
}

/**
 * Fetch assessment results for a specific career
 */
export function useAssessmentResultsByCareer(
  careerId: string,
  options?: Omit<
    UseQueryOptions<AssessmentResult[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.assessments.resultsByCareer(user?.id || '', careerId),
    queryFn: async () => {
      const response = await api.get<
        { results: AssessmentResult[] } | AssessmentResult[]
      >(`/assessments/results?careerId=${careerId}`);
      return Array.isArray(response) ? response : response.results;
    },
    enabled: !!user?.id && !!careerId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch test results for the current user
 */
export function useTestResults(
  options?: Omit<
    UseQueryOptions<TestResult[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.tests.results(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<{ results: TestResult[] } | TestResult[]>(
        '/tests/results'
      );
      return Array.isArray(response) ? response : response.results;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch assessment questions for a test
 */
export function useAssessmentQuestions(
  assessmentId: string,
  options?: Omit<
    UseQueryOptions<AssessmentQuestion[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.assessments.detail(assessmentId),
    queryFn: async () => {
      const response = await api.get<
        { questions: AssessmentQuestion[] } | AssessmentQuestion[]
      >(`/assessments/${assessmentId}/questions`);
      return Array.isArray(response) ? response : response.questions;
    },
    enabled: !!assessmentId,
    staleTime: 10 * 60 * 1000, // Questions don't change often
    ...options,
  });
}

// ============ MUTATIONS ============

/**
 * Start a new assessment
 */
export function useStartAssessment() {
  return useMutation({
    mutationFn: (payload: StartAssessmentPayload) =>
      api.post<{ assessment: Assessment; questions: AssessmentQuestion[] }>(
        '/assessments/start',
        payload
      ),
  });
}

/**
 * Submit test results
 */
export function useSubmitTestResult() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: SubmitTestResultPayload) =>
      api.post<{ result: AssessmentResult }>('/assessments/submit', payload),

    onSuccess: (data) => {
      if (user?.id) {
        // Invalidate all assessment results
        queryClient.invalidateQueries({
          queryKey: queryKeys.assessments.results(user.id),
        });

        // Invalidate career-specific results
        queryClient.invalidateQueries({
          queryKey: queryKeys.assessments.resultsByCareer(
            user.id,
            data.result.careerId
          ),
        });

        // Invalidate test results
        queryClient.invalidateQueries({
          queryKey: queryKeys.tests.results(user.id),
        });

        // Invalidate careers (scores may have changed)
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.all,
        });
      }

      if (data.result.passed) {
        toast.success(`Congratulations! You passed with ${data.result.score}%`);
      }
    },
    onError: (error) => {
      console.error('Failed to submit test result:', error);
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to save test results. Please try again.'
      );
    },
  });
}

/**
 * Submit assessment answers
 */
export function useSubmitAssessmentAnswers() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      assessmentId,
      answers,
    }: {
      assessmentId: string;
      answers: { questionId: string; selectedAnswer: number }[];
    }) =>
      api.post<{ result: AssessmentResult }>(
        `/assessments/${assessmentId}/submit`,
        { answers }
      ),

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.assessments.results(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.all,
        });
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to submit assessment.'
      );
    },
  });
}
