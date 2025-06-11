import React from "react";
import Image from "next/image";
import { Briefcase, Share } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  userInfo: any;
  isUserLoading: boolean;
  showEditButton?: boolean;
}

export const PersonalInfoSection = ({
  userInfo,
  isUserLoading,
  showEditButton = true,
}: ProfileCardProps) => {
  console.log(showEditButton);
  if (isUserLoading) {
    return (
      <Card className="w-full mx-auto animate-pulse border-gray-200">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-28 h-28 bg-gray-200 rounded-full"></div>
            <div className="space-y-3 text-center w-full">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="w-full space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fullName =
    userInfo?.firstName && userInfo?.lastName
      ? `${userInfo.firstName} ${userInfo.lastName}`
      : userInfo?.username || "User";

  const initials = fullName
    .split(" ")
    .map((name: string) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Format job search status
  const formatJobSearchStatus = (status: string) => {
    if (!status) return null;
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get status color based on job search status
  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus?.includes("active") || lowerStatus?.includes("looking")) {
      return "text-green-600 bg-green-50 border-green-200";
    } else if (
      lowerStatus?.includes("open") ||
      lowerStatus?.includes("considering")
    ) {
      return "text-blue-600 bg-blue-50 border-blue-200";
    } else if (
      lowerStatus?.includes("not") ||
      lowerStatus?.includes("unavailable")
    ) {
      return "text-gray-600 bg-gray-50 border-gray-200";
    }
    return "text-indigo-600 bg-indigo-50 border-indigo-200";
  };

  return (
    <Card className="w-full mx-auto border-none shadow-none bg-white ">
      <CardContent className="p-4">
        <div className="space-y-6">
          {/* Header Section with Profile Image and Basic Info */}
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Image */}
            <div className="relative">
              {userInfo?.image ? (
                <Image
                  src={userInfo.image}
                  alt={fullName}
                  className="w-50 h-50 rounded-full object-cover border-4 border-white ring-2 ring-gray-100"
                  width={112}
                  height={112}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-white ring-2 ring-gray-100">
                  <span className="text-white text-2xl font-bold">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{fullName}</h3>
              {userInfo?.username && (
                <p className="text-gray-500 text-sm font-medium flex items-center justify-center">
                  @{userInfo.username}
                  <span>
                    <Button
                      size="sm"
                      className="bg-transparent text-gray-700 shadow-none "
                    >
                      <Share />
                    </Button>
                  </span>
                </p>
              )}
            </div>

            {userInfo?.jobSearchStatus && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(userInfo.jobSearchStatus)}`}
              >
                <Briefcase className="w-3 h-3" />
                {formatJobSearchStatus(userInfo.jobSearchStatus)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
