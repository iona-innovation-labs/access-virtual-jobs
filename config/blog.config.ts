import { BlogConfig, BlogAuthor } from "@/types/blog";

export const blogAuthors: Record<string, BlogAuthor> = {
  "avj-team": {
    name: "AVJ Team",
    role: "Editorial Team",
    avatar: "/images/authors/avj-team.jpg",
    bio: "The Access Virtual Jobs editorial team, dedicated to helping professionals navigate the remote work landscape.",
    social: {
      twitter: "@accessvirtualjobs",
      linkedin: "company/access-virtual-jobs",
    },
  },
  "sarah-chen": {
    name: "Sarah Chen",
    role: "Remote Work Specialist",
    avatar: "/images/authors/sarah-chen.jpg",
    bio: "Sarah is a remote work consultant with over 8 years of experience helping companies transition to distributed teams.",
    social: {
      twitter: "@sarahchen_remote",
      linkedin: "in/sarah-chen-remote",
    },
  },
  "mike-rodriguez": {
    name: "Mike Rodriguez",
    role: "Career Coach",
    avatar: "/images/authors/mike-rodriguez.jpg",
    bio: "Mike specializes in helping professionals find and excel in virtual job opportunities across various industries.",
    social: {
      linkedin: "in/mike-rodriguez-career",
    },
  },
  "emma-thompson": {
    name: "Emma Thompson",
    role: "HR Technology Expert",
    avatar: "/images/authors/emma-thompson.jpg",
    bio: "Emma focuses on the intersection of technology and human resources in remote work environments.",
    social: {
      twitter: "@emmatech_hr",
      linkedin: "in/emma-thompson-hr",
    },
  },
};

export const blogConfig: BlogConfig = {
  postsPerPage: 12,
  featuredPostsCount: 3,
  searchMinLength: 2,
  defaultAuthor: blogAuthors["avj-team"],
  defaultSEO: {
    keywords: [
      "remote work",
      "virtual jobs",
      "career advice",
      "digital nomad",
      "work from home",
    ],
    ogImage: "/images/blog/default-og-image.jpg",
  },
};

export const blogTags = [
  "Remote Work",
  "Career Advice",
  "Job Search",
  "Productivity",
  "Work-Life Balance",
  "Technology",
  "Interviews",
  "Freelancing",
  "Digital Nomad",
  "Team Management",
  "Skills Development",
  "Industry Insights",
] as const;

export type BlogTag = (typeof blogTags)[number];

export const blogSiteConfig = {
  name: "AVJ Blog",
  description:
    "Insights, tips, and guidance for navigating the world of virtual jobs and remote work.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://accessvirtualjobs.com",
  ogImage: "/images/blog/blog-og-image.jpg",
  author: "Access Virtual Jobs",
  social: {
    twitter: "@accessvirtualjobs",
    linkedin: "company/access-virtual-jobs",
  },
};

export const readingTimeConfig = {
  wordsPerMinute: 200, // Average reading speed
  includeImages: true,
  imageReadTime: 12, // seconds per image
};

export const mdxConfig = {
  remarkPlugins: ["remark-gfm", "remark-reading-time", "remark-slug"],
  rehypePlugins: [
    "rehype-highlight",
    "rehype-code-titles",
    "rehype-autolink-headings",
  ],
};
