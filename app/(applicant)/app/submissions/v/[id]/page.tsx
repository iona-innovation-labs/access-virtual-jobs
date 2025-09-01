import { notFound } from "next/navigation";

import JobHeader from "@/components/submissions/job/job-header";
import { getJobApplicationWithJobDetails } from "@/lib/api/jobs";
import JobContent from "@/components/submissions/job/job-contents";

export default async function ViewJobSubmission({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const fetchedJobApplication = await getJobApplicationWithJobDetails(id);

  if (!fetchedJobApplication) {
    return notFound();
  }

  return (
    <div className="h-fit overflow-auto p-6 bg-background rounded-lg w-full mx-auto">
      <JobHeader
        jobApplication={{
          title: fetchedJobApplication.job!.title ?? "Untitled Position",
          submittedAt: fetchedJobApplication.submittedAt,
        }}
      />

      <JobContent jobApplicationDetails={fetchedJobApplication} />
    </div>
  );
}
