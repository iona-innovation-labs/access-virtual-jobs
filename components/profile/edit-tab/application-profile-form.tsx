"use client";

import React from "react";
import { useProfile } from "@/hooks/use-profile";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Import all sections (excluding job preferences)
import { UserProfileSection } from "./sections/user-detail";
import { ProfileDescriptionSection } from "./sections/profile-description";
import { ProfessionalProfileSection, ProfessionalProfileFormData } from "./sections/professional-information";
import { ContactInformationSection } from "./sections/contact";
import { PrescreeningQuestionsSection } from "./sections/prescreening-questions";
import { AssessmentContentSection } from "./sections/assessment";
import { TechnicalSetupSection } from "./sections/technical";
import { AdditionalInformationSection } from "./sections/additional";

export default function ApplicationProfileForm() {
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
      {/* Section 1: User Profile Section */}
      <div id="user_profile_section">
        <UserProfileSection />
      </div>

      {/* Section 2: Profile Description Section */}
      <div id="profile_description_section">
        <ProfileDescriptionSection
          initialData={{
            profileDescription: profile?.profileDescription || "",
          }}
          loading={loading}
        />
      </div>

      {/* Section 3: Professional Profile Section */}
      <div id="professional_profile_section">
        <ProfessionalProfileSection
          initialData={
            (professionalProfile ?? {}) as Partial<ProfessionalProfileFormData>
          }
          loading={loading}
        />
      </div>

      {/* Section 4: Contact Information Section */}
      <div id="contact_information_section">
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

      {/* Section 5: Pre-screening Questions Section */}
      <div id="prescreening_questions_section">
        <PrescreeningQuestionsSection
          initialData={{
            whyFit: profile?.whyFit || "",
            whatStrengths: profile?.whatStrengths || "",
            whatNeedImprovement: profile?.whatNeedImprovement || "",
          }}
          loading={loading}
        />
      </div>

      {/* Section 6: Assessment & Content Section */}
      <div id="assessment_content_section">
        <AssessmentContentSection
          initialData={{
            assessmentTests: profile?.assessmentTests || [{ link: "" }],
            contentLinks: profile?.contentLinks || [{ link: "" }],
          }}
          loading={loading}
        />
      </div>

      {/* Section 7: Technical Setup Section */}
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

      {/* Section 8: Additional Information Section */}
      <div id="additional_information_section">
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