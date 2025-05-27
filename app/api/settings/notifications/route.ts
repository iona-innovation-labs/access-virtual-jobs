import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/database";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";

//export async function GET(req: NextRequest) {
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    console.log("Fetched user from DB:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "User does not exist.", ok: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      jobRecommendation: user.jobRecommendationNotifPref === "enabled",
      jobSubmission: user.jobSubmissionNotifPref === "enabled",
      ok: true,
    });
  } catch (error: any) {
    log("Error fetching notifications:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error fetching notification settings",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    log("POST /api/notifications", "info", { body });

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "User does not exist.", ok: false },
        { status: 404 }
      );
    }

    await db
      .update(users)
      .set({
        jobRecommendationNotifPref: body.jobRecommendation
          ? "enabled"
          : "disabled",
        jobSubmissionNotifPref: body.jobSubmission ? "enabled" : "disabled",
      })
      .where(eq(users.id, user.id));

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    console.log("Updated user from DB:", updatedUser);

    return NextResponse.json({
      message: "Notification settings updated successfully",
      ok: true,
      updatedData: {
        jobRecommendation:
          updatedUser?.jobRecommendationNotifPref === "enabled",
        jobSubmission: updatedUser?.jobSubmissionNotifPref === "enabled",
      },
    });
  } catch (error: any) {
    log("Error updating notifications:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error updating notifications",
      },
      { status: 500 }
    );
  }
}
