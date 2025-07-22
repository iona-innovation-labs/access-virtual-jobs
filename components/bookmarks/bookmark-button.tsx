"use client";

import { useState, useEffect } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";

interface BookmarkButtonProps {
  jobId: number;
  userId?: string;
  initialBookmarked?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showText?: boolean;
  className?: string;
}

interface BookmarkApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface BookmarkStatusResponse {
  success: boolean;
  isBookmarked: boolean;
}

export function BookmarkButton({
  jobId,
  userId,
  initialBookmarked = false,
  variant = "outline",
  size = "default",
  showText = false,
  className = "",
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Check initial bookmark status
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!userId || isInitialized) return;

      try {
        const response = await fetchApi<BookmarkStatusResponse>(
          `/bookmarks/status?jobId=${jobId}`
        );

        if (response.success) {
          setIsBookmarked(response.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        // Don't show error toast for initial check, just log it
      } finally {
        setIsInitialized(true);
      }
    };

    checkBookmarkStatus();
  }, [jobId, userId, isInitialized]);

  const handleToggleBookmark = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to bookmark jobs.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Optimistic update
      const previousState = isBookmarked;
      setIsBookmarked(!isBookmarked);

      const response = await fetchApi<BookmarkApiResponse>(
        `/bookmarks/toggle`,
        {
          method: "POST",
          body: JSON.stringify({ jobId }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.success) {
        toast({
          title: isBookmarked ? "Job Removed" : "Job Saved",
          description: isBookmarked
            ? "Job removed from your saved list."
            : "Job saved to your bookmarks!",
          variant: "default",
        });
      } else {
        // Revert optimistic update on failure
        setIsBookmarked(previousState);
        toast({
          title: "Error",
          description: response.message || "Failed to update bookmark.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Revert optimistic update on error
      setIsBookmarked(!isBookmarked);

      const errorMessage =
        error?.publicMessage || error?.message || "Failed to update bookmark.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if user is not logged in
  if (!userId) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`transition-all duration-200 hover:bg-brand-dark hover:text-white border border-brand cursor-pointer ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark
          className={`w-4 h-4 transition-colors ${
            isBookmarked
              ? "fill-current text-brand"
              : "text-muted-foreground hover:text-brand"
          }`}
        />
      )}

      {showText && (
        <span className="ml-2 text-sm">
          {isLoading ? "..." : isBookmarked ? "Saved" : "Save Job"}
        </span>
      )}
    </Button>
  );
}
