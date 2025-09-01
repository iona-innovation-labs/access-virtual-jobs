import { Metadata } from "next";

import ApplicationShell from "@/components/layout/app-shell";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { OnboardingModal } from "@/components/on-boarding/on-boarding-modal";
import { requireJobSeeker } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: {
    template: "%s | Applicant Portal - Access Virtual Jobs",
    default: "Applicant Portal - Access Virtual Jobs",
  },
  description:
    "Find your next remote work & VA job here at Access Virtual Jobs",
};

export default async function AppRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  await requireJobSeeker();
  return (
    <>
      <ApplicationShell>{children}</ApplicationShell>
      <OnboardingModal />
    </>
  );
}
