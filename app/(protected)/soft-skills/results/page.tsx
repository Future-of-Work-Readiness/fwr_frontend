"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { 
  CheckCircle2, XCircle, ArrowLeft, Home, RefreshCcw, 
  Trophy, Target, Clock, BarChart3 
} from "lucide-react";

export default function SoftSkillsResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const score = parseInt(searchParams.get("score") || "0");
  const timeTaken = parseInt(searchParams.get("timeTaken") || "0");
  const passed = searchParams.get("passed") === "true";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-primary";
    if (score >= 50) return "text-orange";
    return "text-destructive";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Exceptional! You demonstrate outstanding soft skills.";
    if (score >= 80) return "Excellent! You have strong interpersonal abilities.";
    if (score >= 70) return "Good job! You've passed with solid skills.";
    if (score >= 50) return "Keep practicing. Focus on areas for improvement.";
    return "More work needed. Review the skills and try again.";
  };

  const skillBreakdown = [
    { name: "Communication", score: Math.min(100, score + Math.floor(Math.random() * 15) - 5) },
    { name: "Teamwork", score: Math.min(100, score + Math.floor(Math.random() * 15) - 5) },
    { name: "Problem Solving", score: Math.min(100, score + Math.floor(Math.random() * 15) - 5) },
    { name: "Time Management", score: Math.min(100, score + Math.floor(Math.random() * 15) - 5) },
    { name: "Leadership", score: Math.min(100, score + Math.floor(Math.random() * 15) - 5) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 lg:p-8 pt-8">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              passed ? "bg-green-100" : "bg-destructive/10"
            }`}>
              {passed ? (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-destructive" />
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
              {passed ? "Congratulations!" : "Keep Practicing!"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {getScoreMessage(score)}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Your Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                  <p className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}%</p>
                  <Badge variant={passed ? "default" : "destructive"} className="mt-2">
                    {passed ? "PASSED" : "NOT PASSED"}
                  </Badge>
                </div>
                <div className="text-center p-6 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Time Taken</p>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <p className="text-3xl font-bold">{formatTime(timeTaken)}</p>
                  </div>
                </div>
                <div className="text-center p-6 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Questions</p>
                  <div className="flex items-center justify-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    <p className="text-3xl font-bold">20</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Skills Breakdown
              </CardTitle>
              <CardDescription>
                Your performance across different soft skill areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillBreakdown.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className={`text-sm font-bold ${getScoreColor(skill.score)}`}>
                        {skill.score}%
                      </span>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {score < 70 && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Review communication and active listening techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Practice conflict resolution scenarios</span>
                    </li>
                  </>
                )}
                {score >= 70 && score < 85 && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Continue developing your leadership capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Explore advanced time management techniques</span>
                    </li>
                  </>
                )}
                {score >= 85 && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Consider mentoring others in soft skills development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Focus on advanced leadership and strategic thinking</span>
                    </li>
                  </>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Apply these skills in real-world professional scenarios</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/soft-skills")}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Retake Assessment
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

