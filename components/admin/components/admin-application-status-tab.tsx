"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobRichTextEditor } from "./job-rich-text-editor";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getProgressReadableText } from "@/lib/get-progress";
import { Progress, Status } from "@/types/jobs";
import { Mail, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AdminApplicationStatusTabProps = {
  jobApplication: {
    id: number;
    applicationPublicId: string;
    status: string;
    progress: string;
    user?: {
      id: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      image?: string;
      phoneNumber?: string;
      countryOfResidence?: string;
      gender?: string;
      dateOfBirth?: Date;
      role?: string;
      isPhoneVerified?: boolean;
      isEmailVerified?: boolean;
    };
    profile?: any;
  };
};

const AdminApplicationStatusTab = ({
  jobApplication,
}: AdminApplicationStatusTabProps) => {
  const [currentProgress, setCurrentProgress] = useState<Progress>(
    jobApplication.progress as Progress
  );
  const [currentStatus, setCurrentStatus] = useState<Status>(
    jobApplication.status as Status
  );
  const [emailMessage, setEmailMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const progressOptions: { value: Progress; label: string }[] = [
    { value: "in_review", label: "In Review" },
    { value: "reviewed", label: "Reviewed" },
    {
      value: "declined_initial_interview",
      label: "Declined - Initial Interview",
    },
    { value: "initial_interview", label: "Initial Interview" },
    { value: "for_client_interview", label: "For Client Interview" },
    { value: "declined_after_interview", label: "Declined - After Interview" },
    { value: "make_offer", label: "Make Offer" },
    { value: "hired_signed", label: "Hired & Signed" },
    { value: "endorsed", label: "Endorsed" },
    {
      value: "reserved_for_future_opening",
      label: "Reserved for Future Opening",
    },
  ];

  const statusOptions: { value: Status; label: string }[] = [
    { value: "on_going", label: "Active" },
    { value: "archived", label: "Archived" },
  ];

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/admin/job-applications/${jobApplication.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: currentStatus,
            progress: currentProgress,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Status Updated",
          description:
            "Application status and progress have been updated successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.message || "Failed to update application status.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `An error occurred while updating the status. ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    if (!jobApplication.user?.email) {
      toast({
        title: "Email Not Available",
        description: "Applicant email address is not available.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/admin/send-email-to-applicant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicantEmail: jobApplication.user.email,
          applicantName:
            `${jobApplication.user.firstName || ""} ${jobApplication.user.lastName || ""}`.trim() ||
            jobApplication.user.username ||
            "Applicant",
          message: emailMessage,
          applicationId: jobApplication.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Email Sent",
          description:
            "Your message has been sent to the applicant successfully.",
        });
        setEmailMessage("");
      } else {
        toast({
          title: "Email Failed",
          description: result.message || "Failed to send email to applicant.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `An error occurred while sending the email. ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const hasChanges =
    currentProgress !== jobApplication.progress ||
    currentStatus !== jobApplication.status;

  return (
    <div className="space-y-6">
      {/* Current Status Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Current Application Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge
                variant={
                  jobApplication.status === "on_going" ? "default" : "secondary"
                }
                className={cn(
                  "ml-2",
                  jobApplication.status === "on_going"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                )}
              >
                {jobApplication.status === "on_going" ? "Active" : "Archived"}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Progress</Label>
              <span className="ml-2 text-sm font-medium">
                {getProgressReadableText(jobApplication.progress)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Application Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Application Status</Label>
              <Select
                value={currentStatus}
                onValueChange={(value: Status) => setCurrentStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Application Progress</Label>
              <Select
                value={currentProgress}
                onValueChange={(value: Progress) => setCurrentProgress(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select progress" />
                </SelectTrigger>
                <SelectContent>
                  {progressOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasChanges && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes. Click &quot;Update Status&quot; to
                save your changes.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleUpdateStatus}
            disabled={!hasChanges || isUpdating}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </CardContent>
      </Card>

      {/* Email Applicant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Applicant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-message">Message to Applicant</Label>
            <JobRichTextEditor
              value={emailMessage}
              onChange={setEmailMessage}
              placeholder="Enter your message to the applicant..."
              className="min-h-32"
            />
            <p className="text-sm text-muted-foreground">
              This message will be sent to:{" "}
              {jobApplication.user?.email || "No email available"}
            </p>
          </div>

          <Button
            onClick={handleSendEmail}
            disabled={
              !emailMessage.trim() ||
              isSendingEmail ||
              !jobApplication.user?.email
            }
            className="w-full md:w-auto"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSendingEmail ? "Sending..." : "Send Email"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApplicationStatusTab;
