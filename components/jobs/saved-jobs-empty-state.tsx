import { Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SavedJobsEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <Card className="w-full max-w-md bg-background border-none shadow-none">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* Heading */}
          <h3 className="text-lg font-semibold text-foreground mb-3">
            No Saved Jobs Found
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Start exploring jobs and save the ones that interest you. You can
            bookmark jobs to review them later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
