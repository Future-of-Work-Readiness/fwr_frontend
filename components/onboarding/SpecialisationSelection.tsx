"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TECHNOLOGY_FIELDS, 
  TechnologyFieldType, 
  SECTOR_TRACKS, 
  SectorType, 
  formatSpecialisation,
  SPECIALISATION_DESCRIPTIONS,
} from "@/lib/constants";
import { ArrowLeft, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

interface SpecialisationSelectionProps {
  sector: SectorType;
  field?: TechnologyFieldType;
  onSelect: (specialisation: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const SpecialisationSelection = ({ 
  sector, 
  field,
  onSelect, 
  onBack, 
  isLoading 
}: SpecialisationSelectionProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  // For technology sector, use field-based specializations
  // For other sectors, use sector-based tracks
  const specialisations = sector === "technology" && field
    ? TECHNOLOGY_FIELDS[field].specializations
    : SECTOR_TRACKS[sector] || [];

  const handleSelect = (spec: string) => {
    setSelected(spec);
    onSelect(spec);
  };

  // Determine step indicators based on whether we have a field step
  const hasFieldStep = sector === "technology";

  return (
    <div className="min-h-screen gradient-hero p-4 py-12">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
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
              {hasFieldStep && (
                <>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground/30 text-primary-foreground font-bold">
                    ✓
                  </div>
                  <div className="w-16 h-1 bg-primary-foreground/50 rounded" />
                </>
              )}
              <div className="w-10 h-10 rounded-full bg-orange text-primary-foreground flex items-center justify-center font-bold">
                {hasFieldStep ? "3" : "2"}
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-2">
              Choose a Career
            </h1>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {specialisations.map((spec, index) => {
            const isSelected = selected === spec;
            const description = SPECIALISATION_DESCRIPTIONS[spec] || 
              `Specialise in ${formatSpecialisation(spec)}.`;

            return (
              <ScrollReveal key={spec} delay={index * 0.03}>
                <Card
                  className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-lg group h-full ${
                    isSelected 
                      ? "border-orange bg-orange/5" 
                      : "border-transparent hover:border-primary"
                  } ${isLoading && isSelected ? "opacity-70" : ""}`}
                  onClick={() => !isLoading && handleSelect(spec)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg mb-2 transition-colors ${
                          isSelected ? "text-orange" : "group-hover:text-primary"
                        }`}>
                          {formatSpecialisation(spec)}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {description}
                        </p>
                      </div>
                      {isLoading && isSelected && (
                        <Loader2 className="h-5 w-5 animate-spin text-orange shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SpecialisationSelection;

