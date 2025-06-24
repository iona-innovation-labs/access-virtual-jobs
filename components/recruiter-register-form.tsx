"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Building2, Users, Briefcase } from "lucide-react";

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

// Recruiter-specific registration schema
const recruiterRegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.literal("recruiter"),
    companyName: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    companySize: z.string().min(1, "Please select company size"),
    industry: z.string().min(1, "Industry is required"),
    authorizedToHire: z.boolean().refine((val) => val === true, {
      message: "You must confirm you are authorized to hire",
    }),
    validBusinessEmail: z.boolean().refine((val) => val === true, {
      message: "You must confirm you are using a valid business email",
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

const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Real Estate",
  "Media & Entertainment",
  "Non-profit",
  "Government",
  "Other",
];

export default function RecruiterRegisterForm() {
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
    authorizedToHire: false,
    validBusinessEmail: false,
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

    // Get form data from DOM elements
    const firstName =
      (document.getElementById("firstName") as HTMLInputElement)?.value || "";
    const lastName =
      (document.getElementById("lastName") as HTMLInputElement)?.value || "";
    const email =
      (document.getElementById("email") as HTMLInputElement)?.value || "";
    const companyName =
      (document.getElementById("companyName") as HTMLInputElement)?.value || "";
    const jobTitle =
      (document.getElementById("jobTitle") as HTMLInputElement)?.value || "";
    const companySize =
      (document.getElementById("companySize") as HTMLSelectElement)?.value ||
      "";
    const industry =
      (document.getElementById("industry") as HTMLSelectElement)?.value || "";

    const data = {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      role: "recruiter" as const,
      companyName,
      jobTitle,
      companySize,
      industry,
      ...checkboxes,
    };

    // Validate with Zod
    const result = recruiterRegisterSchema.safeParse(data);
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
          title: "Recruiter Account Created Successfully",
          description: "Welcome! You're being signed in...",
          variant: "success",
        });

        await signIn("credentials", {
          email: apiResult.credentials.email,
          password: apiResult.credentials.password,
          redirect: true,
          callbackUrl: "/recruiter/dashboard",
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

  // Get password validation status for submit button
  const passwordValidation = validatePassword(password);
  const allCheckboxesChecked = Object.values(checkboxes).every(Boolean);
  const isFormValid =
    password &&
    passwordValidation.isValid &&
    allCheckboxesChecked &&
    confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create a Recruiter account
          </h1>
          <p className="text-gray-600">
            Find and hire the best Filipino talent for your organization
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create Recruiter account</CardTitle>
            <CardDescription>
              Register as a recruiter to post jobs and find talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <Label className="text-sm font-medium text-gray-700">
                    Personal Information
                  </Label>
                </div>

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
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    required
                    className={fieldErrors.email ? "border-red-500" : ""}
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-500">{fieldErrors.email}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Please use your business email address
                  </p>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <Label className="text-sm font-medium text-gray-700">
                    Company Information
                  </Label>
                </div>

                {/* Company Name and Job Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Acme Corp"
                      required
                      className={
                        fieldErrors.companyName ? "border-red-500" : ""
                      }
                    />
                    {fieldErrors.companyName && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.companyName}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="jobTitle">Your Job Title</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      placeholder="HR Manager"
                      required
                      className={fieldErrors.jobTitle ? "border-red-500" : ""}
                    />
                    {fieldErrors.jobTitle && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.jobTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Size and Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <select
                      id="companySize"
                      name="companySize"
                      required
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        fieldErrors.companySize ? "border-red-500" : ""
                      )}
                    >
                      <option value="">Select company size</option>
                      {companySizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.companySize && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.companySize}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="industry">Industry</Label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        fieldErrors.industry ? "border-red-500" : ""
                      )}
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.industry && (
                      <p className="text-sm text-red-500">
                        {fieldErrors.industry}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
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
                    <p className="text-sm text-red-500">
                      {fieldErrors.password}
                    </p>
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
              </div>

              {/* Recruiter Requirements */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Recruiter Requirements
                </Label>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="authorizedToHire"
                        checked={checkboxes.authorizedToHire}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "authorizedToHire",
                            checked as boolean
                          )
                        }
                        className={cn(
                          "mt-0.5 h-4 w-4",
                          fieldErrors.authorizedToHire && "border-red-500"
                        )}
                      />
                      <Label
                        htmlFor="authorizedToHire"
                        className="text-xs font-normal text-gray-800 leading-relaxed cursor-pointer flex-1"
                      >
                        I am authorized to hire employees for my organization
                        and have the necessary permissions to post job
                        opportunities.
                      </Label>
                    </div>
                    {fieldErrors.authorizedToHire && (
                      <p className="text-xs text-red-500 ml-6">
                        {fieldErrors.authorizedToHire}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="validBusinessEmail"
                        checked={checkboxes.validBusinessEmail}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "validBusinessEmail",
                            checked as boolean
                          )
                        }
                        className={cn(
                          "mt-0.5 h-4 w-4",
                          fieldErrors.validBusinessEmail && "border-red-500"
                        )}
                      />
                      <Label
                        htmlFor="validBusinessEmail"
                        className="text-xs font-normal text-gray-800 leading-relaxed cursor-pointer flex-1"
                      >
                        I am using a valid business email address and represent
                        a legitimate organization.
                      </Label>
                    </div>
                    {fieldErrors.validBusinessEmail && (
                      <p className="text-xs text-red-500 ml-6">
                        {fieldErrors.validBusinessEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="noMultipleAccounts"
                        checked={checkboxes.noMultipleAccounts}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "noMultipleAccounts",
                            checked as boolean
                          )
                        }
                        className={cn(
                          "mt-0.5 h-4 w-4",
                          fieldErrors.noMultipleAccounts && "border-red-500"
                        )}
                      />
                      <Label
                        htmlFor="noMultipleAccounts"
                        className="text-xs font-normal text-gray-800 leading-relaxed cursor-pointer flex-1"
                      >
                        I do not have any other recruiter accounts. I
                        acknowledge that multiple accounts are not allowed.
                      </Label>
                    </div>
                    {fieldErrors.noMultipleAccounts && (
                      <p className="text-xs text-red-500 ml-6">
                        {fieldErrors.noMultipleAccounts}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={checkboxes.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "agreeToTerms",
                            checked as boolean
                          )
                        }
                        className={cn(
                          "mt-0.5 h-4 w-4",
                          fieldErrors.agreeToTerms && "border-red-500"
                        )}
                      />
                      <Label
                        htmlFor="agreeToTerms"
                        className="text-xs font-normal text-gray-800 leading-relaxed cursor-pointer flex-1"
                      >
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
                      </Label>
                    </div>
                    {fieldErrors.agreeToTerms && (
                      <p className="text-xs text-red-500 ml-6">
                        {fieldErrors.agreeToTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Submit Button */}
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                disabled={loading || !isFormValid}
              >
                {loading ? "Creating account..." : "Create Recruiter Account"}
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
                  signIn("google", { callbackUrl: "/recruiter/dashboard" })
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
                  className="text-blue-600 underline underline-offset-4 hover:text-blue-700"
                >
                  Login
                </Link>
              </div>

              {/* Switch to Job Seeker */}
              <div className="text-center text-sm">
                Looking for a job instead?{" "}
                <Link
                  href="/register"
                  className="text-green-600 underline underline-offset-4 hover:text-green-700"
                >
                  Register as Job Seeker
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-xs text-gray-500">
          <p>
            By creating a recruiter account, you&apos;re joining a platform
            dedicated to connecting businesses with the best Filipino talent.
          </p>
        </div>
      </div>
    </div>
  );
}
