import React, { useState, useEffect, useMemo } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
  FieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Plus,
  Trash2,
  User,
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
const ContactInformationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  whatsappId: z.string().min(1, "WhatsApp is required"),
  phones: z.array(
    z.object({
      number: z.string().min(1, "Phone number is required"),
      type: z.string().min(1, "Phone type is required"),
    })
  ),
  emails: z.array(
    z.object({
      address: z.string().email("Invalid email format"),
      type: z.string().min(1, "Email type is required"),
    })
  ),
});

type ContactInformationFormData = z.infer<typeof ContactInformationSchema>;

interface ContactInformationProps {
  loading?: boolean;
  initialData?: Partial<ContactInformationFormData>;
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

const PhoneTypeOptions = [
  { value: "mobile", label: "Mobile" },
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

const EmailTypeOptions = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

export const ContactInformationSection = ({
  loading = false,
  initialData = {},
}: ContactInformationProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<
    Partial<ContactInformationFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(
    (): ContactInformationFormData => ({
      address: "",
      whatsappId: "",
      phones: [{ number: "", type: "mobile" }],
      emails: [{ address: "", type: "personal" }],
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
  } = useForm<ContactInformationFormData>({
    resolver: zodResolver(ContactInformationSchema),
    defaultValues,
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "phones",
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: "emails",
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
  const onSubmit: SubmitHandler<ContactInformationFormData> = async (data) => {
    console.log("saving...");
    setIsSubmitting(true);
    try {
      // Filter out empty phone numbers and emails
      const cleanedData = {
        ...data,
        phones: data.phones.filter((item) => item.number.trim() !== ""),
        emails: data.emails.filter((item) => item.address.trim() !== ""),
      };

      console.log(cleanedData);

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
          title: "Contact Information Updated",
          description: `Successfully updated: ${result.updatedFields?.join(", ") || "contact information"}`,
          variant: "success",
        });
      } else {
        throw new Error(result.message || "Failed to save contact information");
      }
    } catch (error) {
      console.error("Error saving contact information:", error);
      toast({
        title: "Error Saving Information",
        description: "Failed to save contact information. Please try again.",
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
              <User className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Contact Information
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your personal contact details and communication preferences
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Grid for basic fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Address */}
              <InfoItem
                label="Address"
                icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                description="Your current residential address "
              >
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        placeholder="e.g., 123 Main St, City, Province, ZIP"
                        disabled={loading || isSubmitting}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      <div className="bg-muted/50 mt-2  rounded-sm p-1 text-foreground/50 px-2">
                        {/* <p className="text-xs text-muted-foreground">
                          This needs to be similar to the Address Verification
                          image you are going to upload ()
                        </p> */}
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </InfoItem>

              {/* WhatsApp */}
              <InfoItem
                label="WhatsApp"
                icon={
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                }
                description="Your Whatsapp username for video calls"
              >
                <Controller
                  name="whatsappId"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        placeholder="+639 123 456 789"
                        disabled={loading || isSubmitting}
                        className={errors.whatsappId ? "border-red-500" : ""}
                      />
                      {errors.whatsappId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.whatsappId.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </InfoItem>
            </div>

            {/* Phone Numbers */}
            <InfoItem
              label="Phone Numbers"
              icon={<Phone className="w-4 h-4 text-muted-foreground" />}
              description="Add your phone numbers for different purposes"
            >
              <div className="space-y-4">
                {phoneFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <Controller
                      name={`phones.${index}.number`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex-1">
                          <Input
                            {...field}
                            placeholder="e.g., +63 912 345 6789"
                            disabled={loading || isSubmitting}
                            className={
                              errors.phones?.[index]?.number
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors.phones?.[index]?.number && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.phones[index]?.number?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      name={`phones.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <div className="w-32">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={loading || isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PhoneTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.phones?.[index]?.type && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                (errors.phones[index]?.type as FieldError)
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
                      )}
                    />
                    {phoneFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePhone(index)}
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
                  onClick={() => appendPhone({ number: "", type: "mobile" })}
                  disabled={loading || isSubmitting}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Phone Number
                </Button>
              </div>
            </InfoItem>

            {/* Email Addresses */}
            <InfoItem
              label="Email Addresses"
              icon={<Mail className="w-4 h-4 text-muted-foreground" />}
              description="Add your email addresses for different purposes"
            >
              <div className="space-y-4">
                {emailFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <Controller
                      name={`emails.${index}.address`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex-1">
                          <Input
                            {...field}
                            type="email"
                            placeholder="e.g., john@example.com"
                            disabled={loading || isSubmitting}
                            className={
                              errors.emails?.[index]?.address
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors.emails?.[index]?.address && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.emails[index]?.address?.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      name={`emails.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <div className="w-32">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={loading || isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {EmailTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.emails?.[index]?.type && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                (errors.emails[index]?.type as FieldError)
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
                      )}
                    />
                    {emailFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmail(index)}
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
                  onClick={() => appendEmail({ address: "", type: "personal" })}
                  disabled={loading || isSubmitting}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Email Address
                </Button>
              </div>
            </InfoItem>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">📞 Contact Information Tips:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>• Use international format for phone numbers</p>
                <p>• Add multiple contact methods for flexibility</p>
                <p>• Ensure WhatsApp is active</p>
                <p>• Primary email should be professional</p>
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

export { ContactInformationSchema };
export type { ContactInformationFormData };
