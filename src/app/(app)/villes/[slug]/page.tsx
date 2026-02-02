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


import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getVilleJsonLdForMetadata } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { ArgumentsInvestissement } from "@/components/villes/ArgumentsInvestissement";
import { BarometreSidebar } from "@/components/villes/BarometreSidebar";
import { Breadcrumb, getBreadcrumbJsonLdForMetadata } from "@/components/villes/Breadcrumb";
import { ContenuEditorial } from "@/components/villes/ContenuEditorial";
import { DonneesMarche } from "@/components/villes/DonneesMarche";
import { FaqVille, getFaqJsonLdForMetadata } from "@/components/villes/FaqVille";
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
import type { ZoneFiscale } from "@/types/ville";
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
  try {
    const client = getEspoCRMClient();
    const slugs = await client.getAllVilleSlugs();

    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error("Erreur generateStaticParams villes:", error);
    // Retourner tableau vide pour permettre ISR dynamique
    return [];
  }
}

/**
 * Generation des metadonnees SEO dynamiques
 * Inclut les JSON-LD pour Google Rich Snippets
 */
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;

  let ville;
  try {
    const client = getEspoCRMClient();
    ville = await client.getVilleBySlug(slug);
  } catch (error) {
    console.error(`Erreur EspoCRM metadata pour ${slug}:`, error);
    // Retourner metadata par defaut si EspoCRM indisponible
    return {
      title: `Loi Jeanbrun - Simulateur`,
      description: "Simulez votre investissement immobilier avec la loi Jeanbrun.",
    };
  }

  if (!ville) {
    return {
      title: "Ville non trouvee - Simulateur Loi Jeanbrun",
    };
  }

  // Zone fiscale par defaut B1 (la plus courante)
  const zoneFiscale = "B1";
  const zoneLabel = ZONE_LABELS[zoneFiscale] ?? zoneFiscale;
  const plafond = PLAFONDS_LOYER[zoneFiscale] ?? 0;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://simulateur-loi-jeanbrun.vercel.app";

  // Title optimise SEO (< 60 caracteres)
  const title = `Loi Jeanbrun ${ville.name} 2026 : Investir et Defiscaliser`;

  // Description optimisee (150-160 caracteres)
  const description = `Investissement locatif a ${ville.name} avec la loi Jeanbrun. Zone ${zoneLabel}, plafond ${plafond.toFixed(2)} EUR/m2. Simulez votre economie d'impot.`;

  // URL canonique
  const canonicalUrl = `${baseUrl}/villes/${slug}`;

  // JSON-LD schemas pour Google Rich Snippets
  const breadcrumbJsonLd = getBreadcrumbJsonLdForMetadata([
    { label: "Villes", href: "/villes" },
    { label: ville.name, href: `/villes/${ville.slug}` },
  ]);

  const villeJsonLd = getVilleJsonLdForMetadata({
    ville,
    baseUrl,
  });

  const faqItems = getVilleFaq(ville);
  const faqJsonLd = faqItems.length > 0 ? getFaqJsonLdForMetadata(faqItems) : null;

  // Combiner tous les JSON-LD en un array
  const jsonLdScripts = [breadcrumbJsonLd, villeJsonLd];
  if (faqJsonLd) {
    jsonLdScripts.push(faqJsonLd);
  }

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
    // JSON-LD schemas injectes dans <head>
    other: {
      "script:ld+json": JSON.stringify(jsonLdScripts),
    },
  };
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
 * Layout pour les METROPOLES (52 villes)
 */
function MetropoleLayout({
  ville,
  programmes,
  barometre,
  villesPeripheriques,
  villesProches,
}: {
  ville: EspoVille;
  programmes: EspoProgramme[];
  barometre: EspoBarometre | null;
  villesPeripheriques: EspoVille[];
  villesProches: EspoVille[];
}) {
  const faqItems = getVilleFaq(ville);

  // Transformer les villes proches pour le composant VillesProches
  const villesProchesMapped = villesProches.map((v) => ({
    nom: v.name,
    slug: v.slug,
    zoneFiscale: (v.zoneFiscale ?? "B1") as ZoneFiscale,
    region: v.regionName ?? null,
  }));

  // Transformer pour VillesPeripheriquesList
  const villesPeripheriquesFormatted = villesPeripheriques.map((v) => ({
    nom: v.name,
    slug: v.slug,
    zoneFiscale: (v.zoneFiscale ?? "B1") as ZoneFiscale,
  }));

  // Breadcrumb items (sans Accueil, ajoute automatiquement par le composant)
  const breadcrumbItems = [
    { label: "Villes", href: "/villes" },
    { label: ville.name, href: `/villes/${ville.slug}` },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Photo hero */}
        <PhotoVille
          photoUrl={null}
          alt={null}
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
            <ZoneBadge zone="B1" />
          </div>

          {ville.regionName && (
            <p className="text-lg text-muted-foreground">
              {ville.departementName ?? ""} - {ville.regionName}
            </p>
          )}
        </div>
      </section>

      {/* Layout 2 colonnes sur desktop */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonne principale (2/3) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Contenu editorial */}
          <ContenuEditorial contenu={null} villeNom={ville.name} />

          {/* Donnees marche DVF */}
          <DonneesMarche ville={ville} />

          {/* Plafonds Jeanbrun */}
          <PlafondsJeanbrun zoneFiscale="B1" />

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

          {/* FAQ (JSON-LD deja dans generateMetadata) */}
          <FaqVille faqItems={faqItems} villeNom={ville.name} />
        </div>

        {/* Sidebar (1/3) */}
        <aside className="space-y-6">
          {/* Simulateur pre-rempli (sticky) */}
          <div className="lg:sticky lg:top-4">
            <SimulateurPreRempli
              villeNom={ville.name}
              villeSlug={ville.slug}
              zoneFiscale="B1"
            />

            {/* Barometre si disponible (avec lien vers page barometre) */}
            {barometre && (
              <div className="mt-6">
                <BarometreSidebar barometre={barometre} villeSlug={ville.slug} />
              </div>
            )}

            {/* Villes proches (maillage interne SEO) */}
            {villesProchesMapped.length > 0 && (
              <div className="mt-6">
                <VillesProches
                  villes={villesProchesMapped}
                  titre="Villes de la region"
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
 * Layout pour les VILLES PERIPHERIQUES (330 villes)
 */
function PeripheriqueLayout({
  ville,
  programmes,
  barometre,
  metropoleParent,
  villesProches,
}: {
  ville: EspoVille;
  programmes: EspoProgramme[];
  barometre: EspoBarometre | null;
  metropoleParent: EspoVille | null;
  villesProches: EspoVille[];
}) {
  const faqItems = getVilleFaq(ville);
  const argumentsItems = getVilleArguments(ville);

  // Transformer les villes proches pour le composant VillesProches
  const villesProchesMapped = villesProches.map((v) => ({
    nom: v.name,
    slug: v.slug,
    zoneFiscale: (v.zoneFiscale ?? "B1") as ZoneFiscale,
    region: v.regionName ?? null,
  }));

  // Breadcrumb items (sans Accueil, ajoute automatiquement par le composant)
  const breadcrumbItems = [
    { label: "Villes", href: "/villes" },
    { label: ville.name, href: `/villes/${ville.slug}` },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Lien metropole parent */}
        {metropoleParent && (
          <div className="mb-4">
            <LienMetropoleParent
              metropoleNom={metropoleParent.name}
              metropoleSlug={metropoleParent.slug}
            />
          </div>
        )}

        {/* Photo hero */}
        <PhotoVille
          photoUrl={null}
          alt={null}
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
            <ZoneBadge zone="B1" />
          </div>

          {ville.regionName && (
            <p className="text-lg text-muted-foreground">
              {ville.departementName ?? ""} - {ville.regionName}
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
              arguments={argumentsItems.map((arg) =>
                typeof arg === "string" ? { titre: arg } : arg
              )}
              villeNom={ville.name}
            />
          )}

          {/* Contenu editorial */}
          <ContenuEditorial contenu={null} villeNom={ville.name} />

          {/* Donnees marche DVF */}
          <DonneesMarche ville={ville} />

          {/* Plafonds Jeanbrun */}
          <PlafondsJeanbrun zoneFiscale="B1" />

          {/* Programmes neufs */}
          <ProgrammesList
            programmes={programmes}
            maxItems={6}
            villeSlug={ville.slug}
            villeNom={ville.name}
          />

          {/* FAQ (JSON-LD deja dans generateMetadata) */}
          <FaqVille faqItems={faqItems} villeNom={ville.name} />

          {/* Villes proches (maillage interne SEO) */}
          {villesProchesMapped.length > 0 && (
            <VillesProches
              villes={villesProchesMapped}
              titre="Autres villes proches"
            />
          )}
        </div>

        {/* Sidebar (1/3) */}
        <aside className="space-y-6">
          {/* Simulateur pre-rempli (sticky) */}
          <div className="lg:sticky lg:top-4">
            <SimulateurPreRempli
              villeNom={ville.name}
              villeSlug={ville.slug}
              zoneFiscale="B1"
            />

            {/* Barometre sidebar (PERIPHERIQUES: plus visible, avec lien) */}
            <div className="mt-6">
              <BarometreSidebar barometre={barometre} villeSlug={ville.slug} />
            </div>

            {/* Lien retour metropole en sidebar aussi */}
            {metropoleParent && (
              <div className="mt-6">
                <LienMetropoleParent
                  metropoleNom={metropoleParent.name}
                  metropoleSlug={metropoleParent.slug}
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
 * JSON-LD schemas (Ville, Breadcrumb, FAQ) injectes via generateMetadata()
 */
export default async function VillePage({ params }: PageParams) {
  const { slug } = await params;

  let ville, programmes, barometre, villesPeripheriques, metropoleParent, villesProches;

  try {
    const client = getEspoCRMClient();
    // Recuperer toutes les donnees en une seule requete enrichie
    const result = await client.getVilleBySlugEnriched(slug);
    ville = result.ville;
    programmes = result.programmes;
    barometre = result.barometre;
    villesPeripheriques = result.villesPeripheriques;
    metropoleParent = result.metropoleParent;
    villesProches = result.villesProches;
  } catch (error) {
    // En cas d'erreur EspoCRM, permettre ISR dynamique
    console.error(`Erreur EspoCRM pour ville ${slug}:`, error);
    notFound();
  }

  // 404 si ville non trouvee
  if (!ville) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* Layout conditionnel selon type de ville */}
      {ville.isMetropole ? (
        <MetropoleLayout
          ville={ville}
          programmes={programmes}
          barometre={barometre}
          villesPeripheriques={villesPeripheriques}
          villesProches={villesProches}
        />
      ) : (
        <PeripheriqueLayout
          ville={ville}
          programmes={programmes}
          barometre={barometre}
          metropoleParent={metropoleParent}
          villesProches={villesProches}
        />
      )}
    </main>
  );
}
