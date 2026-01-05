'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useCurrentUser } from '@/hooks/api/useAuth';
import type { SessionUser } from '@/lib/api/types';
import { AuthGuard } from './AuthGuard';

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isFetching: false,
  isError: false,
  refetch: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    isAuthenticated,
    refetch,
  } = useCurrentUser({
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated,
        isLoading,
        isFetching,
        isError,
        refetch,
      }}
    >
      <AuthGuard>{children}</AuthGuard>
    </AuthContext.Provider>
  );
}

