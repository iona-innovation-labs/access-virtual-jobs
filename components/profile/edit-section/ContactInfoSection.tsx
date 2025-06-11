import React, { useState } from "react";
import { Control, UseFieldArrayReturn, useController } from "react-hook-form";
import {
  Phone,
  Mail,
  MapPin,
  X,
  Plus,
  Edit3,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";

interface ContactInfoSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  phoneFields: UseFieldArrayReturn<EditProfileSchema, "phone">;
  emailFields: UseFieldArrayReturn<EditProfileSchema, "emailAddress">;
  data: {
    address: string;
    dateOfBirth: Date | undefined;
    skypeId: string;
    phone: Array<{ type: string; number: string }>;
    emailAddress: Array<{ type: string; address: string }>;
  };
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
  type?: "text" | "email";
}

const EditDialog = ({
  title,
  currentValue,
  placeholder,
  fieldName,
  control,
  onSubmit,
  loading,
  type = "text",
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
          <Input
            type={type}
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

interface DateEditDialogProps {
  title: string;
  currentValue: Date | undefined;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  loading: boolean;
}

const DateEditDialog = ({
  title,
  currentValue,
  fieldName,
  control,
  onSubmit,
  loading,
}: DateEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Date | undefined>(currentValue);

  const { field } = useController({
    name: fieldName,
    control,
  });

  React.useEffect(() => {
    if (open) {
      setValue((field.value as Date) || currentValue);
    }
  }, [open, field.value, currentValue]);

  const handleSave = () => {
    field.onChange(value);
    onSubmit();
    setOpen(false);
  };

  const handleCancel = () => {
    setValue((field.value as Date) || currentValue);
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
          <DatePicker
            disabled={loading}
            date={value}
            onChange={setValue}
            placeholder="Select your date of birth"
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

interface SimpleInfoItemProps {
  label: string;
  value: string;
  placeholder: string;
  loading: boolean;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
  type?: "text" | "email";
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
  type = "text",
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
            type={type}
          />
        </div>
        <div className="text-gray-900 leading-relaxed">
          {value ? (
            <div className="text-xl font-medium">{value}</div>
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

interface DateInfoItemProps {
  label: string;
  value: Date | undefined;
  loading: boolean;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
}

const DateInfoItem = ({
  label,
  value,
  loading,
  fieldName,
  control,
  onSubmit,
  icon,
}: DateInfoItemProps) => (
  <div className="group py-6 border-b border-gray-100 last:border-b-0">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
          <DateEditDialog
            title={`Edit ${label}`}
            currentValue={value}
            fieldName={fieldName}
            control={control}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
        <div className="text-gray-900 leading-relaxed">
          {value ? (
            <div className="text-xl font-medium">
              {value.toLocaleDateString()}
            </div>
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

interface ArrayInfoItemProps {
  label: string;
  items: Array<{ type: string; number?: string; address?: string }>;
  loading: boolean;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
  fieldArray: UseFieldArrayReturn<EditProfileSchema, any>;
  fieldPrefix: "phone" | "emailAddress";
  valueKey: "number" | "address";
  placeholder: string;
  inputType?: "text" | "email";
  typeOptions: Array<{ value: string; label: string }>;
}

const ArrayInfoItem = ({
  label,
  items,
  loading,
  control,
  onSubmit,
  icon,
  fieldArray,
  fieldPrefix,
  valueKey,
  placeholder,
  inputType = "text",
  typeOptions,
}: ArrayInfoItemProps) => {
  const [editMode, setEditMode] = useState(false);

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
          <div className="text-gray-900 leading-relaxed">
            {!editMode ? (
              items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-500 capitalize">
                        {item.type || "Unknown"}:
                      </span>{" "}
                      <span className="font-medium">
                        {item[valueKey] || "Not specified"}
                      </span>
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
                      name={`${fieldPrefix}.${index}.type` as any}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormControl>
                            <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {typeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`${fieldPrefix}.${index}.${valueKey}` as any}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              disabled={loading}
                              {...field}
                              type={inputType}
                              placeholder={placeholder}
                              className="h-8 text-xs"
                            />
                          </FormControl>
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
                    onClick={() =>
                      fieldArray.append(
                        fieldPrefix === "phone"
                          ? { type: "", number: "" }
                          : { type: "", address: "" }
                      )
                    }
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
                    onClick={() => {
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

export const ContactInfoSection = ({
  control,
  loading,
  phoneFields,
  emailFields,
  data,
  onUpdate,
}: ContactInfoSectionProps) => {
  const phoneTypeOptions = [
    { value: "mobile", label: "Mobile" },
    { value: "work", label: "Work" },
    { value: "home", label: "Home" },
    { value: "main", label: "Main" },
    { value: "work-fax", label: "Work Fax" },
    { value: "private-fax", label: "Private Fax" },
    { value: "other", label: "Other" },
  ];

  const emailTypeOptions = [
    { value: "work", label: "Work" },
    { value: "home", label: "Personal" },
    { value: "other", label: "Other" },
  ];

  return (
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Contact Information
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Your contact details and communication preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SimpleInfoItem
            label="Address"
            value={data.address}
            placeholder="Enter your full address"
            loading={loading}
            fieldName="address"
            control={control}
            onSubmit={onUpdate}
            icon={<MapPin className="w-4 h-4 text-gray-600" />}
          />

          <DateInfoItem
            label="Date of Birth"
            value={data.dateOfBirth}
            loading={loading}
            fieldName="dateOfBirth"
            control={control}
            onSubmit={onUpdate}
            icon={<Calendar className="w-4 h-4 text-gray-600" />}
          />

          <ArrayInfoItem
            label="Contact Numbers"
            items={data.phone}
            loading={loading}
            control={control}
            onSubmit={onUpdate}
            icon={<Phone className="w-4 h-4 text-gray-600" />}
            fieldArray={phoneFields}
            fieldPrefix="phone"
            valueKey="number"
            placeholder="Enter phone number"
            typeOptions={phoneTypeOptions}
          />

          <ArrayInfoItem
            label="Email Addresses"
            items={data.emailAddress}
            loading={loading}
            control={control}
            onSubmit={onUpdate}
            icon={<Mail className="w-4 h-4 text-gray-600" />}
            fieldArray={emailFields}
            fieldPrefix="emailAddress"
            valueKey="address"
            placeholder="Enter email address"
            inputType="email"
            typeOptions={emailTypeOptions}
          />

          <SimpleInfoItem
            label="Skype ID"
            value={data.skypeId}
            placeholder="Enter your Skype ID"
            loading={loading}
            fieldName="skypeId"
            control={control}
            onSubmit={onUpdate}
            icon={<MessageCircle className="w-4 h-4 text-gray-600" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};
