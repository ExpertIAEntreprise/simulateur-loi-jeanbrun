/**
 * Page detail programme immobilier `/programmes/[slug]`
 *
 * Server Component avec ISR (revalidation 1h)
 * Affiche :
 * - Hero avec KPIs investisseur
 * - Navigation sticky par onglets
 * - Breadcrumb, description, promoteur
 * - Sections ancrees (caracteristiques, lots, financement, fiscalite, ville)
 * - JSON-LD RealEstateListing pour SEO
 *
 * @see Phase 2 du plan page-programme
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, ExternalLink, MapPin } from "lucide-react";
import { getBreadcrumbJsonLdForMetadata } from "@/components/villes/Breadcrumb";
import { Breadcrumb } from "@/components/villes/Breadcrumb";
import { getRealEstateJsonLdForMetadata } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LotsSection } from "@/components/programmes/LotsSection";
import { ProgrammeHero } from "@/components/programmes/ProgrammeHero";
import { RegionNavigation } from "@/components/programmes/RegionNavigation";
import { SectionFinancement } from "@/components/programmes/SectionFinancement";
import { SectionFiscalite } from "@/components/programmes/SectionFiscalite";
import { StickyNavigation } from "@/components/programmes/StickyNavigation";
import {
  getEspoCRMClient,
  type EspoProgramme,
  type EspoVille,
  parseLots,
} from "@/lib/espocrm";
import { calculerKPIsInvestisseur } from "@/lib/calculs/investisseur-kpis";
import type { ZoneFiscale } from "@/lib/calculs/types/common";
import type { Metadata } from "next";

/**
 * ISR: revalidation toutes les heures
 */
export const revalidate = 3600;

/**
 * Type des params de la page
 */
interface PageParams {
  params: Promise<{ slug: string }>;
}

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://simulateur-loi-jeanbrun.vercel.app";

/**
 * Labels des zones fiscales
 */
const ZONE_LABELS: Record<string, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

/**
 * Format prix en EUR
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format date ISO vers mois + annee francais
 */
function formatDeliveryDate(dateString: string | null | undefined): string {
  if (!dateString) return "Non communiquee";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Estime la surface moyenne du programme pour les calculs
 */
function estimerSurfaceMoyenne(programme: EspoProgramme): number {
  const { surfaceMin, surfaceMax, prixMin, prixM2Moyen } = programme;

  if (surfaceMin != null && surfaceMax != null) {
    return Math.round((surfaceMin + surfaceMax) / 2);
  }
  if (surfaceMin != null) return surfaceMin;
  if (surfaceMax != null) return surfaceMax;
  if (prixMin != null && prixM2Moyen != null && prixM2Moyen > 0) {
    return Math.round(prixMin / prixM2Moyen);
  }
  return 45; // defaut T2
}

/**
 * Recupere le programme et la ville associee
 */
async function fetchProgrammeData(slug: string): Promise<{
  programme: EspoProgramme | null;
  ville: EspoVille | null;
}> {
  try {
    const client = getEspoCRMClient();
    const programme = await client.getProgrammeBySlug(slug);

    if (!programme) {
      return { programme: null, ville: null };
    }

    // Recuperer la ville associee
    let ville: EspoVille | null = null;
    if (programme.villeId) {
      try {
        ville = await client.getVilleById(programme.villeId);
      } catch {
        // Ville optionnelle
      }
    }

    return { programme, ville };
  } catch (error) {
    console.error(`Erreur EspoCRM pour programme ${slug}:`, error);
    return { programme: null, ville: null };
  }
}

/**
 * Generation des slugs pour ISR static
 */
export async function generateStaticParams() {
  try {
    const client = getEspoCRMClient();
    const slugs = await client.getAllProgrammeSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Erreur generateStaticParams programmes:", error);
    return [];
  }
}

/**
 * Metadata SEO dynamique
 */
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const { programme, ville } = await fetchProgrammeData(slug);

  if (!programme) {
    return {
      title: "Programme non trouve - Simulateur Loi Jeanbrun",
    };
  }

  const villeName = programme.villeName ?? ville?.name ?? "";
  const zoneFiscale = programme.zoneFiscale ?? ville?.zoneFiscale ?? "B1";
  const zoneLabel = ZONE_LABELS[zoneFiscale] ?? zoneFiscale;
  const promoteur = programme.promoteur ?? "";

  const title = `${programme.name} - Programme neuf ${villeName} | Loi Jeanbrun`;

  const descriptionParts = [
    `Decouvrez le programme ${programme.name}`,
    villeName ? `a ${villeName}` : "",
    promoteur ? `par ${promoteur}` : "",
    `. Zone ${zoneLabel}`,
    programme.prixMin != null ? `, a partir de ${formatPrice(programme.prixMin)}` : "",
    ". Simulez votre economie d'impot avec la loi Jeanbrun.",
  ];
  const description = descriptionParts.filter(Boolean).join("");

  const canonicalUrl = `${baseUrl}/programmes/${slug}`;

  // JSON-LD Breadcrumb
  const breadcrumbJsonLd = getBreadcrumbJsonLdForMetadata([
    { label: "Programmes", href: "/programmes" },
    ...(villeName
      ? [{ label: villeName, href: `/villes/${ville?.slug ?? ""}` }]
      : []),
    { label: programme.name, href: `/programmes/${slug}` },
  ]);

  // JSON-LD RealEstateListing
  const realEstateJsonLd = getRealEstateJsonLdForMetadata({
    name: programme.name,
    description:
      programme.description ??
      `Programme immobilier neuf ${programme.name} a ${villeName}`,
    address: {
      addressLocality: villeName,
      ...(programme.codePostal ? { postalCode: programme.codePostal } : {}),
      ...(programme.adresse ? { streetAddress: programme.adresse } : {}),
      addressCountry: "FR",
    },
    ...(programme.prixMin != null && programme.prixMax != null
      ? {
          price: {
            minPrice: programme.prixMin,
            maxPrice: programme.prixMax,
            currency: "EUR",
          },
        }
      : programme.prixMin != null
        ? {
            price: {
              minPrice: programme.prixMin,
              maxPrice: programme.prixMin,
              currency: "EUR",
            },
          }
        : {}),
    url: canonicalUrl,
    ...(programme.imagePrincipale
      ? { image: programme.imagePrincipale }
      : {}),
  });

  return {
    title,
    description,
    keywords: [
      `programme neuf ${villeName.toLowerCase()}`,
      `loi jeanbrun ${villeName.toLowerCase()}`,
      `investissement locatif ${villeName.toLowerCase()}`,
      `zone ${zoneLabel.toLowerCase()}`,
      promoteur.toLowerCase(),
      "immobilier neuf",
      "defiscalisation",
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      url: canonicalUrl,
      siteName: "Simulateur Loi Jeanbrun",
      ...(programme.imagePrincipale
        ? {
            images: [
              {
                url: programme.imagePrincipale,
                alt: programme.imageAlt ?? programme.name,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "script:ld+json": JSON.stringify([breadcrumbJsonLd, realEstateJsonLd]),
    },
  };
}

/**
 * Page detail programme
 */
export default async function ProgrammePage({ params }: PageParams) {
  const { slug } = await params;
  const { programme, ville } = await fetchProgrammeData(slug);

  // 2.8 : 404 si slug inconnu
  if (!programme) {
    notFound();
  }

  const villeName = programme.villeName ?? ville?.name ?? null;
  const villeSlug = ville?.slug ?? null;
  const zoneFiscale = programme.zoneFiscale ?? ville?.zoneFiscale ?? "B1";
  const zoneLabel = ZONE_LABELS[zoneFiscale] ?? zoneFiscale;

  // Calculer les KPIs investisseur (server-side)
  const kpis = calculerKPIsInvestisseur(programme, ville);

  // Parser les lots
  const lots = parseLots(programme);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Programmes", href: "/programmes" },
    ...(villeName && villeSlug
      ? [{ label: villeName, href: `/villes/${villeSlug}` }]
      : []),
    { label: programme.name, href: `/programmes/${slug}` },
  ];

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-2" />

        {/* Titre + badges */}
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {programme.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            {villeName && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                {villeName}
                {programme.codePostal && ` (${programme.codePostal})`}
              </span>
            )}
            {programme.promoteur && (
              <Badge variant="secondary" className="capitalize">
                <Building2 className="mr-1 size-3" aria-hidden="true" />
                {programme.promoteur}
              </Badge>
            )}
          </div>
        </header>

        {/* Hero avec KPIs investisseur */}
        <ProgrammeHero
          programme={programme}
          kpis={kpis}
          villeName={villeName}
        />

        {/* Navigation sticky */}
        <StickyNavigation />

        {/* Section Caracteristiques */}
        <section id="caracteristiques" className="scroll-mt-32 space-y-6">
          <h2 className="text-2xl font-bold">Caracteristiques</h2>

          {/* Description */}
          {programme.description && (
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>{programme.description}</p>
            </div>
          )}

          {/* Details du programme */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programme.prixMin != null && (
              <Card>
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <span className="text-lg font-bold text-primary" aria-hidden="true">EUR</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix</p>
                    <p className="font-semibold tabular-nums">
                      {programme.prixMax != null && programme.prixMax > programme.prixMin
                        ? `${formatPrice(programme.prixMin)} - ${formatPrice(programme.prixMax)}`
                        : `A partir de ${formatPrice(programme.prixMin)}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {(programme.surfaceMin != null || programme.surfaceMax != null) && (
              <Card>
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <span className="text-lg font-bold text-primary" aria-hidden="true">m2</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Surfaces</p>
                    <p className="font-semibold tabular-nums">
                      {programme.surfaceMin != null && programme.surfaceMax != null
                        ? `De ${programme.surfaceMin} a ${programme.surfaceMax} m2`
                        : programme.surfaceMin != null
                          ? `A partir de ${programme.surfaceMin} m2`
                          : `Jusqu'a ${programme.surfaceMax} m2`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapPin className="size-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zone fiscale</p>
                  <p className="font-semibold">Zone {zoneLabel}</p>
                </div>
              </CardContent>
            </Card>

            {programme.dateLivraison && (
              <Card>
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <span className="text-lg" aria-hidden="true">📅</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Livraison</p>
                    <p className="font-semibold capitalize">
                      {formatDeliveryDate(programme.dateLivraison)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {programme.nbLotsDisponibles != null && (
              <Card>
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                    <span className="text-lg" aria-hidden="true">🏠</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lots disponibles</p>
                    <p className="font-semibold tabular-nums">
                      {programme.nbLotsDisponibles}
                      {programme.nbLotsTotal != null
                        ? ` / ${programme.nbLotsTotal}`
                        : ""}{" "}
                      lots
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {programme.prixM2Moyen != null && (
              <Card>
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <span className="text-lg font-bold text-primary" aria-hidden="true">€/m2</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix moyen/m2</p>
                    <p className="font-semibold tabular-nums">
                      {formatPrice(programme.prixM2Moyen)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Promoteur */}
          {programme.promoteur && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Promoteur</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="size-8 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="font-semibold capitalize">{programme.promoteur}</p>
                    {programme.siteWeb && (
                      <Link
                        href={programme.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        Site web
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <Separator />

        {/* Section Lots */}
        <section id="lots" className="scroll-mt-32 space-y-6">
          <h2 className="text-2xl font-bold">
            Lots disponibles
            {lots.length > 0 && (
              <Badge variant="secondary" className="ml-3 text-sm">
                {lots.length} lot{lots.length > 1 ? "s" : ""}
              </Badge>
            )}
          </h2>

          <LotsSection
            lots={lots}
            programmeName={programme.name}
            programmeSlug={slug}
            villeName={villeName}
            zoneFiscale={zoneFiscale as import("@/lib/calculs/types/common").ZoneFiscale}
          />
        </section>

        <Separator />

        {/* Section Financement (Phase 6) */}
        <section id="financement" className="scroll-mt-32 space-y-6">
          <h2 className="text-2xl font-bold">Financement</h2>
          {programme.prixMin != null ? (
            <SectionFinancement
              prixMin={programme.prixMin}
              zoneFiscale={zoneFiscale as ZoneFiscale}
              surfaceMoyenne={estimerSurfaceMoyenne(programme)}
            />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Informations de prix non disponibles pour ce programme.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        <Separator />

        {/* Section Fiscalite (Phase 6) */}
        <section id="fiscalite" className="scroll-mt-32 space-y-6">
          <h2 className="text-2xl font-bold">Fiscalite - Loi Jeanbrun</h2>
          <SectionFiscalite
            zoneFiscale={zoneFiscale}
            prixMin={programme.prixMin ?? null}
            economieImpotAnnuelle={kpis?.economieImpotAnnuelle ?? null}
            programmeSlug={slug}
          />
        </section>

        <Separator />

        {/* Section Ville (Phase 7 : navigation region) */}
        <section id="ville" className="scroll-mt-32 space-y-6">
          <h2 className="text-2xl font-bold">
            {villeName ? `Investir a ${villeName}` : "Localisation"}
          </h2>

          {/* Card ville du programme courant */}
          {villeName && villeSlug ? (
            <Card>
              <CardContent className="py-6">
                <p className="mb-4 text-muted-foreground">
                  Decouvrez pourquoi {villeName} est une ville attractive pour
                  l&apos;investissement locatif avec la loi Jeanbrun.
                </p>
                <Link
                  href={`/villes/${villeSlug}`}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  Voir la page {villeName}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Informations sur la ville non disponibles.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigation par region (accordeons) */}
          <RegionNavigation />
        </section>
      </div>
    </main>
  );
}
