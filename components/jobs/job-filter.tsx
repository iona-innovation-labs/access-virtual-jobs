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

interface FilterState {
  query: string;
  location: string;
  jobType: string[];
  salaryRange: string;
  experience: string;
  remote: boolean;
}

export default function JobFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    query: "",
    location: "",
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
      location: searchParams.get("location") || "",
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
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.jobType.length > 0)
      params.set("jobType", newFilters.jobType.join(","));
    if (newFilters.salaryRange) params.set("salary", newFilters.salaryRange);
    if (newFilters.experience) params.set("experience", newFilters.experience);
    if (newFilters.remote) params.set("remote", "true");

    // Update URL without page reload
    router.push(`?${params.toString()}`, { scroll: false });
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
    // Don't update URL immediately for text inputs (wait for search)
    if (key !== "query" && key !== "location") {
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
      location: "",
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
    <div className="max-w-6xl mx-auto mb-8 sm:mb-10">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-2 shadow-lg shadow-gray-200/50">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="relative sm:w-48">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-0 sm:border-l border-gray-200 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Search className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Search Jobs</span>
            </button>
          </div>
        </div>
      </form>

      {/* Filter Toggle and Active Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-white transition-colors duration-200"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${showAdvancedFilters ? "rotate-180" : ""}`}
            />
          </button>

          {/* Active Filter Tags */}
          {filters.jobType.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {type}
              <button
                onClick={() => handleJobTypeToggle(type)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.salaryRange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {filters.salaryRange}
              <button
                onClick={() => {
                  const newFilters = { ...filters, salaryRange: "" };
                  setFilters(newFilters);
                  updateURL(newFilters);
                }}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.experience && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {filters.experience}
              <button
                onClick={() => {
                  const newFilters = { ...filters, experience: "" };
                  setFilters(newFilters);
                  updateURL(newFilters);
                }}
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.remote && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
              Remote
              <button
                onClick={() => {
                  const newFilters = { ...filters, remote: false };
                  setFilters(newFilters);
                  updateURL(newFilters);
                }}
                className="hover:bg-orange-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg shadow-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Job Type */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Type
              </label>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.jobType.includes(type)}
                      onChange={() => handleJobTypeToggle(type)}
                      className="rounded border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <DollarSign className="w-4 h-4 mr-2" />
                Salary Range
              </label>
              <div className="space-y-2">
                {salaryRanges.map((range) => (
                  <label key={range} className="flex items-center">
                    <input
                      type="radio"
                      name="salaryRange"
                      checked={filters.salaryRange === range}
                      onChange={() => {
                        const newFilters = { ...filters, salaryRange: range };
                        setFilters(newFilters);
                        updateURL(newFilters);
                      }}
                      className="border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                Experience Level
              </label>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="experience"
                      checked={filters.experience === level}
                      onChange={() => {
                        const newFilters = { ...filters, experience: level };
                        setFilters(newFilters);
                        updateURL(newFilters);
                      }}
                      className="border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                Work Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => {
                      const newFilters = {
                        ...filters,
                        remote: e.target.checked,
                      };
                      setFilters(newFilters);
                      updateURL(newFilters);
                    }}
                    className="rounded border-gray-300 text-brand focus:ring-brand focus:ring-offset-0 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remote Work
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
