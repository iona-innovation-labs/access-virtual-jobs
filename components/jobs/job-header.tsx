import React from "react";
import { TrendingUp, Briefcase } from "lucide-react";

type Props = {
  heading: string;
  description: string;
  isPublic?: boolean;
};

const defaultProps: Partial<Props> = {
  heading: "Latest Job Listings",
  description: "Find the latest job listings here",
  isPublic: true,
};

export default function JobHeader(props: Props) {
  const { heading, description, isPublic } = {
    ...defaultProps,
    ...props,
  };

  // Public page - full hero design
  if (isPublic) {
    return (
      <div className="relative mt-8 overflow-hidden">
        <div className="container mx-auto px-[10%] sm:px-[5%] lg:px-[10%] py-2 sm:py-4 lg:py-8 relative z-10">
          {/* Main header content */}
          <div className="text-center max-w-4xl mx-auto mb-2 sm:mb-4">
            <div className="inline-flex items-center bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-full px-[10%] py-2 mb-6 shadow-sm">
              <TrendingUp className="w-4 h-4 text-brand mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Seize every opportunity
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {heading}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-brand" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">
              {heading}
            </h1>
            {description && (
              <p className="text-sm sm:text-base text-gray-500 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
