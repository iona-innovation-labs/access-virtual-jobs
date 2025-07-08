import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import {
  Monitor,
  Wifi,
  Clock,
  DollarSign,
  Edit3,
  CreditCard,
  Baby,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectLabel,
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

import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";

interface TechnicalInfoSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  data: {
    internetProvider?: string;
    numberOfMonitors?: string;
    numberOfExperience?: string;
    salaryUnit?: string;
    desiredSalary?: number;
    hasPaypal?: string;
    numberOfChildren?: string;
  };
  onUpdate: () => void;
}

interface EditDialogProps {
  title: string;
  currentValue: string | number;
  placeholder: string;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  loading: boolean;
  type?: "text" | "number";
  min?: number;
  max?: number;
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
  type = "text",
  min,
  max,
  description,
}: EditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentValue?.toString() || "");

  const { field } = useController({
    name: fieldName,
    control,
  });

  React.useEffect(() => {
    if (open) {
      setValue(field.value?.toString() || currentValue?.toString() || "");
    }
  }, [open, field.value, currentValue]);

  const handleSave = () => {
    if (type === "number") {
      field.onChange(parseInt(value) || 0);
    } else {
      field.onChange(value);
    }
    onSubmit();
    setOpen(false);
  };

  const handleCancel = () => {
    setValue(field.value?.toString() || currentValue?.toString() || "");
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
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
          )}
          <Input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            min={min}
            max={max}
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
  description?: string;
}

const SelectEditDialog = ({
  title,
  currentValue,
  fieldName,
  control,
  onSubmit,
  loading,
  options,
  description,
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
          className="h-8 w-8 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-brand/5"
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
            <p className="text-xs text-zinc-500 mb-3">{description}</p>
          )}
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

interface SalaryEditDialogProps {
  title: string;
  currentSalary: number;
  currentUnit: string;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  loading: boolean;
}

const SalaryEditDialog = ({
  title,
  currentSalary,
  currentUnit,
  control,
  onSubmit,
  loading,
}: SalaryEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [salary, setSalary] = useState(currentSalary?.toString() || "");
  const [unit, setUnit] = useState(currentUnit || "");

  const { field: salaryField } = useController({
    name: "desiredSalary",
    control,
  });

  const { field: unitField } = useController({
    name: "salaryUnit",
    control,
  });

  React.useEffect(() => {
    if (open) {
      setSalary(
        salaryField.value?.toString() || currentSalary?.toString() || ""
      );
      setUnit(unitField.value?.toString() || currentUnit || "");
    }
  }, [open, salaryField.value, unitField.value, currentSalary, currentUnit]);

  const handleSave = () => {
    salaryField.onChange(parseInt(salary) || 0);
    unitField.onChange(unit);
    onSubmit();
    setOpen(false);
  };

  const handleCancel = () => {
    setSalary(salaryField.value?.toString() || currentSalary?.toString() || "");
    setUnit(unitField.value?.toString() || currentUnit || "");
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
        <div className="py-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            Please specify your monthly salary expectation
          </p>
          <div className="flex gap-2">
            <Select onValueChange={setUnit} value={unit} disabled={loading}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currency</SelectLabel>
                  <SelectItem value="PHP">PHP</SelectItem>
                  <SelectItem value="COP">COP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter amount"
              disabled={loading}
              min="0"
              className="flex-1"
            />
          </div>
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
  value: string | number;
  placeholder: string;
  loading: boolean;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
  type?: "text" | "number";
  min?: number;
  max?: number;
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
  type = "text",
  min,
  max,
  description,
}: SimpleInfoItemProps) => (
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
            fieldName={fieldName}
            control={control}
            onSubmit={onSubmit}
            loading={loading}
            type={type}
            min={min}
            max={max}
            description={description}
          />
        </div>
        <div className="text-foreground leading-relaxed">
          {value ? (
            <div className="text-base font-medium">{value}</div>
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

interface SelectInfoItemProps {
  label: string;
  value: string;
  loading: boolean;
  fieldName: keyof EditProfileSchema;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
  options: Array<{ value: string; label: string }>;
  description?: string;
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
  description,
}: SelectInfoItemProps) => {
  const displayValue =
    options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="group py-6 border-b border-border last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {label}
            </h3>
            <SelectEditDialog
              title={`Edit ${label}`}
              currentValue={value}
              fieldName={fieldName}
              control={control}
              onSubmit={onSubmit}
              loading={loading}
              options={options}
              description={description}
            />
          </div>
          <div className="text-foreground leading-relaxed">
            {value ? (
              <div className="text-base font-medium">{displayValue}</div>
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
};

interface SalaryInfoItemProps {
  label: string;
  salary: number;
  unit: string;
  loading: boolean;
  control: Control<EditProfileSchema>;
  onSubmit: () => void;
  icon: React.ReactNode;
}

const SalaryInfoItem = ({
  label,
  salary,
  unit,
  loading,
  control,
  onSubmit,
  icon,
}: SalaryInfoItemProps) => (
  <div className="group py-6 border-b border-border last:border-b-0">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
          <SalaryEditDialog
            title={`Edit ${label}`}
            currentSalary={salary}
            currentUnit={unit}
            control={control}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
        <div className="text-foreground leading-relaxed">
          {salary && unit ? (
            <div className="text-xl font-medium">
              {unit} {salary.toLocaleString()}
            </div>
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

export const TechnicalInfoSection = ({
  control,
  loading,
  data,
  onUpdate,
}: TechnicalInfoSectionProps) => {
  const paypalOptions = [
    { value: "yes", label: "Yes, I have PayPal" },
    { value: "no", label: "No, I don't have PayPal" },
  ];

  return (
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Technical Setup
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Your work environment and technical specifications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <SalaryInfoItem
            label="Desired Salary"
            salary={data.desiredSalary || 0}
            unit={data.salaryUnit || ""}
            loading={loading}
            control={control}
            onSubmit={onUpdate}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
          />
          <SimpleInfoItem
            label="Internet Provider"
            value={data.internetProvider || ""}
            placeholder="e.g., Comcast Xfinity 100 Mbps"
            loading={loading}
            fieldName="internetProvider"
            control={control}
            onSubmit={onUpdate}
            icon={<Wifi className="w-4 h-4 text-muted-foreground" />}
            description="What is your Internet Service Provider? Please include the plan details."
          />

          <SimpleInfoItem
            label="Number of Monitors"
            value={data.numberOfMonitors || ""}
            placeholder="1"
            loading={loading}
            fieldName="numberOfMonitors"
            control={control}
            onSubmit={onUpdate}
            icon={<Monitor className="w-4 h-4 text-muted-foreground" />}
            type="number"
            min={1}
            max={10}
          />

          <SimpleInfoItem
            label="Years of Work Experience"
            value={data.numberOfExperience || ""}
            placeholder="5"
            loading={loading}
            fieldName="numberOfExperience"
            control={control}
            onSubmit={onUpdate}
            icon={<Clock className="w-4 h-4 text-muted-foreground" />}
            type="number"
            min={0}
            max={50}
          />

          <SelectInfoItem
            label="PayPal Account Status"
            value={data.hasPaypal || ""}
            loading={loading}
            fieldName="hasPaypal"
            control={control}
            onSubmit={onUpdate}
            icon={<CreditCard className="w-4 h-4 text-muted-foreground" />}
            options={paypalOptions}
            description="We pay via PayPal. Do you have a PayPal account?"
          />

          <SimpleInfoItem
            label="Number of Children"
            value={data.numberOfChildren || ""}
            placeholder="0"
            loading={loading}
            fieldName="numberOfChildren"
            control={control}
            onSubmit={onUpdate}
            icon={<Baby className="w-4 h-4 text-muted-foreground" />}
            type="number"
            min={0}
            max={20}
          />
        </div>
      </CardContent>
    </Card>
  );
};
