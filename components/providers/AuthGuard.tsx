'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeToAuthEvents } from '@/lib/auth/events';
import { queryKeys } from '@/lib/query/keys';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Handle session expiration
  const handleSessionExpired = useCallback(
    (detail: { returnUrl?: string }) => {
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });

      toast.error('Your session has expired. Please log in again.', {
        id: 'session-expired',
        duration: 5000,
      });

      const returnUrl = detail.returnUrl || pathname;
      router.push(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
    },
    [queryClient, router, pathname]
  );

  // Handle forbidden access
  const handleForbidden = useCallback((detail: { resource?: string }) => {
    toast.error('You do not have permission to access this resource.', {
      id: 'forbidden',
      duration: 5000,
      description: detail.resource ? `Resource: ${detail.resource}` : undefined,
    });
  }, []);

  // Handle logout
  const handleLogout = useCallback(
    (detail: { reason?: 'user' | 'expired' | 'error' }) => {
      if (detail.reason === 'user') {
        toast.success('You have been logged out successfully.', {
          id: 'logout-success',
        });
      }

      // Redirect to auth page if on protected route
      const protectedPaths = [
        '/dashboard',
        '/careers',
        '/tests',
        '/goals',
        '/results',
        '/soft-skills',
        '/technical-skills',
        '/benchmarking',
        '/onboarding',
      ];

      const isOnProtectedRoute = protectedPaths.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );

      if (isOnProtectedRoute) {
        router.push('/auth');
      }
    },
    [pathname, router]
  );

  // Subscribe to auth events
  useEffect(() => {
    const unsubscribe = subscribeToAuthEvents({
      'auth:session-expired': handleSessionExpired,
      'auth:forbidden': handleForbidden,
      'auth:logout': handleLogout,
    });
    return unsubscribe;
  }, [handleSessionExpired, handleForbidden, handleLogout]);

  // Cross-tab logout synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth:logout' && event.newValue) {
        queryClient.setQueryData(queryKeys.auth.me(), null);
        queryClient.clear();

        // Only redirect if on protected route
        const protectedPaths = [
          '/dashboard',
          '/careers',
          '/tests',
          '/goals',
          '/results',
          '/soft-skills',
          '/technical-skills',
          '/benchmarking',
          '/onboarding',
        ];

        const isOnProtectedRoute = protectedPaths.some(
          (route) => pathname === route || pathname.startsWith(`${route}/`)
        );

        if (isOnProtectedRoute) {
          router.push('/auth');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [queryClient, router, pathname]);

  return <>{children}</>;
}

