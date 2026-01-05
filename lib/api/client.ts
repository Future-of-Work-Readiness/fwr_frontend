import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ApiError, type ApiResponse } from './types';
import { dispatchAuthEvent } from '@/lib/auth/events';

/**
 * API Client
 *
 * Centralized Axios instance for consuming external backend API.
 * Handles authentication tokens, error normalization, and auth events.
 */

// Your external backend URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Storage key for auth tokens (matching existing Zustand store)
const AUTH_STORAGE_KEY = 'fwr-auth-storage';

/**
 * Get access token from localStorage (Zustand persisted state)
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const authStorage = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return state?.accessToken || null;
    }
  } catch (error) {
    console.error('Error reading auth token:', error);
  }
  return null;
}

/**
 * Clear auth storage
 */
function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem('fwr-career-storage');
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in cross-origin requests
  });

  // Request interceptor - attach auth token & logging
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Attach Bearer token from localStorage
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor - normalize responses and handle auth errors
  client.interceptors.response.use(
    (response) => {
      // If backend wraps responses in { success, data, error } format:
      const data = response.data as ApiResponse;
      if (data && data.success === false) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          undefined,
          data.errors
        );
      }
      return response;
    },
    (error: AxiosError<ApiResponse>) => Promise.reject(normalizeError(error))
  );

  return client;
}

/**
 * Normalize Axios errors to ApiError
 */
function normalizeError(error: AxiosError<ApiResponse>): ApiError {
  // Network error (no response from server)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new ApiError('Request timed out. Please try again.', 0, 'TIMEOUT');
    }
    return new ApiError(
      'Network error. Please check your connection.',
      0,
      'NETWORK_ERROR'
    );
  }

  const { status, data } = error.response;

  // Handle 401 Unauthorized - session expired
  if (status === 401 && typeof window !== 'undefined') {
    const requestUrl = error.config?.url || '';
    const currentPath = window.location.pathname;

    // Define protected routes
    const protectedPaths = ['/dashboard', '/careers', '/tests', '/goals', '/results', '/soft-skills', '/technical-skills', '/benchmarking', '/onboarding'];
    const isOnProtectedRoute = protectedPaths.some(
      (route) => currentPath === route || currentPath.startsWith(`${route}/`)
    );

    // Don't dispatch for auth-related requests that are expected to return 401
    const isAuthMeRequest = requestUrl.includes('/users/me');
    const isLogoutRequest = requestUrl.includes('/users/logout');

    // Only redirect when on a protected route and NOT for expected 401 responses
    if (isOnProtectedRoute && !isAuthMeRequest && !isLogoutRequest) {
      clearAuthStorage();
      dispatchAuthEvent('auth:session-expired', { returnUrl: currentPath });
    }
  }

  // Handle 403 Forbidden
  if (status === 403 && typeof window !== 'undefined') {
    dispatchAuthEvent('auth:forbidden', { resource: error.config?.url });
  }

  // Extract error message from response
  const message =
    data?.error ||
    data?.message ||
    data?.detail ||
    getDefaultErrorMessage(status);

  return new ApiError(message, status, undefined, data?.errors);
}

/**
 * Get default error message by HTTP status
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This operation conflicts with existing data.';
    case 422:
      return 'The provided data is invalid.';
    case 429:
      return 'Too many requests. Please wait and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable.';
    default:
      return 'An error occurred. Please try again.';
  }
}

const apiClient = createApiClient();

/**
 * API Helper Methods
 *
 * These unwrap the response data for cleaner usage in hooks.
 * Handles both wrapped { data: ... } and direct response formats.
 */
export const api = {
  /**
   * GET request
   */
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T> | T>(url, { params });
    const data = response.data;
    // Handle both { data: {...} } wrapper and direct response
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as ApiResponse<T>).data as T;
    }
    return data as T;
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T> | T>(url, data);
    const responseData = response.data;
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return (responseData as ApiResponse<T>).data as T;
    }
    return responseData as T;
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T> | T>(url, data);
    const responseData = response.data;
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return (responseData as ApiResponse<T>).data as T;
    }
    return responseData as T;
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T> | T>(url, data);
    const responseData = response.data;
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return (responseData as ApiResponse<T>).data as T;
    }
    return responseData as T;
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T> | T>(url);
    const responseData = response.data;
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return (responseData as ApiResponse<T>).data as T;
    }
    return responseData as T;
  },
};

/**
 * Build query string from params object
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export { apiClient };

