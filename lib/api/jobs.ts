// @/lib/api/jobs.ts - Complete service layer replacing Podio functions

import {
  getJobs as getJobsFromDB,
  getJobById as getJobByIdFromDB,
  getJobBySlug as getJobBySlugFromDB,
  getTotalJobsCount,
  createJob as createJobInDB,
  updateJob as updateJobInDB,
  deleteJob as deleteJobFromDB,
  searchJobs as searchJobsFromDB,
  getJobsByRecruiter as getJobsByRecruiterFromDB,
  convertFrontendFilters,
  parseUrlSearchParams,
} from "@/database/queries/jobs";
import { getJobApplicationById } from "@/database/queries/job_applications";
import type {
  FetchJobListingsResponse,
  IJobListing,
  IJobApplication,
  FrontendJobType,
  FrontendJobCategory,
  FrontendSalaryRange,
  Progress,
} from "@/types/jobs";
import { log } from "@/lib/logs";
import { eq, and, ilike, desc, count } from "drizzle-orm";
import { jobApplications } from "@/database/schema/job-applications";
import { jobs } from "@/database/schema/jobs";
import { db } from "@/database";
import { PUBLIC_JOB_CATEGORIES, PUBLIC_JOB_TYPES } from "@/lib/constants";

interface FetchJobListingsConfig {
  sort_by?: string;
  sort_desc?: boolean;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
  remember?: boolean;
}

interface FrontendFilterState {
  query: string;
  jobType: string[];
  jobCategory: string[];
  salaryRange: string;
  remote: boolean;
}

interface CreateJobData {
  title?: string;
  description?: string;
  salaryAmount?: number;
  salaryCurrency?: "USD" | "PHP";
  salaryType?: "hourly" | "monthly" | "yearly";
  location?: string;
  jobType?: FrontendJobType;
  jobCategory?: FrontendJobCategory;
  remoteAllowed?: boolean;
  postedById: string | null;
  numberOfTalents?: number;
  tags?: string[];
  status?: "active" | "inactive" | "closed";
}

interface UpdateJobData extends Partial<CreateJobData> {
  id: number;
}

// MAIN FUNCTIONS - Direct replacements for your existing Podio functions

/**
 * Main jobs fetching function - EXACT replacement for your Podio getJobs
 * Maintains same signature: getJobs(config, search?, isApp?)
 */
export const getJobs = async (
  config: FetchJobListingsConfig = {},
  search?: string,
  isApp?: boolean
): Promise<FetchJobListingsResponse | null> => {
  try {
    // Convert old config format to new query config
    const queryConfig = {
      filters: convertFrontendFilters({
        search: search,
        ...config.filters,
      }),
      sortBy:
        config.sort_by === "created_on"
          ? ("createdAt" as const)
          : ("createdAt" as const),
      sortDesc: config.sort_desc || false,
      limit: config.limit || 20,
      offset: config.offset || 0,
    };

    const [jobsResult, totalCountResult] = await Promise.all([
      getJobsFromDB(queryConfig),
      getTotalJobsCount(queryConfig.filters),
    ]);

    if (!jobsResult.ok) {
      log("Failed to fetch jobs:", "error", jobsResult.message);
      return {
        success: false,
        items: [],
        total: 0,
        all: 0,
      };
    }

    const formattedJobs = jobsResult.data.map((job) =>
      formatJobForFrontend(job, isApp)
    );

    return {
      success: true,
      items: formattedJobs,
      total: formattedJobs.length,
      all: totalCountResult.ok ? totalCountResult.data : 0,
    };
  } catch (error) {
    log("Error in getJobs service:", "error", error);
    return {
      success: false,
      items: [],
      total: 0,
      all: 0,
    };
  }
};

/**
 * Single job fetching - EXACT replacement for your Podio getJobPost
 * Handles both ID and slug-based lookups
 */
export const getJobPost = async (
  id: string
): Promise<{ success: boolean; item: any | null } | null> => {
  try {
    let jobResult;

    // Handle different ID formats
    if (id.includes("-")) {
      // Looks like a slug format "123-job-title", extract ID
      const parts = id.split("-");
      const numericId = parseInt(parts[0]);

      if (!isNaN(numericId)) {
        jobResult = await getJobByIdFromDB(numericId);
      } else {
        // Try as full slug
        jobResult = await getJobBySlugFromDB(id);
      }
    } else {
      // Direct numeric ID
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        jobResult = await getJobByIdFromDB(numericId);
      } else {
        return { success: false, item: null };
      }
    }

    if (!jobResult.ok || !jobResult.data) {
      return { success: false, item: null };
    }

    return {
      success: true,
      item: formatJobForFrontend(jobResult.data),
    };
  } catch (error) {
    log("Error in getJobPost service:", "error", error);
    return { success: false, item: null };
  }
};

/**
 * Job application with details - EXACT replacement for your existing function
 */
export const getJobApplicationWithJobDetails = async (
  jobApplicationId: string
): Promise<IJobApplication | null> => {
  try {
    // Get the job application first
    const applicationResult = await getJobApplicationById(jobApplicationId);

    if (
      !applicationResult ||
      !applicationResult.ok ||
      !applicationResult.application
    ) {
      log("Job application not found:", "error", jobApplicationId);
      return null;
    }

    const application = applicationResult.application;

    // Get the job details
    const jobResult = await getJobByIdFromDB(application.jobId);

    if (!jobResult.ok || !jobResult.data) {
      log("Job not found for application:", "error", application.jobId);
      return null;
    }

    // Format the combined response
    return {
      id: application.id,
      applicationPublicId: application.applicationPublicId,
      userId: application.userId,
      profileId: application.profileId,
      jobId: application.jobId,
      status: application.status,
      progress: (application?.progress || "in_review") as Progress,
      submittedAt: application.submittedAt || new Date(),
      job: formatJobForFrontend(jobResult.data),
    };
  } catch (error) {
    log("Error in getJobApplicationWithJobDetails:", "error", error);
    return null;
  }
};

export const getJobsFromUrl = async (
  searchParams: URLSearchParams,
  isApp?: boolean
): Promise<FetchJobListingsResponse | null> => {
  try {
    console.log(
      "🚀 getJobsFromUrl called with params:",
      Object.fromEntries(searchParams.entries())
    );

    // Parse filters
    const filters = parseUrlSearchParams(searchParams);

    // Parse pagination
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Parse sorting - this is the key addition!
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDesc = searchParams.get("sortDesc") !== "false"; // defaults to true

    console.log("📊 Sort parameters:", { sortBy, sortDesc });

    const queryConfig = {
      filters,
      limit,
      offset,
      sortBy: sortBy as "createdAt" | "title" | "salaryAmount",
      sortDesc,
    };

    console.log("🎯 Final query config:", queryConfig);

    const [jobsResult, totalCountResult] = await Promise.all([
      getJobsFromDB(queryConfig),
      getTotalJobsCount(queryConfig.filters),
    ]);

    if (!jobsResult.ok) {
      console.error("❌ Jobs query failed:", jobsResult.message);
      return {
        success: false,
        items: [],
        total: 0,
        all: 0,
      };
    }

    const formattedJobs = jobsResult.data.map((job) =>
      formatJobForFrontend(job, isApp)
    );

    const totalCount = totalCountResult.ok ? totalCountResult.data : 0;

    console.log("✅ Query successful:", {
      itemsReturned: formattedJobs.length,
      totalCount,
      sortBy,
      sortDesc,
    });

    return {
      success: true,
      items: formattedJobs,
      total: formattedJobs.length,
      all: totalCount,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: offset + limit < totalCount,
        hasPrev: offset > 0,
      },
    };
  } catch (error) {
    console.error("❌ Error in getJobsFromUrl:", error);
    return {
      success: false,
      items: [],
      total: 0,
      all: 0,
    };
  }
};
/**
 * Frontend filter state to jobs - Perfect for your filter component
 */
export const getJobsFromFilters = async (
  filterState: FrontendFilterState,
  isApp?: boolean,
  limit: number = 20,
  offset: number = 0
): Promise<FetchJobListingsResponse | null> => {
  try {
    // Convert to URL params format
    const searchParams = new URLSearchParams();

    if (filterState.query) searchParams.set("q", filterState.query);
    if (filterState.jobType.length > 0)
      searchParams.set("jobType", filterState.jobType.join(","));
    if (filterState.jobCategory.length > 0)
      searchParams.set("jobCategory", filterState.jobCategory.join(","));
    if (filterState.salaryRange)
      searchParams.set("salary", filterState.salaryRange);
    if (filterState.remote) searchParams.set("remote", "true");
    searchParams.set("limit", limit.toString());
    searchParams.set("offset", offset.toString());

    return await getJobsFromUrl(searchParams, isApp);
  } catch (error) {
    log("Error in getJobsFromFilters:", "error", error);
    return {
      success: false,
      items: [],
      total: 0,
      all: 0,
    };
  }
};

/**
 * Simple search function
 */
export const searchJobs = async (
  query: string,
  limit: number = 20,
  isApp?: boolean
): Promise<FetchJobListingsResponse | null> => {
  try {
    const result = await searchJobsFromDB(query, {}, limit);

    if (!result.ok) {
      return {
        success: false,
        items: [],
        total: 0,
        all: 0,
      };
    }

    const formattedJobs = result.data.map((job) =>
      formatJobForFrontend(job, isApp)
    );

    return {
      success: true,
      items: formattedJobs,
      total: formattedJobs.length,
      all: formattedJobs.length,
    };
  } catch (error) {
    log("Error in searchJobs:", "error", error);
    return {
      success: false,
      items: [],
      total: 0,
      all: 0,
    };
  }
};

/**
 * Get recent jobs (for homepage, etc.)
 */
export const getRecentJobs = async (
  limit: number = 10,
  isApp?: boolean
): Promise<FetchJobListingsResponse | null> => {
  const config: FetchJobListingsConfig = {
    sort_by: "created_on",
    sort_desc: true,
    limit,
    offset: 0,
  };

  return await getJobs(config, undefined, isApp);
};

/**
 * Get jobs by recruiter
 */
export const getJobsByRecruiter = async (
  recruiterId: string,
  limit: number = 50,
  isApp?: boolean
): Promise<FetchJobListingsResponse | null> => {
  try {
    const result = await getJobsByRecruiterFromDB(recruiterId, limit);

    if (!result.ok) {
      return {
        success: false,
        items: [],
        total: 0,
        all: 0,
      };
    }

    const formattedJobs = result.data.map((job) =>
      formatJobForFrontend(job, isApp)
    );

    return {
      success: true,
      items: formattedJobs,
      total: formattedJobs.length,
      all: formattedJobs.length,
    };
  } catch (error) {
    log("Error in getJobsByRecruiter:", "error", error);
    return {
      success: false,
      items: [],
      total: 0,
      all: 0,
    };
  }
};

// JOB MANAGEMENT FUNCTIONS (for recruiters)

/**
 * Create a new job posting
 */
export const createJobPost = async (
  jobData: CreateJobData
): Promise<IJobListing | null> => {
  try {
    const result = await createJobInDB(jobData);

    if (!result.ok || !result.data) {
      log("Failed to create job:", "error", result.message);
      return null;
    }

    return formatJobForFrontend(result.data);
  } catch (error) {
    log("Error in createJobPost:", "error", error);
    return null;
  }
};

// Export createJob for direct use
export const createAdminJobPost = createJobInDB;

/**
 * Update an existing job posting
 */
export const updateJobPost = async (
  jobData: UpdateJobData
): Promise<IJobListing | null> => {
  try {
    console.log("updateJobPost called with:", jobData);

    const result = await updateJobInDB(jobData);
    console.log("updateJobInDB result:", result);

    if (!result.ok || !result.data) {
      console.log("updateJobInDB failed:", result.message);
      log("Failed to update job:", "error", result.message);
      return null;
    }

    const formatted = formatJobForFrontend(result.data);
    console.log("Formatted result:", formatted);
    return formatted;
  } catch (error) {
    console.error("Error in updateJobPost:", error);
    log("Error in updateJobPost:", "error", error);
    return null;
  }
};

/**
 * Delete a job posting
 */
export const deleteJobPost = async (id: number): Promise<boolean> => {
  try {
    const result = await deleteJobFromDB(id);
    return result.ok;
  } catch (error) {
    log("Error in deleteJobPost:", "error", error);
    return false;
  }
};

// UTILITY FUNCTIONS

/**
 * Format job data for frontend consumption
 */
function formatJobForFrontend(job: IJobListing, isApp?: boolean): IJobListing {
  return {
    ...job,
    // Ensure proper URL format
    url: generateJobURL(job.id, job.slug, isApp),
    // Ensure pay is formatted
    pay:
      job.pay ||
      formatSalaryDisplay(job.salaryAmount, job.salaryCurrency, job.salaryType),
  };
}

/**
 * Generate job URL
 */
function generateJobURL(id: number, slug: string, isApp?: boolean): string {
  const urlFriendlyTitle = `${id}-${slug}`;

  return isApp
    ? `/app/jobs/v/${urlFriendlyTitle}`
    : `/talent/find-work/${urlFriendlyTitle}`;
}

/**
 * Format salary for display
 */
function formatSalaryDisplay(
  amount: number | null,
  currency: string,
  type: string
): string {
  if (!amount) return "Not provided";

  const formatted = `${currency} ${amount.toFixed(2)}`;
  const suffix =
    type === "hourly" ? " / hr" : type === "monthly" ? " / month" : " / year";

  return formatted + suffix;
}

/**
 * Validate job data
 */
export const validateJobData = (
  jobData: Partial<CreateJobData>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!jobData.title || jobData.title.trim().length < 3) {
    errors.push("Job title must be at least 3 characters long");
  }

  if (!jobData.description || jobData.description.trim().length < 10) {
    errors.push("Job description must be at least 10 characters long");
  }

  if (jobData.salaryAmount && jobData.salaryAmount < 0) {
    errors.push("Salary amount cannot be negative");
  }

  if (!jobData.postedById) {
    errors.push("Posted by user ID is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get job statistics (bonus feature)
 */
export const getJobStats = async (jobId: number) => {
  try {
    const jobResult = await getJobByIdFromDB(jobId);

    if (!jobResult.ok || !jobResult.data) {
      return null;
    }

    const job = jobResult.data;
    const daysActive = Math.floor(
      (Date.now() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      title: job.title,
      status: job.status,
      daysActive,
      postedBy: job.postedByName,
      createdAt: job.createdAt,
    };
  } catch (error) {
    log("Error getting job stats:", "error", error);
    return null;
  }
};

// MIGRATION HELPERS (temporary - for transition period)

/**
 * Parse legacy Podio ID from current job applications
 * This helps during the migration period
 */
export const parseLegacyJobId = (podioId: string): number | null => {
  // If it's already a number, return it
  const numericId = parseInt(podioId);
  if (!isNaN(numericId)) {
    return numericId;
  }

  // Handle any legacy Podio ID format here
  return null;
};

// EXPORT VALIDATION CONSTANTS

export const JOB_TYPES: FrontendJobType[] = PUBLIC_JOB_TYPES.map(
  (type) => type.label
);

export const JOB_CATEGORIES: FrontendJobCategory[] = PUBLIC_JOB_CATEGORIES.map(
  (category) => category.label
);

export const SALARY_RANGES: FrontendSalaryRange[] = [
  "Less than $3",
  "$3 - $4.99",
  "$5 - $7.99",
  "$8 - $9.99",
  "More than $10",
];

/**
 * Fetch jobs for the admin portal with status and search filters
 */
export const getAdminJobs = async ({
  status,
  search = "",
  sortBy = "createdAt",
  sortDesc = true,
  page = 1,
  limit = 10,
}: {
  status?: string;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
  page?: number;
  limit?: number;
}): Promise<FetchJobListingsResponse | null> => {
  try {
    const filters: Record<string, any> = {};
    if (status) {
      filters.status = status;
    }
    if (search) {
      filters.search = search;
    }
    const offset = (page - 1) * limit;
    const queryConfig = {
      filters,
      limit,
      offset,
      sortBy: sortBy as "createdAt" | "title" | "salaryAmount",
      sortDesc,
    };
    const [jobsResult, totalCountResult] = await Promise.all([
      getJobsFromDB(queryConfig, true),
      getTotalJobsCount(queryConfig.filters),
    ]);
    if (!jobsResult.ok) {
      return {
        success: false,
        items: [],
        total: 0,
        all: 0,
      };
    }
    const formattedJobs = jobsResult.data.map((job) =>
      formatJobForFrontend(job, false)
    );
    const totalCount = totalCountResult.ok ? totalCountResult.data : 0;
    return {
      success: true,
      items: formattedJobs,
      total: formattedJobs.length,
      all: totalCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: offset + limit < totalCount,
        hasPrev: offset > 0,
      },
    };
  } catch (error: any) {
    console.error("Error in getAdminJobs:", error);
    return {
      success: false,
      items: [],
      total: 0,
      all: 0,
    };
  }
};

/**
 * Fetch all job applications for admin, with job details and pagination
 */
export const getAdminJobApplications = async ({
  page = 1,
  limit = 20,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{
  success: boolean;
  items: IJobApplication[];
  total: number;
  all: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {
  try {
    const offset = (page - 1) * limit;
    const filters: any[] = [];
    if (status) filters.push(eq(jobApplications.status, status));
    if (search) filters.push(ilike(jobs.title, `%${search}%`));

    // Join jobApplications with jobs
    const query = db
      .select({ jobApplication: jobApplications, job: jobs })
      .from(jobApplications)
      .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(jobApplications.submittedAt))
      .limit(limit)
      .offset(offset);

    const [applications, totalCountRows] = await Promise.all([
      query,
      db
        .select({ count: count() })
        .from(jobApplications)
        .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
        .where(filters.length ? and(...filters) : undefined),
    ]);
    const totalCount = Number(totalCountRows[0]?.count || 0);

    // Format for frontend
    const items: IJobApplication[] = applications.map((row: any) => {
      const app = row.jobApplication;
      const job = row.job;
      return {
        id: app.id,
        applicationPublicId: app.applicationPublicId,
        userId: app.userId,
        profileId: app.profileId,
        jobId: app.jobId,
        status: app.status,
        progress: app.progress,
        submittedAt: app.submittedAt,
        job: job
          ? {
              id: job.id,
              title: job.title,
              description: job.description,
              salaryAmount: job.salaryAmount,
              salaryCurrency: job.salaryCurrency,
              salaryType: job.salaryType,
              pay: job.pay,
              location: job.location,
              jobType: job.jobType,
              jobCategory: job.jobCategory,
              remoteAllowed: job.remoteAllowed,
              slug: job.slug,
              status: job.status,
              url: job.url,
              postedById: job.postedById,
              postedByName: job.postedByName,
              createdAt: job.createdAt,
              updatedAt: job.updatedAt,
              numberOfTalents: job.numberOfTalents,
              tags: job.tags,
            }
          : undefined,
      };
    });

    return {
      success: true,
      items,
      total: items.length,
      all: totalCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: offset + limit < totalCount,
        hasPrev: offset > 0,
      },
    };
  } catch (error) {
    console.error("Error in getAdminJobApplications:", error);
    return {
      success: false,
      items: [],
      total: 0,
      all: 0,
      pagination: {
        currentPage: page,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
};
