import { BlogListItem } from "@/types/blog";
import { BlogCard } from "./blog-card";

interface BlogListProps {
  blogs: BlogListItem[];
  showFeatured?: boolean;
  className?: string;
}

export function BlogList({
  blogs,
  showFeatured = false,
  className = "",
}: BlogListProps) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-base font-medium text-foreground mb-2">
          No articles found
        </h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or browse all articles.
        </p>
      </div>
    );
  }

  const featuredBlogs = showFeatured
    ? blogs.filter((blog) => blog.featured)
    : [];
  const regularBlogs = showFeatured
    ? blogs.filter((blog) => !blog.featured)
    : blogs;

  return (
    <div className={className}>
      {featuredBlogs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-medium text-foreground mb-4 pb-2 border-b border-border">
            Featured
          </h2>
          <div className="space-y-0">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} featured />
            ))}
          </div>
        </section>
      )}

      {regularBlogs.length > 0 && (
        <section>
          {showFeatured && (
            <h2 className="text-lg font-medium text-foreground mb-4 pb-2 border-b border-border">
              Latest
            </h2>
          )}
          <div className="space-y-0">
            {regularBlogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
