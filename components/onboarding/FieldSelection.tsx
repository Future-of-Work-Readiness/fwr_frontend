"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBranchesQuery, formatName, type Branch } from "@/hooks/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

interface FieldSelectionProps {
  sectorId: string;
  sectorName: string;
  onSelect: (branch: Branch) => void;
  onBack: () => void;
}

const FieldSelection = ({ sectorId, sectorName, onSelect, onBack }: FieldSelectionProps) => {
  const { data: branches, isLoading, error } = useBranchesQuery(sectorId);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
          <p className="text-primary-foreground/70">Loading fields...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-primary-foreground">Failed to load fields. Please try again.</p>
          <Button variant="secondary" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <Button
            variant="ghost"
            onClick={onBack}
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
              <div className="w-16 h-1 bg-orange rounded" />
              <div className="w-10 h-10 rounded-full bg-orange text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div className="w-16 h-1 bg-primary-foreground/30 rounded" />
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 text-primary-foreground/50 flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-2">
              <span className="font-bold">Select your area of focus within {formatName(sectorName)}</span>
            </h1>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {branches?.map((branch, index) => (
            <ScrollReveal key={branch.branch_id} delay={index * 0.05}>
              <Card
                className="cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-lg group h-full"
                onClick={() => onSelect(branch)}
              >
                <CardContent className="p-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {formatName(branch.name)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {branch.description || `Explore careers in ${formatName(branch.name)}.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldSelection;
