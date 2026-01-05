"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers";
import { useCareerStore } from "@/stores/useCareerStore";
import { useFindQuizQuery, useStartQuiz, useSubmitQuiz, type QuizAnswer } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Clock, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { formatSpecialisation, getLevelNumber } from "@/lib/constants";
import { toast } from "sonner";

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const specialisation = params.specialisation as string;
  const level = params.level as string;
  
  const { isLoading: authLoading, user } = useAuth();
  const { currentCareer } = useCareerStore();
  
  // Map level name to difficulty number
  const difficultyLevel = getLevelNumber(level);
  
  // Fetch quiz from backend
  const { 
    data: quizData, 
    isLoading: quizLoading, 
    isError: quizError,
    error: quizErrorDetails 
  } = useFindQuizQuery(specialisation.toUpperCase().replace(/-/g, '_'), difficultyLevel);
  
  // Start quiz mutation
  const startQuizMutation = useStartQuiz();
  
  // Submit quiz mutation
  const submitQuizMutation = useSubmitQuiz();
  
  // Local state
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived values
  const questions = quizData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const levelDisplay = level.charAt(0).toUpperCase() + level.slice(1);
  const canProceed = currentQuestion && selectedAnswers.has(currentQuestion.question_id);

  // Initialize timer when quiz starts
  useEffect(() => {
    if (quizStarted && quizData && timeRemaining === null) {
      setTimeRemaining(quizData.time_limit_minutes * 60);
      setStartTime(Date.now());
    }
  }, [quizStarted, quizData, timeRemaining]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || !quizStarted) return;
    
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
  }, [timeRemaining, quizStarted]);

  // Start quiz
  const handleStartQuiz = useCallback(async () => {
    if (!quizData) return;
    
    try {
      const response = await startQuizMutation.mutateAsync(quizData.quiz_id);
      setAttemptId(response.attempt_id);
      setQuizStarted(true);
    } catch (error) {
      console.error("Failed to start quiz:", error);
      toast.error("Failed to start quiz. Please try again.");
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

  // Submit quiz
  const handleSubmit = useCallback(async () => {
    if (!attemptId || isSubmitting) return;
    
    setIsSubmitting(true);
    
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
        level,
        specialisation,
        timeTaken: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
      }));
      
      router.push(`/tests/${specialisation}/${level}/results`);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  }, [attemptId, questions, selectedAnswers, submitQuizMutation, router, specialisation, level, startTime, isSubmitting]);

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Loading state
  if (authLoading || quizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error state - no quiz found
  if (quizError || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Quiz Not Available</h2>
            <p className="text-muted-foreground mb-6">
              {quizErrorDetails?.message || 
                `No quiz found for ${formatSpecialisation(specialisation)} at ${levelDisplay} level.`}
            </p>
            <Button onClick={() => router.push("/technical-skills")}>
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz intro screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-4 lg:p-8 pt-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/technical-skills")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {formatSpecialisation(specialisation)} – Level {difficultyLevel}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">{quizData.title}</h3>
                {quizData.description && (
                  <p className="text-muted-foreground">{quizData.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-2xl font-bold">{quizData.question_count}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                  <p className="text-2xl font-bold">{quizData.time_limit_minutes} min</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Passing Score</p>
                  <p className="text-2xl font-bold">{quizData.passing_score}%</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="text-2xl font-bold">Level {quizData.difficulty_level}</p>
                </div>
              </div>

              <Button
                onClick={handleStartQuiz}
                disabled={startQuizMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {startQuizMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start Quiz"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz taking screen
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8">
        <Button
          variant="ghost"
          onClick={() => {
            if (confirm("Are you sure you want to leave? Your progress will be lost.")) {
              router.push("/technical-skills");
            }
          }}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tests
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-2">
            {formatSpecialisation(specialisation)} – Level {difficultyLevel}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              {timeRemaining !== null && (
                <div className={`flex items-center gap-2 text-sm ${
                  timeRemaining < 60 ? "text-destructive font-bold" : "text-muted-foreground"
                }`}>
                  <Clock className="h-4 w-4" />
                  <span>Timer: {formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg md:text-xl leading-relaxed break-words">
              {currentQuestion?.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-3">
              {currentQuestion?.options.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleAnswerSelect(option.key)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    selectedAnswers.get(currentQuestion.question_id) === option.key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="font-medium text-primary shrink-0">{option.key}.</span>
                    <span className="break-words text-sm sm:text-base">{option.text}</span>
                  </div>
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
              disabled={!canProceed || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Test"
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
