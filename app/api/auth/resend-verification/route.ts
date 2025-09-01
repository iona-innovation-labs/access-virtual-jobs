import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { sendEmailNotification } from "@/services/send-email-notif";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 404 }
      );
    }

    const token = nanoid();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await db
      .update(users)
      .set({
        verificationCode: token,
        verificationCodeExpires: expires,
      })
      .where(eq(users.id, user.id));

    const verifyLink = `<a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}">Verify your email</a>`;
    const firstName = user.firstName ?? user.name?.split(" ")[0] ?? "there";

    await sendEmailNotification({
      to: [email],
      subject: "Resend: Verify your email for Access Virtual Jobs",
      message: `Hi ${firstName},\n\nHere’s your new verification link:\n\n${verifyLink}`,
      footer:
        "This link will expire in 24 hours. If you did not request this, you can ignore the message.",
    });

    return NextResponse.json({
      success: true,
      message: "Verification email resent.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
