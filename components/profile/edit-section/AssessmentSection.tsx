import React from "react";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import { FileText, Video, ExternalLink, X, Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";

interface AssessmentSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  assessmentFields: UseFieldArrayReturn<EditProfileSchema, "assessmentTests">;
  contentFields: UseFieldArrayReturn<EditProfileSchema, "contentLinks">;
}

export const AssessmentSection = ({
  control,
  loading,
  assessmentFields,
  contentFields,
}: AssessmentSectionProps) => {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-brand" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Assessment & Content
          </h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Assessment Tests */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ExternalLink className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <FormLabel className="text-sm font-medium text-gray-800 block mb-2">
                  DISC Assessment Test
                </FormLabel>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Visit{" "}
                  <a
                    href="https://www.crystalknows.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    crystalknows.com
                  </a>{" "}
                  and take the free DISC assessment test. Save the PDF file to
                  your Google Drive and paste the shareable link below.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {assessmentFields.fields.map((test, index) => (
              <div key={test.id} className="flex gap-3 items-start">
                <FormField
                  control={control}
                  name={`assessmentTests.${index}.link`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                            type="url"
                            placeholder="Paste your assessment test link here"
                            className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {assessmentFields.fields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={loading}
                    onClick={() => assessmentFields.remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => assessmentFields.append({ link: "" })}
              className="border-brand/20 text-brand hover:bg-brand/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Assessment Link
            </Button>
          </div>
        </div>

        {/* Content Links */}
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Video className="w-3 h-3 text-amber-600" />
              </div>
              <div>
                <FormLabel className="text-sm font-medium text-gray-800 block mb-2">
                  English Proficiency Recording{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Create a video or voice recording to demonstrate your English
                  proficiency. Upload to your preferred platform (Google Drive,
                  YouTube, etc.) and paste the shareable link below.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {contentFields.fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <FormField
                  control={control}
                  name={`contentLinks.${index}.link`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="relative">
                        <Video className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                            type="url"
                            placeholder="Paste your recording link here"
                            className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {contentFields.fields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={loading}
                    onClick={() => contentFields.remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => contentFields.append({ link: "" })}
              className="border-brand/20 text-brand hover:bg-brand/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Recording Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
