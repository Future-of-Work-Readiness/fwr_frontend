"use client";

import { motion } from "framer-motion";

interface ReadinessGaugeProps {
  score: number;
}

export const ReadinessGauge = ({ score }: ReadinessGaugeProps) => {
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-cyan";
    if (score >= 40) return "text-orange";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Developing";
    return "";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeOpacity="0.3"
          />
          {/* Progress circle */}
          <motion.circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-4xl font-display font-bold ${getScoreColor(score)}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}%
          </motion.span>
          {score >= 40 && (
            <span className="text-sm text-muted-foreground mt-1">
              {getScoreLabel(score)}
            </span>
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold mt-4">Readiness Score</h3>
      <p className="text-sm text-muted-foreground text-center mt-1">
        Take more tests to improve your score
      </p>
    </div>
  );
};

export default ReadinessGauge;

