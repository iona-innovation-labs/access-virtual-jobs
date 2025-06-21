// /api/profile/skills/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/database";
import { skills } from "@/database/schema/profiles";
import { profiles } from "@/database/schema/profiles";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";
import { MAX_SKILL_COUNT } from "@/lib/constants";

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

    // Validate skills array and limit
    if (!body.skills || !Array.isArray(body.skills)) {
      return NextResponse.json(
        { error: "Skills must be provided as an array", ok: false },
        { status: 400 }
      );
    }

    // Check skill limit - maximum 10 skills allowed
    if (body.skills.length > MAX_SKILL_COUNT) {
      return NextResponse.json(
        {
          error: "Maximum 10 skills allowed",
          ok: false,
          maxSkills: 10,
          providedSkills: body.skills.length,
        },
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

    // Validate each skill entry
    for (let i = 0; i < body.skills.length; i++) {
      const skill = body.skills[i];

      if (
        !skill.name ||
        typeof skill.name !== "string" ||
        skill.name.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error: `Skill ${i + 1}: Name is required and must be a non-empty string`,
            ok: false,
          },
          { status: 400 }
        );
      }

      if (skill.starRating && (skill.starRating < 1 || skill.starRating > 5)) {
        return NextResponse.json(
          {
            error: `Skill ${i + 1}: Star rating must be between 1 and 5`,
            ok: false,
          },
          { status: 400 }
        );
      }

      if (skill.yearsOfExperience && skill.yearsOfExperience < 0) {
        return NextResponse.json(
          {
            error: `Skill ${i + 1}: Years of experience cannot be negative`,
            ok: false,
          },
          { status: 400 }
        );
      }
    }

    // Delete existing skills
    await db.delete(skills).where(eq(skills.profileId, profile.id));

    // Insert new skills entries
    if (body.skills.length > 0) {
      await Promise.all(
        body.skills.map((skill: any) =>
          db.insert(skills).values({
            profileId: profile.id,
            name: skill.name.trim(),
            category: skill.category?.trim() || null,
            starRating: skill.starRating || 1,
            yearsOfExperience: skill.yearsOfExperience || null,
          })
        )
      );
    }

    log("Skills updated successfully", "info", {
      userId: session.user.id,
      skillsCount: body.skills.length,
    });

    return NextResponse.json({
      message: "Skills updated successfully",
      ok: true,
      skillsCount: body.skills.length,
      maxSkills: 10,
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
