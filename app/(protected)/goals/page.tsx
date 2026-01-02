"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCareerStore } from "@/stores/useCareerStore";
import { formatSpecialisation } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Loader2, Target, Plus, Edit2, Trash2, BookOpen, ArrowLeft, Save, X } from "lucide-react";
import {
  useGoalsQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useJournalEntriesQuery,
  useCreateJournalEntryMutation,
  JOURNAL_PROMPTS,
  Goal,
  JournalEntry,
} from "@/hooks";

export default function GoalsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentCareer } = useCareerStore();

  // Form state
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS[0]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState(0);

  // Queries
  const { data: goals = [], isLoading: goalsLoading } = useGoalsQuery(user?.id);
  const { data: journalEntries = [], isLoading: journalLoading } = useJournalEntriesQuery(user?.id);

  // Mutations
  const createGoalMutation = useCreateGoalMutation();
  const updateGoalMutation = useUpdateGoalMutation();
  const deleteGoalMutation = useDeleteGoalMutation();
  const createJournalMutation = useCreateJournalEntryMutation();

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  // Load selected entry content
  useEffect(() => {
    if (selectedEntryId) {
      const entry = journalEntries.find((e) => e.id === selectedEntryId);
      if (entry) {
        setJournalContent(entry.content);
        setCurrentPrompt(entry.prompt);
      }
    }
  }, [selectedEntryId, journalEntries]);

  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalTarget || !user) return;

    createGoalMutation.mutate(
      { userId: user.id, title: newGoalTitle, target: newGoalTarget },
      {
        onSuccess: () => {
          setNewGoalTitle("");
          setNewGoalTarget("");
          setShowAddGoal(false);
        },
      }
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!user) return;
    deleteGoalMutation.mutate({ goalId, userId: user.id });
  };

  const handleUpdateProgress = (goal: Goal) => {
    if (!user) return;
    updateGoalMutation.mutate(
      { goalId: goal.id, userId: user.id, updates: { progress: editProgress } },
      {
        onSuccess: () => {
          setEditingGoalId(null);
        },
      }
    );
  };

  const handleSaveJournalEntry = () => {
    if (!journalContent || !user) return;

    createJournalMutation.mutate(
      { userId: user.id, content: journalContent, prompt: currentPrompt },
      {
        onSuccess: () => {
          setJournalContent("");
          setSelectedEntryId(null);
          setCurrentPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);
        },
      }
    );
  };

  if (authLoading || goalsLoading || journalLoading) {
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
          <div className="max-w-6xl mx-auto space-y-8">
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
                <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
                  Self-Reflection & Goal Setting
                </h1>
                <p className="text-muted-foreground">
                  Set meaningful goals and track your progress towards career readiness
                </p>
              </div>
            </ScrollReveal>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Where I Am Now */}
              <ScrollReveal>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Where I Am Now
                    </CardTitle>
                    <CardDescription>
                      Key insights from your readiness assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          {currentCareer?.specialisation
                            ? `${formatSpecialisation(currentCareer.specialisation)} Readiness`
                            : "Overall Readiness"}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {currentCareer?.readinessScore || 0}%
                        </span>
                      </div>
                      <Progress value={currentCareer?.readinessScore || 0} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Technical Score</p>
                        <p className="text-lg font-bold">{currentCareer?.technicalScore || 0}%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Soft Skills Score</p>
                        <p className="text-lg font-bold">{currentCareer?.softSkillScore || 0}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Where I Want To Be */}
              <ScrollReveal delay={0.1}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange" />
                        Where I Want To Be
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddGoal(!showAddGoal)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Goal
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Define your objectives and track progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showAddGoal && (
                      <div className="p-4 rounded-lg border border-dashed border-border space-y-3">
                        <Input
                          placeholder="Goal title (e.g., Improve project management)"
                          value={newGoalTitle}
                          onChange={(e) => setNewGoalTitle(e.target.value)}
                        />
                        <Input
                          placeholder="Target (e.g., Score 90% on assessment)"
                          value={newGoalTarget}
                          onChange={(e) => setNewGoalTarget(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAddGoal}
                            disabled={createGoalMutation.isPending}
                          >
                            {createGoalMutation.isPending && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Save Goal
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowAddGoal(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {goals.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No goals set yet</p>
                        <p className="text-sm">Click &quot;Add Goal&quot; to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {goals.map((goal) => (
                          <div
                            key={goal.id}
                            className="p-4 rounded-lg border border-border space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium">{goal.title}</h4>
                                <p className="text-sm text-muted-foreground">{goal.target}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setEditingGoalId(goal.id);
                                    setEditProgress(goal.progress);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteGoal(goal.id)}
                                  disabled={deleteGoalMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {editingGoalId === goal.id ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={editProgress}
                                    onChange={(e) =>
                                      setEditProgress(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))
                                    }
                                    className="w-20"
                                  />
                                  <span className="text-sm text-muted-foreground">%</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleUpdateProgress(goal)}
                                    disabled={updateGoalMutation.isPending}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingGoalId(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Progress value={goal.progress} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                  {goal.progress}% complete
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Self-Reflection Journal */}
            <ScrollReveal delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Self-Reflection Journal
                  </CardTitle>
                  <CardDescription>
                    Take a moment to reflect on your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {journalEntries.length > 0 && (
                    <div>
                      <Select
                        value={selectedEntryId || undefined}
                        onValueChange={setSelectedEntryId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a previous entry to view" />
                        </SelectTrigger>
                        <SelectContent>
                          {journalEntries.map((entry) => (
                            <SelectItem key={entry.id} value={entry.id}>
                              {entry.prompt} - {new Date(entry.createdAt).toLocaleDateString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-2 text-primary">{currentPrompt}</p>
                    <Textarea
                      placeholder="Write your thoughts here..."
                      value={journalContent}
                      onChange={(e) => setJournalContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentPrompt(
                            JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]
                          );
                        }}
                      >
                        New Prompt
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveJournalEntry}
                        disabled={createJournalMutation.isPending || !journalContent}
                      >
                        {createJournalMutation.isPending && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Save Entry
                      </Button>
                    </div>
                  </div>

                  {journalEntries.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Recent Entries</h4>
                      {journalEntries.slice(0, 3).map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 rounded-lg border border-border text-sm"
                        >
                          <p className="text-xs text-muted-foreground mb-1">{entry.prompt}</p>
                          <p className="line-clamp-2">{entry.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </main>
      </div>
    </div>
  );
}

