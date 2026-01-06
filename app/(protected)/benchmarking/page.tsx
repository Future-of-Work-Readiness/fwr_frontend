"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers";
import { useCareerStore } from "@/stores/useCareerStore";
import { usePeerBenchmarkQuery, type PeerBenchmarkData } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, BarChart3, Shield, ArrowRight, ArrowLeft, ChevronDown, 
  TrendingUp, Users, AlertCircle, Trophy, Target
} from "lucide-react";
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

  // Fetch real peer benchmark data
  const { 
    data: peerBenchmark, 
    isLoading: benchmarkLoading,
    isError: benchmarkError 
  } = usePeerBenchmarkQuery();

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

  // Get peer average from benchmark data or fallback
  const getPeerAverage = (category: string): number => {
    if (peerBenchmark?.comparisons) {
      const comparison = peerBenchmark.comparisons.find(
        (c) => c.category === category
      );
      return comparison?.peer_average || 0;
    }
    return 0;
  };

  // Calculate scores for all careers
  const allCareerScores = useMemo<CareerScore[]>(() => {
    return careers.map((career) => {
      const userScore = career.technicalScore || 0;
      // Use real peer average for technical skills, fallback to 0
      const peerAverage = getPeerAverage("Technical Skills");

      return {
        career,
        userScore,
        peerAverage,
        completedLevels: Math.floor(userScore / 20),
      };
    });
  }, [careers, peerBenchmark]);

  // Get selected career
  const selectedCareer = allCareerScores.find((cs) => cs.career.id === selectedCareerId);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "above":
        return "bg-green-100 text-green-800";
      case "below":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

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
              <div className="mb-6 sm:mb-8">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/dashboard")}
                  className="mb-4 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-2">
                  Peer Benchmarking
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Compare your performance with peers in your specialisation
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

            {/* Loading State for Benchmark */}
            {benchmarkLoading && (
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading peer comparison data...</p>
                </div>
              </Card>
            )}

            {/* Not Enough Data Warning */}
            {!benchmarkLoading && !peerBenchmark && (
              <ScrollReveal>
                <Card className="border-orange/30 bg-orange/10">
                  <CardContent className="p-6 flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-orange shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Not Enough Peer Data</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We need more users in your specialisation to provide meaningful peer comparisons.
                        Complete more tests to help build the benchmark data!
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="/technical-skills">
                          Take a Test <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Peer Benchmark Data Display */}
            {peerBenchmark && (
              <>
                {/* Summary Card */}
                <ScrollReveal>
                  <Card className="bg-white border-0 shadow-md">
                    <CardHeader className="pb-2 sm:pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                          <div>
                            <CardTitle className="text-base sm:text-lg">Your Standing</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                              {peerBenchmark.specialization_name || "Your Specialisation"}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit text-xs">
                          <Users className="h-3 w-3" />
                          {peerBenchmark.total_peers} peers
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4 sm:mb-6">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">Overall Percentile</p>
                        <p className="text-4xl sm:text-5xl font-bold text-primary">
                          {peerBenchmark.overall_percentile}
                          <span className="text-xl sm:text-2xl">%</span>
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Better than {peerBenchmark.overall_percentile}% of peers
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>

                {/* Detailed Comparisons */}
                <ScrollReveal delay={0.1}>
                  <Card className="bg-white border-0 shadow-md">
                    <CardHeader className="pb-2 sm:pb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <CardTitle className="text-base sm:text-lg">Score Comparison</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-5 sm:space-y-6">
                        {peerBenchmark.comparisons.map((comparison) => (
                          <div key={comparison.category} className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                              <span className="text-sm sm:text-base font-medium">{comparison.category}</span>
                              <Badge className={`${getStatusColor(comparison.status)} text-xs w-fit`}>
                                {comparison.status === "above" ? "Above Average" : 
                                 comparison.status === "below" ? "Below Average" : "Average"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <div className="flex justify-between text-xs sm:text-sm mb-1">
                                  <span className="text-muted-foreground">Your Score</span>
                                  <span className="font-semibold text-primary">
                                    {comparison.your_score}%
                                  </span>
                                </div>
                                <Progress value={comparison.your_score} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs sm:text-sm mb-1">
                                  <span className="text-muted-foreground">Peer Avg</span>
                                  <span className="font-semibold text-orange">
                                    {comparison.peer_average}%
                                  </span>
                                </div>
                                <Progress 
                                  value={comparison.peer_average} 
                                  className="h-2 [&>div]:bg-orange" 
                                />
                              </div>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              Better than {comparison.percentile}% of peers
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>

                {/* Common Strengths */}
                {peerBenchmark.common_strengths.length > 0 && (
                  <ScrollReveal delay={0.15}>
                    <Card className="bg-white border-0 shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg">Peer Strengths</CardTitle>
                        </div>
                        <CardDescription>
                          Areas where your peers generally excel
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {peerBenchmark.common_strengths.map((strength, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                              <Target className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-medium text-green-800">{strength.area}</p>
                                <p className="text-sm text-green-700">{strength.description}</p>
                                <Badge variant="outline" className="mt-2 text-green-700 border-green-300">
                                  {strength.percentage}% average
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                )}

                {/* Common Gaps */}
                {peerBenchmark.common_gaps.length > 0 && (
                  <ScrollReveal delay={0.2}>
                    <Card className="bg-white border-0 shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-orange" />
                          <CardTitle className="text-lg">Common Improvement Areas</CardTitle>
                        </div>
                        <CardDescription>
                          Areas where most peers need development
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {peerBenchmark.common_gaps.map((gap, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-orange/10 rounded-lg">
                              <Target className="h-5 w-5 text-orange mt-0.5 shrink-0" />
                              <div>
                                <p className="font-medium text-orange">{gap.area}</p>
                                <p className="text-sm text-muted-foreground">{gap.description}</p>
                                <Badge variant="outline" className="mt-2 text-orange border-orange/30">
                                  {gap.percentage}% average
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                )}
              </>
            )}

            {/* Expandable Filter Panel (Career Selection) */}
            {careers.length > 0 && (
              <ScrollReveal>
                <Card className="overflow-hidden">
                  <Collapsible open={isPanelOpen} onOpenChange={setIsPanelOpen}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                          <span className="font-medium text-xs sm:text-sm truncate">
                            Your Career Scores
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

                        {/* Career Score Display */}
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

            {/* Take More Tests CTA */}
            <ScrollReveal delay={0.25}>
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="text-sm sm:text-base font-semibold mb-2">Improve Your Ranking</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Complete additional assessments to improve your scores and climb the rankings
                  </p>
                  <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
                    <Link href="/technical-skills">
                      Go to Tests <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Goals CTA */}
            <ScrollReveal delay={0.3}>
              <Card className="border-orange/30 bg-gradient-to-br from-orange/10 to-transparent">
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="text-sm sm:text-base font-semibold mb-2">Ready to set your goals?</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Use these insights to define your personal development objectives
                  </p>
                  <Button asChild size="sm" className="text-xs sm:text-sm">
                    <Link href="/goals">
                      Set Goals <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
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
