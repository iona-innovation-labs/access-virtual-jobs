"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileText, Briefcase } from "lucide-react";
import { IJobApplication, Status } from "@/types/jobs";
import ApplicationContent from "./tabs/application";
import ApplicationDescription from "./tabs/description";

type JobContentProps = {
  jobApplicationDetails: IJobApplication;
};

const JobContent = ({ jobApplicationDetails }: JobContentProps) => {
  const jobDetails = jobApplicationDetails.job;
  if (!jobDetails) {
    return <div>Loading job details...</div>;
  }
  return (
    <div className="mt-6">
      <Card className="shadow-sm border-0">
        <Tabs defaultValue="application" className="w-full">
          {/* Enhanced Tab Navigation */}
          <div className="border-b border-border px-6 pt-6">
            <TabsList className="grid w-full max-w-lg grid-cols-2 bg-muted p-1 rounded-lg">
              <TabsTrigger
                value="application"
                className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Application Status</span>
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">Job Details</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Descriptions */}
            <div className="mt-4 pb-6">
              <TabsContent value="application" className="mt-0">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-3 h-3 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Application Progress
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track your application status and timeline
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="description" className="mt-0">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Job Information
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review the original job posting and requirements
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <TabsContent value="application" className="mt-0">
              <ApplicationContent
                status={jobApplicationDetails.status as Status}
                progress={jobApplicationDetails.progress}
              />
            </TabsContent>

            <TabsContent value="description" className="mt-0">
              <ApplicationDescription
                title={jobDetails.title!}
                description={jobDetails.description ?? "Not specified"}
                pay={jobDetails.pay ?? "Not specified"}
                location="Remote"
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default JobContent;
