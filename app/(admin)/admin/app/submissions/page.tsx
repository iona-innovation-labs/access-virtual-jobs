import { Metadata } from "next";
import { getAdminJobApplications } from "@/lib/api/jobs";
import AdminSubmissionsListClient from "@/components/admin/components/admin-submissions-list-client";
import { ISearchParams } from "@/types/jobs";

export const metadata: Metadata = {
  title: "Admin - Job Applications",
  description: "View and manage all job applications submitted by applicants.",
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
  const sortBy = getStringParam(searchParams.sortBy, "submittedAt");
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

export default async function AdminJobApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const { page, limit, status, search, sortBy, sortDesc } = getQueryParams(
    await searchParams
  );

  const applicationsData = await getAdminJobApplications({
    status,
    search,
    sortBy,
    sortDesc,
    page,
    limit,
  });
  const applications = applicationsData?.items || [];
  const total = applicationsData?.all || 0;

  return (
    <main className="w-full mx-auto p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
      </div>
      <AdminSubmissionsListClient
        initialApplications={applications}
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
