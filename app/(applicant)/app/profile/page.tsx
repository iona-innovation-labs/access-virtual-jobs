"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import EditProfileForm from "@/components/profile/edit-profile-form";
import UploadFileForm from "@/components/profile/upload-files-form";
// import ProfileCard from "@/components/profile/profile-overview-card";
// import ProfileOverviewDialog from "@/components/profile/profile-overview-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    router.push(`/app/profile?active=${tab}`);
  };

  return (
    <div className="flex flex-col items-center mb-12 w-full">
      <Tabs
        className="w-full max-w-2xl"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="flex justify-start mb-12 w-full">
          {/* <TabsTrigger
              value="overview"
              className="text-md text-gray-700 data-[state=active]:border-gray-700 rounded-none border-white border-b-2"
            >
              Overview
            </TabsTrigger> */}
          <TabsTrigger
            value="profile"
            className="text-md text-gray-700 data-[state=active]:border-gray-700 rounded-none border-white border-b-2"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="files"
            className="text-md text-gray-700 data-[state=active]:border-gray-700 rounded-none border-white border-b-2"
          >
            Files
          </TabsTrigger>
        </TabsList>
        {/* <TabsContent value="overview">
            <ProfileCard profile={profileData} />
          </TabsContent> */}
        <TabsContent value="profile">
          <EditProfileForm />
        </TabsContent>
        <TabsContent value="files">
          <UploadFileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
