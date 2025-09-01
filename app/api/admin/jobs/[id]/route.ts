import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateJobPost } from "@/lib/api/jobs";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("PUT /api/admin/jobs/[id] called with params:", params);

    const session = await auth();
    console.log("Session:", session?.user?.id);

    if (!session?.user) {
      console.log("No session found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body);

    const jobId = parseInt(params.id);
    console.log("Parsed job ID:", jobId);

    if (isNaN(jobId)) {
      console.log("Invalid job ID");
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    console.log("Calling updateJobPost with:", { id: jobId, ...body });
    const result = await updateJobPost({
      id: jobId,
      ...body,
    });

    console.log("updateJobPost result:", result);

    if (!result) {
      console.log("updateJobPost returned null");
      return NextResponse.json(
        { error: "Failed to update job" },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
