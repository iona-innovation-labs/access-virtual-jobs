import { NextResponse } from "next/server";
import { db } from "@/database";
import { users, profiles } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendEmailNotification } from "@/services/send-email-notif";
import { z } from "zod";
import { passwordSchema } from "@/lib/validation/password-validation";
import { userRoles } from "@/database/schema/users";
import { createNotification } from "@/database/mutations/job_applicants";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  role: z
    .enum(userRoles, {
      errorMap: () => ({
        message: "Please select either Job Seeker or Recruiter",
      }),
    })
    .default("job_seeker"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      return NextResponse.json(
        {
          error: "Validation failed",
          validationErrors: errors,
          fieldErrors: errors.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.field]: curr.message,
            }),
            {}
          ),
        },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, role } =
      validationResult.data;

    console.log("Processing registration for:", email, "with role:", role);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = nanoid();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    function generateRandomString(length = 6) {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${generateRandomString(6)}`;
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        username,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        provider: "credentials",
        role, // Add role to user creation
        isEmailVerified: false,
        verificationCode: token,
        verificationCodeExpires: expires,
      })
      .returning();

    console.log(
      "New user created:",
      newUser.username,
      "with role:",
      newUser.role
    );

    // Create a profile for the new user with default values
    // Only create profile for job_seeker role
    if (role === "job_seeker") {
      try {
        const [newProfile] = await db
          .insert(profiles)
          .values({
            jobTitle: "",
            userId: newUser.id,
            whyFit: "",
            whatStrengths: "",
            whatNeedImprovement: "",
            address: "",
            whatsappId: "",
            hasPaypal: "no",
            numberOfChildren: "0",
            internetProvider: "",
            numberOfMonitors: "1",
            numberOfExperience: "0",
            salaryUnit: "PHP",
            desiredSalary: "0",
            jobSearchStatus: "ready_to_interview",
            educationStatus: "high_school",
          })
          .returning();

        console.log(
          "Profile created for user:",
          newUser.id,
          "Profile ID:",
          newProfile.id
        );
      } catch (error) {
        console.warn("Failed to create profile for user:", newUser.id, error);
        // Profile might already exist, which is fine
      }
    }

    // Create proper verification link
    const verifyLink = `<a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}">Verify your email</a>`;

    // Send verification email with role-specific messaging
    const roleMessage =
      role === "job_seeker"
        ? "You've registered as a Job Seeker. Start building your profile and apply for exciting opportunities!"
        : "You've registered as a Recruiter. Get ready to find the best talent for your team!";

    createNotification(
      newUser.id,
      "Welcome to Access Virtual Jobs! Setup your profile and start exploring jobs.",
      "info",
      "#"
    );

    await sendEmailNotification({
      to: [email],
      subject: "Verify your email for Access Virtual Jobs",
      message: `Hi ${firstName},\n\nWelcome to Access Virtual Jobs! ${roleMessage}\n\nPlease verify your email by clicking the link below:\n\n${verifyLink}`,
      footer:
        "This link will expire in 24 hours. If you did not create an account, you can ignore this message.",
    });

    console.log("Verification email sent to:", email);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify.",
      credentials: {
        ...newUser,
        password: password, // For auto-login after registration
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid registration data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
