"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useNotifications } from "@/hooks/use-notifications";
import { INotification } from "@/types/notification";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotificationCard } from "@/components/notifications/notification-card";
import { Bell, SortAsc, SortDesc, Loader2 } from "lucide-react";

const notificationTypeLabels = {
  all: "All Notifications",
  job_submissions: "Job Applications",
  jobs: "Jobs",
  info: "Information",
  success: "Success",
  error: "Error",
};

const sortOptions = {
  newest: "Newest First",
  oldest: "Oldest First",
};

// Loading skeleton for notification cards
function NotificationCardSkeleton() {
  return (
    <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
      <div className="flex-shrink-0">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { status } = useSession();
  const filterType = "all";
  const [sortBy, setSortBy] = useState("newest");

  const { notifications, loading, error, loadingMore, hasMore, loadMore } =
    useNotifications({
      filter: filterType,
      sortBy: sortBy,
    });

  const handleLoadMore = () => {
    loadMore();
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };

  if (status === "loading") {
    return (
      <div className="w-full mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Card className="shadow-sm border-0">
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <NotificationCardSkeleton key={i} />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="w-full mx-auto px-6 py-8">
        <Alert className="max-w-md mx-auto">
          <Bell className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view your notifications.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)]">
      <div className="w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-brand" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Notifications
            </h1>
          </div>
          <p className="text-foreground/50">
            Stay updated with your latest activities
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-sm border-0">
          {/* Filters and Sort Section */}
          <div className="border-b border-border px-6 pt-6">
            <div className="pb-6 flex flex-col sm:flex-row gap-4">
              {/*
              <div className="flex-1">
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  Filter by type
                </label>
                <Select value={filterType} onValueChange={handleFilterChange}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.entries(notificationTypeLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
*/}
              {/* Sort Dropdown */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-foreground/80 mb-1">
                  Sort by
                </label>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="bg-card border-border">
                    <div className="flex items-center space-x-2">
                      {sortBy === "oldest" ? (
                        <SortAsc className="w-4 h-4 text-foreground/80" />
                      ) : (
                        <SortDesc className="w-4 h-4 text-foreground/80" />
                      )}
                      <SelectValue placeholder="Sort notifications" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {Object.entries(sortOptions).map(([value, label]) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="hover:bg-muted"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  Failed to load notifications: {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Notifications List */}
            <div className="space-y-4">
              {loading && notifications.length === 0 ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <NotificationCardSkeleton key={i} />
                  ))}
                </div>
              ) : notifications.length === 0 && !loading ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-10 h-10 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                    No notifications
                  </h3>
                  <p className="text-zinc-600 max-w-md mx-auto">
                    {filterType === "all"
                      ? "You're all caught up! Check back later for new updates."
                      : `No ${notificationTypeLabels[filterType as keyof typeof notificationTypeLabels].toLowerCase()} found. Try selecting a different filter.`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {notifications.map((notification: INotification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center pt-6">
                      <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        variant="outline"
                        className="min-w-[120px]"
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Show loading skeleton while loading more */}
                  {loadingMore && (
                    <div className="space-y-4 pt-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <NotificationCardSkeleton key={`loading-${i}`} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
