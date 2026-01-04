'use client';

import { type ReactNode } from 'react';
import { useSyncCareers } from '@/hooks/api/useCareers';
import { useAuth } from './AuthProvider';

interface CareerProviderProps {
  children: ReactNode;
}

/**
 * CareerProvider syncs careers from API to Zustand store.
 * 
 * This provider bridges server state (TanStack Query) with client state (Zustand).
 * It must be placed inside AuthProvider since it depends on user authentication.
 * 
 * What it does:
 * - Fetches careers from API when user is authenticated
 * - Syncs careers to Zustand store for:
 *   - LocalStorage persistence (instant load on next visit)
 *   - `currentCareer` context (which career is the user viewing)
 *   - Cross-component access without prop drilling
 */
export function CareerProvider({ children }: CareerProviderProps) {
  const { isAuthenticated, user } = useAuth();
  
  // Only sync careers when user is authenticated and has completed onboarding
  // The hook handles the actual sync logic
  const shouldSync = isAuthenticated && user?.onboardingCompleted;
  
  return (
    <>
      {shouldSync && <CareerSync />}
      {children}
    </>
  );
}

/**
 * Internal component that actually calls the sync hook.
 * Separated to avoid hook call when user is not authenticated.
 */
function CareerSync() {
  useSyncCareers();
  return null;
}

