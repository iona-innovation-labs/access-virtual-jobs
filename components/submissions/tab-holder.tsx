"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Clock, Archive, FileText } from "lucide-react";
import OngoingSubmission from "./ongoing-submission";
import ArchivedSubmissions from "./archived-submission";

const SubmissionPages = () => {
  return (
    <div className="w-full mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-brand" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            My Applications
          </h1>
        </div>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>

      {/* Tabs */}
      <Card className="shadow-sm border-0">
        <Tabs defaultValue="ongoing" className="w-full">
          {/* Enhanced Tab Navigation */}
          <div className="border-b border-border px-6 pt-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted p-1 rounded-lg">
              <TabsTrigger
                value="ongoing"
                className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">Active Applications</span>
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:text-brand data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Archive className="w-4 h-4" />
                <span className="font-medium">Archived</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Descriptions */}
            <div className="mt-4 pb-6">
              <TabsContent value="ongoing" className="mt-0">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Active Applications
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Applications currently in review or pending response
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="archived" className="mt-0">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Archive className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Archived Applications
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Completed applications including accepted, rejected, or
                      withdrawn
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <TabsContent value="ongoing" className="mt-0">
              <OngoingSubmission />
            </TabsContent>

            <TabsContent value="archived" className="mt-0">
              <ArchivedSubmissions />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default SubmissionPages;
