import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Job Applications",
  description: "View all job applications submitted by applicants",
};

interface IJobApplication {
  id: number;
  applicationPublicId: string;
  userId: string;
  profileId: number;
  jobId: number;
  status: string;
  progress: string;
  submittedAt: string;
  job?: {
    title?: string;
  };
}

interface FetchJobApplicationsResponse {
  success: boolean;
  items: IJobApplication[];
  total: number;
  all: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

async function fetchJobApplications(
  page: number = 1,
  limit: number = 20
): Promise<FetchJobApplicationsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/submissions?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch job applications");
  return res.json();
}

export default async function AdminJobApplicationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const page = Number((await searchParams)?.page || 1);
  const limit = 20;
  const data = await fetchJobApplications(page, limit);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <h1 className="text-2xl font-bold mb-6">Job Applications</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application ID</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Applicant User ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Submitted At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No job applications found.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.applicationPublicId}</TableCell>
                <TableCell>{app.job?.title || "-"}</TableCell>
                <TableCell>{app.userId}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>{app.progress}</TableCell>
                <TableCell>
                  {new Date(app.submittedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-muted rounded disabled:opacity-50"
          disabled={!data.pagination.hasPrev}
          onClick={() => {
            if (data.pagination.hasPrev) {
              window.location.search = `?page=${data.pagination.currentPage - 1}`;
            }
          }}
        >
          Previous
        </button>
        <span>
          Page {data.pagination.currentPage} of {data.pagination.totalPages}
        </span>
        <button
          className="px-4 py-2 bg-muted rounded disabled:opacity-50"
          disabled={!data.pagination.hasNext}
          onClick={() => {
            if (data.pagination.hasNext) {
              window.location.search = `?page=${data.pagination.currentPage + 1}`;
            }
          }}
        >
          Next
        </button>
      </div> */}
    </div>
  );
}
