import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { users, deleteRequests } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { sendEmailNotification } from "@/services/send-email-notif";
import { z } from "zod";
import { auth } from "@/auth";

// Account deletion request schema
const deleteAccountRequestSchema = z.object({
  reason: z.string().optional(), // Optional reason for deletion
  feedback: z.string().optional(), // Optional feedback
});

export async function POST(req: NextRequest) {
  try {
    // Get session - required for authenticated deletion request
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login to request account deletion.",
          ok: false,
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate request body using Zod
    const validationResult = deleteAccountRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          error: "Validation failed",
          message: errors.join(", "),
          ok: false,
        },
        { status: 400 }
      );
    }

    const { reason, feedback } = validationResult.data;

    // Find user in database to get additional details
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

    // Check if user already has an active delete request
    const existingDeleteRequest = await db.query.deleteRequests.findFirst({
      where: and(
        eq(deleteRequests.userId, existingUser.id),
        eq(deleteRequests.status, "inprogress")
      ),
    });

    if (existingDeleteRequest) {
      return NextResponse.json(
        {
          error: "Request already exists",
          message: "You already have a pending account deletion request.",
          ok: false,
        },
        { status: 409 }
      );
    }

    // Create delete request in database
    const newDeleteRequest = await db
      .insert(deleteRequests)
      .values({
        userId: existingUser.id,
        reason: reason || null,
        feedback: feedback || null,
        status: "inprogress",
      })
      .returning();

    // Prepare user information for support team
    const userInfo = {
      id: existingUser.id,
      email: existingUser.email,
      name:
        existingUser.name ||
        `${existingUser.firstName} ${existingUser.lastName}`,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      provider: existingUser.provider,
      createdAt: existingUser.createdAt,
      isEmailVerified: existingUser.isEmailVerified,
    };

    // Create support email content
    const supportEmailSubject = `Account Deletion Request - ${userInfo.email}`;

    const supportEmailMessage = `
ACCOUNT DELETION REQUEST

Request ID: ${newDeleteRequest[0].id}

User Details:
- User ID: ${userInfo.id}
- Email: ${userInfo.email}
- Name: ${userInfo.name || "Not provided"}
- Provider: ${userInfo.provider || "credentials"}
- Account Created: ${userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : "Unknown"}
- Email Verified: ${userInfo.isEmailVerified ? "Yes" : "No"}

Request Details:
- Requested at: ${new Date().toLocaleString()}
- User IP: ${req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown"}
- User Agent: ${req.headers.get("user-agent") || "Unknown"}

${reason ? `Reason for deletion:\n${reason}\n` : ""}
${feedback ? `Additional feedback:\n${feedback}\n` : ""}

Please process this account deletion request according to your data retention policies and GDPR/privacy regulations.

---
This is an automated message from AVS Applicant Portal.
    `.trim();

    // Send email to support team
    const supportEmail =
      process.env.NEXT_SUPPORT_EMAIL || "support@yourdomain.com";

    await sendEmailNotification({
      to: [supportEmail],
      subject: supportEmailSubject,
      message: supportEmailMessage,
      footer: "Account deletion request from AVS Applicant Portal",
    });

    // Send confirmation email to user
    const userEmailSubject =
      "Account Deletion Request Received - AVS Applicant Portal";

    const userEmailMessage = `Hi ${userInfo.firstName || "there"},

We have received your request to delete your AVS Applicant Portal account.

Your request details:
- Request ID: ${newDeleteRequest[0].id}
- Request submitted: ${new Date().toLocaleString()}
- Account email: ${userInfo.email}
${reason ? `- Reason: ${reason}` : ""}

What happens next:
• Our support team will review your request within 2-3 business days
• We may contact you for verification or additional information
• Once processed, all your personal data will be permanently deleted
• This action cannot be undone

If you change your mind or have questions, please contact our support team at ${supportEmail}.

Thank you for using AVS Applicant Portal.`;

    await sendEmailNotification({
      to: [session.user.email],
      subject: userEmailSubject,
      message: userEmailMessage,
      footer: "If you didn't request this, please contact support immediately.",
    });

    // Log the deletion request
    console.log(
      `Account deletion request submitted by user: ${session.user.email}, Request ID: ${newDeleteRequest[0].id}`
    );

    return NextResponse.json({
      message:
        "Account deletion request submitted successfully. You will receive a confirmation email shortly.",
      requestId: newDeleteRequest[0].id,
      ok: true,
    });
  } catch (error: any) {
    console.error("Account deletion request error:", error);

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
        error: "Failed to submit deletion request",
        message:
          "Something went wrong. Please try again later or contact support directly.",
        ok: false,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get session - required for authenticated request
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Please login to view deletion requests.",
          ok: false,
        },
        { status: 401 }
      );
    }

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

    // Get active delete request for the user
    const activeDeleteRequest = await db.query.deleteRequests.findFirst({
      where: and(
        eq(deleteRequests.userId, existingUser.id),
        eq(deleteRequests.status, "inprogress")
      ),
    });

    return NextResponse.json({
      deleteRequest: activeDeleteRequest || null,
      ok: true,
    });
  } catch (error: any) {
    console.error("Get delete request error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch deletion request",
        message: "Something went wrong. Please try again later.",
        ok: false,
      },
      { status: 500 }
    );
  }
}
