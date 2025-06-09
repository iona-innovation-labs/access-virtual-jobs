import { notFound } from "next/navigation";

import { AppRouterWithNormalParamsWithId } from "@/types/general";
import JobHeader from "@/components/submissions/job/job-header";
import { getJobApplicationWithJobDetails } from "@/lib/api/jobs";
import JobContent from "@/components/submissions/job/job-contents";

export default async function ViewJobSubmission({
  params,
}: AppRouterWithNormalParamsWithId) {
  const fetchedJobApplication = await getJobApplicationWithJobDetails(
    params?.id || ""
  );

  if (!fetchedJobApplication) {
    return notFound();
  }

  return (
    <div className="h-fit overflow-auto p-6 bg-white rounded-lg w-full mx-auto">
      <JobHeader
        jobApplication={{
          title: fetchedJobApplication.job.title,
          submittedAt: fetchedJobApplication.submittedAt,
        }}
      />

      <JobContent jobApplicationDetails={fetchedJobApplication} />
    </div>
  );
}
