/**
 * Query Key Factory
 *
 * Centralized, type-safe query keys for cache management.
 *
 * Convention:
 * - Keys are arrays: ['domain', 'entity', 'action/id', filters]
 * - Hierarchical for granular invalidation
 */

export const queryKeys = {
  // ========== AUTH ==========
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // ========== USERS ==========
  users: {
    all: ['users'] as const,
    profile: (id: string) => [...queryKeys.users.all, 'profile', id] as const,
  },

  // ========== CAREERS ==========
  careers: {
    all: ['careers'] as const,
    lists: () => [...queryKeys.careers.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.careers.lists(), userId] as const,
    details: () => [...queryKeys.careers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.careers.details(), id] as const,
    primary: (userId: string) =>
      [...queryKeys.careers.all, 'primary', userId] as const,
    dashboard: (careerId?: string) =>
      [...queryKeys.careers.all, 'dashboard', careerId || 'primary'] as const,
  },

  // ========== ASSESSMENTS ==========
  assessments: {
    all: ['assessments'] as const,
    lists: () => [...queryKeys.assessments.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.assessments.lists(), filters] as const,
    details: () => [...queryKeys.assessments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.assessments.details(), id] as const,
    results: (userId: string) =>
      [...queryKeys.assessments.all, 'results', userId] as const,
    resultsByCareer: (userId: string, careerId: string) =>
      [...queryKeys.assessments.results(userId), careerId] as const,
  },

  // ========== TESTS ==========
  tests: {
    all: ['tests'] as const,
    results: (userId: string) =>
      [...queryKeys.tests.all, 'results', userId] as const,
    resultsBySpecialisation: (
      userId: string,
      specialisation: string,
      level: string
    ) =>
      [...queryKeys.tests.results(userId), specialisation, level] as const,
  },

  // ========== GOALS ==========
  goals: {
    all: ['goals'] as const,
    lists: () => [...queryKeys.goals.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.goals.lists(), userId] as const,
    details: () => [...queryKeys.goals.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.goals.details(), id] as const,
  },

  // ========== JOURNAL ==========
  journal: {
    all: ['journal'] as const,
    entries: (userId: string) =>
      [...queryKeys.journal.all, 'entries', userId] as const,
    entry: (id: string) => [...queryKeys.journal.all, 'entry', id] as const,
  },

  // ========== SKILLS ==========
  skills: {
    all: ['skills'] as const,
    technical: (userId: string) =>
      [...queryKeys.skills.all, 'technical', userId] as const,
    soft: (userId: string) =>
      [...queryKeys.skills.all, 'soft', userId] as const,
  },

  // ========== BENCHMARKING ==========
  benchmarking: {
    all: ['benchmarking'] as const,
    data: (userId: string) =>
      [...queryKeys.benchmarking.all, 'data', userId] as const,
  },

  // ========== SECTORS ==========
  sectors: {
    all: ['sectors'] as const,
    list: () => [...queryKeys.sectors.all, 'list'] as const,
    hierarchy: () => [...queryKeys.sectors.all, 'hierarchy'] as const,
    detail: (id: string) => [...queryKeys.sectors.all, 'detail', id] as const,
    branches: (sectorId: string) => [...queryKeys.sectors.all, 'branches', sectorId] as const,
    sectorHierarchy: (sectorId: string) => [...queryKeys.sectors.all, 'sector-hierarchy', sectorId] as const,
    specializations: (branchId: string) => [...queryKeys.sectors.all, 'specializations', branchId] as const,
  },

  // ========== QUIZZES ==========
  quizzes: {
    all: ['quizzes'] as const,
    list: () => [...queryKeys.quizzes.all, 'list'] as const,
    bySpecialization: (specId: string) => [...queryKeys.quizzes.all, 'by-spec', specId] as const,
    detail: (id: string) => [...queryKeys.quizzes.all, 'detail', id] as const,
    find: (specName: string, level: number) => [...queryKeys.quizzes.all, 'find', specName, level] as const,
    history: (userId: string, filters?: Record<string, unknown>) => 
      [...queryKeys.quizzes.all, 'history', userId, filters] as const,
    progress: (attemptId: string) => [...queryKeys.quizzes.all, 'progress', attemptId] as const,
  },

  // ========== ACTIVITY ==========
  activity: {
    all: ['activity'] as const,
    feed: (userId: string, filters?: Record<string, unknown>) => 
      [...queryKeys.activity.all, 'feed', userId, filters] as const,
    recent: (userId: string, limit?: number) => 
      [...queryKeys.activity.all, 'recent', userId, limit] as const,
    stats: (userId: string) => [...queryKeys.activity.all, 'stats', userId] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;

