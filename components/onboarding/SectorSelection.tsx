"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSectorsQuery, getSectorIcon, formatName, type Sector } from "@/hooks/api";
import { Laptop, Heart, PoundSterling, GraduationCap, HardHat, ArrowLeft, Loader2, Briefcase } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Heart,
  PoundSterling,
  GraduationCap,
  HardHat,
  Briefcase,
};

interface SectorSelectionProps {
  onSelect: (sector: Sector) => void;
  onBack: () => void;
}

const SectorSelection = ({ onSelect, onBack }: SectorSelectionProps) => {
  const { data: sectors, isLoading, error } = useSectorsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
          <p className="text-primary-foreground/70">Loading sectors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-primary-foreground">Failed to load sectors. Please try again.</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Filter out cross_functional sector from onboarding display
  const displaySectors = sectors?.filter(s => s.name !== 'cross_functional') || [];

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
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange text-primary-foreground font-bold">
                1
              </div>
              <div className="w-16 h-1 bg-primary-foreground/30 rounded" />
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 text-primary-foreground/50 flex items-center justify-center font-bold">
                2
              </div>
              <div className="w-16 h-1 bg-primary-foreground/30 rounded" />
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 text-primary-foreground/50 flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-2">
              Choose Your Sector
            </h1>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {displaySectors.map((sector, index) => {
            const iconName = getSectorIcon(sector.name);
            const IconComponent = iconMap[iconName] || Briefcase;

            return (
              <ScrollReveal key={sector.sector_id} delay={index * 0.05}>
                <Card
                  className="cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-lg group h-full"
                  onClick={() => onSelect(sector)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {formatName(sector.name)}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {sector.description || `Explore careers in ${formatName(sector.name)}.`}
                        </p>
                      </div>
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

export default SectorSelection;
