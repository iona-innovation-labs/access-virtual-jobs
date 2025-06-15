import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Target, 
  Linkedin, 
  Instagram, 
  Twitter,
  ExternalLink
} from "lucide-react";

interface Profile {
  desiredSalary?: string;
  salaryUnit?: string;
  isPublicSalary?: boolean;
  jobSearchStatus?: string;
  jobType?: string;
  linkedInLink?: string;
  instagramLink?: string;
  xLink?: string;
}

interface ProfileOverviewProps {
  profile: Profile;
  loading?: boolean;
}

export const PublicProfileOverview = ({ profile, loading = false }: ProfileOverviewProps) => {
  if (loading) {
    return (
      <Card className="w-full h-fit p-4 col-span-2">
        <CardHeader className="pb-4">
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  // Format salary display
  const formatSalary = () => {
    if (!profile.isPublicSalary || !profile.desiredSalary || profile.desiredSalary === "0") {
      return null;
    }
    
    const amount = profile.desiredSalary;
    const unit = profile.salaryUnit || "";
    
    // Format the display based on unit
    if (unit.toLowerCase().includes("hour")) {
      return `$${amount}/hour`;
    } else if (unit.toLowerCase().includes("month")) {
      return `$${amount}/month`;
    } else if (unit.toLowerCase().includes("year") || unit.toLowerCase().includes("annual")) {
      return `$${amount}/year`;
    }
    
    return `$${amount} ${unit}`;
  };

  // Extract domain from URL for display
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  const formattedSalary = formatSalary();
  const formattedJobStatus = formatJobSearchStatus(profile.jobSearchStatus || "");

  return (
    <Card className="w-full h-fit py-8">
      <CardContent className="space-y-6">
        {/* Job Search Status */}
        {formattedJobStatus && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">Job Search Status</p>
              <Badge
                variant="outline"
                className={`px-3 py-1.5 text-sm font-medium border ${getStatusColor(profile.jobSearchStatus || "")}`}
              >
                {formattedJobStatus}
              </Badge>
            </div>
          </div>
        )}

        {/* Desired Job Type */}
        {profile.jobType && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Desired Job Type</p>
              <p className="text-sm text-muted-foreground mt-1">
                {profile.jobType}
              </p>
            </div>
          </div>
        )}

        {/* Professional Links */}
        {profile.linkedInLink && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Linkedin className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">LinkedIn Profile</p>
              <a 
                href={profile.linkedInLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 mt-1"
              >
                {getDomainFromUrl(profile.linkedInLink)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Social Links */}
        {(profile.instagramLink || profile.xLink) && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Instagram className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">Social Media</p>
              <div className="space-y-2">
                {profile.instagramLink && (
                  <a 
                    href={profile.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    Instagram
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.xLink && (
                  <a 
                    href={profile.xLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    X (Twitter)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!formattedSalary && !formattedJobStatus && !profile.jobType && !profile.linkedInLink && !profile.instagramLink && !profile.xLink && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No overview information available</p>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default PublicProfileOverview;