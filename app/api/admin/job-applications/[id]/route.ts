import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { jobApplications } from "@/database/schema/job-applications";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { log } from "@/lib/logs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Add admin role check here
    // For now, allow any authenticated user to update

    const { id } = await params;
    const applicationId = parseInt(id);

    if (isNaN(applicationId)) {
      return NextResponse.json(
        { message: "Invalid application ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, progress } = body;

    if (!status && !progress) {
      return NextResponse.json(
        { message: "Status or progress is required" },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !["on_going", "archived"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Validate progress
    const validProgressValues = [
      "in_review",
      "reviewed",
      "declined_initial_interview",
      "initial_interview",
      "for_client_interview",
      "declined_after_interview",
      "make_offer",
      "hired_signed",
      "endorsed",
      "reserved_for_future_opening",
    ];

    if (progress && !validProgressValues.includes(progress)) {
      return NextResponse.json(
        { message: "Invalid progress value" },
        { status: 400 }
      );
    }

    // Update the job application
    const updateData: any = {};
    if (status) updateData.status = status;
    if (progress) updateData.progress = progress;

    const result = await db
      .update(jobApplications)
      .set(updateData)
      .where(eq(jobApplications.id, applicationId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Job application not found" },
        { status: 404 }
      );
    }

    log(
      `Job application ${applicationId} updated by admin ${session.user.id}`,
      "info",
      {
        status,
        progress,
        updatedBy: session.user.id,
      }
    );

    return NextResponse.json({
      message: "Job application updated successfully",
      data: result[0],
    });
  } catch (error) {
    log("Error updating job application:", "error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
