// /api/profile/certifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/database";
import { certifications } from "@/database/schema/profiles";
import { profiles } from "@/database/schema/profiles";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";

// GET - Fetch certifications
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // For public profiles

    // If userId provided, get public profile certifications
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
          certifications: [],
        });
      }

      const certificationsData = await db.query.certifications.findMany({
        where: eq(certifications.profileId, profile.id),
        orderBy: (certifications, { desc }) => [desc(certifications.issueDate)],
      });

      return NextResponse.json({
        message: "Success!",
        ok: true,
        certifications: certificationsData,
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
        certifications: [],
      });
    }

    const certificationsData = await db.query.certifications.findMany({
      where: eq(certifications.profileId, profile.id),
      orderBy: (certifications, { desc }) => [desc(certifications.issueDate)],
    });

    log("GET /api/profile/certifications", "info", {
      certifications: certificationsData,
    });

    return NextResponse.json({
      message: "Success!",
      ok: true,
      certifications: certificationsData,
    });
  } catch (error: any) {
    log("Error fetching certifications:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}

// POST - Create/Update certifications
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
    log("POST /api/profile/certifications", "info", { body });

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

    // Delete existing certifications
    await db
      .delete(certifications)
      .where(eq(certifications.profileId, profile.id));

    // Insert new certifications entries
    if (body.certifications && body.certifications.length > 0) {
      await Promise.all(
        body.certifications.map((cert: any) =>
          db.insert(certifications).values({
            profileId: profile.id,
            name: cert.name,
            issuingOrganization: cert.issuingOrganization,
            issueDate: new Date(cert.issueDate),
            expirationDate: cert.expirationDate
              ? new Date(cert.expirationDate)
              : null,
            credentialId: cert.credentialId,
            credentialUrl: cert.credentialUrl,
            description: cert.description,
          })
        )
      );
    }

    return NextResponse.json({
      message: "Certifications updated successfully",
      ok: true,
    });
  } catch (error: any) {
    log("Error updating certifications:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific certification entry
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
    const certificationId = searchParams.get("id");

    if (!certificationId) {
      return NextResponse.json(
        { error: "Certification ID required", ok: false },
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

    // Verify the certification belongs to this user's profile
    const certificationEntry = await db.query.certifications.findFirst({
      where: eq(certifications.id, parseInt(certificationId)),
    });

    if (!certificationEntry || certificationEntry.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Certification not found", ok: false },
        { status: 404 }
      );
    }

    await db
      .delete(certifications)
      .where(eq(certifications.id, parseInt(certificationId)));

    log("DELETE /api/profile/certifications", "info", { certificationId });

    return NextResponse.json({
      message: "Certification deleted successfully",
      ok: true,
    });
  } catch (error: any) {
    log("Error deleting certification:", "error", {
      error: error?.message || "",
    });
    return NextResponse.json(
      { error: "Internal Server Error", ok: false },
      { status: 500 }
    );
  }
}
