"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCareerStore } from "@/stores/useCareerStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Loader2, FileText, Calendar, ArrowRight, Clock, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useAllAssessmentResultsQuery, AssessmentResult } from "@/hooks";

export default function ResultsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentCareer } = useCareerStore();

  // Fetch all assessment results for the user
  const { data: assessmentHistory = [], isLoading: resultsLoading } = useAllAssessmentResultsQuery(user?.id);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (authLoading || resultsLoading) {
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
                  Your Results
                </h1>
                <p className="text-muted-foreground">
                  View your assessment history and track your progress over time
                </p>
              </div>
            </ScrollReveal>

            {/* Stats Summary */}
            {assessmentHistory.length > 0 && (
              <ScrollReveal>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{assessmentHistory.length}</p>
                      <p className="text-sm text-muted-foreground">Total Tests</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {assessmentHistory.filter((a) => a.passed).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Passed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-orange">
                        {Math.round(
                          assessmentHistory.reduce((acc, a) => acc + a.score, 0) /
                            assessmentHistory.length
                        )}
                        %
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Score</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-cyan">
                        {Math.round(
                          (assessmentHistory.filter((a) => a.passed).length /
                            assessmentHistory.length) *
                            100
                        )}
                        %
                      </p>
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            )}

            {/* Assessment History */}
            <ScrollReveal delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>Assessment History</CardTitle>
                  <CardDescription>
                    All your completed assessments and their results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {assessmentHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                      <h3 className="font-semibold mb-2">No assessments yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Complete your first assessment to see your results here
                      </p>
                      <Button asChild>
                        <Link href="/technical-skills">
                          Browse Tests <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assessmentHistory.map((assessment) => {
                        const completedDate = new Date(assessment.completedAt);
                        return (
                          <div
                            key={assessment.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  assessment.passed
                                    ? "bg-primary/10"
                                    : "bg-destructive/10"
                                }`}
                              >
                                {assessment.passed ? (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-destructive" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">
                                  {assessment.testName}
                                </h4>
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{completedDate.toLocaleDateString()}</span>
                                  <span>•</span>
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(assessment.timeTaken)}</span>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">
                                    {assessment.category === "soft_skill"
                                      ? "Soft Skill"
                                      : "Technical"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <div
                                className={`text-xl sm:text-2xl font-bold ${
                                  assessment.passed
                                    ? "text-primary"
                                    : "text-destructive"
                                }`}
                              >
                                {assessment.score}%
                              </div>
                              <Badge
                                variant={assessment.passed ? "default" : "destructive"}
                                className="mt-1"
                              >
                                {assessment.passed ? "Passed" : "Failed"}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* CTA Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <ScrollReveal delay={0.2}>
                <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent h-full">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2">Continue Learning</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Take more tests to improve your skills and boost your readiness score
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/technical-skills">
                        Technical Skills <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.25}>
                <Card className="border-orange/30 bg-gradient-to-br from-orange/10 to-transparent h-full">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2">Compare with Peers</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      See how your performance compares to others in your field
                    </p>
                    <Button asChild>
                      <Link href="/benchmarking">
                        View Benchmarking <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

