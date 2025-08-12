// app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { passwordSchema } from "@/lib/validation/password-validation";
import {
  sendAccountUpdateNotification,
  generateAccountUpdateEmailTemplate,
} from "@/services/notification-service";

// Change password schema using centralized validation
const changePasswordSchema = z
  .object({
    oldPassword: z.string().optional(), // Made optional for social login users
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: NextRequest) {
  try {
    // Get session - required for authenticated password change
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login to change your password.",
          ok: false,
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate request body using Zod
    const validationResult = changePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return NextResponse.json(
        {
          error: "Validation failed",
          message: errors.map((e) => e.message).join(", "),
          fieldErrors: errors.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.field]: curr.message,
            }),
            {}
          ),
          ok: false,
        },
        { status: 400 }
      );
    }

    const { oldPassword = "", password } = validationResult.data;

    // Find user in database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User not found",
          message: "User does not exist.",
          ok: false,
        },
        { status: 404 }
      );
    }

    // Check if user has a password
    const hasExistingPassword = !!existingUser.password;

    // If user doesn't have a password (social login only), allow setting password without old password
    if (!hasExistingPassword) {
      // For users without existing passwords, old password should be empty
      if (oldPassword && oldPassword.trim() !== "") {
        return NextResponse.json(
          {
            error: "No Current Password",
            message:
              "Your account doesn't have a current password. Please leave the current password field empty.",
            fieldErrors: {
              oldPassword:
                "Leave current password empty since you don't have one set",
            },
            ok: false,
          },
          { status: 400 }
        );
      }
    } else {
      // For users with existing passwords, verify old password
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        existingUser.password as string
      );
      if (!isOldPasswordValid) {
        return NextResponse.json(
          {
            error: "Invalid Password",
            message: "Current password is incorrect.",
            fieldErrors: { oldPassword: "Current password is incorrect" },
            ok: false,
          },
          { status: 400 }
        );
      }

      // Check if new password is different from old password
      const isSamePassword = await bcrypt.compare(
        password,
        existingUser.password as string
      );
      if (isSamePassword) {
        return NextResponse.json(
          {
            error: "Same Password",
            message:
              "New password must be different from your current password.",
            fieldErrors: {
              password: "New password must be different from current password",
            },
            ok: false,
          },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        // Optionally update a "password changed at" timestamp if you have one
        // passwordChangedAt: new Date()
      })
      .where(eq(users.email, session.user.email));

    // Determine if this is first time password or password change
    const isFirstTimePassword = !hasExistingPassword;
    const changeType = isFirstTimePassword
      ? "Password Set"
      : "Password Changed";
    const changeDescription = isFirstTimePassword
      ? "You have successfully set a password for your Access Virtual Jobs account. You can now sign in using either your social account or your email and password."
      : "Your password has been successfully changed for your Access Virtual Jobs account.";

    // Send notification using notification service (respects user's accountUpdatePref)
    const emailMessage = generateAccountUpdateEmailTemplate(
      existingUser.firstName || "User",
      changeType,
      changeDescription
    );

    await sendAccountUpdateNotification({
      userId: existingUser.id,
      emailSubject: `${changeType} - Access Virtual Jobs`,
      emailMessage:
        emailMessage +
        "\n\nFor your security, you have been logged out of all devices and will need to sign in again.",
      emailFooter:
        "If you didn't make this change, please contact support immediately.",
      inAppTitle: changeType,
      inAppMessage: isFirstTimePassword
        ? "You have successfully set a password for your account. You can now sign in with email and password."
        : "Your password has been successfully changed. Please sign in with your new password.",
      inAppType: "info",
      inAppUrl: "/app/settings/authentication",
    });

    // Log the password change
    console.log(
      `Password ${isFirstTimePassword ? "set" : "changed"} for user: ${session.user.email}`
    );

    const successMessage = isFirstTimePassword
      ? "Password set successfully. You have been logged out for security reasons. You can now sign in with your email and password."
      : "Password changed successfully. You have been logged out for security reasons. Please sign in with your new password.";

    return NextResponse.json({
      message: successMessage,
      ok: true,
      changeType: isFirstTimePassword ? "set" : "changed",
    });
  } catch (error: any) {
    console.error("Change password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Please check your input and try again.",
          ok: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to change password",
        message: "Something went wrong. Please try again later.",
        ok: false,
      },
      { status: 500 }
    );
  }
}
