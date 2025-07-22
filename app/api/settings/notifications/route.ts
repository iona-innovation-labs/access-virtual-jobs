import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/database";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";
import {
  sendAccountUpdateNotification,
  generateAccountUpdateEmailTemplate,
} from "@/services/notification-service";

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
      jobApplication: user.jobApplicationUpdatePref === "enabled",
      accountUpdate: user.accountUpdatePref === "enabled", // Added missing field
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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    log("POST /api/notifications", "info", {
      body,
      bodyKeys: Object.keys(body),
      accountUpdateValue: body.accountUpdate,
      accountUpdatePrefValue: body.accountUpdatePref,
    });

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "User does not exist.", ok: false },
        { status: 404 }
      );
    }

    // Track changes for notification
    const changes: string[] = [];
    const oldSettings = {
      jobRecommendation: user.jobRecommendationNotifPref === "enabled",
      jobSubmission: user.jobSubmissionNotifPref === "enabled",
      jobApplication: user.jobApplicationUpdatePref === "enabled",
      accountUpdate: user.accountUpdatePref === "enabled",
    };

    const newSettings = {
      jobRecommendation: body.jobRecommendation,
      jobSubmission: body.jobSubmission,
      jobApplication: body.jobApplication,
      accountUpdate: body.accountUpdate ?? body.accountUpdatePref, // Handle both field names
    };

    // Track what changed
    if (oldSettings.jobRecommendation !== newSettings.jobRecommendation) {
      changes.push(
        `Job Recommendations: ${oldSettings.jobRecommendation ? "Enabled" : "Disabled"} → ${newSettings.jobRecommendation ? "Enabled" : "Disabled"}`
      );
    }
    if (oldSettings.jobSubmission !== newSettings.jobSubmission) {
      changes.push(
        `Job Submissions: ${oldSettings.jobSubmission ? "Enabled" : "Disabled"} → ${newSettings.jobSubmission ? "Enabled" : "Disabled"}`
      );
    }
    if (oldSettings.jobApplication !== newSettings.jobApplication) {
      changes.push(
        `Job Applications: ${oldSettings.jobApplication ? "Enabled" : "Disabled"} → ${newSettings.jobApplication ? "Enabled" : "Disabled"}`
      );
    }
    if (oldSettings.accountUpdate !== newSettings.accountUpdate) {
      changes.push(
        `Account Updates: ${oldSettings.accountUpdate ? "Enabled" : "Disabled"} → ${newSettings.accountUpdate ? "Enabled" : "Disabled"}`
      );
    }

    // Update user notification preferences
    await db
      .update(users)
      .set({
        jobRecommendationNotifPref: body.jobRecommendation
          ? "enabled"
          : "disabled",
        jobSubmissionNotifPref: body.jobSubmission ? "enabled" : "disabled",
        jobApplicationUpdatePref: body.jobApplication ? "enabled" : "disabled",
        accountUpdatePref:
          (body.accountUpdate ?? body.accountUpdatePref)
            ? "enabled"
            : "disabled", // Handle both field names
      })
      .where(eq(users.id, user.id));

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    console.log("Updated user from DB:", updatedUser);

    // Send notification about notification settings change (if there were changes and if enabled)
    if (changes.length > 0) {
      // Use the OLD accountUpdatePref setting to determine if we should send this notification
      // (since the user might have just disabled it, we should still notify them of this final change)
      if (oldSettings.accountUpdate) {
        const emailMessage = generateAccountUpdateEmailTemplate(
          user.firstName || "User",
          "Notification Settings",
          changes
        );

        await sendAccountUpdateNotification({
          userId: session.user.id,
          emailSubject: "Notification Settings Updated - AVS Applicant Portal",
          emailMessage,
          emailFooter:
            "If you didn't make these changes, please contact support immediately.",
          inAppTitle: "Notification Settings Updated",
          inAppMessage: `Your notification preferences have been updated with ${changes.length} change(s).`,
          inAppType: "info",
          inAppUrl: "/app/settings/notifications",
        });

        log("Notification settings change notification sent", "info", {
          userId: session.user.id,
          changesCount: changes.length,
          changes,
        });
      } else {
        log(
          "Notification settings changed but notifications disabled",
          "info",
          {
            userId: session.user.id,
            changesCount: changes.length,
            oldAccountUpdatePref: oldSettings.accountUpdate,
          }
        );
      }
    }

    return NextResponse.json({
      message: "Notification settings updated successfully",
      ok: true,
      updatedData: {
        jobRecommendation:
          updatedUser?.jobRecommendationNotifPref === "enabled",
        jobSubmission: updatedUser?.jobSubmissionNotifPref === "enabled",
        jobApplication: updatedUser?.jobApplicationUpdatePref === "enabled",
        accountUpdate: updatedUser?.accountUpdatePref === "enabled", // Added missing field
      },
      changesCount: changes.length,
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
