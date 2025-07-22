import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Video,
  ExternalLink,
  Plus,
  Trash2,
  Link,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Resolver } from "react-hook-form";

// Zod Schema
const AssessmentContentSchema = z.object({
  assessmentTests: z
    .array(z.object({ link: z.string().url("Please enter a valid URL") }))
    .default([{ link: "" }]),
  contentLinks: z
    .array(z.object({ link: z.string().url("Please enter a valid URL") }))
    .default([{ link: "" }]),
});

type AssessmentContentFormData = z.infer<typeof AssessmentContentSchema>;

interface AssessmentContentProps {
  loading?: boolean;
  initialData?: Partial<AssessmentContentFormData>;
}

interface InfoItemProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  description?: React.ReactNode;
  colorScheme?: "blue" | "amber";
}

const InfoItem = ({
  label,
  icon,
  children,
  description,
  colorScheme = "blue",
}: InfoItemProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      </div>
    </div>

    {/* Description Box */}
    {description && (
      <div
        className={`${colorScheme === "blue" ? "bg-brand/5 border-brand/20" : "bg-warning/5 border-warning/20"} border rounded-lg p-3 ml-11`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-5 h-5 rounded-full ${colorScheme === "blue" ? "bg-brand/10" : "bg-warning/10"} flex items-center justify-center flex-shrink-0 mt-0.5`}
          >
            <ExternalLink
              className={`w-2.5 h-2.5 ${colorScheme === "blue" ? "text-brand" : "text-warning"}`}
            />
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </div>
        </div>
      </div>
    )}

    <div className="pl-11">{children}</div>
  </div>
);

export const AssessmentContentSection = ({
  loading = false,
  initialData = {},
}: AssessmentContentProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<
    Partial<AssessmentContentFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(
    (): AssessmentContentFormData => ({
      assessmentTests: [{ link: "" }],
      contentLinks: [{ link: "" }],
      ...initialData,
    }),
    [initialData]
  );

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AssessmentContentFormData>({
    resolver: zodResolver(
      AssessmentContentSchema
    ) as Resolver<AssessmentContentFormData>,
    defaultValues,
  });

  const {
    fields: assessmentFields,
    append: appendAssessment,
    remove: removeAssessment,
  } = useFieldArray({
    control,
    name: "assessmentTests",
  });

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
  } = useFieldArray({
    control,
    name: "contentLinks",
  });

  // Watch all form values to detect changes
  const watchedValues = watch();

  useEffect(() => {
    setOriginalData(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    const hasFormChanges =
      JSON.stringify(watchedValues) !== JSON.stringify(originalData);
    setHasChanges(hasFormChanges);
  }, [watchedValues, originalData]);

  // Submit function using the API route
  const onSubmit = async (data: AssessmentContentFormData) => {
    setIsSubmitting(true);
    try {
      // Filter out empty links
      const cleanedData = {
        assessmentTests: data.assessmentTests.filter(
          (item) => item.link.trim() !== ""
        ),
        contentLinks: data.contentLinks.filter(
          (item) => item.link.trim() !== ""
        ),
      };

      const response = await fetch("/api/profile/edit-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (result.ok) {
        setOriginalData(data);
        setHasChanges(false);
        toast({
          title: "Assessment & Content Updated",
          description: `Successfully updated: ${result.updatedFields?.join(", ") || "assessment and content links"}`,
          variant: "success",
        });
      } else {
        throw new Error(
          result.message || "Failed to save assessment and content"
        );
      }
    } catch (error) {
      console.error("Error saving assessment and content:", error);
      toast({
        title: "Error Saving Content",
        description: "Failed to save assessment and content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset(originalData);
    setHasChanges(false);
  };

  const discDescription = (
    <div>
      <div className="font-medium text-foreground mb-1 text-xs">
        DISC Assessment Test
      </div>
      <div>
        Visit{" "}
        <a
          href="https://www.crystalknows.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:text-brand underline font-medium"
        >
          crystalknows.com
        </a>{" "}
        and take the free DISC assessment test. Save the PDF file to your Google
        Drive and paste the shareable link below.
      </div>
    </div>
  );

  const recordingDescription = (
    <div>
      <div className="font-medium text-foreground mb-1 text-xs">
        English Proficiency Recording <span className="text-red-500">*</span>
      </div>
      <div>
        Create a video or voice recording to demonstrate your English
        proficiency. Upload to your preferred platform (Google Drive, YouTube,
        etc.) and paste the shareable link below.
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Assessment & Content
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Skills assessments and English proficiency demonstrations
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Assessment Tests */}
            <InfoItem
              label="Assessment Tests"
              icon={<FileText className="w-4 h-4 text-muted-foreground" />}
              description={discDescription}
              colorScheme="blue"
            >
              <div className="space-y-4">
                {assessmentFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <Controller
                      name={`assessmentTests.${index}.link`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex-1">
                          <div className="relative">
                            <Link className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="url"
                              placeholder="https://drive.google.com/..."
                              disabled={loading || isSubmitting}
                              className={`pl-10 ${errors.assessmentTests?.[index]?.link ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.assessmentTests?.[index]?.link && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.assessmentTests[index]?.link?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    {assessmentFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAssessment(index)}
                        disabled={loading || isSubmitting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendAssessment({ link: "" })}
                  disabled={loading || isSubmitting}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Assessment Link
                </Button>
              </div>
            </InfoItem>

            {/* Content Links */}
            <InfoItem
              label="Content Links"
              icon={<Video className="w-4 h-4 text-muted-foreground" />}
              description={recordingDescription}
              colorScheme="amber"
            >
              <div className="space-y-4">
                {contentFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <Controller
                      name={`contentLinks.${index}.link`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex-1">
                          <div className="relative">
                            <Link className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="url"
                              placeholder="https://youtube.com/... or https://drive.google.com/..."
                              disabled={loading || isSubmitting}
                              className={`pl-10 ${errors.contentLinks?.[index]?.link ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.contentLinks?.[index]?.link && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.contentLinks[index]?.link?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    {contentFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContent(index)}
                        disabled={loading || isSubmitting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendContent({ link: "" })}
                  disabled={loading || isSubmitting}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Content Link
                </Button>
              </div>
            </InfoItem>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">📋 Assessment & Content Tips:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>• Complete DISC assessment for better job matching</p>
                <p>• Upload clear, professional English recordings</p>
                <p>• Use public sharing links (Google Drive, YouTube)</p>
                <p>• Test links before submitting to ensure access</p>
                <p>• Keep recordings under 5 minutes for best results</p>
                <p>• Assessment results help employers understand you</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {hasChanges && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-border mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading || isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export { AssessmentContentSchema };
export type { AssessmentContentFormData };
