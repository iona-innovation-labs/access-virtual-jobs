import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/database";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { generalSchema } from "@/lib/validation/general-settings-form-validation";
import { sendEmailNotification } from "@/services/send-email-notif";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsedData = generalSchema.safeParse(body);
    log("POST /api/settings/general", "info", { body });

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

    const { firstName, lastName, email, username } = parsedData.data;

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

    const changes: string[] = [];
    const oldEmail = currentUser.email;
    const emailChanged = email !== oldEmail;

    if (emailChanged) {
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
    }

    if (firstName !== currentUser.firstName) {
      changes.push(`First name: "${currentUser.firstName}" → "${firstName}"`);
    }
    if (lastName !== currentUser.lastName) {
      changes.push(`Last name: "${currentUser.lastName}" → "${lastName}"`);
    }
    if (emailChanged) {
      changes.push(`Email: "${oldEmail}" → "${email}"`);
    }
    if (username !== currentUser.name) {
      changes.push(`Username: "${currentUser.name}" → "${username}"`);
    }

    let updateData: any = {
      firstName,
      lastName,
      email,
      name: username,
    };

    if (emailChanged) {
      const token = nanoid();
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

      updateData = {
        ...updateData,
        isEmailVerified: false,
        verificationCode: token,
        verificationCodeExpires: expires,
      };
    }

    await db.update(users).set(updateData).where(eq(users.id, session.user.id));

    if (changes.length > 0) {
      try {
        const notificationEmail = emailChanged ? oldEmail : email;
        const emailSubject = "Profile Updated - AVS Applicant Portal";
        const emailMessage = `Hi ${firstName},

Your AVS Applicant Portal profile has been successfully updated.

Changes made:
${changes.map((change) => `• ${change}`).join("\n")}

Updated on: ${new Date().toLocaleString()}
${emailChanged ? `\nNote: Future notifications will be sent to your new email address: ${email}` : ""}

If you did not make these changes, please contact our support team immediately at support@accessvirtualstaffing.com.

Thank you for keeping your profile up to date.`;

        await sendEmailNotification({
          to: [notificationEmail],
          subject: emailSubject,
          message: emailMessage,
          footer:
            "If you didn't make these changes, please contact support immediately.",
        });

        if (emailChanged) {
          const verifyLink = `<a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${updateData.verificationCode}">Verify your new email address</a>`;

          await sendEmailNotification({
            to: [email],
            subject: "Verify Your New Email Address - AVS Applicant Portal",
            message: `Hi ${firstName},

Your email address has been updated to this address (${email}).

Please verify your new email address by clicking the link below:

${verifyLink}

Previous email: ${oldEmail}
New email: ${email}
Updated on: ${new Date().toLocaleString()}

If you did not make this change, please contact our support team immediately at support@accessvirtualstaffing.com.`,
            footer:
              "This link will expire in 24 hours. If you didn't make this change, please contact support immediately.",
          });
        }

        log("Profile update email notifications sent", "info", {
          userId: session.user.id,
          changesCount: changes.length,
          emailChanged,
          oldEmail: emailChanged ? oldEmail : undefined,
          newEmail: email,
        });
      } catch (emailError) {
        log("Failed to send profile update email", "error", {
          error: emailError,
          userId: session.user.id,
        });
      }
    }

    return NextResponse.json({
      message: emailChanged
        ? "General settings updated successfully! Please check your new email to verify it."
        : "General settings updated successfully!",
      emailChanged,
      ok: true,
    });
  } catch (error: any) {
    log("Error updating general settings:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error updating general settings",
      },
      { status: 500 }
    );
  }
}
