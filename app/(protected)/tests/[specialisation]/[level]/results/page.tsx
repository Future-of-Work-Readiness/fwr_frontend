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
import { formatSpecialisation, SKILL_LEVELS } from "@/lib/constants";
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
  level: string;
  specialisation: string;
}

export default function TestResultsPage() {
  const router = useRouter();
  const params = useParams();
  const specialisation = params.specialisation as string;
  const level = params.level as string;
  
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentCareer, updateCareer } = useCareerStore();
  const submitResultMutation = useSubmitTestResultMutation();
  
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<TestResultsState | null>(null);
  const [resultsSaved, setResultsSaved] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("testResults");
    if (storedData) {
      const data = JSON.parse(storedData) as TestResultsState;
      setTestData(data);
      setLoading(false);
    } else {
      router.push("/technical-skills");
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
            specialisation: testData.specialisation,
            level: testData.level,
            score: testData.score,
            passed,
            timeTaken: testData.timeTaken,
            questionsCount: testData.questions.length,
          });

          // Update career scores on pass
          if (passed && currentCareer) {
            const newTechnicalScore = Math.max(currentCareer.technicalScore, testData.score);
            const newReadinessScore = Math.round((newTechnicalScore + currentCareer.softSkillScore) / 2);
            
            updateCareer(currentCareer.id, {
              technicalScore: newTechnicalScore,
              readinessScore: newReadinessScore,
            });
            
            toast.success("Your career scores have been updated!");
          }

          setResultsSaved(true);
          // Clear session storage
          sessionStorage.removeItem("testResults");
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

  const { questions, answers, score, timeTaken, level: testLevel, specialisation: testSpec } = testData;
  const passed = score >= 70;
  const levelDisplay = testLevel.charAt(0).toUpperCase() + testLevel.slice(1);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getRecommendations = () => {
    if (score >= 90) {
      return [
        "Excellent performance! Consider moving to the next level.",
        "Continue practicing advanced concepts.",
        "Share your knowledge with peers.",
      ];
    } else if (score >= 70) {
      return [
        "Good work! Review the questions you missed.",
        "Practice more on the topics you found challenging.",
        "Consider retaking to improve your score.",
      ];
    } else {
      return [
        "Review the fundamental concepts for this level.",
        "Take time to understand each explanation.",
        "Practice more before attempting the next level.",
      ];
    }
  };

  const getNextLevel = () => {
    const currentIndex = SKILL_LEVELS.findIndex(l => l.toLowerCase() === testLevel.toLowerCase());
    if (currentIndex < SKILL_LEVELS.length - 1) {
      return SKILL_LEVELS[currentIndex + 1].toLowerCase();
    }
    return null;
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
            Test Results
          </h1>
          <p className="text-muted-foreground text-lg">
            {formatSpecialisation(testSpec)} – {levelDisplay}
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

        {/* Readiness Breakdown */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Overall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{score}%</div>
              <Progress value={score} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Technical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{score}%</div>
              <Progress value={score} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Soft Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">--</div>
              <Progress value={0} />
            </CardContent>
          </Card>
        </div>

        {/* Test Metadata */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Test Information
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
                <p className="text-sm text-muted-foreground mb-1">Difficulty Level</p>
                <Badge>{levelDisplay}</Badge>
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
                <h3 className="font-semibold mb-2">Improvement Advice</h3>
                <p className="text-muted-foreground">
                  {score >= 70
                    ? "You've demonstrated a solid understanding of the concepts. Continue building on this foundation and explore more advanced topics."
                    : "Focus on reviewing the fundamental concepts. Take your time to understand each topic thoroughly before moving forward."}
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
          {getNextLevel() && (
            <Button
              onClick={() => router.push(`/tests/${testSpec}/${getNextLevel()}`)}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Start Next Level
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex-1"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/tests/${testSpec}/${testLevel}`)}
            className="flex-1"
          >
            Retake Test
          </Button>
        </div>
      </div>
    </div>
  );
}

