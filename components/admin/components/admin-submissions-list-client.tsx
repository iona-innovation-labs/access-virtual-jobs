"use client";
import React, { useState, useEffect, useTransition } from "react";
import { IJobApplication } from "@/types/jobs";
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
import { Badge } from "@/components/ui/badge";

interface AdminSubmissionsListClientProps {
  initialApplications: IJobApplication[];
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
  { value: "on_going", label: "On Going" },
  { value: "archived", label: "Archived" },
];

const sortOptions = [
  { value: "submittedAt-desc", label: "Date Submitted: Newest" },
  { value: "submittedAt-asc", label: "Date Submitted: Oldest" },
  { value: "status-asc", label: "Status: A-Z" },
  { value: "status-desc", label: "Status: Z-A" },
  { value: "progress-asc", label: "Progress: A-Z" },
  { value: "progress-desc", label: "Progress: Z-A" },
];

// Helper function to format status for display
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    on_going: "On Going",
    archived: "Archived",
  };
  return statusMap[status] || status;
};

// Helper function to format progress for display
const formatProgress = (progress: string): string => {
  const progressMap: Record<string, string> = {
    in_review: "In Review",
    reviewed: "Reviewed",
    declined_initial_interview: "Declined Initial Interview",
    initial_interview: "Initial Interview",
    for_client_interview: "For Client Interview",
    declined_after_interview: "Declined After Interview",
    make_offer: "Make Offer",
    hired_signed: "Hired Signed",
    endorsed: "Endorsed",
    reserved_for_future_opening: "Reserved for Future Opening",
  };
  return progressMap[progress] || progress;
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "on_going":
      return "success";
    case "archived":
      return "archived";
    default:
      return "default";
  }
};

// Helper function to get progress badge variant
const getProgressBadgeVariant = (progress: string) => {
  switch (progress) {
    case "in_review":
      return "warning";
    case "reviewed":
      return "default";
    case "declined_initial_interview":
    case "declined_after_interview":
      return "error";
    case "initial_interview":
    case "for_client_interview":
      return "warning";
    case "make_offer":
    case "hired_signed":
    case "endorsed":
      return "success";
    case "reserved_for_future_opening":
      return "secondary";
    default:
      return "default";
  }
};

// Helper function to get applicant name
const getApplicantName = (user?: IJobApplication["user"]): string => {
  if (!user) return "Unknown";

  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  if (user.username) return user.username;
  if (user.email) return user.email;

  return "Unknown";
};

export default function AdminSubmissionsListClient({
  initialApplications,
  initialTotal,
  initialStatus,
  initialSearch,
  initialSortBy,
  initialSortDesc,
  initialPage,
  pageSize,
}: AdminSubmissionsListClientProps) {
  const [applications, setApplications] =
    useState<IJobApplication[]>(initialApplications);
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

  // Fetch applications when filters change
  useEffect(() => {
    startTransition(() => {
      fetch(`/api/admin/submissions?${buildQuery()}`)
        .then((res) => res.json())
        .then((data) => {
          setApplications(data.items || []);
          setTotal(data.all || 0);
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search, sortBy, sortDesc, page]);

  const handleSortChange = (value: string) => {
    if (value === "submittedAt-desc") {
      setSortBy("submittedAt");
      setSortDesc(true);
    } else if (value === "submittedAt-asc") {
      setSortBy("submittedAt");
      setSortDesc(false);
    } else if (value === "status-asc") {
      setSortBy("status");
      setSortDesc(false);
    } else if (value === "status-desc") {
      setSortBy("status");
      setSortDesc(true);
    } else if (value === "progress-asc") {
      setSortBy("progress");
      setSortDesc(false);
    } else if (value === "progress-desc") {
      setSortBy("progress");
      setSortDesc(true);
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
            placeholder="Search applications..."
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
            <TableHead>Job Title</TableHead>
            <TableHead>Applicant Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No job applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {application.job?.title || "-"}
                </TableCell>
                <TableCell>{getApplicantName(application.user)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(application.status)}>
                    {formatStatus(application.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getProgressBadgeVariant(application.progress)}
                  >
                    {formatProgress(application.progress)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {application.submittedAt
                    ? new Date(application.submittedAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Link
                    href={`/admin/app/submissions/v/${application.applicationPublicId}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View
                  </Link>
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
