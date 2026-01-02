"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Trophy,
  LogOut,
  Menu,
  X,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/careers", label: "Careers", icon: Briefcase },
  { href: "/benchmarking", label: "Benchmarking", icon: BarChart3 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/results", label: "Results", icon: Trophy },
];

export const DashboardNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide sidebar on Technical Skills and Soft Skills pages
  const hideSidebar = pathname === "/technical-skills" || pathname === "/soft-skills";

  const handleSignOut = () => {
    logout();
    router.replace("/auth");
  };

  if (hideSidebar) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 min-h-screen bg-card border-r border-border p-5">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <span className="font-display font-bold text-lg text-white">R</span>
            </div>
            <span className="text-xl font-display font-bold text-primary">
              ReadinessAI
            </span>
          </Link>
        </div>

        <div className="mb-4 p-4 rounded-lg border border-border bg-muted/30">
          <p className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
            Quick Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex-1" />

        <Button
          variant="ghost"
          className="justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-base text-white">R</span>
            </div>
            <span className="text-lg font-display font-bold text-primary">
              ReadinessAI
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="p-4 border-t border-border space-y-1 bg-card">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </nav>
        )}
      </header>
    </>
  );
};

export default DashboardNav;

