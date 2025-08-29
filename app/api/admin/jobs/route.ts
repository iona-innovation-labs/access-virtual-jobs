import { NextRequest, NextResponse } from "next/server";
import { getAdminJobs, createAdminJobPost } from "@/lib/api/jobs";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || "";
  console.log("STATUS", status);
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortDesc = searchParams.get("sortDesc") !== "false";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const jobs = await getAdminJobs({
    status,
    search,
    sortBy,
    sortDesc,
    page,
    limit,
  });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, ...jobData } = body;

    // Create the job with the specified status
    const result = await createAdminJobPost({
      ...jobData,
      postedById: session.user.id,
      status: status || "inactive", // Default to inactive if not specified
    });
    console.log("Result:", result);

    if (!result.ok) {
      return NextResponse.json(
        { publicMessage: result.message, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
