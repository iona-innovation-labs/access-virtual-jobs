"use client";

import { useState } from "react";
import { Key, Mail, Shield, AlertTriangle } from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ChangePassword() {
  const session = useSession();
  const user = session?.data?.user;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!user) {
    return (
      <Card className="w-full max-w-2xl shadow-sm border-0">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600">
            Please sign in to access password settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      // TODO: Infer the real type of response of the fetchApi
      // @typescript-eslint/no-explicit-any
      const response = await fetchApi<any>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      console.log(response);
      if (response.ok) {
        toast({
          title: "Password Reset Sent",
          description: "Check your email for password reset instructions!",
          variant: "success",
        });

        setTimeout(() => {
          window.location.href = "/api/auth/logout";
        }, 2000);
      }
      // @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error sending password reset email:", { error });

      toast({
        title: "Reset Failed",
        description:
          error?.internalMessage ||
          error?.publicMessage ||
          "Failed to request password change. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header Card */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Password Settings
              </h2>
              <p className="text-sm text-gray-500">
                Manage your account security
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Password Reset Card */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              <Mail className="w-3 h-3 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Reset Password via Email
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  How it works:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• We&apos;ll send a secure reset link to your email</li>
                  <li>• Click the link to create a new password</li>
                  <li>• You&apos;ll be logged out for security</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email Address</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Click the button below to receive a password reset email.
            You&apos;ll be automatically logged out after the email is sent for
            security purposes.
          </p>
        </CardContent>

        <CardFooter className="pt-4">
          <Button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-brand hover:bg-brand-dark text-white min-w-[200px]"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Sending Email...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Reset Email
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Security Notice */}
      <Card className="shadow-sm border-0 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-3 h-3 text-gray-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Security Notice
              </h4>
              <p className="text-sm text-gray-600">
                For your security, we&apos;ll log you out of all devices after
                sending the reset email. Make sure you have access to your email
                before proceeding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="font-semibold text-gray-700">
          Settings / Authentication
        </CardHeader>

        <CardContent className="space-y-8">
          <Form {...form}>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm text-gray-700">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current Password"
                        className="border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                      >
                        {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm text-gray-700">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-sm text-gray-700">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        className="border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmNewPassword((prev) => !prev)
                        }
                      >
                        {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </Form>
        </CardContent>

        <CardFooter className="flex justify-strart space-x-2">
          <Button
            type="submit"
            variant="default"
            className="bg-deepBlue text-white min-w-[150px] my-4"
          >
            Update Password
          </Button>
        </CardFooter>
      </form>
      */}
    </div>
  );
}
