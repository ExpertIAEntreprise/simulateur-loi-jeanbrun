/**
 * Page index /barometre
 * Liste les villes avec leur dernier score d'attractivite
 */

import { Suspense } from "react";
import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";
import { BarometreCard } from "@/components/barometre";
import { Pagination } from "@/components/blog/Pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getEspoCRMClient, isEspoCRMAvailable } from "@/lib/espocrm";
import type { EspoVille, EspoBarometre } from "@/lib/espocrm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barometre Immobilier Loi Jeanbrun 2026 | Scores d'Attractivite",
  description:
    "Consultez les scores d'attractivite mensuels des villes eligibles a la loi Jeanbrun. Analysez les tendances du marche immobilier pour optimiser votre investissement locatif.",
  keywords: [
    "barometre immobilier",
    "score attractivite",
    "loi jeanbrun",
    "investissement locatif",
    "tendances marche",
    "prix immobilier",
    "rendement locatif",
  ],
  openGraph: {
    title: "Barometre Immobilier Loi Jeanbrun 2026",
    description:
      "Scores d'attractivite mensuels des villes eligibles a la loi Jeanbrun.",
    type: "website",
    locale: "fr_FR",
  },
};

/**
 * Nombre de villes par page
 */
const VILLES_PER_PAGE = 24;

/**
 * Props de la page avec searchParams
 */
interface PageProps {
  searchParams: Promise<{
    zone?: string;
    score?: string;
    page?: string;
  }>;
}

/**
 * Skeleton pour le chargement des cartes
 */
function BarometreCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="mt-3 h-4 w-32 mx-auto" />
    </div>
  );
}

/**
 * Grille de chargement
 */
function BarometreGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <BarometreCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Message d'etat vide
 */
function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <BarChart3 className="mx-auto size-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/**
 * Message d'erreur
 */
function ErrorState() {
  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center">
      <BarChart3 className="mx-auto size-12 text-destructive/50" />
      <h3 className="mt-4 text-lg font-semibold text-destructive">
        Erreur de chargement
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Impossible de charger les barometres. Veuillez reessayer plus tard.
      </p>
    </div>
  );
}

/**
 * Type pour ville avec son barometre
 */
interface VilleAvecBarometre {
  ville: EspoVille;
  barometre: EspoBarometre | null;
}

/**
 * Grille de barometres
 */
function BarometreGrid({
  villesBarometres,
  page,
  totalPages,
  basePath,
}: {
  villesBarometres: VilleAvecBarometre[];
  page: number;
  totalPages: number;
  basePath: string;
}) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {villesBarometres.map(({ ville, barometre }) => (
          <BarometreCard key={ville.id} ville={ville} barometre={barometre} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={basePath}
          />
        </div>
      )}
    </>
  );
}

/**
 * Construit l'URL de base pour la pagination
 */
function buildBasePath(zone: string | undefined, score: string | undefined): string {
  const params = new URLSearchParams();
  if (zone && zone !== "all") params.set("zone", zone);
  if (score && score !== "all") params.set("score", score);

  const queryString = params.toString();
  return queryString ? `/barometre?${queryString}` : "/barometre";
}

/**
 * Filtres de score
 */
const SCORE_FILTERS = [
  { value: "all", label: "Tous les scores" },
  { value: "80", label: "Excellent (80+)" },
  { value: "60", label: "Tres bon (60+)" },
  { value: "40", label: "Correct (40+)" },
];

/**
 * Filtres de zone
 */
const ZONE_FILTERS = [
  { value: "all", label: "Toutes les zones" },
  { value: "A_BIS", label: "Zone A bis" },
  { value: "A", label: "Zone A" },
  { value: "B1", label: "Zone B1" },
  { value: "B2", label: "Zone B2" },
];

/**
 * Composant de filtres
 */
function BarometreFilters({
  zone,
  score,
  totalVilles,
}: {
  zone: string | undefined;
  score: string | undefined;
  totalVilles: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Filtre zone */}
        <div className="flex items-center gap-2">
          <label htmlFor="zone-filter" className="text-sm font-medium">
            Zone fiscale:
          </label>
          <select
            id="zone-filter"
            defaultValue={zone ?? "all"}
            className="h-9 rounded-md border bg-background px-3 text-sm"
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value === "all") {
                params.delete("zone");
              } else {
                params.set("zone", e.target.value);
              }
              params.delete("page");
              window.location.href = `/barometre?${params.toString()}`;
            }}
          >
            {ZONE_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre score */}
        <div className="flex items-center gap-2">
          <label htmlFor="score-filter" className="text-sm font-medium">
            Score minimum:
          </label>
          <select
            id="score-filter"
            defaultValue={score ?? "all"}
            className="h-9 rounded-md border bg-background px-3 text-sm"
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value === "all") {
                params.delete("score");
              } else {
                params.set("score", e.target.value);
              }
              params.delete("page");
              window.location.href = `/barometre?${params.toString()}`;
            }}
          >
            {SCORE_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {totalVilles} ville{totalVilles > 1 ? "s" : ""} trouvee{totalVilles > 1 ? "s" : ""}
      </p>
    </div>
  );
}

/**
 * Fetche les villes avec leurs barometres
 */
async function fetchVillesAvecBarometres(
  zoneFilter: string | undefined,
  scoreFilter: string | undefined,
  offset: number
): Promise<{ data: VilleAvecBarometre[]; total: number } | { error: true }> {
  try {
    const client = getEspoCRMClient();

    // Recuperer les metropoles (51 villes principales)
    const villesResponse = await client.getMetropoles({ limit: 100, offset: 0 });
    let villes = villesResponse.list;

    // Filtre par zone
    if (zoneFilter && zoneFilter !== "all") {
      villes = villes.filter((v) => v.cZoneFiscale === zoneFilter);
    }

    // Recuperer les barometres pour chaque ville
    const villesBarometres: VilleAvecBarometre[] = await Promise.all(
      villes.map(async (ville) => {
        const barometre = await client.getLatestBarometre(ville.id);
        return { ville, barometre };
      })
    );

    // Filtre par score minimum
    let filtered = villesBarometres;
    if (scoreFilter && scoreFilter !== "all") {
      const minScore = parseInt(scoreFilter, 10);
      filtered = villesBarometres.filter(
        ({ barometre }) => barometre && barometre.cScoreAttractivite >= minScore
      );
    }

    // Trier par score decroissant
    filtered.sort((a, b) => {
      const scoreA = a.barometre?.cScoreAttractivite ?? 0;
      const scoreB = b.barometre?.cScoreAttractivite ?? 0;
      return scoreB - scoreA;
    });

    // Pagination
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + VILLES_PER_PAGE);

    return { data: paginated, total };
  } catch (error) {
    console.error("Erreur lors de la recuperation des barometres:", error);
    return { error: true };
  }
}

/**
 * Composant de donnees barometres (Server Component avec fetch)
 */
async function BarometreData({
  zone,
  score,
  page,
}: {
  zone: string | undefined;
  score: string | undefined;
  page: number;
}) {
  // Verifier si EspoCRM est disponible
  if (!isEspoCRMAvailable()) {
    return (
      <EmptyState
        title="Configuration requise"
        description="Configurez la variable d'environnement ESPOCRM_API_KEY pour afficher les barometres."
      />
    );
  }

  // Calculer l'offset pour la pagination
  const offset = (page - 1) * VILLES_PER_PAGE;

  // Recuperer les donnees
  const result = await fetchVillesAvecBarometres(zone, score, offset);

  // Gerer l'erreur
  if ("error" in result) {
    return <ErrorState />;
  }

  const { data: villesBarometres, total } = result;
  const totalPages = Math.ceil(total / VILLES_PER_PAGE);

  // Cas vide
  if (villesBarometres.length === 0) {
    return (
      <EmptyState
        title="Aucun barometre trouve"
        description="Modifiez vos criteres de recherche pour trouver des barometres."
      />
    );
  }

  // Construire l'URL de base pour la pagination
  const basePath = buildBasePath(zone, score);

  return (
    <>
      <BarometreFilters zone={zone} score={score} totalVilles={total} />
      <div className="mt-6">
        <BarometreGrid
          villesBarometres={villesBarometres}
          page={page}
          totalPages={totalPages}
          basePath={basePath}
        />
      </div>
    </>
  );
}

/**
 * Page principale /barometre
 */
export default async function BarometrePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const zone = params.zone;
  const score = params.score;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-primary mb-2">
          <BarChart3 className="size-5" />
          <span className="text-sm font-medium">Loi Jeanbrun 2026</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Barometre Immobilier Mensuel
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Consultez les scores d&apos;attractivite des villes eligibles a la loi
          Jeanbrun. Notre barometre analyse chaque mois les indicateurs cles du
          marche : prix, evolution, rendement et offre de programmes neufs.
        </p>
      </header>

      {/* Contenu */}
      <section aria-label="Liste des barometres">
        <Suspense fallback={<BarometreGridSkeleton />}>
          <BarometreData zone={zone} score={score} page={page} />
        </Suspense>
      </section>

      {/* CTA Simulateur */}
      <section className="mt-16 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Simulez votre investissement
          </h2>
          <p className="mt-4 text-muted-foreground">
            Utilisez notre simulateur gratuit pour estimer votre reduction
            d&apos;impot avec la Loi Jeanbrun dans la ville de votre choix.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/simulateur">
                Lancer une simulation
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/villes">Explorer les villes</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
