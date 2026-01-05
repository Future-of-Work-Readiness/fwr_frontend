"use client";

import { DashboardNav } from "@/components/dashboard";

interface CareersLayoutProps {
  children: React.ReactNode;
}

export default function CareersLayout({ children }: CareersLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

