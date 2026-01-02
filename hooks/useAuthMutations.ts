"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { loginSchema, signUpSchema } from "@/lib/validations/auth";
import type { User } from "@/types";

// Mock API delay
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate a mock user
const createMockUser = (email: string, fullName?: string): User => ({
  id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  email,
  fullName: fullName || email.split("@")[0],
  avatarUrl: null,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Mock login API response
interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
}

const mockLoginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  await mockDelay(800);

  // Validate with Zod
  const result = loginSchema.safeParse(payload);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  // Mock: Check for "demo" accounts for testing onboarding flow
  const isOnboardingComplete = payload.email.includes("complete");
  
  const user = createMockUser(payload.email);
  user.onboardingCompleted = isOnboardingComplete;

  return {
    user,
    accessToken: `mock_token_${Date.now()}`,
  };
};

// Mock signup API response
interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

interface SignUpResponse {
  user: User;
  accessToken: string;
}

const mockSignUpApi = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  await mockDelay(1000);

  // Validate with Zod
  const result = signUpSchema.safeParse(payload);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  // Mock: Simulate "already registered" error for specific email
  if (payload.email === "existing@example.com") {
    throw new Error("This email is already registered. Please log in instead.");
  }

  const user = createMockUser(payload.email, payload.fullName);
  user.onboardingCompleted = false; // New users need onboarding

  return {
    user,
    accessToken: `mock_token_${Date.now()}`,
  };
};

// Login mutation hook
export function useLoginMutation() {
  const { setUser, setAccessToken, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: mockLoginApi,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
}

// Sign up mutation hook
export function useSignUpMutation() {
  const { setUser, setAccessToken, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: mockSignUpApi,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
}

// Logout mutation hook
export function useLogoutMutation() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await mockDelay(300);
      return true;
    },
    onSuccess: () => {
      logout();
    },
  });
}

