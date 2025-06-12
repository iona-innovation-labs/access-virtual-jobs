"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { Mail, Settings, AlertCircle, Shield, CheckCircle } from "lucide-react";
import { z } from "zod";

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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Email update schema - only email field needed
const emailUpdateSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Keep the original API type structure for compatibility
type EmailUpdateSchema = z.infer<typeof emailUpdateSchema>;
type APIRequestType = {
  email: string;
};

export default function EmailSettings() {
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { toast } = useToast();

  const { userInfo, error, isLoading } = useUserInfo();

  const form = useForm<EmailUpdateSchema>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      email: "",
    },
  });

  React.useEffect(() => {
    if (userInfo) {
      console.log(userInfo);
      form.reset({
        email: userInfo.email || "",
      });
    }
  }, [userInfo, form]);

  const onSubmit = async (formData: EmailUpdateSchema) => {
    setSubmitting(true);
    try {
      // Maintain the exact same API request structure as the original general settings
      const requestData: APIRequestType = {
        email: formData.email, // Only this changes
      };

      console.log(requestData);

      const response = await fetchApi<any>("/settings/general", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Failed to update email address");

      toast({
        title: "Email Updated",
        description:
          "Your email address has been updated successfully! Please check your new email for verification.",
        variant: "success",
      });

      setUpdateSuccess(true);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Update Failed",
        description:
          error?.internalMessage ||
          "Failed to update email address. Please check your password and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  if (isLoading) {
    return (
      <Card className="w-full shadow-sm border-border">
        <CardContent className="p-8">
          <LoadingSpinner size="lg" />
          <p className="text-center text-muted-foreground mt-4">
            Loading your email settings...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (updateSuccess) {
    return (
      <div className="w-full mx-auto space-y-6">
        <Card className="shadow-sm border-border">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Email Updated Successfully
            </h3>
            <p className="text-muted-foreground mb-6">
              Your email address has been updated. Please check your new email
              inbox for a verification email to confirm the change.
            </p>
            <div className="bg-brand/5 border border-brand/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> You may need to sign in again with
                your new email address. Don&apos;t forget to verify your new
                email to ensure uninterrupted service.
              </p>
            </div>
            <Button onClick={() => setUpdateSuccess(false)} variant="outline">
              Back to Email Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Email Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your email address and verification status
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-3 h-3 text-muted-foreground" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                Security & Privacy
              </h4>
              <p className="text-sm text-muted-foreground">
                Your email address is used for account recovery and important
                notifications. Keep it secure and up to date.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Email Status */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
              <Mail className="w-3 h-3 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Current Email</h3>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="font-medium text-foreground">{userInfo?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {userInfo?.isEmailVerified ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-success font-medium">
                        Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-warning" />
                      <span className="text-sm text-warning font-medium">
                        Unverified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!userInfo?.isEmailVerified && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your email address is not verified. Some features may be limited
                until you verify your email.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Update Email Form */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center">
              <Settings className="w-3 h-3 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground">
              Update Email Address
            </h3>
          </div>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Email Update:</strong> Changing your email address will
              require verification of the new email before it becomes active.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      New Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your new email address"
                        disabled={submitting}
                        className="border-border focus:border-brand focus:ring-brand"
                      />
                    </FormControl>
                    <FormDescription>
                      Make sure you have access to this email address as
                      you&apos;ll need to verify it.
                    </FormDescription>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>

        <CardFooter className="pt-6">
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                disabled={submitting || !form.formState.isValid}
                className="bg-brand hover:bg-brand-dark text-white min-w-[150px]"
              >
                <Mail className="w-4 h-4 mr-2" />
                Update Email Address
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Email Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to change your email address from{" "}
                  <strong>{userInfo?.email}</strong> to{" "}
                  <strong>{form.getValues("email")}</strong>?
                  <br />
                  <br />
                  You&apos;ll need to verify the new email address before it
                  becomes active.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={submitting}
                  className="bg-brand hover:bg-brand-dark"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Yes, update email"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
