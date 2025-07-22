"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProfileTabContext, TabName } from "@/context/profile-tab-context";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Loader2 } from "lucide-react";

interface StepNavigationProps {
  onProceed?: () => Promise<boolean>; // Custom proceed logic for each step
  showCancel?: boolean;
  showProceed?: boolean;
  proceedText?: string;
  cancelText?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  onProceed,
  showCancel = true,
  showProceed = true,
  proceedText = "Proceed",
  cancelText = "Cancel",
}) => {
  const router = useRouter();
  const params = useParams();
  const {
    currentTab,
    setCurrentTab,
    validateStepCompletion,
    refreshStepCompletion,
    stepCompletionStatus,
  } = useProfileTabContext();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get job ID from URL params
  const jobId = params.id as string;

  const getNextStep = (current: TabName): TabName | null => {
    const steps: TabName[] = ["Profile", "Files", "Verification", "Review"];
    const currentIndex = steps.indexOf(current);
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    // Redirect to job listing page
    router.push(`/app/jobs/v/${jobId}`);
  };

  const handleProceed = async () => {
    setIsLoading(true);

    try {
      // For Review step, handle job submission differently
      if (currentTab === "Review") {
        if (onProceed) {
          const success = await onProceed();
          if (!success) {
            setShowUnsavedDialog(true);
          }
          // Don't proceed to next step for review - job submission handles redirect
        }
        return;
      }

      // For other steps, follow normal validation and proceed flow
      if (onProceed) {
        const canProceed = await onProceed();
        if (!canProceed) {
          setShowUnsavedDialog(true);
          return;
        }
      }

      // Validate current step completion (skip for Verification step)
      if (currentTab !== "Verification") {
        const isCurrentStepComplete = await validateStepCompletion(currentTab);

        if (!isCurrentStepComplete) {
          setShowUnsavedDialog(true);
          return;
        }
      }

      // Refresh all step completion statuses
      await refreshStepCompletion();

      // Move to next step
      const nextStep = getNextStep(currentTab);
      if (nextStep) {
        setCurrentTab(nextStep);
      }
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      setShowUnsavedDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Sticky Navigation Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center gap-4">
            {/* Cancel Button */}
            {showCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {cancelText}
              </Button>
            )}

            {/* Step Info */}
            <div className="flex-1 text-center">
              <div className="text-sm text-muted-foreground">
                Step: {currentTab}
                {stepCompletionStatus[currentTab] && (
                  <span className="ml-2 text-success">✓ Complete</span>
                )}
              </div>
            </div>

            {/* Proceed Button */}
            {showProceed && (
              <Button
                onClick={handleProceed}
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  proceedText
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Job Application"
        description="Are you sure you want to cancel this job application? Any unsaved progress will be lost."
        confirmText="Yes, Cancel"
        cancelText="Continue Application"
        onConfirm={handleConfirmCancel}
        variant="destructive"
      />

      {/* Unsaved Changes Dialog */}
      <ConfirmationDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        title="Incomplete Step"
        description="This step is not yet complete. Please ensure all required fields are filled and saved before proceeding."
        confirmText="Got it"
        cancelText=""
        onConfirm={() => {}} // Just close the dialog
      />
    </>
  );
};
