import React, { useState } from "react";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import {
  FileText,
  Video,
  ExternalLink,
  X,
  Plus,
  Edit3,
  Link,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";

interface AssessmentSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  assessmentFields: UseFieldArrayReturn<EditProfileSchema, "assessmentTests">;
  contentFields: UseFieldArrayReturn<EditProfileSchema, "contentLinks">;
  data: {
    assessmentTests?: Array<{ link?: string }>;
    contentLinks?: Array<{ link?: string }>;
  };
  onUpdate: () => void;
}

interface ArrayInfoItemProps {
  label: string;
  items: Array<{ link?: string }>;
  loading: boolean;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
  fieldArray: UseFieldArrayReturn<EditProfileSchema, any>;
  fieldName: "assessmentTests" | "contentLinks";
  placeholder: string;
  description: React.ReactNode;
  colorScheme: "blue" | "amber";
}

const ArrayInfoItem = ({
  label,
  items,
  loading,
  control,
  onSubmit,
  icon,
  fieldArray,
  fieldName,
  placeholder,
  description,
  colorScheme,
}: ArrayInfoItemProps) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="group py-6 border-b border-border last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {label}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-brand/5"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                setEditMode(!editMode);
              }}
              type="button"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Description Box */}
          <div
            className={`${colorScheme === "blue" ? "bg-brand/5 border-brand/20" : "bg-warning/5 border-warning/20"} border rounded-lg p-3 mt-3 mb-4`}
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

          <div className="text-foreground leading-relaxed">
            {!editMode ? (
              items.length > 0 && items.some((item) => item.link) ? (
                <div className="space-y-2">
                  {items
                    .filter((item) => item.link)
                    .map((item, index) => (
                      <div key={index} className="text-sm">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${colorScheme === "blue" ? "text-brand" : "text-warning"} hover:underline font-medium break-all`}
                        >
                          {item.link}
                        </a>
                      </div>
                    ))}
                </div>
              ) : (
                <span className="text-muted-foreground italic text-sm">
                  Click edit to add {label.toLowerCase()}
                </span>
              )
            ) : (
              <div className="space-y-3 mt-3">
                {fieldArray.fields.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <FormField
                      control={control}
                      name={`${fieldName}.${index}.link` as any}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <div className="relative">
                            <Link className="absolute left-3 top-2.5 w-3 h-3 text-muted-foreground" />
                            <FormControl>
                              <Input
                                disabled={loading}
                                {...field}
                                type="url"
                                placeholder={placeholder}
                                className="pl-9 h-8 text-xs"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />
                    {fieldArray.fields.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        disabled={loading}
                        onClick={() => fieldArray.remove(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      fieldArray.append({ link: "" });
                    }}
                    className="h-8 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      setEditMode(false);
                      onSubmit();
                    }}
                    className="h-8 text-xs"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AssessmentSection = ({
  control,
  loading,
  assessmentFields,
  contentFields,
  data,
  onUpdate,
}: AssessmentSectionProps) => {
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
      <div className="font-medium text-zinc-800 mb-1 text-xs">
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
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Assessment & Content
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Skills assessments and English proficiency demonstrations
            </p>
          </div>
        </div>

        <div>
          <ArrayInfoItem
            label="Assessment Tests"
            items={data.assessmentTests || []}
            loading={loading}
            control={control}
            onSubmit={onUpdate}
            icon={<FileText className="w-4 h-4 text-muted-foreground" />}
            fieldArray={assessmentFields}
            fieldName="assessmentTests"
            placeholder="Paste your assessment test link here"
            description={discDescription}
            colorScheme="blue"
          />

          <ArrayInfoItem
            label="Content Links"
            items={data.contentLinks || []}
            loading={loading}
            control={control}
            onSubmit={onUpdate}
            icon={<Video className="w-4 h-4 text-muted-foreground" />}
            fieldArray={contentFields}
            fieldName="contentLinks"
            placeholder="Paste your recording link here"
            description={recordingDescription}
            colorScheme="amber"
          />
        </div>
      </CardContent>
    </Card>
  );
};
