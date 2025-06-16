"use client";

import { PersonalInfoSection } from "@/components/profile/edit-section/PersonalInfoSection";
import { useUserInfo } from "@/hooks/use-user-info";
import JobPreferencesView from "@/components/profile/overview-tab/job-preference";
import { useProfile } from "@/hooks/use-profile";
import { Card } from "@/components/ui/card";
import ProfileDescriptionView from "@/components/profile/overview-tab/profile-description";
import ProfessionalProfileView from "@/components/profile/overview-tab/professional-profile";
import PrescreeningQuestionsView from "@/components/profile/overview-tab/pre-screening";
import AssessmentContentView from "@/components/profile/overview-tab/assessment";
import TechnicalSetupView from "@/components/profile/overview-tab/technical";
import AdditionalInformationView from "@/components/profile/overview-tab/additional-information";

const PersonalInfoSkeleton = () => (
  <Card className="p-6 animate-pulse">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-300 rounded w-32 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-40 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
      </div>
    </div>
  </Card>
);

const SectionSkeleton = ({ height = "h-32" }) => (
  <Card className={`p-6 animate-pulse ${height}`}>
    <div className="space-y-4">
      <div className="h-5 bg-gray-300 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </Card>
);

const ProfileSkeleton = () => (
  <div className="grid grid-cols-1 w-full lg:grid-cols-4 gap-8 px-[5%] mx-auto">
    <div className="lg:col-span-4 gap-4 flex flex-col">
      <PersonalInfoSkeleton />
    </div>

    <div className="lg:col-span-4 flex flex-col space-y-4">
      <SectionSkeleton height="h-24" />
      <SectionSkeleton height="h-32" />
      <SectionSkeleton height="h-40" />
      <SectionSkeleton height="h-36" />
      <SectionSkeleton height="h-28" />
      <SectionSkeleton height="h-32" />
      <SectionSkeleton height="h-24" />
    </div>
  </div>
);

export default function ProfilePage() {
  const { userInfo, isLoading: userLoading } = useUserInfo();
  const {
    profile,
    professionalProfile,
    loading: profileLoading,
  } = useProfile();

  const isLoading = userLoading || profileLoading;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 w-full gap-8 px-[5%] mx-auto">
      <div className="lg:col-span-4 gap-4 flex flex-col">
        <PersonalInfoSection
          profileData={profile}
          userInfo={userInfo}
          isUserLoading={userLoading}
        />
      </div>

      <div className="lg:col-span-4 flex flex-col space-y-4">
        <ProfileDescriptionView
          data={{
            profileDescription: profile?.profileDescription || "",
          }}
        />
        <JobPreferencesView
          data={{
            jobSearchStatus: profile?.jobSearchStatus,
            jobType: profile?.jobType || "",
            isPublicSalary: profile?.isPublicSalary,
            salaryUnit: profile?.salaryUnit,
            desiredSalary: parseFloat(profile?.desiredSalary || "0"),
          }}
        />
        <ProfessionalProfileView data={professionalProfile} />
        <PrescreeningQuestionsView
          data={{
            whyFit: profile?.whyFit,
            whatStrengths: profile?.whatStrengths,
            whatNeedImprovement: profile?.whatNeedImprovement,
          }}
        />
        <AssessmentContentView
          data={{
            assessmentTests: profile?.assessmentTests || [],
            contentLinks: profile?.contentLinks || [],
          }}
        />
        <TechnicalSetupView
          data={{
            internetProvider: profile?.internetProvider,
            numberOfMonitors: profile?.numberOfMonitors,
            numberOfExperience: profile?.numberOfExperience,
            hasPaypal: profile?.hasPaypal,
          }}
        />
        <AdditionalInformationView
          data={
            profile
              ? {
                  numberOfChildren: profile.numberOfChildren,
                  workSamples: profile.workSamples,
                  howHear: profile.howHear,
                  referrer: profile.referrer,
                }
              : null
          }
        />
      </div>
    </div>
  );
}
