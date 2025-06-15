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
      <div className="relative mt-4 sm:mt-6 lg:mt-8 overflow-hidden">
        <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-2 sm:mb-4">
            {!isSpecific && (
              <div className="inline-flex items-center bg-card/80 backdrop-blur-sm border border-border/60 rounded-full px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 mb-3 sm:mb-4 lg:mb-6 shadow-lg shadow-border/40">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-brand mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Seize every opportunity
                </span>
              </div>
            )}

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight px-2 sm:px-0">
              {heading}
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto py-4 sm:py-6 lg:py-10">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Main Header Section */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg flex-shrink-0">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground leading-tight break-words">
              {heading}
            </h1>
            {description && (
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground mt-1 leading-relaxed break-words">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-border mt-4 sm:mt-6 lg:mt-8"></div>
    </div>
  );
}
