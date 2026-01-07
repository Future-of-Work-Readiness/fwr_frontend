"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForgotPassword } from "@/hooks";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Mail, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { ApiError } from "@/lib/api/types";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setRateLimited(false);

    // Validate with Zod
    try {
      forgotPasswordSchema.parse({ email });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setSubmitted(true);
      toast.success("Check your email for reset instructions");
    } catch (error) {
      // Check if it's a rate limit error (429)
      const apiError = error as ApiError;
      if (apiError?.status === 429) {
        setRateLimited(true);
        toast.error("Too many requests. Please wait before trying again.", {
          duration: 5000,
          icon: <Clock className="h-4 w-4" />,
        });
        return;
      }
      
      // For other errors, still show success to prevent email enumeration
      // The backend always returns success for security reasons
      setSubmitted(true);
      toast.success("Check your email for reset instructions");
    }
  };

  const isLoading = forgotPasswordMutation.isPending;

  // Rate limited state
  if (rateLimited) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">Too many requests</CardTitle>
              <CardDescription className="text-base mt-2">
                You&apos;ve reached the limit for password reset requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-amber-800">
                      What you can do:
                    </p>
                    <ul className="list-disc list-inside text-amber-700 space-y-1">
                      <li>Wait <strong>1 hour</strong> before requesting another reset</li>
                      <li>Check your email inbox and spam folder for existing reset links</li>
                      <li>Use a reset link you&apos;ve already received (valid for 1 hour)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                <p>
                  If you&apos;re having trouble accessing your account, please{" "}
                  <a 
                    href="mailto:support@readinessai.io" 
                    className="text-primary hover:underline font-medium"
                  >
                    contact support
                  </a>
                  .
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setRateLimited(false)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Try again later
                </Button>
                <Link href="/auth">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">Check your email</CardTitle>
              <CardDescription className="text-base mt-2">
                We&apos;ve sent password reset instructions to:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="font-medium text-foreground bg-muted px-4 py-2 rounded-lg inline-block">
                  {email}
                </p>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Click the link in the email to reset your password. The link will expire in <strong className="text-foreground">1 hour</strong>.
                </p>
                
                {/* Cooldown hint - shown to all users for security */}
                <div className="bg-muted/50 rounded-lg p-3 border">
                  <p className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <span>
                      <strong className="text-foreground">Note:</strong> You can only request one reset email every <strong className="text-foreground">5 minutes</strong>. 
                      If you&apos;ve just submitted a request, please wait before trying again.
                    </span>
                  </p>
                </div>

                <p>
                  Didn&apos;t receive the email? Check your spam folder. If it&apos;s been more than 5 minutes, you can{" "}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    try again
                  </button>
                  .
                </p>
              </div>

              <div className="pt-2">
                <Link href="/auth">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Image
                src="/assets/RAI-Logo2-nobg.png"
                alt="ReadinessAI Logo"
                width={66}
                height={66}
              />
            </div>
            <CardTitle className="text-2xl font-display">Forgot password?</CardTitle>
            <CardDescription className="text-base mt-2">
              No worries, we&apos;ll send you reset instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

