import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  HeroProfil,
  Biographie,
  Timeline,
  Temoignages,
  CalendlyEmbed,
  SocialLinks,
} from '@/components/profil'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A Propos - Expert en Defiscalisation Immobiliere | Simulateur Loi Jeanbrun',
  description:
    'Decouvrez l\'expert derriere le Simulateur Loi Jeanbrun. Plus de 15 ans d\'experience en defiscalisation immobiliere et 500+ clients accompagnes. Consultation gratuite.',
  keywords: [
    'expert defiscalisation',
    'conseiller investissement immobilier',
    'consultant loi jeanbrun',
    'expert fiscal immobilier',
    'conseil patrimoine',
    'investissement locatif expert',
    'simulation gratuite defiscalisation',
    'rendez-vous defiscalisation',
  ],
  openGraph: {
    title: 'A Propos - Expert Defiscalisation | Simulateur Loi Jeanbrun',
    description:
      'Plus de 15 ans d\'experience en defiscalisation immobiliere. Decouvrez mon parcours et reservez une consultation gratuite.',
    type: 'profile',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expert Defiscalisation Immobiliere',
    description:
      'Plus de 15 ans d\'experience et 500+ clients accompagnes. Consultation gratuite disponible.',
  },
  alternates: {
    canonical: '/a-propos',
  },
}

// JSON-LD Person Schema
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Expert Defiscalisation',
  jobTitle: 'Expert en Defiscalisation Immobiliere',
  description:
    'Expert en defiscalisation immobiliere avec plus de 15 ans d\'experience. Createur du Simulateur Loi Jeanbrun.',
  url: 'https://simulateur-loi-jeanbrun.vercel.app/a-propos',
  sameAs: [
    'https://linkedin.com/in/expert-jeanbrun',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Expert IA Entreprise',
    url: 'https://expert-ia-entreprise.fr',
  },
  knowsAbout: [
    'Defiscalisation immobiliere',
    'Loi Jeanbrun',
    'Loi Pinel',
    'LMNP',
    'Investissement locatif',
    'Gestion de patrimoine',
  ],
}

// JSON-LD LocalBusiness Schema
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Simulateur Loi Jeanbrun',
  description:
    'Service de simulation et conseil en defiscalisation immobiliere specialise dans la loi Jeanbrun.',
  url: 'https://simulateur-loi-jeanbrun.vercel.app',
  priceRange: 'Gratuit - Premium',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  },
  areaServed: {
    '@type': 'Country',
    name: 'France',
  },
  serviceType: [
    'Simulation defiscalisation',
    'Conseil investissement immobilier',
    'Consultation fiscale',
  ],
}

export default function AProposPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* Hero Section */}
      <HeroProfil />

      {/* Biographie */}
      <Biographie />

      {/* Timeline Parcours */}
      <Timeline />

      {/* Temoignages */}
      <Temoignages />

      {/* Calendly Embed */}
      <CalendlyEmbed />

      {/* Social Links */}
      <SocialLinks />

      {/* CTA Final */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                Pret a simuler votre investissement ?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                Utilisez notre simulateur gratuit pour decouvrir combien vous pouvez economiser
                avec la loi Jeanbrun. Resultats instantanes et personnalises.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Lancer ma simulation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/loi-jeanbrun">
                    En savoir plus sur la loi
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
