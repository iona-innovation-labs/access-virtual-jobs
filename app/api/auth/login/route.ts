import { NextResponse } from "next/server";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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

    const { email, password } = validationResult.data;

    console.log("Processing login for:", email);

    // Find user by email
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

    // Check if email is verified (optional - remove if you want to allow unverified login)
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          error: "Email not verified",
          message: "Please verify your email before logging in.",
          fieldErrors: {
            email: "Please verify your email first",
          },
          requiresVerification: true,
          userId: user.id,
        },
        { status: 403 }
      );
    }

    // Return success - Auth.js will handle the actual session creation
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
