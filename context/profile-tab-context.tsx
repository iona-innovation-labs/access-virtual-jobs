"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

// Types
export interface IProfileResponse {
  ok: boolean;
  profile: {
    id: number;
    userId: number;
    jobTitle: string;
    whyFit: string;
    whatStrengths: string;
    whatNeedImprovement: string;
    address: string;
    whatsappId: string;
    dateOfBirth: string;
    hasPaypal: string;
    numberOfChildren: string;
    internetProvider: string;
    numberOfMonitors: string;
    numberOfExperience: string;
    salaryUnit: string;
    desiredSalary: string;
    howHear: string;
    referrer?: string;
    jobType?: string;
    jobCategory?: string;
    availability?: string;
    education?: string;
    createdAt?: string;
  };
  phones: { type: string; number: string }[];
  emails: { type: string; address: string }[];
  contentLinks: { link: string }[];
  assessmentTests: { link: string }[];
  workSamples: { link: string }[];
  fileUploads: {
    id: number;
    profileId: number;
    type: string;
    link: string;
    podioFileId: string;
    cloudinaryId: string;
    filename: string;
    createdAt: string;
  }[];
}

export type TabName = "Profile" | "Files" | "Verification" | "Review";

export interface StepCompletionStatus {
  Profile: boolean;
  Files: boolean;
  Verification: boolean;
  Review: boolean;
}

type ProfileTabContextType = {
  currentTab: TabName;
  setCurrentTab: (tab: TabName) => void;
  jobSubmissionId: string | null;
  setJobSubmissionId: (id: string | null) => void;
  stepCompletionStatus: StepCompletionStatus;
  setStepCompletionStatus: (status: StepCompletionStatus) => void;
  validateStepCompletion: (step: TabName) => Promise<boolean>;
  isStepAccessible: (step: TabName) => boolean;
  refreshStepCompletion: () => Promise<void>;
  isLoading: boolean;
};

const ProfileTabContext = createContext<ProfileTabContextType | undefined>(
  undefined
);

export function useProfileTabContext() {
  const context = useContext(ProfileTabContext);
  if (!context) {
    throw new Error(
      "useProfileTabContext must be used within a ProfileTabProvider"
    );
  }
  return context;
}

// Required file types for Files step
const REQUIRED_FILE_TYPES = [
  "resume",
  "professional_picture",
  "internet",
  "computer_specs",
  "work_station",
];

export function ProfileTabProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<TabName>("Profile");
  const [jobSubmissionId, setJobSubmissionId] = useState<string | null>(null);
  const [stepCompletionStatus, setStepCompletionStatus] =
    useState<StepCompletionStatus>({
      Profile: false,
      Files: false,
      Verification: true, // Always true since it's just a validation step
      Review: false,
    });
  const [isLoading, setIsLoading] = useState(false);

  // Validate Profile step completion
  const validateProfileStep = (data: IProfileResponse): boolean => {
    const { profile, phones, emails, contentLinks, assessmentTests } = data;

    // Check required profile fields
    const requiredProfileFields = [
      profile.jobTitle,
      profile.numberOfExperience,
      profile.whyFit,
      profile.whatStrengths,
      profile.whatNeedImprovement,
      profile.address,
      profile.internetProvider,
      profile.numberOfMonitors,
      profile.hasPaypal,
      profile.numberOfChildren,
      profile.howHear,
    ];

    const hasRequiredFields = requiredProfileFields.every(
      (field) => field && field.trim() !== ""
    );

    // Check required arrays
    const hasPhones = phones && phones.length > 0;
    const hasEmails = emails && emails.length > 0;
    const hasAssessmentOrContent =
      (assessmentTests && assessmentTests.length > 0) ||
      (contentLinks && contentLinks.length > 0);

    return (
      hasRequiredFields && hasPhones && hasEmails && hasAssessmentOrContent
    );
  };

  // Validate Files step completion
  const validateFilesStep = (data: IProfileResponse): boolean => {
    const { fileUploads } = data;

    if (!fileUploads || fileUploads.length === 0) {
      return false;
    }

    // Check if all required file types are uploaded
    const uploadedTypes = fileUploads.map((file) => file.type);
    return REQUIRED_FILE_TYPES.every((requiredType) =>
      uploadedTypes.includes(requiredType)
    );
  };

  // Validate specific step completion using API
  const validateStepCompletion = useCallback(
    async (step: TabName): Promise<boolean> => {
      // Verification step doesn't need validation - it's just a submission step
      if (step === "Verification") {
        return true;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/profile/validate-step", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ step }),
        });

        if (!response.ok) {
          throw new Error("Failed to validate step");
        }

        const data = await response.json();
        return data.ok && data.isComplete;
      } catch (error) {
        console.error(`Error validating ${step} step:`, error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Check if a step is accessible (previous steps must be completed)
  const isStepAccessible = useCallback(
    (step: TabName): boolean => {
      switch (step) {
        case "Profile":
          return true; // Always accessible
        case "Files":
          return stepCompletionStatus.Profile;
        case "Verification":
          return stepCompletionStatus.Profile && stepCompletionStatus.Files;
        case "Review":
          return (
            stepCompletionStatus.Profile &&
            stepCompletionStatus.Files &&
            stepCompletionStatus.Verification
          );
        default:
          return false;
      }
    },
    [stepCompletionStatus]
  );

  // Refresh all step completion statuses
  const refreshStepCompletion = useCallback(async () => {
    const profileComplete = await validateStepCompletion("Profile");
    const filesComplete = await validateStepCompletion("Files");
    const verificationComplete = true; // Always true since it's just a validation step
    const reviewComplete =
      profileComplete && filesComplete && verificationComplete;

    setStepCompletionStatus({
      Profile: profileComplete,
      Files: filesComplete,
      Verification: verificationComplete,
      Review: reviewComplete,
    });
  }, [validateStepCompletion]);

  // Custom setCurrentTab that only allows accessible tabs
  const handleSetCurrentTab = (tab: TabName) => {
    if (isStepAccessible(tab)) {
      setCurrentTab(tab);
    }
  };

  return (
    <ProfileTabContext.Provider
      value={{
        currentTab,
        setCurrentTab: handleSetCurrentTab,
        jobSubmissionId,
        setJobSubmissionId,
        stepCompletionStatus,
        setStepCompletionStatus,
        validateStepCompletion,
        isStepAccessible,
        refreshStepCompletion,
        isLoading,
      }}
    >
      {children}
    </ProfileTabContext.Provider>
  );
}

export default ProfileTabContext;
