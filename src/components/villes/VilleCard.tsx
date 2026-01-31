/**
 * VilleCard.tsx
 * Composant Card pour afficher une ville dans la grille de la page /villes
 */

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Euro } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { EspoVille } from "@/lib/espocrm";
import type { ZoneFiscale } from "@/types/ville";

interface VilleCardProps {
  ville: EspoVille;
}

/**
 * Classes de couleur personnalisees pour les badges de zone
 */
const ZONE_BADGE_CLASSES: Record<ZoneFiscale, string> = {
  A_BIS: "bg-red-500 text-white border-red-500 hover:bg-red-600",
  A: "bg-orange-500 text-white border-orange-500 hover:bg-orange-600",
  B1: "bg-blue-500 text-white border-blue-500 hover:bg-blue-600",
  B2: "bg-green-500 text-white border-green-500 hover:bg-green-600",
  C: "bg-gray-500 text-white border-gray-500 hover:bg-gray-600",
};

/**
 * Labels courts pour les zones fiscales
 */
const ZONE_SHORT_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "Zone A bis",
  A: "Zone A",
  B1: "Zone B1",
  B2: "Zone B2",
  C: "Zone C",
};

/**
 * Formate un nombre avec separateur de milliers
 */
function formatNumber(value: number | null): string {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("fr-FR").format(value);
}

/**
 * Formate un prix au m2
 */
function formatPrixM2(value: number | null): string {
  if (value === null) return "N/A";
  return `${formatNumber(Math.round(value))} /m2`;
}

/**
 * Card pour afficher une ville dans la grille
 * Affiche: image, nom, badge zone, population, prix m2, lien
 */
export function VilleCard({ ville }: VilleCardProps) {
  const zoneLabel = ZONE_SHORT_LABELS[ville.cZoneFiscale];
  const badgeClasses = ZONE_BADGE_CLASSES[ville.cZoneFiscale];

  // Image placeholder si pas de photo
  const imageUrl = ville.cPhotoVille || "/images/ville-placeholder.jpg";
  const imageAlt = ville.cPhotoVilleAlt || `Vue de ${ville.name}`;

  return (
    <Link
      href={`/villes/${ville.cSlug}`}
      className="group block h-full"
      aria-label={`Decouvrir ${ville.name} - ${zoneLabel}`}
    >
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        {/* Image de la ville */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {ville.cPhotoVille ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
              <MapPin className="size-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Badge zone fiscale superpose */}
          <Badge
            className={`absolute right-2 top-2 ${badgeClasses}`}
          >
            {zoneLabel}
          </Badge>

          {/* Badge metropole si applicable */}
          {ville.cIsMetropole && (
            <Badge
              variant="secondary"
              className="absolute left-2 top-2 bg-background/80 backdrop-blur-sm"
            >
              Metropole
            </Badge>
          )}
        </div>

        {/* Contenu */}
        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          {/* Nom de la ville */}
          <div>
            <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {ville.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {ville.cDepartement} - {ville.cRegion ?? "France"}
            </p>
          </div>

          {/* Statistiques */}
          <div className="mt-auto grid grid-cols-2 gap-2">
            {/* Population */}
            <div className="flex items-center gap-2 text-sm">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatNumber(ville.cPopulationCommune)} hab.
              </span>
            </div>

            {/* Prix m2 */}
            <div className="flex items-center gap-2 text-sm">
              <Euro className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatPrixM2(ville.cPrixM2Moyen)}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Footer avec CTA */}
        <CardFooter className="border-t p-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium text-primary">
              Voir la fiche
            </span>
            <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
