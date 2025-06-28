"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SavedJobsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDesc, setSortDesc] = useState(true);

  // Initialize from URL on mount
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSortBy(searchParams.get("sortBy") || "createdAt");
    setSortDesc(searchParams.get("sortDesc") !== "false");
  }, [searchParams]);

  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    // Always keep the tab parameter
    params.set("tab", "saved");

    // Update other parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset pagination when filters change
    params.delete("page");

    router.push(`/app/jobs?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({
      search: searchTerm,
      sortBy: sortBy !== "createdAt" ? sortBy : "",
      sortDesc: sortDesc ? "" : "false",
    });
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortDirection] = value.split("-");
    const newSortDesc = newSortDirection === "desc";

    setSortBy(newSortBy);
    setSortDesc(newSortDesc);

    updateURL({
      search: searchTerm,
      sortBy: newSortBy !== "createdAt" ? newSortBy : "",
      sortDesc: newSortDesc ? "" : "false",
    });
  };

  // Sort options for saved jobs
  const sortOptions = [
    {
      value: "createdAt-desc",
      label: "Recently Saved",
      sortBy: "createdAt",
      sortDesc: true,
    },
    {
      value: "createdAt-asc",
      label: "Oldest Saved",
      sortBy: "createdAt",
      sortDesc: false,
    },
    {
      value: "title-asc",
      label: "Job Title A-Z",
      sortBy: "title",
      sortDesc: false,
    },
    {
      value: "title-desc",
      label: "Job Title Z-A",
      sortBy: "title",
      sortDesc: true,
    },
    {
      value: "salaryAmount-desc",
      label: "Highest Salary",
      sortBy: "salaryAmount",
      sortDesc: true,
    },
    {
      value: "salaryAmount-asc",
      label: "Lowest Salary",
      sortBy: "salaryAmount",
      sortDesc: false,
    },
  ];

  const currentSortValue = `${sortBy}-${sortDesc ? "desc" : "asc"}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search your saved jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-20 h-10 border-border/60 focus:border-brand focus:ring-brand/20"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-brand hover:bg-brand/90"
            >
              <Search className="w-3 h-3" />
            </Button>
          </div>
        </form>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Sort by:
          </span>
          <Select value={currentSortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] border-border/60">
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
  );
}
