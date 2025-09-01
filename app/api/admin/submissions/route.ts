import { NextRequest } from "next/server";
import { getAdminJobApplications } from "@/lib/api/jobs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || "submittedAt";
  const sortDesc = searchParams.get("sortDesc") === "true";

  const result = await getAdminJobApplications({
    page,
    limit,
    status,
    search,
    sortBy,
    sortDesc,
  });
  return Response.json(result);
}
