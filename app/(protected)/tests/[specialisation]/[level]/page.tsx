"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { formatSpecialisation, SKILL_LEVELS, getLevelNumber } from "@/lib/constants";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Mock questions generator
const generateQuestions = (specialisation: string, level: string): Question[] => {
  const questions: Question[] = [];
  const questionCount = 8;
  for (let i = 1; i <= questionCount; i++) {
    questions.push({
      id: `${specialisation}_${level}_q${i}`,
      text: `Question ${i}: What is a key concept in ${formatSpecialisation(specialisation)} at the ${level} level?`,
      options: [
        `Option A for question ${i}`,
        `Option B for question ${i}`,
        `Option C for question ${i}`,
        `Option D for question ${i}`,
      ],
      correctAnswer: i % 4,
      explanation: `This is the explanation for question ${i}. The correct answer demonstrates understanding of ${level} level concepts.`,
    });
  }
  return questions;
};

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const specialisation = params.specialisation as string;
  const level = params.level as string;
  
  const { isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [startTime] = useState(Date.now());

  // Calculate score for display
  const calculateScore = useCallback(() => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  }, [questions, answers]);

  // Submit handler
  const handleSubmit = useCallback(() => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const finalScore = calculateScore();
    
    // Store in sessionStorage for results page
    sessionStorage.setItem("testResults", JSON.stringify({
      questions,
      answers,
      score: finalScore,
      timeTaken,
      level,
      specialisation,
    }));
    
    router.push(`/tests/${specialisation}/${level}/results`);
  }, [startTime, calculateScore, questions, answers, level, specialisation, router]);

  useEffect(() => {
    if (specialisation && level) {
      const testQuestions = generateQuestions(specialisation, level);
      setQuestions(testQuestions);
      setAnswers(new Array(testQuestions.length).fill(-1));
      setLoading(false);
    }
  }, [specialisation, level]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, questions.length, handleSubmit]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (authLoading || loading || !specialisation || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const levelDisplay = level.charAt(0).toUpperCase() + level.slice(1);
  const levelNumber = getLevelNumber(level);
  const canProceed = answers[currentQuestionIndex] !== -1;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 lg:p-8 pt-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/technical-skills")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tests
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-2">
            {formatSpecialisation(specialisation)} – Level {levelNumber}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className={`flex items-center gap-2 text-sm ${timeRemaining < 60 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                <Clock className="h-4 w-4" />
                <span>Timer: {formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{currentQuestion?.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestionIndex] === index
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {option}
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
          {currentQuestionIndex === questions.length - 1 ? (
            <Button 
              onClick={handleSubmit} 
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              disabled={!canProceed}
            >
              Submit Test
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
      </div>
    </div>
  );
}

