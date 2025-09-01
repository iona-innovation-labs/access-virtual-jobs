import React from "react";
import { IJobListing } from "@/types/jobs";
import AdminJobCard from "./admin-job-card";

interface AdminJobListProps {
  jobs: IJobListing[];
  onStatusChange?: (status: string) => void;
  onSearch?: (search: string) => void;
  onSort?: (sortBy: string, sortDesc: boolean) => void;
  status: string;
  search: string;
  sortBy: string;
  sortDesc: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange?: (page: number) => void;
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "closed", label: "Closed" },
];

const AdminJobList: React.FC<AdminJobListProps> = ({
  jobs,
  onStatusChange,
  onSearch,
  onSort,
  status,
  search,
  sortBy,
  sortDesc,
  page,
  pageSize,
  total,
  onPageChange,
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2 items-center">
          <label htmlFor="status" className="text-sm font-medium">
            Status:
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            className="border rounded px-2 py-1 text-sm min-w-[200px]"
          />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => onSort?.(e.target.value, sortDesc)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="createdAt">Newest</option>
            <option value="createdAt-oldest">Oldest</option>
          </select>
          <button
            className="ml-2 text-xs underline"
            onClick={() => onSort?.(sortBy, !sortDesc)}
            type="button"
          >
            {sortDesc ? "↓" : "↑"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-xs font-semibold">Title</th>
              <th className="p-3 text-xs font-semibold">Status</th>
              <th className="p-3 text-xs font-semibold">Type</th>
              <th className="p-3 text-xs font-semibold">Category</th>
              <th className="p-3 text-xs font-semibold">Created At</th>
              <th className="p-3 text-xs font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No jobs found.
                </td>
              </tr>
            ) : (
              jobs.map((job) => <AdminJobCard key={job.id} job={job} />)
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          className="border rounded px-3 py-1 text-sm disabled:opacity-50"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="px-2 text-sm">
          Page {page} of {Math.ceil(total / pageSize)}
        </span>
        <button
          className="border rounded px-3 py-1 text-sm disabled:opacity-50"
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= Math.ceil(total / pageSize)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminJobList;
