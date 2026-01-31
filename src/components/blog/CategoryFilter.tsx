"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BlogCategory, BLOG_CATEGORIES } from "@/types/blog"

interface CategoryFilterProps {
  /** Currently selected category (null = all) */
  selectedCategory?: BlogCategory | null
  /** Base path for category links */
  basePath?: string
  /** Article counts per category */
  counts?: Partial<Record<BlogCategory, number>>
  /** Total article count (for "Tous" button) */
  totalCount?: number
  /** Additional CSS classes */
  className?: string
}

const categories = Object.values(BLOG_CATEGORIES)

/**
 * CategoryFilter - Filter buttons for blog categories
 *
 * Features:
 * - "Tous" button to show all articles
 * - Dynamic category buttons from BLOG_CATEGORIES
 * - Visual indication of active category
 * - Optional article count badges
 * - Fully accessible with ARIA
 */
export function CategoryFilter({
  selectedCategory = null,
  basePath = "/blog",
  counts,
  totalCount,
  className,
}: CategoryFilterProps) {
  return (
    <nav
      className={cn("flex flex-wrap gap-2", className)}
      aria-label="Filtrer par categorie"
    >
      {/* "All" button */}
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        asChild
      >
        <Link
          href={basePath}
          aria-current={selectedCategory === null ? "page" : undefined}
        >
          Tous
          {totalCount !== undefined && (
            <span className="ml-1.5 text-xs opacity-70">({totalCount})</span>
          )}
        </Link>
      </Button>

      {/* Category buttons */}
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.slug
        const href = `${basePath}/categorie/${cat.slug}`
        const count = counts?.[cat.slug]

        return (
          <Button
            key={cat.slug}
            variant={isActive ? "default" : "outline"}
            size="sm"
            asChild
            title={cat.description}
          >
            <Link href={href} aria-current={isActive ? "page" : undefined}>
              {cat.name}
              {count !== undefined && (
                <span className="ml-1.5 text-xs opacity-70">({count})</span>
              )}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
