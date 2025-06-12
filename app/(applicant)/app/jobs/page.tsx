import { Metadata } from "next";

import { ISearchParams } from "@/types/jobs";
import { getJobs } from "@/lib/api/jobs";
import { JobListPaginationContainer } from "@/components/jobs/joblist-pagination-container";
import { JobList } from "@/components/jobs/job-list";
import JobFilter from "@/components/jobs/job-filter";
import JobHeader from "@/components/jobs/job-header";

export const metadata: Metadata = {
  title: "Explore Jobs",
  description: "Explore and apply for jobs through Applicant portal",
};

// export const dynamic = "force-dynamic";

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const page = parseInt(resolvedSearchParams?.page as string, 10) || 1;
  const offset = (page - 1) * 10;
  const positions = await getJobs(
    {
      offset,
      sort_by: "created_on",
      sort_desc: true,
      limit: 10,
      filters: {
        "job-posting-status": 3,
      },
    },
    resolvedSearchParams?.q?.toString() || undefined,
    true
  );

  const hasSearch = !!resolvedSearchParams?.q;
  const actualItemsCount = positions?.items?.length || 0;

  let totalFilteredCount = 0;
  if (positions?.success) {
    if (hasSearch && page === 1 && actualItemsCount < 10) {
      totalFilteredCount = actualItemsCount;
    } else {
      totalFilteredCount = positions.total;
    }
  } else {
    totalFilteredCount = 0;
  }

  return (
    <main className="w-full mx-auto bg-background overflow-hidden">
      <JobHeader
        heading="Explore Jobs"
        description="Explore and apply for jobs"
        isPublic={false}
      />
      <JobFilter isPublic={false} />
      <JobList positions={positions?.items || []} />
      <JobListPaginationContainer
        totalCount={totalFilteredCount}
        siblingCount={1}
        pageSize={10}
      />
    </main>
  );
}
