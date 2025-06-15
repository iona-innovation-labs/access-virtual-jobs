/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useUserInfo } from "@/hooks/use-user-info";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { AppError } from "@/utils/app-error";
import { IProfileResponse } from "@/types/profiles";

// Components
import { OverviewSection } from "./general/overview";
import { WorkHistoryContainer } from "./general/work-history/work-history-container"; // Import the work history container
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Schema for overview editable fields
const overviewSchema = z.object({
  desiredSalary: z.number().optional(),
  salaryUnit: z.string().optional(),
  jobType: z.string().optional(),
  availability: z.string().optional(),
});

type OverviewSchema = z.infer<typeof overviewSchema>;

interface OverviewTabProps {
  isPublicView?: boolean;
}

export default function OverviewTab({
  isPublicView = false,
}: OverviewTabProps) {
  const { userInfo } = useUserInfo();
  const { toast } = useToast();

  const { data, error, mutate } = useSWR<IProfileResponse, AppError>(
    "/profile",
    fetchApi
  );

  // Form for editable overview fields
  const overviewForm = useForm<OverviewSchema>({
    resolver: zodResolver(overviewSchema),
    mode: "onTouched",
    reValidateMode: "onBlur",
    defaultValues: {
      desiredSalary: 0,
      salaryUnit: "",
      jobType: "",
      availability: "",
    },
  });

  console.log("Overview form values:", overviewForm.getValues());

  // Initialize form data
  React.useEffect(() => {
    if (data && data.ok) {
      overviewForm.reset({
        desiredSalary: parseInt(data?.profile?.desiredSalary, 10) || 0,
        salaryUnit: data?.profile?.salaryUnit || "",
        jobType: data?.profile?.jobType || "",
        availability: data?.profile?.availability || "",
      });
    }
  }, [data]);

  const onSubmit = async (formData: OverviewSchema) => {
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

      // Refresh data
      mutate();

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
    }
  };

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-lg font-semibold text-destructive mb-2">
          Error Loading Profile
        </h2>
        <p className="text-muted-foreground">
          Failed to load profile data. Please refresh the page.
        </p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="max-w-4xl mx-auto p-8">
        <LoadingSpinner />
      </Card>
    );
  }

  // Prepare user info for components
  const combinedUserInfo = {
    ...userInfo,
    ...data?.profile,
    createdAt: userInfo?.createdAt || data?.profile?.createdAt,
    desiredSalary: parseInt(data?.profile?.desiredSalary, 10) || 0,
    salaryUnit: data?.profile?.salaryUnit,
    jobType: data?.profile?.jobType,
    availability: data?.profile?.availability,
    education: data?.profile?.education, // Add this when you have education data
  };

  if (!data) return null;

  return (
    <div className="w-full mx-auto space-y-8">
      <Form {...overviewForm}>
        <form
          onSubmit={overviewForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <OverviewSection
            userInfo={combinedUserInfo}
            isEditable={!isPublicView}
          />
          <WorkHistoryContainer isEditable={!isPublicView} />
        </form>
      </Form>
    </div>
  );
}
