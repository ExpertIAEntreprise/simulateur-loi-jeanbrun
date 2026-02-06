"use client";

import { TrendingUp, TrendingDown, Minus, Euro, Home, Percent, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EspoBarometre } from "@/lib/espocrm/types";

interface IndicateursMarcheProps {
  /** Donnees du barometre */
  barometre: EspoBarometre;
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
 * Formate un pourcentage avec signe
 */
function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Retourne les styles de couleur selon l'evolution
 */
function getEvolutionStyle(value: number | null): {
  color: string;
  bgColor: string;
  Icon: typeof TrendingUp;
  label: string;
} {
  if (value === null) {
    return {
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      Icon: Minus,
      label: "N/A",
    };
  }

  if (value > 0) {
    return {
      color: "text-green-700 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      Icon: TrendingUp,
      label: "Hausse",
    };
  }

  if (value < 0) {
    return {
      color: "text-red-700 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      Icon: TrendingDown,
      label: "Baisse",
    };
  }

  return {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    Icon: Minus,
    label: "Stable",
  };
}

/**
 * Composant pour une metrique individuelle
 */
function MetricCard({
  icon: Icon,
  label,
  value,
  subLabel,
  evolution,
  showBadge = false,
}: {
  icon: typeof Euro;
  label: string;
  value: string;
  subLabel?: string;
  evolution?: number | null;
  showBadge?: boolean;
}) {
  const evolutionStyle = getEvolutionStyle(evolution ?? null);
  const EvolutionIcon = evolutionStyle.Icon;

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-2xl font-bold">{value}</p>
        {showBadge && evolution !== undefined && evolution !== null && (
          <Badge
            className={`${evolutionStyle.bgColor} ${evolutionStyle.color} border-0`}
          >
            <EvolutionIcon className="mr-1 h-3 w-3" aria-hidden="true" />
            {evolutionStyle.label}
          </Badge>
        )}
      </div>
      {subLabel && (
        <p className="mt-1 text-xs text-muted-foreground">{subLabel}</p>
      )}
      {evolution !== undefined && !showBadge && (
        <div className="mt-1 flex items-center gap-1 text-xs">
          <EvolutionIcon
            className={`h-3 w-3 ${evolutionStyle.color}`}
            aria-hidden="true"
          />
          <span className={evolutionStyle.color}>
            {formatPercent(evolution)} ce mois
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Grille des 4 indicateurs de marche principaux
 * - Prix au m2
 * - Evolution mensuelle
 * - Loyer au m2
 * - Rendement brut
 */
export function IndicateursMarche({ barometre }: IndicateursMarcheProps) {
  const hasData =
    barometre.cPrixM2 !== null ||
    barometre.cLoyerM2 !== null ||
    barometre.cRendementBrut !== null;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
            Indicateurs de marche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Les indicateurs de marche ne sont pas disponibles pour ce mois.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
          Indicateurs de marche
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Prix au m2 */}
          <MetricCard
            icon={Euro}
            label="Prix au m2"
            value={formatEuros(barometre.cPrixM2)}
            evolution={barometre.cEvolutionPrixMois}
            subLabel="Source: DVF"
          />

          {/* Evolution mensuelle */}
          <MetricCard
            icon={TrendingUp}
            label="Evolution mensuelle"
            value={formatPercent(barometre.cEvolutionPrixMois)}
            showBadge
            evolution={barometre.cEvolutionPrixMois}
            subLabel="Glissement mensuel"
          />

          {/* Loyer au m2 */}
          <MetricCard
            icon={Home}
            label="Loyer m2/mois"
            value={
              barometre.cLoyerM2 !== null
                ? `${barometre.cLoyerM2.toFixed(0)} EUR`
                : "N/A"
            }
            subLabel="Estimation mensuelle"
          />

          {/* Rendement brut */}
          <MetricCard
            icon={Percent}
            label="Rendement brut"
            value={
              barometre.cRendementBrut !== null
                ? `${barometre.cRendementBrut.toFixed(2)}%`
                : "N/A"
            }
            subLabel="Annuel estime"
          />
        </div>
      </CardContent>
    </Card>
  );
}
