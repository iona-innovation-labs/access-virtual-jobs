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
    const offset = (page - 1) * limit;

    const whereConditions =
      filter === "all"
        ? eq(notifications.userId, userId)
        : and(eq(notifications.userId, userId), eq(notifications.type, filter));

    const userNotifications = await db
      .select({
        id: notifications.id,
        userId: notifications.userId,
        message: notifications.message,
        createdAt: notifications.createdAt,
        type: notifications.type,
        link: notifications.linkTo,
      })
      .from(notifications)
      .where(whereConditions)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    console.log("NOTIFICATIONS: ", userNotifications);
    console.log("USER ID: ", userId);
    console.log("FILTER: ", filter);

    const totalCountConditions =
      filter === "all"
        ? eq(notifications.userId, userId)
        : and(eq(notifications.userId, userId), eq(notifications.type, filter));

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(totalCountConditions);

    return NextResponse.json({
      ok: true,
      notifications: userNotifications,
      total: totalCountResult[0].count,
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
