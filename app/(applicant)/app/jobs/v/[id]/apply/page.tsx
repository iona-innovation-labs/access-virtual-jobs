import ProfilePageClient from "@/components/profile/profile-page";
import { getJobPost } from "@/lib/api/jobs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const post = await getJobPost(id);

  return {
    title: post ? `Applying to ${post.item?.title}` : "View Job",
  };
}

export default async function Apply() {
  // const result = await getUser(2);

  return <ProfilePageClient />;
}
