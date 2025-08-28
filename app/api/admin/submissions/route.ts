import { NextRequest } from "next/server";
import { getAdminJobApplications } from "@/lib/api/jobs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const result = await getAdminJobApplications({ page, limit, status, search });
  return Response.json(result);
}
