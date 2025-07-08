import { Badge } from "@/components/ui/badge";
import { INotification } from "@/types/notification";
import {
  ExternalLink,
  Briefcase,
  Info,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const notificationIcons = {
  job_submissions: <Briefcase className="w-5 h-5 text-brand-light" />,
  jobs: <FileText className="w-5 h-5 text-brand" />,
  info: <Info className="w-5 h-5 text-zinc-600" />,
  success: <CheckCircle className="w-5 h-5 text-brand-light" />,
  error: <XCircle className="w-5 h-5 text-danger" />,
  default: <Info className="w-5 h-5 text-zinc-600" />,
};

const notificationTypeBadges = {
  job_submissions: "bg-brand-light/10 text-brand-light border-brand-light/20",
  jobs: "bg-brand/10 text-brand border-brand/20",
  info: "bg-gray-50 text-zinc-700 border-gray-200",
  success: "bg-brand-light/10 text-brand-light border-brand-light/20",
  error: "bg-danger/10 text-danger border-danger/20",
};

const notificationTypeLabels = {
  job_submissions: "Job Application",
  jobs: "Job",
  info: "Info",
  success: "Success",
  error: "Error",
};

interface NotificationCardProps {
  notification: INotification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
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
    <div className="group relative">
      <Link
        href={notification.link || "#"}
        className="flex items-start space-x-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted hover:border-border hover:shadow-sm transition-all duration-200"
        target={isExternalLink ? "_blank" : "_self"}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
      >
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-10 h-10 rounded-full bg-gray-50 border border-border flex items-center justify-center group-hover:bg-muted group-hover:border-border transition-colors">
            {getNotificationIcon(
              notification.type ? notification.type : "default"
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
              {notification.message}
            </p>
            {isExternalLink && (
              <ExternalLink className="h-4 w-4 text-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-foreground">
              <Clock className="w-3 h-3" />
              <time
                dateTime={
                  notification.createdAt
                    ? notification.createdAt
                    : new Date().toISOString()
                }
              >
                {formatTime(
                  notification.createdAt
                    ? notification.createdAt
                    : new Date().toISOString()
                )}
              </time>
            </div>

            {notification.type && notification.type !== "info" && (
              <Badge
                variant="outline"
                className={`text-xs font-medium ${
                  notificationTypeBadges[
                    notification.type as keyof typeof notificationTypeBadges
                  ] || "bg-gray-50 text-foreground/70 border-border"
                }`}
              >
                {notificationTypeLabels[
                  notification.type as keyof typeof notificationTypeLabels
                ] || notification.type}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
