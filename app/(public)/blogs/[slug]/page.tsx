import { notFound } from "next/navigation";
import Image from "next/image";
import { getBlogBySlug, getRelatedBlogs, getAllBlogs } from "@/lib/mdx";
import { BlogAuthor } from "@/components/blog/blog-author";
import { BlogCard } from "@/components/blog/blog-card";
import { MDXContent } from "@/components/blog/mdx-component"; // ← NEW IMPORT
import { formatDate } from "@/lib/utils";
import { Clock, Calendar } from "lucide-react";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found - Access Virtual Jobs",
    };
  }

  const { frontmatter } = blog;

  return {
    title: frontmatter.seo.metaTitle,
    description: frontmatter.seo.metaDescription,
    keywords: frontmatter.seo.keywords,
    authors: [{ name: frontmatter.author.name }],
    openGraph: {
      title: frontmatter.seo.metaTitle,
      description: frontmatter.seo.metaDescription,
      images: [frontmatter.seo.ogImage || frontmatter.coverImage],
      type: "article",
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.updatedAt,
      authors: [frontmatter.author.name],
      tags: frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.seo.metaTitle,
      description: frontmatter.seo.metaDescription,
      images: [frontmatter.seo.ogImage || frontmatter.coverImage],
    },
    alternates: {
      canonical: frontmatter.seo.canonicalUrl,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(slug, 3);
  const { frontmatter, content } = blog;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    image: frontmatter.coverImage,
    author: {
      "@type": "Person",
      name: frontmatter.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Access Virtual Jobs",
      logo: {
        "@type": "ImageObject",
        url: "/images/logo.png",
      },
    },
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt || frontmatter.publishedAt,
    keywords: frontmatter.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-background mt-12 pt-8">
        <header className="max-w-4xl mx-auto px-4 mb-12 mt-12">
          <div className="mb-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={frontmatter.publishedAt}>
                  {formatDate(new Date(frontmatter.publishedAt))}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{frontmatter.readTime} min read</span>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground mb-4 leading-tight">
              {frontmatter.title}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-6">
              {frontmatter.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <BlogAuthor author={frontmatter.author} />
            </div>
          </div>

          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-8">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {frontmatter.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-8">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="max-w-4xl mx-auto px-4">
          <MDXContent content={content} />
        </div>
        <div className="max-w-4xl mx-auto px-4 mt-12 mb-12">
          <div className="border-t border-border pt-8">
            <BlogAuthor author={frontmatter.author} showBio />
          </div>
        </div>

        {relatedBlogs.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 mb-12">
            <div className="border-t border-border pt-12">
              <h2 className="text-lg font-medium text-foreground mb-8">
                Related Articles
              </h2>
              <div className="space-y-0">
                {relatedBlogs.map((relatedBlog) => (
                  <BlogCard key={relatedBlog.slug} blog={relatedBlog} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
