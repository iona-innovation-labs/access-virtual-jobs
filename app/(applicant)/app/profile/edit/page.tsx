"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import UploadFileForm from "@/components/profile/upload-files-form";
import { ProfileNav } from "@/components/profile/profile-nav";
import EditProfile from "@/components/profile/edit-tab/preferences";
import VerificationForm from "@/components/profile/verification-form";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const active = searchParams.get("active");
    setActiveTab(active || "profile");
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/app/profile/edit?active=${tab}`);
  };

  return (
    <div className="px-[5%] mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 gap-4 flex flex-col">
          <ProfileNav handleTabChange={handleTabChange} activeTab={activeTab} />
        </div>

        <div className="lg:col-span-3">
          <div>
            {activeTab === "profile" && <EditProfile />}
            {activeTab === "verification" && <VerificationForm />}
            {activeTab === "files" && <UploadFileForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
