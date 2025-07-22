"use client";

import { Button } from "@/components/ui/button";
import { User, Upload, CheckCircle2, Shield } from "lucide-react";
import { useProfileTabContext, TabName } from "@/context/profile-tab-context";
import { useEffect } from "react";

const tabs = [
  {
    name: "Profile" as TabName,
    icon: User,
    description: "Personal details",
  },
  {
    name: "Files" as TabName,
    icon: Upload,
    description: "Upload documents",
  },
  {
    name: "Verification" as TabName,
    icon: Shield,
    description: "Verify information",
  },
  {
    name: "Review" as TabName,
    icon: CheckCircle2,
    description: "Review & submit",
  },
];

const ProfileTabs = () => {
  const {
    currentTab,
    setCurrentTab,
    stepCompletionStatus,
    isStepAccessible,
    refreshStepCompletion,
    isLoading,
  } = useProfileTabContext();

  useEffect(() => {
    refreshStepCompletion();
  }, [refreshStepCompletion]);

  const getCurrentStepIndex = () => {
    const index = tabs.findIndex((tab) => tab.name === currentTab);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  const handleTabClick = (tab: TabName, index: number) => {
    if (isStepAccessible(tab) && !isLoading) {
      console.log(index);
      setCurrentTab(tab);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      {/* Mobile Layout - Vertical */}
      <div className="block sm:hidden">
        <div className="space-y-4">
          {tabs.map((tab, index) => {
            const isActive = currentTab === tab.name;
            const isCompleted = stepCompletionStatus[tab.name];
            const isAccessible = isStepAccessible(tab.name);
            const isFuture = index > currentStepIndex && !isCompleted;

            return (
              <div key={tab.name} className="relative">
                {/* Step Row */}
                <button
                  onClick={() => handleTabClick(tab.name, index)}
                  disabled={!isAccessible || isLoading}
                  className={`
                    w-full flex items-center space-x-3 transition-all duration-300
                    ${isAccessible && !isLoading ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}
                    ${isFuture ? "opacity-50" : "opacity-100"}
                  `}
                >
                  {/* Icon Circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0
                      ${
                        isActive
                          ? "bg-brand text-white shadow-md"
                          : isCompleted
                            ? "bg-success text-white shadow-sm"
                            : isFuture
                              ? "bg-muted/50 text-muted-foreground/50"
                              : "bg-muted text-muted-foreground"
                      }
                      ${isLoading ? "animate-pulse" : ""}
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
                      <div className="text-left">
                        <h3
                          className={`
                            text-sm font-semibold
                            ${
                              isActive
                                ? "text-brand"
                                : isCompleted
                                  ? "text-success"
                                  : isFuture
                                    ? "text-muted-foreground/50"
                                    : "text-muted-foreground"
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
                                  ? "text-success/70"
                                  : isFuture
                                    ? "text-muted-foreground/40"
                                    : "text-muted-foreground/70"
                            }
                          `}
                        >
                          {tab.description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                            Complete
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand">
                            Current
                          </span>
                        )}
                        {isFuture && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground/50">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Vertical Connector */}
                {index < tabs.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px transform -translate-x-1/2">
                    <div
                      className={`
                        w-full h-4 transition-all duration-500
                        ${stepCompletionStatus[tab.name] ? "bg-success" : "bg-border"}
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
              const isCompleted = stepCompletionStatus[tab.name];
              const isAccessible = isStepAccessible(tab.name);
              const isFuture = index > currentStepIndex && !isCompleted;

              return (
                <div key={tab.name} className="flex-1 relative">
                  {/* Step */}
                  <div className="flex flex-col items-center relative z-10 bg-card">
                    <Button
                      variant="ghost"
                      onClick={() => handleTabClick(tab.name, index)}
                      disabled={!isAccessible || isLoading}
                      className={`
                        flex flex-col items-center p-2 hover:bg-transparent group transition-all duration-200 w-full
                        ${isAccessible && !isLoading ? "cursor-pointer" : "cursor-not-allowed"}
                        ${isFuture ? "opacity-50" : "opacity-100"}
                      `}
                    >
                      {/* Icon Circle */}
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2
                          ${
                            isActive
                              ? "bg-brand text-white shadow-md"
                              : isCompleted
                                ? "bg-success text-white shadow-sm"
                                : isFuture
                                  ? "bg-muted/50 text-muted-foreground/50"
                                  : "bg-muted text-muted-foreground"
                          }
                          ${isLoading ? "animate-pulse" : ""}
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
                                  ? "text-success"
                                  : isFuture
                                    ? "text-muted-foreground/50"
                                    : "text-muted-foreground"
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
                            stepCompletionStatus[tab.name]
                              ? "bg-success"
                              : "bg-border"
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
      <div className="hidden lg:block bg-background">
        <div className="relative">
          <div className="flex items-center justify-between">
            {tabs.map((tab, index) => {
              const isActive = currentTab === tab.name;
              const isCompleted = stepCompletionStatus[tab.name];
              const isAccessible = isStepAccessible(tab.name);
              const isFuture = index > currentStepIndex && !isCompleted;

              return (
                <div key={tab.name} className="flex-1 relative bg-background">
                  {/* Step */}
                  <div className="flex flex-col items-center relative z-10 bg-background px-4">
                    <Button
                      variant="ghost"
                      onClick={() => handleTabClick(tab.name, index)}
                      disabled={!isAccessible || isLoading}
                      className={`
                        flex flex-col items-center p-0 hover:bg-transparent group transition-all duration-200 w-auto h-auto
                        ${isAccessible && !isLoading ? "cursor-pointer" : "cursor-not-allowed"}
                        ${isFuture ? "opacity-50" : "opacity-100"}
                      `}
                    >
                      {/* Icon Circle */}
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-3
                          ${
                            isActive
                              ? "bg-brand text-white shadow-lg shadow-brand/25"
                              : isCompleted
                                ? "bg-success text-white shadow-md"
                                : isFuture
                                  ? "bg-muted/50 text-muted-foreground/50"
                                  : "bg-muted text-muted-foreground"
                          }
                          ${isLoading ? "animate-pulse" : ""}
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
                                  ? "text-success"
                                  : isFuture
                                    ? "text-muted-foreground/50"
                                    : "text-muted-foreground"
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
                                  ? "text-success/70"
                                  : isFuture
                                    ? "text-muted-foreground/40"
                                    : "text-muted-foreground/70"
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
                            stepCompletionStatus[tab.name]
                              ? "bg-success"
                              : "bg-border"
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
      <div className="block sm:hidden mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <span>
            Step {currentStepIndex + 1} of {tabs.length}
          </span>
          <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span>Validating steps...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTabs;
