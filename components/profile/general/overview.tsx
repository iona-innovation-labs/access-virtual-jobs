import React from "react";
import Link from "next/link";
import { Calendar, Briefcase, User, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OverviewSectionProps {
  userInfo: {
    createdAt?: string | Date;
    desiredSalary?: number;
    salaryUnit?: string;
    jobType?: string;
    availability?: string;
    education?: string;
  };
  isEditable?: boolean;
}

export const OverviewSection = ({
  userInfo,
  isEditable = false,
}: OverviewSectionProps) => {
  const jobTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
  ];

  const availabilityOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "2_weeks", label: "2 Weeks Notice" },
    { value: "1_month", label: "1 Month Notice" },
    { value: "2_months", label: "2 Months Notice" },
    { value: "3_months", label: "3+ Months" },
  ];

  const formatCreatedAt = (date: string | Date) => {
    if (!date) return "Not available";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatJobType = (type: string) => {
    if (!type) return "Not specified";
    return jobTypeOptions.find((opt) => opt.value === type)?.label || type;
  };

  const formatAvailability = (availability: string) => {
    if (!availability) return "Not specified";
    return (
      availabilityOptions.find((opt) => opt.value === availability)?.label ||
      availability
    );
  };

  const formatSalary = () => {
    if (!userInfo?.desiredSalary || !userInfo?.salaryUnit)
      return "Not specified";
    return `${userInfo.salaryUnit} ${userInfo.desiredSalary.toLocaleString()}/hr`;
  };

  // Add safety check for userInfo
  if (!userInfo) {
    return (
      <Card>
        <CardContent className="px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Overview</h2>
              <p className="text-xs text-gray-500 mt-1">
                Key information about your profile and preferences
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 py-6">
            Loading profile information...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900">Overview</h2>
            <p className="text-xs text-gray-500 mt-1">
              Key information about your profile and preferences
            </p>
          </div>
          {isEditable && (
            <Link href="?active=profile">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-50"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <div>
          {/* Looking for work */}
          <div className="group py-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 text-lg leading-relaxed">
                  <div className="">
                    Looking for{" "}
                    <span className="font-medium text-gray-900">
                      {formatJobType(userInfo?.jobType || "")}
                    </span>{" "}
                    work{" "}
                    <span className="font-medium text-gray-900">
                      ({formatAvailability(userInfo?.availability || "")})
                    </span>{" "}
                    at{" "}
                    <span className=" font-medium text-gray-900">
                      {formatSalary()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Education - Placeholder */}
          <div className="group py-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
                <Calendar className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">
                    Education
                  </h3>
                </div>
                <div className="text-gray-900 leading-relaxed">
                  <div className="text-lg font-medium">
                    {userInfo?.education || "Not specified"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="group py-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">
                    Member Since
                  </h3>
                </div>
                <div className="text-gray-900 leading-relaxed">
                  <div className="text-lg font-medium">
                    {formatCreatedAt(userInfo?.createdAt ?? new Date())}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
