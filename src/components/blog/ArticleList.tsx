import { cn } from "@/lib/utils"
import { BlogPostMeta } from "@/types/blog"
import { ArticleCard } from "./ArticleCard"

interface ArticleListProps {
  /** Array of articles to display */
  articles: BlogPostMeta[]
  /** Optional section title */
  title?: string
  /** Message shown when no articles */
  emptyMessage?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * ArticleList - Responsive grid of article cards
 *
 * Features:
 * - 1 column on mobile
 * - 2 columns on tablet (sm)
 * - 3 columns on desktop (lg)
 * - Optional section title
 * - Empty state handling
 * - First 3 articles have image priority for LCP
 */
export function ArticleList({
  articles,
  title,
  emptyMessage = "Aucun article trouve.",
  className,
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <section
        className={cn("py-12 text-center", className)}
        aria-label={title ?? "Liste des articles"}
      >
        {title && (
          <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
        )}
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section
      className={className}
      aria-labelledby={title ? "article-list-title" : undefined}
    >
      {title && (
        <h2
          id="article-list-title"
          className="mb-8 text-2xl font-bold tracking-tight md:text-3xl"
        >
          {title}
        </h2>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.slug}
            article={article}
            priority={index < 3}
          />
        ))}
      </div>
    </section>
  )
}
