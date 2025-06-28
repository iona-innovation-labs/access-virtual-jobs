"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Trash2, AlertCircle, Info } from "lucide-react";

// Skill schema for dialog form
const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
  yearsOfExperience: z.number().min(0).max(50),
  starRating: z.number().min(1, "Please rate your skill").max(5),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillsSectionProps {
  // From original component
  currentSkillsCount: number;
  MAX_SKILLS: number;
  skillFields: any[];
  addSkill: (skillData?: SkillFormData) => void; // Modified to accept optional skill data
  removeSkill: (index: number) => void;
  loading: boolean;
  isSubmitting: boolean;
  isSkillLimitReached: boolean;
  control: any; // react-hook-form control
  errors: any; // form errors
  watchedValues: any; // watched form values
  CategoryOptions: Array<{ value: string; label: string }>;
  SkillsCounter: React.ComponentType<{ current: number; max: number }>;
}

export default function SkillsSection({
  currentSkillsCount,
  MAX_SKILLS,
  skillFields,
  addSkill,
  removeSkill,
  loading,
  isSubmitting,
  isSkillLimitReached,
  control,
  errors,
  watchedValues,
  CategoryOptions,
  SkillsCounter,
}: SkillsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Dialog form
  const dialogForm = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      yearsOfExperience: 0,
      starRating: 1, // Changed from 0 to 1 to match schema minimum
    },
  });

  const handleAddSkill = (skillData: SkillFormData) => {
    // Pass the skill data to the parent's addSkill function
    addSkill(skillData);
    setIsDialogOpen(false);
    dialogForm.reset({
      name: "",
      category: "",
      yearsOfExperience: 0,
      starRating: 1,
    });
  };

  const onDialogSubmit = (data: SkillFormData) => {
    handleAddSkill(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            <Star className="w-4 h-4" />
            Skills & Expertise
          </h3>
          <SkillsCounter current={currentSkillsCount} max={MAX_SKILLS} />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading || isSubmitting || isSkillLimitReached}
              className={
                isSkillLimitReached ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[500px] mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Add New Skill
              </DialogTitle>
              <DialogDescription>
                Add a new skill to showcase your expertise. Rate your
                proficiency and add relevant details.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={dialogForm.handleSubmit(onDialogSubmit)}
              className="space-y-4"
            >
              <div className="space-y-4">
                {/* Skill Name */}
                <div>
                  <Label htmlFor="skillName">Skill Name *</Label>
                  <Controller
                    name="name"
                    control={dialogForm.control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id="skillName"
                          placeholder="e.g., React, JavaScript, Photoshop"
                          disabled={loading || isSubmitting}
                          className={
                            dialogForm.formState.errors.name
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {dialogForm.formState.errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {dialogForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Category and Years Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Controller
                      name="category"
                      control={dialogForm.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={loading || isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CategoryOptions.map((option) => (
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
                  </div>

                  <div>
                    <Label htmlFor="years">Years of Experience</Label>
                    <Controller
                      name="yearsOfExperience"
                      control={dialogForm.control}
                      render={({ field }) => (
                        <div>
                          <Input
                            {...field}
                            id="years"
                            type="number"
                            placeholder="0"
                            min="0"
                            max="50"
                            disabled={loading || isSubmitting}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            className={
                              dialogForm.formState.errors.yearsOfExperience
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {dialogForm.formState.errors.yearsOfExperience && (
                            <p className="text-red-500 text-sm mt-1">
                              {
                                dialogForm.formState.errors.yearsOfExperience
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <Label>Skill Level *</Label>
                  <Controller
                    name="starRating"
                    control={dialogForm.control}
                    render={({ field }) => (
                      <div>
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              disabled={loading || isSubmitting}
                              onClick={() => field.onChange(star)}
                              className={`w-8 h-8 transition-all ${
                                loading || isSubmitting
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer hover:scale-110"
                              }`}
                            >
                              <Star
                                className={`w-full h-full ${
                                  star <= (field.value || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300 hover:text-yellow-200"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            {field.value ? `${field.value}/5` : "0/5"}
                          </span>
                        </div>
                        {dialogForm.formState.errors.starRating && (
                          <p className="text-red-500 text-sm mt-1">
                            {dialogForm.formState.errors.starRating.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Live Preview */}
                {dialogForm.watch("name") && (
                  <div className="border border-border rounded-lg p-3 bg-muted/50">
                    <Label className="text-sm font-medium mb-2 block">
                      Preview:
                    </Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-medium">
                        {dialogForm.watch("name")}
                      </Badge>
                      {dialogForm.watch("starRating") && (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= dialogForm.watch("starRating")
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground">
                            ({dialogForm.watch("starRating")}/5)
                          </span>
                        </div>
                      )}
                      {dialogForm.watch("yearsOfExperience") > 0 && (
                        <span className="text-muted-foreground text-xs">
                          {dialogForm.watch("yearsOfExperience")} year
                          {dialogForm.watch("yearsOfExperience") !== 1
                            ? "s"
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={loading || isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={dialogForm.handleSubmit(onDialogSubmit)}
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? "Adding..." : "Add Skill"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Skills limit warning */}
      {isSkillLimitReached && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You&apos;ve reached the maximum limit of {MAX_SKILLS} skills. Remove
            a skill to add a new one.
          </AlertDescription>
        </Alert>
      )}

      {/* Skills limit info */}
      {currentSkillsCount >= MAX_SKILLS * 0.8 && !isSkillLimitReached && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You&apos;re approaching the skill limit. You can add{" "}
            {MAX_SKILLS - currentSkillsCount} more skill(s).
          </AlertDescription>
        </Alert>
      )}

      {/* Existing Skills Display */}
      <div className="space-y-3">
        {skillFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-border rounded-lg bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-medium">Skill {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(index)}
                disabled={loading || isSubmitting}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <Controller
                  name={`skills.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        Skill Name *
                      </label>
                      <Input
                        {...field}
                        placeholder="e.g., React, JavaScript"
                        disabled={loading || isSubmitting}
                        className={`h-8 ${
                          errors.skills?.[index]?.name ? "border-red-500" : ""
                        }`}
                      />
                      {errors.skills?.[index]?.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.skills[index]?.name?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name={`skills.${index}.category`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        Category
                      </label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading || isSubmitting}
                      >
                        <SelectTrigger className="h-6 w-full">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CategoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name={`skills.${index}.yearsOfExperience`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        Years
                      </label>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0"
                        min="0"
                        max="50"
                        disabled={loading || isSubmitting}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className={`h-8 ${
                          errors.skills?.[index]?.yearsOfExperience
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {errors.skills?.[index]?.yearsOfExperience && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.skills[index]?.yearsOfExperience?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="mt-3">
              <Controller
                name={`skills.${index}.starRating`}
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={loading || isSubmitting}
                          onClick={() => field.onChange(star)}
                          className={`w-5 h-5 transition-colors ${
                            loading || isSubmitting
                              ? "cursor-not-allowed"
                              : "cursor-pointer hover:scale-110"
                          }`}
                        >
                          <Star
                            className={`w-full h-full ${
                              star <= (field.value || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        {field.value ? `${field.value}/5` : "0/5"}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            {watchedValues && watchedValues.skills?.[index]?.name && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">Preview:</span>
                  <Badge variant="outline" className="font-medium">
                    {watchedValues.skills[index].name}
                  </Badge>
                  {watchedValues.skills[index].starRating && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= watchedValues.skills[index].starRating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground">
                        ({watchedValues.skills[index].starRating}/5)
                      </span>
                    </div>
                  )}
                  {(watchedValues?.skills?.[index]?.yearsOfExperience ?? 0) >
                    0 && (
                    <span className="text-muted-foreground text-xs">
                      {watchedValues?.skills?.[index]?.yearsOfExperience} year
                      {watchedValues?.skills?.[index]?.yearsOfExperience !== 1
                        ? "s"
                        : ""}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {skillFields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>
              No skills added yet. Click &quot;Add Skill&quot; to showcase your
              expertise.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
