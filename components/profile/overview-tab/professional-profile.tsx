import React from "react";
import {
  User,
  Calendar,
  GraduationCap,
  Linkedin,
  Instagram,
  Twitter,
  Globe,
  Star,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfessionalProfileViewProps {
  data?: {
    jobTitle?: string;
    numberOfExperience?: string;
    educationStatus?: string;
    linkedInLink?: string;
    instagramLink?: string;
    xLink?: string;
    portfolioLinks?: Array<{
      title: string;
      url: string;
      description?: string;
      category?: string;
    }>;
    skills?: Array<{
      name: string;
      category?: string;
      starRating?: number; // Updated to use star rating (1-5)
      yearsOfExperience?: number;
    }>;
  } | null;
  className?: string;
}

interface ViewItemProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ViewItem = ({ label, icon, children }: ViewItemProps) => {
  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </h3>
          {children}
        </div>
      </div>
    </div>
  );
};

const getExperienceLabel = (experience: string) => {
  const experienceMap: { [key: string]: string } = {
    "0": "No Experience",
    "1": "1 Year",
    "2": "2 Years",
    "3": "3 Years",
    "4": "4 Years",
    "5": "5 Years",
    "6-10": "6-10 Years",
    "10+": "10+ Years",
  };
  return experienceMap[experience] || experience;
};

const getEducationLabel = (education: string) => {
  const educationMap: { [key: string]: string } = {
    high_school: "High School",
    associate: "Associate Degree",
    bachelor: "Bachelor's Degree",
    master: "Master's Degree",
    phd: "PhD/Doctorate",
    other: "Other",
  };
  return educationMap[education] || education;
};

// Updated function to handle star rating colors
const getStarRatingColor = (rating?: number) => {
  if (!rating) return "text-muted-foreground";

  const colorMap: { [key: number]: string } = {
    1: "text-red-500",
    2: "text-orange-500",
    3: "text-yellow-500",
    4: "text-blue-500",
    5: "text-green-500",
  };
  return colorMap[rating] || "text-muted-foreground";
};

// Component to render star rating
const StarRating = ({ rating }: { rating?: number }) => {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= rating
              ? `${getStarRatingColor(rating)} fill-current`
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">({rating}/5)</span>
    </div>
  );
};

export const ProfessionalProfileView = ({
  data,
  className = "",
}: ProfessionalProfileViewProps) => {
  // Handle loading/null state
  if (!data) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Professional Profile
              </h2>
              <p className="text-sm text-muted-foreground">
                Loading professional information...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 border border-border rounded-lg bg-card animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-5 bg-muted rounded w-2/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasSkills = data.skills && data.skills.length > 0;
  const hasPortfolioLinks =
    data.portfolioLinks && data.portfolioLinks.length > 0;
  const hasSocialLinks = data.linkedInLink || data.instagramLink || data.xLink;

  return (
    <Card className={`w-full shadow-sm ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Professional Profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Background, experience, and online presence
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Title */}
            <ViewItem
              label="Current Role"
              icon={<User className="w-4 h-4 text-muted-foreground" />}
            >
              <div>
                {data.jobTitle ? (
                  <p className="text-base font-medium text-foreground">
                    {data.jobTitle}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Not specified
                  </p>
                )}
              </div>
            </ViewItem>

            {/* Experience */}
            <ViewItem
              label="Experience Level"
              icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
            >
              <div>
                {data.numberOfExperience ? (
                  <p className="text-base font-medium text-foreground">
                    {getExperienceLabel(data.numberOfExperience)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Not specified
                  </p>
                )}
              </div>
            </ViewItem>

            {/* Education */}
            <ViewItem
              label="Education Level"
              icon={<GraduationCap className="w-4 h-4 text-muted-foreground" />}
            >
              <div>
                {data.educationStatus ? (
                  <p className="text-base font-medium text-foreground">
                    {getEducationLabel(data.educationStatus)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Not specified
                  </p>
                )}
              </div>
            </ViewItem>
          </div>
          {hasSkills && (
            <ViewItem
              label="Skills & Expertise"
              icon={<Star className="w-4 h-4 text-muted-foreground" />}
            >
              <div className="space-y-6">
                {/* Group skills by category */}
                {["technical", "soft", "language", "tools", "other", ""].map(
                  (category) => {
                    const categorySkills =
                      data.skills?.filter(
                        (skill) => (skill.category || "") === category
                      ) || [];

                    if (categorySkills.length === 0) return null;

                    return (
                      <div key={category || "uncategorized"}>
                        {category && (
                          <h5 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                            {category}
                          </h5>
                        )}
                        <div className="space-y-3">
                          {categorySkills.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <h6 className="text-base font-semibold text-foreground">
                                  {skill.name}
                                </h6>
                                {skill.yearsOfExperience &&
                                  skill.yearsOfExperience > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary"
                                    >
                                      {skill.yearsOfExperience}y exp
                                    </Badge>
                                  )}
                              </div>

                              <StarRating rating={skill.starRating} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </ViewItem>
          )}

          {/* Social Links */}
          {hasSocialLinks && (
            <ViewItem
              label="Social Media & Professional Links"
              icon={<Globe className="w-4 h-4 text-muted-foreground" />}
            >
              <div className="space-y-2">
                {data.linkedInLink && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={data.linkedInLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground hover:text-blue-600 hover:underline flex items-center gap-1"
                    >
                      LinkedIn Profile
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {data.instagramLink && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={data.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground hover:text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Instagram Profile
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {data.xLink && (
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={data.xLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground hover:text-blue-600 hover:underline flex items-center gap-1"
                    >
                      X (Twitter) Profile
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </ViewItem>
          )}

          {/* Portfolio Links */}
          {hasPortfolioLinks && (
            <ViewItem
              label="Portfolio & Project Links"
              icon={<Globe className="w-4 h-4 text-muted-foreground" />}
            >
              <div className="space-y-3">
                {data.portfolioLinks?.map((link, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-3 bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground mb-1">
                          {link.title || `Portfolio Link ${index + 1}`}
                        </h4>
                        {link.description && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {link.description}
                          </p>
                        )}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-foreground hover:text-blue-600 hover:underline break-all flex items-center gap-1"
                        >
                          {link.url}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                      {link.category && (
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0"
                        >
                          {link.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ViewItem>
          )}

          {/* Empty State */}
          {!data.jobTitle &&
            !data.numberOfExperience &&
            !data.educationStatus &&
            !hasSkills &&
            !hasPortfolioLinks &&
            !hasSocialLinks && (
              <div className="border border-border rounded-lg p-8 bg-muted/30 text-center">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No professional information provided
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You haven&apos;t completed your professional profile yet
                </p>
              </div>
            )}
        </div>

        {/* Footer note for recruiters */}
        {(hasSkills || hasPortfolioLinks) && (
          <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-2.5 h-2.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Portfolio links and skill ratings are
                  self-reported by you. Consider reviewing your work samples and
                  conducting technical evaluations.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalProfileView;
