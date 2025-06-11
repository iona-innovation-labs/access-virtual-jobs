import React, { useState } from "react";
import { Control, UseFieldArrayReturn, useController } from "react-hook-form";
import {
  FileText,
  Users,
  MessageSquare,
  X,
  Plus,
  Edit3,
  Link,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";

interface AdditionalInfoSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  data: {
    workSamples?: Array<{ link?: string }>;
    howHear?: string;
    referrer?: string;
  };
  workSampleFields: UseFieldArrayReturn<EditProfileSchema, "workSamples">;
  onUpdate: () => void;
}

interface EditDialogProps {
  title: string;
  currentValue: string;
  placeholder: string;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  loading: boolean;
  description?: string;
}

const EditDialog = ({
  title,
  currentValue,
  placeholder,
  fieldName,
  control,
  onSubmit,
  loading,
  description,
}: EditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentValue);

  const { field } = useController({
    name: fieldName,
    control,
  });

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
          className="h-8 w-8 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-blue-50"
          disabled={loading}
          type="button"
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
          {description && (
            <p className="text-xs text-gray-500 mb-3">{description}</p>
          )}
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
          />
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

interface SelectEditDialogProps {
  title: string;
  currentValue: string;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  loading: boolean;
  options: Array<{ value: string; label: string }>;
}

const SelectEditDialog = ({
  title,
  currentValue,
  fieldName,
  control,
  onSubmit,
  loading,
  options,
}: SelectEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentValue);

  const { field } = useController({
    name: fieldName,
    control,
  });

  React.useEffect(() => {
    if (open) {
      setValue(field.value?.toString() || currentValue);
    }
  }, [open, field.value, currentValue]);

  const handleSave = () => {
    field.onChange(value);
    onSubmit();
    setOpen(false);
  };

  const handleCancel = () => {
    setValue(field.value?.toString() || currentValue);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-blue-50"
          disabled={loading}
          type="button"
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
          <Select onValueChange={setValue} value={value} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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

interface ArrayInfoItemProps {
  label: string;
  items: Array<{ link?: string }>;
  loading: boolean;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
  fieldArray: UseFieldArrayReturn<EditProfileSchema, any>;
  fieldName: "workSamples";
  placeholder: string;
  description: React.ReactNode;
  colorScheme: "green";
}

const ArrayInfoItem = ({
  label,
  items,
  loading,
  control,
  onSubmit,
  icon,
  fieldArray,
  fieldName,
  placeholder,
  description,
  colorScheme,
}: ArrayInfoItemProps) => {
  const [editMode, setEditMode] = useState(false);

  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
      linkText: "text-green-600 hover:text-green-800",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className="group py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{label}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-blue-50"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                setEditMode(!editMode);
              }}
              type="button"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Description Box */}
          <div
            className={`${colors.bg} ${colors.border} border rounded-lg p-3 mt-3 mb-4`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <FileText className={`w-2.5 h-2.5 ${colors.iconText}`} />
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                {description}
              </div>
            </div>
          </div>

          <div className="text-gray-900 leading-relaxed">
            {!editMode ? (
              items.length > 0 && items.some((item) => item.link) ? (
                <div className="space-y-2">
                  {items
                    .filter((item) => item.link)
                    .map((item, index) => (
                      <div key={index} className="text-sm">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${colors.linkText} hover:underline font-medium break-all`}
                        >
                          {item.link}
                        </a>
                      </div>
                    ))}
                </div>
              ) : (
                <span className="text-gray-400 italic text-sm">
                  Click edit to add {label.toLowerCase()}
                </span>
              )
            ) : (
              <div className="space-y-3 mt-3">
                {fieldArray.fields.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <FormField
                      control={control}
                      name={`${fieldName}.${index}.link` as any}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <div className="relative">
                            <Link className="absolute left-3 top-2.5 w-3 h-3 text-gray-400" />
                            <FormControl>
                              <Input
                                disabled={loading}
                                {...field}
                                type="url"
                                placeholder={placeholder}
                                className="pl-9 h-8 text-xs"
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                    {fieldArray.fields.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        disabled={loading}
                        onClick={() => fieldArray.remove(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      fieldArray.append({ link: "" });
                    }}
                    className="h-8 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      setEditMode(false);
                      onSubmit();
                    }}
                    className="h-8 text-xs"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SimpleInfoItemProps {
  label: string;
  value: string;
  placeholder: string;
  loading: boolean;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
  description?: string;
}

const SimpleInfoItem = ({
  label,
  value,
  placeholder,
  loading,
  fieldName,
  control,
  onSubmit,
  icon,
  description,
}: SimpleInfoItemProps) => (
  <div className="group py-6 border-b border-gray-100 last:border-b-0">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
          <EditDialog
            title={`Edit ${label}`}
            currentValue={value}
            placeholder={placeholder}
            fieldName={fieldName}
            control={control}
            onSubmit={onSubmit}
            loading={loading}
            description={description}
          />
        </div>
        <div className="text-gray-900 leading-relaxed">
          {value ? (
            <div className="text-base font-medium">{value}</div>
          ) : (
            <span className="text-gray-400 italic text-sm">
              Click edit to add {label.toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

interface SelectInfoItemProps {
  label: string;
  value: string;
  loading: boolean;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
  options: Array<{ value: string; label: string }>;
}

const SelectInfoItem = ({
  label,
  value,
  loading,
  fieldName,
  control,
  onSubmit,
  icon,
  options,
}: SelectInfoItemProps) => {
  const displayValue =
    options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="group py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">{label}</h3>
            <SelectEditDialog
              title={`Edit ${label}`}
              currentValue={value}
              fieldName={fieldName}
              control={control}
              onSubmit={onSubmit}
              loading={loading}
              options={options}
            />
          </div>
          <div className="text-gray-900 leading-relaxed">
            {value ? (
              <div className="text-base font-medium">{displayValue}</div>
            ) : (
              <span className="text-gray-400 italic text-sm">
                Click edit to add {label.toLowerCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdditionalInfoSection = ({
  control,
  loading,
  data,
  workSampleFields,
  onUpdate,
}: AdditionalInfoSectionProps) => {
  const howHearOptions = [
    { value: "online jobs ph", label: "OnlineJobsPH" },
    { value: "craigslist", label: "Craigslist" },
    { value: "indeed", label: "Indeed" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "jora", label: "Jora" },
    { value: "fb group", label: "Facebook Group" },
    { value: "company referral", label: "Company Referral" },
    { value: "other", label: "Other" },
  ];

  const workSampleDescription = (
    <div>
      <div className="font-medium text-gray-800 mb-1 text-xs">
        Work Samples (Optional)
      </div>
      <div>
        Share links to your best work samples, portfolio, or projects that
        demonstrate your skills and experience.
      </div>
    </div>
  );

  return (
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Additional Information
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Portfolio samples and referral information
            </p>
          </div>
        </div>

        <div>
          <ArrayInfoItem
            label="Work Samples"
            items={data.workSamples || []}
            loading={loading}
            control={control}
            onSubmit={onUpdate}
            icon={<FileText className="w-4 h-4 text-gray-600" />}
            fieldArray={workSampleFields}
            fieldName="workSamples"
            placeholder="Paste your work sample link here"
            description={workSampleDescription}
            colorScheme="green"
          />

          <SelectInfoItem
            label="How did you hear about us?"
            value={data.howHear || ""}
            loading={loading}
            fieldName="howHear"
            control={control}
            onSubmit={onUpdate}
            icon={<UserCheck className="w-4 h-4 text-gray-600" />}
            options={howHearOptions}
          />

          <SimpleInfoItem
            label="Employee Referral"
            value={data.referrer || ""}
            placeholder="Enter employee name (if applicable)"
            loading={loading}
            fieldName="referrer"
            control={control}
            onSubmit={onUpdate}
            icon={<Users className="w-4 h-4 text-gray-600" />}
            description="Do you know someone working at Access Insurance? Please state their name if you do."
          />
        </div>
      </CardContent>
    </Card>
  );
};
