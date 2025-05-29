import { Metadata } from "next";

import SubmissionPages from "@/components/submissions/tab-holder";

export const metadata: Metadata = {
  title: "Submissions",
  description: "View and manage your job submissions",
};

export default async function Submissions() {
  return (
    <div className="h-[calc(100vh-4.5rem)] overflow-auto">
      <SubmissionPages />
    </div>
  );
}
