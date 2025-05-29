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
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between relative">
        {tabs.map((tab, index) => {
          const isActive = currentTab === tab.name;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={tab.path}>
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
                    <tab.icon className="w-5 h-5" />
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

              {/* Connector Line - positioned absolutely behind steps */}
              {index < tabs.length - 1 && (
                <div className="flex-1 relative">
                  <div
                    className={`
                      absolute top-6 left-0 right-0 h-0.5 transition-all duration-500
                      ${
                        index < currentStepIndex
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }
                    `}
                    style={{ transform: "translateY(-50%)" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileTabs;
