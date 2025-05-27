import { Metadata } from "next";
import { ISearchParams } from "@/types/jobs";
import { getJobs } from "@/lib/api/jobs";

export const metadata: Metadata = {
  title: "Explore Jobs",
  description: "Explore and apply for jobs through Applicant portal",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PublicJobsPage({ 
  searchParams 
}: { 
  searchParams: Promise<ISearchParams> 
}) {
  const resolvedSearchParams = await searchParams;

  const positions = await getJobs({
      sort_by: "created_on",
      sort_desc: true,
      limit: 10,
      filters: { "job-posting-status": 3 }
    },
    resolvedSearchParams.toString()
  );

  console.log("positions", positions);

  return (
    <h1>Hello</h1>
  );
}