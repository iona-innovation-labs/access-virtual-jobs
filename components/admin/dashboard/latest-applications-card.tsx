import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Briefcase } from "lucide-react";
import Link from "next/link";

interface Application {
  id: number;
  applicationPublicId: string;
  status: string;
  progress: string;
  submittedAt: string;
  jobTitle: string;
  jobId: number;
  userName: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  userEmail: string | null;
}

interface LatestApplicationsCardProps {
  applications: Application[];
}

function getStatusColor(status: string) {
  switch (status) {
    case "on_going":
      return "bg-blue-100 text-blue-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getProgressColor(progress: string) {
  switch (progress) {
    case "in_review":
      return "bg-yellow-100 text-yellow-800";
    case "reviewed":
      return "bg-green-100 text-green-800";
    case "initial_interview":
      return "bg-blue-100 text-blue-800";
    case "hired_signed":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}

function getUserDisplayName(application: Application) {
  if (application.userFirstName && application.userLastName) {
    return `${application.userFirstName} ${application.userLastName}`;
  }
  if (application.userFirstName) {
    return application.userFirstName;
  }
  if (application.userName) {
    return application.userName;
  }
  return application.userEmail || "Unknown User";
}

export function LatestApplicationsCard({
  applications,
}: LatestApplicationsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Latest Job Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No applications yet</p>
            <p className="text-sm">
              Applications will appear here once candidates start applying.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium truncate">
                      {getUserDisplayName(application)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    Applied for: {application.jobTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getProgressColor(application.progress)}
                    >
                      {application.progress.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:ml-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {formatDate(application.submittedAt)}
                    </span>
                  </div>
                  <Link
                    href={`/admin/app/submissions/v/${application.applicationPublicId}`}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {applications.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Link
              href="/admin/app/submissions"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all applications →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
