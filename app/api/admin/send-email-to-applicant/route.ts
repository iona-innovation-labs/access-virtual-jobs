import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendEmailNotification } from "@/services/send-email-notif";
import { log } from "@/lib/logs";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Add admin role check here
    // For now, allow any authenticated user to send emails

    const body = await request.json();
    const { applicantEmail, applicantName, message, applicationId } = body;

    if (!applicantEmail || !message) {
      return NextResponse.json(
        { message: "Applicant email and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Prepare email content
    const subject = `Update on Your Job Application - Access Virtual Jobs`;

    // Check if message contains HTML tags
    const isHtml = message.includes("<") && message.includes(">");

    const emailMessage = isHtml
      ? `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Hi ${applicantName || "Applicant"},</p>
  
  <div style="margin: 20px 0;">
    ${message}
  </div>
  
  <p>Best regards,<br>
  Access Virtual Jobs Team</p>
  
  <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
  <p style="font-size: 12px; color: #666;">
    This message was sent regarding your job application. If you have any questions, please reply to this email.
  </p>
</div>
      `.trim()
      : `
Hi ${applicantName || "Applicant"},

${message}

Best regards,
Access Virtual Jobs Team

---
This message was sent regarding your job application. If you have any questions, please reply to this email.
      `.trim();

    // Send email using RESEND
    const emailResult = await sendEmailNotification({
      to: [applicantEmail],
      subject: subject,
      message: emailMessage,
      footer:
        "This email was sent from the Access Virtual Jobs admin portal. You can reply directly to this email.",
    });

    if (emailResult.errors) {
      log("Failed to send email to applicant:", "error", {
        applicantEmail,
        applicationId,
        error: emailResult.errors,
      });

      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 }
      );
    }

    log(
      `Email sent to applicant ${applicantEmail} by admin ${session.user.id}`,
      "info",
      {
        applicantEmail,
        applicantName,
        applicationId,
        sentBy: session.user.id,
      }
    );

    return NextResponse.json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (error) {
    log("Error sending email to applicant:", "error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
