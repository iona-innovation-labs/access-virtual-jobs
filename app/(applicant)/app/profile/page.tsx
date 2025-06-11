"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import EditProfileForm from "@/components/profile/edit-profile-form";
import UploadFileForm from "@/components/profile/upload-files-form";
import { MobileProfileNav, ProfileNav } from "@/components/profile/profile-nav";
import { PersonalInfoSection } from "@/components/profile/edit-section/PersonalInfoSection";
import { useUserInfo } from "@/hooks/use-user-info";
import OverviewTab from "@/components/profile/overview-profile";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userInfo, isLoading } = useUserInfo();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const active = searchParams.get("active");
    setActiveTab(active || "profile");
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/app/profile?active=${tab}`);
  };

  console.log("USER: ", userInfo);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-[5%] mx-auto">
      <div className="lg:col-span-4 gap-4 flex flex-col">
        <PersonalInfoSection
          userInfo={userInfo}
          isUserLoading={isLoading}
          showEditButton={false}
        />
      </div>
      <div className="lg:col-span-1 gap-4 flex flex-col">
        <ProfileNav handleTabChange={handleTabChange} activeTab={activeTab} />
      </div>

      <div className="lg:col-span-3">
        <MobileProfileNav
          handleTabChange={handleTabChange}
          activeTab={activeTab}
        />
        <div>
          {/*<NeedHelp />*/}
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "profile" && <EditProfileForm />}
          {activeTab === "files" && <UploadFileForm />}
        </div>
      </div>
    </div>
  );
}
