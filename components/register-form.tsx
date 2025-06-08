"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";

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
import { Check, X } from "lucide-react";

// Password validation schema
const passwordSchema = z.string().refine(
  (password) => {
    if (password.length < 8) return false;

    const checks = [
      /[a-z]/.test(password), // lowercase
      /[A-Z]/.test(password), // uppercase
      /[0-9]/.test(password), // numbers
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), // special chars
    ];

    const satisfiedChecks = checks.filter(Boolean).length;
    return satisfiedChecks >= 3;
  },
  {
    message:
      "Password must be at least 8 characters and contain at least 3 of: lowercase, uppercase, numbers, or special characters",
  }
);

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    label: "Lower case letters (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Upper case letters (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Numbers (0-9)",
    test: (password) => /[0-9]/.test(password),
  },
  {
    label: "Special characters (e.g. !@#$%^&*)",
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  },
];

function PasswordRequirements({ password }: { password: string }) {
  const meetsLength = passwordRequirements[0].test(password);
  const characterTypesMet = passwordRequirements
    .slice(1)
    .filter((req) => req.test(password)).length;
  const meetsCharacterRequirement = characterTypesMet >= 3;

  return (
    <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
      <p className="text-sm font-medium text-gray-700">
        Your password must contain:
      </p>

      {/* Length requirement */}
      <div className="flex items-center space-x-2">
        {meetsLength ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <X className="w-4 h-4 text-gray-400" />
        )}
        <span
          className={cn(
            "text-sm",
            meetsLength ? "text-green-600" : "text-gray-500"
          )}
        >
          At least 8 characters
        </span>
      </div>

      {/* Character type requirements */}
      <div className="flex items-center space-x-2">
        {meetsCharacterRequirement ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <X className="w-4 h-4 text-gray-400" />
        )}
        <span
          className={cn(
            "text-sm",
            meetsCharacterRequirement ? "text-green-600" : "text-gray-500"
          )}
        >
          At least 3 of the following:
        </span>
      </div>

      {/* Individual character type checks */}
      <div className="ml-6 space-y-1">
        {passwordRequirements.slice(1).map((requirement, index) => {
          const isMet = requirement.test(password);
          return (
            <div key={index} className="flex items-center space-x-2">
              {isMet ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <X className="w-3 h-3 text-gray-400" />
              )}
              <span
                className={cn(
                  "text-xs",
                  isMet ? "text-green-600" : "text-gray-500"
                )}
              >
                {requirement.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };

    // Validate with Zod
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          errors[error.path[0] as string] = error.message;
        }
      });
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const apiResult = await res.json();

      if (apiResult.success) {
        await signIn("credentials", {
          email: apiResult.credentials.email,
          password: apiResult.credentials.password,
          redirect: true,
          callbackUrl: "/app/overview",
        });
      } else {
        setError(apiResult.error || "Registration failed");
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Register with your email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    className={fieldErrors.firstName ? "border-red-500" : ""}
                  />
                  {fieldErrors.firstName && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    className={fieldErrors.lastName ? "border-red-500" : ""}
                  />
                  {fieldErrors.lastName && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className={fieldErrors.email ? "border-red-500" : ""}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldErrors.password ? "border-red-500" : ""}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              {/* Password Requirements Display */}
              {password && <PasswordRequirements password={password} />}

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-brand cursor-pointer hover:bg-brand-dark text-white"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign up"}
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() =>
                      signIn("google", { callbackUrl: "/app/overview" })
                    }
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
                    Sign up with Google
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-brand underline underline-offset-4 hover:text-brand-dark"
                >
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By signing up, you agree to our{" "}
        <a
          href="/legal/terms-of-services"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/legal/privacy-policy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
