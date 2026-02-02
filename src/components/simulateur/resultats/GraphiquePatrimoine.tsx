"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Donnee pour une annee du graphique patrimoine
 */
export interface PatrimoineDataPoint {
  /** Annee (0 = aujourd'hui, n = annee de detention) */
  annee: number;
  /** Valeur du bien (avec revalorisation annuelle) */
  valeurBien: number;
  /** Capital rembourse cumule (amortissement credit) */
  capitalRembourse: number;
  /** Economies fiscales cumulees */
  economiesFiscales: number;
}

/**
 * Props pour le composant GraphiquePatrimoine
 */
export interface GraphiquePatrimoineProps {
  /** Donnees du graphique par annee */
  data: PatrimoineDataPoint[];
  /** Classe CSS additionnelle */
  className?: string;
}

/**
 * Format un montant en EUR compact (ex: 150k, 1.2M)
 */
function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`;
  }
  return value.toString();
}

/**
 * Format un montant en EUR complet
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Couleurs du graphique (oklch du design system)
 */
const COLORS = {
  valeurBien: {
    stroke: "oklch(0.78 0.18 75)", // accent/gold
    fill: "oklch(0.78 0.18 75 / 0.2)",
  },
  capitalRembourse: {
    stroke: "oklch(0.72 0.20 145)", // success/green
    fill: "oklch(0.72 0.20 145 / 0.2)",
  },
  economiesFiscales: {
    stroke: "oklch(0.62 0.22 260)", // info/blue
    fill: "oklch(0.62 0.22 260 / 0.2)",
  },
};

/**
 * Tooltip personnalise pour le graphique
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const labelMap: Record<string, string> = {
    valeurBien: "Valeur du bien",
    capitalRembourse: "Capital rembourse",
    economiesFiscales: "Economies fiscales",
  };

  const colorMap: Record<string, string> = {
    valeurBien: "text-[oklch(0.78_0.18_75)]",
    capitalRembourse: "text-[oklch(0.72_0.20_145)]",
    economiesFiscales: "text-[oklch(0.62_0.22_260)]",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm font-medium text-foreground mb-2">
        Annee {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              {labelMap[entry.dataKey] || entry.name}
            </span>
            <span
              className={cn(
                "text-sm font-medium tabular-nums",
                colorMap[entry.dataKey] || "text-foreground"
              )}
            >
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
      {/* Total patrimoine */}
      <div className="mt-2 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Patrimoine net</span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {formatCurrency(
              payload.reduce((acc, entry) => acc + entry.value, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Legende personnalisee pour le graphique
 */
interface CustomLegendProps {
  payload?: Array<{
    value: string;
    type: string;
    color: string;
    dataKey: string;
  }>;
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload || payload.length === 0) {
    return null;
  }

  const labelMap: Record<string, string> = {
    valeurBien: "Valeur du bien",
    capitalRembourse: "Capital rembourse",
    economiesFiscales: "Economies fiscales",
  };

  const colorMap: Record<string, string> = {
    valeurBien: "bg-[oklch(0.78_0.18_75)]",
    capitalRembourse: "bg-[oklch(0.72_0.20_145)]",
    economiesFiscales: "bg-[oklch(0.62_0.22_260)]",
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-1.5 sm:gap-2">
          <span
            className={cn(
              "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm shrink-0",
              colorMap[entry.dataKey] || "bg-muted"
            )}
          />
          <span className="text-xs text-muted-foreground">
            {labelMap[entry.dataKey] || entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * GraphiquePatrimoine - Evolution du patrimoine sur la duree de detention
 *
 * Affiche un AreaChart avec 3 series stackees :
 * 1. Valeur du bien (revalorisation annuelle) - accent/gold
 * 2. Capital rembourse (amortissement credit) - success/green
 * 3. Economies fiscales cumulees - info/blue
 */
export function GraphiquePatrimoine({
  data,
  className,
}: GraphiquePatrimoineProps) {
  // Calculer le domaine Y pour avoir un peu de marge
  const maxValue = useMemo(() => {
    if (data.length === 0) return 100000;
    const max = Math.max(
      ...data.map(
        (d) => d.valeurBien + d.capitalRembourse + d.economiesFiscales
      )
    );
    return Math.ceil(max / 50000) * 50000; // Arrondi au 50k superieur
  }, [data]);

  // Verifier si on a des donnees
  if (data.length === 0) {
    return (
      <Card className={cn("border-border bg-card", className)}>
        <CardHeader>
          <CardTitle className="text-lg">Evolution du patrimoine</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucune donnee disponible pour afficher le graphique.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border-border bg-card animate-fade-in",
        className
      )}
    >
      <CardHeader className="pb-2 px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <span className="text-[oklch(0.78_0.18_75)]">📈</span>
          Evolution du patrimoine
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 5,
                left: -10,
                bottom: 0,
              }}
            >
              <defs>
                {/* Gradient pour valeur bien */}
                <linearGradient id="colorValeurBien" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.valeurBien.stroke}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.valeurBien.stroke}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                {/* Gradient pour capital rembourse */}
                <linearGradient
                  id="colorCapitalRembourse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={COLORS.capitalRembourse.stroke}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.capitalRembourse.stroke}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                {/* Gradient pour economies fiscales */}
                <linearGradient
                  id="colorEconomiesFiscales"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={COLORS.economiesFiscales.stroke}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.economiesFiscales.stroke}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.22 0.005 285)"
                vertical={false}
              />
              <XAxis
                dataKey="annee"
                tick={{ fill: "oklch(0.65 0.015 265)", fontSize: 10 }}
                tickLine={{ stroke: "oklch(0.22 0.005 285)" }}
                axisLine={{ stroke: "oklch(0.22 0.005 285)" }}
                tickFormatter={(value) => `${value}`}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "oklch(0.65 0.015 265)", fontSize: 10 }}
                tickLine={{ stroke: "oklch(0.22 0.005 285)" }}
                axisLine={{ stroke: "oklch(0.22 0.005 285)" }}
                tickFormatter={formatCompact}
                domain={[0, maxValue]}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              {/* Les areas sont stackees dans l'ordre inverse (last on top) */}
              <Area
                type="monotone"
                dataKey="economiesFiscales"
                stackId="1"
                stroke={COLORS.economiesFiscales.stroke}
                fill="url(#colorEconomiesFiscales)"
                strokeWidth={2}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="capitalRembourse"
                stackId="1"
                stroke={COLORS.capitalRembourse.stroke}
                fill="url(#colorCapitalRembourse)"
                strokeWidth={2}
                animationDuration={1000}
                animationEasing="ease-out"
                animationBegin={200}
              />
              <Area
                type="monotone"
                dataKey="valeurBien"
                stackId="1"
                stroke={COLORS.valeurBien.stroke}
                fill="url(#colorValeurBien)"
                strokeWidth={2}
                animationDuration={1000}
                animationEasing="ease-out"
                animationBegin={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
