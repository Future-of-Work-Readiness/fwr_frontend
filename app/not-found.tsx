import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found page for Next.js App Router.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              asChild
              className="flex-1"
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1"
            >
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
