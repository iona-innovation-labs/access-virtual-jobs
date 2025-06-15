import { useState, useEffect, useCallback } from "react";

// Profile types based on your database schema
interface Profile {
  id: number;
  jobTitle: string;
  userId: string;
  whyFit: string;
  whatStrengths: string;
  whatNeedImprovement: string;
  address: string;
  skypeId: string;
  dateOfBirth: Date | null;
  hasPaypal: string;
  numberOfChildren: string;
  internetProvider: string;
  numberOfMonitors: string;
  numberOfExperience: string;
  salaryUnit: string;
  desiredSalary: string;
  isPublicSalary: boolean;
  howHear: string | null;
  referrer: string | null;
  jobType: string | null;
  availability: string | null;
  jobSearchStatus: string;
  educationStatus: string;
  linkedInLink: string | null;
  instagramLink: string | null;
  xLink: string | null;
  profileDescription: string | null;
}

interface PortfolioLink {
  id: number;
  profileId: number;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  createdAt: Date;
}

interface Skill {
  id: number;
  profileId: number;
  name: string;
  category: string | null;
  starRating: number | null; // Updated to use star rating (1-5)
  yearsOfExperience: number | null;
  createdAt: Date;
}

interface Phone {
  id: number;
  profileId: number;
  number: string;
  type: string;
}

interface Email {
  id: number;
  profileId: number;
  address: string;
  type: string;
}

interface ContentLink {
  id: number;
  profileId: number;
  link: string;
}

interface AssessmentTest {
  id: number;
  profileId: number;
  link: string;
}

interface WorkSample {
  id: number;
  profileId: number;
  link: string;
}

interface WorkHistory {
  id: number;
  profileId: number;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  isCurrentJob: string;
  location: string | null;
  employmentType: string | null;
  createdAt: Date;
}

interface Certification {
  id: number;
  profileId: number;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
  createdAt: Date;
}

interface Education {
  id: number;
  profileId: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  gpa: string | null;
  description: string | null;
  isCurrentlyStudying: string;
  location: string | null;
  createdAt: Date;
}

interface FileUpload {
  id: number;
  profileId: number;
  type: string;
  link: string;
  podioFileId: string;
  cloudinaryId: string | null;
  filename: string;
  createdAt: Date;
}

// Complete profile with all relations
interface ProfileWithRelations extends Profile {
  portfolioLinks: PortfolioLink[];
  skills: Skill[];
  phones: Phone[];
  emails: Email[];
  contentLinks: ContentLink[];
  assessmentTests: AssessmentTest[];
  workSamples: WorkSample[];
  workHistory: WorkHistory[];
  certifications: Certification[];
  education: Education[];
  fileUploads: FileUpload[];
}

// Profile completeness types
interface ProfileField {
  key: string;
  label: string;
  value: any;
}

interface ProfileSection {
  name: string;
  fields: ProfileField[];
  completed: number;
  total: number;
  percentage: number;
}

interface ProfileCompleteness {
  percentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
  sections: {
    basicInfo: ProfileSection;
    contact: ProfileSection;
    jobPreferences: ProfileSection;
    professionalProfile: ProfileSection;
    prescreening: ProfileSection;
    assessment: ProfileSection;
    technicalSetup: ProfileSection;
    additionalInfo: ProfileSection;
  };
}

// API Response types
interface ProfileResponse {
  message: string;
  profile: ProfileWithRelations | null;
  completeness: ProfileCompleteness;
  ok: boolean;
}

interface ProfileError {
  error: string;
  message: string;
  ok: false;
}

// Transformed data types for components
interface JobPreferencesData {
  jobSearchStatus: string;
  desiredSalary: number;
  salaryUnit: "PHP" | "USD";
  isPublicSalary: boolean;
  jobType:
    | "full_time"
    | "part_time"
    | "contract"
    | "freelance"
    | "internship"
    | null;
}

interface ProfessionalProfileData {
  jobTitle: string;
  numberOfExperience: string;
  educationStatus: string;
  linkedInLink: string;
  instagramLink: string;
  xLink: string;
  portfolioLinks: Array<{
    title: string;
    url: string;
    description: string;
    category: string;
  }>;
  skills: Array<{
    name: string;
    category: string;
    starRating: number; // Updated to use star rating (1-5)
    yearsOfExperience: number;
  }>;
}

// Hook return type
interface UseProfileReturn {
  // Raw data
  profile: ProfileWithRelations | null;
  loading: boolean;
  error: string | null;

  // Actions
  refetch: () => Promise<void>;
  updateLocalProfile: (updates: Partial<ProfileWithRelations>) => void;

  // Transformed data for components
  jobPreferences: JobPreferencesData | null;
  professionalProfile: ProfessionalProfileData | null;

  // Profile completeness
  completeness: ProfileCompleteness | null;

  // Individual sections (raw)
  skills: Skill[];
  portfolioLinks: PortfolioLink[];
  workHistory: WorkHistory[];
  certifications: Certification[];
  education: Education[];
  phones: Phone[];
  emails: Email[];
  contentLinks: ContentLink[];
  assessmentTests: AssessmentTest[];
  workSamples: WorkSample[];
  fileUploads: FileUpload[];
}

// Custom hook options
interface UseProfileOptions {
  autoFetch?: boolean; // Whether to fetch on mount (default: true)
  retryOnError?: boolean; // Whether to retry on error (default: false)
  retryDelay?: number; // Retry delay in ms (default: 3000)
}

export const useProfile = (
  options: UseProfileOptions = {}
): UseProfileReturn => {
  const { autoFetch = true, retryOnError = false, retryDelay = 3000 } = options;

  const [profile, setProfile] = useState<ProfileWithRelations | null>(null);
  const [completeness, setCompleteness] = useState<ProfileCompleteness | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/edit-profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      const data: ProfileResponse | ProfileError = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (data.ok) {
        const responseData = data as ProfileResponse;
        setProfile(responseData.profile);
        setCompleteness(responseData.completeness);
        setError(null);
      } else {
        throw new Error((data as ProfileError).message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching profile:", err);

      // Retry logic
      if (retryOnError) {
        setTimeout(() => {
          fetchProfile();
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [retryOnError, retryDelay]);

  // Update local profile state without refetching
  const updateLocalProfile = useCallback(
    (updates: Partial<ProfileWithRelations>) => {
      setProfile((prevProfile) => {
        if (!prevProfile) return null;
        return { ...prevProfile, ...updates };
      });
    },
    []
  );

  // Fetch profile on mount if autoFetch is enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, [autoFetch, fetchProfile]);

  // Transform data for job preferences component
  const jobPreferences: JobPreferencesData | null = profile
    ? {
        jobSearchStatus: profile.jobSearchStatus,
        desiredSalary: parseFloat(profile.desiredSalary) || 0,
        salaryUnit: profile.salaryUnit as "PHP" | "USD",
        isPublicSalary: profile.isPublicSalary,
        jobType: profile.jobType as
          | "full_time"
          | "part_time"
          | "contract"
          | "freelance"
          | "internship"
          | null,
      }
    : null;

  // Transform data for professional profile component
  const professionalProfile: ProfessionalProfileData | null = profile
    ? {
        jobTitle: profile.jobTitle,
        numberOfExperience: profile.numberOfExperience,
        educationStatus: profile.educationStatus,
        linkedInLink: profile.linkedInLink || "",
        instagramLink: profile.instagramLink || "",
        xLink: profile.xLink || "",
        portfolioLinks: profile.portfolioLinks.map((link) => ({
          title: link.title,
          url: link.url,
          description: link.description || "",
          category: link.category || "",
        })),
        skills: profile.skills.map((skill) => ({
          name: skill.name,
          category: skill.category || "",
          starRating: skill.starRating || 1, // Default to 1 star if not set
          yearsOfExperience: skill.yearsOfExperience || 0,
        })),
      }
    : null;

  return {
    // Raw data
    profile,
    loading,
    error,

    // Actions
    refetch: fetchProfile,
    updateLocalProfile,

    // Transformed data for components
    jobPreferences,
    professionalProfile,

    // Profile completeness
    completeness,

    // Individual sections (raw)
    skills: profile?.skills || [],
    portfolioLinks: profile?.portfolioLinks || [],
    workHistory: profile?.workHistory || [],
    certifications: profile?.certifications || [],
    education: profile?.education || [],
    phones: profile?.phones || [],
    emails: profile?.emails || [],
    contentLinks: profile?.contentLinks || [],
    assessmentTests: profile?.assessmentTests || [],
    workSamples: profile?.workSamples || [],
    fileUploads: profile?.fileUploads || [],
  };
};

// Export types for use in components
export type {
  Profile,
  ProfileWithRelations,
  PortfolioLink,
  Skill,
  Phone,
  Email,
  ContentLink,
  AssessmentTest,
  WorkSample,
  WorkHistory,
  Certification,
  Education,
  FileUpload,
  UseProfileReturn,
  JobPreferencesData,
  ProfessionalProfileData,
  ProfileCompleteness,
  ProfileSection,
  ProfileField,
};
