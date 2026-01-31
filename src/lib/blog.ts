import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  BlogCategory,
  BlogFrontmatter,
  BlogPost,
  BlogPostMeta,
  BlogListResponse,
} from "@/types/blog";

/**
 * Path to the blog content directory
 */
const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Get all MDX file paths from the blog directory
 */
function getMDXFiles(): string[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));
}

/**
 * Parse frontmatter and validate required fields
 */
function parseFrontmatter(
  data: Record<string, unknown>
): BlogFrontmatter | null {
  // Validate required fields
  if (
    typeof data.title !== "string" ||
    typeof data.description !== "string" ||
    typeof data.date !== "string" ||
    typeof data.category !== "string" ||
    !Array.isArray(data.tags)
  ) {
    return null;
  }

  // Parse author (can be string or object)
  let author: BlogFrontmatter["author"];
  if (typeof data.author === "string") {
    author = { name: data.author };
  } else if (
    typeof data.author === "object" &&
    data.author !== null &&
    "name" in data.author &&
    typeof data.author.name === "string"
  ) {
    const authorObj = data.author as Record<string, unknown>;
    // Build author object, only including optional fields if they have values
    const authorResult: BlogFrontmatter["author"] = {
      name: authorObj.name as string,
    };
    if (typeof authorObj.avatar === "string") {
      authorResult.avatar = authorObj.avatar;
    }
    if (typeof authorObj.bio === "string") {
      authorResult.bio = authorObj.bio;
    }
    if (typeof authorObj.url === "string") {
      authorResult.url = authorObj.url;
    }
    author = authorResult;
  } else {
    return null;
  }

  // Build frontmatter object, only including optional fields if they have values
  const frontmatter: BlogFrontmatter = {
    title: data.title,
    description: data.description,
    date: data.date,
    author,
    category: data.category as BlogCategory,
    tags: data.tags.filter((tag): tag is string => typeof tag === "string"),
    featured: typeof data.featured === "boolean" ? data.featured : false,
    draft: typeof data.draft === "boolean" ? data.draft : false,
  };

  if (typeof data.image === "string") {
    frontmatter.image = data.image;
  }
  if (typeof data.imageAlt === "string") {
    frontmatter.imageAlt = data.imageAlt;
  }

  return frontmatter;
}

/**
 * Read and parse a single MDX file
 */
function readMDXFile(filePath: string): BlogPost | null {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const frontmatter = parseFrontmatter(data);
  if (!frontmatter) {
    console.warn(`Invalid frontmatter in ${filePath}`);
    return null;
  }

  // Skip draft posts in production
  if (frontmatter.draft && process.env.NODE_ENV === "production") {
    return null;
  }

  const slug = path.basename(filePath, ".mdx");
  const readingStats = readingTime(content);

  return {
    ...frontmatter,
    slug,
    readingTime: Math.ceil(readingStats.minutes),
    content,
  };
}

/**
 * Convert BlogPost to BlogPostMeta (without content)
 */
function toMeta(post: BlogPost): BlogPostMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content: _, ...meta } = post;
  return meta;
}

/**
 * Sort posts by date (newest first)
 */
function sortByDate<T extends { date: string }>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get all blog posts with metadata and content
 * @param options.includeDrafts - Include draft posts (default: false in production)
 */
export function getAllPosts(options?: { includeDrafts?: boolean }): BlogPost[] {
  const files = getMDXFiles();
  const posts: BlogPost[] = [];

  for (const file of files) {
    const filePath = path.join(BLOG_CONTENT_DIR, file);
    const post = readMDXFile(filePath);

    if (post) {
      // Skip drafts unless explicitly included
      if (post.draft && !options?.includeDrafts) {
        continue;
      }
      posts.push(post);
    }
  }

  return sortByDate(posts);
}

/**
 * Get all blog posts metadata (without content)
 * More efficient for listing pages
 */
export function getAllPostsMeta(options?: {
  includeDrafts?: boolean;
}): BlogPostMeta[] {
  return getAllPosts(options).map(toMeta);
}

/**
 * Get a single blog post by slug
 * @param slug - The post slug (filename without .mdx extension)
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return readMDXFile(filePath);
}

/**
 * Get posts filtered by category
 * @param category - The category to filter by
 */
export function getPostsByCategory(category: BlogCategory): BlogPostMeta[] {
  return getAllPostsMeta().filter((post) => post.category === category);
}

/**
 * Get posts filtered by tag
 * @param tag - The tag to filter by
 */
export function getPostsByTag(tag: string): BlogPostMeta[] {
  const normalizedTag = tag.toLowerCase();
  return getAllPostsMeta().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === normalizedTag)
  );
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(): BlogPostMeta[] {
  return getAllPostsMeta().filter((post) => post.featured);
}

/**
 * Get related posts based on category and tags
 * @param currentSlug - The current post slug to exclude
 * @param category - The category to match
 * @param tags - The tags to match
 * @param limit - Maximum number of related posts to return
 */
export function getRelatedPosts(
  currentSlug: string,
  category: BlogCategory,
  tags: string[],
  limit: number = 3
): BlogPostMeta[] {
  const allPosts = getAllPostsMeta().filter((p) => p.slug !== currentSlug);

  // Score posts by relevance
  const scoredPosts = allPosts.map((post) => {
    let score = 0;

    // Same category: +2 points
    if (post.category === category) {
      score += 2;
    }

    // Matching tags: +1 point each
    const normalizedTags = tags.map((t) => t.toLowerCase());
    for (const tag of post.tags) {
      if (normalizedTags.includes(tag.toLowerCase())) {
        score += 1;
      }
    }

    return { post, score };
  });

  // Sort by score and return top results
  return scoredPosts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

/**
 * Get paginated posts
 * @param page - Page number (1-indexed)
 * @param limit - Posts per page
 * @param category - Optional category filter
 */
export function getPaginatedPosts(
  page: number = 1,
  limit: number = 10,
  category?: BlogCategory
): BlogListResponse {
  let posts = getAllPostsMeta();

  if (category) {
    posts = posts.filter((p) => p.category === category);
  }

  const totalItems = posts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);

  return {
    posts: paginatedPosts,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: limit,
    },
  };
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): string[] {
  const posts = getAllPostsMeta();
  const tagsSet = new Set<string>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagsSet.add(tag);
    }
  }

  return Array.from(tagsSet).sort();
}

/**
 * Get all post slugs (useful for static generation)
 */
export function getAllSlugs(): string[] {
  return getAllPostsMeta().map((post) => post.slug);
}

/**
 * Search posts by query string
 * Searches in title, description, and tags
 * @param query - Search query
 */
export function searchPosts(query: string): BlogPostMeta[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  return getAllPostsMeta().filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = post.description
      .toLowerCase()
      .includes(normalizedQuery);
    const tagsMatch = post.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery)
    );

    return titleMatch || descriptionMatch || tagsMatch;
  });
}
