import { NextRequest, NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/database";
import { workHistory } from "@/database/schema/profiles";
import { profiles } from "@/database/schema/profiles";
import { log } from "@/lib/logs";
import { auth } from "@/auth";
import { IWorkHistoryResponse } from "@/types/profile-overview";

// GET - Fetch all work history for authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    // Get user's profile first
    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!userProfile) {
      return NextResponse.json(
        {
          error: "Profile not found",
          message: "User profile does not exist.",
          ok: false,
        },
        { status: 404 }
      );
    }

    // Fetch work history ordered by start date (most recent first)
    const workHistoryData = await db.query.workHistory.findMany({
      where: eq(workHistory.profileId, userProfile.id),
      orderBy: [desc(workHistory.startDate)],
    });

    // Format the response to match IWorkHistoryResponse interface
    const formattedWorkHistory = workHistoryData.map((item) => ({
      id: item.id,
      profileId: item.profileId!,
      company: item.company,
      position: item.position,
      startDate: item.startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      endDate: item.endDate
        ? item.endDate.toISOString().split("T")[0]
        : undefined,
      description: item.description || undefined,
      isCurrentJob: item.isCurrentJob || "no",
      location: item.location || undefined,
      employmentType: item.employmentType || undefined,
      createdAt: item.createdAt
        ? item.createdAt.toISOString()
        : new Date().toISOString(),
    }));

    return NextResponse.json<IWorkHistoryResponse>({
      workHistory: formattedWorkHistory,
      message: "Work history fetched successfully.",
      ok: true,
    });
  } catch (error: any) {
    log("Error fetching work history:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error fetching work history",
      },
      { status: 500 }
    );
  }
}

// POST - Create new work history entry
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
    const {
      company,
      position,
      startDate,
      endDate,
      description,
      isCurrentJob,
      location,
      employmentType,
    } = body;

    // Validate required fields
    if (!company || !position || !startDate) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Company, position, and start date are required.",
          ok: false,
        },
        { status: 400 }
      );
    }

    // Get user's profile
    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!userProfile) {
      return NextResponse.json(
        {
          error: "Profile not found",
          message: "User profile does not exist.",
          ok: false,
        },
        { status: 404 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (end && start > end) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Start date cannot be after end date.",
          ok: false,
        },
        { status: 400 }
      );
    }

    // If this is marked as current job, update other entries to not be current
    if (isCurrentJob === "yes") {
      await db
        .update(workHistory)
        .set({ isCurrentJob: "no" })
        .where(
          and(
            eq(workHistory.profileId, userProfile.id),
            eq(workHistory.isCurrentJob, "yes")
          )
        );
    }

    // Create new work history entry
    const newWorkHistory = await db
      .insert(workHistory)
      .values({
        profileId: userProfile.id,
        company: company.trim(),
        position: position.trim(),
        startDate: start,
        endDate: end,
        description: description?.trim() || null,
        isCurrentJob: isCurrentJob || "no",
        location: location?.trim() || null,
        employmentType: employmentType || null,
      })
      .returning();

    // Format the response to match the interface
    const formattedWorkHistory = {
      id: newWorkHistory[0].id,
      profileId: newWorkHistory[0].profileId!,
      company: newWorkHistory[0].company,
      position: newWorkHistory[0].position,
      startDate: newWorkHistory[0].startDate.toISOString().split("T")[0],
      endDate: newWorkHistory[0].endDate
        ? newWorkHistory[0].endDate.toISOString().split("T")[0]
        : undefined,
      description: newWorkHistory[0].description || undefined,
      isCurrentJob: newWorkHistory[0].isCurrentJob || "no",
      location: newWorkHistory[0].location || undefined,
      employmentType: newWorkHistory[0].employmentType || undefined,
      createdAt: newWorkHistory[0].createdAt
        ? newWorkHistory[0].createdAt.toISOString()
        : new Date().toISOString(),
    };

    return NextResponse.json({
      workHistory: [formattedWorkHistory],
      message: "Work history created successfully.",
      ok: true,
    });
  } catch (error: any) {
    log("Error creating work history:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error creating work history",
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing work history entry
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      id,
      company,
      position,
      startDate,
      endDate,
      description,
      isCurrentJob,
      location,
      employmentType,
    } = body;

    // Validate required fields
    if (!id || !company || !position || !startDate) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "ID, company, position, and start date are required.",
          ok: false,
        },
        { status: 400 }
      );
    }

    // Get user's profile
    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!userProfile) {
      return NextResponse.json(
        {
          error: "Profile not found",
          message: "User profile does not exist.",
          ok: false,
        },
        { status: 404 }
      );
    }

    // Verify the work history entry belongs to the user
    const existingWorkHistory = await db.query.workHistory.findFirst({
      where: and(
        eq(workHistory.id, id),
        eq(workHistory.profileId, userProfile.id)
      ),
    });

    if (!existingWorkHistory) {
      return NextResponse.json(
        {
          error: "Work history not found",
          message:
            "Work history entry does not exist or does not belong to you.",
          ok: false,
        },
        { status: 404 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (end && start > end) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Start date cannot be after end date.",
          ok: false,
        },
        { status: 400 }
      );
    }

    // If this is marked as current job, update other entries to not be current
    if (isCurrentJob === "yes") {
      await db
        .update(workHistory)
        .set({ isCurrentJob: "no" })
        .where(
          and(
            eq(workHistory.profileId, userProfile.id),
            eq(workHistory.isCurrentJob, "yes")
          )
        );
    }

    // Update work history entry
    const updatedWorkHistory = await db
      .update(workHistory)
      .set({
        company: company.trim(),
        position: position.trim(),
        startDate: start,
        endDate: end,
        description: description?.trim() || null,
        isCurrentJob: isCurrentJob || "no",
        location: location?.trim() || null,
        employmentType: employmentType || null,
      })
      .where(eq(workHistory.id, id))
      .returning();

    // Format the response to match the interface
    const formattedWorkHistory = {
      id: updatedWorkHistory[0].id,
      profileId: updatedWorkHistory[0].profileId!,
      company: updatedWorkHistory[0].company,
      position: updatedWorkHistory[0].position,
      startDate: updatedWorkHistory[0].startDate.toISOString().split("T")[0],
      endDate: updatedWorkHistory[0].endDate
        ? updatedWorkHistory[0].endDate.toISOString().split("T")[0]
        : undefined,
      description: updatedWorkHistory[0].description || undefined,
      isCurrentJob: updatedWorkHistory[0].isCurrentJob || "no",
      location: updatedWorkHistory[0].location || undefined,
      employmentType: updatedWorkHistory[0].employmentType || undefined,
      createdAt: updatedWorkHistory[0].createdAt
        ? updatedWorkHistory[0].createdAt.toISOString()
        : new Date().toISOString(),
    };

    return NextResponse.json({
      workHistory: [formattedWorkHistory],
      message: "Work history updated successfully.",
      ok: true,
    });
  } catch (error: any) {
    log("Error updating work history:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error updating work history",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete work history entry
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Work history ID is required.",
          ok: false,
        },
        { status: 400 }
      );
    }

    // Get user's profile
    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!userProfile) {
      return NextResponse.json(
        {
          error: "Profile not found",
          message: "User profile does not exist.",
          ok: false,
        },
        { status: 404 }
      );
    }

    // Verify the work history entry belongs to the user
    const existingWorkHistory = await db.query.workHistory.findFirst({
      where: and(
        eq(workHistory.id, parseInt(id)),
        eq(workHistory.profileId, userProfile.id)
      ),
    });

    if (!existingWorkHistory) {
      return NextResponse.json(
        {
          error: "Work history not found",
          message:
            "Work history entry does not exist or does not belong to you.",
          ok: false,
        },
        { status: 404 }
      );
    }

    // Delete work history entry
    await db.delete(workHistory).where(eq(workHistory.id, parseInt(id)));

    return NextResponse.json({
      message: "Work history deleted successfully.",
      ok: true,
    });
  } catch (error: any) {
    log("Error deleting work history:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error deleting work history",
      },
      { status: 500 }
    );
  }
}
