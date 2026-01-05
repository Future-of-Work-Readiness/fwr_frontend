"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpecializationsQuery, formatSpecializationName, type Specialization } from "@/hooks/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

interface SpecialisationSelectionProps {
  branchId: string;
  branchName: string;
  onSelect: (specialization: Specialization) => void;
  onBack: () => void;
  isLoading: boolean;
  excludedSpecialisations?: string[];
}

const SpecialisationSelection = ({ 
  branchId,
  branchName,
  onSelect, 
  onBack, 
  isLoading: isSubmitting,
  excludedSpecialisations = []
}: SpecialisationSelectionProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: specializations, isLoading, error } = useSpecializationsQuery(branchId);
  
  // Filter out already-selected specializations
  const availableSpecializations = specializations?.filter(
    spec => !excludedSpecialisations.includes(spec.name.toUpperCase())
  );

  const handleSelect = (spec: Specialization) => {
    setSelected(spec.specialization_id);
    onSelect(spec);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
          <p className="text-primary-foreground/70">Loading careers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-primary-foreground">Failed to load careers. Please try again.</p>
          <Button variant="secondary" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero p-4 py-12">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isSubmitting}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground/30 text-primary-foreground font-bold">
                ✓
              </div>
              <div className="w-16 h-1 bg-primary-foreground/50 rounded" />
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground/30 text-primary-foreground font-bold">
                ✓
              </div>
              <div className="w-16 h-1 bg-primary-foreground/50 rounded" />
              <div className="w-10 h-10 rounded-full bg-orange text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-2">
              Choose a Career
            </h1>
            {branchName && (
              <p className="text-primary-foreground/70">
                in {formatSpecializationName(branchName)}
              </p>
            )}
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {availableSpecializations && availableSpecializations.length > 0 ? (
            availableSpecializations.map((spec, index) => {
              const isSelected = selected === spec.specialization_id;

              return (
                <ScrollReveal key={spec.specialization_id} delay={index * 0.03}>
                  <Card
                    className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-lg group h-full ${
                      isSelected 
                        ? "border-orange bg-orange/5" 
                        : "border-transparent hover:border-primary"
                    } ${isSubmitting && isSelected ? "opacity-70" : ""}`}
                    onClick={() => !isSubmitting && handleSelect(spec)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg mb-2 transition-colors ${
                            isSelected ? "text-orange" : "group-hover:text-primary"
                          }`}>
                            {formatSpecializationName(spec.name)}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {spec.description || `Specialise in ${formatSpecializationName(spec.name)}.`}
                          </p>
                        </div>
                        {isSubmitting && isSelected && (
                          <Loader2 className="h-5 w-5 animate-spin text-orange shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-primary-foreground/70">
                You already have all available careers in this field.
              </p>
              <Button 
                variant="secondary" 
                onClick={onBack} 
                className="mt-4"
              >
                Choose a Different Field
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialisationSelection;
