"use client";
import React, { useState, useEffect, useTransition } from "react";
import { IJobListing } from "@/types/jobs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import Link from "next/link";
import { X } from "lucide-react";

interface AdminJobListClientProps {
  initialJobs: IJobListing[];
  initialTotal: number;
  initialStatus: string;
  initialSearch: string;
  initialSortBy: string;
  initialSortDesc: boolean;
  initialPage: number;
  pageSize: number;
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "closed", label: "Closed" },
];

const sortOptions = [
  { value: "createdAt-desc", label: "Date Posted: Newest" },
  { value: "createdAt-asc", label: "Date Posted: Oldest" },
];

export default function AdminJobListClient({
  initialJobs,
  initialTotal,
  initialStatus,
  initialSearch,
  initialSortBy,
  initialSortDesc,
  initialPage,
  pageSize,
}: AdminJobListClientProps) {
  const [jobs, setJobs] = useState<IJobListing[]>(initialJobs);
  const [total, setTotal] = useState(initialTotal);
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDesc, setSortDesc] = useState(initialSortDesc);
  const [page, setPage] = useState(initialPage);
  const [, startTransition] = useTransition();

  // Helper to build query string
  function buildQuery() {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    params.set("sortBy", sortBy);
    params.set("sortDesc", sortDesc ? "true" : "false");
    params.set("page", String(page));
    params.set("limit", String(pageSize));
    return params.toString();
  }

  // Fetch jobs when filters change
  useEffect(() => {
    startTransition(() => {
      fetch(`/api/admin/jobs?${buildQuery()}`)
        .then((res) => res.json())
        .then((data) => {
          setJobs(data.items || []);
          setTotal(data.all || 0);
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search, sortBy, sortDesc, page]);

  const handleSortChange = (value: string) => {
    if (value === "createdAt-desc") {
      setSortBy("createdAt");
      setSortDesc(true);
    } else if (value === "createdAt-asc") {
      setSortBy("createdAt");
      setSortDesc(false);
    }
    setPage(1);
  };

  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2 items-center">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center relative min-w-[200px] w-full max-w-xs">
          <Input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pr-8"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Select
            value={`${sortBy}-${sortDesc ? "desc" : "asc"}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No jobs found.
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{job.jobType || "-"}</TableCell>
                <TableCell>{job.jobCategory || "-"}</TableCell>
                <TableCell>
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Link
                    href={`/admin/app/jobs/v/${job.id}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/app/jobs/v/${job.id}/edit`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Edit
                  </Link>
                  {job.status === "active" && (
                    <Link
                      href={`/jobs/v/${job.slug}`}
                      className="text-blue-600 hover:underline text-xs"
                      target="_blank"
                    >
                      Public View
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page > 1 && (
                <PaginationPrevious
                  size="default"
                  className="cursor-pointer"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Go to previous page"
                />
              )}
            </PaginationItem>
            {Array.from({ length: lastPage }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  size="default"
                  className="cursor-pointer"
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={page === i + 1 ? "page" : undefined}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              {page < lastPage && (
                <PaginationNext
                  size="default"
                  className="cursor-pointer"
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  aria-label="Go to next page"
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
