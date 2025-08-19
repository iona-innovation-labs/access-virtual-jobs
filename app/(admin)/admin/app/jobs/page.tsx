import { Metadata } from "next";
import { getJobsFromUrl } from "@/lib/api/jobs";
import AdminJobListClient from "@/components/admin/components/admin-job-list-client";
import { ISearchParams } from "@/types/jobs";

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
  const status = getStringParam(searchParams.status, "all");
  const search = getStringParam(searchParams.search, "");
  const sortBy = getStringParam(searchParams.sortBy, "createdAt");
  const sortDescRaw = getStringParam(searchParams.sortDesc, "true");
  const sortDesc = sortDescRaw !== "false";
  const pageRaw = getStringParam(searchParams.page, "1");
  const page = parseInt(pageRaw, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  if (status && status !== "all") {
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
  searchParams: ISearchParams;
}) {
  const { urlSearchParams, page, limit, status, search, sortBy, sortDesc } =
    getQueryParams(searchParams);
  const jobsData = await getJobsFromUrl(urlSearchParams, false);
  const jobs = jobsData?.items || [];
  const total = jobsData?.all || 0;

  return (
    <main className="w-full  mx-auto p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Remote Jobs</h1>
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
