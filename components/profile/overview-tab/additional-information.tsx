import React from "react";
import {
  Users,
  FileText,
  Megaphone,
  UserPlus,
  ExternalLink,
  Info,
  Baby,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkSample {
  id: number;
  profileId: number;
  link: string;
}

interface AdditionalInformationViewProps {
  isPublic?: boolean;
  data?: {
    numberOfChildren?: string;
    workSamples?: WorkSample[];
    howHear?: string | null;
    referrer?: string | null;
  } | null;
  className?: string;
}

interface ViewItemProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isEmpty?: boolean;
}

const ViewItem = ({
  label,
  icon,
  children,
  isEmpty = false,
}: ViewItemProps) => {
  return (
    <div
      className={`p-4 border border-border rounded-lg bg-card ${isEmpty ? "opacity-60" : ""}`}
    >
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

const getChildrenInfo = (numberOfChildren: string) => {
  const count = parseInt(numberOfChildren) || 0;

  if (count === 0) {
    return {
      label: "No children",
      description: "No dependent children",
      badgeColor: "bg-muted text-muted-foreground",
      icon: <Users className="w-3 h-3" />,
    };
  } else if (count === 1) {
    return {
      label: "1 child",
      description: "One dependent child",
      badgeColor: "bg-blue-100 text-blue-700",
      icon: <Baby className="w-3 h-3" />,
    };
  } else {
    return {
      label: `${count} children`,
      description: `${count} dependent children`,
      badgeColor: "bg-blue-100 text-blue-700",
      icon: <Users className="w-3 h-3" />,
    };
  }
};

const getHowHearInfo = (howHear: string | null) => {
  if (!howHear) {
    return {
      label: "Not specified",
      description: "Source not provided",
      badgeColor: "bg-muted text-muted-foreground",
    };
  }

  const sourceMap: Record<
    string,
    { label: string; description: string; badgeColor: string }
  > = {
    job_board: {
      label: "Job Board",
      description: "Found through job posting sites",
      badgeColor: "bg-green-100 text-green-700",
    },
    social_media: {
      label: "Social Media",
      description: "Discovered via social platforms",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    referral: {
      label: "Referral",
      description: "Recommended by someone",
      badgeColor: "bg-orange-100 text-orange-700",
    },
    company_website: {
      label: "Company Website",
      description: "Found through company site",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    recruiter: {
      label: "Recruiter Contact",
      description: "Contacted by recruiter",
      badgeColor: "bg-indigo-100 text-indigo-700",
    },
    networking: {
      label: "Networking",
      description: "Professional networking",
      badgeColor: "bg-teal-100 text-teal-700",
    },
    other: {
      label: "Other Source",
      description: "Alternative discovery method",
      badgeColor: "bg-gray-100 text-gray-700",
    },
  };

  return (
    sourceMap[howHear] || {
      label: howHear,
      description: "Custom source",
      badgeColor: "bg-gray-100 text-gray-700",
    }
  );
};

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const AdditionalInformationView = ({
  isPublic = false,
  data,
  className = "",
}: AdditionalInformationViewProps) => {
  // Handle loading/null state
  if (!data) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Info className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Additional Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Loading additional candidate details...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-l-4 border-l-gray-200 bg-gray-50/50 p-4 rounded-r-lg animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const childrenInfo = getChildrenInfo(data.numberOfChildren || "0");
  const howHearInfo = getHowHearInfo(data?.howHear || "");
  const hasWorkSamples = data.workSamples && data.workSamples.length > 0;
  const hasReferrer = data.referrer && data.referrer.trim() !== "";

  return (
    <Card className={`w-full shadow-sm ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Info className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Additional Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Personal details and discovery information
            </p>
          </div>
        </div>
        {!isPublic ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Family Information */}
            <ViewItem
              label="Family Status"
              icon={<Users className="w-4 h-4 text-muted-foreground" />}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${childrenInfo.badgeColor} font-medium`}>
                    {childrenInfo.icon}
                    <span className="ml-1">{childrenInfo.label}</span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {childrenInfo.description}
                </p>
              </div>
            </ViewItem>

            {/* Discovery Source */}
            <ViewItem
              label="How They Found Us"
              icon={<Megaphone className="w-4 h-4 text-muted-foreground" />}
              isEmpty={!data.howHear}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${howHearInfo.badgeColor} font-medium`}>
                    {howHearInfo.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {howHearInfo.description}
                </p>
              </div>
            </ViewItem>

            {/* Referrer Information */}
            <ViewItem
              label="Referrer"
              icon={<UserPlus className="w-4 h-4 text-muted-foreground" />}
              isEmpty={!hasReferrer}
            >
              <div className="space-y-2">
                {hasReferrer ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {data.referrer}
                      </span>
                      <Badge className="bg-green-100 text-green-700">
                        <UserPlus className="w-3 h-3 mr-1" />
                        Referred
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Candidate was referred by this person
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">
                      No referrer provided
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Direct application or discovery
                    </p>
                  </>
                )}
              </div>
            </ViewItem>

            {/* Work Samples */}
            <ViewItem
              label="Work Samples"
              icon={<FileText className="w-4 h-4 text-muted-foreground" />}
              isEmpty={!hasWorkSamples}
            >
              <div className="space-y-3">
                {hasWorkSamples ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 font-medium">
                        <FileText className="w-3 h-3 mr-1" />
                        {data.workSamples!.length} sample
                        {data.workSamples!.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {data.workSamples!.slice(0, 3).map((sample, index) => (
                        <div
                          key={sample.id}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          {isValidUrl(sample.link) ? (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => window.open(sample.link, "_blank")}
                            >
                              Work Sample {index + 1}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground truncate">
                              {sample.link}
                            </span>
                          )}
                        </div>
                      ))}
                      {data.workSamples!.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{data.workSamples!.length - 3} more sample
                          {data.workSamples!.length - 3 !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">
                      No work samples provided
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Portfolio may be available elsewhere
                    </p>
                  </>
                )}
              </div>
            </ViewItem>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Work Samples */}
            <ViewItem
              label="Work Samples"
              icon={<FileText className="w-4 h-4 text-muted-foreground" />}
              isEmpty={!hasWorkSamples}
            >
              <div className="space-y-3">
                {hasWorkSamples ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 font-medium">
                        <FileText className="w-3 h-3 mr-1" />
                        {data.workSamples!.length} sample
                        {data.workSamples!.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {data.workSamples!.slice(0, 3).map((sample, index) => (
                        <div
                          key={sample.id}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          {isValidUrl(sample.link) ? (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => window.open(sample.link, "_blank")}
                            >
                              Work Sample {index + 1}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground truncate">
                              {sample.link}
                            </span>
                          )}
                        </div>
                      ))}
                      {data.workSamples!.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{data.workSamples!.length - 3} more sample
                          {data.workSamples!.length - 3 !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">
                      No work samples provided
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Portfolio may be available elsewhere
                    </p>
                  </>
                )}
              </div>
            </ViewItem>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdditionalInformationView;
