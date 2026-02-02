import type { Metadata } from "next";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section-18/hero-section-18";
import Header from "@/components/shadcn-studio/blocks/hero-section-18/header";
import FeaturesWrapper from "@/components/landing/features-wrapper";
import CTASection from "@/components/shadcn-studio/blocks/cta-section-02/cta-section-02";
import PersonasSection from "@/components/landing/personas-wrapper";
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
    title: "La Loi Jeanbrun",
    href: "#dispositif",
  },
  {
    title: "Zones éligibles",
    href: "#zones",
  },
  {
    title: "Programmes",
    href: "#programmes",
  },
  {
    title: "Guide investisseur",
    href: "#guide",
  },
  {
    title: "Fiscalité",
    href: "#fiscalite",
  },
  {
    title: "Actualités",
    href: "#actualites",
  },
  {
    title: "Simulateur",
    href: "/simulateur",
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

    {/* Features Section */}
    <FeaturesWrapper />

    {/* CTA Section - Guide */}
    <CTASection />

    {/* Personas Section */}
    <PersonasSection />
  </>
  );
}
