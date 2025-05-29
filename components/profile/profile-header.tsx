"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, X, CheckCircle2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProfileDetails } from "@/context/profile-details-context";
import { useProfileTabContext } from "@/context/profile-tab-context";
import { fetchApi } from "@/services/fetch-api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const ProfileHeader = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;
  const { toast } = useToast();
  const { currentTab, setCurrentTab, setJobSubmissionId } =
    useProfileTabContext();

  const profileDetailsForm = useProfileDetails();
  const [loading, setLoading] = React.useState<boolean>(false);

  const onFileSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Infer the return type of the fetchApi here
      const response = await fetchApi<any>("/submissions", {
        method: "POST",
        body: JSON.stringify({ jobId }),
      });
      console.log("Response from file submit:", response);
      if (!response.ok) {
        toast({
          title: "Application Failed",
          description: `Failed to submit job application. ${
            response.message || "Please try again."
          }`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Application Submitted!",
        description:
          "Your job application has been submitted successfully. Redirecting...",
        variant: "success",
      });
      setLoading(false);
      setTimeout(() => {
        setCurrentTab("Finish");
        setJobSubmissionId(response.applicationId);
      }, 2000);
    } catch (error) {
      console.error("Error submitting job application:", error);
      toast({
        title: "Submission Error",
        description: "Failed to submit job application. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const onDetailsSubmit = async () => {
    const result = await profileDetailsForm.trigger(); // Manually validate the form

    if (!result) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }

    profileDetailsForm.handleSubmit(async (data) => {
      setLoading(true);
      try {
        //  TODO: Infer the return type of the fetchApi here
        const response = await fetchApi<any>("/profile/update-profile", {
          method: "POST",
          body: JSON.stringify(data),
        });

        console.log("RESPONSE: ", response);

        if (!response.ok) {
          toast({
            title: "Update Failed",
            description: "Failed to update profile. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!",
          variant: "success",
        });

        setLoading(false);
        setCurrentTab("Files");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Update Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    })();
  };

  const getStepInfo = () => {
    switch (currentTab) {
      case "Profile":
        return {
          title: "Complete Your Profile",
          description: "Fill in your personal and professional information",
          action: "Continue to Files",
          handler: onDetailsSubmit,
        };
      case "Files":
        return {
          title: "Upload Documents",
          description: "Add required documents and attachments",
          action: "Submit Application",
          handler: onFileSubmit,
        };
      default:
        return null;
    }
  };

  if (currentTab === "Finish") return null;

  const stepInfo = getStepInfo();
  if (!stepInfo) return null;

  return (
    <div className="bg-white sticky top-0 z-40">
      <div className="mx-auto px-6">
        <Card className="shadow-sm border-0 py-0">
          <div className="p-2">
            <div className="flex items-center justify-between">
              {/* Left Section - Step Info */}
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {stepInfo.title}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {stepInfo.description}
                  </p>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/app/jobs/v/${jobId}`)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>

                {currentTab === "Profile" && (
                  <Button
                    onClick={onDetailsSubmit}
                    disabled={loading}
                    className="bg-brand hover:bg-brand-dark text-white"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {stepInfo.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                {currentTab === "Files" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {loading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {stepInfo.action}
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="max-w-md">
                      <AlertDialogHeader className="text-center">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-6 h-6 text-amber-600" />
                        </div>
                        <AlertDialogTitle className="text-lg">
                          Submit Application?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 leading-relaxed">
                          You&apos;re about to submit your complete profile and
                          documents to the employer. Make sure all information
                          is accurate and up-to-date.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                        <AlertDialogCancel className="mt-0 sm:mt-0 w-full sm:w-auto">
                          Review Again
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                            disabled={loading}
                            onClick={onFileSubmit}
                          >
                            {loading ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Submit Application
                              </>
                            )}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileHeader;
