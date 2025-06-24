import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  id: string;
}

export interface PasswordStrengthCheckerProps {
  password: string;
  requirements?: PasswordRequirement[];
  className?: string;
  showOverallStatus?: boolean;
  overallStatusLabel?: string;
  minRequiredChecks?: number;
  variant?: "default" | "compact" | "minimal";
  showOnlyWhenFocused?: boolean;
  isVisible?: boolean;
}

// Default password requirements
export const defaultPasswordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "lowercase",
    label: "Lower case letters (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "Upper case letters (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "numbers",
    label: "Numbers (0-9)",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "Special characters (e.g. !@#$%^&*)",
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  },
];

export function PasswordStrengthChecker({
  password,
  requirements = defaultPasswordRequirements,
  className,
  showOverallStatus = true,
  overallStatusLabel = "At least 3 requirements satisfied",
  minRequiredChecks = 3,
  variant = "default",
  showOnlyWhenFocused = false,
  isVisible = true,
}: PasswordStrengthCheckerProps) {
  if (!isVisible || (showOnlyWhenFocused && !isVisible)) {
    return null;
  }

  const requirementStatus = requirements.map((req) => ({
    ...req,
    satisfied: req.test(password),
  }));

  const satisfiedCount = requirementStatus.filter(
    (req) => req.satisfied
  ).length;
  const isOverallValid = satisfiedCount >= minRequiredChecks;

  return (
    <div
      className={cn(
        "bg-gray-50 border border-gray-200 rounded-lg p-3",
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">
          Password Requirements:
        </p>

        {requirementStatus.map((req) => (
          <div key={req.id} className="flex items-center gap-2">
            <div
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center",
                req.satisfied ? "bg-green-100" : "bg-gray-100"
              )}
            >
              {req.satisfied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <X className="w-3 h-3 text-gray-400" />
              )}
            </div>
            <span
              className={cn(
                "text-xs",
                req.satisfied ? "text-green-700" : "text-gray-500"
              )}
            >
              {req.label}
            </span>
          </div>
        ))}

        {showOverallStatus && (
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center",
                  isOverallValid ? "bg-green-100" : "bg-gray-100"
                )}
              >
                {isOverallValid ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <X className="w-3 h-3 text-gray-400" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isOverallValid ? "text-green-700" : "text-gray-500"
                )}
              >
                {overallStatusLabel} ({satisfiedCount}/{requirements.length})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for password validation logic
export function usePasswordValidation(
  requirements: PasswordRequirement[] = defaultPasswordRequirements,
  minRequiredChecks: number = 3
) {
  const validatePassword = (password: string) => {
    const requirementStatus = requirements.map((req) => ({
      ...req,
      satisfied: req.test(password),
    }));

    const satisfiedCount = requirementStatus.filter(
      (req) => req.satisfied
    ).length;
    const isValid = satisfiedCount >= minRequiredChecks;

    return {
      isValid,
      satisfiedCount,
      totalRequirements: requirements.length,
      requirements: requirementStatus,
    };
  };

  return { validatePassword };
}
