import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { BlogPostMeta } from "@/types/blog"
import { ArticleCard } from "./ArticleCard"

interface RelatedArticlesProps {
  /** Related articles to display */
  articles: BlogPostMeta[]
  /** Section title */
  title?: string
  /** Maximum number of articles to show */
  maxArticles?: number
  /** Show separator above section */
  showSeparator?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * RelatedArticles - Displays a grid of related/similar articles
 *
 * Features:
 * - Configurable max articles (default: 3)
 * - Optional separator above section
 * - Responsive grid (1-2-3 columns)
 * - Accessible with proper heading structure
 * - Returns null if no articles
 */
export function RelatedArticles({
  articles,
  title = "Articles similaires",
  maxArticles = 3,
  showSeparator = true,
  className,
}: RelatedArticlesProps) {
  // Don't render if no related articles
  if (articles.length === 0) {
    return null
  }

  // Limit to maxArticles
  const displayedArticles = articles.slice(0, maxArticles)

  return (
    <aside className={cn("mt-12", className)} aria-labelledby="related-articles-title">
      {showSeparator && <Separator className="mb-8" />}

      <h2
        id="related-articles-title"
        className="mb-6 text-2xl font-bold tracking-tight"
      >
        {title}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </aside>
  )
}
