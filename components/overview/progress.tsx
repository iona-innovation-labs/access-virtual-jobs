"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ArrowRight, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/services/fetch-api";
import { IProfileResponse } from "@/types/profiles";

const TOTAL_STEPS = 22; // Adjusted based on required fields + required uploads

const REQUIRED_FILES = [
  "resume",
  "professional_picture",
  "internet",
  "computer_specs",
  "work_station",
];

const Stepper = () => {
  const router = useRouter();

  const { data: profileData } = useSWR<IProfileResponse>("/profile", fetchApi);

  const requiredFields = [
    profileData?.profile?.jobTitle,
    profileData?.profile?.whyFit,
    profileData?.profile?.whatStrengths,
    profileData?.profile?.whatNeedImprovement,
    profileData?.phones,
    profileData?.emails,
    profileData?.profile?.address,
    profileData?.profile?.skypeId,
    profileData?.profile?.dateOfBirth,
    profileData?.profile?.hasPaypal,
    profileData?.profile?.desiredSalary,
    profileData?.profile?.numberOfChildren,
    profileData?.contentLinks,
    profileData?.profile?.internetProvider,
    profileData?.profile?.numberOfMonitors,
    profileData?.profile?.numberOfExperience,
    profileData?.profile?.numberOfExperience,
  ];
  const completedFields = requiredFields.filter(Boolean).length;

  const uploadedFileTypes = new Set(
    profileData?.fileUploads?.map((file) => file.type)
  );
  const completedFiles = REQUIRED_FILES.filter((fileType) =>
    uploadedFileTypes.has(fileType)
  ).length;

  const completedSteps = completedFields + completedFiles;
  const isProfileComplete = completedSteps === TOTAL_STEPS;
  const progressPercentage = Math.round((completedSteps / TOTAL_STEPS) * 100);

  return (
    <Card className="border-0 shadow-sm">
      {/* Header with Progress */}
      <div className="px-6 ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isProfileComplete ? "bg-green-100" : "bg-brand/10"
              }`}
            >
              {isProfileComplete ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <User className="w-4 h-4 text-brand" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">Profile Setup</h3>
              <p className="text-xs text-gray-500">
                {completedSteps}/{TOTAL_STEPS} completed
              </p>
            </div>
          </div>

          <div
            className={`text-xl font-bold ${
              isProfileComplete ? "text-green-600" : "text-brand"
            }`}
          >
            {progressPercentage}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-300 ${
              isProfileComplete ? "bg-green-500" : "bg-brand"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Action */}
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {isProfileComplete
              ? "All set!"
              : `${TOTAL_STEPS - completedSteps} items remaining`}
          </span>

          <Button
            onClick={() => router.push("/app/profile")}
            className={`${
              isProfileComplete
                ? "bg-green-600 hover:bg-green-700"
                : "bg-brand hover:bg-brand-dark"
            } text-white`}
            size="sm"
          >
            {isProfileComplete ? "View Profile" : "Continue"}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Stepper;
