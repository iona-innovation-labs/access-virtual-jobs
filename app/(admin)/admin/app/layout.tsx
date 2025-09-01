import { Metadata } from "next";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import AdminAppShell from "@/components/admin/layout/admin-app-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin Portal - Access Virtual Jobs",
    default: "Admin Portal - Access Virtual Jobs",
  },
  description: "Admin Portal",
};

export default async function AppRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  await requireAdmin();
  return (
    <>
      <AdminAppShell>{children}</AdminAppShell>
    </>
  );
}
