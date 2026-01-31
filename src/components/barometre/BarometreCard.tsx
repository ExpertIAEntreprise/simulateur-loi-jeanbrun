"use client";

/**
 * BarometreCard.tsx
 * Card compacte pour afficher un resume de barometre dans une liste
 */

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EspoVille, EspoBarometre } from "@/lib/espocrm/types";

interface BarometreCardProps {
  /** Donnees de la ville */
  ville: EspoVille;
  /** Dernier barometre de la ville */
  barometre: EspoBarometre | null;
}

/**
 * Labels des zones fiscales
 */
const ZONE_LABELS: Record<string, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

/**
 * Retourne la couleur du score
 */
function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

/**
 * Icone de tendance
 */
function TrendIcon({ value }: { value: number | null }) {
  if (value === null) return <Minus className="h-3 w-3 text-muted-foreground" aria-hidden="true" />;
  if (value > 0) return <TrendingUp className="h-3 w-3 text-green-600" aria-hidden="true" />;
  if (value < 0) return <TrendingDown className="h-3 w-3 text-red-600" aria-hidden="true" />;
  return <Minus className="h-3 w-3 text-muted-foreground" aria-hidden="true" />;
}

/**
 * Formatte une date ISO en mois URL (2026-01)
 */
function formatMoisUrl(moisIso: string): string {
  return moisIso.slice(0, 7);
}

/**
 * Card de barometre pour la liste index
 */
export function BarometreCard({ ville, barometre }: BarometreCardProps) {
  const zoneLabel = ZONE_LABELS[ville.cZoneFiscale] ?? ville.cZoneFiscale;

  // URL du barometre detail
  const moisUrl = barometre ? formatMoisUrl(barometre.cMois) : "";
  const barometreUrl = barometre
    ? `/barometre/${ville.cSlug}/${moisUrl}`
    : `/villes/${ville.cSlug}`;

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Info ville */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{ville.name}</h3>
              <Badge variant="outline" className="text-xs">
                Zone {zoneLabel}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span>
                {ville.cDepartement}
                {ville.cRegion ? ` - ${ville.cRegion}` : ""}
              </span>
            </div>
          </div>

          {/* Score et tendance */}
          <div className="flex flex-col items-end gap-1">
            {barometre ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${getScoreColor(barometre.cScoreAttractivite)}`}>
                    {barometre.cScoreAttractivite}
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendIcon value={barometre.cEvolutionPrixMois} />
                  <span>
                    {barometre.cEvolutionPrixMois !== null
                      ? `${barometre.cEvolutionPrixMois >= 0 ? "+" : ""}${barometre.cEvolutionPrixMois.toFixed(1)}%`
                      : "N/A"}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Pas de donnees</span>
            )}
          </div>
        </div>

        {/* Metriques supplementaires */}
        {barometre && (
          <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Prix m2</p>
              <p className="text-sm font-medium">
                {barometre.cPrixM2 !== null
                  ? `${barometre.cPrixM2.toLocaleString("fr-FR")} EUR`
                  : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Rendement</p>
              <p className="text-sm font-medium">
                {barometre.cRendementBrut !== null
                  ? `${barometre.cRendementBrut.toFixed(1)}%`
                  : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Programmes</p>
              <p className="text-sm font-medium">{barometre.cNbProgrammesActifs}</p>
            </div>
          </div>
        )}

        {/* Lien vers detail */}
        <Link
          href={barometreUrl}
          className="mt-3 flex items-center justify-center gap-1 text-sm text-primary transition-colors hover:underline"
        >
          Voir le barometre
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
