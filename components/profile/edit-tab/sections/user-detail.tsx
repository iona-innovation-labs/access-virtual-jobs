import React from "react";
import {
  User,
  Calendar,
  MapPin,
  Settings,
  UserCircle,
  AtSign,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useUserInfo } from "@/hooks/use-user-info";

export type UserProfileData = {
  firstName?: string;
  lastName?: string;
  username?: string;
  countryOfResidence?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  dateOfBirth?: string;
};

interface ViewItemProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

const ViewItem = ({ label, icon, children, description }: ViewItemProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        {description && (
          <p className="text-xs text-muted-foreground/70">{description}</p>
        )}
      </div>
    </div>
    <div className="pl-11">{children}</div>
  </div>
);

const CountryLabels: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  IN: "India",
  BR: "Brazil",
  MX: "Mexico",
  PH: "Philippines",
  SG: "Singapore",
  NZ: "New Zealand",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  IE: "Ireland",
  PL: "Poland",
  CZ: "Czech Republic",
  HU: "Hungary",
  PT: "Portugal",
  GR: "Greece",
  TR: "Turkey",
  IL: "Israel",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  ZA: "South Africa",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
  TH: "Thailand",
  VN: "Vietnam",
  ID: "Indonesia",
  MY: "Malaysia",
  TW: "Taiwan",
  HK: "Hong Kong",
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Not specified";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

export const UserProfileSection = () => {
  const { userInfo, isLoading: userLoading } = useUserInfo();
  if (userLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                <div>
                  <div className="h-5 bg-gray-300 rounded w-40 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-60"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-300 rounded w-20"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="pl-11">
                    <div className="h-6 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Personal Information
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                View your personal details and preferences
              </p>
            </div>
          </div>

          <Link href="/app/settings/general">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ViewItem
              label="First Name"
              icon={<User className="w-4 h-4 text-muted-foreground" />}
              description="Your given name"
            >
              <p className="text-base font-medium text-foreground">
                {userInfo?.firstName || "Not specified"}
              </p>
            </ViewItem>
            <ViewItem
              label="Last Name"
              icon={<User className="w-4 h-4 text-muted-foreground" />}
              description="Your family name"
            >
              <p className="text-base font-medium text-foreground">
                {userInfo?.lastName || "Not specified"}
              </p>
            </ViewItem>

            <ViewItem
              label="Username"
              icon={<AtSign className="w-4 h-4 text-muted-foreground" />}
              description="Your unique identifier"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  @{userInfo?.username || "not-set"}
                </Badge>
              </div>
            </ViewItem>

            <ViewItem
              label="Country of Residence"
              icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
              description="Where you currently live"
            >
              <p className="text-base font-medium text-foreground">
                {userInfo?.countryOfResidence
                  ? CountryLabels[userInfo?.countryOfResidence] ||
                    userInfo.countryOfResidence
                  : "Not specified"}
              </p>
            </ViewItem>

            <ViewItem
              label="Gender"
              icon={<UserCircle className="w-4 h-4 text-muted-foreground" />}
              description="Your gender identity"
            >
              <p className="text-base font-medium text-foreground">
                {userInfo?.gender}
              </p>
            </ViewItem>

            <ViewItem
              label="Date of Birth"
              icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
              description="Your birth date"
            >
              <p className="text-base font-medium text-foreground">
                {formatDate(
                  (userInfo?.dateOfBirth as string | undefined) ??
                    new Date().toISOString().split("T")[0]
                )}
              </p>
            </ViewItem>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-md">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">👤 Personal Information Tips:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p>• Keep your profile information up to date</p>
              <p>• Choose a professional username for business use</p>
              <p>• Accurate location helps with regional opportunities</p>
              <p>• Complete profiles get better visibility</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
