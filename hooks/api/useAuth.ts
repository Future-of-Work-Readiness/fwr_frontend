'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/keys';
import type {
  SessionUser,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  MessageResponse,
  ForgotPasswordData,
  ResetPasswordData,
} from '@/lib/api/types';
import { ApiError } from '@/lib/api/types';
import { dispatchAuthEvent, subscribeToAuthEvents } from '@/lib/auth/events';

// Storage key for auth tokens (matching existing Zustand store)
const AUTH_STORAGE_KEY = 'fwr-auth-storage';
const CAREER_STORAGE_KEY = 'fwr-career-storage';

// ============ STORAGE HELPERS ============

/**
 * Save auth data to localStorage (for Zustand compatibility)
 */
function saveAuthToStorage(user: SessionUser, accessToken: string): void {
  if (typeof window === 'undefined') return;

  const authState = {
    state: {
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    },
    version: 0,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

/**
 * Clear auth data from localStorage
 */
function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(CAREER_STORAGE_KEY);
}

/**
 * Get user from localStorage (for initial hydration)
 */
function getUserFromStorage(): SessionUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const authStorage = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return state?.user || null;
    }
  } catch {
    return null;
  }
  return null;
}

// ============ QUERIES ============

/**
 * Hook to get the current authenticated user
 *
 * Features:
 * - Refetches on tab focus (only when logged in)
 * - Listens for logout events to clear cache
 * - Doesn't retry on 401 (expected for guests)
 */
export function useCurrentUser(
  options?: Omit<
    UseQueryOptions<SessionUser | null, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async (): Promise<SessionUser | null> => {
      try {
        // Try to get user from API
        const response = await api.get<{ user: SessionUser } | SessionUser>(
          '/auth/me'
        );
        // Handle both { user: {...} } and direct user object responses
        const user = 'user' in response ? response.user : response;
        return user;
      } catch (error) {
        // If 401, user is not logged in - return null instead of throwing
        if (error instanceof ApiError && error.isAuthError) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors - user is simply not logged in
      if ((error as ApiError).status === 401) return false;
      return failureCount < 2;
    },
    // Use localStorage data as initial data for faster hydration
    initialData: () => getUserFromStorage(),
    ...options,
  });

  // Subscribe to auth events for cache sync
  useEffect(() => {
    const unsubscribe = subscribeToAuthEvents({
      'auth:logout': () => {
        queryClient.clear();
      },
    });
    return unsubscribe;
  }, [queryClient]);

  // Refetch on tab focus (only if user was logged in)
  const refetch = query.refetch;
  const hasData = !!query.data;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasData) {
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetch, hasData]);

  return {
    ...query,
    isAuthenticated: !!query.data && !query.isError,
  };
}

/**
 * Simple hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data, isLoading, error } = useCurrentUser({ retry: false });

  return {
    isAuthenticated: !!data && !error,
    isLoading,
    user: data,
  };
}

// ============ MUTATIONS ============

/**
 * Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      api.post<LoginResponse>('/auth/login', credentials),

    onSuccess: (data) => {
      // Extract user from response
      const user = 'user' in data ? data.user : (data as unknown as SessionUser);
      const accessToken = 'accessToken' in data ? data.accessToken : '';

      // Update cached user data immediately
      queryClient.setQueryData(queryKeys.auth.me(), user);

      // Save to localStorage for persistence
      saveAuthToStorage(user, accessToken);

      // Dispatch login event for other components
      dispatchAuthEvent('auth:login', {
        userId: user.id,
      });

      // Invalidate user-specific data to refetch with new auth
      queryClient.invalidateQueries({ queryKey: queryKeys.careers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

/**
 * Register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) =>
      api.post<RegisterResponse>('/auth/register', data),

    onSuccess: (data) => {
      const user = 'user' in data ? data.user : (data as unknown as SessionUser);
      const accessToken = 'accessToken' in data ? data.accessToken : '';

      queryClient.setQueryData(queryKeys.auth.me(), user);
      saveAuthToStorage(user, accessToken);

      dispatchAuthEvent('auth:login', {
        userId: user.id,
      });
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  const clearAllCaches = useCallback(() => {
    // Clear user data
    queryClient.setQueryData(queryKeys.auth.me(), null);

    // Remove all auth-related queries
    queryClient.removeQueries({ queryKey: queryKeys.auth.all });

    // Clear localStorage
    clearAuthStorage();

    // Invalidate everything (public data stays but marked stale)
    queryClient.invalidateQueries();

    // Dispatch logout event
    dispatchAuthEvent('auth:logout', { reason: 'user' });

    // Signal other browser tabs about logout
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth:logout', Date.now().toString());
      localStorage.removeItem('auth:logout');
    }
  }, [queryClient]);

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post<MessageResponse>('/auth/logout');
      } catch {
        // Even if API call fails, we should still logout locally
      }
      return { success: true };
    },

    onSuccess: () => clearAllCaches(),
    onError: () => clearAllCaches(), // Clear even on error
  });
}

/**
 * Forgot password mutation
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) =>
      api.post<MessageResponse>('/auth/forgot-password', data),
  });
}

/**
 * Reset password mutation
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordData) =>
      api.post<MessageResponse>('/auth/reset-password', data),
  });
}

// ============ CACHE HELPERS ============

/**
 * Get cached user data without refetching
 */
export function useUserFromCache(): SessionUser | null | undefined {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<SessionUser | null>(queryKeys.auth.me());
}

/**
 * Force invalidate auth cache
 */
export function useInvalidateAuth() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
}

/**
 * Update user data in cache (for optimistic updates)
 */
export function useUpdateUserCache() {
  const queryClient = useQueryClient();

  return (updater: (user: SessionUser | null) => SessionUser | null) => {
    queryClient.setQueryData<SessionUser | null>(
      queryKeys.auth.me(),
      (oldData) => updater(oldData ?? null)
    );
  };
}

