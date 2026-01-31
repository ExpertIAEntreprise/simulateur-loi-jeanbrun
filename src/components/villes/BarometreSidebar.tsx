/**
 * BarometreSidebar.tsx
 * Version compacte du barometre pour affichage en sidebar
 * Inclut un lien vers la page barometre detaillee (maillage interne SEO)
 */

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Star, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { EspoBarometre } from "@/lib/espocrm/types";

interface BarometreSidebarProps {
  barometre: EspoBarometre | null;
  /** Slug de la ville pour le lien vers le barometre (optionnel) */
  villeSlug?: string;
}

/**
 * Convertit un score de tension locative (0-100) en nombre d'etoiles (1-5)
 */
function getStarsFromScore(score: number): number {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

/**
 * Affiche les etoiles de tension locative
 */
function TensionStars({ score }: { score: number }) {
  const stars = getStarsFromScore(score);

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Tension locative: ${stars} etoiles sur 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < stars
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Icone de tendance selon l'evolution
 */
function TrendIcon({ value }: { value: number | null }) {
  if (value === null) {
    return <Minus className="size-4 text-muted-foreground" />;
  }
  if (value > 0) {
    return <TrendingUp className="size-4 text-green-500" />;
  }
  if (value < 0) {
    return <TrendingDown className="size-4 text-red-500" />;
  }
  return <Minus className="size-4 text-muted-foreground" />;
}

/**
 * Format du pourcentage avec signe
 */
function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function BarometreSidebar({ barometre, villeSlug }: BarometreSidebarProps) {
  if (!barometre) {
    return (
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4" />
            Barometre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Donnees non disponibles pour cette ville.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extraire le mois au format YYYY-MM pour le lien
  const moisForUrl = barometre.cMois?.slice(0, 7)?.replace("-", "-") ?? "";

  const rendementFormate = barometre.cRendementBrut
    ? `${barometre.cRendementBrut.toFixed(1)}%`
    : "N/A";

  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4" />
          Barometre {barometre.cMois?.slice(0, 7)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Rendement moyen */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Rendement moyen</span>
          <span className="font-semibold text-primary">{rendementFormate}</span>
        </div>

        {/* Evolution prix */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Evolution prix</span>
          <div className="flex items-center gap-1">
            <TrendIcon value={barometre.cEvolutionPrixMois} />
            <span
              className={`font-semibold ${
                barometre.cEvolutionPrixMois !== null &&
                barometre.cEvolutionPrixMois > 0
                  ? "text-green-600"
                  : barometre.cEvolutionPrixMois !== null &&
                      barometre.cEvolutionPrixMois < 0
                    ? "text-red-600"
                    : ""
              }`}
            >
              {formatPercent(barometre.cEvolutionPrixMois)} /mois
            </span>
          </div>
        </div>

        {/* Tension locative */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tension locative</span>
          <TensionStars score={barometre.cScoreAttractivite} />
        </div>

        {/* Score attractivite */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Score</span>
          <span className="font-semibold">
            <span className="text-lg text-primary">
              {barometre.cScoreAttractivite}
            </span>
            <span className="text-muted-foreground">/100</span>
          </span>
        </div>

        {/* Programmes actifs */}
        {barometre.cNbProgrammesActifs > 0 && (
          <div className="border-t pt-2">
            <span className="text-xs text-muted-foreground">
              {barometre.cNbProgrammesActifs} programme
              {barometre.cNbProgrammesActifs > 1 ? "s" : ""} actif
              {barometre.cNbProgrammesActifs > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </CardContent>

      {/* Lien vers le barometre complet (maillage interne SEO) */}
      {villeSlug && moisForUrl && (
        <CardFooter className="pt-0">
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <Link
              href={`/barometre/${villeSlug}/${moisForUrl}`}
              aria-label={`Voir le barometre complet de ${moisForUrl}`}
            >
              Voir le barometre complet
              <ArrowRight className="ml-1 size-3" aria-hidden="true" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
