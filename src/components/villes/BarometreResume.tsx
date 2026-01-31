"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, BarChart3, Building2, Percent, Euro, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { EspoBarometre } from "@/lib/espocrm/types";

/**
 * Props pour le composant BarometreResume
 */
interface BarometreResumeProps {
  /** Donnees du barometre mensuel (peut etre null) */
  barometre: EspoBarometre | null;
  /** Slug de la ville pour le lien vers le barometre complet */
  villeSlug?: string;
}

/**
 * Formate un nombre en euros
 */
function formatEuros(value: number | null): string {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formate un pourcentage
 */
function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

/**
 * Retourne l'icone de tendance appropriee
 */
function TrendIcon({ value }: { value: number | null }) {
  if (value === null) return <Minus className="size-4 text-muted-foreground" aria-hidden="true" />;
  if (value > 0) return <TrendingUp className="size-4 text-green-600" aria-hidden="true" />;
  if (value < 0) return <TrendingDown className="size-4 text-red-600" aria-hidden="true" />;
  return <Minus className="size-4 text-muted-foreground" aria-hidden="true" />;
}

/**
 * Jauge circulaire pour le score d'attractivite
 */
function ScoreGauge({ score }: { score: number }) {
  // Calcul du cercle SVG
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  // Couleur selon le score
  const getScoreColor = (s: number) => {
    if (s >= 70) return "text-green-500";
    if (s >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="size-24 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        {/* Cercle de fond */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/30"
        />
        {/* Cercle de progression */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={getScoreColor(score)}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

/**
 * Affichage d'une metrique individuelle
 */
function MetricItem({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: typeof Euro;
  label: string;
  value: string;
  trend?: number | null;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-medium">{value}</span>
        {trend !== undefined && <TrendIcon value={trend} />}
      </div>
    </div>
  );
}

/**
 * Resume compact du barometre mensuel pour une ville
 * Affiche le score d'attractivite, prix, rendement et programmes
 */
export function BarometreResume({ barometre, villeSlug }: BarometreResumeProps) {
  // Affichage si pas de barometre
  if (!barometre) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-lg">Barometre du marche</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Barometre non disponible pour cette ville.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-primary" aria-hidden="true" />
          <CardTitle className="text-lg">Barometre du marche</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score d'attractivite */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Score d&apos;attractivite</p>
            <p className="text-xs text-muted-foreground">
              Indice composite mensuel
            </p>
          </div>
          <ScoreGauge score={barometre.cScoreAttractivite} />
        </div>

        <Separator />

        {/* Metriques */}
        <div className="space-y-3">
          <MetricItem
            icon={Euro}
            label="Prix m2"
            value={formatEuros(barometre.cPrixM2)}
            trend={barometre.cEvolutionPrixMois}
          />
          <MetricItem
            icon={Percent}
            label="Rendement brut"
            value={barometre.cRendementBrut !== null ? `${barometre.cRendementBrut.toFixed(1)}%` : "N/A"}
          />
          <MetricItem
            icon={Building2}
            label="Programmes actifs"
            value={String(barometre.cNbProgrammesActifs)}
          />
        </div>

        {/* Evolution prix */}
        {barometre.cEvolutionPrixMois !== null && (
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <TrendIcon value={barometre.cEvolutionPrixMois} />
              <span className="text-sm">
                {barometre.cEvolutionPrixMois >= 0 ? "Hausse" : "Baisse"} de{" "}
                <span className="font-medium">
                  {formatPercent(barometre.cEvolutionPrixMois)}
                </span>{" "}
                ce mois
              </span>
            </div>
          </div>
        )}

        {/* Lien vers barometre complet */}
        {villeSlug && (
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link href={`/villes/${villeSlug}/barometre`}>
              Voir le barometre complet
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
