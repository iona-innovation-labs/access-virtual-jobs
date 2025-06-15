import {
  ExternalLink,
  Briefcase,
  Info,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { INotification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const notificationIcons = {
  job_submissions: <Briefcase className="w-4 h-4 text-brand-light" />,
  jobs: <FileText className="w-4 h-4 text-brand" />,
  info: <Info className="w-4 h-4 text-gray-600" />,
  success: <CheckCircle className="w-4 h-4 text-brand-light" />,
  error: <XCircle className="w-4 h-4 text-danger" />,
  default: <Info className="w-4 h-4 text-gray-600" />,
};

const notificationTypeBadges = {
  job_submissions: "bg-brand-light/10 text-brand-light",
  jobs: "bg-brand/10 text-brand",
  info: "bg-gray-100 text-gray-600",
  success: "bg-brand-light/10 text-brand-light",
  error: "bg-danger/10 text-danger",
};

interface NotificationCardCompactProps {
  notification: INotification;
  onClick?: () => void;
}

export function NotificationCardCompact({
  notification,
  onClick,
}: NotificationCardCompactProps) {
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  const getNotificationIcon = (type: string) => {
    return (
      notificationIcons[type as keyof typeof notificationIcons] ||
      notificationIcons.default
    );
  };

  const isExternalLink = notification.link?.startsWith("http");

  return (
    <Link
      href={notification.link || "#"}
      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 group"
      target={isExternalLink ? "_blank" : "_self"}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      onClick={onClick}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
          {getNotificationIcon(notification?.type || "default")}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug text-foreground line-clamp-2 group-hover:text-brand transition-colors">
            {notification.message}
          </p>
          {isExternalLink && (
            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground">
            {formatTime(notification.createdAt || new Date().toISOString())}
          </time>

          {notification.type && notification.type !== "info" && (
            <Badge
              variant="secondary"
              className={`text-xs h-5 px-2 ${
                notificationTypeBadges[
                  notification.type as keyof typeof notificationTypeBadges
                ] || "bg-gray-100 text-gray-600"
              }`}
            >
              {notification.type === "job_submissions"
                ? "App"
                : notification.type === "jobs"
                  ? "Job"
                  : notification.type}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
