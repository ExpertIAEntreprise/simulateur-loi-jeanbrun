import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  HeroLoi,
  ConditionsEligibilite,
  AvantagesFiscaux,
  ComparaisonDispositifs,
  FaqLoi,
  faqItems,
} from '@/components/loi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loi Jeanbrun 2026 - Guide Complet du Nouveau Dispositif de Defiscalisation',
  description:
    'Decouvrez la loi Jeanbrun, le nouveau dispositif de defiscalisation immobiliere du PLF 2026. Reduction d\'impot jusqu\'a 12%, zones eligibles, conditions et simulation gratuite.',
  keywords: [
    'loi jeanbrun',
    'loi jeanbrun 2026',
    'defiscalisation immobiliere',
    'reduction impot immobilier',
    'PLF 2026',
    'investissement locatif',
    'remplacement loi pinel',
    'zone A bis',
    'zone A',
    'zone B1',
    'immobilier neuf',
    'avantage fiscal immobilier',
  ],
  openGraph: {
    title: 'Loi Jeanbrun 2026 - Guide Complet',
    description:
      'Nouveau dispositif de defiscalisation immobiliere : jusqu\'a 12% de reduction d\'impot sur 12 ans. Decouvrez les conditions et simulez votre investissement.',
    type: 'article',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loi Jeanbrun 2026 - Nouveau Dispositif Fiscal',
    description:
      'Jusqu\'a 12% de reduction d\'impot sur 12 ans. Decouvrez le nouveau dispositif de defiscalisation immobiliere.',
  },
  alternates: {
    canonical: '/loi-jeanbrun',
  },
}

// JSON-LD FAQPage Schema
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

// JSON-LD Article Schema
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Loi Jeanbrun 2026 - Guide Complet du Nouveau Dispositif de Defiscalisation',
  description:
    'Guide complet sur la loi Jeanbrun, le nouveau dispositif de defiscalisation immobiliere du PLF 2026.',
  author: {
    '@type': 'Organization',
    name: 'Expert IA Entreprise',
    url: 'https://expert-ia-entreprise.fr',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Expert IA Entreprise',
    url: 'https://expert-ia-entreprise.fr',
  },
  datePublished: '2026-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://simulateur-loi-jeanbrun.vercel.app/loi-jeanbrun',
  },
}

export default function LoiJeanbrunPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Hero Section */}
      <HeroLoi />

      {/* Conditions d'eligibilite */}
      <ConditionsEligibilite />

      {/* Avantages fiscaux */}
      <AvantagesFiscaux />

      {/* Comparaison des dispositifs */}
      <ComparaisonDispositifs />

      {/* FAQ */}
      <FaqLoi />

      {/* CTA Final */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                Pret a simuler votre investissement ?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                Utilisez notre simulateur gratuit pour calculer votre reduction d&apos;impot
                avec la loi Jeanbrun. Obtenez une estimation personnalisee en quelques clics.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Lancer ma simulation gratuite
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#conditions-eligibilite">
                    Verifier mon eligibilite
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
