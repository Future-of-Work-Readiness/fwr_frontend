"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { SOFT_SKILLS } from "@/lib/constants";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Soft skill specific questions
const SOFT_SKILL_QUESTIONS: Record<string, Question[]> = {
  communication: [
    { id: "comm_1", text: "What is the most effective way to handle a disagreement in a team meeting?", options: ["Raise your voice to be heard", "Listen actively and acknowledge others' viewpoints", "Stay silent and avoid conflict", "Send an email after the meeting"], correctAnswer: 1, explanation: "Active listening and acknowledging others' viewpoints creates mutual respect and leads to better conflict resolution." },
    { id: "comm_2", text: "Which is the best approach when giving constructive feedback?", options: ["Focus only on the negatives", "Be specific and focus on behaviours, not personality", "Avoid giving feedback to prevent hurt feelings", "Give feedback publicly to set an example"], correctAnswer: 1, explanation: "Specific, behaviour-focused feedback is actionable and less likely to be perceived as a personal attack." },
    { id: "comm_3", text: "What should you do if you don't understand a colleague's explanation?", options: ["Pretend to understand to avoid embarrassment", "Ask clarifying questions", "Ignore and figure it out later", "Interrupt and give your own explanation"], correctAnswer: 1, explanation: "Asking clarifying questions shows engagement and ensures clear understanding." },
    { id: "comm_4", text: "What is the primary purpose of active listening?", options: ["To formulate your response", "To fully understand the speaker's message", "To appear attentive", "To find flaws in arguments"], correctAnswer: 1, explanation: "Active listening focuses on understanding the speaker's message before formulating a response." },
    { id: "comm_5", text: "When presenting to stakeholders, you should:", options: ["Use as much technical jargon as possible", "Tailor your message to your audience", "Read directly from your slides", "Avoid eye contact to focus"], correctAnswer: 1, explanation: "Tailoring your message ensures your audience understands and engages with your content." },
    { id: "comm_6", text: "How should you respond to negative feedback about your work?", options: ["Become defensive and justify your choices", "Thank them and ask for specific examples", "Ignore it completely", "Complain to others about the feedback"], correctAnswer: 1, explanation: "Thanking and asking for specifics shows professionalism and helps you improve." },
    { id: "comm_7", text: "What is the best way to ensure your email is understood correctly?", options: ["Write long, detailed paragraphs", "Use clear subject lines and concise language", "Include multiple topics per email", "Avoid proofreading to save time"], correctAnswer: 1, explanation: "Clear subject lines and concise language improve readability and comprehension." },
    { id: "comm_8", text: "During a video call, maintaining engagement is best achieved by:", options: ["Multitasking to maximise productivity", "Looking at the camera and minimising distractions", "Keeping your camera off", "Typing notes loudly"], correctAnswer: 1, explanation: "Eye contact through the camera and minimising distractions shows attentiveness and respect." },
  ],
  teamwork: [
    { id: "team_1", text: "A team member is struggling with their tasks. What should you do?", options: ["Let them fail so they learn", "Offer to help or share the workload", "Report them to management", "Ignore it, it's not your responsibility"], correctAnswer: 1, explanation: "Offering help builds trust and strengthens team performance." },
    { id: "team_2", text: "What is the most important factor for effective team collaboration?", options: ["Individual excellence", "Clear communication and shared goals", "Competitive spirit", "Hierarchical structure"], correctAnswer: 1, explanation: "Clear communication and shared goals align team efforts and reduce conflicts." },
    { id: "team_3", text: "When there's a conflict between team members, you should:", options: ["Take sides with the person you like more", "Encourage open dialogue and mediation", "Escalate immediately to HR", "Ignore it and hope it resolves itself"], correctAnswer: 1, explanation: "Open dialogue and mediation help resolve conflicts constructively." },
    { id: "team_4", text: "How do you best contribute to a brainstorming session?", options: ["Criticise ideas immediately to save time", "Build on others' ideas and share your own", "Stay quiet and let others lead", "Push only your ideas"], correctAnswer: 1, explanation: "Building on ideas fosters creativity and collaboration." },
    { id: "team_5", text: "A team deadline is at risk. The best approach is to:", options: ["Blame the underperformers", "Collaborate to reprioritise and redistribute tasks", "Work alone to catch up", "Accept failure and move on"], correctAnswer: 1, explanation: "Collaborative reprioritisation ensures the team works together to meet goals." },
    { id: "team_6", text: "What makes a successful team meeting?", options: ["It runs as long as needed without an agenda", "It has a clear agenda and actionable outcomes", "Only senior members speak", "Decisions are made by one person"], correctAnswer: 1, explanation: "Clear agendas and actionable outcomes keep meetings productive and focused." },
    { id: "team_7", text: "When joining a new team, you should:", options: ["Immediately try to change processes", "Observe, learn, and build relationships first", "Keep to yourself and focus on your work", "Challenge the team leader"], correctAnswer: 1, explanation: "Observing and building relationships helps you understand team dynamics before contributing changes." },
    { id: "team_8", text: "Celebrating team achievements is important because:", options: ["It wastes productive time", "It boosts morale and reinforces positive behaviour", "Only managers should celebrate", "Individual achievements matter more"], correctAnswer: 1, explanation: "Celebrating achievements boosts morale and encourages continued collaboration." },
  ],
  problem_solving: [
    { id: "prob_1", text: "When faced with a complex problem, your first step should be:", options: ["Jump to the first solution that comes to mind", "Clearly define and understand the problem", "Ask someone else to solve it", "Avoid it until it becomes urgent"], correctAnswer: 1, explanation: "Understanding the problem fully is essential before developing effective solutions." },
    { id: "prob_2", text: "What is root cause analysis?", options: ["Blaming individuals for problems", "Identifying the underlying cause of an issue", "Fixing surface-level symptoms", "Delegating problem ownership"], correctAnswer: 1, explanation: "Root cause analysis identifies the underlying issues to prevent recurrence." },
    { id: "prob_3", text: "When your initial solution doesn't work, you should:", options: ["Give up and accept failure", "Analyse why it failed and try a different approach", "Blame external factors", "Keep trying the same solution"], correctAnswer: 1, explanation: "Analysing failures and iterating leads to better solutions." },
    { id: "prob_4", text: "Critical thinking involves:", options: ["Accepting information at face value", "Questioning assumptions and evaluating evidence", "Following instructions without questioning", "Relying solely on intuition"], correctAnswer: 1, explanation: "Critical thinking requires questioning assumptions and evaluating evidence objectively." },
    { id: "prob_5", text: "When multiple solutions are possible, you should:", options: ["Choose the fastest one", "Evaluate trade-offs and select the best fit", "Ask your manager to decide", "Avoid making a decision"], correctAnswer: 1, explanation: "Evaluating trade-offs helps select the most appropriate solution for the context." },
    { id: "prob_6", text: "Brainstorming is most effective when:", options: ["Ideas are judged immediately", "All ideas are welcomed without initial criticism", "Only experts participate", "One person dominates the discussion"], correctAnswer: 1, explanation: "Welcoming all ideas without initial judgment encourages creative thinking." },
    { id: "prob_7", text: "Data-driven decision making means:", options: ["Ignoring data that doesn't support your view", "Using relevant data to inform decisions", "Making decisions based only on data", "Collecting data without analysis"], correctAnswer: 1, explanation: "Using relevant data informs better decisions while still considering context." },
    { id: "prob_8", text: "When facing a novel problem with no precedent:", options: ["Panic and escalate immediately", "Research, experiment, and learn from attempts", "Wait for someone else to solve it", "Apply old solutions without adaptation"], correctAnswer: 1, explanation: "Research and experimentation help develop solutions for unprecedented challenges." },
  ],
  time_management: [
    { id: "time_1", text: "Prioritisation is best achieved by:", options: ["Doing tasks in the order they arrive", "Focusing on urgent and important tasks first", "Completing easy tasks first", "Multitasking on everything"], correctAnswer: 1, explanation: "The Eisenhower Matrix prioritises urgent and important tasks for maximum impact." },
    { id: "time_2", text: "What is the Pomodoro Technique?", options: ["Working without breaks", "Working in focused intervals with short breaks", "Delegating all tasks", "Working only in the morning"], correctAnswer: 1, explanation: "The Pomodoro Technique uses focused 25-minute intervals with short breaks to maintain productivity." },
    { id: "time_3", text: "How should you handle interruptions during focused work?", options: ["Always respond immediately", "Politely defer and schedule time later", "Ignore everyone completely", "Get frustrated and complain"], correctAnswer: 1, explanation: "Politely deferring interruptions protects focus time while maintaining relationships." },
    { id: "time_4", text: "Setting realistic deadlines requires:", options: ["Optimistic estimates only", "Understanding task complexity and adding buffer time", "Promising the shortest possible time", "Avoiding commitment to deadlines"], correctAnswer: 1, explanation: "Understanding complexity and adding buffer time leads to achievable deadlines." },
    { id: "time_5", text: "Procrastination is best addressed by:", options: ["Waiting for motivation", "Breaking tasks into smaller, manageable steps", "Working only under pressure", "Avoiding difficult tasks"], correctAnswer: 1, explanation: "Breaking tasks into smaller steps makes starting easier and builds momentum." },
    { id: "time_6", text: "Effective delegation involves:", options: ["Giving tasks without context", "Matching tasks to skills and providing clear expectations", "Only delegating unimportant tasks", "Micromanaging every step"], correctAnswer: 1, explanation: "Matching tasks to skills and setting clear expectations leads to successful delegation." },
    { id: "time_7", text: "At the end of each day, you should:", options: ["Immediately disconnect from work", "Review accomplishments and plan the next day", "Work until all tasks are done", "Avoid looking at your to-do list"], correctAnswer: 1, explanation: "Daily review and planning helps maintain progress and reduces next-day stress." },
    { id: "time_8", text: "When you have more tasks than time allows:", options: ["Work overtime every day", "Negotiate priorities and communicate constraints", "Do everything poorly", "Ignore deadlines"], correctAnswer: 1, explanation: "Negotiating priorities and communicating constraints leads to realistic expectations." },
  ],
  adaptability: [
    { id: "adapt_1", text: "When facing unexpected changes at work, you should:", options: ["Resist the change strongly", "Stay calm and assess the situation", "Complain to colleagues", "Wait for others to adapt first"], correctAnswer: 1, explanation: "Staying calm and assessing helps you respond constructively to change." },
    { id: "adapt_2", text: "Learning new skills quickly requires:", options: ["Natural talent only", "An open mindset and willingness to practice", "Avoiding mistakes at all costs", "Waiting for formal training"], correctAnswer: 1, explanation: "An open mindset and practice accelerate skill acquisition." },
    { id: "adapt_3", text: "When a project direction changes significantly:", options: ["Continue with the original plan", "Reassess goals and adjust your approach", "Blame leadership", "Disengage from the project"], correctAnswer: 1, explanation: "Reassessing and adjusting ensures continued relevance and progress." },
    { id: "adapt_4", text: "Resilience in the face of setbacks means:", options: ["Never experiencing failure", "Learning from failures and persisting", "Ignoring problems", "Avoiding challenging situations"], correctAnswer: 1, explanation: "Resilience involves learning from setbacks and continuing forward." },
    { id: "adapt_5", text: "Working with diverse team members requires:", options: ["Expecting everyone to adapt to you", "Flexibility and respect for different perspectives", "Avoiding collaboration", "Only working with similar people"], correctAnswer: 1, explanation: "Flexibility and respect enable effective collaboration across differences." },
    { id: "adapt_6", text: "When your usual approach isn't working:", options: ["Try harder with the same approach", "Seek new perspectives and try alternatives", "Give up on the task", "Blame the circumstances"], correctAnswer: 1, explanation: "Seeking new perspectives and alternatives leads to innovative solutions." },
    { id: "adapt_7", text: "Embracing uncertainty is best demonstrated by:", options: ["Avoiding all risk", "Taking calculated risks and learning from outcomes", "Making reckless decisions", "Waiting for perfect information"], correctAnswer: 1, explanation: "Calculated risk-taking with learning orientation enables growth." },
    { id: "adapt_8", text: "In a rapidly changing industry, you should:", options: ["Focus only on current skills", "Continuously learn and update your knowledge", "Wait for training from employers", "Resist industry changes"], correctAnswer: 1, explanation: "Continuous learning keeps you relevant in evolving industries." },
  ],
  leadership: [
    { id: "lead_1", text: "Effective leaders primarily:", options: ["Command and control", "Inspire and empower others", "Avoid making decisions", "Do all the work themselves"], correctAnswer: 1, explanation: "Inspiring and empowering creates engaged, high-performing teams." },
    { id: "lead_2", text: "When a team member makes a mistake:", options: ["Publicly criticise them", "Support them in learning from it", "Ignore it to avoid conflict", "Take over their responsibilities"], correctAnswer: 1, explanation: "Supporting learning from mistakes builds trust and development." },
    { id: "lead_3", text: "Building trust with your team requires:", options: ["Being unpredictable", "Consistency, transparency, and follow-through", "Maintaining strict hierarchy", "Sharing only positive information"], correctAnswer: 1, explanation: "Consistency, transparency, and follow-through build credible leadership." },
    { id: "lead_4", text: "Delegation is important because:", options: ["It reduces your workload only", "It develops team members and increases capacity", "It shows you're too busy", "It's required by policy"], correctAnswer: 1, explanation: "Delegation develops skills and increases overall team capacity." },
    { id: "lead_5", text: "When facing a difficult decision, leaders should:", options: ["Decide quickly without input", "Gather relevant input and take accountability", "Avoid making the decision", "Let the team vote on everything"], correctAnswer: 1, explanation: "Gathering input and taking accountability leads to informed decisions." },
    { id: "lead_6", text: "Providing vision means:", options: ["Keeping plans secret", "Sharing a compelling direction and aligning efforts", "Focusing only on daily tasks", "Changing direction frequently"], correctAnswer: 1, explanation: "A shared, compelling vision aligns team efforts toward common goals." },
    { id: "lead_7", text: "When team morale is low, a leader should:", options: ["Ignore emotional concerns", "Address concerns, recognise efforts, and provide support", "Increase pressure and deadlines", "Replace team members"], correctAnswer: 1, explanation: "Addressing concerns and recognising efforts rebuilds morale and engagement." },
    { id: "lead_8", text: "Leading by example means:", options: ["Telling others what to do", "Demonstrating the behaviours you expect from others", "Doing only prestigious tasks", "Avoiding difficult situations"], correctAnswer: 1, explanation: "Demonstrating expected behaviours sets the standard for the team." },
  ],
  handling_feedback: [
    { id: "feed_1", text: "When receiving critical feedback, you should:", options: ["Become defensive immediately", "Listen openly and ask clarifying questions", "Dismiss it as wrong", "Give feedback in return immediately"], correctAnswer: 1, explanation: "Listening openly and clarifying helps you understand and grow from feedback." },
    { id: "feed_2", text: "The purpose of feedback is primarily to:", options: ["Criticise performance", "Support growth and improvement", "Establish hierarchy", "Document problems"], correctAnswer: 1, explanation: "Feedback aims to support growth and continuous improvement." },
    { id: "feed_3", text: "After receiving feedback, the best response is to:", options: ["Ignore it", "Reflect on it and create an action plan", "Complain to others", "Immediately change everything"], correctAnswer: 1, explanation: "Reflection and action planning translates feedback into improvement." },
    { id: "feed_4", text: "If you disagree with feedback:", options: ["Argue your point immediately", "Thank them, reflect, then discuss concerns calmly", "Ignore it entirely", "Hold a grudge"], correctAnswer: 1, explanation: "Thanking, reflecting, and calm discussion maintains relationships while expressing disagreement." },
    { id: "feed_5", text: "Seeking feedback proactively shows:", options: ["Weakness and insecurity", "Commitment to growth and self-awareness", "That you can't do your job", "Dependence on others"], correctAnswer: 1, explanation: "Proactively seeking feedback demonstrates growth mindset and self-awareness." },
    { id: "feed_6", text: "When giving feedback to others, you should:", options: ["Focus on their personality flaws", "Be specific, timely, and constructive", "Avoid negative points", "Only give feedback when asked"], correctAnswer: 1, explanation: "Specific, timely, constructive feedback is actionable and well-received." },
    { id: "feed_7", text: "The 'feedback sandwich' technique involves:", options: ["Hiding criticism completely", "Framing constructive feedback between positive observations", "Only giving positive feedback", "Giving three criticisms"], correctAnswer: 1, explanation: "The sandwich technique makes constructive feedback easier to receive." },
    { id: "feed_8", text: "Regular feedback is better than annual reviews because:", options: ["It takes less time", "It enables timely adjustments and continuous improvement", "Managers prefer it", "It's easier to document"], correctAnswer: 1, explanation: "Regular feedback enables timely course corrections and sustained growth." },
  ],
  dealing_with_conflict: [
    { id: "conf_1", text: "The first step in resolving conflict is:", options: ["Assigning blame", "Understanding all perspectives involved", "Escalating to management", "Avoiding the issue"], correctAnswer: 1, explanation: "Understanding all perspectives is essential for fair conflict resolution." },
    { id: "conf_2", text: "When emotions are high during a conflict:", options: ["Press forward anyway", "Take a break and revisit when calm", "Shout louder", "Walk away permanently"], correctAnswer: 1, explanation: "Taking a break allows emotions to settle for productive discussion." },
    { id: "conf_3", text: "Active listening in conflict means:", options: ["Planning your response", "Fully focusing on understanding the other person", "Interrupting with solutions", "Judging their points"], correctAnswer: 1, explanation: "Active listening focuses on understanding before responding." },
    { id: "conf_4", text: "A win-win resolution:", options: ["Is impossible in conflicts", "Addresses the needs of all parties", "Means one side gives in", "Only benefits management"], correctAnswer: 1, explanation: "Win-win resolutions address multiple parties' needs for lasting solutions." },
    { id: "conf_5", text: "When you're wrong in a conflict:", options: ["Never admit it", "Acknowledge your mistake and apologise", "Blame circumstances", "Change the subject"], correctAnswer: 1, explanation: "Acknowledging mistakes and apologising builds trust and resolves conflicts." },
    { id: "conf_6", text: "Healthy conflict in teams:", options: ["Should be avoided entirely", "Can lead to better ideas and decisions", "Always damages relationships", "Shows poor leadership"], correctAnswer: 1, explanation: "Healthy conflict, properly managed, leads to innovation and better decisions." },
    { id: "conf_7", text: "Mediation is useful when:", options: ["You want to prove you're right", "Direct resolution attempts have failed", "The issue is trivial", "You want to avoid the person"], correctAnswer: 1, explanation: "Mediation helps when direct resolution attempts haven't succeeded." },
    { id: "conf_8", text: "After resolving a conflict:", options: ["Hold a grudge for protection", "Follow up to ensure the resolution is working", "Avoid the person", "Bring up the conflict regularly"], correctAnswer: 1, explanation: "Following up ensures the resolution sticks and repairs relationships." },
  ],
  professionalism: [
    { id: "prof_1", text: "Professional behaviour includes:", options: ["Only following rules when convenient", "Consistency, reliability, and respect", "Doing the minimum required", "Putting personal interests first"], correctAnswer: 1, explanation: "Professionalism is demonstrated through consistent, reliable, and respectful behaviour." },
    { id: "prof_2", text: "Meeting deadlines is important because:", options: ["It makes you look busy", "It builds trust and shows reliability", "Your manager told you to", "It's in your contract"], correctAnswer: 1, explanation: "Meeting deadlines demonstrates reliability and builds professional trust." },
    { id: "prof_3", text: "Professional communication means:", options: ["Being informal with everyone", "Adapting your style appropriately to context", "Using jargon to sound smart", "Avoiding written communication"], correctAnswer: 1, explanation: "Adapting communication style to context shows professional awareness." },
    { id: "prof_4", text: "When you make a mistake at work:", options: ["Cover it up", "Own it, fix it, and learn from it", "Blame someone else", "Ignore it and move on"], correctAnswer: 1, explanation: "Owning, fixing, and learning from mistakes demonstrates professionalism and integrity." },
    { id: "prof_5", text: "Confidentiality at work means:", options: ["Sharing sensitive information selectively", "Protecting information appropriately", "Keeping all information secret", "Sharing freely to build relationships"], correctAnswer: 1, explanation: "Appropriate protection of sensitive information maintains trust and professionalism." },
    { id: "prof_6", text: "Workplace appearance and behaviour should:", options: ["Reflect personal preferences only", "Align with organisational culture and expectations", "Be as casual as possible", "Stand out dramatically"], correctAnswer: 1, explanation: "Aligning with organisational culture shows respect and professionalism." },
    { id: "prof_7", text: "Respecting colleagues' time means:", options: ["Arriving late shows you're busy", "Being punctual and prepared", "Cancelling meetings last minute", "Running meetings overtime regularly"], correctAnswer: 1, explanation: "Punctuality and preparation respect others' time and show professionalism." },
    { id: "prof_8", text: "Professional development is:", options: ["Your employer's responsibility only", "A shared responsibility requiring personal initiative", "Unnecessary after starting work", "Only needed when changing jobs"], correctAnswer: 1, explanation: "Professional development requires personal initiative alongside employer support." },
  ],
  ethical_judgment: [
    { id: "eth_1", text: "When facing an ethical dilemma, you should:", options: ["Do whatever benefits you most", "Consider the impact on all stakeholders", "Follow the crowd", "Avoid making a decision"], correctAnswer: 1, explanation: "Considering all stakeholder impacts leads to ethical decision-making." },
    { id: "eth_2", text: "Integrity means:", options: ["Following rules only when observed", "Doing the right thing even when no one is watching", "Protecting your own interests", "Agreeing with everyone"], correctAnswer: 1, explanation: "Integrity is demonstrated through consistent ethical behaviour regardless of observation." },
    { id: "eth_3", text: "If asked to do something unethical:", options: ["Do it to avoid conflict", "Respectfully decline and report if necessary", "Do it and blame others if caught", "Ignore the request and do nothing"], correctAnswer: 1, explanation: "Respectfully declining unethical requests maintains integrity and often protects the organisation." },
    { id: "eth_4", text: "Conflicts of interest should be:", options: ["Hidden to protect privacy", "Disclosed and managed appropriately", "Ignored if they seem minor", "Used to your advantage"], correctAnswer: 1, explanation: "Disclosing conflicts of interest maintains trust and allows proper management." },
    { id: "eth_5", text: "Whistleblowing is:", options: ["Always wrong", "Sometimes necessary to report serious wrongdoing", "A way to get revenge", "Only for major crimes"], correctAnswer: 1, explanation: "Whistleblowing can be an ethical obligation when serious wrongdoing occurs." },
    { id: "eth_6", text: "Fair treatment of colleagues means:", options: ["Treating everyone exactly the same", "Providing equitable treatment considering individual circumstances", "Favouring those who are like you", "Avoiding difficult conversations"], correctAnswer: 1, explanation: "Equitable treatment considers individual circumstances for fairness." },
    { id: "eth_7", text: "When company policies conflict with your values:", options: ["Silently comply", "Reflect on the conflict and consider respectful advocacy", "Immediately resign", "Publicly criticise the company"], correctAnswer: 1, explanation: "Reflecting and respectful advocacy can lead to positive change while maintaining professionalism." },
    { id: "eth_8", text: "Corporate social responsibility is:", options: ["A marketing gimmick", "Considering broader societal impact in business decisions", "Only for large companies", "Legally required"], correctAnswer: 1, explanation: "CSR involves genuinely considering societal impact in business decisions." },
  ],
};

// Fallback questions if skill not found
const getDefaultQuestions = (skillName: string): Question[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${skillName}_q${i + 1}`,
    text: `Question ${i + 1}: What is a key principle of ${skillName.replace(/_/g, ' ')}?`,
    options: [`Option A for question ${i + 1}`, `Option B for question ${i + 1}`, `Option C for question ${i + 1}`, `Option D for question ${i + 1}`],
    correctAnswer: 1,
    explanation: `This demonstrates understanding of ${skillName.replace(/_/g, ' ')} principles.`,
  }));
};

export default function SoftSkillTestPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;
  
  const { isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes for soft skills
  const [startTime] = useState(Date.now());

  const skill = SOFT_SKILLS.find(s => s.id === skillId);

  const calculateScore = useCallback(() => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  }, [questions, answers]);

  const handleSubmit = useCallback(() => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const finalScore = calculateScore();
    
    sessionStorage.setItem("softSkillTestResults", JSON.stringify({
      questions,
      answers,
      score: finalScore,
      timeTaken,
      skillId,
      skillName: skill?.name || skillId,
    }));
    
    router.push(`/soft-skills/${skillId}/results`);
  }, [startTime, calculateScore, questions, answers, skillId, skill, router]);

  useEffect(() => {
    if (skillId) {
      const skillQuestions = SOFT_SKILL_QUESTIONS[skillId] || getDefaultQuestions(skillId);
      setQuestions(skillQuestions);
      setAnswers(new Array(skillQuestions.length).fill(-1));
      setLoading(false);
    }
  }, [skillId]);

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

  if (authLoading || loading || !skillId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const canProceed = answers[currentQuestionIndex] !== -1;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 lg:p-8 pt-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/soft-skills")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Soft Skills
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-2">
            {skill?.name || skillId.replace(/_/g, ' ')} Quiz
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
              Submit Quiz
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

