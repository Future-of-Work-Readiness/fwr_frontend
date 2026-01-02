"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  
  // Mock auth actions (will be replaced with real API calls)
  mockLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  mockSignUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
}

// Generate a mock user for development
const createMockUser = (email: string, fullName?: string): User => ({
  id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  email,
  fullName: fullName || email.split("@")[0],
  avatarUrl: null,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      // Mock authentication - will be replaced with real API calls
      mockLogin: async (email, password) => {
        set({ isLoading: true });
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simple validation
        if (!email || !password) {
          set({ isLoading: false });
          return { success: false, error: "Email and password are required" };
        }

        if (password.length < 6) {
          set({ isLoading: false });
          return { success: false, error: "Invalid credentials" };
        }

        // Create mock user and token
        const user = createMockUser(email);
        const mockToken = `mock_token_${Date.now()}`;

        set({
          user,
          accessToken: mockToken,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      },

      mockSignUp: async (email, password, fullName) => {
        set({ isLoading: true });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Validation
        if (!email || !password) {
          set({ isLoading: false });
          return { success: false, error: "Email and password are required" };
        }

        if (password.length < 8) {
          set({ isLoading: false });
          return { success: false, error: "Password must be at least 8 characters" };
        }

        // Create mock user and token
        const user = createMockUser(email, fullName);
        const mockToken = `mock_token_${Date.now()}`;

        set({
          user,
          accessToken: mockToken,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      },
    }),
    {
      name: "fwr-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

