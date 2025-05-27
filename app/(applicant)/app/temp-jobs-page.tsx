// app/app/jobs/page.tsx - Authenticated Jobs Page  
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BrowseJobsPage from "@/components/browse-jobs-page";

export default async function AuthenticatedJobsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  return <BrowseJobsPage isPublic={false} userId={session.user.id} />;
}