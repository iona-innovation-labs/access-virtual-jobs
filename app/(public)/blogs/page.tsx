import { getAllBlogs, getFeaturedBlogs } from "@/lib/mdx";
import { BlogsPageClient } from "./blogs-client";
import { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Blog - Access Virtual Jobs",
  description:
    "Insights, tips, and guidance for navigating the world of VA jobs and remote work.",
  openGraph: {
    title: "AVJ Blog - VA Jobs & Remote Work Insights",
    description:
      "Expert advice and tips for succeeding in VA jobs and remote work.",
    images: ["/images/blog/blog-og-image.jpg"],
  },
};

export default async function BlogsPage() {
  const blogsPath = path.join(process.cwd(), "content/blogs");

  if (fs.existsSync(blogsPath)) {
    const files = fs.readdirSync(blogsPath);
    files.filter((file) => file.endsWith(".mdx"));
  }

  try {
    const [allBlogs, featuredBlogs] = await Promise.all([
      getAllBlogs(),
      getFeaturedBlogs(3),
    ]);

    return (
      <BlogsPageClient
        initialBlogs={allBlogs}
        initialFeaturedBlogs={featuredBlogs}
      />
    );
  } catch (error) {
    console.error("ERROR loading blogs:", error);
    return <div>Error loading blogs. Check console.</div>;
  }
}
