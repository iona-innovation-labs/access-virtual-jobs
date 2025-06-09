import { IJobListing } from "@/types/jobs";
import JobCard from "./job-card";
import { Briefcase } from "lucide-react";

type Props = {
  positions: IJobListing[];
  isPublic?: boolean;
};

export const JobList = ({ positions, isPublic = false }: Props) => {
  return (
    <section
      id="joblist_container"
      className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-2 sm:py-3 md:py-4 lg:py-6"
    >
      {positions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 shadow-lg shadow-gray-200/40 max-w-md mx-auto text-center">
            <div className="mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                No jobs found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {isPublic
                  ? "We couldn't find any job listings matching your criteria. Try adjusting your search filters or check back later for new opportunities."
                  : "No job listings available at the moment. Check back later for new opportunities."}
              </p>
            </div>

            {isPublic && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs sm:text-sm text-gray-500">
                  💡 Try using broader search terms or removing some filters
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between">
            <p className="text-sm sm:text-base text-gray-600">
              <span className="font-medium text-gray-900">
                {positions.length}
              </span>
              {positions.length === 1 ? " job found" : " jobs found"}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {positions.map((position) => (
              <JobCard key={position.id} job={position} isPublic={isPublic} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
