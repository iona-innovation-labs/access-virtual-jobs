import { NextResponse } from "next/server";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendEmailNotification } from "@/services/send-email-notif"; // Adjust if path differs

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    console.log(email);

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(email);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    console.log(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    console.log(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = nanoid();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        username: email.split("@")[0],
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        provider: "credentials",
        isEmailVerified: false,
        verificationCode: token,
        verificationCodeExpires: expires,
      })
      .returning();

    console.log("NEW: ", newUser);

    const verifyLink = `<a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}">Verify your email</a>`;

    await sendEmailNotification({
      to: [email],
      subject: "Verify your email for AVS Applicant Portal",
      message: `Hi ${firstName},\n\nPlease verify your email by clicking the link below:\n\n${verifyLink}`,
      footer:
        "This link will expire in 24 hours. If you did not create an account, you can ignore this message.",
    });

    console.log("email sent: ", email);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify.",
      credentials: {
        ...newUser,
        password: password,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
