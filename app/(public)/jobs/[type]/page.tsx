import JobHeader from "@/components/jobs/job-header";
import JobFilter from "@/components/jobs/job-filter";
import { getJobs } from "@/lib/api/jobs";
import { JobList } from "@/components/jobs/job-list";
import { JobListPaginationContainer } from "@/components/jobs/joblist-pagination-container";
import Cta from "@/components/landing/cta";
import { Metadata } from "next";

// interface SearchParams {
//   q?: string;
//   page?: string;
//   location?: string;
//   jobType?: string;
//   salary?: string;
//   experience?: string;
//   remote?: string;
//   [key: string]: string | string[] | undefined;
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const type = decodeURIComponent(resolvedParams.type)
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return {
    title: `${type} Jobs - Find Your Next Career Opportunity`,
    description: `Discover the latest ${type} job opportunities. Browse through hundreds of ${type} positions and find your perfect career match.`,
    keywords: `${type} jobs, ${type} careers, ${type} positions, job search, employment`,
    openGraph: {
      title: `${type} Jobs - Find Your Next Career Opportunity`,
      description: `Discover the latest ${type} job opportunities. Browse through hundreds of ${type} positions and find your perfect career match.`,
      type: "website",
    },
  };
}

export default async function JobsPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{
    page?: string;
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const type = decodeURIComponent(resolvedParams.type)
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const page = parseInt(resolvedSearchParams?.page as string, 10) || 1;
  const offset = (page - 1) * 10;

  const positions = await getJobs(
    {
      offset,
      sort_by: "created_on",
      sort_desc: true,
      limit: 10,
      filters: { "job-posting-status": 3 },
    },
    type
  );

  const actualItemsCount = positions?.items?.length || 0;
  const pageSize = 10;

  let totalFilteredCount = 0;
  if (positions?.success) {
    if (actualItemsCount < pageSize) {
      totalFilteredCount = (page - 1) * pageSize + actualItemsCount;
    } else {
      const minimumTotal = (page - 1) * pageSize + actualItemsCount;
      totalFilteredCount = Math.max(positions.total, minimumTotal);
    }
  }

  return (
    <div className="mx-auto pt-8">
      <JobHeader
        isPublic={true}
        isSpecific={true}
        heading={`${type} Jobs`}
        description={`Find the latest ${type} job listings here`}
      />
      <JobFilter isPublic={true} />
      <JobList positions={positions?.items || []} isPublic={true} />
      <JobListPaginationContainer
        totalCount={totalFilteredCount}
        pageSize={10}
      />
      <Cta />
    </div>
  );
}
