// import AppliedJobs from "@/components/overview/applied-jobs";
// import Profile from "@/components/overview/profile";
// import Stepper from "@/components/overview/progress";
import AppliedJobs from "@/components/overview/applied-jobs";
import Profile from "@/components/overview/profile";
import Stepper from "@/components/overview/progress";
import RecommendedJobs from "@/components/overview/recommended-jobs";
import { getJobs } from "@/lib/api/jobs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Here are the latest updates on the Access Virtual Jobs with recommended jobs",
};

export default async function Overview() {
  const positionsResponse = await getJobs(
    {
      offset: 0,
      sort_by: "created_on",
      sort_desc: true,
      limit: 3,
      filters: {
        "job-posting-status": 3,
      },
    },
    undefined,
    true
  );

  const positions = Array.isArray(positionsResponse?.items)
    ? positionsResponse.items
    : [];

  return (
    <div className="h-fit overflow-auto flex items-center justify-center">
      <div className="container flex flex-col mt-4 gap-4 px-4 mb-24">
        <Stepper />
        <Profile />
        <RecommendedJobs positions={positions || []} />
        <AppliedJobs />
      </div>
    </div>
  );
}
