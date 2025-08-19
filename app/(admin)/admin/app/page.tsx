import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function AdminAppRootPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  } else {
    redirect("/admin/app/dashboard");
  }
}
