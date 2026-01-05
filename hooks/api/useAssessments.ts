'use client';

/**
 * Legacy Assessment Hooks
 *
 * NOTE: These hooks are maintained for backward compatibility only.
 * New code should use useQuizzes.ts hooks instead:
 * - useQuizHistoryQuery() instead of useAssessmentResults()
 * - useSubmitQuiz() instead of useSubmitTestResult()
 * - useStartQuiz() instead of useStartAssessment()
 *
 * The old /assessments/* endpoints have been replaced with /quizzes/* endpoints.
 */

import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryOptions
} from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/keys';
import { ApiError } from '@/lib/api/types';
import { useAuth } from '@/components/providers';
import { toast } from 'sonner';
import {
	quizQueryKeys,
	type QuizAttemptHistory,
	type QuizAttemptHistoryBackend
} from './useQuizzes';

// ============ TYPES (Legacy - map to new quiz types) ============

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

// ============ HELPER: Transform quiz history to assessment result ============

/**
 * Transform backend quiz history item to AssessmentResult
 * Handles both snake_case and camelCase from backend
 */
function transformQuizHistoryToAssessmentResult(
	item: QuizAttemptHistoryBackend
): AssessmentResult {
	// Handle both snake_case and camelCase field names from backend
	const id = item.id || item.attempt_id || '';
	const testName = item.testName || item.quiz_title || '';
	const difficultyLevel = item.difficultyLevel ?? item.difficulty_level ?? 1;
	const specializationName =
		item.specializationName || item.specialization_name;
	const completedAt = item.completedAt || item.completed_at || '';
	const timeTakenMinutes =
		item.timeTakenMinutes ?? item.time_taken_minutes ?? 0;

	return {
		id,
		userId: '', // Not provided by quiz history
		careerId: '', // Not provided by quiz history
		testName,
		category: 'technical', // Determine from quiz type if needed
		score: item.percentage,
		passed: item.passed,
		timeTaken: timeTakenMinutes * 60, // Convert to seconds
		completedAt,
		level: `${difficultyLevel}`,
		specialisation: specializationName || undefined,
		questionsCount: undefined // Not provided
	};
}

// ============ QUERIES (Updated to use /quizzes endpoints) ============

/**
 * Fetch all assessment results for the current user
 * @deprecated Use useQuizHistoryQuery from useQuizzes.ts instead
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
			try {
				// Try the new quizzes/history endpoint first
				const response = await api.get<{
					attempts: QuizAttemptHistoryBackend[];
					total: number;
				}>('/quizzes/history');
				return response.attempts.map(transformQuizHistoryToAssessmentResult);
			} catch (error) {
				// Return empty array if endpoint fails
				console.warn('Quiz history endpoint not available:', error);
				return [];
			}
		},
		enabled: !!user?.id,
		staleTime: 2 * 60 * 1000,
		...options
	});
}

/**
 * Fetch all assessment results for the current user (alias)
 * @deprecated Use useQuizHistoryQuery from useQuizzes.ts instead
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
 * @deprecated Career-specific filtering should be done client-side from useQuizHistoryQuery
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
			try {
				// Use the new quizzes/history endpoint
				const response = await api.get<{
					attempts: QuizAttemptHistoryBackend[];
					total: number;
				}>('/quizzes/history');
				// Note: Career filtering would need to be added to the backend
				return response.attempts.map(transformQuizHistoryToAssessmentResult);
			} catch (error) {
				console.warn('Quiz history endpoint not available:', error);
				return [];
			}
		},
		enabled: !!user?.id && !!careerId,
		staleTime: 2 * 60 * 1000,
		...options
	});
}

/**
 * Fetch test results for the current user
 * @deprecated Use useQuizHistoryQuery from useQuizzes.ts instead
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
			try {
				// Use the new quizzes/history endpoint
				const response = await api.get<{
					attempts: QuizAttemptHistoryBackend[];
					total: number;
				}>('/quizzes/history');
				return response.attempts.map((h): TestResult => {
					// Handle both snake_case and camelCase from backend
					const id = h.id || h.attempt_id || '';
					const specializationName =
						h.specializationName || h.specialization_name || '';
					const difficultyLevel = h.difficultyLevel ?? h.difficulty_level ?? 1;
					const timeTakenMinutes =
						h.timeTakenMinutes ?? h.time_taken_minutes ?? 0;
					const completedAt = h.completedAt || h.completed_at || '';

					return {
						id,
						careerId: '', // Not provided
						specialisation: specializationName,
						level: `${difficultyLevel}`,
						score: h.percentage,
						passed: h.passed,
						timeTaken: timeTakenMinutes * 60,
						questionsCount: 0, // Not provided
						createdAt: completedAt
					};
				});
			} catch (error) {
				console.warn('Quiz history endpoint not available:', error);
				return [];
			}
		},
		enabled: !!user?.id,
		staleTime: 2 * 60 * 1000,
		...options
	});
}

/**
 * Fetch assessment questions for a test
 * @deprecated Use useFindQuizQuery or useQuizDetailQuery from useQuizzes.ts instead
 */
export function useAssessmentQuestions(
	assessmentId: string,
	options?: Omit<UseQueryOptions<unknown[], ApiError>, 'queryKey' | 'queryFn'>
) {
	return useQuery({
		queryKey: queryKeys.assessments.detail(assessmentId),
		queryFn: async () => {
			// This endpoint doesn't exist anymore - use /quizzes/{id} instead
			console.warn(
				'useAssessmentQuestions is deprecated. Use useQuizDetailQuery instead.'
			);
			return [];
		},
		enabled: false, // Disabled - use new hooks
		staleTime: 10 * 60 * 1000,
		...options
	});
}

// ============ MUTATIONS (Redirect to new quiz endpoints) ============

/**
 * Start a new assessment
 * @deprecated Use useStartQuiz from useQuizzes.ts instead
 */
export function useStartAssessment() {
	return useMutation({
		mutationFn: async (payload: StartAssessmentPayload) => {
			console.warn(
				'useStartAssessment is deprecated. Use useStartQuiz instead.'
			);
			throw new Error(
				'This endpoint has been replaced. Use useStartQuiz with a quiz_id.'
			);
		}
	});
}

/**
 * Submit test results
 * @deprecated Use useSubmitQuiz from useQuizzes.ts instead
 *
 * Note: This mutation is kept for compatibility but the backend endpoint
 * has been replaced. New code should use useSubmitQuiz with the proper
 * attempt_id and answers format.
 */
export function useSubmitTestResult() {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	return useMutation({
		mutationFn: async (payload: SubmitTestResultPayload) => {
			console.warn(
				'useSubmitTestResult is deprecated. Use useSubmitQuiz instead.'
			);
			// Return a mock success to avoid breaking existing code
			// In reality, the new quiz submission handles everything
			return {
				result: {
					id: `legacy_${Date.now()}`,
					userId: user?.id || '',
					careerId: payload.careerId,
					testName:
						payload.testName || `${payload.specialisation} - ${payload.level}`,
					category: payload.category || 'technical',
					score: payload.score,
					passed: payload.passed,
					timeTaken: payload.timeTaken,
					completedAt: new Date().toISOString(),
					level: payload.level,
					specialisation: payload.specialisation,
					questionsCount: payload.questionsCount
				} as AssessmentResult
			};
		},

		onSuccess: (data) => {
			if (user?.id) {
				// Invalidate quiz history
				queryClient.invalidateQueries({
					queryKey: quizQueryKeys.history(user.id)
				});

				// Invalidate careers (scores may have changed)
				queryClient.invalidateQueries({
					queryKey: queryKeys.careers.all
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
		}
	});
}

/**
 * Submit assessment answers
 * @deprecated Use useSubmitQuiz from useQuizzes.ts instead
 */
export function useSubmitAssessmentAnswers() {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	return useMutation({
		mutationFn: async ({
			assessmentId,
			answers
		}: {
			assessmentId: string;
			answers: { questionId: string; selectedAnswer: number }[];
		}) => {
			console.warn(
				'useSubmitAssessmentAnswers is deprecated. Use useSubmitQuiz instead.'
			);
			throw new Error(
				'This endpoint has been replaced. Use useSubmitQuiz with attempt_id and key-based answers.'
			);
		},

		onSuccess: () => {
			if (user?.id) {
				queryClient.invalidateQueries({
					queryKey: quizQueryKeys.history(user.id)
				});
				queryClient.invalidateQueries({
					queryKey: queryKeys.careers.all
				});
			}
		},
		onError: (error) => {
			toast.error(
				error instanceof ApiError
					? error.message
					: 'Failed to submit assessment.'
			);
		}
	});
}
