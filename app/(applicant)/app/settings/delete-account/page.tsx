"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/services/fetch-api";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Form schema for account deletion request - reason is now required
const deleteAccountSchema = z.object({
  reason: z.string().min(1, "Please select a reason for deletion"),
  feedback: z
    .string()
    .max(1000, "Feedback must be less than 1000 characters")
    .optional(),
});

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

interface DeleteRequest {
  id: string;
  userId: string;
  reason: string | null;
  feedback: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

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

const statusLabels = {
  inprogress: "In Progress",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};

const statusColors = {
  inprogress: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-gray-100 text-zinc-800 border-gray-200",
};

export default function DeleteAccount() {
  const session = useSession();
  const user = session?.data?.user;
  const [loading, setLoading] = useState(false);
  const [fetchingRequest, setFetchingRequest] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [existingRequest, setExistingRequest] = useState<DeleteRequest | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      reason: "",
      feedback: "",
    },
  });

  // Fetch existing delete request on component mount
  useEffect(() => {
    const fetchDeleteRequest = async () => {
      if (!user) return;

      setFetchingRequest(true);
      try {
        const response = await fetchApi<{
          deleteRequest: DeleteRequest | null;
          ok: boolean;
        }>("/auth/delete-account", {
          method: "GET",
        });

        if (response.ok && response.deleteRequest) {
          setExistingRequest(response.deleteRequest);
        }
      } catch (error) {
        console.error("Error fetching delete request:", error);
      } finally {
        setFetchingRequest(false);
      }
    };

    fetchDeleteRequest();
  }, [user]);

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

        // Refresh the existing request data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

  const handleSubmitClick = () => {
    // Trigger form validation before opening dialog
    form.handleSubmit(() => {
      setIsDialogOpen(true);
    })();
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl shadow-sm border-0">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Authentication Required
          </h3>
          <p className="text-muted-foreground">
            Please sign in to access account settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (fetchingRequest) {
    return (
      <Card className="w-full shadow-sm border-0">
        <CardContent className="p-8 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading account deletion status...
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
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Request Submitted Successfully
            </h3>
            <p className="text-muted-foreground mb-6">
              Your account deletion request has been sent to our support team.
              You should receive a confirmation email shortly with next steps.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>What happens next:</strong>
                <br />
                • Our support team will review your request within 2-3 business
                days
                <br />• You&apos;ll receive updates via email at {user.email}
                <br />• All your data will be permanently deleted once processed
              </p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Back to Account Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show existing request if one exists
  if (existingRequest) {
    const reasonLabel =
      deletionReasons.find((r) => r.value === existingRequest.reason)?.label ||
      existingRequest.reason;

    return (
      <div className="w-full mx-auto space-y-6">
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Account Deletion Request
                </h2>
                <p className="text-sm text-muted-foreground">
                  You have a pending deletion request
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Request Details</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[existingRequest.status as keyof typeof statusColors]}`}
              >
                {
                  statusLabels[
                    existingRequest.status as keyof typeof statusLabels
                  ]
                }
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Request ID
                </p>
                <p className="text-sm text-foreground font-mono">
                  {existingRequest.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Submitted
                </p>
                <p className="text-sm text-foreground">
                  {new Date(existingRequest.createdAt).toLocaleDateString()} at{" "}
                  {new Date(existingRequest.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {existingRequest.reason && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Reason
                </p>
                <p className="text-sm text-foreground">{reasonLabel}</p>
              </div>
            )}

            {existingRequest.feedback && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Additional Feedback
                </p>
                <p className="text-sm text-foreground bg-muted p-3 rounded-lg">
                  {existingRequest.feedback}
                </p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    What happens next:
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>
                      • Our support team will review your request within 2-3
                      business days
                    </li>
                    <li>
                      • You&apos;ll receive updates via email at {user.email}
                    </li>
                    <li>
                      • All your data will be permanently deleted once processed
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-card">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  Need Help?
                </h4>
                <p className="text-sm text-muted-foreground">
                  If you have questions about your deletion request or need to
                  make changes, contact our support team at{" "}
                  <strong>support@accessvirtualstaffing.com</strong> with your
                  request ID.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show the form if no existing request
  return (
    <div className="w-full mx-auto space-y-6">
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Delete Account
              </h2>
              <p className="text-sm text-muted-foreground">
                Permanently remove your account and data
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="shadow-sm border-0 bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-3 h-3 text-muted-foreground" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                Privacy & Security
              </h4>
              <p className="text-sm text-muted-foreground">
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
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-foreground">
              Deletion Request Process
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  How it works:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
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

          <div className="border border-border rounded-lg p-6">
            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-2">
                Submit Deletion Request
              </h4>
              <p className="text-sm text-muted-foreground">
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
                      <FormLabel>
                        Reason for deletion{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                  <Button
                    type="button"
                    variant="destructive"
                    className="text-white"
                    onClick={handleSubmitClick}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Submit Deletion Request
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will submit a request to permanently delete your account (
              {user.email}) and all associated data. Our support team will
              process this request within 2-3 business days. This action cannot
              be undone once processed.
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
  );
}
