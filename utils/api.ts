import type { Branch, Quiz, Sector, Specialization, User } from '../src/types';

// API service for connecting to FastAPI backend

export const API_BASE_URL: string = import.meta.env.VITE_API_URL;

type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
	body?: unknown;
	headers?: Record<string, string>;
};

class ApiError extends Error {
	response: { status: number; data: unknown };

	constructor(message: string, status: number, data: unknown) {
		super(message);
		this.name = 'ApiError';
		this.response = { status, data };
	}
}

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		let errorData: unknown;
		try {
			const text = await response.text();
			errorData = text ? JSON.parse(text) : { detail: 'Unknown error' };
		} catch {
			errorData = { detail: `HTTP error! status: ${response.status}` };
		}
		const message =
			(typeof errorData === 'object' &&
				errorData !== null &&
				'detail' in errorData &&
				typeof (errorData as { detail?: string }).detail === 'string' &&
				(errorData as { detail?: string }).detail) ||
			(typeof errorData === 'object' &&
				errorData !== null &&
				'message' in errorData &&
				typeof (errorData as { message?: string }).message === 'string' &&
				(errorData as { message?: string }).message) ||
			`HTTP error! status: ${response.status}`;

		throw new ApiError(message, response.status, errorData);
	}
	return (await response.json()) as T;
};

// Helper function to make API requests
const apiRequest = async <T>(
	endpoint: string,
	options: ApiRequestOptions = {}
): Promise<T> => {
	const url = `${API_BASE_URL}${endpoint}`;
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers ?? {})
	};

	let preparedBody: BodyInit | undefined;
	if (
		options.body instanceof FormData ||
		options.body instanceof URLSearchParams
	) {
		preparedBody = options.body;
	} else if (
		typeof options.body === 'string' ||
		options.body instanceof Blob ||
		options.body instanceof ArrayBuffer
	) {
		preparedBody = options.body as BodyInit;
	} else if (options.body !== undefined) {
		preparedBody = JSON.stringify(options.body);
	}

	const config: RequestInit = {
		...options,
		headers,
		body: preparedBody
	};

	try {
		const response = await fetch(url, config);
		return await handleResponse<T>(response);
	} catch (error) {
		console.error(`API request failed for ${endpoint}:`, error);
		throw error;
	}
};

interface RegisterPayload {
	name?: string;
	email: string;
	password: string;
}

interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResponse {
	success?: boolean;
	token?: string;
	user?: unknown;
	detail?: string;
	message?: string;
	error?: string;
}

interface UpdateSpecializationPayload {
	specialization_id: string | number;
}

type UpdateSpecializationResponse = Partial<User> & {
	success?: boolean;
	user?: User;
	error?: string;
};

// Authentication API calls
export const authAPI = {
	register: async (userData: RegisterPayload): Promise<AuthResponse> => {
		return apiRequest<AuthResponse>('/users/register', {
			method: 'POST',
			body: userData
		});
	},

	login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
		return apiRequest<AuthResponse>('/users/login', {
			method: 'POST',
			body: credentials
		});
	},

	getProfile: async (userId: string | number): Promise<unknown> => {
		// Use correct endpoint: /api/users/users/{id}
		return apiRequest(`/users/users/${userId}`);
	},

	updateIndustry: async (
		userId: string | number,
		industryData: unknown
	): Promise<never> => {
		// Note: This endpoint doesn't exist in backend yet
		// For now, redirect to specialization update or remove
		console.warn(
			'updateIndustry endpoint not implemented in backend',
			userId,
			industryData
		);
		throw new Error(
			'Update industry endpoint not implemented. Use updateUserSpecialization instead.'
		);
	}
};

// Hierarchical API calls for Sectors → Branches → Specializations
export const getSectors = async (): Promise<Sector[]> => {
	const response = await apiRequest<Sector[] | { sectors?: Sector[] }>(
		'/sectors'
	);
	if (Array.isArray(response)) {
		return response;
	}
	if (
		response &&
		typeof response === 'object' &&
		'sectors' in response &&
		Array.isArray((response as { sectors?: Sector[] }).sectors)
	) {
		return (response as { sectors?: Sector[] }).sectors ?? [];
	}
	return [];
};

export const getBranches = async (
	sectorId: string | number
): Promise<Branch[]> => {
	const response = await apiRequest<Branch[] | { branches?: Branch[] }>(
		`/sectors/${sectorId}/branches`
	);
	if (Array.isArray(response)) {
		return response;
	}
	if (
		response &&
		typeof response === 'object' &&
		'branches' in response &&
		Array.isArray((response as { branches?: Branch[] }).branches)
	) {
		return (response as { branches?: Branch[] }).branches ?? [];
	}
	return [];
};

export const getSpecializations = async (
	branchId: string | number
): Promise<Specialization[]> => {
	const response = await apiRequest<
		Specialization[] | { specializations?: Specialization[] }
	>(`/branches/${branchId}/specializations`);
	if (Array.isArray(response)) {
		return response;
	}
	if (
		response &&
		typeof response === 'object' &&
		'specializations' in response &&
		Array.isArray(
			(response as { specializations?: Specialization[] }).specializations
		)
	) {
		return (
			(response as { specializations?: Specialization[] }).specializations ?? []
		);
	}
	return [];
};

// Save user's selections to database
export const updateUserSpecialization = async (
	userId: string | number,
	specializationId: string | number
): Promise<UpdateSpecializationResponse> => {
	return apiRequest<UpdateSpecializationResponse>(
		`/users/users/${userId}/specialization`,
		{
			method: 'PATCH',
			body: {
				specialization_id: specializationId
			} satisfies UpdateSpecializationPayload
		}
	);
};

// Quiz API calls
export const quizAPI = {
	getAllQuizzes: async (): Promise<Quiz[]> => {
		const response = await apiRequest<Quiz[] | { quizzes?: Quiz[] }>(
			'/quizzes'
		);
		if (Array.isArray(response)) {
			return response;
		}
		if (
			response &&
			typeof response === 'object' &&
			'quizzes' in response &&
			Array.isArray((response as { quizzes?: Quiz[] }).quizzes)
		) {
			return (response as { quizzes?: Quiz[] }).quizzes ?? [];
		}
		return [];
	},

	getQuiz: async (quizId: string | number): Promise<Quiz> => {
		return apiRequest<Quiz>(`/quizzes/${quizId}`);
	},

	startQuiz: async (
		quizId: string | number,
		userId: string | number
	): Promise<unknown> => {
		return apiRequest(`/quizzes/${quizId}/start?user_id=${userId}`, {
			method: 'POST'
		});
	},

	submitQuizAttempt: async (
		attemptId: string | number,
		answers: unknown[]
	): Promise<unknown> => {
		return apiRequest(`/attempts/${attemptId}/submit`, {
			method: 'POST',
			body: { answers }
		});
	},

	submitQuizResults: async (
		userId: string | number,
		quizId: string | number,
		results: unknown
	): Promise<unknown> => {
		// Legacy method - kept for compatibility
		const payload =
			results && typeof results === 'object'
				? { user_id: userId, ...(results as Record<string, unknown>) }
				: { user_id: userId, result: results };
		return apiRequest(`/quizzes/${quizId}/submit`, {
			method: 'POST',
			body: payload
		});
	},

	getUserQuizHistory: async (userId: string | number): Promise<unknown> => {
		console.warn('getUserQuizHistory endpoint not implemented yet', userId);
		throw new Error('Quiz history endpoint not implemented yet');
	}
};

// Test if API is connected
export const testConnection = async (): Promise<{
	success: boolean;
	data?: unknown;
	error?: string;
}> => {
	try {
		const response = await fetch('http://localhost:8000/');
		const data = await response.json();
		return { success: true, data };
	} catch (error) {
		const err = error instanceof Error ? error : new Error('Unknown error');
		return { success: false, error: err.message };
	}
};

export default {
	authAPI,
	quizAPI,
	testConnection,
	getSectors,
	getBranches,
	getSpecializations,
	updateUserSpecialization
};
