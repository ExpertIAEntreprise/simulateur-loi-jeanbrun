/**
 * Blog types for MDX articles and metadata
 */

/**
 * Blog categories for article classification
 */
export type BlogCategory =
  | "fiscalite"
  | "loi-jeanbrun"
  | "investissement"
  | "actualites"
  | "guides";

/**
 * Blog category metadata
 */
export interface BlogCategoryMeta {
  slug: BlogCategory;
  name: string;
  description: string;
}

/**
 * Blog author information
 */
export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
  url?: string;
}

/**
 * Frontmatter data extracted from MDX files
 */
export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  image?: string;
  imageAlt?: string;
  featured?: boolean;
  draft?: boolean;
}

/**
 * Full blog post with computed fields
 */
export interface BlogPost extends BlogFrontmatter {
  slug: string;
  readingTime: number;
  content: string;
}

/**
 * Blog post metadata without content (for listings)
 */
export type BlogPostMeta = Omit<BlogPost, "content">;

/**
 * Pagination information for blog listings
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Blog listing response with pagination
 */
export interface BlogListResponse {
  posts: BlogPostMeta[];
  pagination: PaginationInfo;
}

/**
 * Available blog categories with metadata
 */
export const BLOG_CATEGORIES: Record<BlogCategory, BlogCategoryMeta> = {
  fiscalite: {
    slug: "fiscalite",
    name: "Fiscalite",
    description:
      "Articles sur la fiscalite immobiliere et les optimisations fiscales",
  },
  "loi-jeanbrun": {
    slug: "loi-jeanbrun",
    name: "Loi Jeanbrun",
    description:
      "Tout savoir sur la loi Jeanbrun PLF 2026 et ses avantages fiscaux",
  },
  investissement: {
    slug: "investissement",
    name: "Investissement",
    description: "Conseils et strategies pour investir dans l'immobilier",
  },
  actualites: {
    slug: "actualites",
    name: "Actualites",
    description:
      "Les dernieres actualites du marche immobilier et de la legislation",
  },
  guides: {
    slug: "guides",
    name: "Guides",
    description: "Guides pratiques pour vos projets immobiliers",
  },
};

/**
 * Default author for articles
 */
export const DEFAULT_AUTHOR: BlogAuthor = {
  name: "Expert IA Entreprise",
  bio: "Specialiste en fiscalite immobiliere et solutions IA",
  url: "https://expert-ia-entreprise.fr",
};
