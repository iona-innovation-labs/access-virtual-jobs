import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/database";
import { notifications } from "@/database/schema/notifications";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login." },
        { status: 401 }
      );
    }

    // Mark all unread notifications as read for the current user
    const result = await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.isRead, false)
        )
      );

    return NextResponse.json({
      ok: true,
      message: "All notifications marked as read",
      updatedCount: result.rowCount || 0,
    });
  } catch (error: any) {
    console.error("Mark all as read API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message ?? "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
