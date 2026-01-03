/**
 * API Type Definitions
 *
 * Standard types for API communication with the backend.
 */

/**
 * Standard API response wrapper
 * Matches common Python backend response formats (FastAPI/Django)
 */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  detail?: string; // FastAPI style
  errors?: Record<string, string[]>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/**
 * API Error class for typed error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  get isAuthError(): boolean {
    return this.status === 401;
  }

  get isForbiddenError(): boolean {
    return this.status === 403;
  }

  get isValidationError(): boolean {
    return this.status === 400 && !!this.errors;
  }

  get isNotFoundError(): boolean {
    return this.status === 404;
  }

  get isConflictError(): boolean {
    return this.status === 409;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

/**
 * Session user type (frontend format)
 * Used throughout the frontend application
 */
export interface SessionUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

/**
 * Login response (frontend format)
 */
export interface LoginResponse {
  user: SessionUser;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

/**
 * Register response (frontend format)
 */
export interface RegisterResponse {
  user: SessionUser;
  accessToken: string;
  refreshToken?: string;
  message: string;
}

/**
 * Simple message response
 */
export interface MessageResponse {
  message: string;
  success?: boolean;
}

/**
 * Forgot password data
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Reset password data
 */
export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

// ============================================================
// BACKEND RESPONSE TYPES (Raw backend format)
// ============================================================

/**
 * Backend tokens structure
 */
export interface BackendTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
}

/**
 * Backend user data structure
 */
export interface BackendUserData {
  user_id: string;
  email: string;
  name: string;
  role?: string;
  preferred_specialization_id?: string | null;
  onboarding_completed?: boolean;
  readiness_score?: number;
  technical_score?: number;
  soft_skills_score?: number;
  leadership_score?: number;
  created_at: string;
}

/**
 * Backend login response (raw format from /users/login)
 */
export interface BackendLoginResponse {
  success: boolean;
  message: string;
  user: BackendUserData;
  tokens: BackendTokens;
}

/**
 * Backend register response (raw format from /users/register)
 * Now includes tokens for automatic login after registration
 */
export interface BackendRegisterResponse {
  success: boolean;
  message: string;
  user: BackendUserData;
  tokens: BackendTokens;
}

/**
 * Backend current user response (from /users/me)
 * This endpoint already returns frontend-compatible format
 */
export interface BackendCurrentUserResponse {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  role?: string;
  preferredSpecializationId?: string | null;
  readinessScore?: number;
  technicalScore?: number;
  softSkillsScore?: number;
  leadershipScore?: number;
}

// ============================================================
// TRANSFORMERS (Backend -> Frontend)
// ============================================================

/**
 * Transform backend user data to frontend SessionUser format
 */
export function transformBackendUser(backendUser: BackendUserData): SessionUser {
  return {
    id: backendUser.user_id,
    email: backendUser.email,
    fullName: backendUser.name,
    avatarUrl: null, // Not provided by backend yet
    onboardingCompleted: backendUser.onboarding_completed ?? 
      (backendUser.preferred_specialization_id !== null && 
       backendUser.preferred_specialization_id !== undefined),
    createdAt: backendUser.created_at,
    updatedAt: backendUser.created_at, // Use created_at as fallback
  };
}

/**
 * Transform backend login response to frontend LoginResponse format
 */
export function transformLoginResponse(backendResponse: BackendLoginResponse): LoginResponse {
  return {
    user: transformBackendUser(backendResponse.user),
    accessToken: backendResponse.tokens.access_token,
    refreshToken: backendResponse.tokens.refresh_token,
    message: backendResponse.message,
  };
}

/**
 * Transform backend register response to frontend RegisterResponse format
 */
export function transformRegisterResponse(backendResponse: BackendRegisterResponse): RegisterResponse {
  return {
    user: transformBackendUser(backendResponse.user),
    accessToken: backendResponse.tokens.access_token,
    refreshToken: backendResponse.tokens.refresh_token,
    message: backendResponse.message,
  };
}

