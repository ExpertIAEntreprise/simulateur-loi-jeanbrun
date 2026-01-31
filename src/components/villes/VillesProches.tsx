"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ZoneFiscale } from "@/types/ville";

/**
 * Ville proche pour le maillage interne
 */
interface VilleProche {
  /** Nom de la ville */
  nom: string;
  /** Slug pour l'URL */
  slug: string;
  /** Zone fiscale */
  zoneFiscale: ZoneFiscale;
}

/**
 * Props pour le composant VillesProches
 */
interface VillesProchesProp {
  /** Liste des villes proches (max 6 affichees) */
  villes: VilleProche[];
}

/**
 * Labels courts pour les zones fiscales
 */
const ZONE_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

/**
 * Couleurs pour les badges de zone fiscale
 */
function getZoneBadgeVariant(zone: ZoneFiscale): "default" | "secondary" | "outline" {
  switch (zone) {
    case "A_BIS":
    case "A":
      return "default";
    case "B1":
      return "secondary";
    default:
      return "outline";
  }
}

/**
 * Grille de villes proches pour le maillage interne SEO
 * Affiche jusqu'a 6 villes avec liens vers leurs pages respectives
 */
export function VillesProches({ villes }: VillesProchesProp) {
  // Ne rien afficher si pas de villes
  if (villes.length === 0) {
    return null;
  }

  // Limiter a 6 villes maximum
  const villesAffichees = villes.slice(0, 6);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-primary" aria-hidden="true" />
          <CardTitle className="text-lg">Villes proches</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <nav aria-label="Villes proches pour investir">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {villesAffichees.map((ville) => (
              <li key={ville.slug}>
                <Link
                  href={`/villes/${ville.slug}`}
                  className="group flex flex-col gap-1.5 rounded-lg border p-3 transition-colors hover:border-primary hover:bg-primary/5"
                  aria-label={`Investir a ${ville.nom}, zone ${ZONE_LABELS[ville.zoneFiscale]}`}
                >
                  <span className="font-medium group-hover:text-primary">
                    {ville.nom}
                  </span>
                  <Badge
                    variant={getZoneBadgeVariant(ville.zoneFiscale)}
                    className="w-fit text-xs"
                  >
                    Zone {ZONE_LABELS[ville.zoneFiscale]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}
