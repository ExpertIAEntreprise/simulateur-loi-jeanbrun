import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  className?: string
}

/**
 * Generate page numbers to display with ellipsis for large ranges
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = []
  const delta = 1 // Number of pages to show around current page

  // Always show first page
  pages.push(1)

  // Calculate range around current page
  const rangeStart = Math.max(2, currentPage - delta)
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

  // Add ellipsis if there's a gap after first page
  if (rangeStart > 2) {
    pages.push("ellipsis")
  }

  // Add pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  // Add ellipsis if there's a gap before last page
  if (rangeEnd < totalPages - 1) {
    pages.push("ellipsis")
  }

  // Always show last page (if more than 1 page)
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
}

/**
 * Build URL for a specific page
 */
function buildPageUrl(basePath: string, page: number): string {
  if (page === 1) {
    return basePath
  }
  // Handle paths that may already have query params
  const separator = basePath.includes("?") ? "&" : "?"
  return `${basePath}${separator}page=${page}`
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  className,
}: PaginationProps) {
  // Don't render if only 1 page
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages)
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination des articles"
    >
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrevious}
        asChild={hasPrevious}
        aria-label="Page precedente"
      >
        {hasPrevious ? (
          <Link href={buildPageUrl(basePath, currentPage - 1)} rel="prev">
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Precedent</span>
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Precedent</span>
          </span>
        )}
      </Button>

      {/* Page numbers - hidden on mobile */}
      <div className="hidden items-center gap-1 sm:flex">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex size-9 items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
                <MoreHorizontal className="size-4" />
              </span>
            )
          }

          const isCurrentPage = page === currentPage

          return (
            <Button
              key={page}
              variant={isCurrentPage ? "default" : "outline"}
              size="icon"
              asChild={!isCurrentPage}
              aria-label={`Page ${page}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {isCurrentPage ? (
                <span>{page}</span>
              ) : (
                <Link href={buildPageUrl(basePath, page)}>{page}</Link>
              )}
            </Button>
          )
        })}
      </div>

      {/* Mobile page indicator */}
      <span className="px-3 text-sm text-muted-foreground sm:hidden">
        Page {currentPage} sur {totalPages}
      </span>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        asChild={hasNext}
        aria-label="Page suivante"
      >
        {hasNext ? (
          <Link href={buildPageUrl(basePath, currentPage + 1)} rel="next">
            <span className="sr-only sm:not-sr-only sm:mr-1">Suivant</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span>
            <span className="sr-only sm:not-sr-only sm:mr-1">Suivant</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </Button>
    </nav>
  )
}
