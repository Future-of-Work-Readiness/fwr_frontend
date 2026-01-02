"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CareerProfile, SectorType } from "@/types";

interface CareerState {
  // State
  currentCareer: CareerProfile | null;
  careers: CareerProfile[];
  isLoading: boolean;

  // Actions
  setCurrentCareer: (career: CareerProfile | null) => void;
  setCareers: (careers: CareerProfile[]) => void;
  setLoading: (loading: boolean) => void;
  
  // Career management actions
  addCareer: (careerData: CreateCareerData) => CareerProfile;
  updateCareer: (careerId: string, updates: Partial<CareerProfile>) => void;
  deleteCareer: (careerId: string) => void;
  setPrimaryCareer: (careerId: string) => void;
  
  // Helper actions
  getCareerById: (careerId: string) => CareerProfile | undefined;
  clearCareers: () => void;
}

interface CreateCareerData {
  userId: string;
  sector: SectorType | null;
  field: string | null;
  specialisation: string | null;
  isPrimary?: boolean;
}

// Generate unique career ID
const generateCareerId = () =>
  `career_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useCareerStore = create<CareerState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCareer: null,
      careers: [],
      isLoading: false,

      // Basic setters
      setCurrentCareer: (career) =>
        set({ currentCareer: career }),

      setCareers: (careers) => {
        // Sort by primary first, then by created date
        const sorted = [...careers].sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        set({ careers: sorted });
        
        // Set current career to primary or first
        const primary = sorted.find((c) => c.isPrimary) || sorted[0];
        if (primary) {
          set({ currentCareer: primary });
        }
      },

      setLoading: (loading) =>
        set({ isLoading: loading }),

      // Add a new career profile
      addCareer: (careerData) => {
        const { careers } = get();
        
        const newCareer: CareerProfile = {
          id: generateCareerId(),
          userId: careerData.userId,
          sector: careerData.sector,
          field: careerData.field,
          specialisation: careerData.specialisation,
          readinessScore: 0,
          technicalScore: 0,
          softSkillScore: 0,
          isPrimary: careerData.isPrimary ?? careers.length === 0, // First career is primary by default
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // If this is primary, unset other primaries
        let updatedCareers = careers;
        if (newCareer.isPrimary) {
          updatedCareers = careers.map((c) => ({
            ...c,
            isPrimary: false,
            updatedAt: new Date().toISOString(),
          }));
        }

        const allCareers = [...updatedCareers, newCareer];
        
        // Sort and update state
        const sorted = allCareers.sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        set({
          careers: sorted,
          currentCareer: newCareer.isPrimary ? newCareer : get().currentCareer || newCareer,
        });

        return newCareer;
      },

      // Update an existing career
      updateCareer: (careerId, updates) => {
        const { careers, currentCareer } = get();
        
        const updatedCareers = careers.map((career) =>
          career.id === careerId
            ? { ...career, ...updates, updatedAt: new Date().toISOString() }
            : career
        );

        set({ careers: updatedCareers });

        // Update current career if it was the one updated
        if (currentCareer?.id === careerId) {
          const updated = updatedCareers.find((c) => c.id === careerId);
          if (updated) {
            set({ currentCareer: updated });
          }
        }
      },

      // Delete a career
      deleteCareer: (careerId) => {
        const { careers, currentCareer } = get();
        
        const filteredCareers = careers.filter((c) => c.id !== careerId);
        
        set({ careers: filteredCareers });

        // If we deleted the current career, set a new one
        if (currentCareer?.id === careerId) {
          const newCurrent = filteredCareers.find((c) => c.isPrimary) || filteredCareers[0] || null;
          set({ currentCareer: newCurrent });
        }
      },

      // Set a career as primary
      setPrimaryCareer: (careerId) => {
        const { careers } = get();
        
        const updatedCareers = careers.map((career) => ({
          ...career,
          isPrimary: career.id === careerId,
          updatedAt: new Date().toISOString(),
        }));

        // Sort with primary first
        const sorted = updatedCareers.sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        const primary = sorted.find((c) => c.isPrimary);
        
        set({
          careers: sorted,
          currentCareer: primary || null,
        });
      },

      // Get a career by ID
      getCareerById: (careerId) => {
        return get().careers.find((c) => c.id === careerId);
      },

      // Clear all careers (for logout)
      clearCareers: () =>
        set({
          currentCareer: null,
          careers: [],
        }),
    }),
    {
      name: "fwr-career-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentCareer: state.currentCareer,
        careers: state.careers,
      }),
    }
  )
);

