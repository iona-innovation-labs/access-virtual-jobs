"use client";

import { useRouter } from "next/navigation";
// @ts-ignore
import "swiper/swiper.min.css";
import { Card, CardContent, CardHeader } from "../ui/card";
import { IJobListing } from "@/types/jobs";

interface JobCarouselClientProps {
  jobs: IJobListing[];
}

// Utility function to safely truncate text and remove HTML
const truncateDescription = (text: string, maxLength: number = 120): string => {
  if (!text) return "No description available";

  // Simple HTML tag removal using regex
  const cleanText = text.replace(/<[^>]*>/g, "").trim();

  if (cleanText.length <= maxLength) return cleanText;

  // Truncate and ensure we don't cut off in the middle of a word
  const truncated = cleanText.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  return lastSpaceIndex > maxLength * 0.8
    ? truncated.slice(0, lastSpaceIndex) + "..."
    : truncated + "...";
};

export default function JobCarouselClient({ jobs }: JobCarouselClientProps) {
  const router = useRouter();

  const handleJobClick = () => {
    router.push("/register");
  };

  return (
    <div className="swiper-wrapper ease-linear! select-none">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={handleJobClick}
          className="swiper-slide w-80! h-72 bg-gray-800 rounded-2xl p-4 text-white hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <Card className="bg-gradient-to-br h-full from-gray-800 to-gray-900 text-white border-none shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <h3 className="text-xl font-semibold tracking-tight line-clamp-2 leading-tight">
                {job.title}
              </h3>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              <div className="flex-1">
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
                  {truncateDescription(job.description || "")}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-400 flex-shrink-0">
                <p className="truncate">
                  <span className="font-medium">
                    {job.pay || "Not specified"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
