"use client";

import { useProfileTabContext } from "@/context/profile-tab-context";
import UploadFileForm from "@/components/profile/upload-files-form";
import ApplicationProfileForm from "@/components/profile/edit-tab/application-profile-form";
import { StepNavigation } from "@/components/profile/step-navigation";
import { useParams } from "next/navigation";

// Verification/Submission Step Component
const VerificationStep = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px] mb-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
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
        <h2 className="text-xl font-semibold mb-4">
          Ready to Submit Application
        </h2>
        <p className="text-muted-foreground mb-6">
          You&apos;ve completed all required steps. Click &quot;Submit
          Application&quot; below to send your application to the employer.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">✅ What you&apos;ve completed:</p>
          <ul className="text-left space-y-1">
            <li>• Profile information</li>
            <li>• Document uploads</li>
            <li>• All required fields</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePageClient() {
  const { currentTab } = useProfileTabContext();

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
  const params = useParams();
  const handleVerificationProceed = async (): Promise<boolean> => {
    // For verification step, submit the job application directly
    try {
      const temp = params.id as string;
      const jobId = temp.split("-")[0];

      if (!jobId) {
        console.error("Job ID not found in URL params");
        return false;
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });

      const result = await response.json();

      if (result.ok) {
        // Success - redirect to job listing
        window.location.href = `/app/jobs/v/${jobId}`;
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

  const getStepProceedHandler = () => {
    switch (currentTab) {
      case "Profile":
        return handleProfileProceed;
      case "Files":
        return handleFilesProceed;
      case "Verification":
        return handleVerificationProceed;
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
          {/*currentTab === "Review" && <FinishSubmission />*/}
        </div>
      </div>

      {/* Sticky Navigation */}
      <StepNavigation
        onProceed={getStepProceedHandler()}
        proceedText={getStepProceedText()}
        showCancel={true}
        showProceed={
          currentTab === "Profile" ||
          currentTab === "Files" ||
          currentTab === "Verification"
        } // Hide proceed on Review since we submit from Verification
      />
    </div>
  );
}
