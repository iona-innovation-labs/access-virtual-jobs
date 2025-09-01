import { NextResponse } from "next/server";
import { db } from "@/database";
import { jobApplications, jobs, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
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

    // Get latest 3 job applications with job and user details
    const latestApplications = await db
      .select({
        id: jobApplications.id,
        applicationPublicId: jobApplications.applicationPublicId,
        status: jobApplications.status,
        progress: jobApplications.progress,
        submittedAt: jobApplications.submittedAt,
        jobTitle: jobs.title,
        jobId: jobs.id,
        userName: users.name,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userEmail: users.email,
      })
      .from(jobApplications)
      .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .leftJoin(users, eq(jobApplications.userId, users.id))
      .orderBy(desc(jobApplications.submittedAt))
      .limit(3);

    log(`Latest applications fetched by user ${session.user.id}`, "info", {
      count: latestApplications.length,
    });

    return NextResponse.json({
      success: true,
      data: latestApplications,
    });
  } catch (error) {
    log("Error fetching latest applications:", "error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
