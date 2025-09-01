import { NextResponse } from "next/server";
import { db } from "@/database";
import { jobs, jobApplications } from "@/database/schema";
import { eq, count } from "drizzle-orm";
import { auth } from "@/auth";
import { log } from "@/lib/logs";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Add admin role check here
    // For now, allow any authenticated user to access

    // Get active jobs count
    const activeJobsResult = await db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.status, "active"));

    // Get active job applications count
    const activeApplicationsResult = await db
      .select({ count: count() })
      .from(jobApplications)
      .where(eq(jobApplications.status, "on_going"));

    const stats = {
      activeJobs: activeJobsResult[0]?.count || 0,
      activeApplications: activeApplicationsResult[0]?.count || 0,
    };

    log(`Dashboard stats fetched by user ${session.user.id}`, "info", stats);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    log("Error fetching dashboard stats:", "error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
