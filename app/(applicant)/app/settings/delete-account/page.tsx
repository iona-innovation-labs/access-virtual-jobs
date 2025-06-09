"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Trash2,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Form schema for account deletion request
const deleteAccountSchema = z.object({
  reason: z.string().optional(),
  feedback: z
    .string()
    .max(1000, "Feedback must be less than 1000 characters")
    .optional(),
});

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

const deletionReasons = [
  { value: "no_longer_needed", label: "No longer need the service" },
  { value: "found_alternative", label: "Found an alternative solution" },
  { value: "privacy_concerns", label: "Privacy concerns" },
  { value: "too_complicated", label: "Too complicated to use" },
  { value: "poor_experience", label: "Poor user experience" },
  { value: "technical_issues", label: "Technical issues" },
  { value: "cost_concerns", label: "Cost concerns" },
  { value: "other", label: "Other" },
];

export default function DeleteAccount() {
  const session = useSession();
  const user = session?.data?.user;
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      reason: "",
      feedback: "",
    },
  });

  const onSubmit = async (data: DeleteAccountFormValues) => {
    setLoading(true);

    try {
      const response = await fetchApi<any>("/auth/delete-account", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Deletion Request Submitted",
          description:
            "We've received your request. Check your email for confirmation details.",
          variant: "success",
        });

        setRequestSubmitted(true);
        form.reset();
        setIsDialogOpen(false);
      }
    } catch (error: any) {
      console.error("Error submitting deletion request:", { error });

      toast({
        title: "Request Failed",
        description:
          error?.message ||
          "Failed to submit deletion request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl shadow-sm border-0">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600">
            Please sign in to access account settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (requestSubmitted) {
    return (
      <div className="w-full mx-auto space-y-6">
        <Card className="shadow-sm border-0">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Request Submitted Successfully
            </h3>
            <p className="text-gray-600 mb-6">
              Your account deletion request has been sent to our support team.
              You should receive a confirmation email shortly with next steps.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>What happens next:</strong>
                <br />
                • Our support team will review your request within 2-3 business
                days
                <br />• You&apos;ll receive updates via email at {user.email}
                <br />• All your data will be permanently deleted once processed
              </p>
            </div>
            <Button
              onClick={() => setRequestSubmitted(false)}
              variant="outline"
            >
              Back to Account Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Delete Account
              </h2>
              <p className="text-sm text-gray-500">
                Permanently remove your account and data
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Warning:</strong> Account deletion is permanent and cannot be
          undone. All your data will be permanently removed from our systems.
        </AlertDescription>
      </Alert>

      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="w-3 h-3 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Deletion Request Process
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  How it works:
                </h4>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">1.</span>
                    Submit your deletion request using the form below
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.</span>
                    Our support team will verify your identity and process the
                    request
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">3.</span>
                    You&apos;ll receive confirmation once your account has been
                    deleted
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-2">
                Submit Deletion Request
              </h4>
              <p className="text-sm text-gray-600">
                Fill out the form below to submit your account deletion request.
                This will be sent directly to our support team for processing.
              </p>
            </div>

            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for deletion (optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deletionReasons.map((reason) => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Help us improve by letting us know why you&apos;re
                        leaving
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional feedback (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell us more about your experience or how we could improve..."
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum 1000 characters. Your feedback helps us improve.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <AlertDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="text-white">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Submit Deletion Request
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will submit a request to permanently delete your
                          account ({user.email}) and all associated data. Our
                          support team will process this request within 2-3
                          business days. This action cannot be undone once
                          processed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {loading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Submitting...
                            </>
                          ) : (
                            "Yes, submit deletion request"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Form>
          </div>
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
                Privacy & Security
              </h4>
              <p className="text-sm text-gray-600">
                We take your privacy seriously. Account deletion requests are
                processed securely, and all personal data will be permanently
                removed from our systems within 30 days. If you need help with
                your account instead, contact us at{" "}
                <strong>support@accessvirtualstaffing.com</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
