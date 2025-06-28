import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  BlogPost,
  BlogListItem,
  BlogFrontmatter,
  BlogSearchResult,
} from "@/types/blog";
import { blogAuthors, readingTimeConfig } from "@/config/blog.config";

const BLOGS_PATH = path.join(process.cwd(), "content/blogs");

function calculateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;

  const readingTime = Math.ceil(
    wordCount / readingTimeConfig.wordsPerMinute +
      (imageCount * readingTimeConfig.imageReadTime) / 60
  );

  return Math.max(1, readingTime); // Minimum 1 minute
}

function getBlogFiles(): string[] {
  if (!fs.existsSync(BLOGS_PATH)) {
    return [];
  }

  return fs
    .readdirSync(BLOGS_PATH)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
}

function parseBlogFrontmatter(frontmatter: any, slug: string): BlogFrontmatter {
  const author =
    typeof frontmatter.author === "string"
      ? blogAuthors[frontmatter.author] || blogAuthors["avj-team"]
      : frontmatter.author || blogAuthors["avj-team"];

  console.log(slug);
  return {
    title: frontmatter.title || "Untitled",
    excerpt: frontmatter.excerpt || "",
    author,
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    featured: Boolean(frontmatter.featured),
    status: frontmatter.status || "published",
    readTime: frontmatter.readTime || 5,
    coverImage: frontmatter.coverImage || "/images/blog/default-cover.jpg",
    seo: {
      metaTitle: frontmatter.seo?.metaTitle || frontmatter.title,
      metaDescription: frontmatter.seo?.metaDescription || frontmatter.excerpt,
      ogImage: frontmatter.seo?.ogImage || frontmatter.coverImage,
      keywords: frontmatter.seo?.keywords || [],
      canonicalUrl: frontmatter.seo?.canonicalUrl,
    },
  };
}

export async function getAllBlogs(): Promise<BlogListItem[]> {
  const files = getBlogFiles();

  const blogs = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(".mdx", "");
      const filePath = path.join(BLOGS_PATH, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data: frontmatter, content } = matter(fileContent);

      if (!frontmatter.readTime) {
        frontmatter.readTime = calculateReadingTime(content);
      }

      const parsedFrontmatter = parseBlogFrontmatter(frontmatter, slug);

      return {
        slug,
        title: parsedFrontmatter.title,
        excerpt: parsedFrontmatter.excerpt,
        author: parsedFrontmatter.author,
        publishedAt: new Date(parsedFrontmatter.publishedAt),
        tags: parsedFrontmatter.tags,
        featured: parsedFrontmatter.featured,
        readTime: parsedFrontmatter.readTime,
        coverImage: parsedFrontmatter.coverImage,
      };
    })
  );

  return blogs
    .filter((blog) => {
      const frontmatter = matter(
        fs.readFileSync(path.join(BLOGS_PATH, `${blog.slug}.mdx`), "utf8")
      ).data;
      return frontmatter.status === "published";
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getFeaturedBlogs(
  count: number = 3
): Promise<BlogListItem[]> {
  const allBlogs = await getAllBlogs();
  return allBlogs.filter((blog) => blog.featured).slice(0, count);
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOGS_PATH, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content } = matter(fileContent);

  if (!frontmatter.readTime) {
    frontmatter.readTime = calculateReadingTime(content);
  }

  const parsedFrontmatter = parseBlogFrontmatter(frontmatter, slug);

  if (parsedFrontmatter.status !== "published") {
    return null;
  }

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ],
    },
  });

  return {
    slug,
    frontmatter: parsedFrontmatter,
    content: mdxSource,
  };
}

export async function searchBlogs(query: string): Promise<BlogSearchResult[]> {
  if (query.length < 2) return [];

  const allBlogs = await getAllBlogs();
  const searchTerms = query.toLowerCase().split(" ");

  const results = allBlogs.map((blog) => {
    let score = 0;
    const titleLower = blog.title.toLowerCase();
    const excerptLower = blog.excerpt.toLowerCase();
    const tagsLower = blog.tags.join(" ").toLowerCase();

    searchTerms.forEach((term) => {
      if (titleLower.includes(term)) score += 3;
      if (excerptLower.includes(term)) score += 2;
      if (tagsLower.includes(term)) score += 1;
    });

    return {
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      relevanceScore: score,
    };
  });

  return results
    .filter((result) => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10);
}

export async function getAllTags(): Promise<string[]> {
  const allBlogs = await getAllBlogs();
  const tags = new Set<string>();

  allBlogs.forEach((blog) => {
    blog.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export async function getBlogsByTag(tag: string): Promise<BlogListItem[]> {
  const allBlogs = await getAllBlogs();
  return allBlogs.filter((blog) =>
    blog.tags.some((blogTag) => blogTag.toLowerCase() === tag.toLowerCase())
  );
}

export async function getRelatedBlogs(
  currentSlug: string,
  count: number = 3
): Promise<BlogListItem[]> {
  const currentBlog = await getBlogBySlug(currentSlug);
  if (!currentBlog) return [];

  const allBlogs = await getAllBlogs();
  const relatedBlogs = allBlogs
    .filter((blog) => blog.slug !== currentSlug)
    .map((blog) => {
      const commonTags = blog.tags.filter((tag) =>
        currentBlog.frontmatter.tags.includes(tag)
      ).length;
      return { ...blog, commonTags };
    })
    .filter((blog) => blog.commonTags > 0)
    .sort((a, b) => b.commonTags - a.commonTags)
    .slice(0, count);

  return relatedBlogs;
}

export async function getBlogSitemapData() {
  const allBlogs = await getAllBlogs();

  return allBlogs.map((blog) => ({
    url: `/blogs/${blog.slug}`,
    lastModified: blog.publishedAt.toISOString(),
    changeFrequency: "weekly" as const,
    priority: blog.featured ? 0.8 : 0.6,
  }));
}
