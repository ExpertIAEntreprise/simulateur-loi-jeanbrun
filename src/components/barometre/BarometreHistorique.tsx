"use client";

/**
 * BarometreHistorique.tsx
 * Graphique de l'historique des scores d'attractivite sur 12 mois
 */

import { TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EspoBarometre } from "@/lib/espocrm/types";

interface BarometreHistoriqueProps {
  /** Liste des barometres ordonnee du plus recent au plus ancien */
  historique: EspoBarometre[];
  /** Nom de la ville */
  villeNom: string;
}

/**
 * Formatte un mois ISO en format court francais (ex: "Jan 26")
 */
function formatMoisCourt(moisIso: string): string {
  const moisNoms = [
    "Jan",
    "Fev",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aou",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(moisIso);
  const moisIndex = date.getMonth();
  const annee = date.getFullYear().toString().slice(-2);
  return `${moisNoms[moisIndex]} ${annee}`;
}

/**
 * Retourne la couleur selon le score
 */
function getScoreColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  if (score >= 20) return "bg-orange-500";
  return "bg-red-500";
}

/**
 * Barre de score dans le graphique
 */
function ScoreBar({
  score,
  mois,
  maxScore,
}: {
  score: number;
  mois: string;
  maxScore: number;
}) {
  const height = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const colorClass = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Barre */}
      <div className="relative flex h-32 w-8 flex-col justify-end overflow-hidden rounded-t-md bg-muted/30">
        <div
          className={`w-full rounded-t-md transition-all duration-300 ${colorClass}`}
          style={{ height: `${height}%` }}
          role="img"
          aria-label={`Score ${score}/100 pour ${mois}`}
        />
        {/* Score au-dessus */}
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium">
          {score}
        </span>
      </div>
      {/* Label mois */}
      <span className="text-[10px] text-muted-foreground">{formatMoisCourt(mois)}</span>
    </div>
  );
}

/**
 * Graphique en barres de l'historique des scores
 */
export function BarometreHistorique({
  historique,
  villeNom,
}: BarometreHistoriqueProps) {
  // Pas d'historique disponible
  if (historique.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            Historique des scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            L&apos;historique des barometres n&apos;est pas encore disponible pour {villeNom}.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Inverser pour avoir du plus ancien au plus recent (gauche a droite)
  const historiqueChronologique = [...historique].reverse();

  // Calculer le max pour la normalisation
  const maxScore = Math.max(...historiqueChronologique.map((b) => b.cScoreAttractivite));

  // Calcul de la tendance
  const dernierScore = historiqueChronologique[historiqueChronologique.length - 1]?.cScoreAttractivite ?? 0;
  const premierScore = historiqueChronologique[0]?.cScoreAttractivite ?? 0;
  const tendance = dernierScore - premierScore;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            Historique des scores
          </span>
          {tendance !== 0 && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                tendance > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${tendance < 0 ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
              {tendance > 0 ? "+" : ""}
              {tendance} pts sur la periode
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-end gap-2 pt-6">
            {historiqueChronologique.map((barometre) => (
              <ScoreBar
                key={barometre.id}
                score={barometre.cScoreAttractivite}
                mois={barometre.cMois}
                maxScore={maxScore}
              />
            ))}
          </div>
        </div>

        {/* Legende */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span>Excellent (80+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            <span>Tres bon (60-79)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-amber-500" />
            <span>Correct (40-59)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span>Faible (&lt;40)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
