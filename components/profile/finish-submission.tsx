"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  FileCheck,
  ArrowRight,
  AlertCircle,
  Calendar,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/hooks/use-user-info";
import { useProfileTabContext } from "@/context/profile-tab-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const FinishSubmission = () => {
  const { userInfo, isLoading, error } = useUserInfo();
  const { jobSubmissionId } = useProfileTabContext();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full p-4">
        <Card className="p-8 text-center shadow-sm border-0">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Loading your information...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full p-4">
        <Card className="p-8 text-center shadow-sm border-0 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load
          </h3>
          <p className="text-gray-600 mb-4">Error fetching user information.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full space-y-6">
        {/* Success Header */}
        <Card className="shadow-sm border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Application Submitted Successfully!
            </h1>

            <p className="text-lg text-gray-600">
              Great job,{" "}
              <span className="font-semibold text-brand">
                {userInfo?.firstName || "there"}
              </span>
              ! Your application is now with the employer.
            </p>
          </div>
        </Card>

        {/* Status Information */}
        <Card className="shadow-sm border-0">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  What happens next?
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>
                      Your application has been received by the employer
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>
                      The hiring team will review your profile and documents
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>
                      You&apos;ll receive updates on your application status
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* View Application */}
          <Card
            className="shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => router.push(`/app/submissions/v/${jobSubmissionId}`)}
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand/20 transition-colors">
                <Eye className="w-6 h-6 text-brand" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                View Application
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                See your submitted application details and track its progress
              </p>
              <Button
                className="bg-brand hover:bg-brand-dark text-white w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/app/submissions/v/${jobSubmissionId}`);
                }}
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Browse More Jobs */}
          <Card
            className="shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => router.push("/app/jobs")}
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Explore More Jobs
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Continue your job search and find more opportunities
              </p>
              <Button
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/app/jobs");
                }}
              >
                Browse Jobs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="shadow-sm border-0 bg-blue-50 border-blue-200">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Keep Your Profile Updated
                </h4>
                <p className="text-sm text-blue-800">
                  Make sure your profile stays current for future applications.
                  You can update your information anytime from your profile
                  settings.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinishSubmission;
