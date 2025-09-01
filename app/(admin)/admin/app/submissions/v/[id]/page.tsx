import { notFound } from "next/navigation";

import AdminJobApplicationContent from "@/components/admin/components/admin-job-application-content";
import AdminJobApplicationHeader from "@/components/admin/components/admin-job-application-header";
import { getAdminJobApplicationWithDetails } from "@/lib/api/admin-jobs";

export default async function AdminViewJobApplication({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const jobApplication = await getAdminJobApplicationWithDetails(id);

  if (!jobApplication) {
    return notFound();
  }

  return (
    <div className="h-fit overflow-auto p-6 bg-background rounded-lg w-full mx-auto">
      <AdminJobApplicationHeader jobApplication={jobApplication} />
      <AdminJobApplicationContent jobApplication={jobApplication} />
    </div>
  );
}
