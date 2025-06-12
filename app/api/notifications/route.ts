import { NextRequest, NextResponse } from "next/server";
import { desc, eq, sql, and } from "drizzle-orm";

import { db } from "@/database";
import { notifications } from "@/database/schema/notifications";
import { users } from "@/database/schema/users";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login." },
        { status: 401 }
      );
    }

    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { error: "User not found", message: "User does not exist." },
        { status: 404 }
      );
    }

    const userId = user[0].id;

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const filter = url.searchParams.get("filter") || "all";
    const readStatus = url.searchParams.get("read"); // "true", "false", or null for all
    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions = eq(notifications.userId, userId);

    // Add type filter
    if (filter !== "all") {
      whereConditions = and(whereConditions, eq(notifications.type, filter))!;
    }

    // Add read status filter
    if (readStatus === "true") {
      whereConditions = and(whereConditions, eq(notifications.isRead, true))!;
    } else if (readStatus === "false") {
      whereConditions = and(whereConditions, eq(notifications.isRead, false))!;
    }

    const userNotifications = await db
      .select({
        id: notifications.id,
        userId: notifications.userId,
        message: notifications.message,
        createdAt: notifications.createdAt,
        type: notifications.type,
        link: notifications.linkTo,
        isRead: notifications.isRead, // Include isRead field
      })
      .from(notifications)
      .where(whereConditions)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count with same conditions
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(whereConditions);

    // Get unread count for the user
    const unreadCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      );

    console.log("NOTIFICATIONS: ", userNotifications);
    console.log("USER ID: ", userId);
    console.log("FILTER: ", filter);

    return NextResponse.json({
      ok: true,
      notifications: userNotifications,
      total: totalCountResult[0].count,
      unreadCount: unreadCountResult[0].count,
      filter: filter,
    });
  } catch (error: any) {
    console.error("Notifications API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message ?? "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// PATCH method to mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { notificationIds, markAsRead } = body;

    // Validate input
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid input",
          message: "Notification IDs array is required.",
        },
        { status: 400 }
      );
    }

    // Update notifications
    const result = await db
      .update(notifications)
      .set({
        isRead: markAsRead !== false, // defaults to true unless explicitly set to false
      })
      .where(
        and(
          eq(notifications.userId, session.user.id),
          sql`${notifications.id} = ANY(${notificationIds})`
        )
      );

    return NextResponse.json({
      ok: true,
      message: `Notifications marked as ${markAsRead !== false ? "read" : "unread"}`,
      updatedCount: result.rowCount || 0,
    });
  } catch (error: any) {
    console.error("Mark as read API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message ?? "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
