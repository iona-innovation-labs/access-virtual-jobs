"use client";

import React from "react";
import { Card } from "@/components/ui/card";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { JobPreferencesSection } from "./sections/job-preferences";
import {
  ProfessionalProfileSection,
  ProfessionalProfileFormData,
} from "./sections/professional-information";
import { useProfile } from "@/hooks/use-profile";
import { ProfileDescriptionSection } from "./sections/profile-description";
import { PrescreeningQuestionsSection } from "./sections/prescreening-questions";
import { AssessmentContentSection } from "./sections/assessment";
import { TechnicalSetupSection } from "./sections/technical";
import { AdditionalInformationSection } from "./sections/additional";
import { UserProfileSection } from "./sections/user-detail";
import { ContactInformationSection } from "./sections/contact";

export default function EditProfile() {
  const { profile, professionalProfile, loading, error } = useProfile();

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Error Loading Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-200">
          Failed to load profile data. Please refresh the page.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="mx-auto p-8">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Professional Information */}
      <JobPreferencesSection
        initialData={{
          isPublicSalary: profile?.isPublicSalary,
          jobSearchStatus: (profile?.jobSearchStatus ?? "actively_looking") as
            | "ready_for_interview"
            | "actively_looking"
            | "passively_looking"
            | "not_looking",
          jobType: (profile?.jobType ?? "contract") as
            | "full_time"
            | "part_time"
            | "contract"
            | "freelance"
            | "internship",
          salaryUnit: (profile?.salaryUnit ?? "PHP") as "PHP" | "USD",
          desiredSalary: parseFloat(profile?.desiredSalary ?? "0"),
        }}
        loading={false}
      />
      <ProfileDescriptionSection
        initialData={{ profileDescription: profile?.profileDescription || "" }}
        loading={loading}
      />
      <UserProfileSection />
      <ProfessionalProfileSection
        initialData={
          (professionalProfile ?? {}) as Partial<ProfessionalProfileFormData>
        }
        loading={false}
      />
      <ContactInformationSection
        loading={loading}
        initialData={{
          address: profile?.address,
          whatsappId: profile?.whatsappId,
          dateOfBirth:
            profile?.dateOfBirth instanceof Date
              ? profile.dateOfBirth.toISOString().split("T")[0]
              : (profile?.dateOfBirth ?? undefined),
          phones: profile?.phones,
          emails: profile?.emails,
        }}
      />
      <PrescreeningQuestionsSection
        initialData={{
          whyFit: profile?.whyFit || "",
          whatStrengths: profile?.whatStrengths || "",
          whatNeedImprovement: profile?.whatNeedImprovement || "",
        }}
        loading={loading}
      />
      <AssessmentContentSection
        initialData={{
          assessmentTests: profile?.assessmentTests || [{ link: "" }],
          contentLinks: profile?.contentLinks || [{ link: "" }],
        }}
        loading={loading}
      />
      <TechnicalSetupSection
        initialData={{
          internetProvider: profile?.internetProvider || "",
          numberOfMonitors: profile?.numberOfMonitors || "1",
          numberOfExperience: profile?.numberOfExperience || "0",
          hasPaypal: (profile?.hasPaypal ?? "no") as "yes" | "no",
        }}
        loading={loading}
      />
      <AdditionalInformationSection
        initialData={{
          numberOfChildren: profile?.numberOfChildren || "0",
          workSamples: profile?.workSamples || [{ link: "" }],
          howHear: profile?.howHear || "OnlineJobsPH",
          referrer: profile?.referrer || "",
        }}
        loading={loading}
      />
    </div>
  );
}
