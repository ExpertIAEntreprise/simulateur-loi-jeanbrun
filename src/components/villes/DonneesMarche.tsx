"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EspoVille } from "@/lib/espocrm/types";
import { TrendingUp, TrendingDown, Minus, Home, Euro, BarChart3 } from "lucide-react";

interface DonneesMarcheProps {
  ville: EspoVille;
}

/**
 * Formate un nombre avec separateurs de milliers
 */
function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "N/A";
  }
  return new Intl.NumberFormat("fr-FR").format(Math.round(value));
}

/**
 * Formate un prix en euros avec separateurs de milliers
 */
function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "N/A";
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formate un pourcentage avec signe
 */
function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "N/A";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Determine la couleur et l'icone en fonction de l'evolution
 */
function getEvolutionStyle(value: number | null | undefined): {
  color: string;
  bgColor: string;
  Icon: typeof TrendingUp;
} {
  if (value === null || value === undefined) {
    return {
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      Icon: Minus,
    };
  }

  if (value > 0) {
    return {
      color: "text-green-700 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      Icon: TrendingUp,
    };
  }

  if (value < 0) {
    return {
      color: "text-red-700 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      Icon: TrendingDown,
    };
  }

  return {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    Icon: Minus,
  };
}

/**
 * Affiche les donnees DVF du marche immobilier (prix m2, evolution, transactions)
 */
export function DonneesMarche({ ville }: DonneesMarcheProps) {
  const evolutionStyle = getEvolutionStyle(ville.cEvolutionPrix1An);
  const EvolutionIcon = evolutionStyle.Icon;

  const hasNoData =
    ville.cPrixM2Moyen === null &&
    ville.cEvolutionPrix1An === null &&
    ville.cNbTransactions12Mois === null;

  if (hasNoData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
            Donnees marche immobilier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Les donnees DVF ne sont pas encore disponibles pour cette ville.
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
          Donnees marche immobilier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Prix moyen au m2 */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Euro className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Prix moyen au m2</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {ville.cPrixM2Moyen !== null
                ? formatPrice(ville.cPrixM2Moyen)
                : "N/A"}
            </p>
            {ville.cPrixM2Moyen !== null && (
              <p className="text-muted-foreground mt-1 text-xs">
                Source: DVF (12 derniers mois)
              </p>
            )}
          </div>

          {/* Evolution sur 1 an */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <EvolutionIcon className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Evolution sur 1 an</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <p className={`text-2xl font-bold ${evolutionStyle.color}`}>
                {formatPercent(ville.cEvolutionPrix1An)}
              </p>
              {ville.cEvolutionPrix1An !== null && (
                <Badge
                  className={`${evolutionStyle.bgColor} ${evolutionStyle.color} border-0`}
                >
                  {ville.cEvolutionPrix1An > 0 ? "Hausse" : ville.cEvolutionPrix1An < 0 ? "Baisse" : "Stable"}
                </Badge>
              )}
            </div>
            {ville.cEvolutionPrix1An !== null && (
              <p className="text-muted-foreground mt-1 text-xs">
                Glissement annuel
              </p>
            )}
          </div>

          {/* Nombre de transactions */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Home className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Transactions (12 mois)</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatNumber(ville.cNbTransactions12Mois)}
            </p>
            {ville.cNbTransactions12Mois !== null && (
              <p className="text-muted-foreground mt-1 text-xs">
                Ventes enregistrees
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
