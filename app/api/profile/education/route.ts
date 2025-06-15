// /api/profile/education/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/database";
import { education } from "@/database/schema/profiles";
import { profiles } from "@/database/schema/profiles";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";

// GET - Fetch education
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // For public profiles

    // If userId provided, get public profile education
    if (userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found", ok: false },
          { status: 404 }
        );
      }

      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId),
      });

      if (!profile) {
        return NextResponse.json({
          message: "Success!",
          ok: true,
          education: [],
        });
      }

      const educationData = await db.query.education.findMany({
        where: eq(education.profileId, profile.id),
        orderBy: (education, { desc }) => [desc(education.startDate)],
      });

      return NextResponse.json({
        message: "Success!",
        ok: true,
        education: educationData,
      });
    }

    // Private access - require authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", ok: false },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", ok: false },
        { status: 404 }
      );
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
    });

    if (!profile) {
      return NextResponse.json({
        message: "Success!",
        ok: true,
        education: [],
      });
    }

    const educationData = await db.query.education.findMany({
      where: eq(education.profileId, profile.id),
      orderBy: (education, { desc }) => [desc(education.startDate)],
    });

    log("GET /api/profile/education", "info", { education: educationData });

    return NextResponse.json({
      message: "Success!",
      ok: true,
      education: educationData,
    });
  } catch (error: any) {
    log("Error fetching education:", "error", { error: error?.message || "" });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}

// POST - Create/Update education
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", ok: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    log("POST /api/profile/education", "info", { body });

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", ok: false },
        { status: 404 }
      );
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found", ok: false },
        { status: 404 }
      );
    }

    // Delete existing education
    await db.delete(education).where(eq(education.profileId, profile.id));

    // Insert new education entries
    if (body.education && body.education.length > 0) {
      await Promise.all(
        body.education.map((edu: any) =>
          db.insert(education).values({
            profileId: profile.id,
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            gpa: edu.gpa,
            description: edu.description,
            isCurrentlyStudying: edu.isCurrentlyStudying || "no",
            location: edu.location,
          })
        )
      );
    }

    return NextResponse.json({
      message: "Education updated successfully",
      ok: true,
    });
  } catch (error: any) {
    log("Error updating education:", "error", { error: error?.message || "" });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific education entry
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", ok: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const educationId = searchParams.get("id");

    if (!educationId) {
      return NextResponse.json(
        { error: "Education ID required", ok: false },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", ok: false },
        { status: 404 }
      );
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found", ok: false },
        { status: 404 }
      );
    }

    // Verify the education belongs to this user's profile
    const educationEntry = await db.query.education.findFirst({
      where: eq(education.id, parseInt(educationId)),
    });

    if (!educationEntry || educationEntry.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Education not found", ok: false },
        { status: 404 }
      );
    }

    await db.delete(education).where(eq(education.id, parseInt(educationId)));

    log("DELETE /api/profile/education", "info", { educationId });

    return NextResponse.json({
      message: "Education deleted successfully",
      ok: true,
    });
  } catch (error: any) {
    log("Error deleting education:", "error", { error: error?.message || "" });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}
