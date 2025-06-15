import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Target, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Zod Schema
const PrescreeningQuestionsSchema = z.object({
  whyFit: z.string().min(1, "Please describe why you're a good fit"),
  whatStrengths: z.string().min(1, "Please describe your strengths"),
  whatNeedImprovement: z
    .string()
    .min(1, "Please describe areas for improvement"),
});

type PrescreeningQuestionsFormData = z.infer<
  typeof PrescreeningQuestionsSchema
>;

interface PrescreeningQuestionsProps {
  loading?: boolean;
  initialData?: Partial<PrescreeningQuestionsFormData>;
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

export const PrescreeningQuestionsSection = ({
  loading = false,
  initialData = {},
}: PrescreeningQuestionsProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<
    Partial<PrescreeningQuestionsFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(
    (): PrescreeningQuestionsFormData => ({
      whyFit: "",
      whatStrengths: "",
      whatNeedImprovement: "",
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
  } = useForm<PrescreeningQuestionsFormData>({
    resolver: zodResolver(PrescreeningQuestionsSchema),
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
  const onSubmit = async (data: PrescreeningQuestionsFormData) => {
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
          title: "Prescreening Questions Updated",
          description: `Successfully updated: ${result.updatedFields?.join(", ") || "prescreening questions"}`,
          variant: "success",
        });
      } else {
        throw new Error(
          result.message || "Failed to save professional background"
        );
      }
    } catch (error) {
      console.error("Error saving professional background:", error);
      toast({
        title: "Error Saving Questions",
        description: "Failed to save prescreening questions. Please try again.",
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
              <Target className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Prescreening Questions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Answer these key questions to help employers understand your
                qualifications
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Why You're a Good Fit */}
            <InfoItem
              label="Why You're a Good Fit"
              icon={<Target className="w-4 h-4 text-muted-foreground" />}
              description="Describe your relevant experiences and qualifications"
            >
              <Controller
                name="whyFit"
                control={control}
                render={({ field }) => (
                  <div>
                    <Textarea
                      {...field}
                      placeholder="Explain why you're an ideal candidate. Include relevant experience, qualifications, achievements, and what makes you stand out from other candidates..."
                      className={`min-h-32 resize-none ${errors.whyFit ? "border-red-500" : ""}`}
                      disabled={loading || isSubmitting}
                    />
                    {errors.whyFit && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.whyFit.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </InfoItem>

            {/* Your Strengths */}
            <InfoItem
              label="Your Strengths"
              icon={<Zap className="w-4 h-4 text-muted-foreground" />}
              description="Highlight your key strengths and areas of expertise"
            >
              <Controller
                name="whatStrengths"
                control={control}
                render={({ field }) => (
                  <div>
                    <Textarea
                      {...field}
                      placeholder="List your key strengths, core competencies, technical skills, soft skills, and any special abilities that make you valuable as a professional..."
                      className={`min-h-32 resize-none ${errors.whatStrengths ? "border-red-500" : ""}`}
                      disabled={loading || isSubmitting}
                    />
                    {errors.whatStrengths && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.whatStrengths.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </InfoItem>

            {/* Areas for Improvement */}
            <InfoItem
              label="Areas for Improvement"
              icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
              description="Share what you'd like to develop and grow"
            >
              <Controller
                name="whatNeedImprovement"
                control={control}
                render={({ field }) => (
                  <div>
                    <Textarea
                      {...field}
                      placeholder="Identify skills or areas where you'd like to grow, new technologies you want to learn, or professional development goals you're working toward..."
                      className={`min-h-32 resize-none ${errors.whatNeedImprovement ? "border-red-500" : ""}`}
                      disabled={loading || isSubmitting}
                    />
                    {errors.whatNeedImprovement && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.whatNeedImprovement.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </InfoItem>
          </div>

          {/* Tips Section */}
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-medium">💡 Writing Tips:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="font-medium mb-1">
                    Why You&apos;re a Good Fit:
                  </p>
                  <p>• Mention specific experience</p>
                  <p>• Include measurable achievements</p>
                  <p>• Connect skills to job requirements</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Your Strengths:</p>
                  <p>• List both technical & soft skills</p>
                  <p>• Provide specific examples</p>
                  <p>• Focus on unique advantages</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Areas for Improvement:</p>
                  <p>• Show self-awareness</p>
                  <p>• Mention learning initiatives</p>
                  <p>• Frame positively as growth goals</p>
                </div>
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

export { PrescreeningQuestionsSchema };
export type { PrescreeningQuestionsFormData };
