'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error page for Next.js App Router.
 * This catches errors in the app and displays a friendly error page.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console (in production, send to error tracking)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            We encountered an unexpected error. Please try again or return to the dashboard.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs font-mono text-destructive break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={reset}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
