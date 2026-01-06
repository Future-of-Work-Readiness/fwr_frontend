/**
 * Sector, Branch, and Specialisation API hooks.
 * Fetches career hierarchy data from the backend.
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/keys';

// ============ TYPES ============

export interface Sector {
  sector_id: string;
  name: string;
  description: string | null;
  created_at?: string | null;
}

export interface Branch {
  branch_id: string;
  name: string;
  description: string | null;
  sector_id: string;
  created_at?: string | null;
}

export interface Specialization {
  specialization_id: string;
  name: string;
  description: string | null;
  branch_id: string;
  created_at?: string | null;
}

export interface SpecializationInHierarchy {
  specialization_id: string;
  name: string;
  description: string | null;
}

export interface BranchInHierarchy {
  branch_id: string;
  name: string;
  description: string | null;
  specializations: SpecializationInHierarchy[];
}

export interface SectorHierarchy {
  sector_id: string;
  name: string;
  description: string | null;
  branches: BranchInHierarchy[];
}

// Icon mapping for sectors (frontend-only visual mapping)
export const SECTOR_ICONS: Record<string, string> = {
  technology: 'Laptop',
  finance: 'PoundSterling',
  health_social_care: 'Heart',
  education: 'GraduationCap',
  construction: 'HardHat',
};

// ============ QUERIES ============

/**
 * Fetch all sectors
 */
export function useSectorsQuery() {
  return useQuery({
    queryKey: queryKeys.sectors.list(),
    queryFn: async () => {
      const data = await api.get<Sector[]>('/sectors');
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - sectors rarely change
  });
}

/**
 * Fetch complete hierarchy (all sectors with branches and specialisations)
 */
export function useSectorsHierarchyQuery() {
  return useQuery({
    queryKey: queryKeys.sectors.hierarchy(),
    queryFn: async () => {
      const data = await api.get<SectorHierarchy[]>('/sectors/hierarchy');
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Fetch a specific sector by ID
 */
export function useSectorQuery(sectorId: string | null) {
  return useQuery({
    queryKey: queryKeys.sectors.detail(sectorId || ''),
    queryFn: async () => {
      if (!sectorId) throw new Error('Sector ID required');
      const data = await api.get<Sector>(`/sectors/${sectorId}`);
      return data;
    },
    enabled: !!sectorId,
    staleTime: 1000 * 60 * 60,
  });
}

/**
 * Fetch branches for a specific sector
 */
export function useBranchesQuery(sectorId: string | null) {
  return useQuery({
    queryKey: queryKeys.sectors.branches(sectorId || ''),
    queryFn: async () => {
      if (!sectorId) throw new Error('Sector ID required');
      const data = await api.get<Branch[]>(`/sectors/${sectorId}/branches`);
      return data;
    },
    enabled: !!sectorId,
    staleTime: 1000 * 60 * 60,
  });
}

/**
 * Fetch full hierarchy for a specific sector
 */
export function useSectorHierarchyQuery(sectorId: string | null) {
  return useQuery({
    queryKey: queryKeys.sectors.sectorHierarchy(sectorId || ''),
    queryFn: async () => {
      if (!sectorId) throw new Error('Sector ID required');
      const data = await api.get<SectorHierarchy>(`/sectors/${sectorId}/hierarchy`);
      return data;
    },
    enabled: !!sectorId,
    staleTime: 1000 * 60 * 60,
  });
}

/**
 * Fetch specialisations for a specific branch
 */
export function useSpecializationsQuery(branchId: string | null) {
  return useQuery({
    queryKey: queryKeys.sectors.specializations(branchId || ''),
    queryFn: async () => {
      if (!branchId) throw new Error('Branch ID required');
      const data = await api.get<Specialization[]>(`/sectors/branches/${branchId}/specializations`);
      return data;
    },
    enabled: !!branchId,
    staleTime: 1000 * 60 * 60,
  });
}

// ============ HELPER FUNCTIONS ============

/**
 * Format a specialisation name for display
 * Converts SNAKE_CASE to Title Case
 */
export function formatSpecializationName(name: string): string {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format a sector/branch name for display
 * Converts snake_case to Title Case
 */
export function formatName(name: string): string {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get icon name for a sector
 */
export function getSectorIcon(sectorName: string): string {
  return SECTOR_ICONS[sectorName.toLowerCase()] || 'Briefcase';
}

