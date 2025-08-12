"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  passwordSchema,
  confirmPasswordSchema,
} from "@/lib/validation/password-validation";
import { z } from "zod";
import {
  PasswordStrengthChecker,
  defaultPasswordRequirements,
} from "@/components/auth/password/password-strength-checker";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const validatePassword = (pwd: string) => {
    try {
      passwordSchema.parse(pwd);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map((err) => err.message),
        };
      }
      return { isValid: false, errors: ["Invalid password"] };
    }
  };

  const validateConfirmPassword = (pwd: string, confirmPwd: string) => {
    try {
      confirmPasswordSchema.parse({
        password: pwd,
        confirmPassword: confirmPwd,
      });
      return { isValid: true, error: "" };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const confirmError = error.errors.find((err) =>
          err.path.includes("confirmPassword")
        );
        return { isValid: false, error: confirmError?.message || "" };
      }
      return { isValid: false, error: "Passwords do not match" };
    }
  };

  const passwordValidation = validatePassword(password);
  const confirmPasswordValidation = validateConfirmPassword(
    password,
    confirmPassword
  );

  const isPasswordValid = passwordValidation.isValid;
  const isConfirmPasswordValid = confirmPasswordValidation.isValid;

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordErrors(validation.errors);

    if (confirmPassword) {
      const confirmValidation = validateConfirmPassword(value, confirmPassword);
      setConfirmPasswordError(confirmValidation.error);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value && password) {
      const confirmValidation = validateConfirmPassword(password, value);
      setConfirmPasswordError(confirmValidation.error);
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordValidation = validatePassword(password);
    const confirmValidation = validateConfirmPassword(
      password,
      confirmPassword
    );

    if (!passwordValidation.isValid || !confirmValidation.isValid) {
      setError("Please fix the password validation errors");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Password reset successfully! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  The reset link you clicked is either invalid or has expired.
                  Please request a new one.
                </p>
              </div>

              <Button asChild className="w-full bg-blue-900 cursor-pointer">
                <Link href="/auth/forgot-password">Request New Reset Link</Link>
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="underline underline-offset-4">
                  Back to Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Enter a new password for <strong>{email}</strong>
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
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onFocus={() => setShowPasswordRequirements(true)}
                    disabled={isLoading}
                    className={cn(
                      "pr-10",
                      password.length > 0 &&
                        (isPasswordValid
                          ? "border-green-500"
                          : "border-red-500")
                    )}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!password || isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-zinc-400" />
                    )}
                  </Button>
                </div>
                {passwordErrors.length > 0 && (
                  <div className="space-y-1">
                    {passwordErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <PasswordStrengthChecker
                  password={password}
                  requirements={defaultPasswordRequirements}
                  isVisible={showPasswordRequirements}
                  showOverallStatus={true}
                  overallStatusLabel="At least 3 requirements satisfied"
                  minRequiredChecks={3}
                  variant="default"
                  className="mt-2"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                    disabled={isLoading}
                    className={cn(
                      "pr-10",
                      confirmPassword.length > 0 &&
                        (isConfirmPasswordValid
                          ? "border-green-500"
                          : "border-red-500")
                    )}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={!confirmPassword || isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-zinc-400" />
                    )}
                  </Button>
                </div>
                {confirmPasswordError && (
                  <p className="text-sm text-red-600">{confirmPasswordError}</p>
                )}

                {confirmPassword.length > 0 && !confirmPasswordError && (
                  <p className="text-sm text-green-600">✓ Passwords match</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-900 cursor-pointer"
                disabled={
                  isLoading || !isPasswordValid || !isConfirmPasswordValid
                }
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>

              <div className="text-center text-sm">
                <Link href="/register" className="underline underline-offset-4">
                  Create a Free Account
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
