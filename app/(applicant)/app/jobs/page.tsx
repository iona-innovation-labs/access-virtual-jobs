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

  const totalFilteredCount = positions?.success ? positions.total : 0;

  return (
    <main className="w-full mx-auto bg-white overflow-hidden">
      <JobHeader
        heading="Explore Jobs"
        description="Explore and apply for jobs"
        isPublic={false}
      />
      <div className="mt-12"></div>
      <JobFilter />
      <JobList positions={positions?.items || []} />
      <JobListPaginationContainer
        totalCount={totalFilteredCount}
        siblingCount={1}
        pageSize={10}
      />
    </main>
  );
}
