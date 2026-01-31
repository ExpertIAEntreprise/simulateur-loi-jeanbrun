/**
 * Page index /villes
 * Liste les 382 villes eligibles a la Loi Jeanbrun avec filtres et recherche
 */

import { Suspense } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { Pagination } from "@/components/blog/Pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VilleCard } from "@/components/villes/VilleCard";
import { VillesFilters } from "@/components/villes/VillesFilters";
import { getEspoCRMClient, isEspoCRMAvailable } from "@/lib/espocrm";
import type { EspoVilleFilters, EspoVille } from "@/lib/espocrm";
import type { ZoneFiscale } from "@/types/ville";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villes eligibles Loi Jeanbrun 2026 | Simulateur",
  description:
    "Decouvrez les 382 villes francaises eligibles a la loi Jeanbrun. Trouvez votre investissement locatif ideal par zone fiscale.",
  keywords: [
    "villes eligibles",
    "loi jeanbrun",
    "zone fiscale",
    "investissement locatif",
    "immobilier neuf",
    "defiscalisation",
  ],
  openGraph: {
    title: "Villes eligibles Loi Jeanbrun 2026",
    description:
      "Decouvrez les 382 villes francaises eligibles a la loi Jeanbrun.",
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
    departement?: string;
    search?: string;
    page?: string;
    metropoles?: string;
  }>;
}

/**
 * Skeleton pour le chargement des cartes
 */
function VilleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="border-t p-4">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

/**
 * Grille de chargement
 */
function VillesGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <VilleCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Message d'etat vide
 */
function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <MapPin className="mx-auto size-12 text-muted-foreground/50" />
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
      <MapPin className="mx-auto size-12 text-destructive/50" />
      <h3 className="mt-4 text-lg font-semibold text-destructive">
        Erreur de chargement
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Impossible de charger les villes. Veuillez reessayer plus tard.
      </p>
    </div>
  );
}

/**
 * Grille de villes
 */
function VillesGrid({
  villes,
  page,
  totalPages,
  basePath,
}: {
  villes: EspoVille[];
  page: number;
  totalPages: number;
  basePath: string;
}) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {villes.map((ville) => (
          <VilleCard key={ville.id} ville={ville} />
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
function buildBasePath(
  zone: string | undefined,
  departement: string | undefined,
  search: string | undefined,
  metropoles: boolean
): string {
  const params = new URLSearchParams();
  if (zone && zone !== "all") params.set("zone", zone);
  if (departement && departement !== "all") params.set("departement", departement);
  if (search) params.set("search", search);
  if (metropoles) params.set("metropoles", "true");

  const queryString = params.toString();
  return queryString ? `/villes?${queryString}` : "/villes";
}

/**
 * Fetche les villes depuis EspoCRM
 */
async function fetchVilles(
  filters: EspoVilleFilters,
  metropoles: boolean,
  offset: number
): Promise<{ villes: EspoVille[]; total: number } | { error: true }> {
  try {
    const client = getEspoCRMClient();

    const response = metropoles
      ? await client.getMetropoles({ limit: VILLES_PER_PAGE, offset })
      : await client.getVilles(filters, { limit: VILLES_PER_PAGE, offset });

    return { villes: response.list, total: response.total };
  } catch (error) {
    console.error("Erreur lors de la recuperation des villes:", error);
    return { error: true };
  }
}

/**
 * Composant de donnees villes (Server Component avec fetch)
 */
async function VillesData({
  zone,
  departement,
  search,
  page,
  metropoles,
}: {
  zone: string | undefined;
  departement: string | undefined;
  search: string | undefined;
  page: number;
  metropoles: boolean;
}) {
  // Verifier si EspoCRM est disponible
  if (!isEspoCRMAvailable()) {
    return (
      <EmptyState
        title="Configuration requise"
        description="Configurez la variable d'environnement ESPOCRM_API_KEY pour afficher les villes eligibles."
      />
    );
  }

  // Construire les filtres
  const filters: EspoVilleFilters = {};

  if (zone && zone !== "all") {
    filters.zoneFiscale = zone as ZoneFiscale;
  }

  if (departement && departement !== "all") {
    filters.departement = departement;
  }

  if (search) {
    filters.search = search;
  }

  // Calculer l'offset pour la pagination
  const offset = (page - 1) * VILLES_PER_PAGE;

  // Recuperer les villes
  const result = await fetchVilles(filters, metropoles, offset);

  // Gerer l'erreur
  if ("error" in result) {
    return <ErrorState />;
  }

  const { villes, total } = result;
  const totalPages = Math.ceil(total / VILLES_PER_PAGE);

  // Cas vide
  if (villes.length === 0) {
    return (
      <EmptyState
        title="Aucune ville trouvee"
        description="Modifiez vos criteres de recherche pour trouver des villes eligibles."
      />
    );
  }

  // Construire l'URL de base pour la pagination
  const basePath = buildBasePath(zone, departement, search, metropoles);

  return (
    <VillesGrid
      villes={villes}
      page={page}
      totalPages={totalPages}
      basePath={basePath}
    />
  );
}

/**
 * Fetche le compteur de villes
 */
async function fetchVillesCount(
  filters: EspoVilleFilters,
  metropoles: boolean
): Promise<number> {
  try {
    const client = getEspoCRMClient();

    const response = metropoles
      ? await client.getMetropoles({ limit: 1, offset: 0 })
      : await client.getVilles(filters, { limit: 1, offset: 0 });

    return response.total;
  } catch {
    return 0;
  }
}

/**
 * Wrapper avec Suspense pour les filtres
 */
async function VillesFiltersWrapper({
  zone,
  departement,
  search,
  metropoles,
}: {
  zone: string | undefined;
  departement: string | undefined;
  search: string | undefined;
  metropoles: boolean;
}) {
  // Compter le total pour l'affichage
  let totalVilles = 0;

  if (isEspoCRMAvailable()) {
    const filters: EspoVilleFilters = {};
    if (zone && zone !== "all") {
      filters.zoneFiscale = zone as ZoneFiscale;
    }
    if (departement && departement !== "all") {
      filters.departement = departement;
    }
    if (search) {
      filters.search = search;
    }

    totalVilles = await fetchVillesCount(filters, metropoles);
  }

  return <VillesFilters totalVilles={totalVilles} />;
}

/**
 * Page principale /villes
 */
export default async function VillesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const zone = params.zone;
  const departement = params.departement;
  const search = params.search;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const metropoles = params.metropoles === "true";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Building2 className="size-5" />
          <span className="text-sm font-medium">Loi Jeanbrun 2026</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Villes eligibles a la Loi Jeanbrun
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Explorez les villes francaises eligibles au dispositif fiscal Loi
          Jeanbrun. Trouvez le meilleur emplacement pour votre investissement
          locatif en fonction de la zone fiscale, du prix au m2 et de la
          tension locative.
        </p>
      </header>

      {/* Filtres */}
      <section className="mb-8" aria-label="Filtres de recherche">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-9 w-40" />
              </div>
              <Skeleton className="h-5 w-32" />
            </div>
          }
        >
          <VillesFiltersWrapper
            zone={zone}
            departement={departement}
            search={search}
            metropoles={metropoles}
          />
        </Suspense>
      </section>

      {/* Grille de villes */}
      <section aria-label="Liste des villes eligibles">
        <Suspense fallback={<VillesGridSkeleton />}>
          <VillesData
            zone={zone}
            departement={departement}
            search={search}
            page={page}
            metropoles={metropoles}
          />
        </Suspense>
      </section>

      {/* CTA Simulateur */}
      <section className="mt-16 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Calculez vos avantages fiscaux
          </h2>
          <p className="mt-4 text-muted-foreground">
            Utilisez notre simulateur gratuit pour estimer votre reduction
            d&apos;impot avec la Loi Jeanbrun. Jusqu&apos;a 14% de reduction sur
            12 ans.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/simulateur">
                Lancer une simulation
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/loi-jeanbrun">En savoir plus sur la loi</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
