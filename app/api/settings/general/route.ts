import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

import { db } from "@/database";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { sendEmailNotification } from "@/services/send-email-notif";
import { auth } from "@/auth";
import {
  sendAccountUpdateNotification,
  generateAccountUpdateEmailTemplate,
  generateEmailChangeTemplates,
} from "@/services/notification-service";

// Email-only validation schema
const emailOnlySchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

// Profile fields validation schema (excluding email)
const profileFieldsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  gender: z.string().optional().nullable(),
  countryOfResidence: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  try {
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    log("POST /api/settings/general", "info", { body });

    // Determine update type based on request body
    const isEmailOnly = Object.keys(body).length === 1 && "email" in body;
    const isProfileFields =
      !("email" in body) &&
      Object.keys(body).some((key) =>
        [
          "firstName",
          "lastName",
          "username",
          "gender",
          "countryOfResidence",
          "dateOfBirth",
        ].includes(key)
      );

    if (!isEmailOnly && !isProfileFields) {
      return NextResponse.json(
        {
          error: "Invalid Request",
          message:
            "Request must contain either email only OR profile fields only (not both).",
          ok: false,
        },
        { status: 400 }
      );
    }

    // Validate based on update type
    let parsedData;
    if (isEmailOnly) {
      parsedData = emailOnlySchema.safeParse(body);
    } else {
      parsedData = profileFieldsSchema.safeParse(body);
    }

    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: parsedData.error.format(),
          ok: false,
        },
        { status: 400 }
      );
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "User not found",
          message: "User does not exist.",
          ok: false,
        },
        { status: 404 }
      );
    }

    // Handle EMAIL ONLY update
    if (isEmailOnly) {
      const { email } = parsedData.data as z.infer<typeof emailOnlySchema>;
      const oldEmail = currentUser.email;

      // Check if email is actually changing
      if (email === oldEmail) {
        return NextResponse.json(
          {
            error: "No changes",
            message: "New email is the same as current email.",
            ok: false,
          },
          { status: 400 }
        );
      }

      // Check if new email already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        return NextResponse.json(
          {
            error: "Email already exists",
            message:
              "This email address is already registered to another account.",
            ok: false,
          },
          { status: 400 }
        );
      }

      // Generate verification token
      const token = nanoid();
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

      // Update user with new email and verification details
      await db
        .update(users)
        .set({
          email,
          isEmailVerified: false,
          verificationCode: token,
          verificationCodeExpires: expires,
        })
        .where(eq(users.id, session.user.id));

      // Send notifications using notification service - to OLD email
      const emailTemplates = generateEmailChangeTemplates(
        currentUser.firstName || "User",
        oldEmail,
        email
      );

      // Send notification to old email (if notifications enabled)
      await sendAccountUpdateNotification({
        userId: session.user.id,
        emailSubject: "Email Address Changed - AVS Applicant Portal",
        emailMessage: emailTemplates.oldEmailTemplate,
        emailFooter:
          "If you didn't make this change, please contact support immediately.",
        inAppTitle: "Email Address Changed",
        inAppMessage: `Your email address has been changed from ${oldEmail} to ${email}. Please verify your new email address.`,
        inAppType: "info",
        inAppUrl: "/app/settings/general",
      });

      // Always send verification email to new address (regardless of notification settings)
      try {
        const verifyLink = `<a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}" style="color: #0066cc; text-decoration: underline;">Click here to verify your new email address</a>`;

        const newEmailMessage = `Hi ${currentUser.firstName || "User"},

Your email address has been updated to this address (${email}).

Please verify your new email address by clicking the link below:

${verifyLink}

Or copy and paste this URL into your browser:
${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}

Previous email: ${oldEmail}
New email: ${email}
Updated on: ${new Date().toLocaleString()}

If you did not make this change, please contact our support team immediately at support@accessvirtualstaffing.com.

This link will expire in 24 hours.`;

        await sendEmailNotification({
          to: [email],
          subject: "Verify Your New Email Address - AVS Applicant Portal",
          message: newEmailMessage,
          footer:
            "This link will expire in 24 hours. If you didn't make this change, please contact support immediately.",
        });

        log("Email verification sent to new address", "info", {
          userId: session.user.id,
          newEmail: email,
        });
      } catch (emailError) {
        log("Failed to send email verification to new address", "error", {
          error: emailError,
          userId: session.user.id,
          newEmail: email,
        });
      }

      // ALSO send notification to NEW email (if notifications enabled)
      // This sends the general "email changed" notification to the new email as well
      await sendAccountUpdateNotification({
        userId: session.user.id,
        emailSubject: "Email Address Changed - AVS Applicant Portal",
        emailMessage: emailTemplates.newEmailTemplate,
        emailFooter:
          "If you didn't make this change, please contact support immediately.",
        inAppTitle: "Email Address Updated",
        inAppMessage: `Your email address has been updated. Please verify your new email address.`,
        inAppType: "info",
        inAppUrl: "/app/settings/general",
      });

      return NextResponse.json({
        message:
          "Email updated successfully! Please check your new email to verify it.",
        updateType: "email",
        requiresVerification: true,
        newEmail: email,
        ok: true,
      });
    }

    // Handle PROFILE FIELDS update
    else {
      const {
        firstName,
        lastName,
        username,
        gender,
        countryOfResidence,
        dateOfBirth,
      } = parsedData.data as z.infer<typeof profileFieldsSchema>;

      // Check if username is taken by another user (if changed)
      if (username !== currentUser.name) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.name, username),
        });

        if (existingUser) {
          return NextResponse.json(
            {
              error: "Username already exists",
              message: "This username is already taken by another user.",
              ok: false,
            },
            { status: 400 }
          );
        }
      }

      // Track changes for notification
      const changes: string[] = [];

      if (firstName !== currentUser.firstName) {
        changes.push(`First name: "${currentUser.firstName}" → "${firstName}"`);
      }
      if (lastName !== currentUser.lastName) {
        changes.push(`Last name: "${currentUser.lastName}" → "${lastName}"`);
      }
      if (username !== currentUser.name) {
        changes.push(`Username: "${currentUser.name}" → "${username}"`);
      }
      if (gender !== currentUser.gender) {
        changes.push(
          `Gender: "${currentUser.gender || "Not specified"}" → "${gender || "Not specified"}"`
        );
      }
      if (countryOfResidence !== currentUser.countryOfResidence) {
        changes.push(
          `Country: "${currentUser.countryOfResidence || "Not specified"}" → "${countryOfResidence || "Not specified"}"`
        );
      }

      // Handle date of birth comparison
      const currentDateOfBirth = currentUser.dateOfBirth
        ? new Date(currentUser.dateOfBirth).toISOString().split("T")[0]
        : null;
      const newDateOfBirth = dateOfBirth || null;
      if (currentDateOfBirth !== newDateOfBirth) {
        changes.push(
          `Date of birth: "${currentDateOfBirth || "Not specified"}" → "${newDateOfBirth || "Not specified"}"`
        );
      }

      // If no changes detected, return early
      if (changes.length === 0) {
        return NextResponse.json({
          message: "No changes detected in profile data.",
          updateType: "profile",
          changesDetected: false,
          ok: true,
        });
      }

      // Update user profile (excluding email fields)
      const updateData = {
        firstName,
        lastName,
        name: username,
        gender: gender || null,
        countryOfResidence: countryOfResidence || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      };

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, session.user.id));

      // Send notification using notification service
      const emailMessage = generateAccountUpdateEmailTemplate(
        firstName,
        "Profile",
        changes
      );

      await sendAccountUpdateNotification({
        userId: session.user.id,
        emailSubject: "Profile Updated - AVS Applicant Portal",
        emailMessage,
        emailFooter:
          "If you didn't make these changes, please contact support immediately.",
        inAppTitle: "Profile Updated",
        inAppMessage: `Your profile has been updated with ${changes.length} change(s).`,
        inAppType: "info",
        inAppUrl: "/app/settings/general",
      });

      return NextResponse.json({
        message: "Profile updated successfully!",
        updateType: "profile",
        changesCount: changes.length,
        changes,
        ok: true,
      });
    }
  } catch (error: any) {
    log("Error updating settings:", "error", {
      error: error?.message || "",
      userId: session?.user?.id,
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error updating settings",
      },
      { status: 500 }
    );
  }
}
