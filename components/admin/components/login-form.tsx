"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const validateResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, expectedRole: "admin" }),
      });
      const validateData = await validateResponse.json();
      if (!validateResponse.ok) {
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
        router.push("/admin/app/dashboard");
      } else {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Admin Portal</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCredentialsLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
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
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* You can add a forgot password link here if needed */}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  className={fieldErrors.password ? "border-red-500" : ""}
                  required
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
