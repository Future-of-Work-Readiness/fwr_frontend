"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCareerStore } from "@/stores/useCareerStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { CareerProfile, SectorType } from "@/types";

// Mock API delay
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock fetch careers API - returns careers from Zustand (simulating API)
const mockFetchCareersApi = async (userId: string): Promise<CareerProfile[]> => {
  await mockDelay(300);
  // In a real app, this would fetch from backend
  // For now, we rely on Zustand persisted state
  return [];
};

// Mock set primary career API
const mockSetPrimaryCareerApi = async (careerId: string): Promise<{ success: boolean }> => {
  await mockDelay(500);
  return { success: true };
};

// Fetch careers query hook
export function useCareersQuery(userId: string | undefined) {
  const { careers, setCareers } = useCareerStore();
  
  return useQuery({
    queryKey: ["careers", userId],
    queryFn: async () => {
      if (!userId) return [];
      await mockFetchCareersApi(userId);
      // Return from Zustand store (persisted)
      return careers;
    },
    enabled: !!userId,
    initialData: careers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Set primary career mutation hook
export function useSetPrimaryCareerMutation() {
  const queryClient = useQueryClient();
  const { setPrimaryCareer } = useCareerStore();

  return useMutation({
    mutationFn: mockSetPrimaryCareerApi,
    onSuccess: (_, careerId) => {
      setPrimaryCareer(careerId);
      queryClient.invalidateQueries({ queryKey: ["careers"] });
    },
  });
}

// Create career profile payload
interface CreateCareerPayload {
  userId: string;
  sector: SectorType;
  field: string | null;
  specialisation: string;
  isPrimary?: boolean;
}

// Create career profile response
interface CreateCareerResponse {
  career: CareerProfile;
}

// Mock create career API
const mockCreateCareerApi = async (payload: CreateCareerPayload): Promise<CreateCareerResponse> => {
  await mockDelay(800);

  const career: CareerProfile = {
    id: `career_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: payload.userId,
    sector: payload.sector,
    field: payload.field,
    specialisation: payload.specialisation,
    readinessScore: 0,
    technicalScore: 0,
    softSkillScore: 0,
    isPrimary: payload.isPrimary ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { career };
};

// Complete onboarding payload
interface CompleteOnboardingPayload {
  userId: string;
  sector: SectorType;
  field: string | null;
  specialisation: string;
}

// Complete onboarding response
interface CompleteOnboardingResponse {
  career: CareerProfile;
  success: boolean;
}

// Mock complete onboarding API
const mockCompleteOnboardingApi = async (payload: CompleteOnboardingPayload): Promise<CompleteOnboardingResponse> => {
  await mockDelay(1000);

  const career: CareerProfile = {
    id: `career_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: payload.userId,
    sector: payload.sector,
    field: payload.field,
    specialisation: payload.specialisation,
    readinessScore: 0,
    technicalScore: 0,
    softSkillScore: 0,
    isPrimary: true, // First career is always primary
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { career, success: true };
};

// Create career mutation hook
export function useCreateCareerMutation() {
  const { addCareer, setCurrentCareer } = useCareerStore();

  return useMutation({
    mutationFn: mockCreateCareerApi,
    onSuccess: (data) => {
      addCareer(data.career);
      if (data.career.isPrimary) {
        setCurrentCareer(data.career);
      }
    },
  });
}

// Complete onboarding mutation hook
export function useCompleteOnboardingMutation() {
  const { addCareer, setCurrentCareer } = useCareerStore();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: mockCompleteOnboardingApi,
    onSuccess: (data) => {
      // Add career to store
      addCareer(data.career);
      setCurrentCareer(data.career);

      // Update user to mark onboarding as complete
      if (user) {
        setUser({
          ...user,
          onboardingCompleted: true,
          updatedAt: new Date().toISOString(),
        });
      }
    },
  });
}

// Add new career mutation hook (for adding additional careers after onboarding)
export function useAddCareerMutation() {
  const queryClient = useQueryClient();
  const { addCareer, setCurrentCareer } = useCareerStore();

  return useMutation({
    mutationFn: async (payload: CreateCareerPayload): Promise<CreateCareerResponse> => {
      await mockDelay(800);
      
      const career: CareerProfile = {
        id: `career_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: payload.userId,
        sector: payload.sector,
        field: payload.field,
        specialisation: payload.specialisation,
        readinessScore: 0,
        technicalScore: 0,
        softSkillScore: 0,
        isPrimary: payload.isPrimary ?? false, // New careers are not primary by default
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { career };
    },
    onSuccess: (data) => {
      addCareer(data.career);
      setCurrentCareer(data.career);
      queryClient.invalidateQueries({ queryKey: ["careers"] });
    },
  });
}

