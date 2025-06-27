// @/components/jobs/job-list-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function JobListSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
      {/* Loading header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Loading job cards */}
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card
            key={index}
            className="border border-border/50 hover:border-border transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left side - Job info */}
                <div className="flex-1 space-y-3">
                  {/* Job title */}
                  <Skeleton className="h-6 w-3/4" />

                  {/* Company and location */}
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  {/* Job description */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>

                  {/* Job meta (type, category, etc) */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>

                {/* Right side - Salary and apply button */}
                <div className="flex flex-col items-end gap-3 min-w-[200px]">
                  {/* Date posted */}
                  <Skeleton className="h-4 w-24" />

                  {/* Salary */}
                  <Skeleton className="h-6 w-32" />

                  {/* Apply button */}
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}

// Alternative: Simpler skeleton
export function SimpleJobListSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    </div>
  );
}
