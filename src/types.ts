// Shared TypeScript types and interfaces for the application

export interface User {
	id: number;
	email: string;
	name?: string;
	full_name?: string;
	readiness_score?: number;
	technical_score?: number;
	soft_skills_score?: number;
	leadership_score?: number;
	preferred_specialization_id?: number;
	specialization_id?: number;
	created_at?: string;
	completedTests?: unknown[];
	badges?: unknown[];
	recentActivity?: unknown[];
	is_active?: boolean;
}

export interface Sector {
	id: number | string;
	name: string;
	description?: string;
}

export interface Specialization {
	id: number | string;
	name: string;
	description?: string;
	branch_id?: number;
	sector_id?: number;
}

export interface Quiz {
	id: number | string;
	title: string;
	description?: string;
	sector_id?: number;
	specialization_id?: number;
	duration?: number;
	difficulty?: string;
	question_count?: number;
}

export interface FormData {
	name: string;
	email: string;
	password: string;
}

export interface UserPreferences {
	sectorId: string | number;
	specializationId: string | number;
}

export interface ApiError {
	detail?: string;
	message?: string;
}

export interface Branch {
	id: number | string;
	name: string;
	description?: string;
	sector_id?: number | string;
	sector_name?: string;
	specialization_count?: number;
}

export interface AdminStats {
	sectors: number;
	branches: number;
	specializations: number;
	users: number;
	quizzes: number;
	quiz_attempts: number;
	avg_readiness_score: number;
}

export interface AdminUser {
	id: number | string;
	name: string;
	email: string;
	specialization_name?: string;
	readiness_score: number;
}

export interface AdminSector {
	id: number | string;
	name: string;
	description?: string;
	branch_count?: number;
}

export interface AdminBranch {
	id: number | string;
	name: string;
	sector_name?: string;
	specialization_count?: number;
}

export interface AdminSpecialization {
	id: number | string;
	name: string;
	branch_name?: string;
	sector_name?: string;
	quiz_count?: number;
}

export interface Message {
	text: string;
	type: 'success' | 'error';
}

export type AdminTab =
	| 'stats'
	| 'sectors'
	| 'branches'
	| 'specializations'
	| 'users';

export type FormDataType =
	| 'sector'
	| 'branch'
	| 'specialization'
	| 'user'
	| 'sectors'
	| 'branches'
	| 'specializations'
	| 'users';

export interface PeerComparison {
	category: string;
	your_score: number;
	peer_average: number;
	difference: number;
	percentile: number;
	status: 'above' | 'below' | 'average';
}

export interface PeerBenchmarkData {
	total_peers: number;
	specialization_name: string;
	overall_percentile: number;
	last_updated: string;
	comparisons: PeerComparison[];
	common_strengths: Array<{
		area: string;
		percentage: number;
		description: string;
	}>;
	common_gaps: Array<{
		area: string;
		percentage: number;
		description: string;
	}>;
}

export interface Test {
	id: string | number;
	title: string;
	description?: string;
	category?: string;
	specialization_id?: number | string;
	difficulty?: string;
	estimatedTime?: number;
	tags?: string[];
	questionCount?: number;
	questions?: TestQuestion[];
}

export interface TestQuestion {
	id: string | number;
	type: 'multiple-choice' | 'true-false';
	question: string;
	options?: string[];
	correct: number | boolean;
	explanation?: string;
	scenario?: string;
}

export interface TestResult {
	testId: string | number;
	score: number;
	correct: number;
	total: number;
	timeSpent: number;
	passed: boolean;
	answers: Record<string | number, number | boolean>;
}
