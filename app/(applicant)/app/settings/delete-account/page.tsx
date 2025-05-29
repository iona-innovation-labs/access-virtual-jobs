"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  AlertTriangle,
  Mail,
  Shield,
  ExternalLink,
  Clock,
} from "lucide-react";

export default function DeleteAccount() {
  const handleEmailSupport = () => {
    const subject = encodeURIComponent("Account Deletion Request");
    const body = encodeURIComponent(`Hello Support Team,

I would like to request the deletion of my account.

Account Details:
- Email: [Your registered email]
- Username: [Your username]
- Reason for deletion: [Optional - please specify]

Please confirm the deletion process and timeline.

Thank you.`);

    window.location.href = `mailto:support@accessvirtualstaffing.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header Card */}
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

      <Card className="shadow-sm border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-3 h-3 text-blue-600" />
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
                    Send an email to our support team with your deletion request
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.</span>
                    Our team will verify your identity and process the request
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">3.</span>
                    You'll receive confirmation once your account has been
                    deleted
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-gray-600" />
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">
                Contact Support for Account Deletion
              </h4>

              <p className="text-gray-600 text-sm mb-6">
                Send us an email with your account deletion request. Include
                your account details and reason for deletion to help us process
                your request quickly.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    support@accessvirtualstaffing.com
                  </span>
                </div>
              </div>

              <Button
                onClick={handleEmailSupport}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Deletion Request
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
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
                removed from our systems within 30 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
