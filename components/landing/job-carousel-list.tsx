"use client";

import { useRouter } from "next/navigation";
// @ts-ignore
import "swiper/swiper.min.css";
import { Card, CardContent, CardHeader } from "../ui/card";

interface Job {
  id: string;
  title: string;
  description?: string;
  postedBy: string;
  pay?: string;
}

interface JobCarouselClientProps {
  jobs: Job[];
}

// Function to strip HTML tags and decode HTML entities
const stripHtml = (html: string): string => {
  if (!html) return "";

  // Create a temporary div to decode HTML entities and strip tags
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

// Function to truncate text safely
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  const cleanText = stripHtml(text);
  return cleanText.length > maxLength
    ? cleanText.slice(0, maxLength).trim() + "..."
    : cleanText;
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
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                  {truncateText(
                    job.description || "No description available",
                    120
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-400 flex-shrink-0">
                <p className="truncate">
                  <span className="font-medium text-gray-200">Posted by:</span>{" "}
                  <span className="text-gray-300">{job.postedBy}</span>
                </p>
                <p className="truncate">
                  <span className="font-medium text-gray-200">Pay:</span>{" "}
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
