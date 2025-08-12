import { formatDistanceToNow } from "date-fns";
import { Building2, Calendar } from "lucide-react";

import { IJobApplicationHeaderDetails } from "@/types/jobs";

type JobHeaderProps = {
  jobApplication: IJobApplicationHeaderDetails;
};

const JobHeader = ({ jobApplication }: JobHeaderProps) => {
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
              {jobApplication?.title || "Job Title"}
            </h1>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Access Virtual Jobs</span>
            </div>
          </div>

          {/* Application Date */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Applied{" "}
                {jobApplication?.submittedAt
                  ? formatDistanceToNow(new Date(jobApplication.submittedAt), {
                      addSuffix: true,
                    })
                  : "recently"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
