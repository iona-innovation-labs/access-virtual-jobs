// hooks/use-notifications.ts

import { useState, useEffect, useCallback } from "react";
import {
  INotification,
  NotificationsResponse,
  MarkAsReadRequest,
} from "@/types/notification";

interface UseNotificationsProps {
  filter?: string;
  read?: "true" | "false"; // filter by read status
  sortBy?: string; // sort option
  limit?: number; // items per page
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useNotifications({
  filter = "all",
  read,
  sortBy = "newest",
  limit = 10,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: UseNotificationsProps = {}) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchNotifications = useCallback(async (
    pageNum: number = 1, 
    append: boolean = false
  ) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const params = new URLSearchParams({
        filter,
        sortBy,
        page: pageNum.toString(),
        limit: limit.toString(),
        ...(read && { read }),
      });

      const response = await fetch(`/api/notifications?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NotificationsResponse = await response.json();

      if (append && pageNum > 1) {
        // Append new notifications to existing ones
        setNotifications(prev => [...prev, ...data.notifications]);
      } else {
        // Replace notifications (new search/filter/sort)
        setNotifications(data.notifications);
      }
      
      setUnreadCount(data.unreadCount);
      setTotal(data.total);
      setCurrentPage(pageNum);
      
      // Calculate if there are more pages
      const totalPages = Math.ceil(data.total / limit);
      setHasMore(pageNum < totalPages);
      
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter, read, sortBy, limit]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchNotifications(nextPage, true);
    }
  }, [currentPage, loadingMore, hasMore, fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationIds: number[], markAsRead: boolean = true) => {
      try {
        const requestBody: MarkAsReadRequest = {
          notificationIds,
          markAsRead,
        };

        const response = await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notificationIds.includes(notification.id)
              ? { ...notification, isRead: markAsRead }
              : notification
          )
        );

        // Update unread count
        if (markAsRead) {
          setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
        } else {
          setUnreadCount((prev) => prev + notificationIds.length);
        }

        return true;
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
        return false;
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);

      return true;
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      return false;
    }
  }, []);

  const markSingleAsRead = useCallback(
    async (notificationId: number) => {
      return markAsRead([notificationId], true);
    },
    [markAsRead]
  );

  const markSingleAsUnread = useCallback(
    async (notificationId: number) => {
      return markAsRead([notificationId], false);
    },
    [markAsRead]
  );

  const refetch = useCallback(() => {
    setCurrentPage(1);
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  // Reset to page 1 when filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
    fetchNotifications(1, false);
  }, [filter, sortBy, read]);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        // Only refresh the first page to avoid disrupting continuous scrolling
        if (currentPage === 1) {
          fetchNotifications(1, false);
        }
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, currentPage, fetchNotifications]);

  return {
    notifications,
    loading,
    loadingMore,
    error,
    unreadCount,
    total,
    currentPage,
    hasMore,
    refetch,
    loadMore,
    markAsRead,
    markAllAsRead,
    markSingleAsRead,
    markSingleAsUnread,
  };
}