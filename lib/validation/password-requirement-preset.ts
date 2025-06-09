// lib/password-requirements.ts
import { PasswordRequirement } from "@/components/auth/password/password-strength-checker";

// Basic requirements (minimum security)
export const basicPasswordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 6 characters",
    test: (password) => password.length >= 6,
  },
  {
    id: "alphanumeric",
    label: "Contains letters and numbers",
    test: (password) => /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
  },
];

// Standard requirements (recommended)
export const standardPasswordRequirements: PasswordRequirement[] = [
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

// Strong requirements (high security)
export const strongPasswordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 12 characters",
    test: (password) => password.length >= 12,
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
  {
    id: "no_common",
    label: "Not a common password",
    test: (password) => !isCommonPassword(password),
  },
  {
    id: "no_sequential",
    label: "No sequential characters (123, abc)",
    test: (password) => !hasSequentialChars(password),
  },
];

// Enterprise requirements (maximum security)
export const enterprisePasswordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 14 characters",
    test: (password) => password.length >= 14,
  },
  {
    id: "lowercase",
    label: "At least 2 lower case letters",
    test: (password) => (password.match(/[a-z]/g) || []).length >= 2,
  },
  {
    id: "uppercase",
    label: "At least 2 upper case letters",
    test: (password) => (password.match(/[A-Z]/g) || []).length >= 2,
  },
  {
    id: "numbers",
    label: "At least 2 numbers",
    test: (password) => (password.match(/[0-9]/g) || []).length >= 2,
  },
  {
    id: "special",
    label: "At least 2 special characters",
    test: (password) =>
      (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >=
      2,
  },
  {
    id: "no_common",
    label: "Not a common password",
    test: (password) => !isCommonPassword(password),
  },
  {
    id: "no_sequential",
    label: "No sequential characters",
    test: (password) => !hasSequentialChars(password),
  },
  {
    id: "no_repeated",
    label: "No more than 2 repeated characters",
    test: (password) => !hasExcessiveRepeatedChars(password),
  },
];

// Helper functions for advanced validation
function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    "password",
    "123456",
    "123456789",
    "qwerty",
    "abc123",
    "password123",
    "admin",
    "letmein",
    "welcome",
    "monkey",
    "dragon",
    "master",
    "sunshine",
    "princess",
    "football",
  ];
  return commonPasswords.includes(password.toLowerCase());
}

function hasSequentialChars(password: string): boolean {
  const sequences = [
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "qwertyuiopasdfghjklzxcvbnm",
  ];

  for (const sequence of sequences) {
    for (let i = 0; i <= sequence.length - 3; i++) {
      const substr = sequence.substring(i, i + 3);
      if (
        password.toLowerCase().includes(substr) ||
        password.toLowerCase().includes(substr.split("").reverse().join(""))
      ) {
        return true;
      }
    }
  }
  return false;
}

function hasExcessiveRepeatedChars(password: string): boolean {
  const chars = password.split("");
  for (let i = 0; i < chars.length - 2; i++) {
    if (chars[i] === chars[i + 1] && chars[i + 1] === chars[i + 2]) {
      return true;
    }
  }
  return false;
}

// Preset configurations
export const passwordPresets = {
  basic: {
    requirements: basicPasswordRequirements,
    minRequiredChecks: 2,
    overallStatusLabel: "All requirements satisfied",
  },
  standard: {
    requirements: standardPasswordRequirements,
    minRequiredChecks: 3,
    overallStatusLabel: "At least 3 requirements satisfied",
  },
  strong: {
    requirements: strongPasswordRequirements,
    minRequiredChecks: 5,
    overallStatusLabel: "At least 5 requirements satisfied",
  },
  enterprise: {
    requirements: enterprisePasswordRequirements,
    minRequiredChecks: 6,
    overallStatusLabel: "At least 6 requirements satisfied",
  },
} as const;
