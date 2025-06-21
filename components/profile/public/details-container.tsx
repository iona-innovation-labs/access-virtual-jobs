import React from "react";
import ProfileDescriptionView from "../overview-tab/profile-description";
import JobPreferencesView from "../overview-tab/job-preference";
import ProfessionalProfileView from "../overview-tab/professional-profile";
import PrescreeningQuestionsView from "../overview-tab/pre-screening";
import AssessmentContentView from "../overview-tab/assessment";
import AdditionalInformationView from "../overview-tab/additional-information";

interface Profile {
  userId: string;
  jobTitle?: string;
  address?: string;
  whatsappId?: string;
  jobSearchStatus?: string;
  desiredSalary?: string;
  jobType?: string;
  linkedInLink?: string;
  numberOfExperience?: string;
  whyFit?: string;
  whatStrengths?: string;
  whatNeedImprovement?: string;
  profileDescription?: string;
  instagramLink?: string;
  xLink?: string;
  educationStatus?: string;
  
  // Related data arrays
  portfolioLinks: Array<any>;
  skills: Array<any>;
  emails: Array<any>;
  contentLinks: Array<any>;
  assessmentTests: Array<any>;
  workSamples: Array<any>;
  workHistory: Array<any>;
  certifications: Array<any>;
  education: Array<any>;
  
  // Explicitly excluded/undefined fields
  dateOfBirth: undefined;
  numberOfChildren: undefined;
  hasPaypal: undefined;
  internetProvider: undefined;
  numberOfMonitors: undefined;
  howHear: undefined;
  referrer: undefined;
  phones: Array<never>; // Empty array
  fileUploads: Array<never>; // Empty array
}

interface ProfileDetailsContainerProps {
  profile: Profile;
  loading?: boolean;
  children?: React.ReactNode;
}

export const ProfileDetailsContainer = ({ 
  profile, 
  loading = false, 
  children 
}: ProfileDetailsContainerProps) => {
  
  if (loading) {
    return (
      <div className="w-full space-y-6">
        {/* Loading skeleton for multiple cards */}
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div 
            key={index}
            className="bg-card border border-border rounded-lg p-6 animate-pulse"
          >
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
        <ProfileDescriptionView
          data={{
            profileDescription: profile?.profileDescription,
          }}
        />
        <JobPreferencesView
          data={{
            jobSearchStatus: profile.jobSearchStatus,
            jobType: profile.jobType,
            isPublicSalary: false
          }}
        />
        <ProfessionalProfileView
          data={{
            jobTitle: profile.jobTitle,
            numberOfExperience: profile.numberOfExperience,
            educationStatus: profile.educationStatus,
            instagramLink: profile.instagramLink,
            xLink: profile.xLink,
            portfolioLinks: profile.portfolioLinks,
            skills: profile.skills
          }}
        />
        <PrescreeningQuestionsView
          data={{
            whyFit: profile.whyFit,
            whatNeedImprovement: profile.whatNeedImprovement,
            whatStrengths: profile.whatStrengths
          }}
        />
        <AssessmentContentView
          data={{
            assessmentTests: profile?.assessmentTests,
            contentLinks: profile?.contentLinks
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
          isPublic={true}
        />

      {/* Custom children components can be added here */}
      {children}
    </div>
  );
};

export default ProfileDetailsContainer;