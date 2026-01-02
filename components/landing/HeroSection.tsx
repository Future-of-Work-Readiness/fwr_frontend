"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        backgroundImage: `url(/hero-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay with diagonal gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy/90 to-transparent" />
      
      {/* Geometric shapes */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[100px]" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-cyan/20 blur-[80px]" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--cyan) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--cyan) / 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="text-left">
            {/* Main Headline with creative typography */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4 sm:mb-6"
            >
              Step confidently into your career
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-base sm:text-lg lg:text-xl text-white/80 max-w-xl mb-6 sm:mb-8 lg:mb-10 leading-relaxed"
            >
              Bridge the gap between Academics and Industry by discovering your readiness score and unlocking the practical insights that will help you succeed in a competitive job market.
            </motion.p>

            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button asChild variant="hero" size="xl" className="group">
                <Link href="/auth?tab=signup">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right side - Feature preview cards */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="block relative mx-auto lg:ml-auto lg:mx-0"
            style={{ transform: 'translateX(0)' }}
          >
            {/* Main card - Readiness Score Box with colorful styling */}
            <div 
              className="relative shadow-2xl rounded-3xl bg-gradient-to-br from-[hsl(200_95%_50%)]/10 via-white to-[hsl(20_95%_65%)]/10 border-2 border-[hsl(200_95%_50%)]/20 w-full max-w-sm mx-auto lg:max-w-none lg:w-[420px] p-6 sm:p-8 lg:p-10 h-auto min-h-[400px] lg:h-[524px]"
            >
              <div className="h-full flex flex-col">
                {/* Readiness Score Title - Top Center */}
                <div className="mb-4 text-center">
                  <h3 className="font-display text-2xl font-bold text-foreground">Readiness Score</h3>
                </div>
                
                {/* 75% - Middle Center */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-6xl font-display font-bold text-[hsl(20_95%_65%)]">75%</div>
                </div>
                
                {/* Three Horizontal Bar Charts - Side by Side (Taller Bars) */}
                <div className="flex flex-row items-end justify-center gap-2 sm:gap-3 lg:gap-4">
                  {/* Technical Skills - Highest (Blue) */}
                  <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                    <div className="text-center">
                      <div className="text-[10px] sm:text-xs font-semibold text-foreground mb-1">Technical Skills</div>
                      <div className="text-xs sm:text-sm font-bold text-[hsl(200_95%_50%)]">85%</div>
                    </div>
                    <div className="w-full max-w-[48px] sm:max-w-[56px] lg:max-w-[64px] h-24 sm:h-28 lg:h-32 bg-gray-200 rounded-lg overflow-hidden flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '85%' }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                        className="w-full bg-[hsl(200_95%_50%)] rounded-t-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Soft Skills - Second Highest (Lighter Blue) */}
                  <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                    <div className="text-center">
                      <div className="text-[10px] sm:text-xs font-semibold text-foreground mb-1">Soft Skills</div>
                      <div className="text-xs sm:text-sm font-bold text-[hsl(200_80%_60%)]">70%</div>
                    </div>
                    <div className="w-full max-w-[48px] sm:max-w-[56px] lg:max-w-[64px] h-24 sm:h-28 lg:h-32 bg-gray-200 rounded-lg overflow-hidden flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '70%' }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                        className="w-full bg-[hsl(200_80%_60%)] rounded-t-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Readiness Score - Lowest (Orange) */}
                  <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                    <div className="text-center">
                      <div className="text-[10px] sm:text-xs font-semibold text-foreground mb-1">Readiness Score</div>
                      <div className="text-xs sm:text-sm font-bold text-[hsl(20_95%_65%)]">65%</div>
                    </div>
                    <div className="w-full max-w-[48px] sm:max-w-[56px] lg:max-w-[64px] h-24 sm:h-28 lg:h-32 bg-gray-200 rounded-lg overflow-hidden flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '65%' }}
                        transition={{ duration: 1.2, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                        className="w-full bg-[hsl(20_95%_65%)] rounded-t-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Diagonal bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }} />
    </section>
  );
};

export default HeroSection;

