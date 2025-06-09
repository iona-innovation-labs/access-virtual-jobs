import { NextResponse } from "next/server";
import { db } from "@/database";
import { users, passwordResetTokens } from "@/database/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validation/password-validation";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const { token, email, password } = validationResult.data;

    // Find valid tokens for this email (not expired)
    const resetTokens = await db.query.passwordResetTokens.findMany({
      where: and(
        eq(passwordResetTokens.email, email),
        gt(passwordResetTokens.expires, new Date())
      ),
    });

    if (!resetTokens.length) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if any token matches
    let validToken = null;
    for (const dbToken of resetTokens) {
      const isValid = await bcrypt.compare(token, dbToken.token);
      if (isValid) {
        validToken = dbToken;
        break;
      }
    }

    if (!validToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));

    // Delete all reset tokens for this email
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email));

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
