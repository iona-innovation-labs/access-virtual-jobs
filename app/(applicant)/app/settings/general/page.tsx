"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { fetchApi } from "@/services/fetch-api";
import {
  User,
  Upload,
  Settings,
  Camera,
  AlertCircle,
  CalendarDays,
  CalendarIcon,
} from "lucide-react";
import { z } from "zod";
import { Country } from "country-state-city";

import { useUserInfo } from "@/hooks/use-user-info";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Image from "next/image";
import PlaceholderAvatar from "@/components/avatar";
// Updated schema with new fields
const generalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().optional(),
  gender: z.string().optional(),
  countryOfResidence: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

// Keep the original type structure for API compatibility
type GeneralSchema = z.infer<typeof generalSchema> & {
  email: string;
};

// Countries dropdown options
const countries = Country.getAllCountries().map((country) => ({
  value: country.name,
  label: country.name,
  code: country.isoCode,
}));

// Gender options
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not_to_say", label: "Rather not specify" },
];

export default function GeneralSettings() {
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const { toast } = useToast();

  // Add ref to track if form has been initialized
  const formInitialized = useRef(false);

  const { userInfo, error, isLoading } = useUserInfo();

  const form = useForm<Omit<GeneralSchema, "email">>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      gender: "",
      countryOfResidence: "Philippines",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (userInfo && !formInitialized.current) {
      console.log("Initializing form with USER: ", userInfo);
      const formData = {
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        username: userInfo?.username || "",
        gender: userInfo?.gender || "",
        countryOfResidence: userInfo?.countryOfResidence || "Philippines",
        dateOfBirth: userInfo?.dateOfBirth
          ? new Date(userInfo.dateOfBirth).toISOString().split("T")[0]
          : "",
      };

      form.reset(formData);
      formInitialized.current = true;

      setTimeout(() => {
        setFormReady(true);
      }, 100);
    }
  }, [userInfo, form]);

  const onSubmit = async (formData: Omit<GeneralSchema, "email">) => {
    setSubmitting(true);
    try {
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username || "",
        gender: formData.gender || "",
        countryOfResidence: formData.countryOfResidence || "Philippines",
        dateOfBirth: formData.dateOfBirth || null,
      };

      // TODO: infer the type of response
      const response = await fetchApi<any>("/settings/general", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Failed to update general settings");

      toast({
        title: "Settings Updated",
        description: "Your general settings have been updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating general settings:", error);
      toast({
        title: "Update Failed",
        description:
          error?.internalMessage ||
          "Failed to update general settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (result: CloudinaryUploadWidgetResults) => {
    if (typeof result.info !== "string") {
      const secureUrl = result.info?.secure_url;
      if (secureUrl) {
        setUploadingAvatar(true);
        try {
          await fetchApi("/profile/update-avatar", {
            method: "POST",
            body: JSON.stringify({
              profileImageURL: secureUrl,
            }),
          });

          toast({
            title: "Profile Photo Updated",
            description: "Your profile photo has been updated successfully!",
            variant: "success",
          });

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error("Error updating avatar:", error);
          toast({
            title: "Upload Failed",
            description: "Failed to update profile photo. Please try again.",
            variant: "destructive",
          });
        } finally {
          setUploadingAvatar(false);
        }
      }
    }
  };

  if (error) {
    return (
      <Card className="w-full shadow-sm border-border">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Profile
          </h3>
          <p className="text-muted-foreground">
            Failed to load your profile information. Please refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !formReady) {
    return (
      <Card className="w-full shadow-none border-none">
        <CardContent className="p-8">
          <LoadingSpinner size="lg" />
          <p className="text-center text-muted-foreground mt-4">
            Loading your profile...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                General Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your personal information
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center">
              <Camera className="w-3 h-3 text-brand" />
            </div>
            <h3 className="font-semibold text-foreground">Profile Photo</h3>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {userInfo?.image ? (
                <Image
                  src={userInfo.image}
                  alt="Profile Photo"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  width={80}
                  height={80}
                />
              ) : (
                <PlaceholderAvatar
                  name={
                    `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`.trim() ||
                    "User"
                  }
                  size="xl"
                  className="border-2 border-border"
                />
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <LoadingSpinner size="sm" className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">
                Update Profile Photo
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a professional photo that represents you well
              </p>

              <CldUploadWidget
                options={{
                  sources: ["local", "google_drive", "dropbox", "unsplash"],
                  resourceType: "image",
                  clientAllowedFormats: ["png", "jpg", "jpeg", "gif"],
                  maxFileSize: 10000000, // 10MB
                  cropping: true,
                  croppingAspectRatio: 1,
                }}
                onSuccess={handleAvatarUpload}
                uploadPreset="ProfileImagePreset"
              >
                {({ open }) => (
                  <Button
                    type="button"
                    onClick={() => open()}
                    disabled={submitting || uploadingAvatar}
                    variant="outline"
                    className="border-brand/20 text-brand hover:bg-brand/5"
                  >
                    {uploadingAvatar ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {userInfo?.profileImage
                          ? "Replace Photo"
                          : "Upload Photo"}
                      </>
                    )}
                  </Button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong>Photo Guidelines:</strong> Use a clear, professional
                  headshot. Avoid group photos, sunglasses, or inappropriate
                  content.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <User className="w-3 h-3 text-success" />
              </div>
              <h3 className="font-semibold text-foreground">
                Personal Information
              </h3>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your first name"
                          disabled={submitting}
                          className="border-border focus:border-brand focus:ring-brand"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your last name"
                          disabled={submitting}
                          className="border-border focus:border-brand focus:ring-brand"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Choose a unique username"
                          disabled={submitting}
                          className="border-border focus:border-brand focus:ring-brand"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Gender
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={submitting}
                      >
                        <FormControl>
                          <SelectTrigger className="border-border w-full focus:border-brand focus:ring-brand">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="countryOfResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Country of Residence
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={submitting}
                      >
                        <FormControl>
                          <SelectTrigger className="border-border w-full focus:border-brand focus:ring-brand">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {countries.map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.value}
                            >
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The country where you currently reside
                      </FormDescription>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          disabled={submitting}
                          className="border-border focus:border-brand focus:ring-brand"
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </FormControl>
                      <FormDescription>
                        Your date of birth for age verification
                      </FormDescription>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </CardContent>

          <CardFooter className="pt-6">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-brand hover:bg-brand-dark text-white min-w-[150px]"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
