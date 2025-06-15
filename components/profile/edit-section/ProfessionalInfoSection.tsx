import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import { Briefcase, Edit3, User, Target, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";

interface ProfessionalInfoSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  data: {
    jobTitle: string;
    whyFit: string;
    whatStrengths: string;
    whatNeedImprovement: string;
  };
  onUpdate: () => void;
}

interface EditDialogProps {
  title: string;
  currentValue: string;
  placeholder: string;
  isTextarea?: boolean;
  loading: boolean;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
}

const EditDialog = ({
  title,
  currentValue,
  placeholder,
  isTextarea = false,
  loading,
  fieldName,
  control,
  onSubmit,
}: EditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentValue);

  const { field } = useController({
    name: fieldName,
    control,
  });

  // Set initial value from form when dialog opens
  React.useEffect(() => {
    if (open) {
      setValue((field.value as string) || currentValue);
    }
  }, [open, field.value, currentValue]);

  const handleSave = () => {
    field.onChange(value);
    onSubmit();
    setOpen(false);
  };

  const handleCancel = () => {
    setValue((field.value as string) || currentValue);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-brand/5"
          disabled={loading}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isTextarea ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="min-h-32 resize-none"
              disabled={loading}
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              disabled={loading}
            />
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  isTextarea?: boolean;
  placeholder: string;
  loading: boolean;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
}

const InfoItem = ({
  label,
  value,
  isTextarea = false,
  placeholder,
  loading,
  fieldName,
  control,
  onSubmit,
  icon,
}: InfoItemProps) => (
  <div className="group py-6 border-b border-border last:border-b-0">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
          <EditDialog
            title={`Edit ${label}`}
            currentValue={value}
            placeholder={placeholder}
            isTextarea={isTextarea}
            loading={loading}
            fieldName={fieldName}
            control={control}
            onSubmit={onSubmit}
          />
        </div>
        <div className="text-foreground leading-relaxed">
          {value ? (
            isTextarea ? (
              <div className="whitespace-pre-wrap text-sm">{value}</div>
            ) : (
              <div className="text-xl font-medium">{value}</div>
            )
          ) : (
            <span className="text-muted-foreground italic text-sm">
              Click edit to add {label.toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const ProfessionalInfoSection = ({
  control,
  loading,
  data,
  onUpdate,
}: ProfessionalInfoSectionProps) => {
  return (
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Professional Information
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Share your experience and professional background
            </p>
          </div>
        </div>

        <div>
          <InfoItem
            label="Job Title"
            value={data.jobTitle}
            placeholder="Enter your job title"
            loading={loading}
            fieldName="jobTitle"
            control={control}
            onSubmit={onUpdate}
            icon={<User className="w-4 h-4 text-muted-foreground" />}
          />

          <InfoItem
            label="Why You're a Good Fit"
            value={data.whyFit}
            placeholder="Describe your relevant experiences and qualifications..."
            isTextarea
            loading={loading}
            fieldName="whyFit"
            control={control}
            onSubmit={onUpdate}
            icon={<Target className="w-4 h-4 text-muted-foreground" />}
          />

          <InfoItem
            label="Your Strengths"
            value={data.whatStrengths}
            placeholder="Describe your key strengths and areas of expertise..."
            isTextarea
            loading={loading}
            fieldName="whatStrengths"
            control={control}
            onSubmit={onUpdate}
            icon={<Zap className="w-4 h-4 text-muted-foreground" />}
          />

          <InfoItem
            label="Areas for Improvement"
            value={data.whatNeedImprovement}
            placeholder="Identify areas where you'd like to grow and improve..."
            isTextarea
            loading={loading}
            fieldName="whatNeedImprovement"
            control={control}
            onSubmit={onUpdate}
            icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};
