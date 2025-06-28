import { NextRequest, NextResponse } from "next/server";
import { jobApplications } from "@/database/schema/job-applications";
import { db } from "@/database";
import { profiles, users } from "@/database/schema";
import { and, eq, sql } from "drizzle-orm";
import { log } from "@/lib/logs";
import { createNotification } from "@/database/mutations/job_applicants";
import { getJobPost } from "@/lib/api/jobs";
import { sendEmailNotification } from "@/services/send-email-notif";
import { generateNumericId } from "@/utils/generate-numeric-id";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const filter = searchParams.get("filter") || "on_going";
    console.log("data", {
      page,
      limit,
      filter,
    });

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { message: "User not found", ok: false },
        { status: 404 }
      );
    }

    const offset = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      db
        .select()
        .from(jobApplications)
        .where(
          and(
            eq(jobApplications.userId, user[0].id),
            eq(jobApplications.status, filter)
          )
        )
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(jobApplications)
        .where(
          and(
            eq(jobApplications.userId, user[0].id),
            eq(jobApplications.status, filter)
          )
        ),
    ]);

    const mergedApplications = await Promise.all(
      applications.map(async (application) => {
        const jobDetails = await getJobPost(String(application.jobId ?? ""));
        return {
          ...application,
          job: {
            id: jobDetails?.item?.id || "N/A",
            title: jobDetails?.item?.title || "Unknown Job",
            pay: jobDetails?.item?.pay || "Not provided",
            url: jobDetails?.item?.url || "",
            createdAt: jobDetails?.item?.createdAt || "",
            postedBy: jobDetails?.item?.postedBy || "Unknown",
            description:
              jobDetails?.item?.description || "No description provided",
          },
        };
      })
    );

    log("GET /api/submissions", "info", {
      message: "Applications fetched successfully",
      userId: user[0].id,
      page,
      limit,
      filter,
    });

    return NextResponse.json(
      {
        message: "Applications fetched successfully",
        ok: true,
        jobApplications: mergedApplications,
        total: total[0]?.count || 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    log("GET /api/submissions", "error", { error: error.message });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error fetching applications",
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
        { message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const { jobId } = await req.json();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { message: "User not found", ok: false },
        { status: 404 }
      );
    }

    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user[0].id))
      .limit(1);

    if (!profile.length) {
      return NextResponse.json(
        { message: "Profile not found", ok: false },
        { status: 404 }
      );
    }

    const existingApplication = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, jobId),
          eq(jobApplications.userId, user[0].id)
        )
      )
      .limit(1);

    console.log("existingApplication", existingApplication);

    if (existingApplication.length) {
      console.log("Already applied");
      return NextResponse.json(
        { message: "Already applied", ok: false },
        { status: 400 }
      );
    }

    const [newApplication] = await db
      .insert(jobApplications)
      .values({
        userId: user[0].id,
        applicationPublicId: generateNumericId(),
        profileId: profile[0].id,
        jobId,
        status: "on_going",
        progress: "in_review",
      })
      .returning();

    log("POST /api/submissions", "info", {
      message: "Application submitted successfully",
      userId: user[0].id,
      jobId,
    });

    const job = await getJobPost(jobId);
    if (user[0].jobSubmissionNotifPref === "enabled") {
      createNotification(
        user[0].id,
        `You sent a job application to "${job?.item?.title}". Please wait for the recruiter to reach out. `,
        "info",
        `/app/submissions/${newApplication.applicationPublicId}`
      );

      sendEmailNotification({
        to: [user[0].email],
        subject: `You sent a job application to "${job?.item?.title}"`,
        message:
          "Cheers! We received your application. Please wait for the recruiter to reach out.",
        footer:
          "If you have any questions, feel free to reach out 👉 support@accessvirtualstaffing.com",
      });
    }

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        ok: true,
        applicationId: newApplication.applicationPublicId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    log("POST /api/submissions", "error", { error: error.message });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error fetching user data",
      },
      { status: 500 }
    );
  }
}
