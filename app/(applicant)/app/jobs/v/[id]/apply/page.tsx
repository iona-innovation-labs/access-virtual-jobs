import ProfilePageClient from "@/components/profile/profile-page";
import { getJobPost } from "@/lib/api/jobs";
// import { getUser } from "@/database/queries/users";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const post = await getJobPost(id);

  return {
    title: post ? `Applying to ${post.item?.title}` : "View Job",
  };
}


export default async function Apply() {
    // const result = await getUser(2);

    return <ProfilePageClient />;
}
