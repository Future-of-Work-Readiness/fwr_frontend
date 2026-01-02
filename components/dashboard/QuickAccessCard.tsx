"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: "default" | "accent";
}

export const QuickAccessCard = ({
  title,
  description,
  icon: Icon,
  href,
  variant = "default",
}: QuickAccessCardProps) => {
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-2 bg-white ${
      variant === "accent" 
        ? "border-orange/20 hover:border-orange/30 bg-gradient-to-br from-orange/5 to-white" 
        : "border-primary/20 hover:border-primary/30"
    }`}>
      <CardContent className="p-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 shadow-md ${
          variant === "accent" 
            ? "bg-orange/10 border-2 border-orange/20" 
            : "bg-primary/10 border-2 border-primary/20"
        }`}>
          <Icon className={`h-7 w-7 ${variant === "accent" ? "text-orange" : "text-primary"}`} />
        </div>
        <h3 className="font-semibold text-xl mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
        <Button 
          asChild 
          className={`w-full font-semibold shadow-md hover:shadow-lg transition-all ${
            variant === "accent" 
              ? "bg-orange hover:bg-orange/90 text-white" 
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
        >
          <Link href={href}>Get Started</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAccessCard;

