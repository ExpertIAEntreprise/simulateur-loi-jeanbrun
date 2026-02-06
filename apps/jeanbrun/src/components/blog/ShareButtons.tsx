"use client"

import { useState } from "react"
import {
  Facebook,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ShareButtonsProps {
  /** Article URL to share */
  url: string
  /** Article title for share text */
  title: string
  /** Additional CSS classes */
  className?: string
  /** Show labels next to icons */
  showLabels?: boolean
}

type SharePlatform = "twitter" | "linkedin" | "facebook" | "copy"

const shareConfig: Record<
  SharePlatform,
  {
    label: string
    icon: typeof Twitter
    getUrl: (url: string, title: string) => string
  }
> = {
  twitter: {
    label: "Twitter",
    icon: Twitter,
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    getUrl: (url, _title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    getUrl: (url, _title) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  copy: {
    label: "Copier le lien",
    icon: LinkIcon,
    getUrl: () => "",
  },
}

/**
 * ShareButtons - Social sharing buttons
 *
 * Features:
 * - Twitter, LinkedIn, Facebook share buttons
 * - Copy link to clipboard with visual feedback
 * - Optional text labels
 * - Popup window for sharing (better UX)
 * - Accessible with ARIA labels
 */
export function ShareButtons({
  url,
  title,
  className,
  showLabels = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may fail in some contexts (e.g., insecure origins)
      // Silently fail as copy is a nice-to-have feature
    }
  }

  const handleShare = (platform: SharePlatform) => {
    if (platform === "copy") {
      handleCopyLink()
      return
    }

    const config = shareConfig[platform]
    const shareUrl = config.getUrl(url, title)

    // Open in popup window for better UX
    const width = 600
    const height = 400
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2

    window.open(
      shareUrl,
      "share",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    )
  }

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label="Partager cet article"
    >
      {(Object.keys(shareConfig) as SharePlatform[]).map((platform) => {
        const config = shareConfig[platform]
        const Icon = platform === "copy" && copied ? Check : config.icon

        return (
          <Button
            key={platform}
            variant="outline"
            size={showLabels ? "sm" : "icon"}
            onClick={() => handleShare(platform)}
            aria-label={
              platform === "copy" && copied
                ? "Lien copie"
                : `Partager sur ${config.label}`
            }
            className={cn(
              platform === "copy" && copied && "text-green-600 border-green-600"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {showLabels && (
              <span className="ml-2">
                {platform === "copy" && copied ? "Copie !" : config.label}
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}
