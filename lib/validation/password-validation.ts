import { z } from "zod";

export const passwordSchema = z.string().refine(
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

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const confirmPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ConfirmPasswordInput = z.infer<typeof confirmPasswordSchema>;
