// Quiz service - connects to FastAPI backend with fallback to local tests
import { quizAPI, testConnection } from './api';
import { testLibrary } from './testSystem.js';
import type { Quiz } from '../src/types';

type QuizSource = 'backend' | 'local';
type QuizAnswers = Record<string | number, unknown> | unknown[];

interface QuizQuestion {
	id: string | number;
	correct?: unknown;
	[key: string]: unknown;
}

export interface QuizWithQuestions extends Quiz {
	questions?: QuizQuestion[];
	category?: string;
}

interface QuizListResult {
	success: boolean;
	quizzes?: QuizWithQuestions[];
	source?: QuizSource;
	warning?: string;
	error?: string;
}

interface QuizSingleResult {
	success: boolean;
	quiz?: QuizWithQuestions;
	source?: QuizSource;
	error?: string;
}

interface QuizSubmissionResult {
	success: boolean;
	result?: unknown;
	source?: QuizSource;
	warning?: string;
	error?: string;
}

interface QuizHistoryResult {
	success: boolean;
	history?: StoredQuizResult[];
	source?: QuizSource;
	warning?: string;
	error?: string;
}

interface QuizStatistics {
	totalQuizzesCompleted: number;
	averageScore: number;
	bestScore: number;
	recentActivity: StoredQuizResult[];
	categoryBreakdown: Record<
		string,
		{
			count: number;
			totalScore: number;
			averageScore: number;
		}
	>;
}

interface QuizStatisticsResult {
	success: boolean;
	statistics?: QuizStatistics;
	source?: QuizSource;
	error?: string;
}

interface StoredQuizResult {
	id: string;
	userId: string | number;
	quizId: string | number;
	answers: QuizAnswers;
	score: number;
	completedAt: string;
}

const localTestLibrary: QuizWithQuestions[] = Array.isArray(testLibrary)
	? (testLibrary as QuizWithQuestions[])
	: [];

const getAnswerValue = (
	answers: QuizAnswers,
	question: QuizQuestion,
	index: number
): unknown => {
	if (Array.isArray(answers)) {
		return answers[index];
	}
	if (typeof question.id === 'string' || typeof question.id === 'number') {
		return answers[question.id];
	}
	return undefined;
};

// Get all available quizzes (from backend + local fallback)
export const getAllQuizzes = async (): Promise<QuizListResult> => {
	try {
		const connectionTest = await testConnection();
		if (connectionTest.success) {
			const backendQuizzes = await quizAPI.getAllQuizzes();
			if (backendQuizzes.length > 0) {
				return {
					success: true,
					quizzes: backendQuizzes as QuizWithQuestions[],
					source: 'backend'
				};
			}
		}

		return {
			success: true,
			quizzes: localTestLibrary,
			source: 'local',
			warning:
				'Using local quizzes. Backend connection failed or no backend quizzes available.'
		};
	} catch (error) {
		const err = error instanceof Error ? error : new Error('Unknown error');
		console.error('Error fetching quizzes:', err);
		return {
			success: true,
			quizzes: localTestLibrary,
			source: 'local',
			warning: `Using local quizzes due to error: ${err.message}`
		};
	}
};

// Get a specific quiz by ID
export const getQuizById = async (
	quizId: string | number
): Promise<QuizSingleResult> => {
	try {
		const connectionTest = await testConnection();
		if (connectionTest.success) {
			try {
				const backendQuiz = await quizAPI.getQuiz(quizId);
				if (backendQuiz) {
					return {
						success: true,
						quiz: backendQuiz as QuizWithQuestions,
						source: 'backend'
					};
				}
			} catch (backendError) {
				const err =
					backendError instanceof Error
						? backendError
						: new Error('Unknown backend error');
				console.log('Backend quiz not found, trying local:', err.message);
			}
		}

		const localQuiz = localTestLibrary.find((quiz) => quiz.id === quizId);
		if (localQuiz) {
			return {
				success: true,
				quiz: localQuiz,
				source: 'local'
			};
		}

		throw new Error('Quiz not found');
	} catch (error) {
		const err = error instanceof Error ? error : new Error('Unknown error');
		console.error('Error fetching quiz:', err);
		return {
			success: false,
			error: err.message
		};
	}
};

// Submit quiz results
export const submitQuizResults = async (
	userId: string | number,
	quizId: string | number,
	answers: QuizAnswers,
	score: number
): Promise<QuizSubmissionResult> => {
	try {
		const connectionTest = await testConnection();
		if (connectionTest.success) {
			try {
				const results = {
					quizId,
					answers,
					score,
					completedAt: new Date().toISOString()
				};

				const response = await quizAPI.submitQuizResults(
					userId,
					quizId,
					results
				);
				return {
					success: true,
					result: response,
					source: 'backend'
				};
			} catch (backendError) {
				const err =
					backendError instanceof Error
						? backendError
						: new Error('Unknown backend error');
				console.log('Backend submission failed, storing locally:', err.message);
			}
		}

		const result: StoredQuizResult = {
			id: Date.now().toString(),
			userId,
			quizId,
			answers,
			score,
			completedAt: new Date().toISOString()
		};

		const existingResults = getLocalQuizResults();
		existingResults.push(result);
		localStorage.setItem('quizResults', JSON.stringify(existingResults));

		return {
			success: true,
			result,
			source: 'local',
			warning: 'Stored locally. Backend not available.'
		};
	} catch (error) {
		const err = error instanceof Error ? error : new Error('Unknown error');
		console.error('Error submitting quiz results:', err);
		return {
			success: false,
			error: err.message
		};
	}
};

// Get user's quiz history
export const getUserQuizHistory = async (
	userId: string | number
): Promise<QuizHistoryResult> => {
	try {
		const connectionTest = await testConnection();
		if (connectionTest.success) {
			try {
				const backendHistory = await quizAPI.getUserQuizHistory(userId);
				if (Array.isArray(backendHistory) && backendHistory.length > 0) {
					return {
						success: true,
						history: backendHistory as StoredQuizResult[],
						source: 'backend'
					};
				}
			} catch (backendError) {
				const err =
					backendError instanceof Error
						? backendError
						: new Error('Unknown backend error');
				console.log('Backend history not available, using local:', err.message);
			}
		}

		const localResults = getLocalQuizResults();
		const userResults = localResults.filter(
			(result) => String(result.userId) === String(userId)
		);

		return {
			success: true,
			history: userResults,
			source: 'local',
			warning: 'Using local quiz history. Backend not available.'
		};
	} catch (error) {
		const err = error instanceof Error ? error : new Error('Unknown error');
		console.error('Error fetching quiz history:', err);
		return {
			success: false,
			error: err.message
		};
	}
};

// Helper function to get local quiz results
const getLocalQuizResults = (): StoredQuizResult[] => {
	try {
		const resultsStr = localStorage.getItem('quizResults');
		return resultsStr ? (JSON.parse(resultsStr) as StoredQuizResult[]) : [];
	} catch {
		return [];
	}
};

// Calculate quiz score
export const calculateQuizScore = (
	answers: QuizAnswers,
	quiz: QuizWithQuestions | null | undefined
): number => {
	if (!quiz?.questions || !answers) {
		return 0;
	}

	let correct = 0;
	const totalQuestions = quiz.questions.length;

	quiz.questions.forEach((question, index) => {
		const userAnswer = getAnswerValue(answers, question, index);
		if (userAnswer === question.correct) {
			correct += 1;
		}
	});

	return totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
};

// Get quiz statistics
export const getQuizStatistics = async (
	userId: string | number
): Promise<QuizStatisticsResult> => {
	try {
		const historyResult = await getUserQuizHistory(userId);
		if (!historyResult.success || !historyResult.history) {
			return { success: false, error: historyResult.error };
		}

		const history = historyResult.history;
		const stats: QuizStatistics = {
			totalQuizzesCompleted: history.length,
			averageScore:
				history.length > 0
					? Math.round(
							history.reduce((sum, result) => sum + result.score, 0) /
								history.length
					  )
					: 0,
			bestScore:
				history.length > 0 ? Math.max(...history.map((r) => r.score)) : 0,
			recentActivity: history.slice(-5).reverse(),
			categoryBreakdown: {}
		};

		for (const result of history) {
			const quizResult = await getQuizById(result.quizId);
			const category = quizResult.quiz?.category;
			if (quizResult.success && category) {
				if (!stats.categoryBreakdown[category]) {
					stats.categoryBreakdown[category] = {
						count: 0,
						totalScore: 0,
						averageScore: 0
					};
				}
				const breakdown = stats.categoryBreakdown[category];
				breakdown.count += 1;
				breakdown.totalScore += result.score;
				breakdown.averageScore = Math.round(
					breakdown.totalScore / breakdown.count
				);
			}
		}

		return {
			success: true,
			statistics: stats,
			source: historyResult.source
		};
	} catch (error) {
		const err = error instanceof Error ? error : new Error('Unknown error');
		console.error('Error calculating quiz statistics:', err);
		return { success: false, error: err.message };
	}
};

export default {
	getAllQuizzes,
	getQuizById,
	submitQuizResults,
	getUserQuizHistory,
	calculateQuizScore,
	getQuizStatistics
};
