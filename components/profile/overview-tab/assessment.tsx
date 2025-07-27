import React from "react";
import { FileText, Video, ExternalLink, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AssessmentContentViewProps {
  data?: {
    assessmentTests?: Array<{
      link: string;
    }>;
    contentLinks?: Array<{
      link: string;
    }>;
  } | null;
  className?: string;
}

interface LinkItemProps {
  label: string;
  icon: React.ReactNode;
  links: Array<{ link: string }>;
  emptyMessage: string;
  linkType: "assessment" | "content";
}

const LinkItem = ({
  label,
  icon,
  links,
  emptyMessage,
  linkType,
}: LinkItemProps) => {
  const hasLinks =
    links &&
    links.length > 0 &&
    links.some((item) => item.link && item.link.trim() !== "");
  const validLinks =
    links?.filter((item) => item.link && item.link.trim() !== "") || [];

  const getLinkType = (url: string) => {
    const domain = url.toLowerCase();
    if (domain.includes("youtube.com") || domain.includes("youtu.be"))
      return "YouTube";
    if (domain.includes("drive.google.com")) return "Google Drive";
    if (domain.includes("dropbox.com")) return "Dropbox";
    if (domain.includes("onedrive.live.com")) return "OneDrive";
    if (domain.includes("vimeo.com")) return "Vimeo";
    if (domain.includes("crystalknows.com")) return "Crystal Knows";
    return "External Link";
  };

  const getLinkIcon = (url: string) => {
    const domain = url.toLowerCase();
    if (
      domain.includes("youtube.com") ||
      domain.includes("youtu.be") ||
      domain.includes("vimeo.com")
    ) {
      return <Play className="w-3 h-3" />;
    }
    return <ExternalLink className="w-3 h-3" />;
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {label}
          </h3>

          {hasLinks ? (
            <div className="space-y-3">
              {validLinks.map((item, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-3 bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getLinkType(item.link)}
                        </Badge>
                        {linkType === "assessment" && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            Assessment
                          </Badge>
                        )}
                        {linkType === "content" && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            <Video className="w-3 h-3 mr-1" />
                            Recording
                          </Badge>
                        )}
                      </div>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground hover:text-blue-600 hover:underline break-all flex items-center gap-1 group"
                      >
                        {item.link}
                        {getLinkIcon(item.link)}
                      </a>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        View
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-lg p-6 bg-muted/30 text-center">
              {linkType === "assessment" ? (
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              ) : (
                <Video className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              )}
              <p className="text-sm text-muted-foreground italic">
                {emptyMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AssessmentContentView = ({
  data,
  className = "",
}: AssessmentContentViewProps) => {
  // Handle loading/null state
  if (!data) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Assessment & Content
              </h2>
              <p className="text-sm text-muted-foreground">
                Loading assessments and content...
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 border border-border rounded-lg bg-card animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-20 bg-muted rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasAssessments =
    data.assessmentTests &&
    data.assessmentTests.length > 0 &&
    data.assessmentTests.some((item) => item.link && item.link.trim() !== "");
  const hasContent =
    data.contentLinks &&
    data.contentLinks.length > 0 &&
    data.contentLinks.some((item) => item.link && item.link.trim() !== "");
  const hasAnyContent = hasAssessments || hasContent;

  return (
    <Card className={`w-full shadow-sm ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Assessment & Content
            </h2>
            <p className="text-sm text-muted-foreground">
              Skills assessments and English proficiency demonstrations
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <LinkItem
            label="Assessment Tests"
            icon={<FileText className="w-4 h-4 text-muted-foreground" />}
            links={data.assessmentTests || []}
            emptyMessage="No assessment tests submitted"
            linkType="assessment"
          />

          <LinkItem
            label="English Proficiency Content"
            icon={<Video className="w-4 h-4 text-muted-foreground" />}
            links={data.contentLinks || []}
            emptyMessage="No English proficiency recordings submitted"
            linkType="content"
          />
        </div>

        {/* Complete empty state */}
        {!hasAnyContent && (
          <div className="mt-6 border border-border rounded-lg p-8 bg-muted/30 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No assessments or content submitted
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You haven&apos;t completed the assessment requirements yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentContentView;
