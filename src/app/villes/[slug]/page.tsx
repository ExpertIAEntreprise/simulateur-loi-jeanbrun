/**
 * Page dynamique pour les villes eligibles a la Loi Jeanbrun
 *
 * 382 pages statiques generees:
 * - 52 metropoles avec villes peripheriques
 * - 330 villes peripheriques avec lien vers metropole parent
 *
 * SEO:
 * - Metadata dynamiques (title, description, OpenGraph)
 * - JSON-LD FAQPage pour Google Rich Snippets
 * - Breadcrumb structure
 *
 * ISR: Revalidation toutes les heures (3600s)
 */


import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArgumentsInvestissement } from "@/components/villes/ArgumentsInvestissement";
import { BarometreSidebar } from "@/components/villes/BarometreSidebar";
import { ContenuEditorial } from "@/components/villes/ContenuEditorial";
import { DonneesMarche } from "@/components/villes/DonneesMarche";
import { FaqVille } from "@/components/villes/FaqVille";
import { LienMetropoleParent } from "@/components/villes/LienMetropoleParent";
import { PhotoVille } from "@/components/villes/PhotoVille";
import { PlafondsJeanbrun } from "@/components/villes/PlafondsJeanbrun";
import { ProgrammesList } from "@/components/villes/ProgrammesList";
import { SimulateurPreRempli } from "@/components/villes/SimulateurPreRempli";
import { VillesPeripheriquesList } from "@/components/villes/VillePeripheriqueCard";
import { VillesProches } from "@/components/villes/VillesProches";
import {
  getEspoCRMClient,
  getVilleArguments,
  getVilleFaq,
  type EspoBarometre,
  type EspoProgramme,
  type EspoVille,
} from "@/lib/espocrm";
import type { Metadata } from "next";

/**
 * Configuration ISR: revalidation toutes les heures
 */
export const revalidate = 3600;

/**
 * Type des params de la page
 */
interface PageParams {
  params: Promise<{ slug: string }>;
}

/**
 * Labels des zones fiscales pour affichage
 */
const ZONE_LABELS: Record<string, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

/**
 * Plafonds de loyer par zone fiscale (loyer libre)
 */
const PLAFONDS_LOYER: Record<string, number> = {
  A_BIS: 18.89,
  A: 14.03,
  B1: 11.31,
  B2: 9.83,
  C: 8.61,
};

/**
 * Generation statique des 382 pages villes
 * Appele au build time par Next.js
 */
export async function generateStaticParams() {
  const client = getEspoCRMClient();
  const slugs = await client.getAllVilleSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Generation des metadonnees SEO dynamiques
 */
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const client = getEspoCRMClient();
  const ville = await client.getVilleBySlug(slug);

  if (!ville) {
    return {
      title: "Ville non trouvee - Simulateur Loi Jeanbrun",
    };
  }

  const zoneLabel = ZONE_LABELS[ville.cZoneFiscale] ?? ville.cZoneFiscale;
  const plafond = PLAFONDS_LOYER[ville.cZoneFiscale] ?? 0;

  // Title optimise SEO (< 60 caracteres)
  const title =
    ville.cMetaTitle ??
    `Loi Jeanbrun ${ville.name} 2026 : Investir et Defiscaliser`;

  // Description optimisee (150-160 caracteres)
  const description =
    ville.cMetaDescription ??
    `Investissement locatif a ${ville.name} avec la loi Jeanbrun. Zone ${zoneLabel}, plafond ${plafond.toFixed(2)} EUR/m2. Simulez votre economie d'impot.`;

  // URL canonique
  const canonicalUrl = `https://simulateur-loi-jeanbrun.vercel.app/villes/${slug}`;

  return {
    title,
    description,
    keywords: [
      `loi jeanbrun ${ville.name.toLowerCase()}`,
      `investissement locatif ${ville.name.toLowerCase()}`,
      `defiscalisation ${ville.name.toLowerCase()}`,
      `zone ${zoneLabel.toLowerCase()}`,
      "immobilier neuf",
      "reduction impot",
      "PLF 2026",
    ],
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
      images: ville.cPhotoVille
        ? [
            {
              url: ville.cPhotoVille,
              width: 1200,
              height: 630,
              alt: ville.cPhotoVilleAlt ?? `Photo de ${ville.name}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ville.cPhotoVille ? [ville.cPhotoVille] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Composant Breadcrumb
 */
function Breadcrumb({ ville }: { ville: EspoVille }) {
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Villes", href: "/villes" },
    { label: ville.name, href: null },
  ];

  // Schema JSON-LD BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
        ? `https://simulateur-loi-jeanbrun.vercel.app${item.href}`
        : undefined,
    })),
  };

  return (
    <>
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* Breadcrumb visuel */}
      <nav
        aria-label="Fil d'Ariane"
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground"
        >
          <Home className="size-4" aria-hidden="true" />
          <span className="sr-only">Accueil</span>
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <Link href="/villes" className="hover:text-foreground">
          Villes
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="font-medium text-foreground" aria-current="page">
          {ville.name}
        </span>
      </nav>
    </>
  );
}

/**
 * Badge de zone fiscale avec couleur
 */
function ZoneBadge({ zone }: { zone: string }) {
  const label = ZONE_LABELS[zone] ?? zone;

  // Variante selon la zone
  let variant: "default" | "secondary" | "outline" = "outline";
  if (zone === "A_BIS" || zone === "A") {
    variant = "default";
  } else if (zone === "B1") {
    variant = "secondary";
  }

  return (
    <Badge variant={variant} className="text-sm">
      <MapPin className="mr-1 size-3" aria-hidden="true" />
      Zone {label}
    </Badge>
  );
}

/**
 * JSON-LD Place schema pour la ville
 */
function PlaceJsonLd({ ville }: { ville: EspoVille }) {
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: ville.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: ville.name,
      addressRegion: ville.cRegion,
      addressCountry: "FR",
    },
    geo:
      ville.cLatitude && ville.cLongitude
        ? {
            "@type": "GeoCoordinates",
            latitude: ville.cLatitude,
            longitude: ville.cLongitude,
          }
        : undefined,
    ...(ville.cPhotoVille ? { image: ville.cPhotoVille } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(placeSchema),
      }}
    />
  );
}

/**
 * Layout pour les METROPOLES (52 villes)
 */
function MetropoleLayout({
  ville,
  programmes,
  barometre,
  villesPeripheriques,
}: {
  ville: EspoVille;
  programmes: EspoProgramme[];
  barometre: EspoBarometre | null;
  villesPeripheriques: EspoVille[];
}) {
  const faqItems = getVilleFaq(ville);

  // Transformer les villes peripheriques pour VillesProches
  const villesProches = villesPeripheriques.slice(0, 6).map((v) => ({
    nom: v.name,
    slug: v.cSlug,
    zoneFiscale: v.cZoneFiscale,
  }));

  // Transformer pour VillesPeripheriquesList
  const villesPeripheriquesFormatted = villesPeripheriques.map((v) => ({
    nom: v.name,
    slug: v.cSlug,
    zoneFiscale: v.cZoneFiscale,
  }));

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <Breadcrumb ville={ville} />

        {/* Photo hero */}
        <PhotoVille
          photoUrl={ville.cPhotoVille}
          alt={ville.cPhotoVilleAlt}
          villeNom={ville.name}
          shape="rectangle"
          priority
          className="h-64 md:h-80"
        />

        {/* Titre + Badge zone */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Investissement locatif loi Jeanbrun a {ville.name}
            </h1>
            <ZoneBadge zone={ville.cZoneFiscale} />
          </div>

          {ville.cRegion && (
            <p className="text-lg text-muted-foreground">
              {ville.cDepartement} - {ville.cRegion}
            </p>
          )}
        </div>
      </section>

      {/* Layout 2 colonnes sur desktop */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonne principale (2/3) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Contenu editorial */}
          <ContenuEditorial contenu={ville.cContenuEditorial} villeNom={ville.name} />

          {/* Donnees marche DVF */}
          <DonneesMarche ville={ville} />

          {/* Plafonds Jeanbrun */}
          <PlafondsJeanbrun zoneFiscale={ville.cZoneFiscale} />

          {/* Programmes neufs */}
          <ProgrammesList programmes={programmes} maxItems={6} />

          {/* Villes peripheriques (METROPOLES only) */}
          {villesPeripheriquesFormatted.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">
                Zones d&apos;investissement autour de {ville.name}
              </h2>
              <p className="text-muted-foreground">
                Decouvrez les communes peripheriques eligibles a la loi Jeanbrun
                dans l&apos;aire metropolitaine de {ville.name}.
              </p>
              <VillesPeripheriquesList
                villes={villesPeripheriquesFormatted}
                metropoleNom={ville.name}
              />
            </section>
          )}

          {/* FAQ avec JSON-LD */}
          <FaqVille faqItems={faqItems} villeNom={ville.name} />
        </div>

        {/* Sidebar (1/3) */}
        <aside className="space-y-6">
          {/* Simulateur pre-rempli (sticky) */}
          <div className="lg:sticky lg:top-4">
            <SimulateurPreRempli
              villeNom={ville.name}
              villeSlug={ville.cSlug}
              zoneFiscale={ville.cZoneFiscale}
            />

            {/* Barometre si disponible */}
            {barometre && (
              <div className="mt-6">
                <BarometreSidebar barometre={barometre} />
              </div>
            )}

            {/* Villes proches */}
            {villesProches.length > 0 && (
              <div className="mt-6">
                <VillesProches villes={villesProches} />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/**
 * Layout pour les VILLES PERIPHERIQUES (330 villes)
 */
function PeripheriqueLayout({
  ville,
  programmes,
  barometre,
  metropoleParent,
}: {
  ville: EspoVille;
  programmes: EspoProgramme[];
  barometre: EspoBarometre | null;
  metropoleParent: EspoVille | null;
}) {
  const faqItems = getVilleFaq(ville);
  const argumentsItems = getVilleArguments(ville);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <Breadcrumb ville={ville} />

        {/* Lien metropole parent */}
        {metropoleParent && (
          <div className="mb-4">
            <LienMetropoleParent
              metropoleNom={metropoleParent.name}
              metropoleSlug={metropoleParent.cSlug}
            />
          </div>
        )}

        {/* Photo hero */}
        <PhotoVille
          photoUrl={ville.cPhotoVille}
          alt={ville.cPhotoVilleAlt}
          villeNom={ville.name}
          shape="rectangle"
          priority
          className="h-64 md:h-80"
        />

        {/* Titre + Badge zone */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Investissement locatif loi Jeanbrun a {ville.name}
            </h1>
            <ZoneBadge zone={ville.cZoneFiscale} />
          </div>

          {ville.cRegion && (
            <p className="text-lg text-muted-foreground">
              {ville.cDepartement} - {ville.cRegion}
              {metropoleParent && (
                <span className="ml-2">
                  (aire metropolitaine de {metropoleParent.name})
                </span>
              )}
            </p>
          )}
        </div>
      </section>

      {/* Layout 2 colonnes sur desktop */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonne principale (2/3) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Arguments d'investissement (PERIPHERIQUES only) */}
          {argumentsItems.length > 0 && (
            <ArgumentsInvestissement
              arguments={argumentsItems}
              villeNom={ville.name}
            />
          )}

          {/* Contenu editorial */}
          <ContenuEditorial contenu={ville.cContenuEditorial} villeNom={ville.name} />

          {/* Donnees marche DVF */}
          <DonneesMarche ville={ville} />

          {/* Plafonds Jeanbrun */}
          <PlafondsJeanbrun zoneFiscale={ville.cZoneFiscale} />

          {/* Programmes neufs */}
          <ProgrammesList programmes={programmes} maxItems={6} />

          {/* FAQ avec JSON-LD */}
          <FaqVille faqItems={faqItems} villeNom={ville.name} />
        </div>

        {/* Sidebar (1/3) */}
        <aside className="space-y-6">
          {/* Simulateur pre-rempli (sticky) */}
          <div className="lg:sticky lg:top-4">
            <SimulateurPreRempli
              villeNom={ville.name}
              villeSlug={ville.cSlug}
              zoneFiscale={ville.cZoneFiscale}
            />

            {/* Barometre sidebar (PERIPHERIQUES: plus visible) */}
            <div className="mt-6">
              <BarometreSidebar barometre={barometre} />
            </div>

            {/* Lien retour metropole en sidebar aussi */}
            {metropoleParent && (
              <div className="mt-6">
                <LienMetropoleParent
                  metropoleNom={metropoleParent.name}
                  metropoleSlug={metropoleParent.cSlug}
                />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/**
 * Page principale /villes/[slug]
 */
export default async function VillePage({ params }: PageParams) {
  const { slug } = await params;
  const client = getEspoCRMClient();

  // Recuperer toutes les donnees en une seule requete enrichie
  const { ville, programmes, barometre, villesPeripheriques, metropoleParent } =
    await client.getVilleBySlugEnriched(slug);

  // 404 si ville non trouvee
  if (!ville) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* JSON-LD Place schema */}
      <PlaceJsonLd ville={ville} />

      {/* Layout conditionnel selon type de ville */}
      {ville.cIsMetropole ? (
        <MetropoleLayout
          ville={ville}
          programmes={programmes}
          barometre={barometre}
          villesPeripheriques={villesPeripheriques}
        />
      ) : (
        <PeripheriqueLayout
          ville={ville}
          programmes={programmes}
          barometre={barometre}
          metropoleParent={metropoleParent}
        />
      )}
    </main>
  );
}
