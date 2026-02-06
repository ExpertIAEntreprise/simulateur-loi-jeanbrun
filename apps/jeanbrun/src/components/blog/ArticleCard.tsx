import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BlogPostMeta, BLOG_CATEGORIES } from "@/types/blog"

interface ArticleCardProps {
  /** Article metadata to display */
  article: BlogPostMeta
  /** Load image with priority (for above-the-fold content) */
  priority?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Format ISO date string to French short locale
 */
function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

/**
 * ArticleCard - Card component for displaying a blog article preview
 *
 * Features:
 * - Hero image with lazy loading (or priority for LCP)
 * - Category badge with link
 * - Title and description with line clamping
 * - Date and reading time metadata
 * - Fully responsive
 * - Accessible with proper ARIA labels
 */
export function ArticleCard({
  article,
  priority = false,
  className,
}: ArticleCardProps) {
  const {
    slug,
    title,
    description,
    image,
    imageAlt,
    category,
    date,
    readingTime,
  } = article

  const categoryMeta = BLOG_CATEGORIES[category]

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Image */}
      <Link
        href={`/blog/${slug}`}
        className="relative block aspect-video overflow-hidden bg-muted"
        aria-label={`Lire l'article : ${title}`}
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-4xl text-primary/40">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      <CardHeader className="flex-1 space-y-2">
        {/* Category badge */}
        <div className="flex items-center gap-2">
          <Link href={`/blog/categorie/${category}`}>
            <Badge
              variant="secondary"
              className="transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {categoryMeta.name}
            </Badge>
          </Link>
        </div>

        {/* Title */}
        <CardTitle className="line-clamp-2 text-lg leading-snug">
          <Link
            href={`/blog/${slug}`}
            className="transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </CardTitle>

        {/* Description */}
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3.5" aria-hidden="true" />
            <time dateTime={date}>{formatDateShort(date)}</time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            <span>{readingTime} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
