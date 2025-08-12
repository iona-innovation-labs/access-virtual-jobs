import { NextResponse } from "next/server";
import { db } from "@/database";
import { users, passwordResetTokens } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendEmailNotification } from "@/services/send-email-notif";
import { forgotPasswordSchema } from "@/lib/validation/password-validation";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body using Zod
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const { email } = validationResult.data;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Always return success to prevent email enumeration
    if (!existingUser) {
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, we sent a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = nanoid(32);
    const hashedToken = await bcrypt.hash(resetToken, 12);
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Delete any existing tokens for this email
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email));

    // Create new reset token
    await db.insert(passwordResetTokens).values({
      email,
      token: hashedToken,
      expires,
    });

    // Create reset link
    const resetLink = `<a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}">Reset your password</a>`;

    // Send reset email
    await sendEmailNotification({
      to: [email],
      subject: "Reset your password - Access Virtual Jobs",
      message: `Hi ${existingUser.firstName || "there"},\n\nYou requested a password reset for your account. Please click the link below to reset your password:\n\n${resetLink}`,
      footer:
        "This link will expire in 1 hour. If you didn't request this, you can ignore this email.",
    });

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, we sent a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
