// Authentication utilities with FastAPI backend integration
import { authAPI, testConnection } from './api';
import type { User } from '../src/types';

type Numeric = number | string | null | undefined;

interface ApiErrorLike {
	response?: { data?: { detail?: string } };
	message?: string;
}

type BackendUser = User &
	Partial<FrontendUser> & {
		[key: string]: unknown;
	};

export interface FrontendUser {
	id: number;
	email: string;
	name?: string;
	readinessScore: number;
	technicalScore: number;
	softSkillsScore: number;
	leadershipScore: number;
	specializationId: number | null;
	createdAt?: string;
	completedTests: unknown[];
	badges: unknown[];
	recentActivity: unknown[];
	isActive: boolean;
	industry?: string;
}

export interface AuthResult {
	success: boolean;
	user?: FrontendUser;
	error?: string;
	warning?: string;
}

type UserScores = Pick<
	FrontendUser,
	'readinessScore' | 'technicalScore' | 'softSkillsScore' | 'leadershipScore'
>;

const toNumber = (value: Numeric, fallback = 0): number => {
	if (typeof value === 'number') {
		return value;
	}
	if (typeof value === 'string') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : fallback;
	}
	return fallback;
};

const toOptionalNumber = (value: Numeric): number | null => {
	if (value === null || value === undefined) {
		return null;
	}
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}
	if (typeof value === 'string') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
};

const extractErrorMessage = (error: unknown): string => {
	if (typeof error === 'string') {
		return error;
	}
	if (error && typeof error === 'object') {
		const err = error as ApiErrorLike & Error;
		return (
			err.response?.data?.detail ||
			err.message ||
			(error as { toString?: () => string }).toString?.() ||
			'Unknown error'
		);
	}
	return 'Unknown error';
};

// User data structure (for frontend use)
// Map backend snake_case to frontend camelCase
const createUser = (userData: BackendUser): FrontendUser => ({
	id: Number(userData.id),
	email: String(userData.email ?? ''),
	name:
		typeof userData.name === 'string'
			? userData.name
			: (userData.full_name as string | undefined),
	readinessScore: toNumber(
		userData.readiness_score ?? userData.readinessScore ?? 0
	),
	technicalScore: toNumber(
		userData.technical_score ?? userData.technicalScore ?? 0
	),
	softSkillsScore: toNumber(
		userData.soft_skills_score ?? userData.softSkillsScore ?? 0
	),
	leadershipScore: toNumber(
		userData.leadership_score ?? userData.leadershipScore ?? 0
	),
	specializationId: toOptionalNumber(
		userData.preferred_specialization_id ??
			userData.specialization_id ??
			userData.specializationId
	),
	createdAt:
		typeof userData.created_at === 'string'
			? userData.created_at
			: (userData.createdAt as string | undefined),
	completedTests: Array.isArray(userData.completedTests)
		? userData.completedTests
		: [],
	badges: Array.isArray(userData.badges) ? userData.badges : [],
	recentActivity: Array.isArray(userData.recentActivity)
		? userData.recentActivity
		: [],
	isActive:
		typeof userData.is_active === 'boolean'
			? userData.is_active
			: typeof userData.isActive === 'boolean'
			? userData.isActive
			: true,
	industry:
		typeof userData.industry === 'string'
			? userData.industry
			: (userData.preferredIndustry as string | undefined)
});

// Register a new user (parameters: name, email, password - matches AuthPage.jsx)
export const registerUser = async (
	name: string,
	email: string,
	password: string
): Promise<AuthResult> => {
	try {
		// Test API connection first
		const connectionTest = await testConnection();
		if (!connectionTest.success) {
			throw new Error(
				'Cannot connect to server. Please ensure the backend is running.'
			);
		}

		// Register user with backend
		const userData = {
			name,
			email,
			password
		};

		const response = await authAPI.register(userData);

		if (response.success && response.user) {
			const user = createUser(response.user as BackendUser);
			// Set current user in localStorage for session management
			setCurrentUser(user);
			console.log('User registered successfully:', user);
			return { success: true, user };
		}
		throw new Error(
			response.detail || response.message || 'Registration failed'
		);
	} catch (error) {
		console.error('Registration error:', error);
		return { success: false, error: extractErrorMessage(error) };
	}
};

// Login user
export const loginUser = async (
	email: string,
	password: string
): Promise<AuthResult> => {
	try {
		// Test API connection first
		const connectionTest = await testConnection();
		if (!connectionTest.success) {
			throw new Error(
				'Cannot connect to server. Please ensure the backend is running.'
			);
		}

		// Login with backend
		const credentials = { email, password };
		const response = await authAPI.login(credentials);

		if (response.success && response.user) {
			const user = createUser(response.user as BackendUser);
			// Set current user in localStorage for session management
			setCurrentUser(user);
			console.log('User logged in successfully:', user);
			return { success: true, user };
		}
		throw new Error(response.detail || response.message || 'Login failed');
	} catch (error) {
		console.error('Login error:', error);
		return { success: false, error: extractErrorMessage(error) };
	}
};

// Logout user
export const logoutUser = (): void => {
	localStorage.removeItem('currentUser');
};

const isFrontendUser = (value: unknown): value is FrontendUser => {
	if (!value || typeof value !== 'object') {
		return false;
	}
	const candidate = value as Partial<FrontendUser>;
	return (
		typeof candidate.id === 'number' && typeof candidate.email === 'string'
	);
};

// Get current user
export const getCurrentUser = (): FrontendUser | null => {
	try {
		const userStr = localStorage.getItem('currentUser');
		if (!userStr) {
			return null;
		}
		const parsed = JSON.parse(userStr);
		return isFrontendUser(parsed) ? parsed : null;
	} catch {
		return null;
	}
};

// Set current user
export const setCurrentUser = (user: FrontendUser): void => {
	localStorage.setItem('currentUser', JSON.stringify(user));
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
	return getCurrentUser() !== null;
};

// Update user data (fallback to localStorage for now)
export const updateUser = (updatedUser: FrontendUser): AuthResult => {
	try {
		setCurrentUser(updatedUser);
		return { success: true, user: updatedUser };
	} catch (error) {
		return { success: false, error: extractErrorMessage(error) };
	}
};

// Update user's selected industry
export const updateUserIndustry = async (
	industry: string
): Promise<AuthResult> => {
	const currentUser = getCurrentUser();
	if (!currentUser) {
		return { success: false, error: 'No user logged in' };
	}

	try {
		// Test API connection first
		const connectionTest = await testConnection();
		if (!connectionTest.success) {
			throw new Error(
				'Cannot connect to server. Please ensure the backend is running.'
			);
		}

		// Update industry with backend (currently not implemented, will throw)
		const industryData = { industry };
		await authAPI.updateIndustry(currentUser.id, industryData);
		// Not expected to reach here currently, but return success just in case
		const updatedUser = { ...currentUser, industry };
		setCurrentUser(updatedUser);
		return { success: true, user: updatedUser };
	} catch (error) {
		console.error('Industry update error:', error);
		// Fallback to local update if backend fails
		const updatedUser: FrontendUser = { ...currentUser, industry };
		setCurrentUser(updatedUser);
		return {
			success: true,
			user: updatedUser,
			warning: `Updated locally: ${extractErrorMessage(error)}`
		};
	}
};

// Update user's scores
export const updateUserScores = (scores: Partial<UserScores>): AuthResult => {
	const currentUser = getCurrentUser();
	if (currentUser) {
		const updatedUser: FrontendUser = { ...currentUser, ...scores };
		return updateUser(updatedUser);
	}
	return { success: false, error: 'No user logged in' };
};

// Refresh user data from backend
export const refreshUserData = async (
	userId: number | string
): Promise<AuthResult> => {
	try {
		const response = await fetch(`http://localhost:8000/api/users/${userId}`);
		if (!response.ok) {
			throw new Error('Failed to refresh user data');
		}
		const userData = (await response.json()) as BackendUser;
		const user = createUser(userData);
		setCurrentUser(user);
		console.log('User data refreshed:', user);
		return { success: true, user };
	} catch (error) {
		console.error('Refresh error:', error);
		return { success: false, error: extractErrorMessage(error) };
	}
};
