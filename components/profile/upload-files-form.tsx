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
  icon: React.ComponentType<{ className?: string }>;
  required: boolean;
}

const UploadFilesForm = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR<ProfileData>(
    "/profile",
    fetchApi
  );

  const fileFields: FileField[] = [
    {
      label: "Resume",
      name: "resume",
      type: "resume",
      preset: "ProfileResume",
      allowedFileTypes: ["pdf", "doc", "docx"],
      description: "Upload your latest resume or CV",
      icon: FileText,
      required: true,
    },
    {
      label: "Professional Photo",
      name: "pfp",
      type: "professional_picture",
      preset: "ProfessionalPicture",
      allowedFileTypes: ["png", "jpg", "jpeg"],
      description: "Upload a professional 1x1 headshot photo",
      icon: User,
      required: true,
    },
    {
      label: "Internet Speed Test",
      name: "internetScreenshot",
      type: "internet",
      preset: "ProfileInternetScreenshot",
      allowedFileTypes: ["png", "jpg", "jpeg"],
      description: "Screenshot of your internet speed test results",
      icon: Wifi,
      required: true,
    },
    {
      label: "Computer Specifications",
      name: "computerSpecsScreenshot",
      type: "computer_specs",
      preset: "ProfileComputerSpecs",
      allowedFileTypes: ["png", "jpg", "jpeg"],
      description: "Screenshot showing your computer specifications",
      icon: Monitor,
      required: true,
    },
    {
      label: "Workstation Setup",
      name: "workstationPhoto",
      type: "work_station",
      preset: "ProfileWorkStation",
      allowedFileTypes: ["png", "jpg", "jpeg"],
      description: "Photo of your complete workstation setup",
      icon: Camera,
      required: true,
    },
  ];

  const handleUploadSuccess = async (
    type: string,
    result: CloudinaryUploadWidgetResults
  ) => {
    const info = result.info as CloudinaryUploadWidgetResults["info"];
    if (info && typeof info !== "string") {
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
          throw new Error("Upload failed");
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

  // const getTotalUploaded = () => {
  //   return fileFields.reduce((count, field) => {
  //     return count + (getUploadedFiles(field.type).length > 0 ? 1 : 0);
  //   }, 0);
  // };

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

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <LoadingSpinner size="lg" />
          <p className="text-center text-gray-500 mt-4">
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
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Files
          </h3>
          <p className="text-gray-600">
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
      <Card className="shadow-sm border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  allRequiredUploaded ? "bg-green-100" : "bg-brand/10"
                }`}
              >
                {allRequiredUploaded ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Upload className="w-5 h-5 text-brand" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Progress</h3>
                <p className="text-sm text-gray-500">
                  {requiredUploaded} of {totalRequired} required files uploaded
                </p>
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                allRequiredUploaded ? "text-green-600" : "text-brand"
              }`}
            >
              {Math.round((requiredUploaded / totalRequired) * 100)}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                allRequiredUploaded ? "bg-green-500" : "bg-brand"
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

          return (
            <Card key={field.name} className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        hasFiles ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasFiles ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Icon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {field.description}
                      </p>
                    </div>
                  </div>

                  {/* Upload Button */}
                  <CldUploadWidget
                    options={{
                      sources: ["local", "google_drive", "dropbox"],
                      resourceType: "auto",
                      clientAllowedFormats: field.allowedFileTypes,
                    }}
                    onSuccess={(result) =>
                      handleUploadSuccess(field.type, result)
                    }
                    uploadPreset={field.preset}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        onClick={() => open()}
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
                            {hasFiles ? "Replace" : "Upload"}
                          </>
                        )}
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </CardHeader>

              {/* File List */}
              {hasFiles && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.filename}
                            </p>
                            <p className="text-xs text-gray-500">
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
                            <a
                              href={file.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </a>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteFile(file.id, field.type)
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                <div className="text-xs text-gray-500">
                  <p>
                    Accepted formats:{" "}
                    {field.allowedFileTypes.join(", ").toUpperCase()}
                  </p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Message */}
      {allRequiredUploaded && (
        <Card className="shadow-sm border-0 bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              All Required Files Uploaded!
            </h3>
            <p className="text-green-700">
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
