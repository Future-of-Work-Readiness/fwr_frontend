"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient instance with useState to ensure it's created once per component lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable retries by default
            retry: false,
            // Stale time of 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache time of 10 minutes
            gcTime: 10 * 60 * 1000,
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === "production",
          },
          mutations: {
            // Disable retries for mutations
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Enable devtools in development only */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}

