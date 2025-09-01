// @/lib/api/bookmarks.ts
import {
  addBookmark as addBookmarkDB,
  removeBookmark as removeBookmarkDB,
  getBookmarksByUser as getBookmarksByUserDB,
  getUserBookmarksCount as getUserBookmarksCountDB,
  isJobBookmarked as isJobBookmarkedDB,
  getJobBookmarkStatuses as getJobBookmarkStatusesDB,
} from "@/database/queries/bookmarks";
import { log } from "@/lib/logs";
import type { IJobListing } from "@/types/jobs";

// Service layer interfaces
export interface BookmarkResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface BookmarkedJobsResponse {
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

export interface BookmarkStatusResponse {
  success: boolean;
  isBookmarked: boolean;
}

export interface BookmarkStatusMapResponse {
  success: boolean;
  bookmarks: Record<number, boolean>;
}

/**
 * Add a job to user's bookmarks
 */
export async function addBookmark(
  userId: string,
  jobId: number
): Promise<BookmarkResponse> {
  try {
    // Validate inputs
    if (!userId || !jobId) {
      return {
        success: false,
        message: "User ID and Job ID are required",
      };
    }

    if (typeof jobId !== "number" || jobId <= 0) {
      return {
        success: false,
        message: "Invalid job ID",
      };
    }

    const result = await addBookmarkDB(userId, jobId);

    return {
      success: result.ok,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    log("Error in addBookmark service:", "error", error);
    return {
      success: false,
      message: "Failed to add bookmark",
    };
  }
}

/**
 * Remove a job from user's bookmarks
 */
export async function removeBookmark(
  userId: string,
  jobId: number
): Promise<BookmarkResponse> {
  try {
    // Validate inputs
    if (!userId || !jobId) {
      return {
        success: false,
        message: "User ID and Job ID are required",
      };
    }

    if (typeof jobId !== "number" || jobId <= 0) {
      return {
        success: false,
        message: "Invalid job ID",
      };
    }

    const result = await removeBookmarkDB(userId, jobId);

    return {
      success: result.ok,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    log("Error in removeBookmark service:", "error", error);
    return {
      success: false,
      message: "Failed to remove bookmark",
    };
  }
}

/**
 * Toggle bookmark status (add if not bookmarked, remove if bookmarked)
 */
export async function toggleBookmark(
  userId: string,
  jobId: number
): Promise<BookmarkResponse> {
  try {
    // First check if it's already bookmarked
    const statusResult = await isJobBookmarkedDB(userId, jobId);

    if (!statusResult.ok) {
      return {
        success: false,
        message: "Failed to check bookmark status",
      };
    }

    const isBookmarked = statusResult.data.isBookmarked;

    // Toggle the bookmark
    if (isBookmarked) {
      return await removeBookmark(userId, jobId);
    } else {
      return await addBookmark(userId, jobId);
    }
  } catch (error) {
    log("Error in toggleBookmark service:", "error", error);
    return {
      success: false,
      message: "Failed to toggle bookmark",
    };
  }
}

/**
 * Check if a specific job is bookmarked by user
 */
export async function isJobBookmarked(
  userId: string,
  jobId: number
): Promise<BookmarkStatusResponse> {
  try {
    if (!userId || !jobId) {
      return {
        success: false,
        isBookmarked: false,
      };
    }

    const result = await isJobBookmarkedDB(userId, jobId);

    return {
      success: result.ok,
      isBookmarked: result.data?.isBookmarked || false,
    };
  } catch (error) {
    log("Error in isJobBookmarked service:", "error", error);
    return {
      success: false,
      isBookmarked: false,
    };
  }
}

/**
 * Get all bookmarked jobs for a user with pagination
 */
export async function getBookmarkedJobs(
  userId: string,
  limit: number = 20,
  offset: number = 0,
  search?: string,
  sortBy: string = "createdAt",
  sortDesc: boolean = true
): Promise<BookmarkedJobsResponse> {
  try {
    if (!userId) {
      return {
        success: false,
        items: [],
        total: 0,
        all: 0,
      };
    }

    // Validate pagination parameters
    const validLimit = Math.min(Math.max(limit, 1), 100); // Between 1-100
    const validOffset = Math.max(offset, 0);

    const [bookmarksResult, countResult] = await Promise.all([
      getBookmarksByUserDB(
        userId,
        validLimit,
        validOffset,
        search,
        sortBy,
        sortDesc
      ),
      getUserBookmarksCountDB(userId, search),
    ]);

    if (!bookmarksResult.ok) {
      return {
        success: false,
        items: [],
        total: 0,
        all: 0,
      };
    }

    const totalCount = countResult.ok ? countResult.data : 0;
    const items = bookmarksResult.data || [];

    return {
      success: true,
      items: items.map(formatJobForFrontend),
      total: items.length,
      all: totalCount,
      pagination: {
        currentPage: Math.floor(validOffset / validLimit) + 1,
        totalPages: Math.ceil(totalCount / validLimit),
        hasNext: validOffset + validLimit < totalCount,
        hasPrev: validOffset > 0,
      },
    };
  } catch (error) {
    log("Error in getBookmarkedJobs service:", "error", error);
    return {
      success: false,
      items: [],
      total: 0,
      all: 0,
    };
  }
}

/**
 * Get bookmark statuses for multiple jobs (optimization for job lists)
 */
export async function getJobBookmarkStatuses(
  userId: string,
  jobIds: number[]
): Promise<BookmarkStatusMapResponse> {
  try {
    if (!userId || !jobIds.length) {
      return {
        success: true,
        bookmarks: {},
      };
    }

    // Validate job IDs
    const validJobIds = jobIds.filter((id) => typeof id === "number" && id > 0);

    if (validJobIds.length === 0) {
      return {
        success: true,
        bookmarks: {},
      };
    }

    const result = await getJobBookmarkStatusesDB(userId, validJobIds);

    return {
      success: result.ok,
      bookmarks: result.data || {},
    };
  } catch (error) {
    log("Error in getJobBookmarkStatuses service:", "error", error);
    return {
      success: false,
      bookmarks: {},
    };
  }
}

/**
 * Get user's bookmark count
 */
export async function getUserBookmarkCount(
  userId: string
): Promise<{ success: boolean; count: number }> {
  try {
    if (!userId) {
      return { success: false, count: 0 };
    }

    const result = await getUserBookmarksCountDB(userId);

    return {
      success: result.ok,
      count: result.data || 0,
    };
  } catch (error) {
    log("Error in getUserBookmarkCount service:", "error", error);
    return { success: false, count: 0 };
  }
}

/**
 * Format job data for frontend consumption
 */
function formatJobForFrontend(job: any): IJobListing {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    salaryAmount: job.salaryAmount,
    salaryCurrency: job.salaryCurrency,
    salaryType: job.salaryType,
    pay: job.pay,
    location: job.location,
    jobType: job.jobType as any,
    jobCategory: job.jobCategory as any,
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
  };
}

// Utility functions for client-side usage
export const bookmarkUtils = {
  /**
   * Check if user can bookmark jobs (must be logged in)
   */
  canBookmark: (userId?: string): boolean => {
    return Boolean(userId);
  },

  /**
   * Generate bookmark API URLs
   */
  getBookmarkApiUrl: (
    action: "add" | "remove" | "toggle" | "status" | "list"
  ) => {
    const base = "/api/bookmarks";
    switch (action) {
      case "add":
        return `${base}`;
      case "remove":
        return `${base}`;
      case "toggle":
        return `${base}/toggle`;
      case "status":
        return `${base}/status`;
      case "list":
        return `${base}`;
      default:
        return base;
    }
  },
};
