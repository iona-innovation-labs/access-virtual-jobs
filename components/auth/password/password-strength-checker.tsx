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

  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return "p-2 bg-muted/30";
      case "minimal":
        return "p-0 bg-transparent border-0 shadow-none";
      default:
        return "p-3 bg-muted/50";
    }
  };

  const getItemSpacing = () => {
    switch (variant) {
      case "compact":
        return "space-y-1";
      case "minimal":
        return "space-y-1";
      default:
        return "space-y-2";
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case "compact":
        return "text-xs";
      case "minimal":
        return "text-xs";
      default:
        return "text-xs";
    }
  };

  return (
    <Card className={cn(getVariantStyles(), className)}>
      <div className={getItemSpacing()}>
        {variant !== "minimal" && (
          <p className={cn("font-medium text-muted-foreground", getTextSize())}>
            Password Requirements:
          </p>
        )}

        {requirementStatus.map((req) => (
          <div key={req.id} className="flex items-center space-x-2">
            {req.satisfied ? (
              <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
            ) : (
              <X className="h-3 w-3 text-red-500 flex-shrink-0" />
            )}
            <span
              className={cn(
                getTextSize(),
                req.satisfied ? "text-green-700" : "text-muted-foreground"
              )}
            >
              {req.label}
            </span>
          </div>
        ))}

        {showOverallStatus && (
          <div
            className={cn(
              "pt-2 border-t border-border",
              variant === "minimal" && "border-t-0 pt-1"
            )}
          >
            <div className="flex items-center space-x-2">
              {isOverallValid ? (
                <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
              ) : (
                <X className="h-3 w-3 text-red-500 flex-shrink-0" />
              )}
              <span
                className={cn(
                  "font-medium",
                  getTextSize(),
                  isOverallValid ? "text-green-700" : "text-muted-foreground"
                )}
              >
                {overallStatusLabel} ({satisfiedCount}/{requirements.length})
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
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
