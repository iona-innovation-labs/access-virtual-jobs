import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { TwilioService } from "@/lib/twilio";
import { addMinutes } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please login." },
        { status: 401 }
      );
    }

    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required." },
        { status: 400 }
      );
    }

    // Validate Philippine phone number format
    // if (!TwilioService.isValidPhilippinePhone(phoneNumber)) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message:
    //         "Please enter a valid Philippine phone number (e.g., 09123456789 or +639123456789).",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Check if user is already verified
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

    if (user[0].isPhoneVerified) {
      return NextResponse.json(
        { success: false, message: "Phone number is already verified." },
        { status: 400 }
      );
    }

    // Check if there's a recent verification attempt (rate limiting)
    const now = new Date();
    const fiveMinutesAgo = addMinutes(now, -5);

    if (
      user[0].phoneVerificationExpires &&
      user[0].phoneVerificationExpires > fiveMinutesAgo
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please wait 5 minutes before requesting another verification code.",
        },
        { status: 429 }
      );
    }

    // Send verification code via Twilio
    const result = await TwilioService.sendVerificationCode(phoneNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Store phone number and set expiration (10 minutes)
    const expires = addMinutes(now, 10);

    await db
      .update(users)
      .set({
        phoneNumber: TwilioService.formatPhilippinePhone(phoneNumber),
        phoneVerificationExpires: expires,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully. Please check your SMS.",
    });
  } catch (error) {
    console.error("Send verification code error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
