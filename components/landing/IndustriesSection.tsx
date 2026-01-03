"use client";

import { 
  Cpu, 
  Briefcase, 
  Heart, 
  Building2, 
  GraduationCap,
  ArrowUpRight
} from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const industries = [
  {
    icon: Cpu,
    name: "Technology",
    description: "AI, DevOps, cybersecurity, cloud computing, and software development readiness.",
  },
  {
    icon: Briefcase,
    name: "Finance",
    description: "Financial technology, data analytics, regulatory compliance, and digital banking.",
  },
  {
    icon: Heart,
    name: "Health & Social Care",
    description: "Telemedicine, health informatics, patient care technology, and data management.",
  },
  {
    icon: GraduationCap,
    name: "Education",
    description: "EdTech tools, digital learning platforms, AI in education, and virtual classrooms.",
  },
  {
    icon: Building2,
    name: "Construction",
    description: "BIM technology, sustainable building, smart infrastructure, and project automation.",
  },
];

const IndustriesSection = () => {
  return (
    <section id="industries" className="py-20 lg:py-32 bg-navy-dark relative overflow-hidden">
      {/* Abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full border border-cyan/10" />
        <div className="absolute top-40 right-40 w-48 h-48 rounded-full border border-accent/10" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-cyan/5 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="text-accent">Industries</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Sectors - Horizontal scroll on mobile, grid on desktop */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry, index) => (
            <ScrollReveal key={industry.name} delay={index * 0.08}>
              <div
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all duration-500 h-full"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-cyan/20 border border-white/10 flex items-center justify-center mb-4 group-hover:border-accent/50 transition-colors">
                  <industry.icon className="w-6 h-6 text-cyan group-hover:text-accent transition-colors" />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-accent transition-colors">
                    {industry.name}
                  </h3>
                </div>
                
                <p className="text-white/50 text-sm leading-relaxed">
                  {industry.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;

