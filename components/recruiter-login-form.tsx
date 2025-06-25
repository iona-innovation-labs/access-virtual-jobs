"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PrivacyDialog from "./landing/legal/privacy-dialog";
import TermsDialog from "./landing/legal/term-dialog";

export default function RecruiterLoginPage() {
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
          expectedRole: "recruiter", // Add role validation
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

        // Direct redirect to recruiter area
        router.push("/recruiter/dashboard");
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

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/recruiter/dashboard",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Google Login Failed",
        description: "Unable to login with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recruiter Login
          </h1>
          <p className="text-gray-600">
            Sign in to your account to manage your hiring process
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back, Recruiter</CardTitle>
            <CardDescription>Login to find the best talent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Google Login */}
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

              {/* Divider */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with email
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleCredentialsLogin} className="space-y-6">
                {/* Email Field */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="recruiter@company.com"
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
                  className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Logging in...
                    </div>
                  ) : (
                    "Login as Recruiter"
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                Don&apos;t have a recruiter account?{" "}
                <Link
                  href="/register/recruiter"
                  className="text-blue-600 underline underline-offset-4 hover:text-blue-700"
                >
                  Sign up as Recruiter
                </Link>
              </div>

              {/* Switch Account Type */}
              <div className="text-center text-sm border-t pt-4">
                <p className="text-gray-600 mb-2">Are you a job seeker?</p>
                <Link
                  href="/login"
                  className="text-green-600 underline underline-offset-4 hover:text-green-700"
                >
                  Login as Job Seeker instead
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            By clicking continue, you agree to our{" "}
            <TermsDialog>Terms of Service</TermsDialog> and{" "}
            <PrivacyDialog>Privacy Policy</PrivacyDialog>.
          </p>
        </div>
      </div>
    </div>
  );
}
