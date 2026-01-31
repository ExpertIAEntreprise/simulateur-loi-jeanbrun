"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface HistoriquePrixDataPoint {
  mois: string;
  prixM2: number;
}

interface HistoriquePrixProps {
  data: HistoriquePrixDataPoint[];
}

/**
 * Formate un prix en euros sans decimales
 */
function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Interface pour les props du tooltip personnalise
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string;
}

/**
 * Composant Tooltip personnalise pour le graphique
 */
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const value = payload[0]?.value;
  if (typeof value !== "number") {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-lg font-bold text-primary">{formatPrice(value)}</p>
      <p className="text-muted-foreground text-xs">par m2</p>
    </div>
  );
}

/**
 * Graphique d'evolution des prix sur 12 mois (Recharts AreaChart)
 */
export function HistoriquePrix({ data }: HistoriquePrixProps) {
  // Verifie si les donnees sont disponibles
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
            Historique des prix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">
              Historique non disponible
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcule les valeurs min et max pour l'axe Y avec marge
  const prices = data.map((d) => d.prixM2);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const margin = (maxPrice - minPrice) * 0.1 || 100;
  const yMin = Math.floor((minPrice - margin) / 100) * 100;
  const yMax = Math.ceil((maxPrice + margin) / 100) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
          Historique des prix (12 mois)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrix" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) =>
                  `${Math.round(value / 1000)}k`
                }
                className="fill-muted-foreground"
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="prixM2"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorPrix)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "hsl(var(--primary))",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Evolution du prix moyen au m2 - Source: DVF
        </p>
      </CardContent>
    </Card>
  );
}
