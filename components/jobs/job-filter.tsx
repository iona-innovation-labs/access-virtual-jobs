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
  FolderOpen,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterState {
  query: string;
  jobType: string[];
  jobCategory: string[];
  salaryRange: string;
  remote: boolean;
  sortBy: string;
  sortDesc: boolean;
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
    jobCategory: [],
    salaryRange: "",
    remote: false,
    sortBy: "createdAt",
    sortDesc: true,
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters: FilterState = {
      query: searchParams.get("q") || "",
      jobType: searchParams.get("jobType")
        ? searchParams.get("jobType")!.split(",")
        : [],
      jobCategory: searchParams.get("jobCategory")
        ? searchParams.get("jobCategory")!.split(",")
        : [],
      salaryRange: searchParams.get("salary") || "",
      remote: searchParams.get("remote") === "true",
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortDesc: searchParams.get("sortDesc") !== "false",
    };
    setFilters(urlFilters);
  }, [searchParams]);

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();

    if (newFilters.query) params.set("q", newFilters.query);
    if (newFilters.jobType.length > 0)
      params.set("jobType", newFilters.jobType.join(","));
    if (newFilters.jobCategory.length > 0)
      params.set("jobCategory", newFilters.jobCategory.join(","));
    if (newFilters.salaryRange) params.set("salary", newFilters.salaryRange);
    if (newFilters.remote) params.set("remote", "true");
    if (newFilters.sortBy !== "createdAt")
      params.set("sortBy", newFilters.sortBy);
    if (!newFilters.sortDesc) params.set("sortDesc", "false");

    if (isPublic) {
      router.push(`/jobs?${params.toString()}`, { scroll: false });
    } else {
      router.push(`/app/jobs?${params.toString()}`, { scroll: false });
    }
  };

  // Sorting options - Per FR-JS-JOB-003 requirements
  const sortOptions = [
    {
      value: "createdAt-desc",
      label: "Date Posted: Newest",
      sortBy: "createdAt",
      sortDesc: true,
    },
    {
      value: "createdAt-asc",
      label: "Date Posted: Oldest",
      sortBy: "createdAt",
      sortDesc: false,
    },
    {
      value: "salaryAmount-desc",
      label: "Salary: Highest to Lowest",
      sortBy: "salaryAmount",
      sortDesc: true,
    },
    {
      value: "salaryAmount-asc",
      label: "Salary: Lowest to Highest",
      sortBy: "salaryAmount",
      sortDesc: false,
    },
  ];

  // Filter options
  const jobTypes = ["Freelance", "Full-time", "Part-time", "Contract"];

  const jobCategories = [
    "Office & Administration",
    "Marketing & Sales",
    "Graphics & Multimedia",
    "Web Design & Development",
    "Software Development / Programming",
    "Customer Service & Admin Support",
    "Professional Services",
    "Writing",
  ];

  const salaryRanges = [
    "Less than $3",
    "$3 - $4.99",
    "$5 - $7.99",
    "$8 - $9.99",
    "More than $10",
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (key !== "query") {
      updateURL(newFilters);
    }
  };

  const handleSortChange = (value: string) => {
    const option = sortOptions.find((opt) => opt.value === value);
    if (option) {
      const newFilters = {
        ...filters,
        sortBy: option.sortBy,
        sortDesc: option.sortDesc,
      };
      setFilters(newFilters);
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

  const handleJobCategoryToggle = (category: string) => {
    const newJobCategories = filters.jobCategory.includes(category)
      ? filters.jobCategory.filter((c) => c !== category)
      : [...filters.jobCategory, category];
    const newFilters = { ...filters, jobCategory: newJobCategories };
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
      jobCategory: [],
      salaryRange: "",
      remote: false,
      sortBy: "createdAt",
      sortDesc: true,
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const hasActiveFilters =
    filters.jobType.length > 0 ||
    filters.jobCategory.length > 0 ||
    filters.salaryRange ||
    filters.remote;

  const currentSortValue = `${filters.sortBy}-${filters.sortDesc ? "desc" : "asc"}`;

  return (
    <div className="w-full bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Sort Bar */}
        <div className="space-y-4">
          {/* Main Search */}
          <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
            <div className="bg-card/90 backdrop-blur-sm border border-border/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg shadow-border/40">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="text"
                    placeholder="Search by title or keywords..."
                    value={filters.query}
                    onChange={(e) =>
                      handleFilterChange("query", e.target.value)
                    }
                    className="pl-10 sm:pl-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none text-sm sm:text-base h-11 sm:h-12"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-brand hover:bg-brand-dark px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base h-11 sm:h-12 min-w-[120px] sm:min-w-auto"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2 text-white" />
                  <span className="hidden sm:inline text-white">
                    Search Jobs
                  </span>
                  <span className="sm:hidden ml-2 text-white">Search</span>
                </Button>
              </div>
            </div>
          </form>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Filter Toggle & Active Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-border/60 hover:bg-muted/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`}
                />
              </Button>

              {/* Active Filter Badges */}
              {filters.jobType.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  {type}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleJobTypeToggle(type)}
                    className="h-auto p-0.5 ml-1.5 hover:bg-blue-200 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}

              {filters.jobCategory.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  <span className="max-w-[120px] truncate">{category}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleJobCategoryToggle(category)}
                    className="h-auto p-0.5 ml-1.5 hover:bg-purple-200 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}

              {filters.salaryRange && (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                  {filters.salaryRange}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange("salaryRange", "")}
                    className="h-auto p-0.5 ml-1.5 hover:bg-green-200 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}

              {filters.remote && (
                <Badge
                  variant="secondary"
                  className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                >
                  Remote
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange("remote", false)}
                    className="h-auto p-0.5 ml-1.5 hover:bg-orange-200 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Right: Sort Dropdown */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Sort by:
              </Label>
              <Select value={currentSortValue} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[200px] border-border/60">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.sortDesc ? (
                          <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUp className="w-3 h-3" />
                        )}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-6 p-6 bg-card/30 rounded-lg border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Job Type */}
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-medium text-foreground">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Type
                </Label>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`jobtype-${type}`}
                        checked={filters.jobType.includes(type)}
                        onCheckedChange={() => handleJobTypeToggle(type)}
                        className="border-border"
                      />
                      <Label
                        htmlFor={`jobtype-${type}`}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Category */}
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-medium text-foreground">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Category
                </Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {jobCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`jobcategory-${category}`}
                        checked={filters.jobCategory.includes(category)}
                        onCheckedChange={() =>
                          handleJobCategoryToggle(category)
                        }
                        className="border-border"
                      />
                      <Label
                        htmlFor={`jobcategory-${category}`}
                        className="text-sm text-muted-foreground cursor-pointer leading-tight"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-medium text-foreground">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Hourly Rate
                </Label>
                <RadioGroup
                  value={filters.salaryRange}
                  onValueChange={(value) =>
                    handleFilterChange("salaryRange", value)
                  }
                  className="space-y-2"
                >
                  {salaryRanges.map((range) => (
                    <div key={range} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={range}
                        id={`salary-${range}`}
                        className="border-border"
                      />
                      <Label
                        htmlFor={`salary-${range}`}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        {range}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Work Location */}
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-medium text-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  Work Location
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote-work"
                      checked={filters.remote}
                      onCheckedChange={(checked) =>
                        handleFilterChange("remote", checked as boolean)
                      }
                      className="border-border"
                    />
                    <Label
                      htmlFor="remote-work"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Remote Work Available
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
