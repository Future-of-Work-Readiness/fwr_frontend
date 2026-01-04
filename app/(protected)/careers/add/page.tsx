"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useCareerStore } from "@/stores/useCareerStore";
import { useAddCareer } from "@/hooks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SectorType, TechnologyFieldType } from "@/lib/constants";
import {
  SectorSelection,
  FieldSelection,
  SpecialisationSelection,
} from "@/components/onboarding";

type AddCareerStep = "sector" | "field" | "specialisation";

export default function AddCareerPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { setCurrentCareer } = useCareerStore();
  const [step, setStep] = useState<AddCareerStep>("sector");
  const [sector, setSector] = useState<SectorType | null>(null);
  const [field, setField] = useState<TechnologyFieldType | null>(null);

  const addCareerMutation = useAddCareer();

  const handleSectorSelect = (selectedSector: SectorType) => {
    setSector(selectedSector);
    if (selectedSector === "technology") {
      setStep("field");
    } else {
      setStep("specialisation");
    }
  };

  const handleFieldSelect = (selectedField: TechnologyFieldType) => {
    setField(selectedField);
    setStep("specialisation");
  };

  const handleSpecialisationSelect = async (specialisation: string) => {
    if (!user || !sector) {
      toast.error("Missing user or sector information.");
      return;
    }

    try {
      const result = await addCareerMutation.mutateAsync({
        sector,
        field: field || null,
        specialisation,
        is_primary: false, // New careers are not primary by default
      });

      // Set the new career as current
      if (result.career) {
        setCurrentCareer(result.career);
      }
      toast.success("Career profile created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Error creating career:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create career profile: ${errorMessage}. Please try again.`);
    }
  };

  const handleBackFromField = () => {
    setField(null);
    setStep("sector");
  };

  const handleBackFromSpecialisation = () => {
    if (sector === "technology") {
      setStep("field");
    } else {
      setStep("sector");
    }
  };

  const handleBackFromSector = () => {
    router.push("/careers");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
      </div>
    );
  }

  switch (step) {
    case "sector":
      return <SectorSelection onSelect={handleSectorSelect} onBack={handleBackFromSector} />;
    case "field":
      return <FieldSelection onSelect={handleFieldSelect} onBack={handleBackFromField} />;
    case "specialisation":
      return sector ? (
        <SpecialisationSelection
          sector={sector}
          field={field || undefined}
          onSelect={handleSpecialisationSelect}
          onBack={handleBackFromSpecialisation}
          isLoading={addCareerMutation.isPending}
        />
      ) : null;
    default:
      return null;
  }
}

