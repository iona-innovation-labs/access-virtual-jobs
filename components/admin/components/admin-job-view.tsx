"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Banknote,
  Calendar,
  MapPin,
  MenuIcon,
  Users,
  Tag,
  Briefcase,
  Globe,
  ArrowLeft,
  Edit,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IJobListing } from "@/types/jobs";
import { useRouter } from "next/navigation";

interface AdminJobViewProps {
  job: IJobListing | null;
}

const AdminJobView: React.FC<AdminJobViewProps> = ({ job }) => {
  const router = useRouter();
  if (!job) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        This job does not exist or the ID is invalid.
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Back Button */}
          <div className="mb-6 flex justify-end gap-5">
            <Button
              onClick={() => router.push("/admin/app/jobs")}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Jobs
            </Button>

            <Button
              onClick={() => router.push(`/admin/app/jobs/v/${job.id}/edit`)}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                {/* Job Title */}
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
                        { addSuffix: true }
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
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Company Card (optional, can uncomment if needed) */}
              {/* <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center p-1">
                    <Briefcase className="w-8 h-8 text-brand" />
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
              </div> */}
              {/* Job Description */}
              <Card className="shadow-sm border-0 py-0 mx-0 sm:mx-0 mb-6 bg-white">
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-brand" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight ">
                      Job Overview
                    </h2>
                  </div>
                  <div
                    className="text-base whitespace-pre-wrap text-zinc-800 "
                    dangerouslySetInnerHTML={{
                      __html: job?.description || "",
                    }}
                  />
                </div>
              </Card>
            </div>
            {/* Sidebar (empty for admin) */}
            <div className="lg:col-span-1" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminJobView;
