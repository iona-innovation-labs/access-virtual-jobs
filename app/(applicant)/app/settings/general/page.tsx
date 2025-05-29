"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { fetchApi } from "@/services/fetch-api";
import { User, Upload, Settings, Camera, AlertCircle } from "lucide-react";

import { useUserInfo } from "@/hooks/use-user-info";
import {
  generalSchema,
  GeneralSchema,
} from "@/lib/validation/general-settings-form-validation";

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Image from "next/image";

export default function GeneralSettings() {
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { toast } = useToast();

  const { userInfo, error, isLoading } = useUserInfo();

  const form = useForm<GeneralSchema>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
    },
  });

  React.useEffect(() => {
    if (userInfo) {
      form.reset({
        ...userInfo,
        username: userInfo?.username || "",
      });
    }
  }, [userInfo, form]);

  const onSubmit = async (formData: GeneralSchema) => {
    setSubmitting(true);
    try {
      // TODO: infer the type of response
      const response = await fetchApi<any>("/settings/general", {
        method: "POST",
        body: JSON.stringify(formData),
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
        description: "Failed to update general settings. Please try again.",
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
          // TODO: Pass the public id it can be used to replace existing image in cloudinary
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
      <Card className="w-full max-w-2xl shadow-sm border-0">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-gray-600">
            Failed to load your profile information. Please refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl shadow-sm border-0">
        <CardContent className="p-8">
          <LoadingSpinner size="lg" />
          <p className="text-center text-gray-500 mt-4">
            Loading your profile...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header Card */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                General Settings
              </h2>
              <p className="text-sm text-gray-500">
                Manage your personal information
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Photo Card */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Camera className="w-3 h-3 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Profile Photo</h3>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {userInfo?.image ? (
                <Image
                  src={userInfo.image}
                  alt="Profile Photo"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  width={80}
                  height={80}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center border-2 border-brand/20">
                  <User className="w-8 h-8 text-brand" />
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <LoadingSpinner size="sm" className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                Update Profile Photo
              </h4>
              <p className="text-sm text-gray-500 mb-4">
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

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Photo Guidelines:</strong> Use a clear, professional
                  headshot. Avoid group photos, sunglasses, or inappropriate
                  content.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card className="shadow-sm border-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <User className="w-3 h-3 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your first name"
                          disabled={submitting}
                          className="border-gray-300 focus:border-brand focus:ring-brand"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your last name"
                          disabled={submitting}
                          className="border-gray-300 focus:border-brand focus:ring-brand"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        disabled={submitting}
                        className="border-gray-300 focus:border-brand focus:ring-brand"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Choose a unique username"
                        disabled={submitting}
                        className="border-gray-300 focus:border-brand focus:ring-brand"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
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
