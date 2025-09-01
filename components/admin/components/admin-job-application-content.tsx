"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileText, User } from "lucide-react";
import { IJobApplication } from "@/types/jobs";
import AdminApplicationStatusTab from "./admin-application-status-tab";
import AdminApplicantProfileTab from "./admin-applicant-profile-tab";

type AdminJobApplicationContentProps = {
  jobApplication: IJobApplication & {
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

const AdminJobApplicationContent = ({
  jobApplication,
}: AdminJobApplicationContentProps) => {
  const jobDetails = jobApplication.job;
  if (!jobDetails) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className="mt-6">
      <Card className="shadow-sm border-0">
        <Tabs defaultValue="application-status" className="w-full">
          {/* Enhanced Tab Navigation */}
          <div className="border-b border-border px-6 pt-6">
            <TabsList className="grid w-full max-w-lg grid-cols-2 bg-muted p-1 rounded-lg">
              <TabsTrigger
                value="application-status"
                className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Application Status</span>
              </TabsTrigger>
              <TabsTrigger
                value="applicant-profile"
                className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Applicant Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Descriptions */}
            <div className="mt-4 pb-6">
              <TabsContent value="application-status" className="mt-0">
                <div className="flex flex-col gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-3 h-3 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Application Management
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update application progress and communicate with the
                      applicant
                    </p>
                  </div>
                  <div>
                    <AdminApplicationStatusTab
                      jobApplication={jobApplication}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="applicant-profile" className="mt-0">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        Applicant Information
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        View complete applicant profile and submitted
                        information
                      </p>
                    </div>
                  </div>
                  <div>
                    <AdminApplicantProfileTab jobApplication={jobApplication} />
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>

          {/* Tab Content */}
          {/* <div className="p-6">
            <TabsContent value="application-status" className="mt-0">
              <AdminApplicationStatusTab jobApplication={jobApplication} />
            </TabsContent>

            <TabsContent value="applicant-profile" className="mt-0">
              <AdminApplicantProfileTab jobApplication={jobApplication} />
            </TabsContent>
          </div> */}
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminJobApplicationContent;
