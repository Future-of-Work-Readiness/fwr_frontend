'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and display React errors gracefully.
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // In production, you could send to error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRefresh = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/dashboard';
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                An unexpected error occurred. Please try refreshing the page or go back to the dashboard.
              </p>
              
              {process.env.NODE_ENV === 'development' && error && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-mono text-destructive break-all">
                    {error.message}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={this.handleReset}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
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

    return children;
  }
}

/**
 * Simpler functional error fallback component
 */
interface ErrorFallbackProps {
  error?: Error | null;
  resetError?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  resetError,
  title = 'Something went wrong',
  message = 'An unexpected error occurred.',
}: ErrorFallbackProps) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">{message}</p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs font-mono text-destructive break-all">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex justify-center gap-2">
            {resetError && (
              <Button variant="outline" onClick={resetError}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button onClick={() => window.location.href = '/dashboard'}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Query error fallback for TanStack Query errors
 */
interface QueryErrorFallbackProps {
  error: Error | null;
  refetch?: () => void;
  title?: string;
}

export function QueryErrorFallback({
  error,
  refetch,
  title = 'Failed to load data',
}: QueryErrorFallbackProps) {
  const isNetworkError = error?.message?.toLowerCase().includes('network') ||
                         error?.message?.toLowerCase().includes('fetch');
  
  const message = isNetworkError
    ? 'Please check your internet connection and try again.'
    : 'There was a problem loading this content. Please try again.';

  return (
    <div className="p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {refetch && (
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}

