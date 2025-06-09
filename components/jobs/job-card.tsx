import React from "react";
import { Clock, Building2 } from "lucide-react";
import { IJobListing } from "@/types/jobs";
import JobCardApply from "./job-card-apply";

const JobCard = ({
  job,
  isPublic = false,
}: {
  job: IJobListing;
  isPublic?: boolean;
}) => {
  const stripHtml = (html: string) => {
    if (typeof window !== "undefined") {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    }
    return html.replace(/<[^>]*>/g, "");
  };

  const getDescriptionPreview = (description: string) => {
    const plainText = stripHtml(description);
    return plainText.length > 120
      ? plainText.substring(0, 120) + "..."
      : plainText;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow duration-200 h-fit">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">
          {job.title}
        </h3>
        <hr className="my-2 w-10 sm:w-12 h-0.5 sm:h-1 rounded-full bg-brand" />
        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="truncate">{job.postedBy}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 sm:mb-5">
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          {getDescriptionPreview(job.description || "")}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        {/* Date and Pay - Stack on mobile, inline on larger screens */}
        <div className="flex items-center justify-between sm:justify-start sm:flex-1 sm:space-x-4">
          <div className="flex items-center text-gray-500 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
          <div className="text-base sm:text-lg font-semibold text-gray-900 sm:order-2">
            {job.pay}
          </div>
        </div>

        {/* Apply Button */}
        <JobCardApply isPublic={isPublic} id={job.id} url={job.url} />
      </div>
    </div>
  );
};

export default JobCard;
