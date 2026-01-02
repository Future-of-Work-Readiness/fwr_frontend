"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { 
  Loader2, ChevronRight, ArrowLeft,
  MessageSquare, Users, Lightbulb, Target, TrendingUp, 
  Shield, Briefcase, Scale, AlertCircle, Clock
} from "lucide-react";
import { SOFT_SKILLS } from "@/lib/constants";

// Icon mapping for soft skills
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  communication: MessageSquare,
  teamwork: Users,
  problem_solving: Lightbulb,
  time_management: Clock,
  adaptability: TrendingUp,
  leadership: Target,
  handling_feedback: AlertCircle,
  dealing_with_conflict: Shield,
  professionalism: Briefcase,
  ethical_judgment: Scale,
};

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    blue: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", hover: "hover:bg-primary/20" },
    green: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", hover: "hover:bg-primary/20" },
    orange: { bg: "bg-orange/10", text: "text-orange", border: "border-orange/20", hover: "hover:bg-orange/20" },
    purple: { bg: "bg-navy/10", text: "text-navy", border: "border-navy/20", hover: "hover:bg-navy/20" },
    cyan: { bg: "bg-cyan/10", text: "text-cyan", border: "border-cyan/20", hover: "hover:bg-cyan/20" },
    indigo: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20", hover: "hover:bg-secondary/20" },
    yellow: { bg: "bg-orange/10", text: "text-orange", border: "border-orange/20", hover: "hover:bg-orange/20" },
    red: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", hover: "hover:bg-destructive/20" },
    slate: { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border", hover: "hover:bg-muted" },
    teal: { bg: "bg-cyan/10", text: "text-cyan", border: "border-cyan/20", hover: "hover:bg-cyan/20" },
  };
  return colors[color] || colors.blue;
};

export default function SoftSkillsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthStore();

  const handleStartTest = (skillId: string) => {
    router.push(`/soft-skills/${skillId}`);
  };

  if (authLoading) {
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
          <div className="max-w-7xl mx-auto space-y-8">
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
                <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-orange bg-clip-text text-transparent">
                  Soft Skills Tests
                </h1>
                <p className="text-muted-foreground text-lg">
                  Test your interpersonal and professional skills. Choose a skill to start the quiz.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SOFT_SKILLS.map((skill, index) => {
                  const colors = getColorClasses(skill.color);
                  const IconComponent = iconMap[skill.id] || MessageSquare;
                  return (
                    <ScrollReveal key={skill.id} delay={index * 0.05}>
                      <Card
                        className={`cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white group h-full ${colors.hover}`}
                        onClick={() => handleStartTest(skill.id)}
                      >
                        <CardHeader>
                          <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <IconComponent className={`h-7 w-7 ${colors.text}`} />
                          </div>
                          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                            {skill.name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {skill.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">8 questions • ~10 min</span>
                            <Button 
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-white gap-1"
                            >
                              Start Quiz <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </main>
      </div>
    </div>
  );
}
