export interface IBookmark {
  userId: string;
  jobId: number;
  createdAt: Date;
}

// API Response interfaces
export interface BookmarkApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface BookmarkStatusResponse {
  success: boolean;
  isBookmarked: boolean;
}

export interface BookmarkStatusMapResponse {
  success: boolean;
  bookmarks: Record<number, boolean>;
}

export interface BookmarkedJobsResponse {
  success: boolean;
  items: IJobListing[];
  total: number;
  all: number;
  totalBookmarks?: number; // Optional total count
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Extended job listing interface with bookmark info
export interface IJobListingWithBookmark extends IJobListing {
  isBookmarked?: boolean;
  bookmarkedAt?: Date;
}

// Bookmark action types for frontend
export type BookmarkAction = "add" | "remove" | "toggle" | "status" | "list";

// Hook return types for React components
export interface UseBookmarkReturn {
  isBookmarked: boolean;
  isLoading: boolean;
  error: string | null;
  toggleBookmark: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

export interface UseBookmarksReturn {
  bookmarks: IJobListing[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}
