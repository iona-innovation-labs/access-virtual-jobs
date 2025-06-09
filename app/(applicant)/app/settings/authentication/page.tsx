"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Key,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { signOut, useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  PasswordStrengthChecker,
  defaultPasswordRequirements,
} from "@/components/auth/password/password-strength-checker";
import { passwordSchema } from "@/lib/validation/password-validation";

const changePasswordFormSchema = z
  .object({
    oldPassword: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

export default function ChangePassword() {
  const session = useSession();
  const user = session?.data?.user;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [formError, setFormError] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Watch password field for strength validation
  const watchedPassword = form.watch("password");

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

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setLoading(true);

    try {
      const response = await fetchApi<any>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: data.oldPassword || "",
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      console.log(response.internalMessage);

      if (response.ok) {
        toast({
          title: "Password Changed Successfully",
          description:
            "You will be logged out for security. Please sign in again.",
          variant: "success",
        });

        // Reset form
        form.reset();
        signOut();
        // Redirect after a delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error: any) {
      setFormError(error.internalMessage);
      toast({
        title: "Password Change Failed",
        description:
          error?.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="w-full mx-auto space-y-6">
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

      <Alert className="border-blue-200 bg-blue-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          If you signed up with a social account and don&apos;t have a password
          yet, leave the &quot;Current Password&quot; field empty.
        </AlertDescription>
      </Alert>

      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <Key className="w-3 h-3 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Change Password</h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {formError && <p className="text-red-500">{formError}</p>}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Current Password (leave empty if you don&apos;t have one)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPasswords.old ? "text" : "password"}
                          placeholder="Enter current password (optional for social login users)"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility("old")}
                        >
                          {showPasswords.old ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPasswords.new ? "text" : "password"}
                          placeholder="Enter new password"
                          onFocus={() => setShowPasswordRequirements(true)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />

                    <PasswordStrengthChecker
                      password={watchedPassword}
                      requirements={defaultPasswordRequirements}
                      isVisible={showPasswordRequirements}
                      showOverallStatus={true}
                      overallStatusLabel="At least 3 requirements satisfied"
                      minRequiredChecks={3}
                      variant="default"
                      className="mt-2"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPasswords.confirm ? "text" : "password"}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Important Information:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • If you don&apos;t have a current password (social
                        login), leave that field empty
                      </li>
                      <li>
                        • You&apos;ll be logged out of all devices for security
                        after changing
                      </li>
                      <li>
                        • Setting a password allows you to sign in with
                        email/password or social login
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !form.formState.isValid}
                  className="bg-brand hover:bg-brand-dark text-white min-w-[200px]"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

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
                For your security, you&apos;ll be logged out of all devices
                after changing your password. This ensures only you have access
                to your account with the new credentials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
