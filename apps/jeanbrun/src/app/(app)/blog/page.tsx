import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
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
  { id: 'fiscalite', label: 'Fiscalite' },
  { id: 'guides', label: 'Guides' },
] as const

// Fonctions utilitaires
function getAllPosts(): BlogPost[] {
  return getAllPostsMeta()
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function getAuthorInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Article vedette - Grande carte avec image
function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Card className="shadow-none">
      <CardContent>
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.image ?? '/images/blog/default.webp'}
            alt={post.imageAlt ?? post.title}
            width={800}
            height={400}
            className="max-h-76 w-full rounded-lg object-cover"
          />
        </Link>
      </CardContent>
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2 py-1">
          <span className="text-base font-semibold">{post.author.name}</span>
          <span className="text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
        </div>
        <CardTitle className="text-3xl font-medium">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3 text-base">
          {post.description}{' '}
          <Link
            href={`/blog/${post.slug}`}
            className="text-card-foreground inline text-sm font-medium"
          >
            Lire la suite
          </Link>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
          <Avatar>
            {post.author.avatar ? (
              <AvatarImage
                src={post.author.avatar}
                alt={post.author.name}
                className="size-8 rounded-full"
              />
            ) : null}
            <AvatarFallback className="rounded-full text-xs">
              {getAuthorInitials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{post.author.name}</span>
            {post.author.bio ? (
              <span className="text-muted-foreground text-xs">{post.author.bio}</span>
            ) : null}
          </div>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Item de liste horizontale (texte + miniature)
function BlogListItem({
  post,
  showSeparator,
}: {
  post: BlogPost
  showSeparator: boolean
}) {
  return (
    <div className="space-y-6">
      <Link
        href={`/blog/${post.slug}`}
        className="flex items-center justify-between gap-6 max-sm:flex-wrap"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2 py-1">
            <span className="font-medium">{post.author.name}</span>
            <span className="text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
          </div>
          <h3 className="mb-3 text-xl font-medium line-clamp-2">{post.title}</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Image
          src={post.image ?? '/images/blog/default.webp'}
          alt={post.imageAlt ?? post.title}
          width={168}
          height={152}
          className="h-38 w-42 shrink-0 rounded-lg object-cover"
        />
      </Link>
      {showSeparator && <Separator />}
    </div>
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
        name: post.author.name,
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

  const allPosts = getAllPosts()

  // Filtrer par categorie
  const filteredPosts =
    selectedCategory === 'all'
      ? allPosts
      : allPosts.filter((post) => post.category === selectedCategory)

  // Page 1 + categorie "all" : le 1er article = vedette, les suivants = liste
  const showFeatured = currentPage === 1 && selectedCategory === 'all'
  const featuredPost = showFeatured ? filteredPosts[0] : undefined
  const sidebarPosts = showFeatured ? filteredPosts.slice(1, 4) : []

  // Articles restants (apres vedette + sidebar)
  const remainingPosts = showFeatured ? filteredPosts.slice(4) : filteredPosts

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = remainingPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const totalPages = Math.ceil(remainingPosts.length / POSTS_PER_PAGE)

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

        {/* Filtres categories */}
        <BlogFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
        />

        {/* Section vedette (page 1, categorie "all") */}
        {featuredPost != null && (
          <section aria-label="Article vedette" className="mb-12 mt-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              {/* Colonne gauche : article vedette */}
              <FeaturedCard post={featuredPost} />

              {/* Colonne droite : 3 articles en liste */}
              {sidebarPosts.length > 0 && (
                <div className="space-y-6">
                  {sidebarPosts.map((post, index) => (
                    <BlogListItem
                      key={post.slug}
                      post={post}
                      showSeparator={index < sidebarPosts.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Articles restants en liste pleine largeur */}
        <section aria-labelledby="articles-title" className="mt-8">
          {!showFeatured && (
            <h2 id="articles-title" className="mb-6 text-2xl font-semibold">
              {selectedCategory === 'all' ? 'Tous les articles' : `Articles ${selectedCategory}`}
            </h2>
          )}

          {paginatedPosts.length > 0 ? (
            <div className="space-y-6">
              {paginatedPosts.map((post, index) => (
                <BlogListItem
                  key={post.slug}
                  post={post}
                  showSeparator={index < paginatedPosts.length - 1}
                />
              ))}
            </div>
          ) : (
            !showFeatured && (
              <div className="py-12 text-center text-muted-foreground">
                <p>Aucun article trouve dans cette categorie.</p>
                <Button asChild variant="link" className="mt-2">
                  <Link href="/blog">Voir tous les articles</Link>
                </Button>
              </div>
            )
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
