"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-orange/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-base max-w-sm mx-auto">
            We encountered an unexpected error. Please try again or return to the home page.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="mt-4 p-4 bg-destructive/10 rounded-lg text-left">
              <p className="text-xs font-mono text-destructive break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

