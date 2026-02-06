"use client"

import { useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  HelpCircle,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface PerteGainVisualisationProps {
  /** Loyer plafonne selon la zone Jeanbrun */
  loyerPlafonne: number
  /** Loyer de marche (estimation sans plafonnement) */
  loyerMarche: number
  /** Economie d'impot annuelle grace a Jeanbrun */
  economieImpot: number
  /** Tranche marginale d'imposition du contribuable */
  tmi: number
  /** Classe CSS additionnelle */
  className?: string
}

interface TooltipState {
  perte: boolean
  gain: boolean
  result: boolean
}

/**
 * Format a number as French currency (EUR)
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format a number as French currency with sign
 */
function formatCurrencyWithSign(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return sign + formatCurrency(value)
}

/**
 * PerteGainVisualisation - Balance perte loyer vs gain fiscal
 *
 * Visualise la comparaison entre :
 * - La perte de loyer (loyer marche - loyer plafonne)
 * - Le gain fiscal (economie d'impot)
 *
 * Affiche le resultat net avec une indication claire si l'operation est profitable.
 */
export function PerteGainVisualisation({
  loyerPlafonne,
  loyerMarche,
  economieImpot,
  tmi,
  className,
}: PerteGainVisualisationProps) {
  const [tooltips, setTooltips] = useState<TooltipState>({
    perte: false,
    gain: false,
    result: false,
  })

  // Calculate values
  const calculations = useMemo(() => {
    const perteMensuelle = Math.max(0, loyerMarche - loyerPlafonne)
    const perteAnnuelle = perteMensuelle * 12
    const gainNetAnnuel = economieImpot - perteAnnuelle
    const isProfitable = gainNetAnnuel > 0
    const isNeutral = gainNetAnnuel === 0

    // Calculate bar heights (max height = 200px)
    const maxValue = Math.max(perteAnnuelle, economieImpot, 1)
    const perteHeight = (perteAnnuelle / maxValue) * 100
    const gainHeight = (economieImpot / maxValue) * 100

    return {
      perteMensuelle,
      perteAnnuelle,
      gainNetAnnuel,
      isProfitable,
      isNeutral,
      perteHeight,
      gainHeight,
      maxValue,
    }
  }, [loyerPlafonne, loyerMarche, economieImpot])

  const showTooltip = (key: keyof TooltipState) => {
    setTooltips((prev) => ({ ...prev, [key]: true }))
  }

  const hideTooltip = (key: keyof TooltipState) => {
    setTooltips((prev) => ({ ...prev, [key]: false }))
  }

  // Check if we have valid data
  if (loyerMarche <= 0 || loyerPlafonne <= 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-card p-4",
          className
        )}
      >
        <p className="text-sm text-muted-foreground">
          Veuillez d&apos;abord saisir les informations de loyer pour visualiser
          la balance perte/gain.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-dashed border-[oklch(0.78_0.18_75_/_0.5)] bg-card p-6 transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-[oklch(0.78_0.18_75)]" />
          <span className="font-medium text-foreground">
            Balance Perte / Gain Jeanbrun
          </span>
        </div>
        <Badge
          className={cn(
            "transition-colors duration-200",
            calculations.isProfitable
              ? "bg-[oklch(0.72_0.20_145)] text-white hover:bg-[oklch(0.72_0.20_145)]"
              : calculations.isNeutral
                ? "bg-[oklch(0.70_0.20_45)] text-white hover:bg-[oklch(0.70_0.20_45)]"
                : "bg-[oklch(0.63_0.24_25)] text-white hover:bg-[oklch(0.63_0.24_25)]"
          )}
        >
          {calculations.isProfitable
            ? "Operation rentable"
            : calculations.isNeutral
              ? "Equilibre"
              : "A optimiser"}
        </Badge>
      </div>

      {/* Balance visualization - responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Left column: Perte */}
        <div className="flex flex-col items-center">
          {/* Bar container */}
          <div className="relative w-full max-w-[120px] h-[200px] flex items-end justify-center mb-4">
            <div
              className={cn(
                "w-full rounded-t-lg bg-gradient-to-t from-[oklch(0.63_0.24_25)] to-[oklch(0.63_0.24_25_/_0.7)]",
                "transition-all duration-500 ease-out animate-slide-up"
              )}
              style={{ height: `${calculations.perteHeight}%` }}
            />
            <ArrowDown
              className="absolute top-2 text-[oklch(0.63_0.24_25)] h-6 w-6"
              aria-hidden="true"
            />
          </div>

          {/* Label and value */}
          <div className="text-center relative">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingDown className="h-4 w-4 text-[oklch(0.63_0.24_25)]" />
              <span className="text-sm font-medium text-foreground">
                Perte loyer
              </span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onMouseEnter={() => showTooltip("perte")}
                onMouseLeave={() => hideTooltip("perte")}
                onFocus={() => showTooltip("perte")}
                onBlur={() => hideTooltip("perte")}
                aria-label="Information sur la perte de loyer"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Tooltip */}
            {tooltips.perte && (
              <div
                className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-lg bg-popover border border-border shadow-lg text-sm"
                role="tooltip"
              >
                <p className="text-xs text-muted-foreground">
                  La perte de loyer correspond a la difference entre le loyer de
                  marche ({formatCurrency(loyerMarche)}/mois) et le loyer
                  plafonne Jeanbrun ({formatCurrency(loyerPlafonne)}/mois).
                </p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
              </div>
            )}

            <div className="space-y-0.5">
              <p className="text-2xl font-bold tabular-nums text-[oklch(0.63_0.24_25)]">
                -{formatCurrency(calculations.perteAnnuelle)}
              </p>
              <p className="text-xs text-muted-foreground">
                soit {formatCurrency(calculations.perteMensuelle)}/mois
              </p>
            </div>
          </div>
        </div>

        {/* Center column: Result */}
        <div className="flex flex-col items-center justify-center order-first md:order-none">
          <div
            className={cn(
              "relative p-6 rounded-xl border-2 transition-all duration-300",
              calculations.isProfitable
                ? "border-[oklch(0.72_0.20_145)] bg-[oklch(0.15_0.05_145)]"
                : calculations.isNeutral
                  ? "border-[oklch(0.70_0.20_45)] bg-[oklch(0.15_0.05_45)]"
                  : "border-[oklch(0.63_0.24_25)] bg-[oklch(0.15_0.05_25)]"
            )}
          >
            <div className="text-center relative">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Gain net annuel
                </span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onMouseEnter={() => showTooltip("result")}
                  onMouseLeave={() => hideTooltip("result")}
                  onFocus={() => showTooltip("result")}
                  onBlur={() => hideTooltip("result")}
                  aria-label="Information sur le gain net"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Tooltip */}
              {tooltips.result && (
                <div
                  className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-lg bg-popover border border-border shadow-lg text-sm"
                  role="tooltip"
                >
                  <p className="text-xs text-muted-foreground">
                    Le gain net annuel est la difference entre l&apos;economie
                    d&apos;impot ({formatCurrency(economieImpot)}) et la perte
                    de loyer ({formatCurrency(calculations.perteAnnuelle)}).
                    {calculations.isProfitable
                      ? " Vous gagnez de l'argent grace a Jeanbrun!"
                      : " Considerez d'autres options."}
                  </p>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
                </div>
              )}

              <p
                className={cn(
                  "text-4xl font-bold tabular-nums transition-colors duration-300",
                  calculations.isProfitable
                    ? "text-[oklch(0.72_0.20_145)]"
                    : calculations.isNeutral
                      ? "text-[oklch(0.70_0.20_45)]"
                      : "text-[oklch(0.63_0.24_25)]"
                )}
                aria-live="polite"
              >
                {formatCurrencyWithSign(calculations.gainNetAnnuel)}
              </p>

              <p className="text-xs text-muted-foreground mt-2">
                {calculations.isProfitable
                  ? "Economie d'impot > Perte de loyer"
                  : calculations.isNeutral
                    ? "Economie d'impot = Perte de loyer"
                    : "Economie d'impot < Perte de loyer"}
              </p>
            </div>
          </div>

          {/* TMI indicator */}
          <p className="text-xs text-muted-foreground mt-3">
            Calcule avec votre TMI de {tmi}%
          </p>
        </div>

        {/* Right column: Gain */}
        <div className="flex flex-col items-center">
          {/* Bar container */}
          <div className="relative w-full max-w-[120px] h-[200px] flex items-end justify-center mb-4">
            <div
              className={cn(
                "w-full rounded-t-lg bg-gradient-to-t from-[oklch(0.72_0.20_145)] to-[oklch(0.72_0.20_145_/_0.7)]",
                "transition-all duration-500 ease-out animate-slide-up"
              )}
              style={{ height: `${calculations.gainHeight}%` }}
            />
            <ArrowUp
              className="absolute top-2 text-[oklch(0.72_0.20_145)] h-6 w-6"
              aria-hidden="true"
            />
          </div>

          {/* Label and value */}
          <div className="text-center relative">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-[oklch(0.72_0.20_145)]" />
              <span className="text-sm font-medium text-foreground">
                Economie impot
              </span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onMouseEnter={() => showTooltip("gain")}
                onMouseLeave={() => hideTooltip("gain")}
                onFocus={() => showTooltip("gain")}
                onBlur={() => hideTooltip("gain")}
                aria-label="Information sur l'economie d'impot"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Tooltip */}
            {tooltips.gain && (
              <div
                className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-lg bg-popover border border-border shadow-lg text-sm"
                role="tooltip"
              >
                <p className="text-xs text-muted-foreground">
                  L&apos;economie d&apos;impot est calculee grace a
                  l&apos;amortissement Jeanbrun (50% sur 9 ans) applique a votre
                  TMI de {tmi}%. Elle reduit directement votre impot sur le
                  revenu.
                </p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
              </div>
            )}

            <div className="space-y-0.5">
              <p className="text-2xl font-bold tabular-nums text-[oklch(0.72_0.20_145)]">
                +{formatCurrency(economieImpot)}
              </p>
              <p className="text-xs text-muted-foreground">
                soit {formatCurrency(economieImpot / 12)}/mois
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary details */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Loyer marche</p>
            <p className="text-sm font-medium tabular-nums">
              {formatCurrency(loyerMarche)}/mois
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Loyer plafonne
            </p>
            <p className="text-sm font-medium tabular-nums">
              {formatCurrency(loyerPlafonne)}/mois
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Perte annuelle</p>
            <p className="text-sm font-medium tabular-nums text-[oklch(0.63_0.24_25)]">
              -{formatCurrency(calculations.perteAnnuelle)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Gain fiscal</p>
            <p className="text-sm font-medium tabular-nums text-[oklch(0.72_0.20_145)]">
              +{formatCurrency(economieImpot)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
