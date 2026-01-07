"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useResetPassword } from "@/hooks";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { ApiError } from "@/lib/api/types";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const resetPasswordMutation = useResetPassword();

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    // Validate with Zod
    try {
      resetPasswordSchema.parse({ password, confirmPassword, token });
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
      await resetPasswordMutation.mutateAsync({
        token,
        password,
        confirmPassword,
      });
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: unknown) {
      // Check if it's a rate limit error (429)
      const apiError = error as ApiError;
      if (apiError?.status === 429) {
        setRateLimited(true);
        toast.error("Too many attempts. Please wait before trying again.", {
          duration: 5000,
          icon: <Clock className="h-4 w-4" />,
        });
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password";
      
      // Check for specific error types
      if (errorMessage.toLowerCase().includes("expired") || errorMessage.toLowerCase().includes("invalid")) {
        toast.error("This reset link has expired or is invalid. Please request a new one.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const isLoading = resetPasswordMutation.isPending;

  // Rate limited state
  if (rateLimited) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">Too many attempts</CardTitle>
              <CardDescription className="text-base mt-2">
                You&apos;ve made too many password reset attempts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-amber-800">
                      Please wait before trying again
                    </p>
                    <ul className="list-disc list-inside text-amber-700 space-y-1">
                      <li>Wait a few minutes before your next attempt</li>
                      <li>Make sure your new password meets all requirements</li>
                      <li>Double-check that both passwords match</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => setRateLimited(false)}
                >
                  Try again
                </Button>
                <Link href="/forgot-password">
                  <Button variant="outline" className="w-full">
                    Request new reset link
                  </Button>
                </Link>
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

  // No token state
  if (!token) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">Invalid Link</CardTitle>
              <CardDescription className="text-base mt-2">
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/forgot-password">
                <Button className="w-full">Request new reset link</Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">Password reset!</CardTitle>
              <CardDescription className="text-base mt-2">
                Your password has been successfully reset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                You can now log in with your new password.
              </p>
              <Link href="/auth">
                <Button className="w-full">
                  Continue to login
                </Button>
              </Link>
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
            <CardTitle className="text-2xl font-display">Set new password</CardTitle>
            <CardDescription className="text-base mt-2">
              Your new password must be at least 6 characters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password requirements hint */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p className={password.length >= 6 ? "text-primary" : ""}>
                  {password.length >= 6 ? "✓" : "○"} At least 6 characters
                </p>
                <p className={password === confirmPassword && confirmPassword.length > 0 ? "text-primary" : ""}>
                  {password === confirmPassword && confirmPassword.length > 0 ? "✓" : "○"} Passwords match
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || password.length < 6 || password !== confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen gradient-hero flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

