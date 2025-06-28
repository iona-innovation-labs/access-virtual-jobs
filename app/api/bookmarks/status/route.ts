import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isJobBookmarked, getJobBookmarkStatuses } from "@/lib/api/bookmarks";
import { log } from "@/lib/logs";

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
    const jobId = searchParams.get("jobId");
    const jobIds = searchParams.get("jobIds");

    // Single job ID check
    if (jobId) {
      const parsedJobId = parseInt(jobId);

      if (isNaN(parsedJobId)) {
        return NextResponse.json(
          { success: false, message: "Valid job ID is required" },
          { status: 400 }
        );
      }

      const result = await isJobBookmarked(session.user.id, parsedJobId);

      return NextResponse.json(result, {
        status: result.success ? 200 : 400,
      });
    }

    // Multiple job IDs check
    if (jobIds) {
      try {
        const parsedJobIds = JSON.parse(jobIds);

        if (!Array.isArray(parsedJobIds)) {
          return NextResponse.json(
            { success: false, message: "Job IDs must be an array" },
            { status: 400 }
          );
        }

        const validJobIds = parsedJobIds
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));

        if (validJobIds.length === 0) {
          return NextResponse.json(
            { success: false, message: "No valid job IDs provided" },
            { status: 400 }
          );
        }

        const result = await getJobBookmarkStatuses(
          session.user.id,
          validJobIds
        );

        return NextResponse.json(result, {
          status: result.success ? 200 : 400,
        });
      } catch (parseError) {
        return NextResponse.json(
          {
            success: false,
            message: parseError?.internalMessage || "Invalid jobIds format",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Either jobId or jobIds parameter is required",
      },
      { status: 400 }
    );
  } catch (error) {
    log("Error in GET /api/bookmarks/status:", "error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
