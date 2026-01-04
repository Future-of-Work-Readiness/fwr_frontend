'use client';

import {
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/keys';
import { ApiError } from '@/lib/api/types';
import { useAuth } from '@/components/providers';

// ============ TYPES ============

export interface PeerComparison {
  category: string;
  your_score: number;
  peer_average: number;
  difference: number;
  percentile: number;
  status: 'above' | 'below' | 'average';
}

export interface CommonStrength {
  area: string;
  percentage: number;
  description: string;
}

export interface CommonGap {
  area: string;
  percentage: number;
  description: string;
}

export interface PeerBenchmarkData {
  specialization_name: string;
  total_peers: number;
  comparisons: PeerComparison[];
  overall_percentile: number;
  common_strengths: CommonStrength[];
  common_gaps: CommonGap[];
  last_updated: string | null;
}

export interface PeerBenchmarkResponse {
  success: boolean;
  data: PeerBenchmarkData;
}

// ============ QUERY KEYS ============

export const benchmarkQueryKeys = {
  all: ['benchmarks'] as const,
  peer: (userId: string) => [...benchmarkQueryKeys.all, 'peer', userId] as const,
};

// ============ QUERIES ============

/**
 * Fetch peer benchmark data for the current user
 */
export function usePeerBenchmarkQuery(
  options?: Omit<
    UseQueryOptions<PeerBenchmarkData | null, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: benchmarkQueryKeys.peer(user?.id || ''),
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const response = await api.get<PeerBenchmarkResponse>(
          `/users/${user.id}/peer-benchmark`
        );
        return response.data;
      } catch (error) {
        // Return null if not enough data for comparison
        if (error instanceof ApiError && error.status === 400) {
          console.warn('Not enough peer data for comparison');
          return null;
        }
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Get peer average for a specific score category
 * 
 * This is a utility function to extract peer average from benchmark data
 */
export function getPeerAverageFromBenchmark(
  benchmark: PeerBenchmarkData | null | undefined,
  category: 'Overall Readiness' | 'Technical Skills' | 'Soft Skills' | 'Leadership'
): number {
  if (!benchmark?.comparisons) return 0;
  
  const comparison = benchmark.comparisons.find(c => c.category === category);
  return comparison?.peer_average || 0;
}

/**
 * Get user's percentile for a specific score category
 */
export function getPercentileFromBenchmark(
  benchmark: PeerBenchmarkData | null | undefined,
  category: 'Overall Readiness' | 'Technical Skills' | 'Soft Skills' | 'Leadership'
): number {
  if (!benchmark?.comparisons) return 50;
  
  const comparison = benchmark.comparisons.find(c => c.category === category);
  return comparison?.percentile || 50;
}

