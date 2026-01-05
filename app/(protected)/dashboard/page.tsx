"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers";
import { useCareerStore } from "@/stores/useCareerStore";
import { useCareerDashboardQuery, useSpecificCareerDashboardQuery } from "@/hooks";
import { ReadinessGauge, QuickAccessCard } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Loader2, Cpu, Users, TrendingUp, Award, Target } from "lucide-react";
import { formatSpecialisation, SECTOR_LABELS } from "@/lib/constants";
import type { SectorType } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, isFetching: authFetching } = useAuth();
  const { currentCareer, careers, isLoading: careerLoading } = useCareerStore();
  
  // Determine if we should fetch a specific career's dashboard
  // If currentCareer is set and is NOT the primary, fetch its specific dashboard
  const shouldFetchSpecific = currentCareer && !currentCareer.isPrimary;
  
  // Fetch primary career dashboard (used when no specific career is selected or for primary)
  const { 
    data: primaryDashboardData, 
    isLoading: primaryDashboardLoading 
  } = useCareerDashboardQuery({
    enabled: !!user?.onboardingCompleted && !shouldFetchSpecific,
  });
  
  // Fetch specific career dashboard (used when a non-primary career is selected)
  const { 
    data: specificDashboardData, 
    isLoading: specificDashboardLoading 
  } = useSpecificCareerDashboardQuery(currentCareer?.id || '', {
    enabled: !!user?.onboardingCompleted && !!shouldFetchSpecific,
  });
  
  // Use the appropriate dashboard data
  const dashboardData = shouldFetchSpecific ? specificDashboardData : primaryDashboardData;
  const dashboardLoading = shouldFetchSpecific ? specificDashboardLoading : primaryDashboardLoading;
  
  const [isNewUser, setIsNewUser] = useState(false);

  // Use dashboard data if available, fallback to career store
  const goalsCount = dashboardData?.goalsCount ?? 0;
  const readinessScore = dashboardData?.scores.readinessScore ?? currentCareer?.readinessScore ?? 0;
  const totalCareers = dashboardData?.totalCareers ?? careers.length;
  
  // Career info from dashboard or store
  const sector = dashboardData?.sector ?? currentCareer?.sector;
  const field = dashboardData?.field ?? currentCareer?.field;
  const specialisation = dashboardData?.specialisation ?? currentCareer?.specialisation;

  // Check if user is new (created within last 5 minutes)
  useEffect(() => {
    if (user?.createdAt) {
      const createdAt = new Date(user.createdAt);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      setIsNewUser(createdAt > fiveMinutesAgo);
    }
  }, [user]);

  // Redirect to onboarding if not completed
  // Wait for fresh data (not just cached) before redirecting
  useEffect(() => {
    if (!authLoading && !authFetching && isAuthenticated && user && !user.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [authLoading, authFetching, isAuthenticated, user, router]);

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const welcomeMessage = isNewUser ? `Welcome, ${firstName}` : `Welcome Back, ${firstName}`;

  // Show loading state (include authFetching to wait for fresh data)
  if (authLoading || authFetching || careerLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no career exists after loading, show prompt to add career
  if (!careerLoading && !currentCareer && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Career Profile</h2>
          <p className="text-muted-foreground mb-6">Please create a career profile to continue.</p>
          <Button onClick={() => router.push("/add-career")} className="bg-primary hover:bg-primary/90">
            Add Career Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <ScrollReveal>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-orange bg-clip-text text-transparent">
            {welcomeMessage}
          </h1>
          {sector && specialisation && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                {SECTOR_LABELS[sector as SectorType] || sector}
              </span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange/10 text-orange border border-orange/20">
                {formatSpecialisation(specialisation)}
              </span>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Quick Access Cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <QuickAccessCard
            title="Technical Skills Tests"
            description="Tests tailored to your specialisation with 5 skill levels"
            icon={Cpu}
            href="/technical-skills"
            variant="accent"
          />
          <QuickAccessCard
            title="Soft Skills Tests"
            description="Develop communication, teamwork, leadership, and other essential soft skills"
            icon={Users}
            href="/soft-skills"
          />
        </div>
      </ScrollReveal>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <ScrollReveal delay={0.25}>
          <Card className="border-2 border-primary/20 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Goals Set</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {dashboardLoading ? (
                      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin inline" />
                    ) : (
                      goalsCount
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Track your progress</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* Readiness Score Card */}
      <ScrollReveal delay={0.3}>
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 shadow-xl">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-xl flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              My Readiness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4 sm:py-6">
              <ReadinessGauge score={readinessScore} />
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Career Overview */}
      <ScrollReveal delay={0.35}>
        <Card className="border-2 border-primary/20 bg-white shadow-lg">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-xl">Career Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-lg bg-muted/30">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Sector</p>
                <p className="text-sm sm:text-base font-semibold capitalize truncate">{sector?.replace(/_/g, " ") || "N/A"}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-muted/30">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Field</p>
                <p className="text-sm sm:text-base font-semibold capitalize truncate">{field?.replace(/_/g, " ") || "N/A"}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-muted/30">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Specialisation</p>
                <p className="text-sm sm:text-base font-semibold truncate">{specialisation ? formatSpecialisation(specialisation) : "N/A"}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-muted/30">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Career Profiles</p>
                <p className="text-sm sm:text-base font-semibold">{totalCareers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
