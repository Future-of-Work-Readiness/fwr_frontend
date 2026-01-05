'use client';

import {
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { ApiError } from '@/lib/api/types';
import { useAuth } from '@/components/providers';

// ============ TYPES ============

/**
 * Activity type enum
 */
export type ActivityType =
  | 'quiz_started'
  | 'quiz_completed'
  | 'quiz_passed'
  | 'quiz_failed'
  | 'career_created'
  | 'career_updated'
  | 'career_primary_set'
  | 'goal_created'
  | 'goal_updated'
  | 'goal_completed'
  | 'journal_entry_created'
  | 'badge_earned'
  | 'milestone_reached'
  | 'profile_updated'
  | 'onboarding_completed';

/**
 * Single activity item
 */
export interface Activity {
  id: string;
  activityId: string;
  userId: string;
  activityType: ActivityType;
  title: string;
  description?: string;
  entityType?: string;
  entityId?: string;
  points?: number;
  createdAt: string;
  timeAgo: string;
  icon: string;
}

/**
 * Activity list response from backend
 */
export interface ActivityListResponse {
  activities: Activity[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * Activity stats response
 */
export interface ActivityStats {
  totalActivities: number;
  totalPoints: number;
  byType: Record<string, number>;
}

/**
 * Activity query filters
 */
export interface ActivityFilters {
  limit?: number;
  offset?: number;
  activityType?: ActivityType;
  entityType?: string;
}

// ============ QUERY KEYS ============

export const activityQueryKeys = {
  all: ['activity'] as const,
  list: (userId: string, filters?: string) =>
    [...activityQueryKeys.all, 'list', userId, filters || 'all'] as const,
  recent: (userId: string, limit?: number) =>
    [...activityQueryKeys.all, 'recent', userId, limit || 5] as const,
  stats: (userId: string) =>
    [...activityQueryKeys.all, 'stats', userId] as const,
};

// ============ QUERIES ============

/**
 * Fetch paginated activity feed
 */
export function useActivityFeedQuery(
  filters?: ActivityFilters,
  options?: Omit<
    UseQueryOptions<ActivityListResponse, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();
  const filterKey = filters ? JSON.stringify(filters) : 'all';

  return useQuery({
    queryKey: activityQueryKeys.list(user?.id || '', filterKey),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.limit !== undefined) {
        params.append('limit', String(filters.limit));
      }
      if (filters?.offset !== undefined) {
        params.append('offset', String(filters.offset));
      }
      if (filters?.activityType) {
        params.append('activity_type', filters.activityType);
      }
      if (filters?.entityType) {
        params.append('entity_type', filters.entityType);
      }

      const queryString = params.toString();
      const url = queryString ? `/activity?${queryString}` : '/activity';

      const response = await api.get<ActivityListResponse>(url);
      return response;
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Fetch recent activities for dashboard display
 */
export function useRecentActivitiesQuery(
  limit: number = 5,
  options?: Omit<UseQueryOptions<Activity[], ApiError>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: activityQueryKeys.recent(user?.id || '', limit),
    queryFn: async () => {
      const response = await api.get<Activity[]>(`/activity/recent?limit=${limit}`);
      return response;
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Fetch activity statistics
 */
export function useActivityStatsQuery(
  options?: Omit<UseQueryOptions<ActivityStats, ApiError>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: activityQueryKeys.stats(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<ActivityStats>('/activity/stats');
      return response;
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
}

// ============ UTILITIES ============

/**
 * Get icon name for activity type (matches Lucide icon names)
 */
export function getActivityIcon(activityType: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    quiz_started: 'Play',
    quiz_completed: 'CheckCircle',
    quiz_passed: 'Trophy',
    quiz_failed: 'XCircle',
    career_created: 'Briefcase',
    career_updated: 'Edit',
    career_primary_set: 'Star',
    goal_created: 'Target',
    goal_updated: 'Edit',
    goal_completed: 'CheckSquare',
    journal_entry_created: 'BookOpen',
    badge_earned: 'Award',
    milestone_reached: 'Flag',
    profile_updated: 'User',
    onboarding_completed: 'UserCheck',
  };
  return icons[activityType] || 'Activity';
}

/**
 * Get color class for activity type
 */
export function getActivityColor(activityType: ActivityType): string {
  if (activityType.includes('passed') || activityType.includes('completed')) {
    return 'text-primary';
  }
  if (activityType.includes('failed')) {
    return 'text-destructive';
  }
  if (activityType.includes('created')) {
    return 'text-cyan';
  }
  return 'text-muted-foreground';
}

