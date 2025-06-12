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
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useNotifications({
  filter = "all",
  read,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: UseNotificationsProps = {}) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        filter,
        ...(read && { read }),
      });

      const response = await fetch(`/api/notifications?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NotificationsResponse = await response.json();

      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setTotal(data.total);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [filter, read]);

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

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchNotifications, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    total,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    markSingleAsRead,
    markSingleAsUnread,
  };
}
