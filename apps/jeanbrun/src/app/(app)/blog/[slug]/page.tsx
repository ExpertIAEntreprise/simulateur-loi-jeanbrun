import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  User,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getPostBySlug, getAllSlugs, getRelatedPosts } from '@/lib/blog'
import type { BlogPostMeta, BlogCategory } from '@/types/blog'
import { ShareButtons } from './share-buttons'
import type { Metadata } from 'next'
import type { Components } from 'react-markdown'
import NavbarWrapper from '@/components/blog/navbar-wrapper'

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://simulateur-loi-jeanbrun.vercel.app'

// Formater la date en francais
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

// Custom components for ReactMarkdown
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 mt-8 scroll-mt-20 text-4xl font-bold tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-8 scroll-mt-20 text-3xl font-semibold tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-6 scroll-mt-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-4 scroll-mt-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-muted-foreground">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-7 text-muted-foreground">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded bg-muted p-4 font-mono text-sm">
          {children}
        </code>
      )
    }
    return (
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm font-semibold">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-muted">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  th: ({ children, style }) => {
    const alignment = style?.textAlign || 'left'
    const alignClass =
      alignment === 'center' ? 'text-center' :
      alignment === 'right' ? 'text-right' :
      'text-left'
    return (
      <th className={`px-4 py-3 font-semibold ${alignClass}`}>
        {children}
      </th>
    )
  },
  td: ({ children, style }) => {
    const alignment = style?.textAlign || 'left'
    const alignClass =
      alignment === 'center' ? 'text-center' :
      alignment === 'right' ? 'text-right' :
      'text-left'
    return (
      <td className={`px-4 py-3 ${alignClass}`}>
        {children}
      </td>
    )
  },
  tr: ({ children }) => (
    <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
  ),
  a: ({ href, children }) => {
    const isInternal = href?.startsWith('/') || href?.startsWith('#')
    if (isInternal && href) {
      return (
        <Link
          href={href}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {children}
      </a>
    )
  },
  hr: () => <hr className="my-8 border-border" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
}

// Generer les params statiques pour SSG
export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// Generer les metadata dynamiques
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Article non trouve',
      description: "Cet article n'existe pas.",
    }
  }

  const articleUrl = `${BASE_URL}/blog/${post.slug}`

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      locale: 'fr_FR',
      url: articleUrl,
      siteName: 'Simulateur Loi Jeanbrun',
      publishedTime: post.date,
      authors: [post.author.name],
      images: post.image
        ? [
            {
              url: `${BASE_URL}${post.image}`,
              width: 1200,
              height: 630,
              alt: post.imageAlt ?? post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [`${BASE_URL}${post.image}`] : [],
    },
    alternates: {
      canonical: articleUrl,
    },
  }
}

// Composant RelatedArticles
function RelatedArticles({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="related-title" className="mt-12">
      <h2 id="related-title" className="mb-6 text-2xl font-semibold">
        Articles similaires
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} className="group overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-muted">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.imageAlt ?? post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <span className="text-4xl text-primary/30">📰</span>
                </div>
              )}
            </div>
            <CardHeader className="p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <span>{post.readingTime} min</span>
              </div>
              <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

// Page Article
export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const articleUrl = `${BASE_URL}/blog/${post.slug}`
  const relatedPosts = getRelatedPosts(post.slug, post.category as BlogCategory, post.tags)

  // JSON-LD Article Schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image ? `${BASE_URL}${post.image}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Expert IA Entreprise',
      url: 'https://expert-ia-entreprise.fr',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readingTime}M`,
  }

  // JSON-LD BreadcrumbList Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Navbar */}
      <NavbarWrapper />

      <article className="container mx-auto px-4">
        {/* Breadcrumb specifique article */}
        <nav aria-label="Fil d'Ariane article" className="mb-4 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <span className="text-foreground">{post.category}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mx-auto max-w-4xl">
          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Badge>{post.category}</Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readingTime} min de lecture
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" aria-hidden="true" />
              {post.author.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Description */}
          <p className="mb-6 text-xl text-muted-foreground">{post.description}</p>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Share */}
          <div className="mb-8">
            <ShareButtons url={articleUrl} title={post.title} />
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-muted">
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="mx-auto max-w-3xl">
          {/* Article Content - MDX rendered with ReactMarkdown */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-pre:bg-muted">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <Separator className="my-12" />

          {/* CTA Simulateur */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">Calculez votre economie d&apos;impot</h2>
              <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
                Utilisez notre simulateur gratuit pour estimer votre reduction d&apos;impot avec la
                loi Jeanbrun. Resultat instantane, sans engagement.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Lancer ma simulation gratuite
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/loi-jeanbrun">En savoir plus sur la loi</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Share bottom */}
          <div className="my-8 flex items-center justify-between">
            <Button asChild variant="ghost">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au blog
              </Link>
            </Button>
            <ShareButtons url={articleUrl} title={post.title} />
          </div>
        </div>

        {/* Related Articles */}
        <div className="mx-auto max-w-4xl">
          <RelatedArticles posts={relatedPosts} />
        </div>
      </article>
    </>
  )
}
