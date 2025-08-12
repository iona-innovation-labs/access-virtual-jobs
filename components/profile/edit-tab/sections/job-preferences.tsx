import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Briefcase, DollarSign, Clock, Eye, EyeOff, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Zod Schema - Updated with jobCategory field
const JobPreferencesSchema = z.object({
  jobSearchStatus: z.enum([
    "ready_for_interview",
    "open_to_offers",
    "closed_to_offers",
  ]),
  desiredSalary: z.number().min(0, "Salary must be a positive number"),
  salaryUnit: z.enum(["PHP", "USD"]),
  isPublicSalary: z.boolean(),
  jobType: z.enum([
    "full_time",
    "part_time",
    "contract",
    "freelance",
    "internship",
  ]),
  jobCategory: z.enum([
    "office_administration",
    "marketing_sales",
    "graphics_multimedia",
    "web_design_development",
    "software_development",
    "customer_service",
    "professional_services",
    "writing",
  ]),
});

type JobPreferencesFormData = z.infer<typeof JobPreferencesSchema>;

interface JobPreferencesProps {
  loading?: boolean;
  initialData?: Partial<JobPreferencesFormData>;
}

interface InfoItemProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const InfoItem = ({ label, icon, children }: InfoItemProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
    </div>
    <div className="pl-11">{children}</div>
  </div>
);

const JobSearchStatusOptions = [
  {
    value: "ready_for_interview",
    label: "Ready for Interview",
    description:
      "Actively seeking opportunities and available to start immediately",
  },
  {
    value: "open_to_offers",
    label: "Open to Offers",
    description:
      "Currently employed but open to discussing exciting new opportunities",
  },
  {
    value: "closed_to_offers",
    label: "Closed to Offers",
    description: "Not currently looking for new opportunities",
  },
];

const JobTypeOptions = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const JobCategoryOptions = [
  { value: "office_administration", label: "Office & Administration" },
  { value: "marketing_sales", label: "Marketing & Sales" },
  { value: "graphics_multimedia", label: "Graphics & Multimedia" },
  { value: "web_design_development", label: "Web Design & Development" },
  {
    value: "software_development",
    label: "Software Development / Programming",
  },
  { value: "customer_service", label: "Customer Service & Admin Support" },
  { value: "professional_services", label: "Professional Services" },
  { value: "writing", label: "Writing" },
];

const SalaryUnitOptions = [
  { value: "PHP", label: "PHP" },
  { value: "USD", label: "USD" },
];

export const JobPreferencesSection = ({
  loading = false,
  initialData = {},
}: JobPreferencesProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<
    Partial<JobPreferencesFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(
    (): JobPreferencesFormData => ({
      jobSearchStatus: "closed_to_offers",
      desiredSalary: 0,
      salaryUnit: "PHP",
      isPublicSalary: true,
      jobType: "full_time",
      jobCategory: "software_development", // Default category
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
  } = useForm<JobPreferencesFormData>({
    resolver: zodResolver(JobPreferencesSchema),
    defaultValues,
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
  const onSubmit = async (data: JobPreferencesFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/profile/edit-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ok) {
        setOriginalData(data);
        setHasChanges(false);
        toast({
          title: "Job Preferences Updated",
          description: `Successfully updated: ${result.updatedFields?.join(", ") || "job preferences"}`,
          variant: "success",
        });
      } else {
        throw new Error(result.message || "Failed to save job preferences");
      }
    } catch (error) {
      console.error("Error saving job preferences:", error);
      toast({
        title: "Error Saving Preferences",
        description: "Failed to save job preferences. Please try again.",
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Job Preferences
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Share your job preferences and availability
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Availability */}
            <InfoItem
              label="Job Availability"
              icon={<Clock className="w-4 h-4 text-muted-foreground" />}
            >
              <Controller
                name="jobSearchStatus"
                control={control}
                render={({ field }) => {
                  const selectedOption = JobSearchStatusOptions.find(
                    (option) => option.value === field.value
                  );

                  return (
                    <div className="space-y-3">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading || isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your job availability" />
                        </SelectTrigger>
                        <SelectContent>
                          {JobSearchStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedOption && (
                        <div className="bg-muted/50 rounded-sm p-1 text-foreground/50 px-2">
                          <p className="text-xs text-muted-foreground">
                            {selectedOption.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </InfoItem>

            {/* Employment Type */}
            <InfoItem
              label="Employment Type"
              icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
            >
              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading || isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JobTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </InfoItem>

            {/* Preferred Job Category */}
            <InfoItem
              label="Preferred Job Category"
              icon={<Tag className="w-4 h-4 text-muted-foreground" />}
            >
              <Controller
                name="jobCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading || isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select preferred job category" />
                    </SelectTrigger>
                    <SelectContent>
                      {JobCategoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </InfoItem>

            {/* Desired Salary - Full width on mobile, spans both columns on large screens */}
            <div className="lg:col-span-1">
              <InfoItem
                label="Desired Salary"
                icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
              >
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Controller
                      name="salaryUnit"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loading || isSubmitting}
                        >
                          <SelectTrigger className="w-full sm:w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SalaryUnitOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="desiredSalary"
                      control={control}
                      render={({ field }) => (
                        <div className="flex-1">
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter desired salary"
                            disabled={loading || isSubmitting}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            className={
                              errors.desiredSalary ? "border-red-500" : ""
                            }
                          />
                          {errors.desiredSalary && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.desiredSalary.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  <Controller
                    name="isPublicSalary"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="publicSalary"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading || isSubmitting}
                        />
                        <label
                          htmlFor="publicSalary"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          {field.value ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                          Make salary visible to employers
                        </label>
                      </div>
                    )}
                  />
                </div>
              </InfoItem>
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

export { JobPreferencesSchema };
export type { JobPreferencesFormData };
