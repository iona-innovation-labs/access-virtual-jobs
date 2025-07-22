"use client";

import { useState, useEffect } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { INotification } from "@/types/notification";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationCardCompact } from "./notification-card-compact";
import Link from "next/link";

interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, loading, unreadCount, markAllAsRead } =
    useNotifications({
      filter: "all",
      limit: 5, // Limit to recent 5 notifications for dropdown
    });

  const handleNotificationClick = async () => {
    setIsOpen(false);
  };

  // Automatically mark all as read when dropdown opens and there are unread notifications
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="shadow-none border-none">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-10 w-10 rounded-md shadow-sm transition-colors",
            isOpen
              ? "bg-brand text-white hover:bg-brand/90"
              : "bg-background hover:bg-muted border border-border",
            className
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center min-w-[20px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">
            Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <DropdownMenuLabel className="p-0 text-base font-semibold text-foreground">
            Recent Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <DropdownMenuSeparator className="mx-0" />

        {/* Notifications List - Scrollable */}
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 animate-pulse"
                >
                  <div className="w-8 h-8 bg-muted rounded-md flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications?.length > 0 ? (
            <div className="px-2 py-2 space-y-1">
              {notifications.map((notification: INotification) => (
                <NotificationCardCompact
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick()}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No new notifications
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          )}
        </div>

        {/* Footer - Always at bottom */}
        {notifications?.length > 0 && (
          <>
            <DropdownMenuSeparator className="mx-0" />
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between h-9 text-sm hover:bg-muted transition-colors"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/app/notifications">
                  View All Notifications
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
