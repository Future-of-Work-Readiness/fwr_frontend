"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useCareerStore } from "@/stores/useCareerStore";
import { useFindQuizQuery, useStartQuiz, useSubmitQuiz, type QuizAnswer } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { 
  Loader2, ChevronRight, ChevronLeft, ArrowLeft, Clock, Users, 
  MessageSquare, Target, TrendingUp, AlertCircle, Play
} from "lucide-react";
import { toast } from "sonner";

type TestState = "intro" | "testing" | "submitting";

export default function SoftSkillsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { currentCareer } = useCareerStore();
  
  // Fetch soft skills quiz from backend (difficulty level 1)
  const { 
    data: quizData, 
    isLoading: quizLoading, 
    isError: quizError,
    error: quizErrorDetails 
  } = useFindQuizQuery("SOFT_SKILLS", 1);
  
  // Mutations
  const startQuizMutation = useStartQuiz();
  const submitQuizMutation = useSubmitQuiz();
  
  // Local state
  const [testState, setTestState] = useState<TestState>("intro");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Derived values
  const questions = quizData?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const canProceed = currentQuestion && selectedAnswers.has(currentQuestion.question_id);
  const answeredCount = selectedAnswers.size;

  // Skills covered (derive from quiz or use defaults)
  const skillsAreas = [
    "Communication", "Teamwork", "Problem Solving", "Time Management", 
    "Adaptability", "Leadership", "Handling Feedback", "Conflict Resolution", 
    "Professionalism", "Ethical Judgment"
  ];

  // Initialize timer when quiz starts
  useEffect(() => {
    if (testState === "testing" && quizData && timeRemaining === null) {
      setTimeRemaining(quizData.time_limit_minutes * 60);
      setStartTime(Date.now());
    }
  }, [testState, quizData, timeRemaining]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || testState !== "testing") return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, testState]);

  // Start test
  const startTest = useCallback(async () => {
    if (!quizData) return;
    
    try {
      const response = await startQuizMutation.mutateAsync(quizData.quiz_id);
      setAttemptId(response.attempt_id);
      setSelectedAnswers(new Map());
      setCurrentQuestionIndex(0);
      setTimeRemaining(null); // Will be set by effect
      setTestState("testing");
    } catch (error) {
      console.error("Failed to start quiz:", error);
      toast.error("Failed to start assessment. Please try again.");
    }
  }, [quizData, startQuizMutation]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((key: string) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQuestion.question_id, key);
      return newMap;
    });
  }, [currentQuestion]);

  // Navigate questions
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Submit test
  const handleSubmit = useCallback(async () => {
    if (!attemptId || testState === "submitting") return;
    
    setTestState("submitting");
    
    // Build answers array
    const answers: QuizAnswer[] = questions.map((q) => ({
      question_id: q.question_id,
      selected_key: selectedAnswers.get(q.question_id) || "A", // Default to A if not answered
    }));
    
    try {
      const result = await submitQuizMutation.mutateAsync({ attemptId, answers });
      
      // Store result for results page
      sessionStorage.setItem("quizResult", JSON.stringify({
        ...result,
        level: "comprehensive",
        specialisation: "soft-skills",
        timeTaken: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
      }));
      
      router.push("/soft-skills/results");
    } catch (error) {
      console.error("Failed to submit assessment:", error);
      toast.error("Failed to submit assessment. Please try again.");
      setTestState("testing");
    }
  }, [attemptId, questions, selectedAnswers, submitQuizMutation, router, startTime, testState]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (authLoading || quizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Error state - no quiz found
  if (quizError || !quizData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4 lg:p-8 pt-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Assessment Not Available</h2>
              <p className="text-muted-foreground mb-6">
                {quizErrorDetails?.message || 
                  "The Soft Skills Assessment is currently unavailable. Please try again later."}
              </p>
              <Button onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Submitting state
  if (testState === "submitting") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Submitting your assessment...</p>
        </div>
      </div>
    );
  }

  // Intro screen
  if (testState === "intro") {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <main className="flex-1 p-4 lg:p-8 pt-8">
            <div className="max-w-4xl mx-auto space-y-8">
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
                    Soft Skills Assessment
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Evaluate your interpersonal and professional skills
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-primary" />
                      About This Assessment
                    </CardTitle>
                    <CardDescription>
                      {quizData.description || "This comprehensive test evaluates your soft skills across multiple areas"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">{quizData.time_limit_minutes} minutes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Questions</p>
                          <p className="text-sm text-muted-foreground">{quizData.question_count} questions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Target className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Passing Score</p>
                          <p className="text-sm text-muted-foreground">{quizData.passing_score}% or higher</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Skills Covered</p>
                          <p className="text-sm text-muted-foreground">{skillsAreas.length} key areas</p>
                        </div>
                      </div>
                    </div>

                    {/* <div>
                      <p className="font-medium mb-3">Areas Covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {skillsAreas.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div> */}

                    <div className="pt-4 border-t">
                      <Button 
                        size="lg" 
                        onClick={startTest} 
                        className="w-full md:w-auto"
                        disabled={startQuizMutation.isPending}
                      >
                        {startQuizMutation.isPending ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Start Assessment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Testing state
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 lg:p-8 pt-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold">Soft Skills Assessment</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${
                timeRemaining <= 60 ? "bg-destructive/10 text-destructive animate-pulse" : "bg-muted"
              }`}>
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {answeredCount} of {totalQuestions} answered
          </p>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{currentQuestion?.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion?.options.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleAnswerSelect(option.key)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers.get(currentQuestion.question_id) === option.key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium mr-3">{option.key}.</span>
                  {option.text}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              disabled={!canProceed || submitQuizMutation.isPending}
            >
              {submitQuizMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Assessment"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              disabled={!canProceed}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Navigator */}
        {/* <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-3">Question Navigator</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
              <button
                key={q.question_id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                  index === currentQuestionIndex
                    ? "bg-primary text-white"
                    : selectedAnswers.has(q.question_id)
                    ? "bg-primary/20 text-primary"
                    : "bg-white border border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
