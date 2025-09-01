import { getJobPost } from "@/lib/api/jobs";
import AdminJobView from "@/components/admin/components/admin-job-view";

export default async function AdminViewJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  console.log(id);
  const jobResult = await getJobPost(id);
  return <AdminJobView job={jobResult?.item || null} />;
}
