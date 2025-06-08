import { ReactNode } from "react";
import { Metadata } from "next";
import { ProfileTabProvider } from "@/context/profile-tab-context";
import { ProfileDetailsProvider } from "@/context/profile-details-context";
import { ProfileFilesProvider } from "@/context/profile-files-context";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Edit your universal profile that you will use to apply for jobs",
};

interface LayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: LayoutProps) {
  return (
    <ProfileTabProvider>
      <ProfileDetailsProvider>
        <ProfileFilesProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="py-12 flex items-start justify-start">
              {children}
            </div>
          </div>
        </ProfileFilesProvider>
      </ProfileDetailsProvider>
    </ProfileTabProvider>
  );
}
