"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  PercentCircle,
  BadgeEuro,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant SyntheseCard
 */
export interface SyntheseCardProps {
  /** Montant total des economies d'impot sur la duree (EUR) */
  economieFiscale: number;
  /** Cash-flow mensuel = loyer - mensualite - charges (EUR/mois) */
  cashFlowMensuel: number;
  /** Rendement net apres impots (%) */
  rendementNet: number;
  /** Effort d'epargne mensuel net apres economie fiscale (EUR/mois) */
  effortEpargne: number;
  /** Classe CSS additionnelle */
  className?: string;
}

/**
 * Format un nombre en devise EUR (francais)
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format un pourcentage
 */
function formatPercent(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Type pour un KPI individuel
 */
interface KPIData {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  icon: React.ReactNode;
  isPositive: boolean;
  description: string;
}

/**
 * SyntheseCard - 4 KPIs principaux du resultat de simulation
 *
 * Affiche :
 * 1. Economie fiscale totale - Montant total d'economies d'impot sur la duree
 * 2. Cash-flow mensuel - Loyer - mensualite - charges
 * 3. Rendement net - Rendement apres impots
 * 4. Effort d'epargne - Effort mensuel net apres economie fiscale
 */
export function SyntheseCard({
  economieFiscale,
  cashFlowMensuel,
  rendementNet,
  effortEpargne,
  className,
}: SyntheseCardProps) {
  const kpis = useMemo<KPIData[]>(() => {
    return [
      {
        id: "economie-fiscale",
        label: "Economie fiscale totale",
        value: formatCurrency(economieFiscale),
        rawValue: economieFiscale,
        icon: <PiggyBank className="h-5 w-5" />,
        isPositive: economieFiscale >= 0,
        description: "Economies d'impot sur la duree",
      },
      {
        id: "cash-flow",
        label: "Cash-flow mensuel",
        value: formatCurrency(cashFlowMensuel),
        rawValue: cashFlowMensuel,
        icon: <Wallet className="h-5 w-5" />,
        isPositive: cashFlowMensuel >= 0,
        description: "Loyer - mensualite - charges",
      },
      {
        id: "rendement-net",
        label: "Rendement net",
        value: formatPercent(rendementNet),
        rawValue: rendementNet,
        icon: <PercentCircle className="h-5 w-5" />,
        isPositive: rendementNet >= 0,
        description: "Rendement apres impots",
      },
      {
        id: "effort-epargne",
        label: "Effort d'epargne",
        value: formatCurrency(effortEpargne),
        rawValue: effortEpargne,
        icon: <BadgeEuro className="h-5 w-5" />,
        // Pour l'effort d'epargne, un montant negatif signifie un gain
        isPositive: effortEpargne <= 0,
        description: "Effort mensuel net",
      },
    ];
  }, [economieFiscale, cashFlowMensuel, rendementNet, effortEpargne]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-4",
        className
      )}
    >
      {kpis.map((kpi, index) => (
        <Card
          key={kpi.id}
          className={cn(
            "p-4 border-border bg-card transition-all duration-300",
            "animate-fade-in"
          )}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "both",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
                kpi.isPositive
                  ? "bg-[oklch(0.20_0.08_145)] text-[oklch(0.72_0.20_145)]"
                  : "bg-[oklch(0.20_0.10_25)] text-[oklch(0.63_0.24_25)]"
              )}
            >
              {kpi.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">
                {kpi.label}
              </p>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-2xl sm:text-3xl font-bold tabular-nums truncate",
                    kpi.isPositive
                      ? "text-[oklch(0.72_0.20_145)]"
                      : "text-[oklch(0.63_0.24_25)]"
                  )}
                >
                  {kpi.value}
                </p>
                {/* Trend indicator */}
                {kpi.isPositive ? (
                  <TrendingUp
                    className="h-4 w-4 text-[oklch(0.72_0.20_145)] shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <TrendingDown
                    className="h-4 w-4 text-[oklch(0.63_0.24_25)] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
