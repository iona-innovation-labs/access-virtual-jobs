import * as z from "zod";

export const generalSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[A-Za-z\s]+$/, "First name must contain only letters and spaces"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[A-Za-z\s]+$/, "Last name must contain only letters and spaces"),

  email: z.string().email("Invalid email format").min(1, "Email is required"),

  pfp: z
    .instanceof(File, { message: "Profile picture must be a valid file" })
    .optional(),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  gender: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        ["male", "female", "other", "prefer_not_to_say"].includes(value),
      "Please select a valid gender option"
    ),

  countryOfResidence: z
    .string()
    .min(1, "Country of residence is required")
    .default("Philippines"),

  dateOfBirth: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true; // Optional field
      const date = new Date(value);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
      );
      return date <= today && date >= minDate;
    }, "Please enter a valid date of birth (not in the future and not more than 100 years ago)")
    .refine((value) => {
      if (!value) return true; // Optional field
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      return actualAge >= 13;
    }, "You must be at least 13 years old"),
});

export type GeneralSchema = z.infer<typeof generalSchema>;
