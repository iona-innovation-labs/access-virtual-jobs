import React from "react";
import {
  Briefcase,
  DollarSign,
  Clock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobPreferencesViewProps {
  data?: {
    jobSearchStatus?: string;
    desiredSalary?: number;
    salaryUnit?: string;
    isPublicSalary?: boolean;
    jobType?: string;
  } | null;
  className?: string;
}

interface ViewItemProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  priority?: "high" | "medium" | "low";
}

const ViewItem = ({ label, icon, children }: ViewItemProps) => {
  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </h3>
          {children}
        </div>
      </div>
    </div>
  );
};

const getJobSearchStatusInfo = (status: string) => {
  const statusMap = {
    ready_for_interview: {
      label: "Ready for Interview",
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle className="w-3 h-3" />,
      priority: "high" as const,
      description:
        "Actively seeking opportunities and available to start immediately",
    },
    open_to_offers: {
      label: "Open to Offers",
      color: "bg-blue-100 text-blue-700",
      icon: <Eye className="w-3 h-3" />,
      priority: "medium" as const,
      description:
        "Currently employed but open to discussing exciting new opportunities",
    },
    closed_to_offers: {
      label: "Closed to Offers",
      color: "bg-muted text-muted-foreground",
      icon: <EyeOff className="w-3 h-3" />,
      priority: "low" as const,
      description: "Not currently looking for new opportunities",
    },
  };
  return (
    statusMap[status as keyof typeof statusMap] || statusMap["closed_to_offers"]
  );
};

const getJobTypeInfo = (jobType: string) => {
  const typeMap = {
    full_time: {
      label: "Full Time",
      color: "bg-muted text-foreground",
      description: "40+ hours per week",
    },
    part_time: {
      label: "Part Time",
      color: "bg-muted text-foreground",
      description: "Less than 40 hours per week",
    },
    contract: {
      label: "Contract",
      color: "bg-muted text-foreground",
      description: "Project-based work",
    },
    freelance: {
      label: "Freelance",
      color: "bg-muted text-foreground",
      description: "Independent contractor",
    },
    internship: {
      label: "Internship",
      color: "bg-muted text-foreground",
      description: "Learning-focused position",
    },
  };

  return (
    typeMap[jobType as keyof typeof typeMap] || {
      label: jobType || "Not specified",
      color: "bg-muted text-muted-foreground",
      description: "Employment type not specified",
    }
  );
};

export const JobPreferencesView = ({
  data,
  className = "",
}: JobPreferencesViewProps) => {
  console.log(data);
  // Handle loading/null state
  if (!data) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Job Preferences
              </h2>
              <p className="text-sm text-muted-foreground">
                Loading candidate preferences...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-l-4 border-l-gray-200 bg-gray-50/50 p-4 rounded-r-lg animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const jobStatusInfo = getJobSearchStatusInfo(
    data.jobSearchStatus || "not_looking"
  );
  const jobTypeInfo = getJobTypeInfo(data.jobType || "");

  return (
    <Card className={`w-full shadow-sm ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Job Preferences
            </h2>
            <p className="text-sm text-muted-foreground">
              Candidate availability and compensation expectations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Search Status */}
          <ViewItem
            label="Availability Status"
            icon={<Clock className="w-4 h-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={`${jobStatusInfo.color} font-medium`}>
                  {jobStatusInfo.icon}
                  <span className="ml-1">{jobStatusInfo.label}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {jobStatusInfo.description}
              </p>
            </div>
          </ViewItem>

          {/* Employment Type */}
          <ViewItem
            label="Preferred Employment Type"
            icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={`${jobTypeInfo.color} font-medium`}>
                  {jobTypeInfo.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {jobTypeInfo.description}
              </p>
            </div>
          </ViewItem>

          {/* Salary Expectations */}
          <ViewItem
            label="Salary Expectations"
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              {data.isPublicSalary && data.desiredSalary && data.salaryUnit ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-foreground">
                    {data.salaryUnit} {data.desiredSalary.toLocaleString()}
                  </span>
                  <Badge className="bg-green-100 text-green-700">
                    <Eye className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base text-muted-foreground">
                    Not disclosed
                  </span>
                  <Badge className="bg-muted text-muted-foreground">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {data.isPublicSalary
                  ? "Monthly salary expectation"
                  : "Salary details kept private"}
              </p>
            </div>
          </ViewItem>

          {/* Quick Summary */}
          <ViewItem
            label="Summary"
            icon={<AlertCircle className="w-4 h-4 text-muted-foreground" />}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {jobStatusInfo.label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {jobTypeInfo.label}
                </Badge>
                {data.isPublicSalary && (
                  <Badge variant="outline" className="text-xs">
                    Open Salary
                  </Badge>
                )}
              </div>

              <div className="text-sm space-y-1">
                {jobStatusInfo.priority === "high" && (
                  <p className="text-foreground">
                    • High availability - ready to proceed
                  </p>
                )}
                {data.isPublicSalary && (
                  <p className="text-foreground">
                    • Transparent about compensation
                  </p>
                )}
                {!data.isPublicSalary && (
                  <p className="text-muted-foreground">
                    • Salary discussion needed
                  </p>
                )}
              </div>
            </div>
          </ViewItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPreferencesView;
