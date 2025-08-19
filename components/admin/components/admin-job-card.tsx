import React from "react";
import Link from "next/link";
import { IJobListing } from "@/types/jobs";

interface AdminJobCardProps {
  job: IJobListing;
}

const AdminJobCard: React.FC<AdminJobCardProps> = ({ job }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 text-xs">{job.id}</td>
      <td className="p-3 text-xs font-medium">
        <Link
          href={`/admin/app/jobs/v/${job.id}`}
          className="text-blue-600 hover:underline"
        >
          {job.title}
        </Link>
      </td>
      <td className="p-3 text-xs">{job.status}</td>
      <td className="p-3 text-xs">{job.jobType || "-"}</td>
      <td className="p-3 text-xs">{job.jobCategory || "-"}</td>
      <td className="p-3 text-xs">
        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "-"}
      </td>
      <td className="p-3 text-xs">
        <Link
          href={`/admin/app/jobs/v/${job.id}`}
          className="text-blue-600 hover:underline text-xs"
        >
          View
        </Link>
      </td>
    </tr>
  );
};

export default AdminJobCard;
