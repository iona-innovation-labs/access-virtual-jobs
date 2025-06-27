import { and, eq, desc, count, sql, asc, or, ilike } from "drizzle-orm";

import { db } from "@/database";
import { userBookmarks } from "@/database/schema/user-bookmarks";
import { jobs } from "@/database/schema/jobs";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";

// Response interfaces
interface BookmarkResult {
  ok: boolean;
  message: string;
  data?: any;
}

interface BookmarkedJob {
  id: number;
  title: string;
  description: string | null;
  salaryAmount: number | null;
  salaryCurrency: string;
  salaryType: "hourly" | "monthly" | "yearly";
  pay: string;
  location: string | null;
  jobType: string | null;
  jobCategory: string | null;
  remoteAllowed: boolean;
  slug: string;
  status: "active" | "inactive" | "closed";
  url: string;
  postedById: string;
  postedByName: string;
  createdAt: Date;
  updatedAt: Date;
  bookmarkedAt: Date;
  numberOfTalents: number | null;
  tags: string[] | null;
  alsoPostedOn: string[] | null;
}

/**
 * Add a job to user's bookmarks
 */
export async function addBookmark(
  userId: string,
  jobId: number
): Promise<BookmarkResult> {
  try {
    // Check if the table exists first
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_bookmarks'
      );
    `);

    const tableExists = tableCheck.rows[0]?.exists;

    if (!tableExists) {
      return {
        ok: false,
        message:
          "Bookmarks feature is not yet available. Please run the database migration first.",
      };
    }

    // Check if bookmark already exists
    const existing = await db
      .select()
      .from(userBookmarks)
      .where(
        and(eq(userBookmarks.userId, userId), eq(userBookmarks.jobId, jobId))
      )
      .limit(1);

    if (existing.length > 0) {
      return {
        ok: false,
        message: "Job is already bookmarked",
      };
    }

    // Verify job exists and is active
    const job = await db
      .select({ id: jobs.id, status: jobs.status })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (job.length === 0) {
      return {
        ok: false,
        message: "Job not found",
      };
    }

    if (job[0].status !== "active") {
      return {
        ok: false,
        message: "Cannot bookmark inactive job",
      };
    }

    // Add bookmark
    const result = await db
      .insert(userBookmarks)
      .values({
        userId,
        jobId,
      })
      .returning();

    log(`User ${userId} bookmarked job ${jobId}`, "info");

    return {
      ok: true,
      message: "Job bookmarked successfully",
      data: result[0],
    };
  } catch (error) {
    log("Error adding bookmark:", "error", error);
    return {
      ok: false,
      message: "Failed to bookmark job",
    };
  }
}

/**
 * Remove a job from user's bookmarks
 */
export async function removeBookmark(
  userId: string,
  jobId: number
): Promise<BookmarkResult> {
  try {
    const result = await db
      .delete(userBookmarks)
      .where(
        and(eq(userBookmarks.userId, userId), eq(userBookmarks.jobId, jobId))
      )
      .returning();

    if (result.length === 0) {
      return {
        ok: false,
        message: "Bookmark not found",
      };
    }

    log(`User ${userId} removed bookmark for job ${jobId}`, "info");

    return {
      ok: true,
      message: "Bookmark removed successfully",
      data: result[0],
    };
  } catch (error) {
    log("Error removing bookmark:", "error", error);
    return {
      ok: false,
      message: "Failed to remove bookmark",
    };
  }
}

/**
 * Check if a job is bookmarked by user
 */
export async function isJobBookmarked(
  userId: string,
  jobId: number
): Promise<BookmarkResult> {
  try {
    // Check if the table exists first
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_bookmarks'
      );
    `);

    const tableExists = tableCheck.rows[0]?.exists;

    if (!tableExists) {
      log("user_bookmarks table does not exist yet", "warn");
      return {
        ok: true,
        message: "Bookmark status retrieved",
        data: { isBookmarked: false },
      };
    }

    const result = await db
      .select()
      .from(userBookmarks)
      .where(
        and(eq(userBookmarks.userId, userId), eq(userBookmarks.jobId, jobId))
      )
      .limit(1);

    return {
      ok: true,
      message: "Bookmark status retrieved",
      data: { isBookmarked: result.length > 0 },
    };
  } catch (error) {
    log("Error checking bookmark status:", "error", error);
    return {
      ok: false,
      message: "Failed to check bookmark status",
      data: { isBookmarked: false },
    };
  }
}

/**
 * Get all bookmarked jobs for a user with pagination
 */
export async function getBookmarksByUser(
  userId: string,
  limit: number = 20,
  offset: number = 0,
  search?: string,
  sortBy: string = "createdAt",
  sortDesc: boolean = true
): Promise<BookmarkResult> {
  try {
    let query = db
      .select({
        // Job fields
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
        numberOfTalents: jobs.numberOfTalents,
        tags: jobs.tags,
        alsoPostedOn: jobs.alsoPostedOn,
        // User/bookmark fields
        postedByName: users.name,
        bookmarkedAt: userBookmarks.createdAt,
      })
      .from(userBookmarks)
      .innerJoin(jobs, eq(userBookmarks.jobId, jobs.id))
      .leftJoin(users, eq(jobs.postedById, users.id))
      .where(eq(userBookmarks.userId, userId));

    // Add search condition if provided
    if (search && search.trim()) {
      query = query.where(
        and(
          eq(userBookmarks.userId, userId),
          or(
            ilike(jobs.title, `%${search.trim()}%`),
            ilike(jobs.description, `%${search.trim()}%`)
          )
        )
      );
    }

    // Add sorting
    let orderBy;
    switch (sortBy) {
      case "title":
        orderBy = sortDesc ? desc(jobs.title) : asc(jobs.title);
        break;
      case "salaryAmount":
        orderBy = sortDesc ? desc(jobs.salaryAmount) : asc(jobs.salaryAmount);
        break;
      case "createdAt":
      default:
        orderBy = sortDesc
          ? desc(userBookmarks.createdAt)
          : asc(userBookmarks.createdAt);
        break;
    }

    const result = await query.orderBy(orderBy).limit(limit).offset(offset);

    // Format jobs for response (reuse existing formatting logic)
    const formattedJobs: BookmarkedJob[] = result.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      salaryAmount: row.salaryAmount ? parseFloat(row.salaryAmount) : null,
      salaryCurrency: row.salaryCurrency,
      salaryType: row.salaryType,
      pay: formatSalaryDisplay(
        row.salaryAmount ? parseFloat(row.salaryAmount) : null,
        row.salaryCurrency,
        row.salaryType
      ),
      location: row.location,
      jobType: row.jobType,
      jobCategory: row.jobCategory,
      remoteAllowed: row.remoteAllowed,
      slug: row.slug,
      status: row.status,
      url: generateJobURL(row.id, row.slug),
      postedById: row.postedById,
      postedByName: row.postedByName || "Unknown",
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      bookmarkedAt: row.bookmarkedAt,
      numberOfTalents: row.numberOfTalents,
      tags: row.tags,
      alsoPostedOn: row.alsoPostedOn,
    }));

    return {
      ok: true,
      message: "Bookmarks retrieved successfully",
      data: formattedJobs,
    };
  } catch (error) {
    log("Error getting user bookmarks:", "error", error);
    return {
      ok: false,
      message: "Failed to retrieve bookmarks",
      data: [],
    };
  }
}

/**
 * Get total count of user's bookmarks
 */
export async function getUserBookmarksCount(
  userId: string,
  search?: string
): Promise<BookmarkResult> {
  try {
    let query = db
      .select({ count: count() })
      .from(userBookmarks)
      .innerJoin(jobs, eq(userBookmarks.jobId, jobs.id))
      .where(and(eq(userBookmarks.userId, userId), eq(jobs.status, "active")));

    // Add search condition if provided
    if (search && search.trim()) {
      query = query.where(
        and(
          eq(userBookmarks.userId, userId),
          eq(jobs.status, "active"),
          or(
            ilike(jobs.title, `%${search.trim()}%`),
            ilike(jobs.description, `%${search.trim()}%`)
          )
        )
      );
    }

    const result = await query;

    return {
      ok: true,
      message: "Bookmark count retrieved",
      data: result[0]?.count || 0,
    };
  } catch (error) {
    log("Error getting bookmark count:", "error", error);
    return {
      ok: false,
      message: "Failed to get bookmark count",
      data: 0,
    };
  }
}

/**
 * Get multiple bookmark statuses for jobs (for job list optimization)
 */
export async function getJobBookmarkStatuses(
  userId: string,
  jobIds: number[]
): Promise<BookmarkResult> {
  try {
    if (jobIds.length === 0) {
      return {
        ok: true,
        message: "No jobs to check",
        data: {},
      };
    }

    const result = await db
      .select({
        jobId: userBookmarks.jobId,
      })
      .from(userBookmarks)
      .where(
        and(
          eq(userBookmarks.userId, userId)
          // Use inArray for multiple job IDs
          // Note: You might need to import `inArray` from drizzle-orm
          // inArray(userBookmarks.jobId, jobIds)
        )
      );

    // Create a map of job ID -> isBookmarked
    const bookmarkMap: Record<number, boolean> = {};
    jobIds.forEach((jobId) => {
      bookmarkMap[jobId] = result.some((bookmark) => bookmark.jobId === jobId);
    });

    return {
      ok: true,
      message: "Bookmark statuses retrieved",
      data: bookmarkMap,
    };
  } catch (error) {
    log("Error getting bookmark statuses:", "error", error);
    return {
      ok: false,
      message: "Failed to get bookmark statuses",
      data: {},
    };
  }
}

/**
 * Remove all bookmarks for jobs that are no longer active (cleanup function)
 */
export async function cleanupInactiveBookmarks(): Promise<BookmarkResult> {
  try {
    const result = await db
      .delete(userBookmarks)
      .where(
        // Subquery to find bookmarks for inactive jobs
        eq(
          userBookmarks.jobId,
          db
            .select({ id: jobs.id })
            .from(jobs)
            .where(eq(jobs.status, "inactive") as any)
        ) as any
      )
      .returning();

    log(`Cleaned up ${result.length} inactive job bookmarks`, "info");

    return {
      ok: true,
      message: `Cleaned up ${result.length} inactive bookmarks`,
      data: result.length,
    };
  } catch (error) {
    log("Error cleaning up bookmarks:", "error", error);
    return {
      ok: false,
      message: "Failed to cleanup bookmarks",
      data: 0,
    };
  }
}

// Helper functions (you can move these to a shared utils file)
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

function generateJobURL(id: number, slug: string): string {
  return `/app/jobs/v/${id}-${slug}`;
}
