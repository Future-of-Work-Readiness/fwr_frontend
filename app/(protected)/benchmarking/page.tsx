"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers";
import { useCareerStore } from "@/stores/useCareerStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, BarChart3, Shield, ArrowRight, ArrowLeft, ChevronDown, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DonutChart } from "@/components/ui/donut-chart";
import { formatSpecialisation } from "@/lib/constants";
import type { CareerProfile } from "@/types";

interface CareerScore {
  career: CareerProfile;
  userScore: number;
  peerAverage: number;
  completedLevels: number;
}

interface MetricDisplayProps {
  label: string;
  value: number;
  isPrimary: boolean;
}

const MetricDisplay = ({ label, value, isPrimary }: MetricDisplayProps) => (
  <div className="flex flex-col items-center space-y-3">
    <DonutChart
      value={value}
      size={90}
      strokeWidth={10}
      color={isPrimary ? "hsl(var(--primary))" : "hsl(var(--orange))"}
    />
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <Progress
      value={value}
      className={`h-2 w-full ${isPrimary ? "" : "[&>div]:bg-orange"}`}
    />
  </div>
);

export default function BenchmarkingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { careers, currentCareer } = useCareerStore();
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);

  // Initialize selected career when careers load
  useEffect(() => {
    if (careers.length > 0) {
      const primaryCareer = careers.find((c) => c.isPrimary);
      setSelectedCareerId(primaryCareer?.id || careers[0].id);
    }
  }, [careers]);

  // Handle auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    } else if (user) {
      setLoading(false);
    }
  }, [user, authLoading, router]);

  // Calculate peer average based on completed levels (mock)
  const getPeerAverage = (technicalScore: number) => {
    // Mock peer average based on technical score
    if (technicalScore === 0) return 0;
    if (technicalScore < 30) return 45;
    if (technicalScore < 50) return 55;
    if (technicalScore < 70) return 65;
    if (technicalScore < 90) return 70;
    return 75;
  };

  // Calculate scores for all careers
  const allCareerScores = useMemo<CareerScore[]>(() => {
    return careers.map((career) => {
      const userScore = career.technicalScore || 0;
      const peerAverage = getPeerAverage(userScore);

      return {
        career,
        userScore,
        peerAverage,
        completedLevels: Math.floor(userScore / 20),
      };
    });
  }, [careers]);

  // Get selected career
  const selectedCareer = allCareerScores.find((cs) => cs.career.id === selectedCareerId);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 p-4 lg:p-8 pt-8">
          <div className="max-w-6xl mx-auto space-y-8">
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
                <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
                  Peer Benchmarking
                </h1>
                <p className="text-muted-foreground">
                  Select a Career from the dropdown to view how you compare to your peers
                </p>
              </div>
            </ScrollReveal>

            {/* Privacy Note */}
            <ScrollReveal>
              <Card className="border-primary/30 bg-primary/10">
                <CardContent className="p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Privacy Protected</p>
                    <p className="text-sm text-muted-foreground">
                      All comparison data is aggregated and anonymous. Individual user data is never shared.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Expandable Filter Panel */}
            {careers.length > 0 && (
              <ScrollReveal>
                <Card className="overflow-hidden">
                  <Collapsible open={isPanelOpen} onOpenChange={setIsPanelOpen}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                          <span className="font-medium text-xs sm:text-sm truncate">
                            Select a Career from the dropdown to view your benchmarking
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                            {careers.length} registered
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                            isPanelOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t border-border">
                        {/* Career Dropdown */}
                        <div className="p-4 bg-muted/30 border-b border-border">
                          <Select
                            value={selectedCareerId || undefined}
                            onValueChange={setSelectedCareerId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a career" />
                            </SelectTrigger>
                            <SelectContent>
                              {allCareerScores.map(({ career }) => (
                                <SelectItem
                                  key={career.id}
                                  value={career.id}
                                  className="cursor-pointer"
                                >
                                  {career.specialisation
                                    ? formatSpecialisation(career.specialisation)
                                    : career.field || career.sector || "Unknown"}
                                  {career.isPrimary ? " (Primary)" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Specialisation Card */}
                        <div className="p-4 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedCareer && (
                              <Card className="bg-white border-0 shadow-md">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <span className="truncate">
                                      {selectedCareer.career.specialisation
                                        ? formatSpecialisation(selectedCareer.career.specialisation)
                                        : "Career"}
                                    </span>
                                    {selectedCareer.career.isPrimary && (
                                      <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                                        Primary
                                      </span>
                                    )}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                    <MetricDisplay
                                      label="My Score"
                                      value={selectedCareer.userScore}
                                      isPrimary={true}
                                    />
                                    <MetricDisplay
                                      label="Peer Average"
                                      value={selectedCareer.peerAverage}
                                      isPrimary={false}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </ScrollReveal>
            )}

            {/* Readiness Comparison */}
            {selectedCareer && (
              <ScrollReveal delay={0.1}>
                <Card className="bg-white border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Readiness Comparison</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedCareer.career.specialisation
                        ? formatSpecialisation(selectedCareer.career.specialisation)
                        : "Overall Performance"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-md mx-auto">
                      <MetricDisplay
                        label="My Score"
                        value={selectedCareer.userScore}
                        isPrimary={true}
                      />
                      <MetricDisplay
                        label="Peer Average"
                        value={selectedCareer.peerAverage}
                        isPrimary={false}
                      />
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Take More Tests CTA */}
            <ScrollReveal delay={0.15}>
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Take more Tests</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete additional assessments to improve your benchmarking scores
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/technical-skills">
                      Go to Tests <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Goals CTA */}
            <ScrollReveal delay={0.2}>
              <Card className="border-orange/30 bg-gradient-to-br from-orange/10 to-transparent">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Ready to set your goals?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use these insights to define your personal development objectives
                  </p>
                  <Button asChild>
                    <Link href="/goals">
                      Set Goals <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </main>
      </div>
    </div>
  );
}

