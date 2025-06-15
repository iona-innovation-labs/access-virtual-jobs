"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, ArrowRight, Clock } from "lucide-react";
import JobApplicationCard from "@/components/submissions/job-application-card";

import { useJobSubmissions } from "@/hooks/use-job-submissions";

const AppliedJobs = () => {
  const { jobApplications, loading, hasMore, loadMore } = useJobSubmissions({
    filter: "on_going",
  });

  if (loading) {
    return (
      <Card className="w-full px-6 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-muted rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted/50 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card shadow-sm border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Applied Jobs</h2>
              <p className="text-sm text-muted-foreground">
                {jobApplications.length > 0
                  ? `${jobApplications.length} active applications`
                  : "Track your job applications"}
              </p>
            </div>
          </div>

          {jobApplications.length > 0 && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Recent</span>
            </div>
          )}
        </div>
      </div>

      {/* Applications List */}
      <div className="p-6">
        {jobApplications.length > 0 ? (
          <div className="space-y-4">
            {jobApplications.slice(0, 3).map((j) => (
              <JobApplicationCard
                key={j.applicationPublicId}
                jobApplication={j}
              />
            ))}

            {(hasMore || jobApplications.length > 3) && (
              <div className="pt-4 border-t border-border">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="ghost"
                  className="w-full text-brand hover:bg-brand/5"
                >
                  {loading
                    ? "Loading..."
                    : `View ${jobApplications.length > 3 ? "all" : "more"} applications`}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">
              No applications yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              When you apply for jobs, they&apos;ll appear here so you can track
              your progress.
            </p>
            <Button
              onClick={() => (window.location.href = "/app/jobs")}
              className="bg-brand hover:bg-brand-dark text-white"
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppliedJobs;
