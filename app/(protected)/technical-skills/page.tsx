"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCareerStore } from "@/stores/useCareerStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Loader2, Code, ChevronRight, ArrowLeft } from "lucide-react";
import { formatSpecialisation, SECTOR_TRACKS, SKILL_LEVELS, getLevelColor } from "@/lib/constants";

export default function TechnicalSkillsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthStore();
  const { currentCareer, isLoading: careerLoading } = useCareerStore();

  // Group exercises by level
  const exercisesByLevel = SKILL_LEVELS.map((level, levelIndex) => ({
    level,
    levelNumber: levelIndex + 1,
    questionCount: 8,
    totalDuration: (levelIndex + 1) * 15,
    description: `Assess your ${level.toLowerCase()} level skills with 8 comprehensive questions`,
    specialisation: currentCareer?.specialisation || "",
  }));

  if (authLoading || careerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasSpecialisation = !!currentCareer?.specialisation;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 p-4 lg:p-8 pt-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <ScrollReveal>
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/dashboard")}
                    className="text-muted-foreground hover:text-foreground w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-orange bg-clip-text text-transparent">
                  Technical Skills Tests
                </h1>
                <p className="text-muted-foreground text-lg">
                  {currentCareer?.specialisation 
                    ? `Tests tailored for ${formatSpecialisation(currentCareer.specialisation)}`
                    : "Complete your profile to see personalised tests"
                  }
                </p>
              </div>
            </ScrollReveal>

            {!hasSpecialisation ? (
              <Card className="border-2 border-primary/20 bg-white shadow-lg">
                <CardContent className="py-12 text-center">
                  <Code className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No exercises available</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your profile setup to see relevant exercises
                  </p>
                  <Button onClick={() => router.push("/careers/add")} className="bg-primary hover:bg-primary/90">
                    Add Career Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercisesByLevel.map((levelData, levelIndex) => (
                  <ScrollReveal key={levelData.level} delay={levelIndex * 0.1}>
                    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 bg-white group">
                      <CardHeader className="flex-1 pb-3">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <Badge className={`${getLevelColor(levelData.level)} text-sm font-semibold`}>
                            {levelData.level} (Level {levelData.levelNumber})
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                          {levelData.level} Assessment
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {levelData.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-white gap-1 shadow-md hover:shadow-lg transition-all"
                          onClick={() => {
                            router.push(`/tests/${levelData.specialisation}/${levelData.level.toLowerCase()}`);
                          }}
                        >
                          Start Test <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

