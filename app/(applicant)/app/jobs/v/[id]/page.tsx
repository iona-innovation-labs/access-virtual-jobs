import { formatDistanceToNow } from "date-fns";
import {
  Banknote,
  Calendar,
  MapPin,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { notFound } from "next/navigation";

import { ViewJobHeader } from "@/components/jobs/view-job-header";
import LinkButton from "@/components/ui/link-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getJobPost } from "@/lib/api/jobs";
import { ViewJobContent } from "@/components/jobs/view-job-content";
import { getJobApplicationByJobId } from "@/database/queries/job_applications";

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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Job Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {post?.item?.title || "Job Title"}
                </h1>

                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Remote</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-green-600">
                      {post?.item?.pay || "Salary not specified"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Posted{" "}
                      {formatDistanceToNow(
                        new Date(post?.item?.createdAt || ""),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Access Virtual Staffing
                    </h3>
                    <p className="text-sm text-gray-500">
                      Remote-first company
                    </p>
                  </div>
                </div>
              </div>
              {/* Job Content */}
              <ViewJobContent heading="Job Overview">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: post?.item?.description || "",
                  }}
                />
              </ViewJobContent>
            </div>

            {/* Application Section */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm border-0 sticky top-6">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                      {alreadyApplied ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      ) : (
                        <ExternalLink className="w-8 h-8 text-brand" />
                      )}
                    </div>

                    {alreadyApplied ? (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Application Submitted
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          You've already applied for this position. Check your
                          applications page for updates.
                        </p>
                        <Button variant="outline" className="w-full" disabled>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Already Applied
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Ready to Apply?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Submit your application and get one step closer to
                          your dream job.
                        </p>
                        <LinkButton
                          className="w-full bg-brand hover:bg-brand-dark text-white"
                          navLink={{
                            title: "Apply for This Job",
                            url: `/app/jobs/v/${resolvedParams?.id}/apply`,
                            follow: false,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Application Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm">
                      Application Tips
                    </h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Ensure your profile is complete</li>
                      <li>• Upload an updated resume</li>
                      <li>• Double-check all information</li>
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
