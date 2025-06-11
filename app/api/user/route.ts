import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/database";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";

//export async function GET(req: NextRequest) {
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "User does not exist.", ok: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.name,
        profileImage: user.profileImage,
        image: user.image,
        createdAt: user.createdAt,
        jobRecommendationNotifPref: user.jobRecommendationNotifPref,
        jobSubmissionNotifPref: user.jobSubmissionNotifPref,
        isNewUser: user.isNewUser,
        jobSearchStatus: user.jobSearchStatus,
        isEmailVerified: user.isEmailVerified,
        dateOfBirth: user.dateOfBirth,
        countryOfResidence: user.countryOfResidence,
        gender: user.gender,
      },
      message: "User info fetched successfully.",
      ok: true,
    });
  } catch (error: any) {
    log("Error fetching general settings:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error fetching general settings",
      },
      { status: 500 }
    );
  }
}
