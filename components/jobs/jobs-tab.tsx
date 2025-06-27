"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Bookmark } from "lucide-react";

interface JobsTabsProps {
  currentTab: string;
  bookmarkCount: number;
  isLoggedIn: boolean;
}

export function JobsTabs({
  currentTab,
  bookmarkCount,
  isLoggedIn,
}: JobsTabsProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams();

    // Only keep the tab parameter, reset everything else
    if (value !== "explore") {
      params.set("tab", value);
    }

    const url = params.toString()
      ? `/app/jobs?${params.toString()}`
      : "/app/jobs";
    router.push(url);
  };

  return (
    <div className="py-4">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/30">
          <TabsTrigger
            value="explore"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Explore Jobs</span>
            <span className="sm:hidden">Explore</span>
          </TabsTrigger>

          <TabsTrigger
            value="saved"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            disabled={!isLoggedIn}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Saved Jobs</span>
            <span className="sm:hidden">Saved</span>
            {isLoggedIn && bookmarkCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 min-w-[20px] px-1.5 bg-brand/10 text-brand text-xs"
              >
                {bookmarkCount > 99 ? "99+" : bookmarkCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {!isLoggedIn && (
        <p className="text-xs text-muted-foreground mt-2">
          Log in to save and view your bookmarked jobs
        </p>
      )}
    </div>
  );
}
