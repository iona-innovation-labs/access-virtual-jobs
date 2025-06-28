"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { fetchApi } from "@/services/fetch-api";
import {
  FileText,
  User,
  Wifi,
  Monitor,
  Camera,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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
    description: "Latest resume or CV",
    icon: FileText,
  },
  professional_picture: {
    name: "pfp",
    preset: "ProfessionalPicture",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Professional 1x1 headshot photo",
    icon: User,
  },
  internet: {
    name: "internetScreenshot",
    preset: "ProfileInternetScreenshot",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Internet speed test results",
    icon: Wifi,
  },
  computer_specs: {
    name: "computerSpecsScreenshot",
    preset: "ProfileComputerSpecs",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Computer specifications",
    icon: Monitor,
  },
  work_station: {
    name: "workstationPhoto",
    preset: "ProfileWorkStation",
    allowedFileTypes: ["png", "jpg", "jpeg"],
    description: "Complete workstation setup",
    icon: Camera,
  },
};

const MAX_FILES_PER_FIELD = 5;

const ViewFilesForm = () => {
  const { data, error, isLoading } = useSWR<ProfileData>("/profile", fetchApi);

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
                  <FileText className="w-5 h-5 text-brand" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">File Overview</h3>
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
              {totalRequired > 0
                ? Math.round((requiredUploaded / totalRequired) * 100)
                : 0}
              %
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                allRequiredUploaded ? "bg-success" : "bg-brand"
              }`}
              style={{
                width:
                  totalRequired > 0
                    ? `${(requiredUploaded / totalRequired) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Display Sections */}
      <div className="space-y-6">
        {fileFields.map((field) => {
          const Icon = field.icon;
          const uploadedFiles = getUploadedFiles(field.type);
          const hasFiles = uploadedFiles.length > 0;

          return (
            <Card key={field.name} className="shadow-sm border-border">
              <CardHeader className="pb-4">
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
                      {hasFiles ? " uploaded" : " required"}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* File List */}
              {hasFiles ? (
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
                              File uploaded
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
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-0">
                  <div className="text-center py-6 text-muted-foreground">
                    <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No files uploaded yet</p>
                  </div>
                </CardContent>
              )}

              {/* File Requirements Info */}
              <CardContent className="pt-0 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  <p>
                    Accepted formats:{" "}
                    {field.allowedFileTypes.join(", ").toUpperCase()}
                  </p>
                  <p>Maximum files per field: {MAX_FILES_PER_FIELD}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Status */}
      {allRequiredUploaded ? (
        <Card className="shadow-sm border-border bg-success/5 border-success/20">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              All Required Files Present
            </h3>
            <p className="text-muted-foreground">
              All required documents have been uploaded and are available for
              viewing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm border-border bg-muted/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Incomplete File Set
            </h3>
            <p className="text-muted-foreground">
              Some required documents are missing.{" "}
              {totalRequired - requiredUploaded} more required file
              {totalRequired - requiredUploaded !== 1 ? "s" : ""} needed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViewFilesForm;
