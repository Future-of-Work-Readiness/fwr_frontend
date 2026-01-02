"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCareerStore } from "@/stores/useCareerStore";
import { useSubmitTestResultMutation } from "@/hooks/useTestMutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Clock, Target, TrendingUp, BookOpen } from "lucide-react";
import { SOFT_SKILLS } from "@/lib/constants";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TestResultsState {
  questions: Question[];
  answers: number[];
  score: number;
  timeTaken: number;
  skillId: string;
  skillName: string;
}

export default function SoftSkillResultsPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;
  
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentCareer, updateCareer } = useCareerStore();
  const submitResultMutation = useSubmitTestResultMutation();
  
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<TestResultsState | null>(null);
  const [resultsSaved, setResultsSaved] = useState(false);

  const skill = SOFT_SKILLS.find(s => s.id === skillId);

  useEffect(() => {
    const storedData = sessionStorage.getItem("softSkillTestResults");
    if (storedData) {
      const data = JSON.parse(storedData) as TestResultsState;
      setTestData(data);
      setLoading(false);
    } else {
      router.push("/soft-skills");
    }
  }, [router]);

  // Save results when test data is loaded
  useEffect(() => {
    const saveResults = async () => {
      if (testData && user && currentCareer && !resultsSaved) {
        try {
          const passed = testData.score >= 70;
          
          await submitResultMutation.mutateAsync({
            userId: user.id,
            careerId: currentCareer.id,
            specialisation: `soft_skill_${testData.skillId}`,
            level: "standard",
            score: testData.score,
            passed,
            timeTaken: testData.timeTaken,
            questionsCount: testData.questions.length,
          });

          // Update soft skill score on pass
          if (passed && currentCareer) {
            const newSoftSkillScore = Math.max(currentCareer.softSkillScore, testData.score);
            const newReadinessScore = Math.round((currentCareer.technicalScore + newSoftSkillScore) / 2);
            
            updateCareer(currentCareer.id, {
              softSkillScore: newSoftSkillScore,
              readinessScore: newReadinessScore,
            });
            
            toast.success("Your soft skill scores have been updated!");
          }

          setResultsSaved(true);
          sessionStorage.removeItem("softSkillTestResults");
        } catch (error) {
          console.error("Failed to save results:", error);
        }
      }
    };

    saveResults();
  }, [testData, user, currentCareer, resultsSaved, submitResultMutation, updateCareer]);

  if (authLoading || loading || !testData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { questions, answers, score, timeTaken, skillName } = testData;
  const passed = score >= 70;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getRecommendations = () => {
    if (score >= 90) {
      return [
        `Excellent ${skillName} skills! You demonstrate mastery in this area.`,
        "Consider mentoring others in this skill.",
        "Explore advanced scenarios and case studies.",
      ];
    } else if (score >= 70) {
      return [
        "Good understanding! Review the questions you missed.",
        "Practice applying these concepts in real situations.",
        "Consider retaking to improve your score.",
      ];
    } else {
      return [
        `Review the fundamental concepts of ${skillName}.`,
        "Study each explanation carefully.",
        "Practice more before retaking the quiz.",
      ];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 lg:p-8 pt-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
            Quiz Results
          </h1>
          <p className="text-muted-foreground text-lg">
            {skillName}
          </p>
        </div>

        {/* Pass/Fail Status */}
        <Card className={`mb-6 border-2 ${passed ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {passed ? (
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                ) : (
                  <XCircle className="h-12 w-12 text-destructive" />
                )}
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {passed ? "Passed" : "Not Passed"}
                  </h2>
                  <p className="text-muted-foreground">
                    Score: {score}% (Minimum: 70%)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{score}%</div>
                <Progress value={score} className="mt-2 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Metadata */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quiz Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Questions Answered</p>
                <p className="text-lg font-semibold">{questions.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time Taken</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeTaken)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Skill Category</p>
                <Badge>{skillName}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalized Feedback */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Personalized Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Assessment</h3>
                <p className="text-muted-foreground">
                  {score >= 70
                    ? `You've demonstrated a solid understanding of ${skillName}. Continue developing this skill through practice and real-world application.`
                    : `Focus on reviewing the fundamental concepts of ${skillName}. Take your time to understand each scenario and the reasoning behind the correct answers.`}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {getRecommendations().map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Question Review
            </CardTitle>
            <CardDescription>
              Review each question, your answer, and the correct answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div key={question.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">
                        Question {index + 1}
                      </h3>
                      {isCorrect ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                          <XCircle className="h-3 w-3 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                    <p className="mb-4">{question.text}</p>
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer = userAnswer === optIndex;
                        const isCorrectAnswer = optIndex === question.correctAnswer;
                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? "border-primary bg-primary/10"
                                : isUserAnswer
                                ? "border-destructive bg-destructive/10"
                                : "border-border"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && (
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <XCircle className="h-4 w-4 text-destructive shrink-0" />
                              )}
                              <span
                                className={
                                  isCorrectAnswer
                                    ? "font-semibold text-primary"
                                    : isUserAnswer
                                    ? "font-semibold text-destructive"
                                    : ""
                                }
                              >
                                {option}
                              </span>
                              {isCorrectAnswer && (
                                <Badge className="ml-auto bg-primary text-primary-foreground shrink-0">Correct Answer</Badge>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <Badge className="ml-auto bg-destructive text-destructive-foreground shrink-0">Your Answer</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="text-sm text-foreground">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/soft-skills")}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Try Another Skill
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex-1"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/soft-skills/${skillId}`)}
            className="flex-1"
          >
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

