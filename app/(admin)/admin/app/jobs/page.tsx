import { Metadata } from "next";
import { getAdminJobs } from "@/lib/api/jobs";
import AdminJobListClient from "@/components/admin/components/admin-job-list-client";
import { ISearchParams } from "@/types/jobs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin - Jobs",
  description: "View and manage all jobs on the AVJ platform.",
};

function getStringParam(
  param: string | string[] | undefined,
  fallback = ""
): string {
  if (typeof param === "string") return param;
  if (Array.isArray(param)) return param[0] || fallback;
  return fallback;
}

function getQueryParams(searchParams: ISearchParams) {
  const urlSearchParams = new URLSearchParams();
  const status = getStringParam(searchParams.status, "");
  const search = getStringParam(searchParams.search, "");
  const sortBy = getStringParam(searchParams.sortBy, "createdAt");
  const sortDescRaw = getStringParam(searchParams.sortDesc, "true");
  const sortDesc = sortDescRaw !== "false";
  const pageRaw = getStringParam(searchParams.page, "1");
  const page = parseInt(pageRaw, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  if (status) {
    urlSearchParams.set("status", status);
  }
  if (search) {
    urlSearchParams.set("search", search);
  }
  if (sortBy) {
    urlSearchParams.set("sortBy", sortBy);
  }
  urlSearchParams.set("sortDesc", sortDesc ? "true" : "false");
  urlSearchParams.set("limit", limit.toString());
  urlSearchParams.set("offset", offset.toString());
  return { urlSearchParams, page, limit, status, search, sortBy, sortDesc };
}

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const { page, limit, status, search, sortBy, sortDesc } = getQueryParams(
    await searchParams
  );
  console.log("STATUS", status);
  console.log("SEARCH", search);
  console.log("SORT BY", sortBy);
  console.log("SORT DESC", sortDesc);
  console.log("PAGE", page);
  console.log("LIMIT", limit);
  const jobsData = await getAdminJobs({
    status,
    search,
    sortBy,
    sortDesc,
    page,
    limit,
  });
  const jobs = jobsData?.items || [];
  const total = jobsData?.all || 0;

  return (
    <main className="w-full  mx-auto p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <Link
          href="/admin/app/jobs/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Job
        </Link>
      </div>
      <AdminJobListClient
        initialJobs={jobs}
        initialTotal={total}
        initialStatus={status}
        initialSearch={search}
        initialSortBy={sortBy}
        initialSortDesc={sortDesc}
        initialPage={page}
        pageSize={limit}
      />
    </main>
  );
}
