import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface PersonalInfoSectionProps {
  userInfo: any;
  isUserLoading: boolean;
  loading: boolean;
}

export const PersonalInfoSection = ({
  userInfo,
  isUserLoading,
}: PersonalInfoSectionProps) => {
  if (isUserLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
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

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <User className="w-4 h-4 text-brand" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>
          </div>
          <Link
            href="/app/settings/general"
            className="flex items-center space-x-1 text-sm text-brand hover:text-brand-dark transition-colors"
          >
            <span>Update General Details</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Image */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Profile Image
          </Label>
          <div className="flex items-center space-x-4">
            {userInfo?.image ? (
              <Image
                src={userInfo.image}
                alt={fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                width={64}
                height={64}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center border-2 border-brand/20">
                <User className="w-7 h-7 text-brand" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">
                Profile image is managed in general settings
              </p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Full Name
          </Label>
          <p className="text-gray-900 font-medium">{fullName}</p>
          <p className="text-xs text-gray-500 mt-1">
            Name can be updated in general settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
