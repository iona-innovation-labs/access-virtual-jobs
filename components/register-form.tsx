"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  PasswordStrengthChecker,
  usePasswordValidation,
  defaultPasswordRequirements,
} from "@/components/auth/password/password-strength-checker";
import { passwordSchema } from "@/lib/validation/password-validation";
import { registrationCheckboxes } from "@/config/register-terms.config";

// Registration schema with confirm password added
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    filipinoWorker: z.boolean().refine((val) => val === true, {
      message: "You must confirm you are a Filipino worker",
    }),
    individualWorker: z.boolean().refine((val) => val === true, {
      message: "You must confirm you are an individual worker",
    }),
    noMultipleAccounts: z.boolean().refine((val) => val === true, {
      message: "You must confirm you don't have multiple accounts",
    }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [checkboxes, setCheckboxes] = useState({
    filipinoWorker: false,
    individualWorker: false,
    noMultipleAccounts: false,
    agreeToTerms: false,
  });

  const { validatePassword } = usePasswordValidation(
    defaultPasswordRequirements,
    3
  );

  const handleCheckboxChange = (checkboxId: string, checked: boolean) => {
    setCheckboxes((prev) => ({
      ...prev,
      [checkboxId]: checked,
    }));

    // Clear field error when checkbox is checked
    if (checked && fieldErrors[checkboxId]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[checkboxId];
        return newErrors;
      });
    }
  };

  async function handleSubmit() {
    setError("");
    setFieldErrors({});
    setLoading(true);

    // Get form data from DOM elements (preserving original functionality)
    const firstName =
      (document.getElementById("firstName") as HTMLInputElement)?.value || "";
    const lastName =
      (document.getElementById("lastName") as HTMLInputElement)?.value || "";
    const email =
      (document.getElementById("email") as HTMLInputElement)?.value || "";

    const data = {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      ...checkboxes,
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

      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
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
        toast({
          title: "Account Created Successfully",
          description: "Welcome! You're being signed in...",
          variant: "success",
        });

        await signIn("credentials", {
          email: apiResult.credentials.email,
          password: apiResult.credentials.password,
          redirect: true,
          callbackUrl: "/app/overview",
        });
      } else {
        setError(apiResult.error || "Registration failed");
        toast({
          title: "Registration Failed",
          description:
            apiResult.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Something went wrong");
      toast({
        title: "Network Error",
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Get password validation status for submit button (preserving original logic)
  const passwordValidation = validatePassword(password);
  const allCheckboxesChecked = Object.values(checkboxes).every(Boolean);
  const isFormValid =
    password &&
    passwordValidation.isValid &&
    allCheckboxesChecked &&
    confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create a free Job seeker account
          </h1>
          <p className="text-gray-600">
            Join thousands of Filipino workers finding their dream jobs
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>
              Register with your email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Name Fields */}
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

              {/* Email Field */}
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

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowPasswordRequirements(true)}
                    className={cn(
                      "pr-10",
                      fieldErrors.password ? "border-red-500" : "",
                      password &&
                        (passwordValidation.isValid
                          ? "border-green-500"
                          : "border-red-500")
                    )}
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
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}

                {/* Password Requirements Component */}
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

              {/* Confirm Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "pr-10",
                      fieldErrors.confirmPassword ? "border-red-500" : "",
                      confirmPassword &&
                        password &&
                        confirmPassword === password
                        ? "border-green-500"
                        : confirmPassword &&
                            password &&
                            confirmPassword !== password
                          ? "border-red-500"
                          : ""
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={!confirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Registration Checkboxes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Registration Requirements
                </Label>
                <div className="space-y-2">
                  {registrationCheckboxes.map((checkbox) => (
                    <div key={checkbox.id} className="space-y-1">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id={checkbox.id}
                          checked={
                            checkboxes[checkbox.id as keyof typeof checkboxes]
                          }
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              checkbox.id,
                              checked as boolean
                            )
                          }
                          className={cn(
                            "mt-0.5 h-4 w-4",
                            fieldErrors[checkbox.id] && "border-red-500"
                          )}
                        />
                        <Label
                          htmlFor={checkbox.id}
                          className="text-xs font-normal text-gray-800 leading-relaxed cursor-pointer flex-1"
                        >
                          {checkbox.id === "agreeToTerms" ? (
                            <>
                              I agree to the{" "}
                              <Link
                                href="/legal/terms-of-services"
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                href="/legal/privacy-policy"
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Privacy Policy
                              </Link>
                            </>
                          ) : checkbox.id === "individualWorker" ? (
                            "I am an individual worker and I do not represent any agency or company."
                          ) : checkbox.id === "noMultipleAccounts" ? (
                            "I do not have any other accounts. I acknowledge that multiple accounts are not allowed."
                          ) : (
                            checkbox.label
                          )}
                        </Label>
                      </div>
                      {fieldErrors[checkbox.id] && (
                        <p className="text-xs text-red-500 ml-6">
                          {fieldErrors[checkbox.id]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Submit Button */}
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-brand cursor-pointer hover:bg-brand-dark text-white"
                disabled={loading || !isFormValid}
              >
                {loading ? "Creating account..." : "Sign up"}
              </Button>

              {/* Divider */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              {/* Google Sign Up */}
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() =>
                  signIn("google", { callbackUrl: "/app/overview" })
                }
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
                Sign up with Google
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-brand underline underline-offset-4 hover:text-brand-dark"
                >
                  Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-xs text-gray-500">
          <p>
            By creating an account, you&apos;re joining a community of Filipino
            workers dedicated to finding meaningful employment opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
