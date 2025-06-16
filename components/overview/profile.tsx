"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, MapPin, Briefcase, Edit3 } from "lucide-react";
import { useUserInfo } from "@/hooks/use-user-info";
import { IProfileResponse } from "@/types/profiles";
import { AppError } from "@/utils/app-error";
import { fetchApi } from "@/services/fetch-api";

const Profile = () => {
  const router = useRouter();
  const { userInfo, isLoading } = useUserInfo();
  const { data } = useSWR<IProfileResponse, AppError>("/profile", fetchApi);

  if (isLoading) {
    return (
      <Card className="w-full p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  const fullName =
    userInfo?.firstName && userInfo?.lastName
      ? `${userInfo.firstName} ${userInfo.lastName}`
      : userInfo?.username || "User";

  return (
    <Card className="w-full bg-card shadow-sm border-border">
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Profile Info */}
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              {userInfo?.image ? (
                <Image
                  src={userInfo.image}
                  alt={fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                  width={64}
                  height={64}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <User className="w-7 h-7 text-primary" />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                {fullName}
              </h2>

              {data?.profile?.jobTitle && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                  <span>{data.profile.jobTitle}</span>
                </div>
              )}

              {data?.profile?.address && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{data.profile.address}</span>
                </div>
              )}

              {!data?.profile?.jobTitle && !data?.profile?.address && (
                <p className="text-sm text-muted-foreground">
                  Complete your profile
                </p>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <Button
            onClick={() => router.push("/app/profile/edit")}
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </div>

        {/* Optional Status Section - Uncommented if needed */}
        {/* 
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Job Search Status</span>
            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
              Ready to Interview
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Let employers know you're available for opportunities
          </p>
        </div>
        */}
      </div>
    </Card>
  );
};

export default Profile;
