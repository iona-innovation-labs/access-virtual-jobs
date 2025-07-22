"use client";

import { useState } from "react";
import { BlogListItem } from "@/types/blog";
import { BlogList } from "@/components/blog/blog-list";
import { BlogSearch } from "@/components/blog/blog-search";

interface BlogsPageClientProps {
  initialBlogs: BlogListItem[];
  initialFeaturedBlogs: BlogListItem[];
}

function clientSearchBlogs(
  blogs: BlogListItem[],
  query: string
): BlogListItem[] {
  if (query.length < 2) return blogs;

  const searchTerms = query.toLowerCase().split(" ");

  return blogs.filter((blog) => {
    const titleLower = blog.title.toLowerCase();
    const excerptLower = blog.excerpt.toLowerCase();
    const tagsLower = blog.tags.join(" ").toLowerCase();

    return searchTerms.some(
      (term) =>
        titleLower.includes(term) ||
        excerptLower.includes(term) ||
        tagsLower.includes(term)
    );
  });
}

export function BlogsPageClient({
  initialBlogs,
  initialFeaturedBlogs,
}: BlogsPageClientProps) {
  const [displayedBlogs, setDisplayedBlogs] =
    useState<BlogListItem[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);

    if (query.length === 0) {
      setDisplayedBlogs(initialBlogs);
      return;
    }

    if (query.length < 2) {
      setDisplayedBlogs([]);
      return;
    }

    const filteredBlogs = clientSearchBlogs(initialBlogs, query);
    setDisplayedBlogs(filteredBlogs);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <div className="mb-8 pt-12">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            AVJ Blog
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Insights, tips, and guidance for navigating the world of virtual
            jobs and remote work.
          </p>

          <div className="max-w-sm">
            <BlogSearch
              onSearch={handleSearch}
              placeholder="Search..."
              className="w-full"
            />
          </div>
        </div>

        {isSearching && (
          <div className="mb-8">
            <p className="text-muted-foreground">
              {displayedBlogs.length > 0
                ? `Found ${displayedBlogs.length} article${displayedBlogs.length === 1 ? "" : "s"} for "${searchQuery}"`
                : `No articles found for "${searchQuery}"`}
            </p>
          </div>
        )}

        <BlogList
          blogs={displayedBlogs}
          showFeatured={!isSearching && initialFeaturedBlogs.length > 0}
        />

        {displayedBlogs.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">
              No articles yet
            </h3>
            <p className="text-muted-foreground">
              Check back soon for the latest insights on remote work and virtual
              jobs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
