import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Blog Simulateur Loi Jeanbrun',
    default: 'Blog | Simulateur Loi Jeanbrun',
  },
}

interface BlogLayoutProps {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="blog-layout min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'Ariane"
          className="container mx-auto px-4 py-4"
        >
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Accueil</span>
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <Link
                href="/blog"
                className="transition-colors hover:text-foreground"
              >
                Blog
              </Link>
            </li>
          </ol>
        </nav>

        {/* Content */}
        <div className="pb-16">{children}</div>
    </div>
  )
}
