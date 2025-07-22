"use client";

import { useRouter } from "next/navigation";
// @ts-ignore
import "swiper/swiper.min.css";
import { Card, CardContent, CardHeader } from "../ui/card";
import { IJobListing } from "@/types/jobs";
import ClientsSwiper from "./job-swiper";

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
    router.push(`/register`);
  };

  return (
    <ClientsSwiper>
      <div className="swiper-wrapper ease-linear! select-none">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={handleJobClick}
            className="swiper-slide flex-shrink-0 w-96! h-80  bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer border border-gray-100 border-none"
          >
            <Card className="  flex flex-col h-80">
              <CardHeader className="pb-4 flex-shrink-0">
                <h3 className="text-2xl font-bold tracking-tight line-clamp-2 leading-tight text-zinc-800">
                  {job.title}
                </h3>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div className="flex-1">
                  <p className="text-lg text-zinc-600 leading-relaxed line-clamp-4">
                    {truncateDescription(job.description || "")}
                  </p>
                </div>
                <div className="flex flex-col gap-3 text-base flex-shrink-0">
                  <p className="truncate">
                    <span className="font-semibold text-blue-600 text-lg">
                      {job.pay || "Competitive Salary"}
                    </span>
                  </p>
                  <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
                    Remote Position
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </ClientsSwiper>
  );
}
