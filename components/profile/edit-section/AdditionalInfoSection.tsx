import React from "react";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import { FileText, Users, MessageSquare, X, Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";
import { IProfileResponse } from "@/types/profiles";

interface AdditionalInfoSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  data: IProfileResponse;
  workSampleFields: UseFieldArrayReturn<EditProfileSchema, "workSamples">;
}

export const AdditionalInfoSection = ({
  control,
  loading,
  data,
  workSampleFields,
}: AdditionalInfoSectionProps) => {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-brand" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Additional Information
          </h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Work Samples */}
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <FormLabel className="text-sm font-medium text-gray-800 block mb-2">
                  Work Samples (Optional)
                </FormLabel>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Share links to your best work samples, portfolio, or projects
                  that demonstrate your skills and experience.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {workSampleFields.fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <FormField
                  control={control}
                  name={`workSamples.${index}.link`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                            type="url"
                            placeholder="Paste your work sample link here"
                            className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {workSampleFields.fields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={loading}
                    onClick={() => workSampleFields.remove(index)}
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
              onClick={() => workSampleFields.append({ link: "" })}
              className="border-brand/20 text-brand hover:bg-brand/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Work Sample
            </Button>
          </div>
        </div>

        {/* How did you hear about us */}
        <FormField
          control={control}
          name="howHear"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                How did you hear about us?
              </FormLabel>
              <FormControl>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={
                    field.value?.toString() || data?.profile?.howHear || ""
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-brand">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Source</SelectLabel>
                      <SelectItem value="online jobs ph">
                        OnlineJobsPH
                      </SelectItem>
                      <SelectItem value="craigslist">Craigslist</SelectItem>
                      <SelectItem value="indeed">Indeed</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="jora">Jora</SelectItem>
                      <SelectItem value="fb group">Facebook Group</SelectItem>
                      <SelectItem value="company referral">
                        Company Referral
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Referrer */}
        <FormField
          control={control}
          name="referrer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Employee Referral
              </FormLabel>
              <p className="text-xs text-gray-500 mb-2">
                Do you know someone working at Access Insurance? Please state
                their name if you do.
              </p>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <FormControl>
                  <Input
                    disabled={loading}
                    {...field}
                    placeholder="Enter employee name (if applicable)"
                    className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
