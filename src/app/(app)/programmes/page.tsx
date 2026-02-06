/**
 * Page /programmes - Liste de tous les programmes immobiliers neufs
 *
 * ISR: Revalidation toutes les heures (3600s)
 * Donnees: EspoCRM CJeanbrunProgramme
 */

import { Building2 } from "lucide-react";
import { ProgrammesListing } from "@/components/programmes/ProgrammesListing";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getEspoCRMClient,
  isEspoCRMAvailable,
  type EspoProgramme,
} from "@/lib/espocrm";
import type { Metadata } from "next";

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
 * Recupere tous les programmes actifs depuis EspoCRM
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
      { limit: 500, offset: 0 }
    );
    return { programmes: result.list, total: result.total };
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

        {/* Liste des programmes avec filtres et pagination */}
        {programmes.length > 0 ? (
          <ProgrammesListing programmes={programmes} />
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
