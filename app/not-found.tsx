"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-orange/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[150px] sm:text-[200px] font-display font-bold text-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-orange flex items-center justify-center shadow-xl">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-sm mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-primary hover:underline"
            >
              Dashboard
            </Link>
            <Link
              href="/technical-skills"
              className="text-sm text-primary hover:underline"
            >
              Technical Skills
            </Link>
            <Link
              href="/soft-skills"
              className="text-sm text-primary hover:underline"
            >
              Soft Skills
            </Link>
            <Link
              href="/careers"
              className="text-sm text-primary hover:underline"
            >
              Careers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

