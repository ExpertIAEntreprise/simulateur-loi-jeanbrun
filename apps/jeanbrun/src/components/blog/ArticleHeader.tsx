import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BlogPost, BLOG_CATEGORIES } from "@/types/blog"
import { ArticleMeta } from "./ArticleMeta"

interface ArticleHeaderProps {
  /** Full article data */
  article: BlogPost
  /** Additional CSS classes */
  className?: string
}

/**
 * ArticleHeader - Full header for an article page
 *
 * Features:
 * - Hero image with 21:9 aspect ratio
 * - Category badge with link
 * - Title (h1) with responsive sizing
 * - Author, date, reading time via ArticleMeta
 * - Tags list with links
 * - Fully responsive
 * - Accessible
 */
export function ArticleHeader({ article, className }: ArticleHeaderProps) {
  const {
    title,
    image,
    imageAlt,
    author,
    category,
    tags,
    date,
    readingTime,
  } = article

  const categoryMeta = BLOG_CATEGORIES[category]

  return (
    <header className={cn("mb-8 space-y-6", className)}>
      {/* Hero image with 21:9 aspect ratio for cinematic look */}
      {image && (
        <div className="relative aspect-[21/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-cover"
            priority
          />
          {/* Subtle gradient overlay for depth */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Category badge */}
      <div className="flex items-center gap-2">
        <Link href={`/blog/categorie/${category}`}>
          <Badge
            variant="default"
            className="transition-opacity hover:opacity-80"
          >
            {categoryMeta.name}
          </Badge>
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h1>

      {/* Meta info (author, date, reading time) */}
      <ArticleMeta
        author={author}
        date={date}
        readingTime={readingTime}
        showAvatar
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Tags">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
              role="listitem"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
