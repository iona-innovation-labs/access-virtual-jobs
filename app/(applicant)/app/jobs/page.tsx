import { Metadata } from "next";
import { Suspense } from "react";

import { ISearchParams } from "@/types/jobs";
import { getJobsFromUrl } from "@/lib/api/jobs";

import { getBookmarkedJobs, getUserBookmarkCount } from "@/lib/api/bookmarks";

import { JobListPaginationContainer } from "@/components/jobs/joblist-pagination-container";
import { JobList } from "@/components/jobs/job-list";
import JobFilter from "@/components/jobs/job-filter";
import JobHeader from "@/components/jobs/job-header";
import { JobsTabs } from "@/components/jobs/jobs-tab";
import { SavedJobsFilter } from "@/components/jobs/saved-jobs-filter";
import { SavedJobsEmptyState } from "@/components/jobs/saved-jobs-empty-state";
import { JobListSkeleton } from "@/components/jobs/job-list-skeleton";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Explore Jobs",
  description: "Explore and apply for jobs through Applicant portal",
};

// Separate component for explore jobs content
async function ExploreJobsContent({
  searchParams,
}: {
  searchParams: ISearchParams;
}) {
  const urlSearchParams = new URLSearchParams();

  // Add all search parameters except tab
  Object.entries(searchParams).forEach(([key, value]) => {
    if (
      key !== "tab" &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      urlSearchParams.set(key, value.toString());
    }
  });

  // Set pagination
  const page = parseInt(searchParams?.page as string, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  urlSearchParams.set("limit", limit.toString());
  urlSearchParams.set("offset", offset.toString());

  const positions = await getJobsFromUrl(urlSearchParams, true);

  let totalFilteredCount = 0;
  if (positions?.success && positions.pagination) {
    totalFilteredCount = positions.all;
  } else if (positions?.success) {
    totalFilteredCount = positions.total;
  }

  return (
    <>
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <JobFilter isPublic={false} />
      </div>
      <JobList positions={positions?.items || []} />
      <JobListPaginationContainer
        totalCount={totalFilteredCount}
        siblingCount={1}
        pageSize={limit}
      />
    </>
  );
}

// Separate component for saved jobs content
async function SavedJobsContent({
  searchParams,
  userId,
}: {
  searchParams: ISearchParams;
  userId: string;
}) {
  const page = parseInt(searchParams?.page as string, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Get search and sort parameters for saved jobs
  const search = searchParams?.search || "";
  const sortBy = searchParams?.sortBy || "createdAt";
  const sortDesc = searchParams?.sortDesc !== "false";

  const result = await getBookmarkedJobs(
    userId,
    limit,
    offset,
    search,
    sortBy,
    sortDesc
  );

  if (!result.success) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load saved jobs
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SavedJobsFilter />
      </div>
      {result.items.length === 0 ? (
        <SavedJobsEmptyState />
      ) : (
        <>
          <JobList positions={result.items} />
          <JobListPaginationContainer
            totalCount={result.all}
            siblingCount={1}
            pageSize={limit}
          />
        </>
      )}
    </>
  );
}

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();
  const currentTab = resolvedSearchParams?.tab || "explore";

  // Get bookmark count for badge
  let bookmarkCount = 0;
  if (session?.user?.id) {
    const countResult = await getUserBookmarkCount(session.user.id);
    if (countResult.success) {
      bookmarkCount = countResult.count;
    }
  }

  return (
    <main className="w-full mx-auto bg-background overflow-hidden">
      <JobHeader
        heading="Jobs"
        description="Explore and apply for jobs"
        isPublic={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <JobsTabs
          currentTab={currentTab}
          bookmarkCount={bookmarkCount}
          isLoggedIn={!!session?.user?.id}
        />
      </div>

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {currentTab === "saved" ? (
          session?.user?.id ? (
            <Suspense
              key={`saved-${JSON.stringify(resolvedSearchParams)}`}
              fallback={<JobListSkeleton />}
            >
              <SavedJobsContent
                searchParams={resolvedSearchParams}
                userId={session.user.id}
              />
            </Suspense>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Please log in to view saved jobs.
              </p>
            </div>
          )
        ) : (
          <Suspense
            key={`explore-${JSON.stringify(resolvedSearchParams)}`}
            fallback={<JobListSkeleton />}
          >
            <ExploreJobsContent searchParams={resolvedSearchParams} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
