"use client";

import ScrollReveal from "@/components/ui/scroll-reveal";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-primary to-navy-dark" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Icon badge - R logo */}
          <ScrollReveal className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-glow">
                <span className="font-display font-bold text-4xl text-primary">R</span>
              </div>
              <div className="absolute -inset-2 bg-accent/20 rounded-3xl blur-xl -z-10 animate-pulse" />
            </div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal delay={0.1} className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan mt-2">
                Readiness Score?
              </span>
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Start your assessment today
            </p>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default CTASection;

