"use client";

import { useProfileTabContext } from "@/context/profile-tab-context";
import UploadFileForm from "@/components/profile/upload-files-form";
import ApplicationProfileForm from "@/components/profile/edit-tab/application-profile-form";
import { StepNavigation } from "@/components/profile/step-navigation";
import { ReviewStep } from "@/components/profile/review-tab";
import { useParams } from "next/navigation";

// Verification Step Component
const VerificationStep = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px] mb-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-4">Verification Complete</h2>
        <p className="text-muted-foreground mb-6">
          All your information has been verified. You can now proceed to review
          your complete application before submission.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">✅ Verification Status:</p>
          <ul className="text-left space-y-1">
            <li>• Profile information verified</li>
            <li>• Documents validated</li>
            <li>• Ready for final review</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePageClient() {
  const { currentTab } = useProfileTabContext();
  const params = useParams();

  // Custom proceed logic for each step
  const handleProfileProceed = async (): Promise<boolean> => {
    try {
      // Check if there are any unsaved changes in the profile forms
      // This could be expanded to check specific form states

      // For now, we'll trigger a save attempt and check if it succeeds
      // The backend validation will handle the actual completeness check

      // You could implement form dirty checking here if needed:
      // const hasUnsavedChanges = checkForUnsavedChanges();
      // if (hasUnsavedChanges) {
      //   return false; // This will trigger the "unsaved changes" dialog
      // }

      return true; // Let backend validation handle the rest
    } catch (error) {
      console.error("Error in profile proceed logic:", error);
      return false;
    }
  };

  const handleFilesProceed = async (): Promise<boolean> => {
    try {
      // For Files step, we could check if upload is in progress
      // or if there are any pending file operations

      // Example: Check if files are currently uploading
      // const isUploading = checkIfFilesAreUploading();
      // if (isUploading) {
      //   return false; // Show "wait for upload to complete" message
      // }

      return true; // Let backend validation check file requirements
    } catch (error) {
      console.error("Error in files proceed logic:", error);
      return false;
    }
  };

  // Add review proceed handler for job submission
  const handleReviewProceed = async (): Promise<boolean> => {
    // Review step submits the job application
    try {
      const fullJobId = params.id as string;
      // Extract numeric ID from URL like "8-data-entry-specialist" -> "8"
      const jobId = fullJobId ? fullJobId.split("-")[0] : null;

      console.log("Full Job ID from URL:", fullJobId); // Debug log
      console.log("Extracted Job ID:", jobId); // Debug log

      if (!jobId || !fullJobId) {
        console.error("Job ID not found in URL params");
        return false;
      }

      console.log("Submitting application for job:", jobId); // Debug log

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: parseInt(jobId) }), // Convert to integer
      });

      console.log("Response status:", response.status); // Debug log

      const result = await response.json();
      console.log("Response data:", result); // Debug log

      if (result.ok) {
        // Success - redirect to job listing using full job ID
        console.log(
          "Application submitted successfully:",
          result.applicationId
        );
        window.location.href = `/app/jobs/v/${fullJobId}`;
        return true;
      } else {
        // Handle error (like already applied)
        console.error("Application submission failed:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
      return false;
    }
  };

  const handleVerificationProceed = async (): Promise<boolean> => {
    // Verification step just validates and moves to review
    // No job submission happens here anymore
    return true;
  };

  const getStepProceedHandler = () => {
    switch (currentTab) {
      case "Profile":
        return handleProfileProceed;
      case "Files":
        return handleFilesProceed;
      case "Verification":
        return handleVerificationProceed;
      case "Review":
        return handleReviewProceed;
      default:
        return undefined;
    }
  };

  const getStepProceedText = () => {
    switch (currentTab) {
      case "Profile":
        return "Continue to Files";
      case "Files":
        return "Continue to Verification";
      case "Verification":
        return "Continue to Review";
      case "Review":
        return "Submit Application";
      default:
        return "Proceed";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 mb-20">
        {" "}
        {/* Add bottom margin for sticky navigation */}
        <div className="flex justify-center items-center mb-12">
          {currentTab === "Profile" && <ApplicationProfileForm />}
          {currentTab === "Files" && <UploadFileForm />}
          {currentTab === "Verification" && <VerificationStep />}
          {currentTab === "Review" && <ReviewStep />}
        </div>
      </div>

      {/* Sticky Navigation */}
      <StepNavigation
        onProceed={getStepProceedHandler()}
        proceedText={getStepProceedText()}
        showCancel={true}
        showProceed={true} // Show proceed on all steps
      />
    </div>
  );
}
