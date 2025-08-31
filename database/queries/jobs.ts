import {
  and,
  eq,
  desc,
  asc,
  or,
  ilike,
  gte,
  lte,
  count,
  sql,
  inArray,
  SQL,
} from "drizzle-orm";
import { db } from "@/database";
import { jobs } from "@/database/schema/jobs";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";
import type {
  IJobListing,
  FrontendJobType,
  FrontendJobCategory,
  FrontendSalaryRange,
  DatabaseJobCategory,
  DatabaseJobType,
} from "@/types/jobs";
import { PUBLIC_JOB_CATEGORIES, PUBLIC_JOB_TYPES } from "@/lib/constants";

// FRONTEND TO DATABASE MAPPING

// Updated job type mapping using constants
const JOB_TYPE_MAPPING: Record<string, string> = {};
PUBLIC_JOB_TYPES.forEach((type) => {
  JOB_TYPE_MAPPING[type.label] = type.key;
});

// Updated job category mapping using constants
const JOB_CATEGORY_MAPPING: Record<string, string> = {};
PUBLIC_JOB_CATEGORIES.forEach((category) => {
  JOB_CATEGORY_MAPPING[category.label] = category.key;
});

// Reverse mappings
const DB_TO_FRONTEND_JOB_TYPE = Object.fromEntries(
  Object.entries(JOB_TYPE_MAPPING).map(([k, v]) => [v, k])
);

const DB_TO_FRONTEND_JOB_CATEGORY = Object.fromEntries(
  Object.entries(JOB_CATEGORY_MAPPING).map(([k, v]) => [v, k])
);

// FILTER INTERFACES

interface DatabaseFilters {
  search?: string;
  jobTypes?: string[]; // Database format
  jobCategories?: string[]; // Database format
  salaryMin?: number;
  salaryMax?: number;
  remoteAllowed?: boolean;
  location?: string;
  postedById?: string;
  postedAfter?: Date;
  postedBefore?: Date;
  status?: "active" | "inactive" | "closed";
}

interface QueryConfig {
  filters?: DatabaseFilters;
  sortBy?: "createdAt" | "title" | "salaryAmount";
  sortDesc?: boolean;
  limit?: number;
  offset?: number;
}

interface CreateJobData {
  title?: string;
  description?: string;
  salaryAmount?: number;
  salaryCurrency?: "PHP" | "USD";
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

// UTILITY FUNCTIONS

function parseSalaryRange(salaryString: FrontendSalaryRange): {
  min?: number;
  max?: number;
} {
  switch (salaryString) {
    case "Less than $3":
      return { max: 3 };
    case "$3 - $4.99":
      return { min: 3, max: 4.99 };
    case "$5 - $7.99":
      return { min: 5, max: 7.99 };
    case "$8 - $9.99":
      return { min: 8, max: 9.99 };
    case "More than $10":
      return { min: 10 };
    default:
      return {};
  }
}

function convertFrontendFilters(frontendFilters: any): DatabaseFilters {
  const dbFilters: DatabaseFilters = {};

  if (frontendFilters.search || frontendFilters.q) {
    dbFilters.search = frontendFilters.search || frontendFilters.q;
  }

  if (frontendFilters.jobType) {
    const types = Array.isArray(frontendFilters.jobType)
      ? frontendFilters.jobType
      : frontendFilters.jobType.split(",");

    dbFilters.jobTypes = types
      .map((type: string) => JOB_TYPE_MAPPING[type as FrontendJobType])
      .filter(Boolean);
  }

  if (frontendFilters.jobCategory) {
    const categories = Array.isArray(frontendFilters.jobCategory)
      ? frontendFilters.jobCategory
      : frontendFilters.jobCategory.split(",");

    dbFilters.jobCategories = categories
      .map((cat: string) => JOB_CATEGORY_MAPPING[cat as FrontendJobCategory])
      .filter(Boolean);
  }

  if (frontendFilters.salary || frontendFilters.salaryRange) {
    const salaryRange = frontendFilters.salary || frontendFilters.salaryRange;
    const { min, max } = parseSalaryRange(salaryRange);
    if (min !== undefined) dbFilters.salaryMin = min;
    if (max !== undefined) dbFilters.salaryMax = max;
  }

  if (frontendFilters.remote === "true" || frontendFilters.remote === true) {
    dbFilters.remoteAllowed = true;
  }

  if (frontendFilters.location) {
    dbFilters.location = frontendFilters.location;
  }

  if (frontendFilters.postedById) {
    dbFilters.postedById = frontendFilters.postedById;
  }

  return dbFilters;
}

function parseUrlSearchParams(searchParams: URLSearchParams): DatabaseFilters {
  console.log(
    "🔍 Parsing URL search params:",
    Object.fromEntries(searchParams.entries())
  );

  const frontendFilters = {
    q: searchParams.get("q"),
    jobType: searchParams.get("jobType"),
    jobCategory: searchParams.get("jobCategory"),
    salary: searchParams.get("salary"),
    remote: searchParams.get("remote"),
    location: searchParams.get("location"),
    sortBy: searchParams.get("sortBy"),
    sortDesc: searchParams.get("sortDesc"),
  };

  console.log("📝 Frontend filters extracted:", frontendFilters);

  const dbFilters = convertFrontendFilters(frontendFilters);
  console.log("🗄️ Database filters converted:", dbFilters);

  return dbFilters;
}

function formatJobForResponse(job: any): IJobListing {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    salaryAmount: job.salaryAmount ? parseFloat(job.salaryAmount) : null,
    salaryCurrency: job.salaryCurrency,
    salaryType: job.salaryType,
    pay: formatSalaryDisplay(
      job.salaryAmount ? parseFloat(job.salaryAmount) : null,
      job.salaryCurrency,
      job.salaryType
    ),
    location: job.location,
    jobType: job.jobType
      ? (DB_TO_FRONTEND_JOB_TYPE[job.jobType] as FrontendJobType)
      : null,
    jobCategory: job.jobCategory
      ? (DB_TO_FRONTEND_JOB_CATEGORY[job.jobCategory] as FrontendJobCategory)
      : null,
    remoteAllowed: job.remoteAllowed,
    slug: job.slug,
    status: job.status,
    url: generateJobURL(job.id, job.slug),
    postedById: job.postedById,
    postedByName: job.postedByName || "Unknown",
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

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

function generateJobURL(id: number, slug: string, isApp?: boolean): string {
  const urlFriendlyTitle = `${id}-${slug}`;
  return isApp
    ? `/app/jobs/v/${urlFriendlyTitle}`
    : `/talent/find-work/${urlFriendlyTitle}`;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

async function generateUniqueSlug(
  title: string,
  excludeId?: number
): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const conditions: (SQL | undefined)[] = [eq(jobs.slug, slug)];
    if (excludeId) {
      conditions.push(sql`${jobs.id} != ${excludeId}`);
    }

    const finalConditions = conditions.filter((c): c is SQL => !!c);

    const existing = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(and(...finalConditions))
      .limit(1);

    if (existing.length === 0) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// CORE QUERY FUNCTIONS

export async function getJobs(config: QueryConfig = {}, isAdmin = false) {
  try {
    const conditions: (SQL | undefined)[] = [
      isAdmin
        ? inArray(jobs.status, ["active", "inactive", "closed"])
        : eq(jobs.status, "active"),
    ];

    if (config.filters) {
      const { filters } = config;
      console.log("FILTERS", filters);
      if (filters.status) {
        conditions[0] = eq(jobs.status, filters.status);
      }
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        conditions.push(inArray(jobs.jobType, filters.jobTypes as any));
      }
      if (filters.jobCategories && filters.jobCategories.length > 0) {
        conditions.push(
          inArray(jobs.jobCategory, filters.jobCategories as any)
        );
      }
      if (filters.remoteAllowed !== undefined) {
        conditions.push(eq(jobs.remoteAllowed, filters.remoteAllowed));
      }
      if (filters.location) {
        conditions.push(ilike(jobs.location, `%${filters.location}%`));
      }
      if (filters.salaryMin) {
        conditions.push(gte(jobs.salaryAmount, filters.salaryMin.toString()));
      }
      if (filters.salaryMax) {
        conditions.push(lte(jobs.salaryAmount, filters.salaryMax.toString()));
      }
      if (filters.postedById) {
        conditions.push(eq(jobs.postedById, filters.postedById));
      }
      if (filters.postedAfter) {
        conditions.push(gte(jobs.createdAt, filters.postedAfter));
      }
      if (filters.postedBefore) {
        conditions.push(lte(jobs.createdAt, filters.postedBefore));
      }
      if (filters.search) {
        conditions.push(
          or(
            ilike(jobs.title, `%${filters.search}%`),
            ilike(jobs.description, `%${filters.search}%`)
          )
        );
      }
    }

    const finalConditions = conditions.filter((c): c is SQL => !!c);

    const sortField = config.sortBy || "createdAt";
    const sortDirection = config.sortDesc ? desc : asc;
    const orderBy =
      sortField === "title"
        ? sortDirection(jobs.title)
        : sortField === "salaryAmount"
          ? sortDirection(jobs.salaryAmount)
          : sortDirection(jobs.createdAt);

    const query = db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        salaryAmount: jobs.salaryAmount,
        salaryCurrency: jobs.salaryCurrency,
        salaryType: jobs.salaryType,
        location: jobs.location,
        jobType: jobs.jobType,
        jobCategory: jobs.jobCategory,
        remoteAllowed: jobs.remoteAllowed,
        slug: jobs.slug,
        status: jobs.status,
        postedById: jobs.postedById,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
        postedByName: users.name,
        numberOfTalents: jobs.numberOfTalents,
        tags: jobs.tags,
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.postedById, users.id))
      .where(and(...finalConditions))
      .orderBy(orderBy)
      .limit(config.limit || 10)
      .offset(config.offset || 0);

    const result = await query;
    const formattedJobs = result.map(formatJobForResponse);

    return {
      ok: true,
      message: "Jobs fetched successfully",
      data: formattedJobs,
    };
  } catch (error) {
    log("Error fetching jobs:", "error", error);
    return {
      ok: false,
      message: "Failed to fetch jobs",
      data: [],
    };
  }
}

export async function getJobById(id: number) {
  try {
    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        salaryAmount: jobs.salaryAmount,
        salaryCurrency: jobs.salaryCurrency,
        salaryType: jobs.salaryType,
        location: jobs.location,
        jobType: jobs.jobType,
        jobCategory: jobs.jobCategory,
        remoteAllowed: jobs.remoteAllowed,
        slug: jobs.slug,
        status: jobs.status,
        postedById: jobs.postedById,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
        postedByName: users.name,
        numberOfTalents: jobs.numberOfTalents,
        tags: jobs.tags,
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.postedById, users.id))
      .where(eq(jobs.id, id))
      .limit(1);

    if (result.length === 0) {
      return {
        ok: false,
        message: "Job not found",
        data: null,
      };
    }

    return {
      ok: true,
      message: "Job fetched successfully",
      data: formatJobForResponse(result[0]),
    };
  } catch (error) {
    log("Error fetching job by ID:", "error", error);
    return {
      ok: false,
      message: "Failed to fetch job",
      data: null,
    };
  }
}

export async function getJobBySlug(slug: string) {
  try {
    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        salaryAmount: jobs.salaryAmount,
        salaryCurrency: jobs.salaryCurrency,
        salaryType: jobs.salaryType,
        location: jobs.location,
        jobType: jobs.jobType,
        jobCategory: jobs.jobCategory,
        remoteAllowed: jobs.remoteAllowed,
        slug: jobs.slug,
        status: jobs.status,
        postedById: jobs.postedById,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
        postedByName: users.name,
        numberOfTalents: jobs.numberOfTalents,
        tags: jobs.tags,
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.postedById, users.id))
      .where(eq(jobs.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return {
        ok: false,
        message: "Job not found",
        data: null,
      };
    }

    return {
      ok: true,
      message: "Job fetched successfully",
      data: formatJobForResponse(result[0]),
    };
  } catch (error) {
    log("Error fetching job by slug:", "error", error);
    return {
      ok: false,
      message: "Failed to fetch job",
      data: null,
    };
  }
}

export async function getTotalJobsCount(filters?: DatabaseFilters) {
  try {
    const conditions: (SQL | undefined)[] = [eq(jobs.status, "active")];

    if (filters) {
      if (filters.status) {
        conditions[0] = eq(jobs.status, filters.status);
      }
      if (filters.jobTypes && filters.jobTypes.length > 0) {
        conditions.push(inArray(jobs.jobType, filters.jobTypes as any));
      }
      if (filters.jobCategories && filters.jobCategories.length > 0) {
        conditions.push(
          inArray(jobs.jobCategory, filters.jobCategories as any)
        );
      }
      if (filters.remoteAllowed !== undefined) {
        conditions.push(eq(jobs.remoteAllowed, filters.remoteAllowed));
      }
      if (filters.search) {
        conditions.push(
          or(
            ilike(jobs.title, `%${filters.search}%`),
            ilike(jobs.description, `%${filters.search}%`)
          )
        );
      }
    }

    const finalConditions = conditions.filter((c): c is SQL => !!c);

    const query = db
      .select({ count: count() })
      .from(jobs)
      .where(and(...finalConditions));

    const result = await query;

    return {
      ok: true,
      message: "Count fetched successfully",
      data: result[0]?.count || 0,
    };
  } catch (error) {
    log("Error getting jobs count:", "error", error);
    return {
      ok: false,
      message: "Failed to get jobs count",
      data: 0,
    };
  }
}

export async function createJob(jobData: CreateJobData) {
  console.log(jobData);
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        ok: false,
        message: "Authentication required",
        data: null,
      };
    }

    // Validation
    if (!jobData.title || jobData.title.trim().length < 3) {
      return {
        ok: false,
        message: "Job title must be at least 3 characters long",
        data: null,
      };
    }

    const slug = await generateUniqueSlug(jobData.title);

    // Convert frontend types to database types
    const dbJobType = jobData.jobType
      ? JOB_TYPE_MAPPING[jobData.jobType]
      : null;
    const dbJobCategory = jobData.jobCategory
      ? JOB_CATEGORY_MAPPING[jobData.jobCategory]
      : null;

    // More specific validation
    if (jobData.jobType && !dbJobType) {
      return {
        ok: false,
        message: `Invalid job type: ${jobData.jobType}`,
        data: null,
      };
    }
    if (jobData.jobCategory && !dbJobCategory) {
      return {
        ok: false,
        message: `Invalid job category: ${jobData.jobCategory}`,
        data: null,
      };
    }

    const result = await db
      .insert(jobs)
      .values({
        title: jobData?.title?.trim() || "Undefined Title",
        description: jobData.description?.trim() ?? null,
        salaryAmount: jobData.salaryAmount?.toString() ?? null,
        salaryCurrency: jobData.salaryCurrency || "USD",
        salaryType: jobData.salaryType || "hourly",
        location: jobData.location?.trim() ?? null,
        jobType: dbJobType as DatabaseJobType | null,
        jobCategory: dbJobCategory as DatabaseJobCategory | null,
        remoteAllowed: jobData.remoteAllowed || false,
        slug,
        status: jobData.status || "active",
        postedById: jobData.postedById,
        numberOfTalents: jobData.numberOfTalents || 1,
        tags: jobData.tags || [],
      } satisfies typeof jobs.$inferInsert)
      .returning();

    return {
      ok: true,
      message: "Job created successfully",
      data: formatJobForResponse(result[0]),
    };
  } catch (error) {
    log("Error creating job:", "error", error);
    return {
      ok: false,
      message: "Failed to create job",
      data: null,
    };
  }
}

export async function updateJob(jobData: UpdateJobData) {
  try {
    console.log("updateJob called with:", jobData);

    const session = await auth();
    console.log("Session in updateJob:", session?.user?.id);

    if (!session?.user) {
      console.log("No session in updateJob");
      return {
        ok: false,
        message: "Authentication required",
        data: null,
      };
    }

    const updateData: any = { ...jobData };
    delete updateData.id;
    console.log("Update data before processing:", updateData);

    if (jobData.title) {
      updateData.slug = await generateUniqueSlug(jobData.title, jobData.id);
      updateData.title = jobData.title.trim();
    }

    if (jobData.description !== undefined) {
      updateData.description = jobData.description?.trim();
    }

    if (jobData.location !== undefined) {
      updateData.location = jobData.location?.trim();
    }

    if (jobData.salaryAmount !== undefined) {
      updateData.salaryAmount = jobData.salaryAmount?.toString();
    }

    if (jobData.jobType) {
      console.log(
        "Mapping jobType:",
        jobData.jobType,
        "to:",
        JOB_TYPE_MAPPING[jobData.jobType]
      );
      updateData.jobType = JOB_TYPE_MAPPING[jobData.jobType];
    }

    if (jobData.jobCategory) {
      console.log(
        "Mapping jobCategory:",
        jobData.jobCategory,
        "to:",
        JOB_CATEGORY_MAPPING[jobData.jobCategory]
      );
      updateData.jobCategory = JOB_CATEGORY_MAPPING[jobData.jobCategory];
    }

    updateData.updatedAt = new Date();
    console.log("Final update data:", updateData);

    const result = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, jobData.id))
      .returning();

    console.log("Database update result:", result);

    if (result.length === 0) {
      console.log("No rows updated");
      return {
        ok: false,
        message: "Job not found",
        data: null,
      };
    }

    const formatted = formatJobForResponse(result[0]);
    console.log("Formatted response:", formatted);

    return {
      ok: true,
      message: "Job updated successfully",
      data: formatted,
    };
  } catch (error) {
    console.error("Error in updateJob:", error);
    log("Error updating job:", "error", error);
    return {
      ok: false,
      message: "Failed to update job",
      data: null,
    };
  }
}

export async function deleteJob(id: number) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        ok: false,
        message: "Authentication required",
      };
    }

    await db.delete(jobs).where(eq(jobs.id, id));

    return {
      ok: true,
      message: "Job deleted successfully",
    };
  } catch (error) {
    log("Error deleting job:", "error", error);
    return {
      ok: false,
      message: "Failed to delete job",
    };
  }
}

// ADVANCED SEARCH FUNCTIONS

export async function searchJobs(
  query: string,
  filters?: any,
  limit: number = 20
) {
  const searchFilters = convertFrontendFilters({ ...filters, search: query });
  return await getJobs({
    filters: searchFilters,
    limit,
    sortBy: "createdAt",
    sortDesc: true,
  });
}

export async function getJobsByRecruiter(userId: string, limit: number = 50) {
  return await getJobs({
    filters: { postedById: userId },
    limit,
    sortBy: "createdAt",
    sortDesc: true,
  });
}

export async function getJobsFromUrl(searchParams: URLSearchParams) {
  const filters = parseUrlSearchParams(searchParams);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  return await getJobs({
    filters,
    limit,
    offset,
    sortBy: "createdAt",
    sortDesc: true,
  });
}

// EXPORT UTILITIES FOR SERVICE LAYER
export {
  convertFrontendFilters,
  parseUrlSearchParams,
  formatJobForResponse,
  JOB_TYPE_MAPPING,
  JOB_CATEGORY_MAPPING,
};
