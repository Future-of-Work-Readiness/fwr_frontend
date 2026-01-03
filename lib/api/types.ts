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
 * Session user type (returned from /auth/me)
 * Extended from existing User type
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
 * Login response from backend
 */
export interface LoginResponse {
  user: SessionUser;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

/**
 * Register response from backend
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

