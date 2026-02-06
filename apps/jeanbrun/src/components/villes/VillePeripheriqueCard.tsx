/**
 * VillePeripheriqueCard.tsx
 * Card pour afficher une ville peripherique avec lien vers sa page
 */

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ZoneFiscale } from "@/types/ville";

interface VillePeripherique {
  nom: string;
  slug: string;
  zoneFiscale: ZoneFiscale;
}

interface VillePeripheriqueCardProps {
  ville: VillePeripherique;
}

/**
 * Mapping des zones fiscales vers les variantes de badge
 */
const ZONE_BADGE_VARIANTS: Record<
  ZoneFiscale,
  "default" | "secondary" | "outline"
> = {
  A_BIS: "default",
  A: "default",
  B1: "secondary",
  B2: "secondary",
  C: "outline",
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
 * Card compacte pour afficher une ville peripherique
 * Utilisee dans les listes de villes autour d'une metropole
 */
export function VillePeripheriqueCard({ ville }: VillePeripheriqueCardProps) {
  const badgeVariant = ZONE_BADGE_VARIANTS[ville.zoneFiscale];
  const zoneLabel = ZONE_SHORT_LABELS[ville.zoneFiscale];

  return (
    <Link
      href={`/villes/${ville.slug}`}
      className="group block"
      aria-label={`Decouvrir ${ville.nom} - ${zoneLabel}`}
    >
      <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="size-4" />
            </div>
            <div>
              <h3 className="font-medium text-foreground group-hover:text-primary">
                {ville.nom}
              </h3>
              <Badge variant={badgeVariant} className="mt-1">
                {zoneLabel}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
            <span className="hidden sm:inline">En savoir plus</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Version liste pour afficher plusieurs villes peripheriques
 */
interface VillesPeripheriquesListProps {
  villes: VillePeripherique[];
  titre?: string;
  metropoleNom?: string;
}

export function VillesPeripheriquesList({
  villes,
  titre,
  metropoleNom,
}: VillesPeripheriquesListProps) {
  if (villes.length === 0) {
    return null;
  }

  const defaultTitre = metropoleNom
    ? `Villes autour de ${metropoleNom}`
    : "Villes peripheriques";

  return (
    <section aria-labelledby="villes-peripheriques-heading">
      <h2
        id="villes-peripheriques-heading"
        className="mb-4 text-xl font-semibold"
      >
        {titre ?? defaultTitre}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {villes.map((ville) => (
          <VillePeripheriqueCard key={ville.slug} ville={ville} />
        ))}
      </div>
    </section>
  );
}
