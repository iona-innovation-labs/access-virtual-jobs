import type {
  FrontendJobType,
  FrontendJobCategory,
  FrontendSalaryRange,
  DatabaseJobType,
  DatabaseJobCategory,
} from "@/types/jobs";
import { PUBLIC_JOB_CATEGORIES, PUBLIC_JOB_TYPES } from "@/lib/constants";

// CONSTANTS

export const FRONTEND_JOB_TYPES: FrontendJobType[] = PUBLIC_JOB_TYPES.map(
  (type) => type.label
);

export const FRONTEND_JOB_CATEGORIES: FrontendJobCategory[] =
  PUBLIC_JOB_CATEGORIES.map((category) => category.label);

export const FRONTEND_SALARY_RANGES: FrontendSalaryRange[] = [
  "Less than $3",
  "$3 - $4.99",
  "$5 - $7.99",
  "$8 - $9.99",
  "More than $10",
];

// MAPPING FUNCTIONS

export const JOB_TYPE_MAPPING: Record<FrontendJobType, DatabaseJobType> = {
  Freelance: "freelance",
  "Full-time": "full-time",
  "Part-time": "part-time",
  Contract: "contract",
};

// Updated job category mapping using constants
export const JOB_CATEGORY_MAPPING: Record<string, string> = {};
PUBLIC_JOB_CATEGORIES.forEach((category) => {
  JOB_CATEGORY_MAPPING[category.label] = category.key;
});

// Reverse mappings
export const DB_TO_FRONTEND_JOB_TYPE: Record<DatabaseJobType, FrontendJobType> =
  Object.fromEntries(
    Object.entries(JOB_TYPE_MAPPING).map(([k, v]) => [v, k])
  ) as Record<DatabaseJobType, FrontendJobType>;

export const DB_TO_FRONTEND_JOB_CATEGORY: Record<
  DatabaseJobCategory,
  FrontendJobCategory
> = Object.fromEntries(
  Object.entries(JOB_CATEGORY_MAPPING).map(([k, v]) => [v, k])
) as Record<DatabaseJobCategory, FrontendJobCategory>;

// CONVERSION FUNCTIONS

/**
 * Convert frontend job type to database format
 */
export function frontendToDbJobType(
  frontendType: FrontendJobType
): DatabaseJobType {
  return JOB_TYPE_MAPPING[frontendType];
}

/**
 * Convert database job type to frontend format
 */
export function dbToFrontendJobType(dbType: DatabaseJobType): FrontendJobType {
  return DB_TO_FRONTEND_JOB_TYPE[dbType];
}

/**
 * Convert frontend job category to database format
 */
export function frontendToDbJobCategory(
  frontendCategory: FrontendJobCategory
): DatabaseJobCategory {
  // Ensure we have a valid mapping by checking if the category exists
  if (!(frontendCategory in JOB_CATEGORY_MAPPING)) {
    throw new Error(`Invalid job category: ${frontendCategory}`);
  }
  return JOB_CATEGORY_MAPPING[frontendCategory] as DatabaseJobCategory;
}

/**
 * Convert database job category to frontend format
 */
export function dbToFrontendJobCategory(
  dbCategory: DatabaseJobCategory
): FrontendJobCategory {
  return DB_TO_FRONTEND_JOB_CATEGORY[dbCategory];
}

/**
 * Parse salary range string to min/max values
 */
export function parseSalaryRange(salaryRange: FrontendSalaryRange): {
  min?: number;
  max?: number;
} {
  switch (salaryRange) {
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

/**
 * Convert salary amount to range string (reverse of parseSalaryRange)
 */
export function salaryAmountToRange(
  amount: number
): FrontendSalaryRange | null {
  if (amount < 3) return "Less than $3";
  if (amount >= 3 && amount < 5) return "$3 - $4.99";
  if (amount >= 5 && amount < 8) return "$5 - $7.99";
  if (amount >= 8 && amount < 10) return "$8 - $9.99";
  if (amount >= 10) return "More than $10";
  return null;
}

// URL GENERATION FUNCTIONS

/**
 * Generate SEO-friendly URL for a job
 */
export function generateJobURL(
  jobId: string,
  title: string,
  isApp?: boolean
): string {
  const slug = generateSlug(title);
  const urlFriendlyTitle = `${jobId}-${slug}`;

  return isApp
    ? `/app/jobs/v/${urlFriendlyTitle}`
    : `/talent/find-work/${urlFriendlyTitle}`;
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100); // Keep reasonable length
}

/**
 * Parse job ID from URL path
 */
export function parseJobIdFromUrl(urlPath: string): string | null {
  // Handle formats like: "/talent/find-work/123-job-title" or "123-job-title"
  const parts = urlPath.split("/");
  const lastPart = parts[parts.length - 1];

  if (lastPart.includes("-")) {
    const idPart = lastPart.split("-")[0];
    return idPart || null;
  }

  return lastPart || null;
}

// VALIDATION FUNCTIONS

/**
 * Check if job type is valid
 */
export function isValidJobType(jobType: string): jobType is FrontendJobType {
  return FRONTEND_JOB_TYPES.includes(jobType as FrontendJobType);
}

/**
 * Check if job category is valid
 */
export function isValidJobCategory(
  jobCategory: string
): jobCategory is FrontendJobCategory {
  return FRONTEND_JOB_CATEGORIES.includes(jobCategory as FrontendJobCategory);
}

/**
 * Check if salary range is valid
 */
export function isValidSalaryRange(
  salaryRange: string
): salaryRange is FrontendSalaryRange {
  return FRONTEND_SALARY_RANGES.includes(salaryRange as FrontendSalaryRange);
}

/**
 * Validate and sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML
    .substring(0, 200); // Limit length
}

/**
 * Validate email format (for notifications, etc.)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// FORMATTING FUNCTIONS

/**
 * Format salary for display
 */
export function formatSalaryDisplay(
  amount: number | null,
  currency: string = "USD",
  type: "hourly" | "monthly" | "yearly" = "hourly"
): string {
  if (!amount) return "Salary not provided";

  const formatted = `${currency} ${amount.toFixed(2)}`;

  switch (type) {
    case "hourly":
      return `${formatted} / hr`;
    case "monthly":
      return `${formatted} / month`;
    case "yearly":
      return `${formatted} / year`;
    default:
      return formatted;
  }
}

/**
 * Format job posting date
 */
export function formatJobDate(
  date: Date,
  type: "posted" | "updated" = "posted"
): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  const prefix = type === "posted" ? "Posted" : "Updated";

  if (diffInMinutes < 60) {
    return `${prefix} ${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${prefix} ${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return `${prefix} yesterday`;
  } else if (diffInDays < 7) {
    return `${prefix} ${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${prefix} ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else {
    return `${prefix} on ${date.toLocaleDateString()}`;
  }
}

/**
 * Format skills list for display
 */
export function formatSkillsList(
  skills: string[],
  maxDisplay: number = 5
): string {
  if (!skills || skills.length === 0) return "No skills specified";

  if (skills.length <= maxDisplay) {
    return skills.join(", ");
  }

  const displaySkills = skills.slice(0, maxDisplay);
  const remainingCount = skills.length - maxDisplay;

  return `${displaySkills.join(", ")} +${remainingCount} more`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + "...";
}

// ANALYTICS HELPERS

/**
 * Calculate conversion rate percentage
 */
export function calculateConversionRate(
  applications: number,
  views: number
): string {
  if (views === 0) return "0.00";
  return ((applications / views) * 100).toFixed(2);
}

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(numbers: number[]): string {
  if (numbers.length === 0) return "0.00";
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
}

/**
 * Get job performance score (0-100)
 */
export function calculateJobPerformanceScore(
  views: number,
  applications: number,
  daysActive: number
): number {
  // Simple scoring algorithm - can be enhanced
  const viewsScore = Math.min(views / 10, 50); // Max 50 points for views
  const applicationsScore = Math.min(applications * 10, 30); // Max 30 points for applications
  const freshnessScore = Math.max(20 - daysActive, 0); // Max 20 points for freshness

  return Math.round(viewsScore + applicationsScore + freshnessScore);
}

// SEARCH HELPERS

/**
 * Extract keywords from job description for search indexing
 */
export function extractKeywords(text: string): string[] {
  if (!text) return [];

  // Remove common words and extract meaningful terms
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "we",
    "you",
    "they",
    "it",
    "he",
    "she",
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Replace punctuation with spaces
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word))
    .slice(0, 20); // Limit to 20 keywords
}

/**
 * Calculate search relevance score
 */
export function calculateSearchRelevance(
  searchQuery: string,
  jobTitle: string,
  jobDescription: string,
  skills: string[]
): number {
  const query = searchQuery.toLowerCase();
  const title = jobTitle.toLowerCase();
  const description = jobDescription?.toLowerCase() || "";
  const skillsText = skills.join(" ").toLowerCase();

  let score = 0;

  // Title matches (highest weight)
  if (title.includes(query)) score += 50;

  // Skills matches (high weight)
  if (skillsText.includes(query)) score += 30;

  // Description matches (medium weight)
  if (description.includes(query)) score += 20;

  // Partial matches in title
  const queryWords = query.split(" ");
  queryWords.forEach((word) => {
    if (word.length > 2 && title.includes(word)) score += 10;
    if (word.length > 2 && skillsText.includes(word)) score += 5;
  });

  return Math.min(score, 100); // Cap at 100
}

// FILTER HELPERS

/**
 * Build filter summary text for display
 */
export function buildFilterSummary(filters: {
  query?: string;
  jobType?: string[];
  jobCategory?: string[];
  salaryRange?: string;
  remote?: boolean;
}): string {
  const parts: string[] = [];

  if (filters.query) {
    parts.push(`"${filters.query}"`);
  }

  if (filters.jobType && filters.jobType.length > 0) {
    parts.push(`Type: ${filters.jobType.join(", ")}`);
  }

  if (filters.jobCategory && filters.jobCategory.length > 0) {
    const categories =
      filters.jobCategory.length > 2
        ? `${filters.jobCategory.slice(0, 2).join(", ")} +${filters.jobCategory.length - 2} more`
        : filters.jobCategory.join(", ");
    parts.push(`Category: ${categories}`);
  }

  if (filters.salaryRange) {
    parts.push(`Salary: ${filters.salaryRange}`);
  }

  if (filters.remote) {
    parts.push("Remote work");
  }

  return parts.length > 0 ? parts.join(" • ") : "All jobs";
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: {
  query?: string;
  jobType?: string[];
  jobCategory?: string[];
  salaryRange?: string;
  remote?: boolean;
}): number {
  let count = 0;

  if (filters.query) count++;
  if (filters.jobType && filters.jobType.length > 0) count++;
  if (filters.jobCategory && filters.jobCategory.length > 0) count++;
  if (filters.salaryRange) count++;
  if (filters.remote) count++;

  return count;
}

// PAGINATION HELPERS

/**
 * Calculate pagination info
 */
export function calculatePagination(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    startItem: Math.min(offset + 1, totalItems),
    endItem: Math.min(offset + itemsPerPage, totalItems),
  };
}

/**
 * Generate page numbers for pagination display
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | "...")[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  if (currentPage <= halfVisible + 1) {
    // Show first pages + ellipsis + last page
    for (let i = 1; i <= maxVisible - 1; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - halfVisible) {
    // Show first page + ellipsis + last pages
    pages.push(1);
    pages.push("...");
    for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show first page + ellipsis + middle pages + ellipsis + last page
    pages.push(1);
    pages.push("...");
    for (
      let i = currentPage - halfVisible + 1;
      i <= currentPage + halfVisible - 1;
      i++
    ) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}

// ERROR HANDLING HELPERS

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.name === "NetworkError" ||
    error?.message?.includes("fetch") ||
    error?.message?.includes("network")
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (isNetworkError(error)) {
    return "Please check your internet connection and try again.";
  }

  if (error?.message?.includes("unauthorized")) {
    return "You need to be logged in to perform this action.";
  }

  if (error?.message?.includes("forbidden")) {
    return "You don't have permission to perform this action.";
  }

  if (error?.message?.includes("not found")) {
    return "The requested job could not be found.";
  }

  return "Something went wrong. Please try again later.";
}

// CACHING HELPERS

/**
 * Generate cache key for job queries
 */
export function generateCacheKey(
  type: "jobs" | "job" | "count",
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join("|");

  return `${type}:${sortedParams}`;
}

/**
 * Check if cache is expired
 */
export function isCacheExpired(timestamp: number, maxAgeMs: number): boolean {
  return Date.now() - timestamp > maxAgeMs;
}

// EXPORT ALL UTILITIES AS DEFAULT OBJECT

export default {
  // Constants
  FRONTEND_JOB_TYPES,
  FRONTEND_JOB_CATEGORIES,
  FRONTEND_SALARY_RANGES,
  JOB_TYPE_MAPPING,
  JOB_CATEGORY_MAPPING,

  // Conversion functions
  frontendToDbJobType,
  dbToFrontendJobType,
  frontendToDbJobCategory,
  dbToFrontendJobCategory,
  parseSalaryRange,
  salaryAmountToRange,

  // URL functions
  generateJobURL,
  generateSlug,
  parseJobIdFromUrl,

  // Validation functions
  isValidJobType,
  isValidJobCategory,
  isValidSalaryRange,
  sanitizeSearchQuery,
  isValidEmail,

  // Formatting functions
  formatSalaryDisplay,
  formatJobDate,
  formatSkillsList,
  truncateText,

  // Analytics functions
  calculateConversionRate,
  calculateAverage,
  calculateJobPerformanceScore,

  // Search functions
  extractKeywords,
  calculateSearchRelevance,

  // Filter functions
  buildFilterSummary,
  countActiveFilters,

  // Pagination functions
  calculatePagination,
  generatePageNumbers,

  // Error handling
  isNetworkError,
  getUserFriendlyErrorMessage,

  // Caching
  generateCacheKey,
  isCacheExpired,
};
