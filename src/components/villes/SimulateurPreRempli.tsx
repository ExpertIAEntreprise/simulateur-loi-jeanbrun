"use client";

import Link from "next/link";
import { MapPin, Calculator, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ZoneFiscale } from "@/types/ville";

/**
 * Props pour le composant SimulateurPreRempli
 */
interface SimulateurPreRempliProps {
  /** Nom de la ville pour l'affichage */
  villeNom: string;
  /** Slug de la ville pour l'URL */
  villeSlug: string;
  /** Zone fiscale de la ville */
  zoneFiscale: ZoneFiscale;
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
 * Mini formulaire de simulation pré-rempli avec les données de la ville
 * Affiche un CTA prominent pour lancer une simulation personnalisée
 */
export function SimulateurPreRempli({
  villeNom,
  villeSlug,
  zoneFiscale,
}: SimulateurPreRempliProps) {
  const chatUrl = `/chat?ville=${encodeURIComponent(villeSlug)}&zone=${encodeURIComponent(zoneFiscale)}`;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="size-5 text-primary" aria-hidden="true" />
          <CardTitle className="text-lg">Simulation personnalisee</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" aria-hidden="true" />
          <span>{villeNom}</span>
          <Badge variant="secondary" className="text-xs">
            Zone {ZONE_LABELS[zoneFiscale]}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Calculez votre economie d&apos;impot avec un investissement Loi
          Jeanbrun a {villeNom}. Notre simulateur prend en compte les
          specificites de la zone {ZONE_LABELS[zoneFiscale]}.
        </p>

        <Button asChild className="w-full" size="lg">
          <Link href={chatUrl} aria-label={`Simuler mon investissement a ${villeNom}`}>
            Simuler mon investissement a {villeNom}
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
