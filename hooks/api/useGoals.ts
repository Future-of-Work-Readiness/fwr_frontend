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
  category?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  targetDate?: string | null;
  careerProfileId?: string | null;
  targetValue?: number;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string | null;
  target?: string;
  category?: string;
  status?: GoalStatus;
  priority?: GoalPriority;
  targetDate?: string | null;
  progress?: number;
  currentValue?: number;
  targetValue?: number;
}

export interface CreateJournalEntryPayload {
  title?: string;
  content: string;
  prompt?: string;
  mood?: JournalMood | null;
  tags?: string[];
}

export interface UpdateJournalEntryPayload {
  title?: string;
  content?: string;
  prompt?: string;
  mood?: JournalMood | null;
  tags?: string[];
}

// Extended Goal type to include progress and target for dashboard
export interface GoalWithProgress extends Goal {
  progress?: number;
  target?: string;
  currentValue?: number;
  targetValue?: number;
  isCompleted?: boolean;
  // Note: completedAt is inherited from Goal as `string | null`
}

// Backend response types
interface GoalListResponse {
  goals: GoalWithProgress[];
  total: number;
}

interface JournalEntryListResponse {
  entries: JournalEntry[];
  total: number;
}

// ============ JOURNAL PROMPTS ============

export const JOURNAL_PROMPTS = [
  "What was my biggest challenge this week?",
  "What skill do I want to develop next?",
  "What accomplishment am I most proud of?",
  "What feedback have I received recently?",
  "How can I better prepare for my career goals?",
  "What did I learn today that surprised me?",
  "How am I feeling about my progress?",
  "What would I do differently if I could start over?",
];

// ============ QUERIES ============

/**
 * Fetch all goals for the current user
 */
export function useGoalsQuery(
  careerId?: string,
  options?: Omit<UseQueryOptions<GoalWithProgress[], ApiError>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.goals.list(user?.id || ''),
    queryFn: async () => {
      const params = careerId ? `?careerId=${careerId}` : '';
      const response = await api.get<GoalListResponse | GoalWithProgress[]>(`/goals${params}`);
      
      // Handle both wrapped and direct array responses
      if (Array.isArray(response)) {
        return response;
      }
      return response.goals;
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
  limit?: number,
  options?: Omit<UseQueryOptions<JournalEntry[], ApiError>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.journal.entries(user?.id || ''),
    queryFn: async () => {
      const params = limit ? `?limit=${limit}` : '';
      const response = await api.get<JournalEntryListResponse | JournalEntry[]>(`/journal${params}`);
      
      // Handle both wrapped and direct array responses
      if (Array.isArray(response)) {
        return response;
      }
      return response.entries;
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
      api.post<GoalWithProgress>('/goals', payload),

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
    }) => api.patch<GoalWithProgress>(`/goals/${goalId}`, data),

    onSuccess: (data, variables) => {
      // Update specific goal in cache
      queryClient.setQueryData(
        queryKeys.goals.detail(variables.goalId),
        data
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
      api.post<GoalWithProgress>(`/goals/${goalId}/complete`),

    onSuccess: (data, goalId) => {
      queryClient.setQueryData(queryKeys.goals.detail(goalId), data);

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
 * Update goal progress
 */
export function useUpdateGoalProgress() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      goalId,
      progress,
    }: {
      goalId: string;
      progress: number;
    }) => api.patch<GoalWithProgress>(`/goals/${goalId}/progress?progress=${progress}`),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.goals.detail(variables.goalId), data);

      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.goals.list(user.id),
        });
      }
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Failed to update progress');
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
      api.post<JournalEntry>('/journal', payload),

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
 * Update a journal entry
 */
export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: string;
      data: UpdateJournalEntryPayload;
    }) => api.patch<JournalEntry>(`/journal/${entryId}`, data),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.journal.entry(variables.entryId), data);

      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.journal.entries(user.id),
        });
      }
      toast.success('Journal entry updated!');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Failed to update journal entry');
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
