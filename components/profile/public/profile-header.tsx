import React from "react";
import Image from "next/image";
import { Briefcase, MapPin, Calendar, Shield, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  lastName?: string;
  firstName?: string;
  countryOfResidence?: string;
}

interface Profile {
  jobTitle?: string;
  address?: string;
  jobSearchStatus?: string;
}

interface Completeness {
  percentage: number;
  completedFields: number;
  totalFields: number;
}

interface PublicProfileHeaderProps {
  user: User;
  profile: Profile;
  completeness: Completeness;
  isVerified?: boolean;
  loading?: boolean;
}

export const PublicProfileHeader = ({
  user,
  profile,
  isVerified = false,
  loading = false,
}: PublicProfileHeaderProps) => {
  if (loading) {
    return (
      <Card className="w-full animate-pulse border-border p-0">
        <CardContent className="p-0">
          {/* Background Image Skeleton */}
          <div className="h-48 bg-muted rounded-t-lg"></div>
          <div className="p-8">
            <div className="flex flex-col items-center space-y-6 -mt-16">
              <div className="w-32 h-32 bg-muted rounded-full ring-4 ring-background"></div>
              <div className="space-y-3 text-center w-full">
                <div className="h-8 bg-muted rounded w-3/4 mx-auto"></div>
                <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-32"></div>
                <div className="h-8 bg-muted rounded w-28"></div>
              </div>
              <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log(user)

  const fullName = user?.firstName + " " + user?.lastName || "User";
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

  // Get status color and styling
  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus?.includes("active") || lowerStatus?.includes("looking")) {
      return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800";
    } else if (
      lowerStatus?.includes("ready") || lowerStatus?.includes("interview")
    ) {
      return "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800";
    } else if (
      lowerStatus?.includes("passive") || lowerStatus?.includes("considering")
    ) {
      return "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800";
    } else if (
      lowerStatus?.includes("not") || lowerStatus?.includes("unavailable")
    ) {
      return "text-muted-foreground bg-muted border-border";
    }
    return "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800";
  };

  const formatMemberSince = (date: string | Date) => {
    if (!date) return null;
    const memberDate = new Date(date);
    return memberDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };


  const jobTitle = profile?.jobTitle || "Professional";
  const memberSince = formatMemberSince(user?.createdAt);
  const jobSearchStatus = profile?.jobSearchStatus;

  return (
    <Card className="w-full mx-auto border-none shadow-sm bg-card overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="relative h-48">
          <Image
            src="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80"
            alt="Profile Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/30"></div>          
            <div className="absolute top-4 right-4 space-x-2">
              {isVerified && (
                <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-0 px-3 py-1.5">
                  <Shield className="w-4 h-4 mr-2" />
                  Verified Professional <span className="text-xs">- TODO: this is static</span>
                </Badge>
              )}
            </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center space-y-6 -mt-20">
            <div className="relative">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-background ring-4 ring-border/20"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border-4 border-background ring-4 ring-border/20">
                  <span className="text-primary-foreground text-3xl font-bold">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                {fullName}
              </h1>
              {jobTitle && (
                <p className="text-lg text-muted-foreground font-medium">
                  {jobTitle}
                </p>
              )}
              {user?.email && (
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              )}
            </div>

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
              
              {user.countryOfResidence && (
                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  {user.countryOfResidence}
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

export default PublicProfileHeader;