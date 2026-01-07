"use client";

import { useState } from "react";
import { Star, X, Send, Loader2, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; feedbackText: string }) => Promise<void>;
  quizTitle?: string;
  isLoading?: boolean;
}

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  quizTitle,
  isLoading = false,
}: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }

    if (feedbackText.trim().length < 10) {
      setError("Please provide at least 10 characters of feedback");
      return;
    }

    try {
      await onSubmit({ rating, feedbackText: feedbackText.trim() });
      // Reset form on success
      setRating(0);
      setFeedbackText("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit feedback");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRating(0);
      setFeedbackText("");
      setError(null);
      onClose();
    }
  };

  const getRatingLabel = (value: number) => {
    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return labels[value] || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-white">
              How was this quiz?
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            {quizTitle ? (
              <>Your feedback on <span className="text-slate-300 font-medium">{quizTitle}</span> helps us improve.</>
            ) : (
              "Your feedback helps us improve the quiz experience."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              Rate your experience
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isLoading}
                  className={cn(
                    "p-1 transition-all duration-200 rounded-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500/50",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-all duration-200",
                      (hoveredRating || rating) >= value
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-600"
                    )}
                  />
                </button>
              ))}
              {(hoveredRating || rating) > 0 && (
                <span className="ml-3 text-sm text-amber-400 font-medium animate-in fade-in duration-200">
                  {getRatingLabel(hoveredRating || rating)}
                </span>
              )}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              Tell us more <span className="text-slate-500">(min 10 characters)</span>
            </label>
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What did you like? What could be improved? Was the difficulty appropriate?"
              rows={4}
              disabled={isLoading}
              className={cn(
                "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none",
                "focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50",
                isLoading && "opacity-50"
              )}
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{feedbackText.length}/2000 characters</span>
              {feedbackText.length > 0 && feedbackText.length < 10 && (
                <span className="text-amber-400">{10 - feedbackText.length} more needed</span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || rating === 0 || feedbackText.trim().length < 10}
            className={cn(
              "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
              "text-white font-medium shadow-lg shadow-amber-500/25",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

