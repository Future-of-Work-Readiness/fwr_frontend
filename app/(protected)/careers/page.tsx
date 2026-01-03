"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers";
import { useCareerStore } from "@/stores/useCareerStore";
import { useCareersQuery, useSetPrimaryCareer } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Loader2, ArrowLeft, Plus, Award, Star } from "lucide-react";
import { formatSpecialisation, SECTOR_LABELS } from "@/lib/constants";
import { toast } from "sonner";
import type { CareerProfile } from "@/types";

export default function CareersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { careers, isLoading: careersLoading, setCurrentCareer } = useCareerStore();
  const { isLoading: queryLoading } = useCareersQuery();
  const setPrimaryMutation = useSetPrimaryCareer();

  const handleOpenDashboard = (career: CareerProfile) => {
    setCurrentCareer(career);
    router.push("/dashboard");
  };

  const handleSetPrimary = async (careerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await setPrimaryMutation.mutateAsync(careerId);
      toast.success("Primary career updated successfully!");
    } catch (error) {
      toast.error("Failed to update primary career");
    }
  };

  if (authLoading || careersLoading || queryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-orange bg-clip-text text-transparent">
                My Careers
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Add more careers, change your primary career and see which career require more development
              </p>
            </div>
            <Button
              onClick={() => router.push("/careers/add")}
              className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Career
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {careers.length === 0 ? (
        <Card className="border-2 border-primary/20 bg-white shadow-lg">
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 mx-auto text-primary/60 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No careers yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first career profile to get started
            </p>
            <Button onClick={() => router.push("/careers/add")} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Career
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career, index) => (
            <ScrollReveal key={career.id} delay={index * 0.1}>
              <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 bg-white group">
                <CardHeader className="flex-1 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {career.isPrimary && (
                      <Badge className="bg-orange/10 text-orange border-orange/20 text-xs font-semibold">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {career.specialisation 
                      ? formatSpecialisation(career.specialisation)
                      : "Career Profile"
                    }
                  </CardTitle>
                  <CardDescription className="text-sm space-y-1">
                    {career.sector && (
                      <div>
                        <span className="font-medium">Sector:</span> {SECTOR_LABELS[career.sector] || career.sector}
                      </div>
                    )}
                    {career.field && (
                      <div>
                        <span className="font-medium">Field:</span> {career.field.replace(/_/g, " ")}
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Readiness Score</span>
                      <span className="text-2xl font-bold text-primary">
                        {career.readinessScore || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenDashboard(career)}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    >
                      Open Dashboard
                    </Button>
                    {!career.isPrimary && (
                      <Button
                        variant="outline"
                        onClick={(e) => handleSetPrimary(career.id, e)}
                        disabled={setPrimaryMutation.isPending}
                        size="sm"
                        title="Set as primary"
                      >
                        {setPrimaryMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

