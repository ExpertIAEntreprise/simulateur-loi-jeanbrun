'use client'

import { Facebook, Link2, Linkedin, Share2, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Lien copie dans le presse-papiers')
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Partager
      </span>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8"
          aria-label="Partager sur Twitter"
        >
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8"
          aria-label="Partager sur LinkedIn"
        >
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8"
          aria-label="Partager sur Facebook"
        >
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          aria-label="Copier le lien"
          onClick={copyToClipboard}
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
