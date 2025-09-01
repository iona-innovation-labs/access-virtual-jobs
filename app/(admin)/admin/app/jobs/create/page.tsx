import { Metadata } from "next";
import CreateJobForm from "@/components/admin/components/create-job-form";

export const metadata: Metadata = {
  title: "Admin - Create Job",
  description: "Create a new job posting on the AVJ platform.",
};

export default function CreateJobPage() {
  return <CreateJobForm />;
}
