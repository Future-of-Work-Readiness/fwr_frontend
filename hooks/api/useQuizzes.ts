'use client';

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
	// Required fields
	category: string;
	old_score: number;
	new_score: number;
	increase: number;

	// Optional metadata fields (for debugging/analytics/future use)
	quiz_percentage?: number;
	scoring_method?: string;
	quiz_points?: number;
	difficulty_level?: number;
	level_multiplier?: number;
	career_id?: string;
	career_name?: string;
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
 * Quiz attempt history item (backend format with camelCase aliases)
 */
export interface QuizAttemptHistoryBackend {
	// Primary fields (may come as snake_case or camelCase depending on serialization)
	id?: string; // serialization_alias for attempt_id
	attempt_id?: string;
	quiz_id: string;
	testName?: string; // serialization_alias for quiz_title
	quiz_title?: string;
	difficultyLevel?: number; // serialization_alias
	difficulty_level?: number;
	specializationName?: string; // serialization_alias
	specialization_name?: string;
	score: number;
	percentage: number;
	passed: boolean;
	completedAt?: string; // serialization_alias
	completed_at?: string;
	timeTakenMinutes?: number; // serialization_alias
	time_taken_minutes?: number;
	timeTaken?: number; // time_taken_seconds serialization_alias
	time_taken_seconds?: number;
	category: 'technical' | 'soft_skill';
}

/**
 * Quiz attempt history item (normalized frontend format)
 */
export interface QuizAttemptHistory {
	id: string;
	quizId: string;
	testName: string;
	difficultyLevel: number;
	specializationName?: string;
	score: number;
	percentage: number;
	passed: boolean;
	completedAt: string;
	timeTakenMinutes?: number;
	timeTaken: number; // In seconds for legacy compatibility
	category: 'technical' | 'soft_skill';
}

/**
 * Quiz history response (backend format)
 */
export interface QuizHistoryResponseBackend {
	attempts: QuizAttemptHistoryBackend[];
	total: number;
	limit: number;
	offset: number;
	has_more: boolean;
}

/**
 * Quiz history response (normalized frontend format)
 */
export interface QuizHistoryResponse {
	attempts: QuizAttemptHistory[];
	total: number;
	limit: number;
	offset: number;
	hasMore: boolean;
}

/**
 * Quiz history filter options
 */
export interface QuizHistoryFilters {
	limit?: number;
	offset?: number;
	passed?: boolean;
	category?: 'technical' | 'soft_skill';
	dateFrom?: string;
	dateTo?: string;
	specializationName?: string;
}

/**
 * Transform backend quiz history item to frontend format
 */
function transformQuizHistoryItem(
	item: QuizAttemptHistoryBackend
): QuizAttemptHistory {
	// Handle both snake_case and camelCase field names from backend
	const id = item.id || item.attempt_id || '';
	const testName = item.testName || item.quiz_title || '';
	const difficultyLevel = item.difficultyLevel ?? item.difficulty_level ?? 1;
	const specializationName =
		item.specializationName || item.specialization_name;
	const completedAt = item.completedAt || item.completed_at || '';
	const timeTakenMinutes = item.timeTakenMinutes ?? item.time_taken_minutes;
	const timeTakenSeconds =
		item.timeTaken ??
		item.time_taken_seconds ??
		(timeTakenMinutes ? timeTakenMinutes * 60 : 0);

	return {
		id,
		quizId: item.quiz_id,
		testName,
		difficultyLevel,
		specializationName,
		score: item.score,
		percentage: item.percentage,
		passed: item.passed,
		completedAt,
		timeTakenMinutes,
		timeTaken: timeTakenSeconds,
		category: item.category || 'technical'
	};
}

/**
 * Transform backend quiz history response to frontend format
 */
function transformQuizHistoryResponse(
	response: QuizHistoryResponseBackend
): QuizHistoryResponse {
	return {
		attempts: response.attempts.map(transformQuizHistoryItem),
		total: response.total,
		limit: response.limit,
		offset: response.offset,
		hasMore: response.has_more
	};
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
		[...quizQueryKeys.all, 'specialization', specId] as const
};

// ============ QUERIES ============

/**
 * Fetch all quizzes, optionally filtered by specialisation
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
		...options
	});
}

/**
 * Fetch quizzes by specialisation ID
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
		...options
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
		...options
	});
}

/**
 * Find quiz by specialisation name and difficulty level
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
			difficultyLevel
		],
		queryFn: async () => {
			const response = await api.get<QuizDetail>(
				`/quizzes/find?specialization_name=${encodeURIComponent(
					specializationName
				)}&difficulty_level=${difficultyLevel}`
			);
			return response;
		},
		enabled: !!specializationName && difficultyLevel > 0,
		staleTime: 10 * 60 * 1000,
		...options
	});
}

/**
 * Fetch user's quiz attempt history with filtering and pagination
 *
 * @param filters - Optional filters for the query
 * @param options - TanStack Query options
 */
export function useQuizHistoryQuery(
	filters?: QuizHistoryFilters,
	options?: Omit<
		UseQueryOptions<QuizHistoryResponse, ApiError>,
		'queryKey' | 'queryFn'
	>
) {
	const { user } = useAuth();

	// Build query key including filters for proper caching
	const filterKey = filters ? JSON.stringify(filters) : 'all';

	return useQuery({
		queryKey: [...quizQueryKeys.history(user?.id || ''), filterKey],
		queryFn: async () => {
			// Build query params
			const params = new URLSearchParams();

			if (filters?.limit !== undefined) {
				params.append('limit', String(filters.limit));
			}
			if (filters?.offset !== undefined) {
				params.append('offset', String(filters.offset));
			}
			if (filters?.passed !== undefined) {
				params.append('passed', String(filters.passed));
			}
			if (filters?.category) {
				params.append('category', filters.category);
			}
			if (filters?.dateFrom) {
				params.append('date_from', filters.dateFrom);
			}
			if (filters?.dateTo) {
				params.append('date_to', filters.dateTo);
			}
			if (filters?.specializationName) {
				params.append('specialization_name', filters.specializationName);
			}

			const queryString = params.toString();
			const url = queryString
				? `/quizzes/history?${queryString}`
				: '/quizzes/history';

			const response = await api.get<QuizHistoryResponseBackend>(url);
			return transformQuizHistoryResponse(response);
		},
		enabled: !!user?.id,
		staleTime: 2 * 60 * 1000,
		...options
	});
}

/**
 * Convenience hook to get just the attempts array (for backward compatibility)
 */
export function useQuizHistoryAttemptsQuery(
	filters?: QuizHistoryFilters,
	options?: Omit<
		UseQueryOptions<QuizAttemptHistory[], ApiError>,
		'queryKey' | 'queryFn'
	>
) {
	const { user } = useAuth();
	const filterKey = filters ? JSON.stringify(filters) : 'all';

	return useQuery({
		queryKey: [...quizQueryKeys.history(user?.id || ''), 'attempts', filterKey],
		queryFn: async () => {
			const params = new URLSearchParams();

			if (filters?.limit !== undefined) {
				params.append('limit', String(filters.limit));
			}
			if (filters?.offset !== undefined) {
				params.append('offset', String(filters.offset));
			}
			if (filters?.passed !== undefined) {
				params.append('passed', String(filters.passed));
			}
			if (filters?.category) {
				params.append('category', filters.category);
			}
			if (filters?.dateFrom) {
				params.append('date_from', filters.dateFrom);
			}
			if (filters?.dateTo) {
				params.append('date_to', filters.dateTo);
			}
			if (filters?.specializationName) {
				params.append('specialization_name', filters.specializationName);
			}

			const queryString = params.toString();
			const url = queryString
				? `/quizzes/history?${queryString}`
				: '/quizzes/history';

			const response = await api.get<QuizHistoryResponseBackend>(url);
			return transformQuizHistoryResponse(response).attempts;
		},
		enabled: !!user?.id,
		staleTime: 2 * 60 * 1000,
		...options
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
		}
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
			answers
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
					queryKey: quizQueryKeys.history(user.id)
				});

				// Invalidate careers (scores may have changed)
				queryClient.invalidateQueries({
					queryKey: queryKeys.careers.all
				});

				// Invalidate dashboard
				queryClient.invalidateQueries({
					queryKey: queryKeys.careers.dashboard()
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
		}
	});
}

// ============ QUIZ PROGRESS TYPES ============

/**
 * Saved quiz progress
 */
export interface QuizProgress {
	attemptId: string;
	quizId: string;
	savedAnswers: QuizAnswer[];
	currentQuestionIndex: number;
	timeElapsedSeconds?: number;
	lastSavedAt?: string;
	canResume: boolean;
	message: string;
}

/**
 * Quiz progress save payload
 */
export interface QuizProgressSave {
	answers: QuizAnswer[];
	current_question_index: number;
	time_elapsed_seconds?: number;
}

// ============ PROGRESS MUTATIONS ============

/**
 * Save quiz progress mid-attempt
 */
export function useSaveQuizProgress() {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	return useMutation({
		mutationFn: async ({
			attemptId,
			answers,
			currentQuestionIndex,
			timeElapsedSeconds
		}: {
			attemptId: string;
			answers: QuizAnswer[];
			currentQuestionIndex: number;
			timeElapsedSeconds?: number;
		}) => {
			const response = await api.post<QuizProgress>(
				`/quizzes/attempts/${attemptId}/save-progress`,
				{
					answers,
					current_question_index: currentQuestionIndex,
					time_elapsed_seconds: timeElapsedSeconds
				}
			);
			return response;
		},
		onSuccess: (data) => {
			// Store in session storage for quick access
			sessionStorage.setItem(
				`quiz_progress_${data.attemptId}`,
				JSON.stringify(data)
			);
		},
		onError: (error) => {
			console.error('Failed to save quiz progress:', error);
			// Don't show toast - silently fail to not disrupt the user
		}
	});
}

/**
 * Get saved quiz progress
 */
export function useQuizProgressQuery(
	attemptId: string,
	options?: Omit<
		UseQueryOptions<QuizProgress, ApiError>,
		'queryKey' | 'queryFn'
	>
) {
	return useQuery({
		queryKey: [...quizQueryKeys.attempt(attemptId), 'progress'],
		queryFn: async () => {
			const response = await api.get<QuizProgress>(
				`/quizzes/attempts/${attemptId}/progress`
			);
			return response;
		},
		enabled: !!attemptId,
		staleTime: 0, // Always fetch fresh
		...options
	});
}

// ============ LEGACY COMPATIBILITY ============
// These exports maintain backward compatibility with existing code

/**
 * Legacy assessment result type (alias for QuizAttemptHistory)
 */
export type AssessmentResult = QuizAttemptHistory;

/**
 * Legacy test result type (alias for QuizAttemptHistory)
 */
export type TestResult = QuizAttemptHistory;

/**
 * @deprecated Use useQuizHistoryAttemptsQuery instead
 */
export function useAssessmentResults(
	options?: Omit<
		UseQueryOptions<QuizAttemptHistory[], ApiError>,
		'queryKey' | 'queryFn'
	>
) {
	return useQuizHistoryAttemptsQuery(undefined, options);
}

/**
 * @deprecated Use useQuizHistoryAttemptsQuery instead
 */
export function useTestResults(
	options?: Omit<
		UseQueryOptions<QuizAttemptHistory[], ApiError>,
		'queryKey' | 'queryFn'
	>
) {
	return useQuizHistoryAttemptsQuery(undefined, options);
}

/**
 * @deprecated Use useQuizHistoryAttemptsQuery instead
 */
export function useAllAssessmentResults(
	options?: Omit<
		UseQueryOptions<QuizAttemptHistory[], ApiError>,
		'queryKey' | 'queryFn'
	>
) {
	return useQuizHistoryAttemptsQuery(undefined, options);
}

// ============ QUIZ ATTEMPT SUMMARY ============

/**
 * Summary of attempts for a specific difficulty level
 */
export interface LevelAttemptSummary {
	attempted: boolean;
	passed?: boolean;
	bestScore?: number;
	attemptCount?: number;
	lastAttemptAt?: string;
}

/**
 * Backend response format for level attempt summary
 */
interface LevelAttemptSummaryBackend {
	attempted: boolean;
	passed?: boolean;
	best_score?: number;
	attempt_count?: number;
	last_attempt_at?: string;
}

/**
 * Response from GET /quizzes/attempts/summary
 */
export interface QuizAttemptSummaryResponse {
	specializationName: string;
	levels: Record<string, LevelAttemptSummary>;
}

/**
 * Backend response format
 */
interface QuizAttemptSummaryResponseBackend {
	specialization_name: string;
	levels: Record<string, LevelAttemptSummaryBackend>;
}

/**
 * Transform backend summary response to frontend format
 */
function transformAttemptSummary(
	response: QuizAttemptSummaryResponseBackend
): QuizAttemptSummaryResponse {
	const levels: Record<string, LevelAttemptSummary> = {};

	for (const [level, data] of Object.entries(response.levels)) {
		levels[level] = {
			attempted: data.attempted,
			passed: data.passed,
			bestScore: data.best_score,
			attemptCount: data.attempt_count,
			lastAttemptAt: data.last_attempt_at
		};
	}

	return {
		specializationName: response.specialization_name,
		levels
	};
}

/**
 * Hook to fetch quiz attempt summary for a specialisation.
 *
 * Returns attempt status for each difficulty level (1-5):
 * - attempted: Whether the user has attempted this level
 * - passed: Whether the user passed (best attempt)
 * - bestScore: Best percentage score achieved
 * - attemptCount: Number of attempts at this level
 * - lastAttemptAt: ISO timestamp of last attempt
 *
 * @param specializationName - The specialisation name (e.g., "FRONTEND_DEVELOPER")
 * @param options - Additional query options
 */
export function useQuizAttemptSummary(
	specializationName: string | undefined,
	options?: Omit<
		UseQueryOptions<QuizAttemptSummaryResponse, ApiError>,
		'queryKey' | 'queryFn'
	>
) {
	const { isAuthenticated } = useAuth();

	return useQuery<QuizAttemptSummaryResponse, ApiError>({
		queryKey: [...quizQueryKeys.all, 'attempt-summary', specializationName],
		queryFn: async () => {
			const response = await api.get<QuizAttemptSummaryResponseBackend>(
				`/quizzes/attempts/summary?specialization_name=${encodeURIComponent(
					specializationName!
				)}`
			);
			return transformAttemptSummary(response);
		},
		enabled: !!specializationName && isAuthenticated,
		staleTime: 60 * 1000, // Cache for 1 minute
		...options
	});
}
