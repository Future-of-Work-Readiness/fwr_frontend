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
import type { Goal, GoalStatus, GoalPriority, JournalEntry, JournalMood } from '@/types';
import { useAuth } from '@/components/providers';
import { toast } from 'sonner';

// ============ TYPES ============

export interface CreateGoalPayload {
  title: string;
  description?: string | null;
  target?: string;
  priority?: GoalPriority;
  targetDate?: string | null;
  careerProfileId?: string | null;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string | null;
  target?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  targetDate?: string | null;
  progress?: number;
}

export interface CreateJournalEntryPayload {
  title?: string;
  content: string;
  prompt?: string;
  mood?: JournalMood | null;
  tags?: string[];
}

// Extended Goal type to include progress and target for dashboard
export interface GoalWithProgress extends Goal {
  progress?: number;
  target?: string;
}

// ============ JOURNAL PROMPTS ============

export const JOURNAL_PROMPTS = [
  "What was my biggest challenge this week?",
  "What skill do I want to develop next?",
  "What accomplishment am I most proud of?",
  "What feedback have I received recently?",
  "How can I better prepare for my career goals?",
];

// ============ QUERIES ============

/**
 * Fetch all goals for the current user
 */
export function useGoalsQuery(
  options?: Omit<UseQueryOptions<GoalWithProgress[], ApiError>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.goals.list(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<{ goals: GoalWithProgress[] } | GoalWithProgress[]>('/goals');
      return Array.isArray(response) ? response : response.goals;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Fetch a single goal by ID
 */
export function useGoalQuery(
  goalId: string,
  options?: Omit<UseQueryOptions<GoalWithProgress, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.goals.detail(goalId),
    queryFn: () => api.get<GoalWithProgress>(`/goals/${goalId}`),
    enabled: !!goalId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch journal entries for the current user
 */
export function useJournalEntriesQuery(
  options?: Omit<UseQueryOptions<JournalEntry[], ApiError>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.journal.entries(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<{ entries: JournalEntry[] } | JournalEntry[]>('/journal');
      return Array.isArray(response) ? response : response.entries;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch a single journal entry by ID
 */
export function useJournalEntryQuery(
  entryId: string,
  options?: Omit<UseQueryOptions<JournalEntry, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.journal.entry(entryId),
    queryFn: () => api.get<JournalEntry>(`/journal/${entryId}`),
    enabled: !!entryId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

// ============ MUTATIONS ============

/**
 * Create a new goal
 */
export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: CreateGoalPayload) =>
      api.post<{ goal: GoalWithProgress }>('/goals', payload),

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.goals.list(user.id),
        });
      }
      toast.success('Goal created successfully!');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Failed to create goal');
    },
  });
}

/**
 * Update a goal
 */
export function useUpdateGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      goalId,
      data,
    }: {
      goalId: string;
      data: UpdateGoalPayload;
    }) => api.patch<{ goal: GoalWithProgress }>(`/goals/${goalId}`, data),

    onSuccess: (data, variables) => {
      // Update specific goal in cache
      queryClient.setQueryData(
        queryKeys.goals.detail(variables.goalId),
        data.goal
      );

      // Invalidate list
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.goals.list(user.id),
        });
      }
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Failed to update goal');
    },
  });
}

/**
 * Delete a goal
 */
export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (goalId: string) => api.delete(`/goals/${goalId}`),

    onSuccess: (_, goalId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.goals.detail(goalId),
      });

      // Invalidate list
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.goals.list(user.id),
        });
      }
      toast.success('Goal deleted');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Failed to delete goal');
    },
  });
}

/**
 * Complete a goal
 */
export function useCompleteGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (goalId: string) =>
      api.post<{ goal: GoalWithProgress }>(`/goals/${goalId}/complete`),

    onSuccess: (data, goalId) => {
      queryClient.setQueryData(queryKeys.goals.detail(goalId), data.goal);

      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.goals.list(user.id),
        });
      }
      toast.success('Goal completed! 🎉');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Failed to complete goal');
    },
  });
}

/**
 * Create a journal entry
 */
export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: CreateJournalEntryPayload) =>
      api.post<{ entry: JournalEntry }>('/journal', payload),

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.journal.entries(user.id),
        });
      }
      toast.success('Journal entry saved!');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Failed to save journal entry');
    },
  });
}

/**
 * Delete a journal entry
 */
export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (entryId: string) => api.delete(`/journal/${entryId}`),

    onSuccess: (_, entryId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.journal.entry(entryId),
      });

      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.journal.entries(user.id),
        });
      }
      toast.success('Journal entry deleted');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Failed to delete entry');
    },
  });
}
