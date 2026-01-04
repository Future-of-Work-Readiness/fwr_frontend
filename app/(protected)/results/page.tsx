"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers";
import { useCareerStore } from "@/stores/useCareerStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { 
  Loader2, FileText, Calendar, ArrowRight, Clock, ArrowLeft, 
  CheckCircle2, XCircle, Filter, ChevronLeft, ChevronRight 
} from "lucide-react";
import { 
  useQuizHistoryQuery, 
  type QuizAttemptHistory,
  type QuizHistoryFilters 
} from "@/hooks";

const ITEMS_PER_PAGE = 10;

export default function ResultsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { currentCareer } = useCareerStore();

  // Filter state
  const [passedFilter, setPassedFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters object
  const filters: QuizHistoryFilters = {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    ...(passedFilter !== "all" && { passed: passedFilter === "passed" }),
    ...(categoryFilter !== "all" && { category: categoryFilter as "technical" | "soft_skill" }),
  };

  // Fetch assessment history with filters
  const { 
    data: historyData, 
    isLoading: resultsLoading,
    isFetching 
  } = useQuizHistoryQuery(filters);

  const assessmentHistory = historyData?.attempts || [];
  const totalItems = historyData?.total || 0;
  const hasMore = historyData?.hasMore || false;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [passedFilter, categoryFilter]);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  const formatTime = (seconds: number) => {
    if (!seconds || seconds === 0) return "--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore || currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const clearFilters = () => {
    setPassedFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = passedFilter !== "all" || categoryFilter !== "all";

  if (authLoading || (resultsLoading && !historyData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate stats from current page data (or use API total for accurate counts)
  const passedCount = assessmentHistory.filter((a) => a.passed).length;
  const avgScore = assessmentHistory.length > 0
    ? Math.round(assessmentHistory.reduce((acc, a) => acc + a.score, 0) / assessmentHistory.length)
    : 0;

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
            <ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{totalItems}</p>
                    <p className="text-sm text-muted-foreground">Total Tests</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {passedCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Passed (This Page)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange">
                      {avgScore}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Score (This Page)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-cyan">
                      {assessmentHistory.length > 0 
                        ? Math.round((passedCount / assessmentHistory.length) * 100) 
                        : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Pass Rate (This Page)</p>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal delay={0.05}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </CardTitle>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-muted-foreground">Status</label>
                      <Select value={passedFilter} onValueChange={setPassedFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="passed">Passed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-muted-foreground">Category</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="soft_skill">Soft Skills</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Assessment History */}
            <ScrollReveal delay={0.1}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Assessment History</CardTitle>
                      <CardDescription>
                        {totalItems > 0 
                          ? `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of ${totalItems} assessments`
                          : "All your completed assessments and their results"
                        }
                      </CardDescription>
                    </div>
                    {isFetching && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {assessmentHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                      <h3 className="font-semibold mb-2">
                        {hasActiveFilters ? "No matching assessments" : "No assessments yet"}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {hasActiveFilters 
                          ? "Try adjusting your filters to see more results"
                          : "Complete your first assessment to see your results here"
                        }
                      </p>
                      {hasActiveFilters ? (
                        <Button variant="outline" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      ) : (
                        <Button asChild>
                          <Link href="/technical-skills">
                            Browse Tests <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      )}
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
                                {Math.round(assessment.score)}%
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

                  {/* Pagination */}
                  {totalItems > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1 || isFetching}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={currentPage >= totalPages || isFetching}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
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
