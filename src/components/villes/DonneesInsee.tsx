"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EspoVille } from "@/lib/espocrm/types";
import { Users, Euro, Building2 } from "lucide-react";

interface DonneesInseeProps {
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
function formatCurrency(value: number | null | undefined): string {
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
 * Affiche les donnees INSEE (population, revenu median)
 */
export function DonneesInsee({ ville }: DonneesInseeProps) {
  const hasNoData =
    ville.cPopulationCommune === null && ville.cRevenuMedian === null;

  if (hasNoData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" aria-hidden="true" />
            Donnees INSEE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Les donnees INSEE ne sont pas encore disponibles pour cette ville.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5" aria-hidden="true" />
          Donnees INSEE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Population */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Population</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatNumber(ville.cPopulationCommune)}
            </p>
            {ville.cPopulationCommune !== null && (
              <p className="text-muted-foreground mt-1 text-xs">
                habitants (recensement INSEE)
              </p>
            )}
          </div>

          {/* Revenu median */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Euro className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Revenu median</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(ville.cRevenuMedian)}
            </p>
            {ville.cRevenuMedian !== null && (
              <p className="text-muted-foreground mt-1 text-xs">
                par unite de consommation/an
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
