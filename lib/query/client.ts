import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/types';

/**
 * QueryClient Configuration
 *
 * Optimized defaults for:
 * - Smart retry logic (skip auth errors)
 * - Sensible stale times
 * - Error logging in development
 */

function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.isAuthError || error.isForbiddenError;
  }
  return false;
}

function isConflictError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.isConflictError;
  }
  return false;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 30 seconds
        staleTime: 30 * 1000,

        // Keep unused data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,

        // Retry logic - don't retry auth errors
        retry: (failureCount, error) => {
          if (isAuthError(error)) return false;
          return failureCount < 3;
        },

        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch behavior
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        // Retry logic for mutations
        retry: (failureCount, error) => {
          if (isAuthError(error)) return false;
          if (isConflictError(error)) return false;
          return failureCount < 2;
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (process.env.NODE_ENV === 'development') {
          console.error(`[Query Error] ${query.queryKey}:`, error);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Mutation Error]:', error);
        }
      },
    }),
  });
}

// Singleton for browser, new instance for each SSR request
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}

