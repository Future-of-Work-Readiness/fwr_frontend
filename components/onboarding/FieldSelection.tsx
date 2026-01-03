"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TECHNOLOGY_FIELDS, TechnologyFieldType } from "@/lib/constants";
import { ArrowLeft, Code, Database, Shield, Palette, TestTube } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const fieldIcons: Record<TechnologyFieldType, React.ComponentType<{ className?: string }>> = {
  web_software_development: Code,
  data_ai: Database,
  cybersecurity_infrastructure: Shield,
  design_product: Palette,
  quality_testing: TestTube,
};

interface FieldSelectionProps {
  onSelect: (field: TechnologyFieldType) => void;
  onBack: () => void;
}

const FieldSelection = ({ onSelect, onBack }: FieldSelectionProps) => {
  const fields = Object.entries(TECHNOLOGY_FIELDS) as [TechnologyFieldType, typeof TECHNOLOGY_FIELDS[TechnologyFieldType]][];

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
              <span className="font-bold">Select your area of focus within Technology</span>
            </h1>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {fields.map(([fieldKey, field], index) => {
            const IconComponent = fieldIcons[fieldKey];

            return (
              <ScrollReveal key={fieldKey} delay={index * 0.05}>
                <Card
                  className="cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-lg group h-full"
                  onClick={() => onSelect(fieldKey)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div> */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {field.label}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {field.description}
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

export default FieldSelection;

