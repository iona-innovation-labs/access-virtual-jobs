/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import useSWR from "swr";
import { useFieldArray } from "react-hook-form";

import { useUserInfo } from "@/hooks/use-user-info";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProfileDetails } from "@/context/profile-details-context";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { AppError } from "@/utils/app-error";
import { IProfileResponse } from "@/types/profiles";

// Form Section Components
import { PersonalInfoSection } from "./edit-section/PersonalInfoSection";
import { ProfessionalInfoSection } from "./edit-section/ProfessionalInfoSection";
import { ContactInfoSection } from "./edit-section/ContactInfoSection";
import { AssessmentSection } from "./edit-section/AssessmentSection";
import { TechnicalInfoSection } from "./edit-section/TechnicalInfoSection";
import { AdditionalInfoSection } from "./edit-section/AdditionalInfoSection";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function EditProfileForm() {
  const profileDetailsForm = useProfileDetails();
  const { userInfo, isLoading } = useUserInfo();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { data, error } = useSWR<IProfileResponse, AppError>(
    "/profile",
    fetchApi
  );

  // Field Arrays
  const phoneFields = useFieldArray({
    control: profileDetailsForm.control,
    name: "phone",
  });

  const emailFields = useFieldArray({
    control: profileDetailsForm.control,
    name: "emailAddress",
  });

  const workSampleFields = useFieldArray<EditProfileSchema, "workSamples">({
    control: profileDetailsForm.control,
    name: "workSamples",
  });

  const assessmentFields = useFieldArray<EditProfileSchema, "assessmentTests">({
    control: profileDetailsForm.control,
    name: "assessmentTests",
  });

  const contentFields = useFieldArray<EditProfileSchema, "contentLinks">({
    control: profileDetailsForm.control,
    name: "contentLinks",
  });

  // Initialize form data
  React.useEffect(() => {
    if (data && data.ok) {
      profileDetailsForm.reset({
        ...data?.profile,
        phone: data?.phones,
        emailAddress: data?.emails,
        contentLinks: data?.contentLinks,
        assessmentTests: data?.assessmentTests,
        workSamples: data?.workSamples,
        desiredSalary: parseInt(data?.profile?.desiredSalary, 10),
        dateOfBirth: data?.profile?.dateOfBirth
          ? new Date(data?.profile?.dateOfBirth)
          : undefined,
      });
    }
  }, [data]);

  const onSubmit = async (formData: EditProfileSchema) => {
    setLoading(true);
    try {
      const response = await fetchApi<any>("/profile/update-profile", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Error Loading Profile
        </h2>
        <p className="text-gray-600">
          Failed to load profile data. Please refresh the page.
        </p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="max-w-3xl mx-auto p-8">
        <LoadingSpinner />
      </Card>
    );
  }

  const fieldArrayProps = {
    phoneFields,
    emailFields,
    workSampleFields,
    assessmentFields,
    contentFields,
  };

  return (
    <div className="w-full mx-auto space-y-8">
      <Form {...profileDetailsForm}>
        <form
          onSubmit={profileDetailsForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Personal Information */}
          <PersonalInfoSection
            userInfo={userInfo}
            isUserLoading={isLoading}
            loading={loading}
          />

          {/* Professional Information */}
          <ProfessionalInfoSection
            control={profileDetailsForm.control}
            loading={loading}
          />

          {/* Contact Information */}
          <ContactInfoSection
            control={profileDetailsForm.control}
            loading={loading}
            {...fieldArrayProps}
          />

          {/* Assessment & Content */}
          <AssessmentSection
            control={profileDetailsForm.control}
            loading={loading}
            assessmentFields={assessmentFields}
            contentFields={contentFields}
          />

          {/* Technical Information */}
          <TechnicalInfoSection
            control={profileDetailsForm.control}
            loading={loading}
            data={data}
          />

          {/* Additional Information */}
          <AdditionalInfoSection
            control={profileDetailsForm.control}
            loading={loading}
            data={data}
            workSampleFields={workSampleFields}
          />

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              disabled={loading}
              type="submit"
              className="bg-brand hover:bg-brand-dark text-white px-8 py-3 text-lg font-semibold min-w-[200px]"
              size="lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
