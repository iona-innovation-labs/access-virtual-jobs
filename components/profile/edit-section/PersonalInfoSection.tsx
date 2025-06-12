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
      <Card className="w-full mx-auto animate-pulse border-border">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-28 h-28 bg-muted rounded-full"></div>
            <div className="space-y-3 text-center w-full">
              <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <div className="w-full space-y-3">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
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

  // Get status color based on job search status (using semantic colors)
  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus?.includes("active") || lowerStatus?.includes("looking")) {
      return "text-success bg-success/10 border-success/20";
    } else if (
      lowerStatus?.includes("open") ||
      lowerStatus?.includes("considering")
    ) {
      return "text-brand bg-brand/10 border-brand/20";
    } else if (
      lowerStatus?.includes("not") ||
      lowerStatus?.includes("unavailable")
    ) {
      return "text-muted-foreground bg-muted border-border";
    }
    return "text-primary bg-primary/10 border-primary/20";
  };

  return (
    <Card className="w-full mx-auto border-none shadow-none bg-card">
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
                  className="w-50 h-50 rounded-full object-cover border-4 border-card ring-2 ring-border"
                  width={112}
                  height={112}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center border-4 border-card ring-2 ring-border">
                  <span className="text-white text-2xl font-bold">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-2xl font-bold text-foreground">{fullName}</h3>
              {userInfo?.username && (
                <p className="text-muted-foreground text-sm font-medium flex items-center justify-center">
                  @{userInfo.username}
                  <span>
                    <Button
                      size="sm"
                      className="bg-transparent text-muted-foreground shadow-none hover:text-foreground"
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
