import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleBookmark } from "@/lib/api/bookmarks";
import { log } from "@/lib/logs";

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

    const result = await toggleBookmark(session.user.id, jobId);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    log("Error in POST /api/bookmarks/toggle:", "error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
