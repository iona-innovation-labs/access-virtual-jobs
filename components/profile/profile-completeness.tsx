import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ProfileCompleteness } from "@/hooks/use-profile";

interface ProfileCompletenessIndicatorProps {
  completeness: ProfileCompleteness | null;
  loading?: boolean;
  className?: string;
}

const getCompletionColor = (percentage: number) => {
  if (percentage >= 90) return "text-green-600";
  if (percentage >= 70) return "text-blue-600";
  if (percentage >= 50) return "text-yellow-600";
  return "text-red-600";
};

const getProgressBarColor = (percentage: number) => {
  if (percentage >= 90) return "bg-green-500";
  if (percentage >= 70) return "bg-blue-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

export const ProfileCompletenessIndicator = ({
  completeness,
  loading = false,
  className = "",
}: ProfileCompletenessIndicatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Loading state
  if (loading || !completeness) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-background animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
              <div className="h-2 bg-muted rounded w-full animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { percentage, completedFields, totalFields, missingFields, sections } =
    completeness;
  const colorClass = getCompletionColor(percentage);

  // Get completion message
  const getCompletionMessage = () => {
    if (percentage >= 90) return "Excellent! Your profile is nearly complete.";
    if (percentage >= 70)
      return "Great progress! Just a few more details needed.";
    if (percentage >= 50) return "Good start! Let's complete more sections.";
    return "Welcome! Let's build your profile step by step.";
  };

  // Get priority sections (lowest completion first)
  const prioritySections = Object.entries(sections)
    .sort(([, a], [, b]) => a.percentage - b.percentage)
    .slice(0, 3);

  return (
    <Card
      className={`w-full shadow-sm bg-background py-none p-none border-none shadow-sm ${className}`}
    >
      <CardContent className="p-4 bg-card rounded-xl shadow-none">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          {/* Main indicator - always visible */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0`}
            >
              {percentage >= 90 ? (
                <CheckCircle className={`w-5 h-5 ${colorClass}`} />
              ) : (
                <User className={`w-5 h-5 ${colorClass}`} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-foreground">
                  Profile Completion
                </h3>
                <Badge variant="outline" className={`text-xs ${colorClass}`}>
                  {percentage}%
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${getProgressBarColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {completedFields}/{totalFields}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {getCompletionMessage()}
              </p>
            </div>

            {/* Toggle button - only show if there are missing fields */}
            {missingFields.length > 0 && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>

          {/* Expanded content */}
          <CollapsibleContent className="mt-4">
            <div className="space-y-4 pt-4">
              {prioritySections.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-foreground">
                      Sections to Complete
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {prioritySections.map(([sectionKey, section]) => (
                      <div
                        key={sectionKey}
                        className="p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-medium text-foreground">
                            {section.name}
                          </h5>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getCompletionColor(section.percentage)}`}
                          >
                            {section.percentage}%
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getProgressBarColor(section.percentage)}`}
                              style={{ width: `${section.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {section.completed}/{section.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing fields summary */}
              {missingFields.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-foreground" />
                    <h4 className="text-sm font-medium text-foreground">
                      Missing Information ({missingFields.length} items)
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {missingFields.slice(0, 8).map((field, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs text-foreground"
                      >
                        {field}
                      </Badge>
                    ))}
                    {missingFields.length > 8 && (
                      <Badge
                        variant="secondary"
                        className="text-xs text-foreground"
                      >
                        +{missingFields.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Completion celebration */}
              {percentage >= 90 && (
                <div className="p-3 bg-card rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-foreground">
                      Outstanding! Your profile is ready to impress employers.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletenessIndicator;
