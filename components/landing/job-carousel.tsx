import { getJobs } from "@/lib/api/jobs";
import JobCarouselClient from "./job-carousel-list";

export default async function JobCarouselList() {
  const positions = await getJobs(
    {
      sort_by: "created_on",
      sort_desc: true,
      limit: 10,
      filters: { "job-posting-status": 3 },
    },
    ""
  );

  // Only render if there are at least 10 jobs
  if (!positions?.items || positions.items.length < 10) {
    return null;
  }

  // Pass the data to the client component
  return (
    <>
      <JobCarouselClient jobs={positions.items} />
    </>
  );
}
