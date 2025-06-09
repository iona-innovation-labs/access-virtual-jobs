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
import { Checkbox } from "@/components/ui/checkbox";
import {
  PasswordStrengthChecker,
  usePasswordValidation,
  defaultPasswordRequirements,
} from "@/components/auth/password/password-strength-checker";
import { passwordSchema } from "@/lib/validation/password-validation";
import { registrationCheckboxes } from "@/config/register-terms.config";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
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
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
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

    // Get form data from DOM elements
    const firstName =
      (document.getElementById("firstName") as HTMLInputElement)?.value || "";
    const lastName =
      (document.getElementById("lastName") as HTMLInputElement)?.value || "";
    const email =
      (document.getElementById("email") as HTMLInputElement)?.value || "";

    const data = {
      email,
      password,
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

  // Get password validation status for submit button
  const passwordValidation = validatePassword(password);
  const allCheckboxesChecked = Object.values(checkboxes).every(Boolean);
  const isFormValid =
    password && passwordValidation.isValid && allCheckboxesChecked;

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
          <div>
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
                  onFocus={() => setShowPasswordRequirements(true)}
                  className={cn(
                    fieldErrors.password ? "border-red-500" : "",
                    password &&
                      (passwordValidation.isValid
                        ? "border-green-500"
                        : "border-red-500")
                  )}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}

                {/* Reusable Password Requirements Component */}
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
                              <a
                                href="/legal/terms-of-services"
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a
                                href="/legal/privacy-policy"
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Privacy Policy
                              </a>
                            </>
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

              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-brand cursor-pointer hover:bg-brand-dark text-white"
                disabled={loading || !isFormValid}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
