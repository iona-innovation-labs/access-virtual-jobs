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
  postedById: string;
  postedByName: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  numberOfTalents?: number;
  tags?: string[];
  alsoPostedOn?: string[];
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

// Updated job application interface
export interface IJobApplication {
  id: number;
  applicationPublicId: string;
  userId: string;
  profileId: number;
  jobId: number; // Now references jobs.id
  status: string;
  progress: string;
  submittedAt: Date;
  job?: IJobListing; // Optional populated job details
}
