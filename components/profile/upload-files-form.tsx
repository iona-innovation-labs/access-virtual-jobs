"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import useSWR from "swr";
import { fetchApi } from "@/services/fetch-api";
import {
  X,
  Upload,
  FileText,
  User,
  Wifi,
  Monitor,
  Camera,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { FileField } from "@/types/files";
import { REQUIRED_FILE_TYPES } from "@/config/file-upload";

interface ProfileData {
  fileUploads: {
    id: string;
    filename: string;
    link: string;
    type: string;
  }[];
}

const FILE_FIELD_CONFIGS = {
  resume: {
    name: "resume",
    preset: "ProfileResume",
    allowedFileTypes: ["pdf", "doc", "docx"],
    description: "Upload your latest resume or CV",
    icon: FileText,
  },
  professional_picture: {
    name: "pfp",
    preset: "ProfessionalPicture",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Upload a professional 1x1 headshot photo",
    icon: User,
  },
  internet: {
    name: "internetScreenshot",
    preset: "ProfileInternetScreenshot",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Screenshot of your internet speed test results",
    icon: Wifi,
  },
  computer_specs: {
    name: "computerSpecsScreenshot",
    preset: "ProfileComputerSpecs",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Screenshot showing your computer specifications",
    icon: Monitor,
  },
  work_station: {
    name: "workstationPhoto",
    preset: "ProfileWorkStation",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Photo of your complete workstation setup",
    icon: Camera,
  },
};

const MAX_FILES_PER_FIELD = 5;

const UploadFilesForm = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR<ProfileData>(
    "/profile",
    fetchApi
  );

  const fileFields: FileField[] = REQUIRED_FILE_TYPES.map((configFile) => {
    const componentConfig =
      FILE_FIELD_CONFIGS[configFile.type as keyof typeof FILE_FIELD_CONFIGS];

    return {
      label: configFile.label,
      name: componentConfig.name,
      type: configFile.type,
      preset: componentConfig.preset,
      allowedFileTypes: componentConfig.allowedFileTypes,
      description: componentConfig.description,
      icon: componentConfig.icon,
      required: configFile.required,
    };
  });

  const handleUploadSuccess = async (
    type: string,
    result: CloudinaryUploadWidgetResults
  ) => {
    const info = result.info as CloudinaryUploadWidgetResults["info"];
    if (info && typeof info !== "string") {
      // Check frontend validation first
      const currentFiles = getUploadedFiles(type);
      if (currentFiles.length >= MAX_FILES_PER_FIELD) {
        toast({
          title: "Upload Limit Reached",
          description: `Maximum ${MAX_FILES_PER_FIELD} files allowed for this field.`,
          variant: "destructive",
        });
        return;
      }

      const { public_id, secure_url, original_filename } = info;
      setUploading(type);

      try {
        const response = await fetchApi<any>("/profile/upload-file", {
          method: "POST",
          body: JSON.stringify({
            type,
            publicId: public_id,
            fileUrl: secure_url,
            filename: original_filename || "Unknown",
          }),
        });

        if (!response.ok) {
          // Handle specific backend validation errors
          if (response.error === "File limit exceeded") {
            toast({
              title: "Upload Limit Exceeded",
              description:
                response.message ||
                `Maximum ${MAX_FILES_PER_FIELD} files allowed.`,
              variant: "destructive",
            });
            return;
          }
          throw new Error(response.message || "Upload failed");
        }

        const fileLabel =
          fileFields.find((f) => f.type === type)?.label || type;
        toast({
          title: "Upload Successful",
          description: `${fileLabel} has been uploaded successfully!`,
          variant: "success",
        });

        mutate();
      } catch (error) {
        console.error("Error uploading file:", error);
        const fileLabel =
          fileFields.find((f) => f.type === type)?.label || type;
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${fileLabel}. Please try again.`,
          variant: "destructive",
        });
      } finally {
        setUploading(null);
      }
    }
  };

  const handleDeleteFile = async (fileId: string, type: string) => {
    try {
      const response = await fetchApi<any>("/profile/upload-file", {
        method: "DELETE",
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) throw new Error("Failed to delete file");

      const fileLabel =
        fileFields.find((f) => f.type === type)?.label || "File";
      toast({
        title: "File Deleted",
        description: `${fileLabel} has been removed successfully.`,
        variant: "success",
      });

      mutate();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUploadedFiles = (type: string) => {
    return data?.fileUploads?.filter((file) => file.type === type) || [];
  };

  const getRequiredUploaded = () => {
    const files = fileFields.reduce((count, field) => {
      if (field.required && getUploadedFiles(field.type).length > 0) {
        return count + 1;
      }
      return count;
    }, 0);
    return files;
  };

  const isMaxFilesReached = (type: string) => {
    return getUploadedFiles(type).length >= MAX_FILES_PER_FIELD;
  };

  // Function to handle Cloudinary widget opening with validation
  const handleWidgetOpen = (type: string, openWidget: () => void) => {
    const currentFiles = getUploadedFiles(type);
    if (currentFiles.length >= MAX_FILES_PER_FIELD) {
      toast({
        title: "Upload Limit Reached",
        description: `Maximum ${MAX_FILES_PER_FIELD} files allowed for this field. Please delete some files first.`,
        variant: "destructive",
      });
      return;
    }
    openWidget();
  };

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <LoadingSpinner size="lg" />
          <p className="text-center text-muted-foreground mt-4">
            Loading file attachments...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Files
          </h3>
          <p className="text-muted-foreground">
            Failed to load file attachments. Please refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalRequired = fileFields.filter((f) => f.required).length;
  const requiredUploaded = getRequiredUploaded();
  const allRequiredUploaded = requiredUploaded === totalRequired;

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Progress Card */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  allRequiredUploaded ? "bg-success/10" : "bg-brand/10"
                }`}
              >
                {allRequiredUploaded ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Upload className="w-5 h-5 text-brand" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Upload Progress
                </h3>
                <p className="text-sm text-muted-foreground">
                  {requiredUploaded} of {totalRequired} required files uploaded
                </p>
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                allRequiredUploaded ? "text-success" : "text-brand"
              }`}
            >
              {Math.round((requiredUploaded / totalRequired) * 100)}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                allRequiredUploaded ? "bg-success" : "bg-brand"
              }`}
              style={{ width: `${(requiredUploaded / totalRequired) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload Sections */}
      <div className="space-y-6">
        {fileFields.map((field) => {
          const Icon = field.icon;
          const uploadedFiles = getUploadedFiles(field.type);
          const hasFiles = uploadedFiles.length > 0;
          const isCurrentlyUploading = uploading === field.type;
          const maxReached = isMaxFilesReached(field.type);

          return (
            <Card key={field.name} className="shadow-sm border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        hasFiles ? "bg-success/10" : "bg-muted"
                      }`}
                    >
                      {hasFiles ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center">
                        {field.label}
                        {field.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {field.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {uploadedFiles.length} of {MAX_FILES_PER_FIELD} files
                        uploaded
                      </p>
                    </div>
                  </div>

                  {/* Upload Button - Only show if not at max limit */}
                  {!maxReached && (
                    <CldUploadWidget
                      options={{
                        sources: ["local", "google_drive", "dropbox"],
                        resourceType: "auto",
                        clientAllowedFormats: field.allowedFileTypes,
                        multiple: false, // Prevent multiple file selection
                      }}
                      onSuccess={(result) =>
                        handleUploadSuccess(field.type, result)
                      }
                      uploadPreset={field.preset}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          onClick={() => handleWidgetOpen(field.type, open)}
                          disabled={isCurrentlyUploading}
                          className="bg-brand hover:bg-brand-dark text-white"
                          size="sm"
                        >
                          {isCurrentlyUploading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {hasFiles ? "Add More" : "Upload"}
                            </>
                          )}
                        </Button>
                      )}
                    </CldUploadWidget>
                  )}

                  {/* Max files reached message */}
                  {maxReached && (
                    <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                      Maximum files reached ({MAX_FILES_PER_FIELD})
                    </div>
                  )}
                </div>
              </CardHeader>

              {/* File List */}
              {hasFiles && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.filename}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded successfully
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-brand hover:text-brand-dark"
                          >
                            <Link
                              href={file.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteFile(file.id, field.type)
                            }
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}

              {/* File Requirements */}
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  <p>
                    Accepted formats:{" "}
                    {field.allowedFileTypes.join(", ").toUpperCase()}
                  </p>
                  <p>Maximum file size: 10MB</p>
                  <p>Maximum files per field: {MAX_FILES_PER_FIELD}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Message */}
      {allRequiredUploaded && (
        <Card className="shadow-sm bg-success/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              All Required Files Uploaded!
            </h3>
            <p className="text-muted-foreground">
              You&apos;ve successfully uploaded all required documents. Your
              profile is now complete.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadFilesForm;
