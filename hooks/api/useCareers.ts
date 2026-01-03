'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/keys';
import { ApiError } from '@/lib/api/types';
import type { CareerProfile, SectorType } from '@/types';
import { useAuth } from '@/components/providers';

// ============ TYPES ============

export interface CreateCareerPayload {
  sector: SectorType;
  field: string | null;
  specialisation: string;
  isPrimary?: boolean;
}

export interface UpdateCareerPayload {
  sector?: SectorType;
  field?: string | null;
  specialisation?: string;
  isPrimary?: boolean;
}

export interface CompleteOnboardingPayload {
  sector: SectorType;
  field: string | null;
  specialisation: string;
}

// ============ QUERIES ============

/**
 * Fetch all careers for the current user
 */
export function useCareersQuery(
  options?: Omit<
    UseQueryOptions<CareerProfile[], ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.careers.list(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<{ careers: CareerProfile[] } | CareerProfile[]>(
        '/careers'
      );
      return Array.isArray(response) ? response : response.careers;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Fetch a single career by ID
 */
export function useCareerQuery(
  careerId: string,
  options?: Omit<
    UseQueryOptions<CareerProfile, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.careers.detail(careerId),
    queryFn: () => api.get<CareerProfile>(`/careers/${careerId}`),
    enabled: !!careerId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch primary career for the current user
 */
export function usePrimaryCareerQuery(
  options?: Omit<
    UseQueryOptions<CareerProfile | null, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.careers.primary(user?.id || ''),
    queryFn: async () => {
      try {
        const response = await api.get<CareerProfile>('/careers/primary');
        return response;
      } catch (error) {
        if (error instanceof ApiError && error.isNotFoundError) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// ============ MUTATIONS ============

/**
 * Create a new career profile
 */
export function useCreateCareer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: CreateCareerPayload) =>
      api.post<{ career: CareerProfile }>('/careers', payload),

    onSuccess: (data) => {
      // Invalidate careers list
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.list(user.id),
        });
      }

      // If this is the primary career, invalidate primary query
      if (data.career.isPrimary && user?.id) {
        queryClient.setQueryData(
          queryKeys.careers.primary(user.id),
          data.career
        );
      }
    },
  });
}

/**
 * Add a new career (alias for useCreateCareer)
 */
export function useAddCareer() {
  return useCreateCareer();
}

/**
 * Update a career profile
 */
export function useUpdateCareer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      careerId,
      data,
    }: {
      careerId: string;
      data: UpdateCareerPayload;
    }) => api.patch<{ career: CareerProfile }>(`/careers/${careerId}`, data),

    onSuccess: (data, variables) => {
      // Update specific career in cache
      queryClient.setQueryData(
        queryKeys.careers.detail(variables.careerId),
        data.career
      );

      // Invalidate list
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.list(user.id),
        });
      }
    },
  });
}

/**
 * Set a career as primary
 */
export function useSetPrimaryCareer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (careerId: string) =>
      api.post<{ career: CareerProfile }>(`/careers/${careerId}/set-primary`),

    onSuccess: (data) => {
      if (user?.id) {
        // Update primary career cache
        queryClient.setQueryData(
          queryKeys.careers.primary(user.id),
          data.career
        );

        // Invalidate careers list to reflect the change
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.list(user.id),
        });
      }
    },
  });
}

/**
 * Delete a career profile
 */
export function useDeleteCareer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (careerId: string) => api.delete(`/careers/${careerId}`),

    onSuccess: (_, careerId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.careers.detail(careerId),
      });

      // Invalidate list
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.list(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.primary(user.id),
        });
      }
    },
  });
}

// ============ ONBOARDING ============

/**
 * Complete onboarding by creating initial career and marking user as onboarded
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: CompleteOnboardingPayload) =>
      api.post<{ career: CareerProfile; success: boolean }>(
        '/auth/complete-onboarding',
        payload
      ),

    onSuccess: (data) => {
      // Update careers cache
      if (user?.id) {
        queryClient.setQueryData(
          queryKeys.careers.primary(user.id),
          data.career
        );
        queryClient.invalidateQueries({
          queryKey: queryKeys.careers.list(user.id),
        });
      }

      // Update user to reflect onboarding completion
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

// ============ PREFETCHING ============

/**
 * Prefetch a career (call on hover for instant navigation)
 */
export function usePrefetchCareer() {
  const queryClient = useQueryClient();

  return (careerId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.careers.detail(careerId),
      queryFn: () => api.get<CareerProfile>(`/careers/${careerId}`),
      staleTime: 5 * 60 * 1000,
    });
  };
}
