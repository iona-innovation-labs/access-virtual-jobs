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
import {
  JOB_CATEGORIES,
  JOB_SEARCH_STATUS,
  JOB_TYPES,
  SALARY_UNIT,
} from "@/lib/constants";

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
      <div id="job_preference_section">
        <JobPreferencesSection
          initialData={{
            isPublicSalary: profile?.isPublicSalary,
            jobSearchStatus:
              (profile?.jobSearchStatus as (typeof JOB_SEARCH_STATUS)[number]) ??
              "ready_for_interview",
            jobType:
              (profile?.jobType as (typeof JOB_TYPES)[number]) ?? "contract",
            jobCategory:
              (profile?.jobCategory as (typeof JOB_CATEGORIES)[number]) ??
              "office_administration",
            salaryUnit:
              (profile?.salaryUnit as (typeof SALARY_UNIT)[number]) ?? "PHP",
            desiredSalary: parseFloat(profile?.desiredSalary ?? "0"),
          }}
          loading={false}
        />
      </div>

      <div id="contact_section">
        <UserProfileSection />
      </div>

      <ProfileDescriptionSection
        initialData={{
          profileDescription: profile?.profileDescription || "",
        }}
        loading={loading}
      />

      <div id="professional_profile_section">
        <ProfessionalProfileSection
          initialData={
            (professionalProfile ?? {}) as Partial<ProfessionalProfileFormData>
          }
          loading={false}
        />
      </div>

      <div id="contact_section">
        <ContactInformationSection
          loading={loading}
          initialData={{
            address: profile?.address,
            whatsappId: profile?.whatsappId,
            phones: profile?.phones,
            emails: profile?.emails,
          }}
        />
      </div>

      <div id="pre_screening_section">
        <PrescreeningQuestionsSection
          initialData={{
            whyFit: profile?.whyFit || "",
            whatStrengths: profile?.whatStrengths || "",
            whatNeedImprovement: profile?.whatNeedImprovement || "",
          }}
          loading={loading}
        />
      </div>
      <div id="assessment_section">
        <AssessmentContentSection
          initialData={{
            assessmentTests: profile?.assessmentTests || [{ link: "" }],
            contentLinks: profile?.contentLinks || [{ link: "" }],
          }}
          loading={loading}
        />
      </div>

      <div id="technical_setup_section">
        <TechnicalSetupSection
          initialData={{
            internetProvider: profile?.internetProvider || "",
            numberOfMonitors: profile?.numberOfMonitors || "1",
            numberOfExperience: profile?.numberOfExperience || "0",
            hasPaypal: (profile?.hasPaypal ?? "no") as "yes" | "no",
          }}
          loading={loading}
        />
      </div>

      <div id="additional_info_section">
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
    </div>
  );
}
