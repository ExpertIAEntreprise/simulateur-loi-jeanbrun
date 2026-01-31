/**
 * ZonesInvestissement.tsx
 * Section affichant les villes peripheriques d'une metropole
 * pour les pages metropoles (investissement autour de...)
 */

import Link from "next/link";
import { ArrowRight, MapPin, Building2, Euro } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EspoVille } from "@/lib/espocrm/types";
import type { ZoneFiscale } from "@/types/ville";

interface ZonesInvestissementProps {
  /** Metropole parente */
  metropole: EspoVille;
  /** Liste des villes peripheriques */
  villesPeripheriques: EspoVille[];
  /** Nombre max de villes a afficher (default 8) */
  maxVilles?: number;
}

/**
 * Mapping des zones fiscales vers les variantes de badge avec couleurs
 */
const ZONE_BADGE_CONFIG: Record<
  ZoneFiscale,
  { variant: "default" | "secondary" | "outline"; className: string }
> = {
  A_BIS: {
    variant: "default",
    className: "bg-violet-600 hover:bg-violet-700 text-white",
  },
  A: {
    variant: "default",
    className: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  B1: {
    variant: "secondary",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  B2: {
    variant: "secondary",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  C: {
    variant: "outline",
    className: "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
  },
};

/**
 * Labels courts pour les zones fiscales
 */
const ZONE_SHORT_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "A bis",
  A: "Zone A",
  B1: "Zone B1",
  B2: "Zone B2",
  C: "Zone C",
};

/**
 * Formate un prix en euros avec separateurs
 */
function formatPrice(value: number | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Card individuelle pour une ville peripherique
 * Design enrichi avec prix m2 et animations hover
 */
function PeripheriqueCard({ ville }: { ville: EspoVille }) {
  const zoneConfig = ZONE_BADGE_CONFIG[ville.cZoneFiscale];
  const zoneLabel = ZONE_SHORT_LABELS[ville.cZoneFiscale];
  const prixFormate = formatPrice(ville.cPrixM2Moyen);

  return (
    <Link
      href={`/villes/${ville.cSlug}`}
      className="group block h-full"
      aria-label={`Decouvrir ${ville.name} - ${zoneLabel}`}
    >
      <Card className="h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
          {/* Header avec icone et nom */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <MapPin className="size-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary truncate">
                {ville.name}
              </h3>
              <Badge className={`mt-1 ${zoneConfig.className}`}>
                {zoneLabel}
              </Badge>
            </div>
          </div>

          {/* Prix m2 moyen si disponible */}
          {prixFormate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Euro className="size-4" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">{prixFormate}</span>
                <span className="text-xs">/m2</span>
              </span>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
            <span>En savoir plus</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Section Zones d'Investissement
 * Affiche une grille de villes peripheriques autour d'une metropole
 */
export function ZonesInvestissement({
  metropole,
  villesPeripheriques,
  maxVilles = 8,
}: ZonesInvestissementProps) {
  // Ne rien afficher si pas de villes peripheriques
  if (villesPeripheriques.length === 0) {
    return null;
  }

  // Limiter le nombre de villes affichees
  const villesAffichees = villesPeripheriques.slice(0, maxVilles);
  const hasMore = villesPeripheriques.length > maxVilles;
  const nombreRestant = villesPeripheriques.length - maxVilles;

  return (
    <section
      aria-labelledby="zones-investissement-heading"
      className="rounded-2xl bg-muted/50 px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header de section */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Building2 className="size-5" aria-hidden="true" />
            <span className="text-sm font-medium">Nos zones d'investissement</span>
          </div>
          <h2
            id="zones-investissement-heading"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Investir autour de {metropole.name}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Decouvrez les {villesPeripheriques.length} villes peripheriques eligibles
            a la loi Jeanbrun autour de {metropole.name}. Ces communes offrent
            des opportunites d'investissement avec des prix au m2 attractifs.
          </p>
        </div>

        {/* Grille de cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {villesAffichees.map((ville) => (
            <PeripheriqueCard key={ville.id} ville={ville} />
          ))}
        </div>

        {/* CTA "Voir toutes nos villes" si plus de maxVilles */}
        {hasMore && (
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href={`/villes?metropole=${metropole.cSlug}`}>
                <span>Voir toutes les {villesPeripheriques.length} villes</span>
                <ArrowRight
                  className="ml-2 size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              {nombreRestant} {nombreRestant > 1 ? "autres villes" : "autre ville"} a decouvrir
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Version compacte pour affichage dans une sidebar ou section secondaire
 */
interface ZonesInvestissementCompactProps {
  metropole: EspoVille;
  villesPeripheriques: EspoVille[];
  maxVilles?: number;
}

export function ZonesInvestissementCompact({
  metropole,
  villesPeripheriques,
  maxVilles = 4,
}: ZonesInvestissementCompactProps) {
  if (villesPeripheriques.length === 0) {
    return null;
  }

  const villesAffichees = villesPeripheriques.slice(0, maxVilles);
  const hasMore = villesPeripheriques.length > maxVilles;

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="size-5 text-primary" aria-hidden="true" />
          <h3 className="font-semibold">Villes autour de {metropole.name}</h3>
        </div>

        <ul className="space-y-2">
          {villesAffichees.map((ville) => (
            <li key={ville.id}>
              <Link
                href={`/villes/${ville.cSlug}`}
                className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                  <span className="font-medium truncate group-hover:text-primary">
                    {ville.name}
                  </span>
                </div>
                <Badge className={ZONE_BADGE_CONFIG[ville.cZoneFiscale].className}>
                  {ZONE_SHORT_LABELS[ville.cZoneFiscale]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>

        {hasMore && (
          <Link
            href={`/villes?metropole=${metropole.cSlug}`}
            className="group mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary"
          >
            <span>Voir les {villesPeripheriques.length} villes</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
