/**
 * Page dynamique /barometre/[ville]/[mois]
 * Affiche le barometre mensuel d'une ville
 *
 * URL: /barometre/lyon/2026-01
 * Display: "Janvier 2026"
 *
 * ISR: Revalidation toutes les heures (3600s)
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Home, ChevronRight as ChevronSep, ArrowRight, Calendar } from "lucide-react";
import {
  ScoreAttractivite,
  IndicateursMarche,
  AnalyseIA,
  MeilleureOpportunite,
  BarometreHistorique,
} from "@/components/barometre";
import { Button } from "@/components/ui/button";
import { getEspoCRMClient, isEspoCRMAvailable } from "@/lib/espocrm";
import type { EspoVille } from "@/lib/espocrm";
import type { Metadata } from "next";

/**
 * Configuration ISR: revalidation toutes les heures
 */
export const revalidate = 3600;

/**
 * Type des params de la page
 */
interface PageParams {
  params: Promise<{ ville: string; mois: string }>;
}

/**
 * Noms des mois en francais
 */
const MOIS_NOMS = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
];

/**
 * Formate un mois URL (2026-01) en format d'affichage (Janvier 2026)
 */
function formatMoisDisplay(moisUrl: string): string {
  const [annee, moisNum] = moisUrl.split("-");
  const moisIndex = parseInt(moisNum ?? "01", 10) - 1;
  const moisNom = MOIS_NOMS[moisIndex] ?? "Janvier";
  return `${moisNom} ${annee}`;
}

/**
 * Formate un mois ISO (2026-01-01) en mois URL (2026-01)
 */
function formatMoisUrl(moisIso: string): string {
  return moisIso.slice(0, 7);
}

/**
 * Calcule le mois precedent au format URL
 */
function getMoisPrecedent(moisUrl: string): string {
  const [annee, moisNum] = moisUrl.split("-");
  const mois = parseInt(moisNum ?? "01", 10);
  if (mois === 1) {
    return `${parseInt(annee ?? "2026", 10) - 1}-12`;
  }
  return `${annee}-${String(mois - 1).padStart(2, "0")}`;
}

/**
 * Calcule le mois suivant au format URL
 */
function getMoisSuivant(moisUrl: string): string {
  const [annee, moisNum] = moisUrl.split("-");
  const mois = parseInt(moisNum ?? "01", 10);
  if (mois === 12) {
    return `${parseInt(annee ?? "2026", 10) + 1}-01`;
  }
  return `${annee}-${String(mois + 1).padStart(2, "0")}`;
}

/**
 * Verifie si un mois URL est valide (format YYYY-MM)
 */
function isValidMoisUrl(moisUrl: string): boolean {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(moisUrl);
}

/**
 * Generation statique des 51 metropoles x 12 mois
 */
export async function generateStaticParams() {
  if (!isEspoCRMAvailable()) {
    return [];
  }

  try {
    const client = getEspoCRMClient();
    const metropoles = await client.getMetropoles({ limit: 100, offset: 0 });

    // Generer les params pour chaque metropole avec le mois courant
    const now = new Date();
    const currentMois = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    return metropoles.list.map((ville) => ({
      ville: ville.cSlug,
      mois: currentMois,
    }));
  } catch (error) {
    console.error("Erreur generateStaticParams barometre:", error);
    return [];
  }
}

/**
 * Generation des metadonnees SEO dynamiques
 */
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { ville: villeSlug, mois: moisUrl } = await params;

  if (!isEspoCRMAvailable() || !isValidMoisUrl(moisUrl)) {
    return {
      title: "Barometre non trouve - Simulateur Loi Jeanbrun",
    };
  }

  try {
    const client = getEspoCRMClient();
    const ville = await client.getVilleBySlug(villeSlug);

    if (!ville) {
      return {
        title: "Ville non trouvee - Simulateur Loi Jeanbrun",
      };
    }

    const moisFormate = formatMoisDisplay(moisUrl);
    const title = `Barometre Jeanbrun ${ville.name} - ${moisFormate} | Simulateur`;
    const description = `Score d'attractivite et analyse du marche immobilier a ${ville.name} pour ${moisFormate}. Prix, evolution, rendement et opportunites d'investissement loi Jeanbrun.`;

    const canonicalUrl = `https://simulateur-loi-jeanbrun.vercel.app/barometre/${villeSlug}/${moisUrl}`;

    return {
      title,
      description,
      keywords: [
        `barometre ${ville.name.toLowerCase()}`,
        `investissement ${ville.name.toLowerCase()}`,
        "loi jeanbrun",
        "score attractivite",
        "marche immobilier",
        moisFormate.toLowerCase(),
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
    };
  } catch (error) {
    console.error("Erreur generateMetadata barometre:", error);
    return {
      title: "Barometre - Simulateur Loi Jeanbrun",
    };
  }
}

/**
 * Composant Breadcrumb avec JSON-LD
 */
function Breadcrumb({
  ville,
  moisFormate,
}: {
  ville: EspoVille;
  moisFormate: string;
}) {
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Barometre", href: "/barometre" },
    { label: ville.name, href: `/villes/${ville.cSlug}` },
    { label: moisFormate, href: null },
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
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground"
        >
          <Home className="size-4" aria-hidden="true" />
          <span className="sr-only">Accueil</span>
        </Link>
        <ChevronSep className="size-4" aria-hidden="true" />
        <Link href="/barometre" className="hover:text-foreground">
          Barometre
        </Link>
        <ChevronSep className="size-4" aria-hidden="true" />
        <Link href={`/villes/${ville.cSlug}`} className="hover:text-foreground">
          {ville.name}
        </Link>
        <ChevronSep className="size-4" aria-hidden="true" />
        <span className="font-medium text-foreground" aria-current="page">
          {moisFormate}
        </span>
      </nav>
    </>
  );
}

/**
 * Navigation entre les mois
 */
function MoisNavigation({
  villeSlug,
  moisUrl,
  hasPrecedent,
  hasSuivant,
}: {
  villeSlug: string;
  moisUrl: string;
  hasPrecedent: boolean;
  hasSuivant: boolean;
}) {
  const moisPrecedent = getMoisPrecedent(moisUrl);
  const moisSuivant = getMoisSuivant(moisUrl);

  return (
    <div className="flex items-center justify-between">
      {hasPrecedent ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`/barometre/${villeSlug}/${moisPrecedent}`}>
            <ChevronLeft className="mr-1 size-4" aria-hidden="true" />
            {formatMoisDisplay(moisPrecedent)}
          </Link>
        </Button>
      ) : (
        <div />
      )}

      {hasSuivant ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`/barometre/${villeSlug}/${moisSuivant}`}>
            {formatMoisDisplay(moisSuivant)}
            <ChevronRight className="ml-1 size-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
}

/**
 * CTA pour simuler un investissement
 */
function SimulateurCTA({ villeNom, villeSlug }: { villeNom: string; villeSlug: string }) {
  return (
    <section className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            Simuler mon investissement a {villeNom}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Calculez votre reduction d&apos;impot avec la loi Jeanbrun et decouvrez
            votre potentiel de rentabilite.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={`/simulateur?ville=${villeSlug}`}>
            Simuler maintenant
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

/**
 * Page principale /barometre/[ville]/[mois]
 */
export default async function BarometreDetailPage({ params }: PageParams) {
  const { ville: villeSlug, mois: moisUrl } = await params;

  // Validation du format de mois
  if (!isValidMoisUrl(moisUrl)) {
    notFound();
  }

  // Verification EspoCRM
  if (!isEspoCRMAvailable()) {
    notFound();
  }

  const client = getEspoCRMClient();

  // Recuperer la ville
  const ville = await client.getVilleBySlug(villeSlug);
  if (!ville) {
    notFound();
  }

  // Recuperer le barometre du mois demande
  const moisIso = `${moisUrl}-01`;
  const barometresResponse = await client.getBarometres(
    { villeId: ville.id, moisMin: moisIso, moisMax: moisIso },
    { limit: 1 }
  );
  const barometre = barometresResponse.list[0] ?? null;

  // Recuperer l'historique (12 mois)
  const historique = await client.getBarometreHistorique(ville.id, 12);

  // Verifier si on a des mois precedent/suivant dans l'historique
  const historiqueUrls = historique.map((b) => formatMoisUrl(b.cMois));
  const moisPrecedent = getMoisPrecedent(moisUrl);
  const moisSuivant = getMoisSuivant(moisUrl);
  const hasPrecedent = historiqueUrls.includes(moisPrecedent);
  const hasSuivant = historiqueUrls.includes(moisSuivant);

  const moisFormate = formatMoisDisplay(moisUrl);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <Breadcrumb ville={ville} moisFormate={moisFormate} />

      {/* Header */}
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Calendar className="size-5" aria-hidden="true" />
          <span className="text-sm font-medium">{moisFormate}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Barometre Jeanbrun {ville.name} - {moisFormate}
        </h1>

        {ville.cRegion && (
          <p className="text-lg text-muted-foreground">
            {ville.cDepartement} - {ville.cRegion}
          </p>
        )}
      </header>

      {/* Contenu principal */}
      {barometre ? (
        <div className="space-y-8">
          {/* Grille principale: Score + Indicateurs */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Score d'attractivite */}
            <div className="lg:col-span-1">
              <ScoreAttractivite size="lg" score={barometre.cScoreAttractivite} />
            </div>

            {/* Indicateurs de marche */}
            <div className="lg:col-span-2">
              <IndicateursMarche barometre={barometre} />
            </div>
          </div>

          {/* Analyse IA */}
          <AnalyseIA analyse={barometre.cAnalyseIA} villeName={ville.name} />

          {/* Meilleure opportunite */}
          <MeilleureOpportunite
            programmeId={barometre.cMeilleureOpportuniteId}
            programmeName={barometre.cMeilleureOpportuniteName ?? null}
            villeSlug={ville.cSlug}
          />

          {/* Historique */}
          <BarometreHistorique historique={historique} villeNom={ville.name} />

          {/* Navigation mois */}
          <MoisNavigation
            villeSlug={ville.cSlug}
            moisUrl={moisUrl}
            hasPrecedent={hasPrecedent}
            hasSuivant={hasSuivant}
          />

          {/* CTA Simulateur */}
          <SimulateurCTA villeNom={ville.name} villeSlug={ville.cSlug} />
        </div>
      ) : (
        /* Pas de barometre pour ce mois */
        <div className="space-y-8">
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Calendar className="mx-auto size-12 text-muted-foreground/50" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">
              Barometre non disponible
            </h2>
            <p className="mt-2 text-muted-foreground">
              Le barometre de {ville.name} pour {moisFormate} n&apos;est pas encore
              disponible.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="outline">
                <Link href={`/barometre/${ville.cSlug}/${getMoisPrecedent(moisUrl)}`}>
                  <ChevronLeft className="mr-1 size-4" aria-hidden="true" />
                  Mois precedent
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/villes/${ville.cSlug}`}>
                  Voir la page ville
                </Link>
              </Button>
            </div>
          </div>

          {/* Historique meme si pas de barometre ce mois */}
          {historique.length > 0 && (
            <BarometreHistorique historique={historique} villeNom={ville.name} />
          )}

          {/* CTA Simulateur */}
          <SimulateurCTA villeNom={ville.name} villeSlug={ville.cSlug} />
        </div>
      )}
    </main>
  );
}
