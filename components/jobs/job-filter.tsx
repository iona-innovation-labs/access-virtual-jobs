"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

interface FilterState {
  query: string;
  jobType: string[];
  salaryRange: string;
  experience: string;
  remote: boolean;
}

export default function JobFilter({
  isPublic = false,
}: {
  isPublic?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    query: "",
    jobType: [],
    salaryRange: "",
    experience: "",
    remote: false,
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters: FilterState = {
      query: searchParams.get("q") || "",
      jobType: searchParams.get("jobType")
        ? searchParams.get("jobType")!.split(",")
        : [],
      salaryRange: searchParams.get("salary") || "",
      experience: searchParams.get("experience") || "",
      remote: searchParams.get("remote") === "true",
    };
    setFilters(urlFilters);
  }, [searchParams]);

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();

    if (newFilters.query) params.set("q", newFilters.query);
    if (newFilters.jobType.length > 0)
      params.set("jobType", newFilters.jobType.join(","));
    if (newFilters.salaryRange) params.set("salary", newFilters.salaryRange);
    if (newFilters.experience) params.set("experience", newFilters.experience);
    if (newFilters.remote) params.set("remote", "true");

    if (isPublic) {
      router.push(`/jobs?${params.toString()}`, { scroll: false });
    } else {
      router.push(`/app/jobs?${params.toString()}`, { scroll: false });
    }
  };

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];
  const salaryRanges = [
    "Under $50k",
    "$50k - $75k",
    "$75k - $100k",
    "$100k - $150k",
    "$150k+",
  ];
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Executive",
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (key !== "query") {
      updateURL(newFilters);
    }
  };

  const handleJobTypeToggle = (type: string) => {
    const newJobTypes = filters.jobType.includes(type)
      ? filters.jobType.filter((t) => t !== type)
      : [...filters.jobType, type];
    const newFilters = { ...filters, jobType: newJobTypes };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(filters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      query: "",
      jobType: [],
      salaryRange: "",
      experience: "",
      remote: false,
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const hasActiveFilters =
    filters.jobType.length > 0 ||
    filters.salaryRange ||
    filters.experience ||
    filters.remote;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-10">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg shadow-gray-200/40">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                className="pl-10 sm:pl-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none text-sm sm:text-base h-11 sm:h-12"
              />
            </div>
            <Button
              type="submit"
              className="bg-brand hover:bg-brand-dark px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base h-11 sm:h-12 min-w-[120px] sm:min-w-auto"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Search Jobs</span>
              <span className="sm:hidden ml-2">Search</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="bg-white/90 backdrop-blur-sm border-gray-200/60 hover:bg-white transition-colors duration-200 text-sm h-9 sm:h-10 px-3 sm:px-4"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium ml-1.5 sm:ml-2">Filters</span>
            <ChevronDown
              className={`w-4 h-4 ml-1.5 sm:ml-2 transition-transform duration-200 ${showAdvancedFilters ? "rotate-180" : ""}`}
            />
          </Button>

          {/* Active Filter Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {filters.jobType.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                <span className="max-w-[80px] sm:max-w-none truncate">
                  {type}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleJobTypeToggle(type)}
                  className="h-auto p-0.5 ml-1 hover:bg-blue-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}

            {filters.salaryRange && (
              <Badge
                variant="secondary"
                className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                <span className="max-w-[100px] sm:max-w-none truncate">
                  {filters.salaryRange}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newFilters = { ...filters, salaryRange: "" };
                    setFilters(newFilters);
                    updateURL(newFilters);
                  }}
                  className="h-auto p-0.5 ml-1 hover:bg-green-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}

            {filters.experience && (
              <Badge
                variant="secondary"
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                <span className="max-w-[80px] sm:max-w-none truncate">
                  {filters.experience}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newFilters = { ...filters, experience: "" };
                    setFilters(newFilters);
                    updateURL(newFilters);
                  }}
                  className="h-auto p-0.5 ml-1 hover:bg-purple-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}

            {filters.remote && (
              <Badge
                variant="secondary"
                className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                Remote
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newFilters = { ...filters, remote: false };
                    setFilters(newFilters);
                    updateURL(newFilters);
                  }}
                  className="h-auto p-0.5 ml-1 hover:bg-orange-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 h-8 sm:h-9 px-3 self-start sm:self-auto"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg shadow-gray-200/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Job Type */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="flex items-center text-sm sm:text-base font-semibold text-gray-700">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Type
              </Label>
              <div className="space-y-2 sm:space-y-3">
                {jobTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <Checkbox
                      id={`jobtype-${type}`}
                      checked={filters.jobType.includes(type)}
                      onCheckedChange={() => handleJobTypeToggle(type)}
                      className="rounded border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 focus:ring-2"
                    />
                    <Label
                      htmlFor={`jobtype-${type}`}
                      className="text-sm text-gray-600 cursor-pointer leading-tight"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="flex items-center text-sm sm:text-base font-semibold text-gray-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Salary Range
              </Label>
              <RadioGroup
                value={filters.salaryRange}
                onValueChange={(value) => {
                  const newFilters = { ...filters, salaryRange: value };
                  setFilters(newFilters);
                  updateURL(newFilters);
                }}
                className="space-y-2 sm:space-y-3"
              >
                {salaryRanges.map((range) => (
                  <div
                    key={range}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <RadioGroupItem
                      value={range}
                      id={`salary-${range}`}
                      className="border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 focus:ring-2"
                    />
                    <Label
                      htmlFor={`salary-${range}`}
                      className="text-sm text-gray-600 cursor-pointer leading-tight"
                    >
                      {range}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Experience Level */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="flex items-center text-sm sm:text-base font-semibold text-gray-700">
                <Clock className="w-4 h-4 mr-2" />
                Experience Level
              </Label>
              <RadioGroup
                value={filters.experience}
                onValueChange={(value) => {
                  const newFilters = { ...filters, experience: value };
                  setFilters(newFilters);
                  updateURL(newFilters);
                }}
                className="space-y-2 sm:space-y-3"
              >
                {experienceLevels.map((level) => (
                  <div
                    key={level}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <RadioGroupItem
                      value={level}
                      id={`experience-${level}`}
                      className="border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 focus:ring-2"
                    />
                    <Label
                      htmlFor={`experience-${level}`}
                      className="text-sm text-gray-600 cursor-pointer leading-tight"
                    >
                      {level}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Work Options */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="flex items-center text-sm sm:text-base font-semibold text-gray-700">
                <MapPin className="w-4 h-4 mr-2" />
                Work Options
              </Label>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id="remote-work"
                    checked={filters.remote}
                    onCheckedChange={(checked) => {
                      const newFilters = {
                        ...filters,
                        remote: checked as boolean,
                      };
                      setFilters(newFilters);
                      updateURL(newFilters);
                    }}
                    className="rounded border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 focus:ring-2"
                  />
                  <Label
                    htmlFor="remote-work"
                    className="text-sm text-gray-600 cursor-pointer leading-tight"
                  >
                    Remote Work
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
