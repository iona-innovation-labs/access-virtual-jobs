import { formatDistanceToNow } from "date-fns";
import {
  Banknote,
  Calendar,
  MapPin,
  CheckCircle2,
  ExternalLink,
  MenuIcon,
  Users,
  Tag,
  Briefcase,
  Globe,
} from "lucide-react";
import { notFound } from "next/navigation";

import LinkButton from "@/components/ui/link-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getJobPost } from "@/lib/api/jobs";
import { ViewJobContent } from "@/components/jobs/view-job-content";
import { getJobApplicationByJobId } from "@/database/queries/job_applications";
import Logo from "@/components/logo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const post = await getJobPost(id);

  return {
    title: post ? `${post.item?.title}` : "View Job",
  };
}

export default async function ViewJob({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const post = await getJobPost(
    Array.isArray(resolvedParams?.id)
      ? resolvedParams?.id[0]
      : resolvedParams?.id || ""
  );

  const jobApplication = await getJobApplicationByJobId(
    resolvedParams?.id || ""
  );
  const alreadyApplied = jobApplication.ok && jobApplication.application;

  if (!post) {
    return notFound();
  }

  const job = post.item;

  return (
    <main className="min-h-screen bg-background mt-12">
      {/* Job Header */}
      <div className="bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                {/* Job Title with Bookmark Button */}
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight flex-1 mr-4">
                    {job?.title || "Job Title"}
                  </h1>
                </div>

                {/* Primary Job Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {job?.location || "Location not specified"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-success">
                      {job?.pay || "Salary not specified"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {job?.jobType || "Job type not specified"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MenuIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {job?.jobCategory || "Category not specified"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {job?.remoteAllowed
                        ? "Remote Work Available"
                        : "On-site Work"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {job?.numberOfTalents
                        ? `${job.numberOfTalents} ${job.numberOfTalents === 1 ? "Position" : "Positions"}`
                        : "1 Position"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Posted{" "}
                      {formatDistanceToNow(
                        job?.createdAt ? new Date(job?.createdAt) : new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Tags Section */}
                {job?.tags && job.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Skills & Tags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-brand/10 text-brand border-brand/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Company Card */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center p-1">
                    <Logo size="lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Access Virtual Staffing
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Remote-first company
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <ViewJobContent heading="Job Overview">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: job?.description || "",
                  }}
                />
              </ViewJobContent>
            </div>

            {/* Application Section */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm border-border sticky top-6">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                      {alreadyApplied ? (
                        <CheckCircle2 className="w-8 h-8 text-success" />
                      ) : (
                        <ExternalLink className="w-8 h-8 text-brand" />
                      )}
                    </div>

                    {alreadyApplied ? (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Application Submitted
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You&apos;ve already applied for this position. Check
                          your applications page for updates.
                        </p>
                        <Button variant="outline" className="w-full" disabled>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Already Applied
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-heading font-semibold text-foreground mb-2">
                          Ready to Apply?
                        </h3>
                        <p className="font-body text-sm text-muted-foreground mb-4">
                          Submit your application and get one step closer to
                          your dream job.
                        </p>

                        <LinkButton
                          className="w-full text-white bg-brand hover:bg-brand-dark cursor-pointer"
                          navLink={{
                            title: "Apply for This Job",
                            url: `/register`,
                            follow: false,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="mb-4" />

                  {/* Job Summary Card */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground text-sm mb-3">
                      Job Summary
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Job Type:</span>
                        <span className="font-medium">
                          {job?.jobType || "Not specified"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium text-right">
                          {job?.jobCategory || "Not specified"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium text-right">
                          {job?.location || "Not specified"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remote:</span>
                        <span className="font-medium">
                          {job?.remoteAllowed ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Positions:
                        </span>
                        <span className="font-medium">
                          {job?.numberOfTalents || 1}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salary:</span>
                        <span className="font-medium text-success text-right">
                          {job?.pay || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Application Tips */}
                  <div className="bg-brand/5 border border-brand/20 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2 text-sm">
                      Application Tips
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Ensure your profile is complete</li>
                      <li>• Upload an updated resume</li>
                      <li>• Double-check all information</li>
                      <li>• Highlight relevant skills from the tags</li>
                      <li>• Save this job to apply later if needed</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
