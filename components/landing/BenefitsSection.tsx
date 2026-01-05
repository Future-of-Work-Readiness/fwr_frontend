"use client";

import { CheckCircle2, TrendingUp, Shield, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const benefits = [
  {
    icon: TrendingUp,
    title: "1. Career Readiness Insight",
    description: "Understand what specific roles actually require before you apply."
  },
  {
    icon: CheckCircle2,
    title: "2. Validate your skills",
    description: "Objective assessments that provides clear, structured view of what you know and where gaps exist."
  },
  {
    icon: Shield,
    title: "3. Informed Career Decisions",
    description: "Identify misalignment early and adjust your direction with confidence. ReadinessAI helps students pivot before committing time to unsuitable paths."
  },
  {
    icon: Sparkles,
    title: "4. Peer Comparison.",
    description: "See how you compare with peers. Preparation becomes intentional, relevant, and aligned."
  }
];

const BenefitsSection = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 -translate-y-1/2 -right-48 w-96 h-96 rounded-full border border-accent/10" />
      <div className="absolute top-1/2 -translate-y-1/2 -right-32 w-64 h-64 rounded-full border border-cyan/10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-1 gap-16 lg:gap-24 items-center">
          {/* Content - Centered */}
          <ScrollReveal direction="right" className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Assess yourself against
              <span className="text-primary block mt-2">industry expectations</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Readiness AI helps students understand what real industry roles actually require.
              Through structured, career-specific assessments, students are exposed to the knowledge and expectations of their chosen field before entering the job market.
              This enables informed career decisions and targeted preparation based on evidence, not guesswork.
            </p>

            {/* Benefits grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={benefit.title} delay={index * 0.1}>
                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-cyan/10 flex items-center justify-center transition-all">
                      <benefit.icon className="w-5 h-5 text-primary  transition-colors" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

