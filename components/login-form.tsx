"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function JobSeekerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      // First, validate credentials with our API
      const validateResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          expectedRole: "job_seeker", // Keep role validation
        }),
      });

      const validateData = await validateResponse.json();

      if (!validateResponse.ok) {
        // Handle validation errors
        if (validateData.fieldErrors) {
          setFieldErrors(validateData.fieldErrors);
        }

        if (validateData.wrongAccountType) {
          toast({
            title: "Wrong Account Type",
            description: validateData.message,
            variant: "destructive",
          });
        } else if (validateData.requiresVerification) {
          toast({
            title: "Email Verification Required",
            description:
              validateData.message ||
              "Please verify your email before logging in.",
            variant: "destructive",
          });
        } else if (validateData.suggestGoogle) {
          toast({
            title: "No Password Set",
            description:
              validateData.message +
              " You can also use the Google login button above.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Failed",
            description: validateData.message || "Invalid email or password.",
            variant: "destructive",
          });
        }
        return;
      }

      // If validation passes, use Auth.js signIn
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok && !result.error) {
        toast({
          title: "Welcome Back!",
          description: "You have been successfully logged in.",
          variant: "default",
        });

        // Direct redirect to job seeker area
        router.push("/app/overview");
      } else {
        // This shouldn't happen if our validation worked, but just in case
        setFieldErrors({
          email: "Authentication failed",
          password: "Authentication failed",
        });

        toast({
          title: "Authentication Failed",
          description:
            "Something went wrong during authentication. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      toast({
        title: "Network Error",
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Log in to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/*
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 h-5 w-5"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>

             Divider 
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with email
                </span>
              </div>
              */}
              {/* Login Form */}
              <form onSubmit={handleCredentialsLogin} className="space-y-6">
                {/* Email Field */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    className={fieldErrors.email ? "border-red-500" : ""}
                    required
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-500">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-gray-700 underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearFieldError("password");
                      }}
                      className={cn(
                        "pr-10",
                        fieldErrors.password ? "border-red-500" : ""
                      )}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={!password}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-brand cursor-pointer hover:bg-brand-dark text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Logging in...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                <Link
                  href="/register"
                  className="text-brand hover:text-brand-dark"
                >
                  Create a Free Account.
                </Link>
              </div>

              {/* Switch Account Type */}
              <div className="text-center text-sm border-t pt-4">
                <Link
                  href="/login/recruiter"
                  className="text-foreground/50 hover:text-brand-dark"
                >
                  Are you a recruiter?
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            By clicking continue, you agree to our{" "}
            <Link
              href="/legal/terms-of-services"
              className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy-policy"
              className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
