export interface BlogFrontmatter {
  title: string;
  excerpt: string;
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured: boolean;
  status: "draft" | "published" | "archived";
  readTime: number;
  coverImage: string;
  seo: BlogSEO;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface BlogSEO {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: any;
}

export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string;
  author: BlogAuthor;
  publishedAt: Date;
  tags: string[];
  featured: boolean;
  readTime: number;
  coverImage: string;
}

export interface BlogSearchResult {
  slug: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
}

export interface BlogConfig {
  postsPerPage: number;
  featuredPostsCount: number;
  searchMinLength: number;
  defaultAuthor: BlogAuthor;
  defaultSEO: Partial<BlogSEO>;
}

export interface BlogCardProps {
  blog: BlogListItem;
  featured?: boolean;
  className?: string;
}

export interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export interface BlogFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  className?: string;
}

export interface BlogLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  coverImage?: string;
}

export type SortOrder = "asc" | "desc";
export type SortBy = "publishedAt" | "title" | "readTime";

export interface BlogSortOptions {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface BlogPaginationOptions {
  page: number;
  limit: number;
}

export interface BlogFilterOptions {
  tags?: string[];
  featured?: boolean;
  author?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface BlogMetadata {
  totalPosts: number;
  lastUpdated: string;
  tags: string[];
  authors: BlogAuthor[];
  featuredPosts: BlogListItem[];
}
