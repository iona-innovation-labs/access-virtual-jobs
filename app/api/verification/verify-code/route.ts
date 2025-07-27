import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { TwilioService } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please login." },
        { status: 401 }
      );
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Verification code is required." },
        { status: 400 }
      );
    }

    // Get user with phone verification data
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (!user[0].phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No phone number found. Please request a verification code first.",
        },
        { status: 400 }
      );
    }

    if (user[0].isPhoneVerified) {
      return NextResponse.json(
        { success: false, message: "Phone number is already verified." },
        { status: 400 }
      );
    }

    // Check if verification code has expired
    if (
      user[0].phoneVerificationExpires &&
      user[0].phoneVerificationExpires < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Verify code with Twilio
    const result = await TwilioService.verifyCode(user[0].phoneNumber, code);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Mark phone as verified
    await db
      .update(users)
      .set({
        isPhoneVerified: true,
        phoneVerificationCode: null,
        phoneVerificationExpires: null,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      message:
        "Phone number verified successfully! You now have a verified badge.",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
