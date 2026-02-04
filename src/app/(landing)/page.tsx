import type { Metadata } from "next";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section-18/hero-section-18";
import Header from "@/components/shadcn-studio/blocks/hero-section-18/header";
import FeaturesWrapper from "@/components/landing/features-wrapper";
import CTASection14 from "@/components/shadcn-studio/blocks/cta-section-14/cta-section-14";
import PersonasSection from "@/components/landing/personas-wrapper";
import CTASection07 from "@/components/shadcn-studio/blocks/cta-section-07/cta-section-07";
import TestimonialsWrapperNew from "@/components/landing/testimonials-wrapper-new";
import PricingWrapper from "@/components/landing/pricing-wrapper";
import FAQWrapper from "@/components/landing/faq-wrapper";
import BlogWrapper from "@/components/landing/blog-wrapper";
import WhyInvestWrapper from "@/components/landing/why-invest-wrapper";
import FooterComponent03 from "@/components/shadcn-studio/blocks/footer-component-03/footer-component-03";
import type { NavigationSection } from "@/components/shadcn-studio/blocks/menu-navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://simulateur-loi-jeanbrun.vercel.app";

export const metadata: Metadata = {
  title: "Simulateur Loi Jeanbrun 2026 - Jusqu'a 50 000EUR d'Economie d'Impot",
  description:
    "Simulez gratuitement votre economie d'impot avec la Loi Jeanbrun. Jusqu'a 50 000EUR d'economie pour les TMI 45%. Le produit ideal pour preparer votre retraite.",
  alternates: {
    canonical: appUrl,
  },
};

const navigationData: NavigationSection[] = [
  {
    title: "Loi Jeanbrun",
    items: [
      { title: "Comprendre le dispositif", href: "/loi-jeanbrun" },
      { title: "Zones eligibles", href: "/villes" },
      { title: "Programmes neufs", href: "/programmes" },
    ],
  },
  {
    title: "Simulateur",
    href: "/simulateur",
  },
  {
    title: "Ressources",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Barometre", href: "/barometre" },
      { title: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Accompagnement",
    href: "/a-propos",
  },
];

/**
 * Landing Page - Simulateur Loi Jeanbrun
 */
export default function LandingPage() {
  return (
    <>
    <div className="relative flex min-h-screen flex-col">
      {/* Header */}
      <Header navigationData={navigationData} />

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        <HeroSection />
      </main>
    </div>

    {/* 1. Features Section - Qu'est-ce que la loi Jeanbrun */}
    <FeaturesWrapper />

    {/* 2. Why Invest - Les 4 piliers */}
    <WhyInvestWrapper />

    {/* 3. Personas Section - Simulations chiffrées */}
    <PersonasSection />

    {/* 4. Expert Section - Crédibilité */}
    <CTASection07 />

    {/* 5. Testimonials - Social Proof */}
    <TestimonialsWrapperNew />

    {/* 6. Pricing - Moment de décision */}
    <PricingWrapper />

    {/* 7. FAQ - Lever les objections */}
    <FAQWrapper />

    {/* 8. CTA Final - Call to Action fort */}
    <CTASection14 />

    {/* 9. Blog - Engagement/SEO */}
    <BlogWrapper />

    {/* 10. Footer */}
    <FooterComponent03 />
  </>
  );
}
