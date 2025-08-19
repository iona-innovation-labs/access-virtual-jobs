import { getJobPost } from "@/lib/api/jobs";
import EditJobForm from "@/components/admin/components/edit-job-form";
import { notFound } from "next/navigation";

export default async function AdminEditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const jobResult = await getJobPost(id);
  if (!jobResult?.item) return notFound();
  return <EditJobForm job={jobResult.item} />;
}
