"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { forgotPasswordSchema } from "@/lib/validation/password-validation";
import { z } from "zod";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (emailValue: string) => {
    try {
      forgotPasswordSchema.parse({ email: emailValue });
      setEmailError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0]?.message || "");
      }
      return false;
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = email && !emailError;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    email.length > 0 &&
                      (isEmailValid ? "border-green-500" : "border-red-500")
                  )}
                  required
                />
                {emailError && (
                  <p className="text-sm text-red-600">{emailError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-900 cursor-pointer"
                disabled={isLoading || !isEmailValid}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        Secure password reset for{" "}
        <span className="font-medium">Access Virtual Jobs</span>
      </div>
    </div>
  );
}
