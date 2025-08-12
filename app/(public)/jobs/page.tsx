import { Metadata } from "next";
import { Suspense } from "react";

import { ISearchParams } from "@/types/jobs";
import { getJobsFromUrl } from "@/lib/api/jobs";
import { JobListPaginationContainer } from "@/components/jobs/joblist-pagination-container";
import { JobList } from "@/components/jobs/job-list";
import JobFilter from "@/components/jobs/job-filter";
import JobHeader from "@/components/jobs/job-header";

import { JobListSkeleton } from "@/components/jobs/job-list-skeleton";

export const metadata: Metadata = {
  title: "Explore Jobs",
  description: "Explore and apply for jobs through Applicant portal",
};

// Separate component for the job content to enable Suspense
async function JobContent({ searchParams }: { searchParams: ISearchParams }) {
  // Convert searchParams to URLSearchParams for the API
  const urlSearchParams = new URLSearchParams();

  // Add all search parameters to URLSearchParams
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlSearchParams.set(key, value.toString());
    }
  });

  // Set pagination
  const page = parseInt(searchParams?.page as string, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  urlSearchParams.set("limit", limit.toString());
  urlSearchParams.set("offset", offset.toString());

  console.log(
    "🔍 Fetching jobs with params:",
    Object.fromEntries(urlSearchParams.entries())
  );

  // Use the URL-based job fetching function that handles all filters
  const positions = await getJobsFromUrl(urlSearchParams, true);

  console.log("📊 Jobs fetched:", {
    success: positions?.success,
    itemCount: positions?.items?.length,
    total: positions?.total,
  });

  let totalFilteredCount = 0;
  if (positions?.success && positions.pagination) {
    totalFilteredCount = positions.all;
  } else if (positions?.success) {
    totalFilteredCount = positions.total;
  } else {
    totalFilteredCount = 0;
  }

  return (
    <>
      <JobList positions={positions?.items || []} isPublic={true} />
      <JobListPaginationContainer
        totalCount={totalFilteredCount}
        siblingCount={1}
        pageSize={limit}
      />
    </>
  );
}

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="w-full mx-auto bg-background overflow-hidden">
      <JobHeader
        heading="Explore Jobs"
        description="Explore and apply for jobs"
        isPublic={true}
      />
      <JobFilter isPublic={true} />

      {/* Wrap job content in Suspense for loading state */}
      <Suspense
        key={JSON.stringify(resolvedSearchParams)}
        fallback={<JobListSkeleton />}
      >
        <JobContent searchParams={resolvedSearchParams} />
      </Suspense>
    </main>
  );
}
