import { ReactNode } from "react";
import { Metadata } from "next";
import { ProfileTabProvider } from "@/context/profile-tab-context";
import { ProfileDetailsProvider } from "@/context/profile-details-context";
import { ProfileFilesProvider } from "@/context/profile-files-context";
import ProfileNav from "@/components/profile/edit-profile-header";

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
          <div className="min-h-screen bg-background">
            <div className="py-12 flex flex-col items-start justify-start">
              <ProfileNav />
              {children}
            </div>
          </div>
        </ProfileFilesProvider>
      </ProfileDetailsProvider>
    </ProfileTabProvider>
  );
}
