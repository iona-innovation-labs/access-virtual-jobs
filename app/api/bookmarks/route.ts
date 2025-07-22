import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  addBookmark,
  removeBookmark,
  getBookmarkedJobs,
  getUserBookmarkCount,
} from "@/lib/api/bookmarks";
import { log } from "@/lib/logs";

// POST /api/bookmarks - Add bookmark
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobId } = body;

    if (!jobId || typeof jobId !== "number") {
      return NextResponse.json(
        { success: false, message: "Valid job ID is required" },
        { status: 400 }
      );
    }

    const result = await addBookmark(session.user.id, jobId);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    log("Error in POST /api/bookmarks:", "error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks - Remove bookmark
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = parseInt(searchParams.get("jobId") || "");

    if (!jobId || isNaN(jobId)) {
      return NextResponse.json(
        { success: false, message: "Valid job ID is required" },
        { status: 400 }
      );
    }

    const result = await removeBookmark(session.user.id, jobId);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    log("Error in DELETE /api/bookmarks:", "error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/bookmarks - Get user's bookmarks with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const includeCount = searchParams.get("includeCount") === "true";

    // Validate pagination parameters
    const validLimit = Math.min(Math.max(limit, 1), 100);
    const validOffset = Math.max(offset, 0);

    const result = await getBookmarkedJobs(
      session.user.id,
      validLimit,
      validOffset
    );

    // Optionally include total count for badges/counters
    if (includeCount && result.success) {
      const countResult = await getUserBookmarkCount(session.user.id);
      (result as any).totalBookmarks = countResult.count;
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    log("Error in GET /api/bookmarks:", "error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
