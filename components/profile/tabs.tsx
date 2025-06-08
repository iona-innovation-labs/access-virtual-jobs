"use client";

import { Button } from "@/components/ui/button";
import { User, Upload, CheckCircle2 } from "lucide-react";
import { useProfileTabContext } from "@/context/profile-tab-context";

const tabs = [
  {
    name: "Profile",
    icon: User,
    path: "/app/profile",
    description: "Personal details",
  },
  {
    name: "Files",
    icon: Upload,
    path: "/app/profile/files",
    description: "Upload documents",
  },
  {
    name: "Complete",
    icon: CheckCircle2,
    path: "/app/profile/finish",
    description: "Review & submit",
  },
];

const ProfileTabs = () => {
  const { currentTab } = useProfileTabContext();

  const getCurrentStepIndex = () => {
    const index = tabs.findIndex((tab) => tab.name === currentTab);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  if (currentTab === "Finish") return null;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      {/* Mobile Layout - Vertical */}
      <div className="block sm:hidden">
        <div className="space-y-4">
          {tabs.map((tab, index) => {
            const isActive = currentTab === tab.name;
            const isCompleted = index < currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={tab.path} className="relative">
                {/* Step Row */}
                <div className="flex items-center space-x-3">
                  {/* Icon Circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0
                      ${
                        isActive
                          ? "bg-brand text-white shadow-md"
                          : isCompleted
                            ? "bg-green-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <tab.icon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className={`
                            text-sm font-semibold
                            ${
                              isActive
                                ? "text-brand"
                                : isCompleted
                                  ? "text-green-600"
                                  : "text-gray-500"
                            }
                          `}
                        >
                          {tab.name}
                        </h3>
                        <p
                          className={`
                            text-xs mt-1
                            ${
                              isActive
                                ? "text-brand/70"
                                : isCompleted
                                  ? "text-green-500"
                                  : "text-gray-400"
                            }
                          `}
                        >
                          {tab.description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Complete
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand">
                            Current
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Connector */}
                {index < tabs.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px transform -translate-x-1/2">
                    <div
                      className={`
                        w-full h-4 transition-all duration-500
                        ${
                          index < currentStepIndex
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablet Layout - Horizontal Compact */}
      <div className="hidden sm:block lg:hidden">
        <div className="relative">
          <div className="flex items-center justify-between">
            {tabs.map((tab, index) => {
              const isActive = currentTab === tab.name;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={tab.path} className="flex-1 relative">
                  {/* Step */}
                  <div className="flex flex-col items-center relative z-10 bg-white">
                    <Button
                      variant="ghost"
                      className="flex flex-col items-center p-2 hover:bg-transparent group transition-all duration-200 w-full"
                    >
                      {/* Icon Circle */}
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2
                          ${
                            isActive
                              ? "bg-brand text-white shadow-md"
                              : isCompleted
                                ? "bg-green-500 text-white shadow-sm"
                                : "bg-gray-200 text-gray-500"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <tab.icon className="w-4 h-4" />
                        )}
                      </div>

                      {/* Label */}
                      <div className="text-center">
                        <div
                          className={`
                            text-sm font-medium
                            ${
                              isActive
                                ? "text-brand"
                                : isCompleted
                                  ? "text-green-600"
                                  : "text-gray-500"
                            }
                          `}
                        >
                          {tab.name}
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Horizontal Connector */}
                  {index < tabs.length - 1 && (
                    <div className="absolute top-5 left-1/2 right-0 h-px z-0">
                      <div
                        className={`
                          h-full transition-all duration-500
                          ${
                            index < currentStepIndex
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }
                        `}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Full Horizontal */}
      <div className="hidden lg:block">
        <div className="relative">
          <div className="flex items-center justify-between">
            {tabs.map((tab, index) => {
              const isActive = currentTab === tab.name;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={tab.path} className="flex-1 relative">
                  {/* Step */}
                  <div className="flex flex-col items-center relative z-10 bg-white px-4">
                    <Button
                      variant="ghost"
                      className="flex flex-col items-center p-0 hover:bg-transparent group transition-all duration-200 w-auto h-auto"
                    >
                      {/* Icon Circle */}
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-3
                          ${
                            isActive
                              ? "bg-brand text-white shadow-lg shadow-brand/25"
                              : isCompleted
                                ? "bg-green-500 text-white shadow-md"
                                : "bg-gray-200 text-gray-500"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <tab.icon className="w-5 h-5" />
                        )}
                      </div>

                      {/* Label */}
                      <div className="text-center min-w-0">
                        <div
                          className={`
                            text-sm font-semibold whitespace-nowrap
                            ${
                              isActive
                                ? "text-brand"
                                : isCompleted
                                  ? "text-green-600"
                                  : "text-gray-500"
                            }
                          `}
                        >
                          {tab.name}
                        </div>
                        <div
                          className={`
                            text-xs mt-1 whitespace-nowrap
                            ${
                              isActive
                                ? "text-brand/70"
                                : isCompleted
                                  ? "text-green-500"
                                  : "text-gray-400"
                            }
                          `}
                        >
                          {tab.description}
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Connector Line */}
                  {index < tabs.length - 1 && (
                    <div className="absolute top-6 left-1/2 right-0 h-0.5 z-0">
                      <div
                        className={`
                          h-full transition-all duration-500
                          ${
                            index < currentStepIndex
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }
                        `}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Summary for Mobile */}
      <div className="block sm:hidden mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span>
            Step {currentStepIndex + 1} of {tabs.length}
          </span>
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / tabs.length) * 100}%`,
              }}
            />
          </div>
          <span>
            {Math.round(((currentStepIndex + 1) / tabs.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
