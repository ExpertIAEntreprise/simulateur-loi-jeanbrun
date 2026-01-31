"use client"

import { Calendar, Clock, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { BlogAuthor } from "@/types/blog"

interface ArticleMetaProps {
  /** Article author information */
  author: BlogAuthor
  /** Publication date (ISO string) */
  date: string
  /** Reading time in minutes */
  readingTime: number
  /** Show author avatar (default: true) */
  showAvatar?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Format ISO date string to French locale
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

/**
 * Get author initials for avatar fallback
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * ArticleMeta - Displays article metadata
 *
 * Features:
 * - Author with optional avatar
 * - Publication date formatted in French
 * - Reading time estimate
 * - Fully accessible
 */
export function ArticleMeta({
  author,
  date,
  readingTime,
  showAvatar = true,
  className,
}: ArticleMetaProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 text-sm text-muted-foreground",
        className
      )}
    >
      {/* Author */}
      <div className="flex items-center gap-2">
        {showAvatar ? (
          <Avatar className="size-8">
            {author.avatar && (
              <AvatarImage src={author.avatar} alt={author.name} />
            )}
            <AvatarFallback className="text-xs">
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className="size-4" aria-hidden="true" />
        )}
        <span className="font-medium text-foreground">{author.name}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.5">
        <Calendar className="size-4" aria-hidden="true" />
        <time dateTime={date}>{formatDate(date)}</time>
      </div>

      {/* Reading time */}
      <div className="flex items-center gap-1.5">
        <Clock className="size-4" aria-hidden="true" />
        <span>{readingTime} min de lecture</span>
      </div>
    </div>
  )
}
