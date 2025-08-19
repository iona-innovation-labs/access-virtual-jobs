import { NextResponse } from "next/server";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  expectedRole: z.enum(["job_seeker", "recruiter", "admin"]).optional(), // Add optional role validation
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);

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

    const { email, password, expectedRole } = validationResult.data;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          fieldErrors: {
            email: "Invalid email or password",
            password: "Invalid email or password",
          },
        },
        { status: 401 }
      );
    }

    // Check if user has no password set (Google-only account)
    if (!user.password) {
      return NextResponse.json(
        {
          error: "No password set",
          message:
            "This account was created with Google. Please use Google login or set a password first.",
          fieldErrors: {
            email: "No password set for this account",
          },
          suggestGoogle: true,
        },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          fieldErrors: {
            email: "Invalid email or password",
            password: "Invalid email or password",
          },
        },
        { status: 401 }
      );
    }

    if (expectedRole && user.role !== expectedRole) {
      const roleMessages = {
        job_seeker:
          "This account is registered as a recruiter. Please use the recruiter login.",
        recruiter:
          "This account is registered as a job seeker. Please use the job seeker login.",
        admin:
          "This account is not an admin. Please use the correct login portal.",
      };

      return NextResponse.json(
        {
          error: "Wrong account type",
          message: roleMessages[expectedRole],
          fieldErrors: {
            email: `Account type mismatch. Expected ${expectedRole}, but user is ${user.role}`,
          },
          userRole: user.role,
          expectedRole: expectedRole,
          wrongAccountType: true,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Credentials validated successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        isEmailVerified: user.isEmailVerified,
        role: user.role, // ✅ NOW INCLUDES ROLE
      },
    });
  } catch (error) {
    console.error("Login validation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid login data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
