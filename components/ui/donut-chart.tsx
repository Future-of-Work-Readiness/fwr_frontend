import * as React from "react";
import { cn } from "@/lib/utils";

interface DonutChartProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

const DonutChart = ({
  value,
  size = 80,
  strokeWidth = 8,
  color = "hsl(var(--primary))",
  backgroundColor = "hsl(var(--muted) / 0.3)",
  className,
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center text */}
      <span className="absolute text-sm font-semibold" style={{ color }}>
        {value}%
      </span>
    </div>
  );
};

export { DonutChart };

