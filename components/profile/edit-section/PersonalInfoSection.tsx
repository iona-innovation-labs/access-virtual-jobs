import React from "react";
import Image from "next/image";
import { Briefcase, MapPin, Calendar, Edit, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface ProfileHeaderProps {
  userInfo: any;
  profileData?: any;
  isUserLoading: boolean;
  showEditButton?: boolean;
}

export const PersonalInfoSection = ({
  userInfo,
  profileData,
  isUserLoading,
}: ProfileHeaderProps) => {
  const { toast } = useToast();

  const handlePublicViewClick = () => {
    // Check if user is email verified
    if (!userInfo?.isEmailVerified) {
      toast({
        title: "Profile Not Available",
        description:
          "Your profile requires email verification before it can be viewed publicly. Please verify your email address first.",
        variant: "default",
      });
      return;
    }

    // Check if profile is complete enough for public viewing
    const hasRequiredFields =
      profileData?.jobTitle &&
      profileData?.address &&
      profileData?.jobSearchStatus &&
      profileData?.desiredSalary &&
      profileData?.whyFit &&
      profileData?.whatStrengths &&
      profileData?.whatNeedImprovement;

    const hasSkills = profileData?.skills && profileData.skills.length > 0;
    const hasWorkHistory =
      profileData?.workHistory && profileData.workHistory.length > 0;

    if (!hasRequiredFields || !hasSkills || !hasWorkHistory) {
      toast({
        title: "Profile Not Ready",
        description:
          "Your profile is not yet complete and ready for public viewing. Please complete all required information including skills and work history.",
        variant: "warning",
      });
      return;
    }

    // If all checks pass, open the public view
    window.open(`/profile/${userInfo.id}`, "_blank");
  };
  if (isUserLoading) {
    return (
      <Card className="w-full animate-pulse border-border py-0">
        <CardContent className="p-0">
          {/* Background Image Skeleton */}
          <div className="h-48 bg-muted rounded-t-lg"></div>
          <div className="p-8">
            <div className="flex flex-col items-center space-y-6 -mt-16">
              <div className="w-28 h-28 bg-muted rounded-full ring-4 ring-background"></div>
              <div className="space-y-3 text-center w-full">
                <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
              <div className="w-full space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fullName =
    userInfo?.firstName && userInfo?.lastName
      ? `${userInfo.firstName} ${userInfo.lastName}`
      : userInfo?.name || userInfo?.username || "User";

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
      return "text-green-700 bg-green-50 border-green-200";
    } else if (
      lowerStatus?.includes("ready") ||
      lowerStatus?.includes("interview")
    ) {
      return "text-blue-700 bg-blue-50 border-blue-200";
    } else if (
      lowerStatus?.includes("passive") ||
      lowerStatus?.includes("considering")
    ) {
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    } else if (
      lowerStatus?.includes("not") ||
      lowerStatus?.includes("unavailable")
    ) {
      return "text-zinc-600 bg-gray-50 border-gray-200";
    }
    return "text-blue-700 bg-blue-50 border-blue-200";
  };

  // Format member since date
  const formatMemberSince = (date: string | Date) => {
    if (!date) return null;
    const memberDate = new Date(date);
    return memberDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const jobSearchStatus =
    profileData?.jobSearchStatus || userInfo?.jobSearchStatus;
  const jobTitle = profileData?.jobTitle || "Professional";
  const memberSince = formatMemberSince(userInfo?.createdAt);

  return (
    <Card className="w-full mx-auto border-none py-0 shadow-sm bg-card overflow-hidden">
      <CardContent className="p-0">
        {/* Background Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <Image
            src="https://images.unsplash.com/photo-1618397746666-63405ce5d015?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Profile Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-background text-foregorund"
            >
              <Link
                href={`/app/settings/general`}
                target="_blank"
                className=" flex items-center hover:bg-background"
              >
                <Edit className="w-4 h-4 mr-2" />
              </Link>
              Edit Profile
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-background"
              onClick={handlePublicViewClick}
            >
              <Eye className="w-4 h-4 mr-2" />
              Public View
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-2 sm:p-4">
          <div className="flex flex-col items-center space-y-6 -mt-20">
            {/* Profile Image */}
            <div className="relative">
              {userInfo?.image ? (
                <Image
                  src={userInfo.image}
                  alt={fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-background ring-4 ring-border/20"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-background ring-4 ring-border/20">
                  <span className="text-white text-3xl font-bold">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Title */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {fullName}
                </h1>
                <VerificationBadge isVerified={userInfo?.isPhoneVerified} />
              </div>
              {jobTitle && (
                <p className="text-lg text-muted-foreground font-medium">
                  {jobTitle}
                </p>
              )}
              {userInfo?.username && (
                <p className="text-muted-foreground text-sm font-medium flex items-center justify-center gap-2">
                  {userInfo.email}
                </p>
              )}
            </div>

            {/* Status and Info Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {jobSearchStatus && (
                <Badge
                  variant="outline"
                  className={`px-3 py-1.5 text-sm font-medium border ${getStatusColor(jobSearchStatus)}`}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  {formatJobSearchStatus(jobSearchStatus)}
                </Badge>
              )}

              {userInfo.countryOfResidence && (
                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  {userInfo.countryOfResidence}
                </Badge>
              )}

              {memberSince && (
                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since {memberSince}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
