import React, { useState, useEffect, useMemo } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Info,
  Baby,
  Briefcase,
  Radio,
  Users,
  Plus,
  Trash2,
  Link,
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// Zod Schema
const AdditionalInformationSchema = z.object({
  numberOfChildren: z.string().min(1, "Please specify number of children"),
  workSamples: z.array(
    z.object({
      link: z
        .string()
        .url("Please enter a valid URL")
        .min(1, "Link is required"),
    })
  ),
  howHear: z.string().min(1, "Please select how you heard about us"),
  referrer: z.string().optional(),
});

type AdditionalInformationFormData = z.infer<
  typeof AdditionalInformationSchema
>;

interface AdditionalInformationProps {
  loading?: boolean;
  initialData?: Partial<AdditionalInformationFormData>;
}

interface InfoItemProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

const InfoItem = ({ label, icon, children, description }: InfoItemProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        {description && (
          <p className="text-xs text-muted-foreground/70">{description}</p>
        )}
      </div>
    </div>
    <div className="pl-11">{children}</div>
  </div>
);

const ChildrenOptions = [
  { value: "0", label: "No children" },
  { value: "1", label: "1 child" },
  { value: "2", label: "2 children" },
  { value: "3", label: "3 children" },
  { value: "4", label: "4 children" },
  { value: "5+", label: "5+ children" },
];

const HowHearOptions = [
  { value: "OnlineJobsPH", label: "OnlineJobs.ph" },
  { value: "Craigslist", label: "Craigslist" },
  { value: "Indeed", label: "Indeed" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Jora", label: "Jora" },
  { value: "Facebook Group", label: "Facebook Group" },
  { value: "Company Referral", label: "Company Referral" },
  { value: "Other", label: "Other" },
];

export const AdditionalInformationSection = ({
  loading = false,
  initialData = {},
}: AdditionalInformationProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<
    Partial<AdditionalInformationFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(
    (): AdditionalInformationFormData => ({
      numberOfChildren: "0",
      workSamples: [{ link: "" }],
      howHear: "OnlineJobsPH",
      referrer: "",
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
  } = useForm<AdditionalInformationFormData>({
    resolver: zodResolver(AdditionalInformationSchema),
    defaultValues,
  });

  const {
    fields: workSampleFields,
    append: appendWorkSample,
    remove: removeWorkSample,
  } = useFieldArray({
    control,
    name: "workSamples",
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
  const onSubmit: SubmitHandler<AdditionalInformationFormData> = async (
    data
  ) => {
    setIsSubmitting(true);
    try {
      // Filter out empty work sample links
      const cleanedData = {
        ...data,
        workSamples: data.workSamples.filter((item) => item.link.trim() !== ""),
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
          title: "Additional Information Updated",
          description: `Successfully updated: ${result.updatedFields?.join(", ") || "additional information"}`,
          variant: "success",
        });
      } else {
        throw new Error(
          result.message || "Failed to save additional information"
        );
      }
    } catch (error) {
      console.error("Error saving additional information:", error);
      toast({
        title: "Error Saving Information",
        description: "Failed to save additional information. Please try again.",
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
              <Info className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Additional Information
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Personal details and work samples to complete your profile
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Grid for basic fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Number of Children */}
              <InfoItem
                label="Number of Children"
                icon={<Baby className="w-4 h-4 text-muted-foreground" />}
                description="Family information for scheduling considerations"
              >
                <Controller
                  name="numberOfChildren"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading || isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select number of children" />
                        </SelectTrigger>
                        <SelectContent>
                          {ChildrenOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.numberOfChildren && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.numberOfChildren.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </InfoItem>

              {/* How Did You Hear About Us */}
              <InfoItem
                label="How Did You Hear About Us?"
                icon={<Radio className="w-4 h-4 text-muted-foreground" />}
                description="Help us understand our best recruitment channels"
              >
                <Controller
                  name="howHear"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading || isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {HowHearOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.howHear && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.howHear.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </InfoItem>
            </div>

            {/* Referrer (Full Width) */}
            <InfoItem
              label="Referrer"
              icon={<Users className="w-4 h-4 text-muted-foreground" />}
              description="If someone referred you, please provide their name or details"
            >
              <Controller
                name="referrer"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="e.g., John Smith (current employee) or recruiting agency name"
                      disabled={loading || isSubmitting}
                      className={errors.referrer ? "border-red-500" : ""}
                    />
                    {errors.referrer && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.referrer.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </InfoItem>

            {/* Work Samples */}
            <InfoItem
              label="Work Samples"
              icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
              description="Share links to your best work, portfolio, or project examples"
            >
              <div className="space-y-4">
                {workSampleFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <Controller
                      name={`workSamples.${index}.link`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex-1">
                          <div className="relative">
                            <Link className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="url"
                              placeholder="https://portfolio.com/project or https://github.com/username/repo"
                              disabled={loading || isSubmitting}
                              className={`pl-10 ${errors.workSamples?.[index]?.link ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.workSamples?.[index]?.link && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.workSamples[index]?.link?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    {workSampleFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkSample(index)}
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
                  onClick={() => appendWorkSample({ link: "" })}
                  disabled={loading || isSubmitting}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Work Sample
                </Button>
              </div>
            </InfoItem>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">💡 Work Sample Tips:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>• Include your best/recent projects</p>
                <p>• GitHub repositories are valuable</p>
                <p>• Live websites or demos preferred</p>
                <p>• Portfolio sites showcase range</p>
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

export { AdditionalInformationSchema };
export type { AdditionalInformationFormData };
