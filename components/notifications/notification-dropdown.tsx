"use client";

import { useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { INotification } from "@/types/notification";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationCardCompact } from "./notification-card-compact";

interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, loading } = useNotifications({
    filter: "all",
  });

  //const unreadCount = implement this in backend, add isRead field

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-10 w-10 rounded-md shadow-sm transition-colors",
            isOpen ? "bg-brand text-white" : "bg-muted hover:bg-muted/80",
            className
          )}
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            Recent Notifications
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator className="mx-4" />

        {/* Notifications List */}
        <div className="max-h-80">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 animate-pulse"
                >
                  <div className="w-8 h-8 bg-muted rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications?.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="p-2">
                {notifications.map((notification: INotification) => (
                  <NotificationCardCompact
                    key={notification.id}
                    notification={notification}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No new notifications
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications?.length > 0 && (
          <>
            <DropdownMenuSeparator className="mx-4" />
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between h-8 text-sm hover:bg-muted"
                asChild
              >
                <a href="/app/notifications">
                  View All Notifications
                  <ChevronRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
