"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { useUserInfo } from "@/hooks/use-user-info";
import {
  Bell,
  BellRing,
  Briefcase,
  FileText,
  AlertCircle,
  Settings,
  Mail,
} from "lucide-react";

import {
  notificationSchema,
  NotificationSchema,
} from "@/lib/validation/notification-settings-form-validation";

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
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function NotificationSettings() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { userInfo, error: userInfoError, isLoading } = useUserInfo();

  const form = useForm<NotificationSchema>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      jobRecommendation: false,
      jobSubmission: false,
    },
  });

  React.useEffect(() => {
    if (userInfo) {
      form.reset({
        jobRecommendation: userInfo.jobRecommendationNotifPref === "enabled",
        jobSubmission: userInfo.jobSubmissionNotifPref === "enabled",
      });
    }
  }, [userInfo, form]);

  const onSubmit = async (formData: NotificationSchema) => {
    setSubmitting(true);
    try {
      //  TODO: Infer the return type def of fetchApi here
      const response = await fetchApi<any>("/settings/notifications", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error("Failed to update notification preferences");

      toast({
        title: "Notifications Updated",
        description:
          "Your notification preferences have been saved successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast({
        title: "Update Failed",
        description:
          "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (userInfoError) {
    return (
      <Card className="w-full max-w-2xl shadow-sm border-0">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Settings
          </h3>
          <p className="text-gray-600">
            Failed to load your notification preferences. Please refresh the
            page.
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
            Loading notification settings...
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
              <Bell className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Notification Settings
              </h2>
              <p className="text-sm text-gray-500">
                Manage how you receive updates
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Settings Card */}
      <Card className="shadow-sm border-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-3 h-3 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Job Notifications</h3>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Choose which job-related notifications you&apos;d like to receive
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              {/* Job Recommendation Setting */}
              <FormField
                control={form.control}
                name="jobRecommendation"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <BellRing className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <FormLabel className="text-base font-medium text-gray-900 cursor-pointer">
                            Job Recommendations
                          </FormLabel>
                          <p className="text-sm text-gray-500 mt-1">
                            Get notified when we find jobs that match your
                            profile and preferences
                          </p>
                          <div className="flex items-center space-x-1 mt-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Via email
                            </span>
                          </div>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={submitting}
                          className="data-[state=checked]:bg-brand"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Job Submission Setting */}
              <FormField
                control={form.control}
                name="jobSubmission"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <FormLabel className="text-base font-medium text-gray-900 cursor-pointer">
                            Application Updates
                          </FormLabel>
                          <p className="text-sm text-gray-500 mt-1">
                            Receive updates about your job applications and
                            submission status
                          </p>
                          <div className="flex items-center space-x-1 mt-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Via email
                            </span>
                          </div>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={submitting}
                          className="data-[state=checked]:bg-brand"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </Form>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Settings className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Notification Preferences
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    You can change these settings at any time. All notifications
                    will be sent to your registered email address. Make sure to
                    check your spam folder if you don&apos;t receive emails.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-6 bg-gray-50">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500">
                Changes will take effect immediately
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-brand hover:bg-brand-dark text-white min-w-[180px]"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Additional Info Card */}
      <Card className="shadow-sm border-0 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-3 h-3 text-gray-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Privacy Notice
              </h4>
              <p className="text-sm text-gray-600">
                We respect your privacy and will only send notifications
                you&apos;ve opted into. You can unsubscribe from any email
                notifications at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
