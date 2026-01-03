"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCareerStore } from "@/stores/useCareerStore";
import { useSubmitTestResultMutation } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { 
  Loader2, ChevronRight, ChevronLeft, ArrowLeft, Clock, Users, 
  MessageSquare, Lightbulb, Target, TrendingUp, Shield, Briefcase, 
  Scale, AlertCircle, Play
} from "lucide-react";
import { toast } from "sonner";

interface SoftSkillQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

// Comprehensive soft skills questions covering all areas
const SOFT_SKILLS_QUESTIONS: SoftSkillQuestion[] = [
  // Communication
  {
    id: "ss_q1",
    text: "What is the most effective way to handle a disagreement in a team meeting?",
    options: [
      "Raise your voice to be heard",
      "Listen actively and acknowledge others' viewpoints",
      "Stay silent and avoid conflict",
      "Send an email after the meeting",
    ],
    correctAnswer: 1,
    explanation: "Active listening and acknowledging others' viewpoints creates mutual respect and leads to better conflict resolution.",
    category: "Communication",
  },
  {
    id: "ss_q2",
    text: "Which is the best approach when giving constructive feedback?",
    options: [
      "Focus only on the negatives",
      "Be specific and focus on behaviours, not personality",
      "Avoid giving feedback to prevent hurt feelings",
      "Give feedback publicly to set an example",
    ],
    correctAnswer: 1,
    explanation: "Specific, behaviour-focused feedback is actionable and less likely to be perceived as a personal attack.",
    category: "Communication",
  },
  // Teamwork
  {
    id: "ss_q3",
    text: "What is a key characteristic of an effective team member?",
    options: [
      "Always taking the lead on tasks",
      "Prioritizing individual goals over team goals",
      "Actively listening and contributing constructively",
      "Avoiding conflict at all costs",
    ],
    correctAnswer: 2,
    explanation: "Effective team members contribute positively and listen to others, fostering a collaborative environment.",
    category: "Teamwork",
  },
  {
    id: "ss_q4",
    text: "When a team member is struggling with a task, what is the most supportive action?",
    options: [
      "Criticize their performance publicly",
      "Take over the task without asking",
      "Offer help and ask how you can support them",
      "Ignore it, assuming they will figure it out",
    ],
    correctAnswer: 2,
    explanation: "Offering support and asking how to help fosters a supportive team environment.",
    category: "Teamwork",
  },
  // Problem Solving
  {
    id: "ss_q5",
    text: "What is the first step in effective problem-solving?",
    options: [
      "Implement a solution immediately",
      "Clearly define and understand the problem",
      "Brainstorm potential solutions",
      "Assign blame for the problem",
    ],
    correctAnswer: 1,
    explanation: "A clear understanding of the problem is essential before attempting to solve it.",
    category: "Problem Solving",
  },
  {
    id: "ss_q6",
    text: "When faced with a complex problem, what technique is most helpful?",
    options: [
      "Ignoring it until it resolves itself",
      "Breaking it down into smaller, manageable parts",
      "Only focusing on the symptoms, not the root cause",
      "Asking someone else to solve it entirely",
    ],
    correctAnswer: 1,
    explanation: "Decomposing a complex problem makes it less daunting and easier to tackle.",
    category: "Problem Solving",
  },
  // Time Management
  {
    id: "ss_q7",
    text: "What is the most effective way to start your workday for optimal productivity?",
    options: [
      "Check all emails and social media first",
      "Plan your top priorities and tasks for the day",
      "Start with the easiest task to build momentum",
      "Attend unscheduled meetings",
    ],
    correctAnswer: 1,
    explanation: "Planning priorities helps focus your efforts on what truly matters.",
    category: "Time Management",
  },
  {
    id: "ss_q8",
    text: "Which technique helps in prioritizing tasks based on urgency and importance?",
    options: [
      "The 'first-come, first-served' method",
      "The Eisenhower Matrix (Urgent/Important)",
      "Delegating all tasks to others",
      "Working on multiple tasks simultaneously",
    ],
    correctAnswer: 1,
    explanation: "The Eisenhower Matrix is a powerful tool for effective prioritization.",
    category: "Time Management",
  },
  // Adaptability
  {
    id: "ss_q9",
    text: "What is a key indicator of adaptability in the workplace?",
    options: [
      "Strictly adhering to established routines",
      "Resisting any changes to processes or tools",
      "Embracing new technologies and adjusting to shifting priorities",
      "Only working on familiar tasks",
    ],
    correctAnswer: 2,
    explanation: "Adaptable individuals are open to new ways of working and can adjust to change.",
    category: "Adaptability",
  },
  {
    id: "ss_q10",
    text: "How does a growth mindset contribute to adaptability?",
    options: [
      "It makes you believe you can't change",
      "It fosters a belief that abilities can be developed, encouraging learning and resilience",
      "It focuses on innate talents only",
      "It leads to fear of failure",
    ],
    correctAnswer: 1,
    explanation: "A growth mindset promotes learning from challenges and continuous improvement.",
    category: "Adaptability",
  },
  // Leadership
  {
    id: "ss_q11",
    text: "What is a fundamental quality of an effective leader?",
    options: [
      "Micromanaging every task",
      "Inspiring and motivating team members",
      "Making all decisions independently",
      "Avoiding delegation",
    ],
    correctAnswer: 1,
    explanation: "Effective leaders inspire and empower their teams, fostering a positive and productive environment.",
    category: "Leadership",
  },
  {
    id: "ss_q12",
    text: "How does a leader best foster innovation within a team?",
    options: [
      "By strictly enforcing existing rules and procedures",
      "By encouraging experimentation and providing a safe space for ideas",
      "By punishing failures harshly",
      "By only listening to their own ideas",
    ],
    correctAnswer: 1,
    explanation: "Creating an environment that supports experimentation and learning from failure is key to innovation.",
    category: "Leadership",
  },
  // Handling Feedback
  {
    id: "ss_q13",
    text: "When receiving critical feedback, what is the best initial response?",
    options: [
      "Interrupt and defend your actions immediately",
      "Listen actively, thank the person, and ask clarifying questions",
      "Dismiss the feedback as unfair",
      "Become emotional and upset",
    ],
    correctAnswer: 1,
    explanation: "Active listening and seeking clarity demonstrate professionalism and a willingness to learn.",
    category: "Handling Feedback",
  },
  {
    id: "ss_q14",
    text: "After receiving feedback, what is an important next step?",
    options: [
      "Forget about it and continue as before",
      "Reflect on the feedback, identify actionable steps, and implement changes",
      "Complain to colleagues about the feedback",
      "Only accept positive feedback",
    ],
    correctAnswer: 1,
    explanation: "Reflection and action are crucial for turning feedback into personal and professional development.",
    category: "Handling Feedback",
  },
  // Dealing with Conflict
  {
    id: "ss_q15",
    text: "What is the most constructive approach to resolving workplace conflict?",
    options: [
      "Avoid the person causing the conflict",
      "Engage in open and respectful dialogue to find a mutual solution",
      "Complain to colleagues about the issue",
      "Demand that the other person change their behavior",
    ],
    correctAnswer: 1,
    explanation: "Open dialogue and a focus on mutual solutions are key to constructive conflict resolution.",
    category: "Conflict Resolution",
  },
  {
    id: "ss_q16",
    text: "What is a 'win-win' approach to conflict resolution?",
    options: [
      "One person gets everything they want",
      "Both parties feel their needs are met and agree on a solution",
      "Neither party gets what they want",
      "The conflict is simply avoided",
    ],
    correctAnswer: 1,
    explanation: "A win-win approach aims for solutions that satisfy the core interests of all parties involved.",
    category: "Conflict Resolution",
  },
  // Professionalism
  {
    id: "ss_q17",
    text: "What is a key aspect of professionalism in the workplace?",
    options: [
      "Always prioritizing personal tasks over work",
      "Maintaining a positive attitude and respectful conduct",
      "Gossiping about colleagues",
      "Ignoring deadlines",
    ],
    correctAnswer: 1,
    explanation: "Professionalism involves demonstrating respect, integrity, and a positive demeanor.",
    category: "Professionalism",
  },
  {
    id: "ss_q18",
    text: "What does 'accountability' mean in a professional context?",
    options: [
      "Blaming others for mistakes",
      "Taking responsibility for your actions, commitments, and their outcomes",
      "Avoiding difficult tasks",
      "Only being accountable for successes",
    ],
    correctAnswer: 1,
    explanation: "Accountability is about owning your responsibilities and their results, both good and bad.",
    category: "Professionalism",
  },
  // Ethical Judgment
  {
    id: "ss_q19",
    text: "You discover a colleague is taking credit for your work. What is the most ethical first step?",
    options: [
      "Publicly confront them in front of the team",
      "Gather evidence and discuss the issue privately with your colleague",
      "Ignore it to avoid conflict",
      "Report them to HR immediately without speaking to them",
    ],
    correctAnswer: 1,
    explanation: "Addressing the issue privately and respectfully is often the best first step in ethical dilemmas.",
    category: "Ethical Judgment",
  },
  {
    id: "ss_q20",
    text: "What is the concept of 'conflict of interest'?",
    options: [
      "When two people disagree on a topic",
      "When personal interests could improperly influence professional decisions",
      "When you have too many tasks",
      "When you are bored at work",
    ],
    correctAnswer: 1,
    explanation: "Conflicts of interest can compromise objectivity and ethical decision-making.",
    category: "Ethical Judgment",
  },
];

type TestState = "intro" | "testing" | "submitting";

export default function SoftSkillsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentCareer } = useCareerStore();
  
  const [testState, setTestState] = useState<TestState>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes
  const [startTime, setStartTime] = useState<number | null>(null);

  const submitTestMutation = useSubmitTestResultMutation();

  // Initialize test
  const startTest = () => {
    setAnswers(new Array(SOFT_SKILLS_QUESTIONS.length).fill(-1));
    setCurrentQuestionIndex(0);
    setTimeRemaining(20 * 60);
    setStartTime(Date.now());
    setTestState("testing");
  };

  // Calculate score
  const calculateScore = useCallback(() => {
    let correct = 0;
    SOFT_SKILLS_QUESTIONS.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / SOFT_SKILLS_QUESTIONS.length) * 100);
  }, [answers]);

  // Submit test
  const handleSubmit = useCallback(async () => {
    if (!user || !currentCareer || !startTime) {
      toast.error("Missing required information");
      return;
    }

    setTestState("submitting");
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const score = calculateScore();
    const passed = score >= 70;

    try {
      await submitTestMutation.mutateAsync({
        userId: user.id,
        careerId: currentCareer.id,
        specialisation: "soft-skills",
        level: "comprehensive",
        score,
        passed,
        timeTaken,
        questionsCount: SOFT_SKILLS_QUESTIONS.length,
        category: "soft_skill",
        testName: "Soft Skills Assessment",
      });

      // Navigate to results
      const answersParam = encodeURIComponent(JSON.stringify(answers));
      router.push(`/soft-skills/results?score=${score}&timeTaken=${timeTaken}&passed=${passed}&answers=${answersParam}`);
    } catch (error) {
      toast.error("Failed to submit test");
      setTestState("testing");
    }
  }, [user, currentCareer, startTime, calculateScore, answers, submitTestMutation, router]);

  // Timer effect
  useEffect(() => {
    if (testState !== "testing" || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testState, timeRemaining, handleSubmit]);

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  // Navigation
  const handleNext = () => {
    if (currentQuestionIndex < SOFT_SKILLS_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                      This comprehensive test evaluates your soft skills across multiple areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">20 minutes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Questions</p>
                          <p className="text-sm text-muted-foreground">{SOFT_SKILLS_QUESTIONS.length} questions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Target className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Passing Score</p>
                          <p className="text-sm text-muted-foreground">70% or higher</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Skills Covered</p>
                          <p className="text-sm text-muted-foreground">10 key areas</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-3">Areas Covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Communication", "Teamwork", "Problem Solving", "Time Management", "Adaptability", "Leadership", "Handling Feedback", "Conflict Resolution", "Professionalism", "Ethical Judgment"].map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button size="lg" onClick={startTest} className="w-full md:w-auto">
                        <Play className="h-5 w-5 mr-2" />
                        Start Assessment
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

  // Testing state
  const currentQuestion = SOFT_SKILLS_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / SOFT_SKILLS_QUESTIONS.length) * 100;
  const canProceed = answers[currentQuestionIndex] !== -1;
  const answeredCount = answers.filter((a) => a !== -1).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 lg:p-8 pt-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold">Soft Skills Assessment</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {SOFT_SKILLS_QUESTIONS.length}
              </p>
            </div>
            <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${
              timeRemaining <= 60 ? "bg-destructive/10 text-destructive animate-pulse" : "bg-muted"
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {answeredCount} of {SOFT_SKILLS_QUESTIONS.length} answered
          </p>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <Badge variant="outline" className="w-fit mb-2">{currentQuestion.category}</Badge>
            <CardTitle className="text-lg sm:text-xl">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestionIndex] === index
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
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
          
          {currentQuestionIndex === SOFT_SKILLS_QUESTIONS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              disabled={!canProceed || submitTestMutation.isPending}
            >
              {submitTestMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Assessment
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
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-3">Question Navigator</p>
          <div className="flex flex-wrap gap-2">
            {SOFT_SKILLS_QUESTIONS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                  index === currentQuestionIndex
                    ? "bg-primary text-white"
                    : answers[index] !== -1
                    ? "bg-primary/20 text-primary"
                    : "bg-white border border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
