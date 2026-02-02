
import {
  HeroSection,
  TrustSignalsBar,
  UrgencyBanner,
  FeatureCards,
  RetirementSection,
  ProcessSteps,
  ComparisonTable,
  ExampleCalculation,
  FAQAccordion,
  faqItems,
  CTASection,
  LandingHeader,
  LandingFooter,
} from "@/components/landing";
import {
  JsonLdWebPage,
  JsonLdSoftwareApp,
  JsonLdFaq,
  JsonLdOrganization,
} from "@/components/seo";
import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://simulateur-loi-jeanbrun.vercel.app";

/**
 * Metadata SEO optimisees pour la landing page
 * Angle: 50 000EUR d'economie + retraite
 */
export const metadata: Metadata = {
  title: "Simulateur Loi Jeanbrun 2026 - Jusqu'a 50 000EUR d'Economie d'Impot",
  description:
    "Simulez gratuitement votre economie d'impot avec la Loi Jeanbrun. Jusqu'a 50 000EUR d'economie pour les TMI 45%. Le produit ideal pour preparer votre retraite.",
  keywords: [
    "loi jeanbrun",
    "simulateur loi jeanbrun",
    "economie impot",
    "defiscalisation immobilier",
    "amortissement immobilier",
    "deficit foncier",
    "retraite immobilier",
    "investissement locatif",
    "PLF 2026",
    "reduction impot 2026",
    "50000 euros economie",
    "TMI 45",
  ],
  authors: [{ name: "Expert IA Entreprise" }],
  creator: "Expert IA Entreprise",
  publisher: "Expert IA Entreprise",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: appUrl,
    siteName: "Simulateur Loi Jeanbrun",
    title: "Simulateur Loi Jeanbrun 2026 - Jusqu'a 50 000EUR d'Economie d'Impot",
    description:
      "Simulez gratuitement votre economie d'impot avec la Loi Jeanbrun. Le produit ideal pour preparer votre retraite.",
    images: [
      {
        url: `${appUrl}/og-image-jeanbrun.jpg`,
        width: 1200,
        height: 630,
        alt: "Simulateur Loi Jeanbrun - 50 000EUR d'economie d'impot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulateur Loi Jeanbrun 2026 - 50 000EUR d'Economie",
    description:
      "Simulez gratuitement votre economie d'impot avec la Loi Jeanbrun (PLF 2026). Le produit ideal pour preparer votre retraite.",
    images: [`${appUrl}/og-image-jeanbrun.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: appUrl,
  },
};

/**
 * Landing Page - Simulateur Loi Jeanbrun
 *
 * Structure:
 * 1. Header avec navigation simplifiee
 * 2. Bandeau urgence (bonification 2027)
 * 3. Hero avec chiffre d'ancrage 50 000EUR
 * 4. Trust signals (4 badges confiance)
 * 5. Feature cards (avantages retraite)
 * 6. Section retraite (timeline 22/30 ans)
 * 7. Process steps (3 etapes)
 * 8. Tableau comparatif (vs Pinel, LMNP)
 * 9. Exemple calcul (TMI 45%)
 * 10. FAQ (8 questions)
 * 11. CTA final
 * 12. Footer
 */
export default function LandingPage() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <JsonLdWebPage
        name="Simulateur Loi Jeanbrun 2026"
        description="Simulez gratuitement votre economie d'impot avec la Loi Jeanbrun. Jusqu'a 50 000EUR d'economie pour les TMI 45%."
        url={appUrl}
        datePublished="2026-01-01"
        dateModified="2026-02-02"
      />
      <JsonLdSoftwareApp />
      <JsonLdFaq items={faqItems} pageUrl={appUrl} />
      <JsonLdOrganization />

      {/* Header */}
      <LandingHeader />

      {/* Bandeau urgence bonification 2027 */}
      <UrgencyBanner />

      {/* Main content */}
      <main id="main-content">
        {/* Hero Section - Above the fold */}
        <HeroSection />

        {/* Trust Signals */}
        <TrustSignalsBar />

        {/* Feature Cards - Avantages retraite */}
        <FeatureCards />

        {/* Section Retraite - Timeline */}
        <RetirementSection />

        {/* Process Steps */}
        <ProcessSteps />

        {/* Tableau Comparatif */}
        <ComparisonTable />

        {/* Exemple Calcul TMI 45% */}
        <ExampleCalculation />

        {/* FAQ */}
        <FAQAccordion />

        {/* CTA Final */}
        <CTASection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </>
  );
}
