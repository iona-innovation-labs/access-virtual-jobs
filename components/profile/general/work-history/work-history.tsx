import React from "react";
import {
  Briefcase,
  Edit3,
  Plus,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkHistoryItem {
  id: number;
  profileId: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrentJob: string;
  location?: string;
  employmentType?: string;
  createdAt: string;
}

interface WorkHistorySectionProps {
  workHistory: WorkHistoryItem[];
  isEditable?: boolean;
  onEdit?: (item: WorkHistoryItem) => void;
  onAdd?: () => void;
  onDelete?: (id: number) => void;
}

export const WorkHistorySection = ({
  workHistory,
  isEditable = false,
  onEdit,
  onAdd,
}: WorkHistorySectionProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatEmploymentType = (type?: string) => {
    if (!type) return "";
    const types: Record<string, string> = {
      "full-time": "Full-time",
      "part-time": "Part-time",
      contract: "Contract",
      freelance: "Freelance",
    };
    return types[type] || type;
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (months < 1) return "Less than a month";
    if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let duration = `${years} year${years > 1 ? "s" : ""}`;
    if (remainingMonths > 0) {
      duration += ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
    }

    return duration;
  };

  // Sort work history by start date (most recent first)
  const sortedWorkHistory = [...workHistory].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  if (!workHistory || workHistory.length === 0) {
    return (
      <Card>
        <CardContent className="px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-900">
                Work History
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Your professional experience and career progression
              </p>
            </div>
            {isEditable && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-green-50"
                onClick={onAdd}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No work experience added yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Showcase your professional experience to help employers understand
              your background
            </p>
            {isEditable && (
              <Button onClick={onAdd} type="button" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Work Experience
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900">
              Work History
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Your professional experience and career progression
            </p>
          </div>
          {isEditable && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-green-50"
              onClick={onAdd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {sortedWorkHistory.map((item, index) => (
            <div
              key={item.id}
              className={`group py-6 ${
                index !== sortedWorkHistory.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <Building className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.position}
                        </h3>
                        {item.isCurrentJob === "yes" && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>

                      <div className="text-base font-medium text-gray-700 mb-2">
                        {item.company}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(item.startDate)} -{" "}
                            {item.endDate
                              ? formatDate(item.endDate)
                              : "Present"}
                          </span>
                        </div>

                        <div className="text-gray-400">•</div>

                        <div>
                          {calculateDuration(item.startDate, item.endDate)}
                        </div>

                        {item.location && (
                          <>
                            <div className="text-gray-400">•</div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{item.location}</span>
                            </div>
                          </>
                        )}

                        {item.employmentType && (
                          <>
                            <div className="text-gray-400">•</div>
                            <div>
                              {formatEmploymentType(item.employmentType)}
                            </div>
                          </>
                        )}
                      </div>

                      {item.description && (
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {item.description}
                        </div>
                      )}
                    </div>

                    {isEditable && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          onClick={() => onEdit?.(item)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
