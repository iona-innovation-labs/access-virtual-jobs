import React from "react";
import { TrendingUp, Briefcase } from "lucide-react";

type Props = {
  heading: string;
  description: string;
  isPublic?: boolean;
  isSpecific?: boolean;
};

const defaultProps: Partial<Props> = {
  heading: "Latest Job Listings",
  description: "Find the latest job listings here",
  isPublic: true,
  isSpecific: false,
};

export default function JobHeader(props: Props) {
  const { heading, description, isPublic, isSpecific } = {
    ...defaultProps,
    ...props,
  };

  if (isPublic) {
    return (
      <div className="relative mt-8 overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-2 sm:py-4 lg:py-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-2 sm:mb-4">
            {!isSpecific && (
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 mb-4 sm:mb-6 shadow-lg shadow-gray-200/40">
                <TrendingUp className="w-4 h-4 text-brand mr-2" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Seize every opportunity
                </span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
              {heading}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg">
            <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {heading}
            </h1>
            {description && (
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
              Total Jobs
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              24
            </div>
          </div>

          <div className="w-px h-8 sm:h-10 bg-gray-200"></div>

          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
              Active
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600">
              18
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100 mt-6 sm:mt-8"></div>
    </div>
  );
}
