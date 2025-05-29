import React from "react";
import { Control } from "react-hook-form";
import { Briefcase } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";

interface ProfessionalInfoSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
}

export const ProfessionalInfoSection = ({
  control,
  loading,
}: ProfessionalInfoSectionProps) => {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-brand" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Professional Information
          </h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Job Title */}
        <FormField
          control={control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Job Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  {...field}
                  placeholder="Enter your Job Title"
                  className="border-gray-300 focus:border-brand focus:ring-brand"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Why Fit */}
        <FormField
          control={control}
          name="whyFit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Tell us about your experiences and what makes you best fit for
                this position
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  {...field}
                  placeholder="Describe your relevant experiences and qualifications..."
                  className="border-gray-300 focus:border-brand focus:ring-brand resize-none h-32"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Strengths */}
        <FormField
          control={control}
          name="whatStrengths"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                What are your strengths? Where do you excel or perform well?
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  {...field}
                  placeholder="Describe your key strengths and areas of expertise..."
                  className="border-gray-300 focus:border-brand focus:ring-brand resize-none h-32"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Areas for Improvement */}
        <FormField
          control={control}
          name="whatNeedImprovement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                What areas do you think you will need improvement?
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  {...field}
                  placeholder="Identify areas where you'd like to grow and improve..."
                  className="border-gray-300 focus:border-brand focus:ring-brand resize-none h-32"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
