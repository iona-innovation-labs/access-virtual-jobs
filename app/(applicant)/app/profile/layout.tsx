import { ReactNode } from "react";
import { Metadata } from "next";
import { ProfileTabProvider } from "@/context/profile-tab-context";
import { ProfileDetailsProvider } from "@/context/profile-details-context";
import { ProfileFilesProvider } from "@/context/profile-files-context";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Edit your universal profile that you will use to apply for jobs",
};

interface LayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: LayoutProps) {
  return (
    <ProfileTabProvider>
      <ProfileDetailsProvider>
        <ProfileFilesProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="py-12 flex items-start justify-start">
              {children}
            </div>

            {/* Help Section */}
            <div className="bg-white border-t border-gray-200 mt-16">
              <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-start justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Need Help?
                      </h3>
                      <p className="text-blue-800 text-sm leading-relaxed mb-3">
                        Take your time to complete your profile accurately. A
                        complete profile increases your chances of being
                        selected for job opportunities.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-blue-700">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Complete all required fields
                        </div>
                        <div className="flex items-center text-blue-700">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Upload all required documents
                        </div>
                        <div className="flex items-center text-blue-700">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Review before submitting
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ProfileFilesProvider>
      </ProfileDetailsProvider>
    </ProfileTabProvider>
  );
}
