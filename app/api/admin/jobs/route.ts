import { NextRequest, NextResponse } from "next/server";
import { getAdminJobs } from "@/lib/api/jobs";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") || "all";
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
