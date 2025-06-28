"use client";

import React from "react";
import { useProfile } from "@/hooks/use-profile";
import { useUserInfo } from "@/hooks/use-user-info";
import { Card } from "@/components/ui/card";

// Import view components (you'll need to create these or import existing ones)
import ProfileDescriptionView from "@/components/profile/overview-tab/profile-description";
import ProfessionalProfileView from "@/components/profile/overview-tab/professional-profile";
import PrescreeningQuestionsView from "@/components/profile/overview-tab/pre-screening";
import AssessmentContentView from "@/components/profile/overview-tab/assessment";
import TechnicalSetupView from "@/components/profile/overview-tab/technical";
import AdditionalInformationView from "@/components/profile/overview-tab/additional-information";
import ViewFilesForm from "@/components/profile/view-files";

const ReviewSkeleton = () => (
  <div className="w-full space-y-6">
    {[...Array(8)].map((_, i) => (
      <Card key={i} className="p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const ReviewStep = () => {
  const { isLoading: userLoading } = useUserInfo();
  const {
    profile,
    professionalProfile,
    loading: profileLoading,
    error,
  } = useProfile();

  const isLoading = userLoading || profileLoading;

  if (error) {
    return (
      <Card className="mx-auto p-8 text-center">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Error Loading Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-200">
          Failed to load profile data. Please refresh the page.
        </p>
      </Card>
    );
  }

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  return (
    <div className="w-full mx-auto space-y-8 mb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Review Your Application
        </h1>
        <p className="text-muted-foreground">
          Please review all your information before submitting your application
        </p>
      </div>
      {/* Profile Description Section */}
      <div id="review_profile_description">
        <ProfileDescriptionView
          data={{
            profileDescription: profile?.profileDescription || "",
          }}
        />
      </div>

      {/* Professional Profile Section */}
      <div id="review_professional_profile">
        <ProfessionalProfileView data={professionalProfile} />
      </div>

      {/* Pre-screening Questions Section */}
      <div id="review_prescreening_questions">
        <PrescreeningQuestionsView
          data={{
            whyFit: profile?.whyFit,
            whatStrengths: profile?.whatStrengths,
            whatNeedImprovement: profile?.whatNeedImprovement,
          }}
        />
      </div>

      {/* Assessment & Content Section */}
      <div id="review_assessment_content">
        <AssessmentContentView
          data={{
            assessmentTests: profile?.assessmentTests || [],
            contentLinks: profile?.contentLinks || [],
          }}
        />
      </div>

      {/* Technical Setup Section */}
      <div id="review_technical_setup">
        <TechnicalSetupView
          data={{
            internetProvider: profile?.internetProvider,
            numberOfMonitors: profile?.numberOfMonitors,
            numberOfExperience: profile?.numberOfExperience,
            hasPaypal: profile?.hasPaypal,
          }}
        />
      </div>

      {/* Additional Information Section */}
      <div id="review_additional_information">
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

      {/* Files Section */}
      <div id="review_files">
        <ViewFilesForm />
      </div>

      {/* Final Review Notice */}
      <Card className="p-6 bg-muted/50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ready to Submit?
          </h3>
          <p className="text-sm text-muted-foreground">
            Please ensure all information above is accurate and complete. Once
            submitted, you&apos;ll be notified when the employer reviews your
            application.
          </p>
        </div>
      </Card>
    </div>
  );
};
