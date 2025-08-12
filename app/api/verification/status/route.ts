import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Please login." },
        { status: 401 }
      );
    }

    const user = await db
      .select({
        isPhoneVerified: users.isPhoneVerified,
        phoneNumber: users.phoneNumber,
        phoneVerificationExpires: users.phoneVerificationExpires,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isPhoneVerified: user[0].isPhoneVerified,
        phoneNumber: user[0].phoneNumber,
        hasExpiredCode: user[0].phoneVerificationExpires
          ? user[0].phoneVerificationExpires < new Date()
          : false,
      },
    });
  } catch (error) {
    console.error("Get verification status error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
