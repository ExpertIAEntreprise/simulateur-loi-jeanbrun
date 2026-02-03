import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BlogFilters } from './blog-filters'
import { getAllPostsMeta } from '@/lib/blog'
import type { Metadata } from 'next'
import type { BlogPostMeta } from '@/types/blog'
import NavbarWrapper from '@/components/blog/navbar-wrapper'

// Types
type BlogPost = BlogPostMeta

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://simulateur-loi-jeanbrun.vercel.app'
const POSTS_PER_PAGE = 10

// Metadata SEO
export const metadata: Metadata = {
  title: 'Blog',
  description:
    "Conseils d'experts en investissement immobilier et defiscalisation. Articles sur la loi Jeanbrun, LMNP, Pinel et strategies patrimoniales.",
  keywords: [
    'blog immobilier',
    'defiscalisation',
    'loi jeanbrun',
    'investissement locatif',
    'conseils fiscaux',
    'patrimoine immobilier',
  ],
  openGraph: {
    title: 'Blog Investissement Immobilier | Simulateur Loi Jeanbrun',
    description:
      "Conseils d'experts en defiscalisation, actualites de la loi Jeanbrun, et guides pratiques pour reussir votre investissement locatif.",
    type: 'website',
    locale: 'fr_FR',
    url: `${BASE_URL}/blog`,
    siteName: 'Simulateur Loi Jeanbrun',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Investissement Immobilier',
    description:
      "Conseils d'experts en defiscalisation et investissement locatif.",
  },
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
}

// Categories disponibles
const CATEGORIES = [
  { id: 'all', label: 'Tous les articles' },
  { id: 'loi-jeanbrun', label: 'Loi Jeanbrun' },
  { id: 'investissement', label: 'Investissement' },
  { id: 'fiscalite', label: 'Fiscalité' },
  { id: 'guides', label: 'Guides' },
] as const

// Fonctions utilitaires - Utilise les vrais articles MDX
function getAllPosts(): BlogPost[] {
  return getAllPostsMeta()
}

// Formater la date en francais
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

// Composant carte article
function ArticleCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg',
        featured && 'md:col-span-2 md:flex md:flex-row'
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative aspect-video overflow-hidden bg-muted',
          featured && 'md:aspect-auto md:w-1/2'
        )}
      >
        <Image
          src={post.image ?? '/images/blog/default.webp'}
          alt={post.imageAlt ?? post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        {post.featured && (
          <Badge className="absolute left-4 top-4 bg-primary/90">A la une</Badge>
        )}
      </div>

      {/* Content */}
      <div className={cn('flex flex-col', featured && 'md:w-1/2')}>
        <CardHeader>
          <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readingTime} min
            </span>
          </div>
          <CardTitle
            className={cn(
              'line-clamp-2 transition-colors group-hover:text-primary',
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            )}
          >
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription className={cn('line-clamp-3', featured && 'text-base')}>
            {post.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild variant="ghost" className="group/btn p-0">
            <Link href={`/blog/${post.slug}`}>
              Lire l&apos;article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

// JSON-LD pour la page Blog
function BlogJsonLd({ posts }: { posts: BlogPost[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Investissement Immobilier',
    description:
      "Conseils d'experts en defiscalisation et investissement locatif",
    url: `${BASE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Expert IA Entreprise',
      url: 'https://expert-ia-entreprise.fr',
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      url: `${BASE_URL}/blog/${post.slug}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// Page Blog - Server Component
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const params = await searchParams
  const selectedCategory = params.category ?? 'all'
  const currentPage = parseInt(params.page ?? '1', 10)

  // TODO: Remplacer par getAllPosts() de src/lib/blog.ts quand disponible
  const allPosts = getAllPosts()

  // Filtrer par categorie
  const filteredPosts =
    selectedCategory === 'all'
      ? allPosts
      : allPosts.filter((post) => post.category === selectedCategory)

  // Articles mis en avant (max 2)
  const featuredPosts =
    currentPage === 1 && selectedCategory === 'all'
      ? filteredPosts.filter((post) => post.featured).slice(0, 2)
      : []

  // IDs des articles affichés dans la section "A la une"
  const featuredSlugs = new Set(featuredPosts.map((post) => post.slug))

  // Articles pagines (sans ceux déjà affichés en featured)
  const regularPosts =
    currentPage === 1 && selectedCategory === 'all'
      ? filteredPosts.filter((post) => !featuredSlugs.has(post.slug))
      : filteredPosts

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = regularPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  // Total pages
  const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE)

  return (
    <>
      <BlogJsonLd posts={allPosts} />

      {/* Navbar */}
      <NavbarWrapper />

      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="py-8 text-center md:py-12">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Blog Investissement Immobilier
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Conseils d&apos;experts en defiscalisation, actualites de la loi Jeanbrun, et guides
            pratiques pour reussir votre investissement locatif.
          </p>
        </header>

        {/* Filtres categories - Client Component */}
        <BlogFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
        />

        {/* Articles a la une (page 1 seulement, categorie "all") */}
        {featuredPosts.length > 0 && (
          <section aria-labelledby="featured-title" className="mb-12">
            <h2 id="featured-title" className="mb-6 text-2xl font-semibold">
              A la une
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* Liste des articles */}
        <section aria-labelledby="articles-title">
          <h2 id="articles-title" className="mb-6 text-2xl font-semibold">
            {selectedCategory === 'all' ? 'Tous les articles' : `Articles ${selectedCategory}`}
          </h2>

          {paginatedPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>Aucun article trouve dans cette categorie.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/blog">Voir tous les articles</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Button asChild variant="outline">
                <Link
                  href={`/blog?category=${selectedCategory}&page=${currentPage - 1}`}
                  aria-label="Page precedente"
                >
                  Precedent
                </Link>
              </Button>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  asChild
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="icon"
                >
                  <Link
                    href={`/blog?category=${selectedCategory}&page=${page}`}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </Link>
                </Button>
              ))}
            </div>

            {currentPage < totalPages && (
              <Button asChild variant="outline">
                <Link
                  href={`/blog?category=${selectedCategory}&page=${currentPage + 1}`}
                  aria-label="Page suivante"
                >
                  Suivant
                </Link>
              </Button>
            )}
          </nav>
        )}

        {/* CTA Newsletter */}
        <section
          aria-labelledby="newsletter-title"
          className="mt-16 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center md:p-12"
        >
          <h2 id="newsletter-title" className="text-2xl font-bold md:text-3xl">
            Restez informe des actualites fiscales
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Recevez nos derniers articles et conseils directement dans votre boite mail.
            Defiscalisation, loi Jeanbrun, investissement locatif...
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Lancer ma simulation gratuite
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
