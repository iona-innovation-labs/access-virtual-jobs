import { Metadata } from "next";
import { getJobs } from "@/lib/api/jobs";
import { JobList } from "@/components/jobs/job-list";
import JobHeader from "@/components/jobs/job-header";
import JobFilter from "@/components/jobs/job-filter";
import { JobListPaginationContainer } from "@/components/jobs/joblist-pagination-container";
import Cta from "@/components/landing/cta";

export const metadata: Metadata = {
  title: "Explore Jobs",
  description: "Explore and apply for jobs through Applicant portal",
};

interface PageSearchParams {
  q?: string;
  [key: string]: string | string[] | undefined;
}

export default async function PublicJobsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const positions = await getJobs(
    {
      offset: (parseInt(resolvedSearchParams.page as string) - 1) * 10,
      sort_by: "created_on",
      sort_desc: true,
      limit: 10,
      filters: { "job-posting-status": 3 },
    },
    resolvedSearchParams.q || ""
  );

  console.log("positions", positions);
  console.log("search query", resolvedSearchParams.q);

  return (
    <div className="mx-auto pt-8">
      {/* Header */}
      <JobHeader
        heading="Latest Job Listings"
        description="Find the latest job listings here"
      />
      <JobFilter />
      <JobList positions={positions?.items || []} isPublic={true} />
      <JobListPaginationContainer
        totalCount={positions?.total || 0}
        pageSize={10}
      />
      <Cta />
    </div>
  );
}
