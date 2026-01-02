"use client";

import { 
  Brain, 
  Users, 
  BarChart3, 
  Lightbulb,
  Target,
  ArrowRight
} from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const features = [
  {
    icon: Target,
    title: "Careers",
    description: "Explore clearly defined career paths across sectors. Each career test is mapped to role-specific expectations used in assess candidates for the job market.",
    gradient: "from-primary to-orange",
  },
  {
    icon: Brain,
    title: "Knowledge Tests",
    description: "Each career path has five difficulty levels, with the flexibility to start at any level. A separate soft skills assessment is included.",
    gradient: "from-cyan to-cyan-light",
  },
  {
    icon: BarChart3,
    title: "Readiness Score",
    description: "The score provides a clear indication of current alignment with chosen career roles.",
    gradient: "from-primary to-navy-light",
  },
  {
    icon: Users,
    title: "Peer Benchmarking",
    description: "See how your scores compares with peers who have chosen the same fields as you.",
    gradient: "from-cyan to-primary",
  },
  {
    icon: Lightbulb,
    title: "Goal Setting",
    description: "Reflect on your learning journey, journal your experience and set smart goals.",
    gradient: "from-accent to-cyan",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header - Left aligned */}
        <ScrollReveal className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-primary font-semibold text-sm">Core Features</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Know where you stand
          </h2>
        </ScrollReveal>

        {/* Features Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <div
                className="group relative bg-card rounded-3xl p-8 border border-border/50 hover:border-accent/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  {/* Learn more link */}
                  <div className="flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

