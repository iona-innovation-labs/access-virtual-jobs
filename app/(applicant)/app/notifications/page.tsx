"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useNotifications } from "@/hooks/use-notifications";
import { INotification } from "@/types/notification";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotificationCard } from "@/components/notifications/notification-card"; // Import the new component
import { Bell, Filter, Loader2 } from "lucide-react";

const notificationTypeLabels = {
  all: "All Notifications",
  job_submissions: "Job Applications",
  jobs: "Jobs",
  info: "Information",
  success: "Success",
  error: "Error",
};

// Loading skeleton for notification cards
function NotificationCardSkeleton() {
  return (
    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
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
  const [filterType, setFilterType] = useState("all");

  const { notifications, loading, error, hasMore, loadMore } = useNotifications(
    {
      filter: filterType,
    }
  );

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
    <div className="h-[calc(100vh-4.5rem)] overflow-auto">
      <div className="w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-brand" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Notifications
            </h1>
          </div>
          <p className="text-gray-600">
            Stay updated with your latest activities
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-sm border-0">
          {/* Filters Section */}
          <div className="border-b border-gray-200 px-6 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filter by:
                </span>
              </div>
              {notifications.length > 0 && (
                <Badge variant="secondary" className="bg-brand/10 text-brand">
                  {notifications.length} notification
                  {notifications.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            <div className="pb-6">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full max-w-xs bg-gray-100 border-gray-200">
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
                    <Bell className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {filterType === "all"
                      ? "You're all caught up! Check back later for new updates."
                      : `No ${notificationTypeLabels[filterType as keyof typeof notificationTypeLabels].toLowerCase()} found. Try selecting a different filter.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification: INotification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-8 mt-8 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                  className="min-w-32 border-gray-300 hover:bg-gray-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
