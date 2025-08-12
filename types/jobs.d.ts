import { JOB_SEARCH_STATUS } from "@/lib/constants";

export interface Position {
  title?: string;
  createdAt: string | Date;
  pay?: string;
  url?: string;
  description?: string;
}

export type DatabaseJobType =
  | "freelance"
  | "full-time"
  | "part-time"
  | "contract";

export type DatabaseJobCategory =
  | "office_administration"
  | "marketing_sales"
  | "graphics_multimedia"
  | "web_design_development"
  | "software_development_programming"
  | "customer_service_admin_support"
  | "professional_services"
  | "writing";

export type FrontendJobType =
  | "Freelance"
  | "Full-time"
  | "Part-time"
  | "Contract";

export type FrontendJobCategory =
  | "Office & Administration"
  | "Marketing & Sales"
  | "Graphics & Multimedia"
  | "Web Design & Development"
  | "Software Development / Programming"
  | "Customer Service & Admin Support"
  | "Professional Services"
  | "Writing";

export type FrontendSalaryRange =
  | "Less than $3"
  | "$3 - $4.99"
  | "$5 - $7.99"
  | "$8 - $9.99"
  | "More than $10";

// Basic job listing interface
export interface IJobListing {
  id: number; // serial ID from database
  title?: string;
  description: string | null;

  // Salary
  salaryAmount: number | null;
  salaryCurrency: string;
  salaryType: "hourly" | "monthly" | "yearly";
  pay: string; // Formatted display string

  // Job details
  location: string | null;
  jobType: FrontendJobType | null;
  jobCategory: FrontendJobCategory | null;
  remoteAllowed: boolean;

  // Meta
  slug: string;
  status: "active" | "inactive" | "closed";
  url: string; // Generated URL

  // Relationships
  postedById: string | null;
  postedByName: string;
  postedBy?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  numberOfTalents?: number;
  tags?: string[];
  alsoPostedOn?: string[];
}

export interface PositionProps {
  position: IJobListing;
}

export interface ISearchParams {
  [key: string]: string | string[] | undefined;
}

// Response interfaces (matching your existing pattern)
export interface FetchJobListingsResponse {
  success: boolean;
  items: IJobListing[];
  total: number;
  all: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FetchJobResponse {
  success: boolean;
  item: IJobListing | null;
  status: string;
  progress: string;
  submittedAt: Date | null;
  job?: IJobListing; // Optional populated job details
}

export type JobSearchFilter = {
  searchText: string;
};

export interface IJobApplicationDetails {
  id: number;
  resume: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  location: string;
  jobEquity: string;
  about: string;
  responsibilities: string;
  requirements: string;
  relocation: boolean;
  experience: string;
}

export type Status = "on_going" | "archived";
export type Progress =
  | "in_review"
  | "reviewed"
  | "declined_initial_interview"
  | "initial_interview"
  | "for_client_interview"
  | "declined_after_interview"
  | "make_offer"
  | "hired_signed"
  | "endorsed"
  | "reserved_for_future_opening";

export interface IJobApplicationHeaderDetails {
  title: string;
  submittedAt: Date;
}

// Updated job application interface
export interface IJobApplication {
  id: number;
  applicationPublicId: string;
  userId: string;
  profileId: number;
  jobId: number; // Now references jobs.id
  status: JOB_SEARCH_STATUS;
  progress: Progress;
  submittedAt: Date;
  job?: IJobListing; // Optional populated job details
}
