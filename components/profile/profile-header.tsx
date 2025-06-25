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
import useSWR from "swr";

interface ProfileData {
  fileUploads: {
    id: string;
    filename: string;
    link: string;
    type: string;
  }[];
}

interface FileField {
  label: string;
  name: string;
  type: string;
  preset: string;
  allowedFileTypes: string[];
  description: string;
  required: boolean;
}

const fileFields: FileField[] = [
  {
    label: "Resume",
    name: "resume",
    type: "resume",
    preset: "ProfileResume",
    allowedFileTypes: ["pdf", "doc", "docx"],
    description: "Upload your latest resume or CV",
    required: true,
  },
  {
    label: "Professional Photo",
    name: "pfp",
    type: "professional_picture",
    preset: "ProfessionalPicture",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Upload a professional 1x1 headshot photo",
    required: true,
  },
  {
    label: "Internet Speed Test",
    name: "internetScreenshot",
    type: "internet",
    preset: "ProfileInternetScreenshot",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Screenshot of your internet speed test results",
    required: true,
  },
  {
    label: "Computer Specifications",
    name: "computerSpecsScreenshot",
    type: "computer_specs",
    preset: "ProfileComputerSpecs",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Screenshot showing your computer specifications",
    required: true,
  },
  {
    label: "Workstation Setup",
    name: "workstationPhoto",
    type: "work_station",
    preset: "ProfileWorkStation",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Photo of your complete workstation setup",
    required: true,
  },
];

const ProfileHeader = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;
  const { toast } = useToast();
  const { currentTab, setCurrentTab, setJobSubmissionId } =
    useProfileTabContext();

  const profileDetailsForm = useProfileDetails();
  const [loading, setLoading] = React.useState<boolean>(false);

  const { data: profile } = useSWR<ProfileData>("/profile", fetchApi);

  const getUploadedFiles = (type: string) => {
    return profile?.fileUploads?.filter((file) => file.type === type) || [];
  };

  const getRequiredUploaded = () => {
    const files = fileFields.reduce((count, field) => {
      if (field.required && getUploadedFiles(field.type).length > 0) {
        return count + 1;
      }
      return count;
    }, 0);
    console.log(files);
    return files;
  };

  const onFileSubmit = async () => {
    setLoading(true);
    try {
      if (getRequiredUploaded() != fileFields.length) {
        console.log("Failed");
        setLoading(false);
        return toast({
          title: "Application Failed",
          description: `Failed to submit job application.`,
          variant: "destructive",
        });
      }
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
    <div className="bg-card sticky top-0 z-40 border-b border-border">
      <div className="mx-auto px-3 sm:px-4 lg:px-6">
        <Card className="shadow-none border-0 py-0">
          <div className="p-3 sm:p-4 lg:p-6">
            {/* Mobile Layout - Stacked */}
            <div className="block sm:hidden">
              {/* Title Section */}
              <div className="mb-3">
                <h1 className="text-lg font-semibold text-foreground leading-tight">
                  {stepInfo.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {stepInfo.description}
                </p>
              </div>

              {/* Actions Section */}
              <div className="flex flex-col space-y-2">
                {currentTab === "Profile" && (
                  <Button
                    onClick={onDetailsSubmit}
                    disabled={loading}
                    className="bg-brand hover:bg-brand-dark text-white w-full justify-center"
                    size="sm"
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
                        className="bg-success hover:bg-success text-white w-full justify-center"
                        size="sm"
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

                    <AlertDialogContent className="max-w-[90vw] sm:max-w-md mx-4">
                      <AlertDialogHeader className="text-center">
                        <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-6 h-6 text-warning" />
                        </div>
                        <AlertDialogTitle className="text-lg">
                          Submit Application?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground leading-relaxed text-sm">
                          You&apos;re about to submit your complete profile and
                          documents to the employer. Make sure all information
                          is accurate and up-to-date.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                        <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">
                          Review Again
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            className="bg-success hover:bg-success text-white w-full sm:w-auto order-1 sm:order-2"
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

                <Button
                  variant="outline"
                  onClick={() => router.push(`/app/jobs/v/${jobId}`)}
                  className="border-border hover:bg-muted w-full justify-center"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden sm:flex items-center justify-between">
              {/* Left Section - Step Info */}
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
                    {stepInfo.title}
                  </h1>
                  <p className="text-sm lg:text-base text-muted-foreground mt-1">
                    {stepInfo.description}
                  </p>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/app/jobs/v/${jobId}`)}
                  className="border-border hover:bg-muted"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>

                {currentTab === "Profile" && (
                  <Button
                    onClick={onDetailsSubmit}
                    disabled={loading}
                    className="bg-brand hover:bg-brand-dark text-white"
                    size="sm"
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
                        className="bg-success hover:bg-success text-white"
                        size="sm"
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
                        <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-6 h-6 text-warning" />
                        </div>
                        <AlertDialogTitle className="text-lg">
                          Submit Application?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground leading-relaxed">
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
                            className="bg-success hover:bg-success text-white w-full sm:w-auto"
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
