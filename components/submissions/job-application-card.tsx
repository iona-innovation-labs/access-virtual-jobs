import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Clock, Building2 } from "lucide-react";
import Link from "next/link";

import { IJobApplication } from "@/types/jobs";
import { getProgressReadableText, getProgressColor } from "@/lib/get-progress";
import Logo from "../logo";

type JobApplicationCardProps = {
  jobApplication: IJobApplication;
};

const JobApplicationCard = ({ jobApplication }: JobApplicationCardProps) => {
  return (
    <Link
      href={`/app/submissions/v/${jobApplication?.applicationPublicId}`}
      className="group block"
    >
      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-all duration-200 cursor-pointer">
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Logo size="sm"/>
                <div className="min-w-0 flex-1">
                  
                  <h3 className="font-semibold text-foreground truncate group-hover:text-brand transition-colors">
                    {jobApplication?.job?.title || "Job Title"}
                  </h3>

                  <div className="flex items-center space-x-1 mt-1 text-sm text-muted-foreground">
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">Access Virtual Staffing</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2 mt-2">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(jobApplication?.progress)} bg-opacity-10`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getProgressColor(jobApplication?.progress).replace("text-", "bg-")}`}
                      ></div>
                      {getProgressReadableText(jobApplication?.progress)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          <div className="text-right">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(jobApplication?.submittedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors" />
        </div>
      </div>
    </Link>
  );
};

export default JobApplicationCard;
