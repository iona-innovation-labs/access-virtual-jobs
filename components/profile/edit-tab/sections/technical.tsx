import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Monitor, Wifi, Clock, CreditCard } from "lucide-react";
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
const TechnicalSetupSchema = z.object({
  internetProvider: z.string().min(1, "Internet provider is required"),
  numberOfMonitors: z.string().min(1, "Number of monitors is required"),
  numberOfExperience: z.string().min(1, "Years of experience is required"),
  hasPaypal: z.enum(["yes", "no"], {
    required_error: "Please select your PayPal status",
  }),
});

type TechnicalSetupFormData = z.infer<typeof TechnicalSetupSchema>;

interface TechnicalSetupProps {
  loading?: boolean;
  initialData?: Partial<TechnicalSetupFormData>;
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

const MonitorOptions = [
  { value: "1", label: "1 Monitor" },
  { value: "2", label: "2 Monitors" },
  { value: "3", label: "3 Monitors" },
  { value: "4", label: "4+ Monitors" },
];

const ExperienceOptions = [
  { value: "0", label: "No Experience" },
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "3", label: "3 Years" },
  { value: "4", label: "4 Years" },
  { value: "5", label: "5 Years" },
  { value: "6-10", label: "6-10 Years" },
  { value: "10+", label: "10+ Years" },
];

const PaypalOptions = [
  { value: "yes", label: "Yes, I have PayPal" },
  { value: "no", label: "No, I don't have PayPal" },
];

export const TechnicalSetupSection = ({
  loading = false,
  initialData = {},
}: TechnicalSetupProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<
    Partial<TechnicalSetupFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(
    (): TechnicalSetupFormData => ({
      internetProvider: "",
      numberOfMonitors: "1",
      numberOfExperience: "0",
      hasPaypal: "no",
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
  } = useForm<TechnicalSetupFormData>({
    resolver: zodResolver(TechnicalSetupSchema),
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
  const onSubmit = async (data: TechnicalSetupFormData) => {
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
          title: "Technical Setup Updated",
          description: `Successfully updated: ${result.updatedFields?.join(", ") || "technical setup"}`,
          variant: "success",
        });
      } else {
        throw new Error(result.message || "Failed to save technical setup");
      }
    } catch (error) {
      console.error("Error saving technical setup:", error);
      toast({
        title: "Error Saving Setup",
        description: "Failed to save technical setup. Please try again.",
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
              <Monitor className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Technical Setup
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your work environment and technical specifications
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Internet Provider */}
            <InfoItem
              label="Internet Provider"
              icon={<Wifi className="w-4 h-4 text-muted-foreground" />}
              description="Include your ISP name and speed plan"
            >
              <Controller
                name="internetProvider"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="e.g., Comcast Xfinity 100 Mbps"
                      disabled={loading || isSubmitting}
                      className={
                        errors.internetProvider ? "border-red-500" : ""
                      }
                    />
                    {errors.internetProvider && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.internetProvider.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </InfoItem>

            {/* Number of Monitors */}
            <InfoItem
              label="Number of Monitors"
              icon={<Monitor className="w-4 h-4 text-muted-foreground" />}
              description="How many monitors do you use for work?"
            >
              <Controller
                name="numberOfMonitors"
                control={control}
                render={({ field }) => (
                  <div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading || isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select number of monitors" />
                      </SelectTrigger>
                      <SelectContent>
                        {MonitorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.numberOfMonitors && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.numberOfMonitors.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </InfoItem>

            {/* Years of Experience */}
            <InfoItem
              label="Years of Work Experience"
              icon={<Clock className="w-4 h-4 text-muted-foreground" />}
              description="Total professional work experience"
            >
              <Controller
                name="numberOfExperience"
                control={control}
                render={({ field }) => (
                  <div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading || isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {ExperienceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.numberOfExperience && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.numberOfExperience.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </InfoItem>

            {/* PayPal Status */}
            <InfoItem
              label="PayPal Account Status"
              icon={<CreditCard className="w-4 h-4 text-muted-foreground" />}
              description="We pay via PayPal - do you have an account?"
            >
              <Controller
                name="hasPaypal"
                control={control}
                render={({ field }) => (
                  <div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading || isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select PayPal status" />
                      </SelectTrigger>
                      <SelectContent>
                        {PaypalOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.hasPaypal && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.hasPaypal.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </InfoItem>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">💡 Technical Requirements:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>• Stable internet connection required</p>
                <p>• Multiple monitors improve productivity</p>
                <p>• PayPal account needed for payments</p>
                <p>• Experience level helps with job matching</p>
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

export { TechnicalSetupSchema };
export type { TechnicalSetupFormData };
