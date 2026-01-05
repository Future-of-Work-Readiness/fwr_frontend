'use client';

import { useEffect } from 'react';
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
import { useCareerStore } from '@/stores/useCareerStore';

// ============ TYPES ============

export interface CreateCareerPayload {
  sector: SectorType;
  field: string | null;
  specialisation: string;
  is_primary?: boolean;  // snake_case for backend
}

export interface UpdateCareerPayload {
  sector?: SectorType;
  field?: string | null;
  specialisation?: string;
  is_primary?: boolean;  // snake_case for backend
}

export interface CompleteOnboardingPayload {
  // Preferred: use the specialization UUID directly
  specialization_id?: string;
  // Alternative: use string identifiers (for backward compatibility)
  sector?: string;
  field?: string | null;
  specialisation?: string;
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
      const response = await api.get<{ careers: CareerProfile[]; total: number }>(
        '/careers'
      );
      return response.careers;
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

// ============ SYNC HOOK ============

/**
 * Sync careers from TanStack Query to Zustand store.
 * 
 * This hook bridges server state (TanStack Query) with client state (Zustand).
 * - Fetches careers from API via useCareersQuery
 * - Syncs data to Zustand store on success
 * - Zustand provides: localStorage persistence, currentCareer context, instant access
 * 
 * Call this hook once in your app layout or a provider component.
 */
export function useSyncCareers() {
  const { data: careers, isLoading, isError, error } = useCareersQuery();
  const { setCareers, setLoading } = useCareerStore();

  // Sync loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Sync careers data to Zustand when it arrives
  useEffect(() => {
    if (careers && careers.length > 0) {
      setCareers(careers);
    }
  }, [careers, setCareers]);

  return {
    isLoading,
    isError,
    error,
    careersCount: careers?.length ?? 0,
  };
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
      api.post<{ career: CareerProfile; success: boolean; user: unknown }>(
        '/users/complete-onboarding',
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

// ============ DASHBOARD ============

/**
 * Career dashboard response type
 */
export interface CareerScores {
  readinessScore: number;
  technicalScore: number;
  softSkillScore: number;
  // leadershipScore: number;
}

export interface CareerDashboard {
  careerId: string;
  sector: string | null;
  field: string | null;
  specialisation: string | null;
  isPrimary: boolean;
  scores: CareerScores;
  goalsCount: number;
  completedGoalsCount: number;
  testsCompletedCount: number;
  totalCareers: number;
}

/**
 * Fetch dashboard data for the primary career
 */
export function useCareerDashboardQuery(
  options?: Omit<
    UseQueryOptions<CareerDashboard, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.careers.dashboard(),
    queryFn: async () => {
      const response = await api.get<CareerDashboard>('/careers/dashboard');
      return response;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard data changes more frequently
    ...options,
  });
}

/**
 * Fetch dashboard data for a specific career
 */
export function useSpecificCareerDashboardQuery(
  careerId: string,
  options?: Omit<
    UseQueryOptions<CareerDashboard, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.careers.dashboard(careerId),
    queryFn: async () => {
      const response = await api.get<CareerDashboard>(
        `/careers/${careerId}/dashboard`
      );
      return response;
    },
    enabled: !!careerId,
    staleTime: 2 * 60 * 1000,
    ...options,
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
