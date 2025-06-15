// /api/profile/skills/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/database";
import { skills } from "@/database/schema/profiles";
import { profiles } from "@/database/schema/profiles";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";

// GET - Fetch skills
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // For public profiles

    // If userId provided, get public profile skills
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
          skills: [],
        });
      }

      const skillsData = await db.query.skills.findMany({
        where: eq(skills.profileId, profile.id),
        orderBy: (skills, { asc }) => [asc(skills.category), asc(skills.name)],
      });

      return NextResponse.json({
        message: "Success!",
        ok: true,
        skills: skillsData,
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
        skills: [],
      });
    }

    const skillsData = await db.query.skills.findMany({
      where: eq(skills.profileId, profile.id),
      orderBy: (skills, { asc }) => [asc(skills.category), asc(skills.name)],
    });

    log("GET /api/profile/skills", "info", { skills: skillsData });

    return NextResponse.json({
      message: "Success!",
      ok: true,
      skills: skillsData,
    });
  } catch (error: any) {
    log("Error fetching skills:", "error", { error: error?.message || "" });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}

// POST - Create/Update skills
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
    log("POST /api/profile/skills", "info", { body });

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

    // Delete existing skills
    await db.delete(skills).where(eq(skills.profileId, profile.id));

    // Insert new skills entries
    if (body.skills && body.skills.length > 0) {
      await Promise.all(
        body.skills.map((skill: any) =>
          db.insert(skills).values({
            profileId: profile.id,
            name: skill.name,
            category: skill.category || null,
            starRating: skill.starRating || 1, // Updated to use starRating
            yearsOfExperience: skill.yearsOfExperience || null,
          })
        )
      );
    }

    return NextResponse.json({
      message: "Skills updated successfully",
      ok: true,
    });
  } catch (error: any) {
    log("Error updating skills:", "error", { error: error?.message || "" });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific skill entry
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
    const skillId = searchParams.get("id");

    if (!skillId) {
      return NextResponse.json(
        { error: "Skill ID required", ok: false },
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

    // Verify the skill belongs to this user's profile
    const skillEntry = await db.query.skills.findFirst({
      where: eq(skills.id, parseInt(skillId)),
    });

    if (!skillEntry || skillEntry.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Skill not found", ok: false },
        { status: 404 }
      );
    }

    await db.delete(skills).where(eq(skills.id, parseInt(skillId)));

    log("DELETE /api/profile/skills", "info", { skillId });

    return NextResponse.json({
      message: "Skill deleted successfully",
      ok: true,
    });
  } catch (error: any) {
    log("Error deleting skill:", "error", { error: error?.message || "" });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}
