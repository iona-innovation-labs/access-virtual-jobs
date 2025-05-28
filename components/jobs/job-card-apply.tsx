"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function JobCardApply({id, isPublic = false}: { id: string, isPublic?: boolean}) {
    const handleApply = () => {
        if (isPublic) {
            redirect(`/register`);
        } else {
            redirect(`/app/jobs/v/${id}`);
        }
      }
    return (
        <Button onClick={handleApply} className="bg-brand hover:bg-brand-dark cursor-pointer text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-md transition-colors duration-200 w-full sm:w-auto flex-shrink-0">
            Apply now
        </Button>
    )
}
