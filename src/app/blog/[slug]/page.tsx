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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShareButtons } from './share-buttons'
import type { Metadata } from 'next'

// Types
interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  image: string
  imageAlt: string
  readingTime: number
  featured: boolean
  content: string
}

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://simulateur-loi-jeanbrun.vercel.app'

// Articles de demonstration (a remplacer par getAllPosts() et getPostBySlug() de src/lib/blog.ts)
const DEMO_POSTS: BlogPost[] = [
  {
    slug: 'loi-jeanbrun-2026-guide-complet',
    title: 'Loi Jeanbrun 2026 : Guide Complet pour les Investisseurs',
    description:
      'Decouvrez tout ce que vous devez savoir sur la loi Jeanbrun, le nouveau dispositif de defiscalisation immobiliere du PLF 2026.',
    date: '2026-01-30',
    author: 'Expert IA Entreprise',
    category: 'defiscalisation',
    tags: ['loi-jeanbrun', 'plf-2026', 'defiscalisation'],
    image: '/images/blog/loi-jeanbrun-guide.webp',
    imageAlt: 'Guide complet de la loi Jeanbrun 2026',
    readingTime: 12,
    featured: true,
    content: `
## Introduction a la Loi Jeanbrun

La loi Jeanbrun, integree au Projet de Loi de Finances (PLF) 2026, represente une evolution majeure dans le paysage de la defiscalisation immobiliere francaise. Ce dispositif vient remplacer progressivement la loi Pinel, dont les avantages fiscaux ont ete reduits ces dernieres annees.

## Qu'est-ce que la Loi Jeanbrun ?

La loi Jeanbrun est un dispositif fiscal permettant aux investisseurs immobiliers de beneficier d'une reduction d'impot sur le revenu en contrepartie d'un engagement de location. Le bien immobilier doit etre neuf ou en VEFA (Vente en l'Etat Futur d'Achevement) et situe dans une zone tendue.

### Les avantages fiscaux

- **6% de reduction** pour un engagement de 6 ans
- **9% de reduction** pour un engagement de 9 ans
- **12% de reduction** pour un engagement de 12 ans

Ces pourcentages s'appliquent sur le prix d'acquisition du bien, dans la limite de 300 000 euros par an et de 5 500 euros par metre carre.

## Les Zones Eligibles

La loi Jeanbrun s'applique uniquement dans les zones dites "tendues" :

1. **Zone A bis** : Paris et sa proche banlieue
2. **Zone A** : Ile-de-France, Cote d'Azur, agglomerations cheres
3. **Zone B1** : Grandes agglomerations de plus de 250 000 habitants

## Conditions d'Eligibilite

Pour beneficier de la loi Jeanbrun, plusieurs conditions doivent etre respectees :

- Le bien doit etre neuf ou en VEFA
- Le logement doit respecter les normes energetiques RT 2020
- Le loyer doit etre plafonne selon la zone
- Les ressources du locataire doivent etre inferieures aux plafonds
- Le proprietaire doit s'engager a louer pendant la duree choisie

## Comparaison avec la Loi Pinel

| Critere | Loi Jeanbrun | Loi Pinel (2024) |
|---------|--------------|------------------|
| Reduction 6 ans | 6% | 9% |
| Reduction 9 ans | 9% | 12% |
| Reduction 12 ans | 12% | 14% |
| Zones eligibles | A bis, A, B1 | A bis, A, B1 |
| Plafond investissement | 300 000 euros | 300 000 euros |

## Conclusion

La loi Jeanbrun offre des opportunites interessantes pour les investisseurs souhaitant se constituer un patrimoine immobilier tout en beneficiant d'avantages fiscaux. N'hesitez pas a utiliser notre simulateur gratuit pour estimer votre reduction d'impot.
    `,
  },
  {
    slug: 'loi-jeanbrun-vs-pinel-comparatif',
    title: 'Loi Jeanbrun vs Pinel : Comparatif Detaille 2026',
    description:
      "Quel dispositif choisir entre la loi Jeanbrun et l'ancienne loi Pinel ? Comparatif complet des avantages fiscaux.",
    date: '2026-01-28',
    author: 'Expert IA Entreprise',
    category: 'defiscalisation',
    tags: ['loi-jeanbrun', 'pinel', 'comparatif'],
    image: '/images/blog/jeanbrun-vs-pinel.webp',
    imageAlt: 'Comparaison Jeanbrun vs Pinel',
    readingTime: 8,
    featured: true,
    content: `
## Jeanbrun vs Pinel : Le Grand Comparatif

Avec l'arrivee de la loi Jeanbrun, de nombreux investisseurs se demandent s'ils doivent encore considerer le dispositif Pinel. Voici notre analyse complete.

## Les Differences Cles

La principale difference reside dans les taux de reduction d'impot. Alors que le Pinel offrait des taux plus eleves, la loi Jeanbrun propose des conditions d'eligibilite assouplies.

## Notre Recommandation

Pour un investissement en 2026, la loi Jeanbrun reste le choix le plus pertinent compte tenu de la fin programmee du Pinel.
    `,
  },
  {
    slug: 'zones-eligibles-loi-jeanbrun',
    title: 'Zones Eligibles a la Loi Jeanbrun : A bis, A et B1',
    description:
      'Quelles sont les zones geographiques eligibles au dispositif Jeanbrun ? Decouvrez la carte des zones tendues.',
    date: '2026-01-25',
    author: 'Expert IA Entreprise',
    category: 'defiscalisation',
    tags: ['zones', 'eligibilite', 'immobilier'],
    image: '/images/blog/zones-eligibles.webp',
    imageAlt: 'Carte des zones eligibles Jeanbrun',
    readingTime: 6,
    featured: false,
    content: `
## Les Zones Tendues en France

La loi Jeanbrun s'applique exclusivement dans les zones ou la demande de logements depasse l'offre.

## Zone A bis

La zone A bis comprend Paris et 76 communes de la petite couronne.

## Zone A

La zone A englobe l'agglomeration parisienne, la Cote d'Azur et certaines grandes villes.

## Zone B1

La zone B1 regroupe les grandes agglomerations de plus de 250 000 habitants.
    `,
  },
  {
    slug: 'calculer-reduction-impot-jeanbrun',
    title: "Comment Calculer sa Reduction d'Impot avec la Loi Jeanbrun",
    description:
      "Apprenez a calculer precisement votre reduction d'impot selon la duree d'engagement et le montant investi.",
    date: '2026-01-22',
    author: 'Expert IA Entreprise',
    category: 'guides',
    tags: ['calcul', 'impot', 'simulation'],
    image: '/images/blog/calculer-reduction.webp',
    imageAlt: "Calculer sa reduction d'impot Jeanbrun",
    readingTime: 10,
    featured: false,
    content: `
## Methode de Calcul

Le calcul de la reduction d'impot Jeanbrun est relativement simple une fois que vous connaissez les parametres.

## Exemple Pratique

Pour un investissement de 200 000 euros sur 12 ans :
- Reduction totale : 200 000 x 12% = 24 000 euros
- Reduction annuelle : 24 000 / 12 = 2 000 euros par an
    `,
  },
  {
    slug: 'top-10-villes-investir-jeanbrun',
    title: 'Top 10 des Villes pour Investir en Loi Jeanbrun en 2026',
    description:
      'Decouvrez les meilleures villes francaises pour un investissement locatif en loi Jeanbrun.',
    date: '2026-01-20',
    author: 'Expert IA Entreprise',
    category: 'investissement',
    tags: ['villes', 'investissement', 'rentabilite'],
    image: '/images/blog/top-villes.webp',
    imageAlt: 'Top 10 villes investissement Jeanbrun',
    readingTime: 15,
    featured: true,
    content: `
## Les Meilleures Villes en 2026

Notre selection des 10 villes les plus prometteuses pour un investissement Jeanbrun.

1. Lyon
2. Bordeaux
3. Nantes
4. Toulouse
5. Montpellier
6. Lille
7. Rennes
8. Strasbourg
9. Nice
10. Marseille
    `,
  },
]

// Fonctions utilitaires (a remplacer par imports de src/lib/blog.ts)
function getAllPosts(): BlogPost[] {
  return DEMO_POSTS
}

function getPostBySlug(slug: string): BlogPost | undefined {
  return DEMO_POSTS.find((post) => post.slug === slug)
}

function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  return DEMO_POSTS.filter((post) => post.slug !== currentSlug && post.category === category).slice(
    0,
    limit
  )
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

// Generer les params statiques pour SSG
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
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
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      locale: 'fr_FR',
      url: articleUrl,
      siteName: 'Simulateur Loi Jeanbrun',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: `${BASE_URL}${post.image}`,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`${BASE_URL}${post.image}`],
    },
    alternates: {
      canonical: articleUrl,
    },
  }
}

// Composant RelatedArticles
function RelatedArticles({ posts }: { posts: BlogPost[] }) {
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
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
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
  const relatedPosts = getRelatedPosts(post.slug, post.category)

  // JSON-LD Article Schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${BASE_URL}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
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
              {post.author}
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
          <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-muted">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-3xl">
          {/* Article Content - rendu MDX simplifie */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-pre:bg-muted">
            {/* TODO: Remplacer par le rendu MDX reel de src/components/blog/ArticleContent.tsx */}
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="mt-8 mb-4 text-2xl font-semibold">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="mt-6 mb-3 text-xl font-semibold">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="ml-6">
                    {paragraph.replace('- ', '')}
                  </li>
                )
              }
              if (paragraph.startsWith('|')) {
                // Simplified table rendering
                return (
                  <p key={index} className="font-mono text-sm">
                    {paragraph}
                  </p>
                )
              }
              if (paragraph.match(/^\d+\. /)) {
                return (
                  <li key={index} className="ml-6 list-decimal">
                    {paragraph.replace(/^\d+\. /, '')}
                  </li>
                )
              }
              if (paragraph.trim()) {
                return (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                )
              }
              return null
            })}
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
