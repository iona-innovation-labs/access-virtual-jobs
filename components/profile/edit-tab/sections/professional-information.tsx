import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Calendar,
  GraduationCap,
  Linkedin,
  Instagram,
  Twitter,
  Globe,
  Star,
  Plus,
  Trash2,
  AlertCircle,
  Info,
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { SubmitHandler } from "react-hook-form";
import { Resolver } from "react-hook-form";
import { EDUCATION_STATUS, MAX_SKILL_COUNT } from "@/lib/constants";
import SkillsSection from "./skills-dialog";

const MAX_SKILLS = MAX_SKILL_COUNT;

const PortfolioLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
  category: z.string().optional(),
});

const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
  starRating: z.number().min(1).max(5).default(1), // 1-5 stars
  yearsOfExperience: z.number().min(0, "Years must be 0 or greater").optional(),
});

const ProfessionalProfileSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  numberOfExperience: z.string().min(1, "Experience is required"),
  educationStatus: z.enum(EDUCATION_STATUS),
  linkedInLink: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  instagramLink: z
    .string()
    .url("Please enter a valid Instagram URL")
    .optional()
    .or(z.literal("")),
  xLink: z
    .string()
    .url("Please enter a valid X (Twitter) URL")
    .optional()
    .or(z.literal("")),
  portfolioLinks: z.array(PortfolioLinkSchema).default([]),
  skills: z
    .array(SkillSchema)
    .max(MAX_SKILLS, `Maximum ${MAX_SKILLS} skills allowed`)
    .default([]),
});

export type ProfessionalProfileFormData = z.infer<
  typeof ProfessionalProfileSchema
>;

interface ProfessionalProfileProps {
  loading?: boolean;
  initialData?: Partial<ProfessionalProfileFormData>;
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

const EducationStatusOptions = [
  {
    value: "did_not_graduate_high_school",
    label: "I did not graduate from High School",
  },
  { value: "high_school", label: "High School" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD/Doctorate" },
  { value: "other", label: "Other" },
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

const CategoryOptions = [
  { value: "technical", label: "Technical" },
  { value: "soft", label: "Soft Skills" },
  { value: "language", label: "Language" },
  { value: "tools", label: "Tools & Software" },
  { value: "other", label: "Other" },
];

// Skills Counter Component
const SkillsCounter = ({ current, max }: { current: number; max: number }) => {
  const percentage = (current / max) * 100;
  const isNearLimit = current >= max * 0.8; // 80% of max
  const isAtLimit = current >= max;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium ${
            isAtLimit
              ? "text-red-600"
              : isNearLimit
                ? "text-yellow-600"
                : "text-muted-foreground"
          }`}
        >
          {current}/{max} skills
        </span>
        {isNearLimit && (
          <Info
            className={`w-4 h-4 ${isAtLimit ? "text-red-500" : "text-yellow-500"}`}
          />
        )}
      </div>

      <div className="flex-1 max-w-32">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit
                ? "bg-red-500"
                : isNearLimit
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const ProfessionalProfileSection = ({
  loading = false,
  initialData = {},
}: ProfessionalProfileProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<
    Partial<ProfessionalProfileFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(
    (): ProfessionalProfileFormData => ({
      jobTitle: "",
      numberOfExperience: "0",
      educationStatus: "high_school",
      linkedInLink: "",
      instagramLink: "",
      xLink: "",
      portfolioLinks: [],
      skills: [],
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
  } = useForm<ProfessionalProfileFormData>({
    resolver: zodResolver(
      ProfessionalProfileSchema
    ) as Resolver<ProfessionalProfileFormData>,
    defaultValues,
  });

  const {
    fields: portfolioFields,
    append: appendPortfolio,
    remove: removePortfolio,
  } = useFieldArray({
    control,
    name: "portfolioLinks",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const watchedValues = watch();
  const currentSkillsCount = watchedValues.skills?.length || 0;
  const isSkillLimitReached = currentSkillsCount >= MAX_SKILLS;

  useEffect(() => {
    setOriginalData(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    const hasFormChanges =
      JSON.stringify(watchedValues) !== JSON.stringify(originalData);
    setHasChanges(hasFormChanges);
  }, [watchedValues, originalData]);

  const onSubmit = async (data: ProfessionalProfileFormData) => {
    if (data.skills.length > MAX_SKILLS) {
      toast({
        title: "Too Many Skills",
        description: `You can only add up to ${MAX_SKILLS} skills. Please remove ${data.skills.length - MAX_SKILLS} skill(s).`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Clean up empty URLs
      const cleanedData = {
        ...data,
        linkedInLink: data.linkedInLink || undefined,
        instagramLink: data.instagramLink || undefined,
        xLink: data.xLink || undefined,
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
          title: "Professional Profile Updated",
          description: `Successfully updated: ${result.updatedFields?.join(", ") || "professional profile"}`,
          variant: "success",
        });
      } else {
        throw new Error(
          result.message || "Failed to save professional profile"
        );
      }
    } catch (error) {
      console.error("Error saving professional profile:", error);
      toast({
        title: "Error Saving Profile",
        description: "Failed to save professional profile. Please try again.",
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

  const addPortfolioLink = () => {
    appendPortfolio({ title: "", url: "", description: "", category: "" });
  };

  const addSkill = (skillData?: any) => {
    if (isSkillLimitReached) {
      toast({
        title: "Skill Limit Reached",
        description: `You can only add up to ${MAX_SKILLS} skills. Please remove a skill before adding a new one.`,
        variant: "destructive",
      });
      return;
    }

    // If skillData is provided (from dialog), use it; otherwise use default values
    const newSkill = skillData || {
      name: "",
      category: "",
      starRating: 1,
      yearsOfExperience: 0,
    };

    appendSkill(newSkill);
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit as SubmitHandler<ProfessionalProfileFormData>
      )}
      className="w-full"
    >
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <User className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Professional Profile
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Share your professional background and online presence
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Title */}
              <InfoItem
                label="Job Title"
                icon={<User className="w-4 h-4 text-muted-foreground" />}
                description="Your current or desired position"
              >
                <Controller
                  name="jobTitle"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        placeholder="e.g., Senior Software Developer"
                        disabled={loading || isSubmitting}
                        className={errors.jobTitle ? "border-red-500" : ""}
                      />
                      {errors.jobTitle && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.jobTitle.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </InfoItem>

              {/* Years of Experience */}
              <InfoItem
                label="Years of Experience"
                icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
                description="Total professional experience"
              >
                <Controller
                  name="numberOfExperience"
                  control={control}
                  render={({ field }) => (
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
                  )}
                />
              </InfoItem>

              {/* Education Status */}
              <InfoItem
                label="Education Level"
                icon={
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                }
                description="Highest level of education completed"
              >
                <Controller
                  name="educationStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading || isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EducationStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </InfoItem>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Social Media & Professional Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LinkedIn */}
                <InfoItem
                  label="LinkedIn"
                  icon={<Linkedin className="w-4 h-4 text-muted-foreground" />}
                >
                  <Controller
                    name="linkedInLink"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder="https://linkedin.com/in/username"
                          disabled={loading || isSubmitting}
                          className={
                            errors.linkedInLink ? "border-red-500" : ""
                          }
                        />
                        {errors.linkedInLink && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.linkedInLink.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </InfoItem>

                {/* Instagram */}
                <InfoItem
                  label="Instagram"
                  icon={<Instagram className="w-4 h-4 text-muted-foreground" />}
                >
                  <Controller
                    name="instagramLink"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder="https://instagram.com/username"
                          disabled={loading || isSubmitting}
                          className={
                            errors.instagramLink ? "border-red-500" : ""
                          }
                        />
                        {errors.instagramLink && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.instagramLink.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </InfoItem>

                {/* X (Twitter) */}
                <InfoItem
                  label="X (Twitter)"
                  icon={<Twitter className="w-4 h-4 text-muted-foreground" />}
                >
                  <Controller
                    name="xLink"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder="https://x.com/username"
                          disabled={loading || isSubmitting}
                          className={errors.xLink ? "border-red-500" : ""}
                        />
                        {errors.xLink && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.xLink.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </InfoItem>
              </div>
            </div>

            {/* Portfolio Links */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Portfolio Links
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPortfolioLink}
                  disabled={loading || isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-4">
                {portfolioFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-5 border border-border rounded-lg bg-card"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe className="w-3 h-3 text-primary" />
                        </div>
                        <h4 className="text-sm font-medium">
                          Portfolio Link {index + 1}
                        </h4>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePortfolio(index)}
                        disabled={loading || isSubmitting}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name={`portfolioLinks.${index}.title`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              placeholder="Link title (e.g., Personal Website)"
                              disabled={loading || isSubmitting}
                              className={
                                errors.portfolioLinks?.[index]?.title
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {errors.portfolioLinks?.[index]?.title && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.portfolioLinks[index]?.title?.message}
                              </p>
                            )}
                          </div>
                        )}
                      />

                      <Controller
                        name={`portfolioLinks.${index}.url`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              placeholder="https://example.com"
                              disabled={loading || isSubmitting}
                              className={
                                errors.portfolioLinks?.[index]?.url
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {errors.portfolioLinks?.[index]?.url && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.portfolioLinks[index]?.url?.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div className="mt-3">
                      <Controller
                        name={`portfolioLinks.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              placeholder="Optional description"
                              disabled={loading || isSubmitting}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                ))}

                {portfolioFields.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>
                      No portfolio links added yet. Click &ldquo;Add Link&ldquo;
                      to get started.
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-md">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium">🔗 Portfolio Links Tips:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p>• Add your GitHub profile to showcase code projects</p>
                    <p>
                      • Include your personal website or professional portfolio
                    </p>
                    <p>
                      • Link to bio sites like LinkTree, Linktree, or About.me
                    </p>
                    <p>• Add Behance, Dribbble for design portfolios</p>
                    <p>
                      • Include LinkedIn profile for professional networking
                    </p>
                    <p>• Keep links active and regularly updated</p>
                  </div>
                </div>
              </div>
            </div>

            <SkillsSection
              currentSkillsCount={currentSkillsCount}
              MAX_SKILLS={MAX_SKILLS}
              skillFields={skillFields}
              addSkill={addSkill}
              removeSkill={removeSkill}
              loading={loading}
              isSubmitting={isSubmitting}
              isSkillLimitReached={isSkillLimitReached}
              control={control}
              errors={errors}
              watchedValues={watchedValues}
              CategoryOptions={CategoryOptions}
              SkillsCounter={SkillsCounter}
            />
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">💼 Professional Profile Tips:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>• Use a clear, descriptive job title</p>
                <p>• Link to active social media profiles</p>
                <p>• Showcase your best work in portfolio links</p>
                <p>• Rate skills honestly for better matches</p>
                <p>• Keep skills relevant to your field</p>
                <p>• Maximum 10 skills for focused expertise</p>
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

export { ProfessionalProfileSchema };
