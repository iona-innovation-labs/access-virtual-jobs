import { formatDistanceToNow } from "date-fns";
import { Building2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IJobApplication } from "@/types/jobs";

type AdminJobApplicationHeaderProps = {
  jobApplication: IJobApplication & {
    user?: {
      id: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
};

const AdminJobApplicationHeader = ({
  jobApplication,
}: AdminJobApplicationHeaderProps) => {
  const fullName = jobApplication.user
    ? `${jobApplication.user.firstName || ""} ${jobApplication.user.lastName || ""}`.trim() ||
      jobApplication.user.username ||
      "Unknown"
    : "Unknown Applicant";

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start space-x-4">
        {/* Company Icon */}
        <div className="w-16 h-16 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-8 h-8 text-brand" />
        </div>

        {/* Job Information */}
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-2">
              {jobApplication.job?.title || "Job Title"}
            </h1>

            <div className="flex items-center space-x-2 text-muted-foreground mb-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Access Virtual Jobs</span>
            </div>

            {/* Applicant Name */}
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span className="text-sm">
                Applicant:{" "}
                <span className="font-medium text-foreground">{fullName}</span>
              </span>
            </div>
          </div>

          {/* Application Date and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Applied{" "}
                  {jobApplication.submittedAt
                    ? formatDistanceToNow(
                        new Date(jobApplication.submittedAt),
                        {
                          addSuffix: true,
                        }
                      )
                    : "recently"}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              variant={
                jobApplication.status === "on_going" ? "default" : "secondary"
              }
              className={
                jobApplication.status === "on_going"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
              }
            >
              {jobApplication.status === "on_going" ? "Active" : "Archived"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobApplicationHeader;
