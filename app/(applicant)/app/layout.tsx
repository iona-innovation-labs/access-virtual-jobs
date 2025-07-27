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
    "Applicant portal for job seekers that applies and manage job applications - Access Virtual Jobs",

  openGraph: {
    title: "Applicant Portal - Access Virtual Jobs",
    description:
      "Applicant portal for job seekers that applies and manage job applications - Access Virtual Jobs",
    type: "website",
    url: "https://www.accessvirtualJobs.com", // Replace with your actua l URL
    images: "/opengraph-image.jpg", // Replace with your actual image URL
  },
  twitter: {
    card: "summary_large_image",
    title: "Applicant Portal - Access Virtual Jobs",
    description:
      "Applicant portal for job seekers that applies and manage job applications - Access Virtual Jobs",
    images: "/twitter-image.jpg", // Replace with your actual image URL
  },
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
