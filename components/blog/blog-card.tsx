import Image from "next/image";
import Link from "next/link";
import { BlogCardProps } from "@/types/blog";
import { formatDate } from "@/lib/utils";

export function BlogCard({
  blog,
  featured = false,
  className = "",
}: BlogCardProps) {
  return (
    <article className={`w-full ${className}`}>
      <Link href={`/blogs/${blog.slug}`} className="block group">
        <div className="flex gap-4 py-4 border-b border-border hover:bg-muted/30 transition-colors">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-16 md:w-32 md:h-20 overflow-hidden rounded">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span>{blog.author.name}</span>
              <span>•</span>
              <time dateTime={blog.publishedAt.toISOString()}>
                {formatDate(blog.publishedAt)}
              </time>
              <span>•</span>
              <span>{blog.readTime} min read</span>
            </div>

            <h3
              className={`font-medium text-foreground group-hover:text-muted-foreground transition-colors mb-2 line-clamp-2 ${
                featured ? "text-lg md:text-xl" : "text-base md:text-lg"
              }`}
            >
              {blog.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {blog.excerpt}
            </p>

            {blog.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {blog.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
