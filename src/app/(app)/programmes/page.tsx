/**
 * Page /programmes - Liste de tous les programmes immobiliers neufs
 *
 * ISR: Revalidation toutes les heures (3600s)
 * Donnees: EspoCRM CJeanbrunProgramme
 */

import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProgrammeCard } from "@/components/villes/ProgrammeCard";
import {
  getEspoCRMClient,
  isEspoCRMAvailable,
  type EspoProgramme,
} from "@/lib/espocrm";

export const revalidate = 3600;

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://simulateur-loi-jeanbrun.vercel.app";

export const metadata: Metadata = {
  title: "Programmes neufs Loi Jeanbrun 2026 - Investissement locatif",
  description:
    "Decouvrez tous les programmes immobiliers neufs eligibles a la Loi Jeanbrun. Comparez les prix, surfaces et emplacements pour votre investissement locatif.",
  alternates: {
    canonical: `${baseUrl}/programmes`,
  },
  openGraph: {
    title: "Programmes neufs Loi Jeanbrun 2026",
    description:
      "Tous les programmes immobiliers neufs eligibles a la Loi Jeanbrun.",
    type: "website",
    locale: "fr_FR",
    url: `${baseUrl}/programmes`,
    siteName: "Simulateur Loi Jeanbrun",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Verifie si un programme a ete enrichi (images scrapees)
 */
function isEnrichedProgramme(programme: EspoProgramme): boolean {
  if (!programme.images) return false;
  try {
    const parsed: unknown = JSON.parse(programme.images);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
}

/**
 * Recupere les programmes enrichis depuis EspoCRM
 */
async function fetchProgrammes(): Promise<{
  programmes: EspoProgramme[];
  total: number;
}> {
  if (!isEspoCRMAvailable()) {
    return { programmes: [], total: 0 };
  }

  try {
    const client = getEspoCRMClient();
    const result = await client.getProgrammes(
      { actif: true },
      { limit: 200, offset: 0 }
    );
    // Filter to only show enriched programmes (with scraped images)
    const enriched = result.list.filter(isEnrichedProgramme);
    return { programmes: enriched, total: enriched.length };
  } catch (error) {
    console.error("Erreur chargement programmes:", error);
    return { programmes: [], total: 0 };
  }
}

/**
 * JSON-LD ItemList pour SEO
 */
function getProgrammesJsonLd(programmes: EspoProgramme[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Programmes immobiliers neufs Loi Jeanbrun",
    description:
      "Liste des programmes immobiliers neufs eligibles a la Loi Jeanbrun 2026",
    numberOfItems: programmes.length,
    itemListElement: programmes.slice(0, 50).map((prog, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "RealEstateListing",
        name: prog.name,
        description: `Programme neuf ${prog.name} a ${prog.villeName ?? ""}`,
        ...(prog.prixMin !== null
          ? {
              offers: {
                "@type": "Offer",
                price: prog.prixMin,
                priceCurrency: "EUR",
              },
            }
          : {}),
      },
    })),
  };
}

export default async function ProgrammesPage() {
  const { programmes, total } = await fetchProgrammes();

  return (
    <>
      {/* JSON-LD */}
      {programmes.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getProgrammesJsonLd(programmes)),
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <header className="mb-10 text-center">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Building2 className="mr-1.5 size-3.5" aria-hidden="true" />
              {total > 0 ? `${total} programmes` : "Programmes neufs"}
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Programmes neufs eligibles Loi Jeanbrun
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground">
              Comparez les programmes immobiliers neufs pour votre investissement
              locatif avec la loi Jeanbrun 2026.
            </p>
          </div>
        </header>

        {/* Liste des programmes */}
        {programmes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme, index) => (
              <ProgrammeCard
                key={programme.id}
                programme={programme}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <Card className="mx-auto max-w-lg">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <Building2
                className="size-12 text-muted-foreground/50"
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold">
                Aucun programme disponible
              </h2>
              <p className="text-muted-foreground">
                Les programmes immobiliers neufs seront prochainement
                disponibles. Revenez bientot pour decouvrir les opportunites
                eligibles a la Loi Jeanbrun.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
