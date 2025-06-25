import React, { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ProfileCompleteness } from "@/hooks/use-profile";

interface ProfileCompletenessIndicatorProps {
  completeness: ProfileCompleteness | null;
  loading?: boolean;
  className?: string;
  // onUpdateSection is now optional since we handle it internally
  onUpdateSection?: (sectionKey: string) => void;
}

// Move the mapping inside the component
const sectionMapping = {
  contact: {
    route: "/app/profile/edit",
    sectionId: "contact_section",
  },
  jobPreferences: {
    route: "/app/profile/edit",
    sectionId: "job_preference_section",
  },
  professionalProfile: {
    route: "/app/profile/edit",
    sectionId: "professional_profile_section",
  },
  prescreening: {
    route: "/app/profile/edit",
    sectionId: "pre_screening_section",
  },
  assessment: {
    route: "/app/profile/edit",
    sectionId: "assessment_section",
  },
  technicalSetup: {
    route: "/app/profile/edit",
    sectionId: "technical_setup_section",
  },
  additionalInfo: {
    route: "/app/profile/edit",
    sectionId: "additional_info_section",
  },
  fileUploads: {
    route: "/app/profile/edit?active=files",
    sectionId: "file_uploads_section",
  },
};

const getSectionDescription = (sectionKey: string, percentage: number) => {
  if (percentage === 0) {
    const descriptions = {
      contact: "Add your contact details so employers can reach you",
      jobPreferences: "Tell us about your ideal job to get better matches",
      professionalProfile:
        "Just getting started? You can also add relevant volunteer or project experiences",
      prescreening:
        "Complete your pre-screening questions to qualify for more positions",
      assessment:
        "Take assessments to showcase your skills to potential employers",
      technicalSetup: "Set up your technical preferences and requirements",
      additionalInfo: "Add any additional information that makes you stand out",
      fileUploads: "Upload your resume and other important documents",
    };
    return (
      descriptions[sectionKey as keyof typeof descriptions] ||
      "Complete this section to improve your profile"
    );
  }
  return null;
};

const getProgressColor = (percentage: number) => {
  if (percentage === 100) return "bg-green-500";
  if (percentage > 0) return "bg-yellow-500";
  return "bg-red-200";
};

export const ProfileCompletenessIndicator = ({
  completeness,
  loading = false,
  className = "",
  onUpdateSection, // Keep this for backward compatibility
}: ProfileCompletenessIndicatorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  // Internal navigation handler
  const handleUpdateSection = (sectionKey: string) => {
    // If external handler is provided, use it (for backward compatibility)
    if (onUpdateSection) {
      onUpdateSection(sectionKey);
      return;
    }

    // Otherwise, use internal navigation logic
    console.log("=== Internal Navigation ===");
    console.log("sectionKey:", sectionKey);

    const section = sectionMapping[sectionKey as keyof typeof sectionMapping];

    if (!section || !section.route) {
      console.log(`Section ${sectionKey} not implemented yet`);
      return;
    }

    const currentFullUrl = window.location.pathname + window.location.search;
    const targetRoute = section.route;

    if (currentFullUrl === targetRoute) {
      console.log("Same route - scrolling to section:", section.sectionId);
      scrollToSection(section.sectionId);
    } else {
      console.log("Different route - navigating to:", section.route);
      router.push(section.route);

      setTimeout(() => {
        scrollToSection(section.sectionId);
      }, 500);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const maxAttempts = 20;
    const delay = 250;
    let attempts = 0;

    const tryScroll = () => {
      const element = document.getElementById(sectionId);
      attempts++;

      if (element) {
        console.log(`Found element '${sectionId}' after ${attempts} attempts`);
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });

        element.classList.add("ring-2", "ring-primary", "ring-opacity-50");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-primary", "ring-opacity-50");
        }, 2000);
      } else if (attempts < maxAttempts) {
        console.log(
          `Attempt ${attempts}: Element '${sectionId}' not found, retrying...`
        );
        setTimeout(tryScroll, delay);
      } else {
        console.warn(
          `Element with ID '${sectionId}' not found after ${maxAttempts} attempts`
        );
      }
    };

    tryScroll();
  };

  // ... rest of your existing component code (loading, complete state, etc.)

  // Loading state
  if (loading || !completeness) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { percentage, sections } = completeness;

  // Get incomplete sections (less than 100%)
  const sectionEntries = Object.entries(sections);
  const incompleteSections = sectionEntries.filter(
    ([, section]) => section.percentage < 100
  );
  const totalSteps = incompleteSections.length;

  // If profile is complete, show success state
  if (totalSteps === 0) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="px-4 text-center gap-2 flex items-center justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 " />
          <h3 className="text-lg font-semibold text-foreground">
            Profile Complete!
          </h3>
        </CardContent>
      </Card>
    );
  }

  const currentSection = incompleteSections[currentStep];
  const [sectionKey, section] = currentSection;

  const sectionDescription = getSectionDescription(
    sectionKey,
    section.percentage
  );

  return (
    <Card className={`w-full py-0 shadow-sm ${className}`}>
      <div className="h-2 bg-muted rounded-t-lg">
        <div
          className="h-full bg-brand rounded-tl-lg transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium text-foreground mb-1">
              Your profile can&apos;t be found by recruiters because it&apos;s
              missing key information
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalSteps} steps to complete
            </p>
          </div>
        </div>

        {/* Current step card */}
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-foreground mb-1">
                {section.name}
              </h4>

              {section.percentage === 0 ? (
                sectionDescription && (
                  <p className="text-muted-foreground mb-3 text-sm">
                    {sectionDescription}
                  </p>
                )
              ) : (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getProgressColor(section.percentage)}`}
                        style={{ width: `${section.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {section.completed}/{section.total}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {section.percentage}% complete -{" "}
                    {section.total - section.completed} items remaining
                  </p>
                </div>
              )}

              <Button
                onClick={() => handleUpdateSection(sectionKey)}
                className="bg-muted text-foreground/50 hover:text-white cursor-pointer hover:bg-brand-dark"
              >
                Update now
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            variant="ghost"
            onClick={() =>
              setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))
            }
            disabled={currentStep === totalSteps - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletenessIndicator;
