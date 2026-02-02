"use client"

import { TrendingUp, Info, AlertTriangle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// ============================================================================
// Types
// ============================================================================

export interface RevalorisationInputProps {
  value: number
  onChange: (value: number) => void
  prixAcquisition?: number
  dureeDetention?: number
  className?: string
}

// ============================================================================
// Constants
// ============================================================================

const SCENARIOS = [
  { rate: 0, label: "Conservateur", description: "Pas de revalorisation" },
  { rate: 1, label: "Prudent", description: "Inflation faible" },
  { rate: 2, label: "Realiste", description: "Marche stable" },
  { rate: 3, label: "Optimiste", description: "Croissance moderee" },
  { rate: 4, label: "Dynamique", description: "Marche porteur" },
] as const

// ============================================================================
// Helper Functions
// ============================================================================

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value)
}

function calculateFutureValue(
  principal: number,
  rate: number,
  years: number
): number {
  return Math.round(principal * Math.pow(1 + rate / 100, years))
}

function calculateGain(
  principal: number,
  rate: number,
  years: number
): number {
  const futureValue = calculateFutureValue(principal, rate, years)
  return futureValue - principal
}

// ============================================================================
// Component
// ============================================================================

export function RevalorisationInput({
  value,
  onChange,
  prixAcquisition = 200000,
  dureeDetention = 12,
  className,
}: RevalorisationInputProps) {
  const valeurFuture = calculateFutureValue(prixAcquisition, value, dureeDetention)
  const plusValue = calculateGain(prixAcquisition, value, dureeDetention)
  const isHighRisk = value > 3

  const currentScenario = SCENARIOS.find((s) => s.rate === Math.round(value))

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-medium text-foreground">
          Taux de revalorisation annuel
        </h3>
      </div>

      {/* Current value display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">Taux annuel</p>
          <p className="text-3xl font-bold text-foreground">
            {value.toFixed(1)}
            <span className="text-lg font-normal text-muted-foreground">%</span>
          </p>
          {currentScenario && (
            <p className="text-xs text-accent mt-1">{currentScenario.label}</p>
          )}
        </div>
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Valeur estimee a {dureeDetention} ans
          </p>
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(valeurFuture)} EUR
          </p>
          <p
            className={cn(
              "text-xs mt-1",
              plusValue > 0 ? "text-success" : "text-muted-foreground"
            )}
          >
            {plusValue > 0 ? "+" : ""}
            {formatNumber(plusValue)} EUR
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-3">
        <Slider
          value={[value]}
          onValueChange={(values) => {
            const newValue = values[0]
            if (typeof newValue === "number") {
              onChange(newValue)
            }
          }}
          min={0}
          max={5}
          step={0.5}
          className="w-full"
          aria-label={`Taux de revalorisation annuel: ${value.toFixed(1)}%`}
        />

        {/* Range labels */}
        <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
          <span>0%</span>
          <span>5%</span>
        </div>
      </div>

      {/* Scenario buttons */}
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((scenario) => {
          const isSelected = Math.round(value) === scenario.rate
          return (
            <button
              key={scenario.rate}
              type="button"
              onClick={() => onChange(scenario.rate)}
              aria-label={`Taux ${scenario.rate}% - ${scenario.label}: ${scenario.description}`}
              aria-pressed={isSelected}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm transition-all duration-200",
                "hover:scale-[1.02]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-accent bg-accent/10 text-accent font-medium"
                  : "border-border bg-card text-muted-foreground hover:border-accent/50"
              )}
            >
              {scenario.rate}% - {scenario.label}
            </button>
          )
        })}
      </div>

      {/* Warning for high rates */}
      {isHighRisk && (
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg",
            "bg-warning-subtle border border-warning/30"
          )}
        >
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-warning-foreground">
              Hypothese optimiste
            </p>
            <p className="text-sm text-muted-foreground">
              Un taux superieur a 3% est optimiste sur le long terme.
              Nous recommandons de retenir un taux entre 1% et 2% pour
              une estimation prudente.
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg",
          "bg-info-subtle border border-info/30"
        )}
      >
        <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-info-foreground">
            Historique du marche immobilier
          </p>
          <p className="text-sm text-muted-foreground">
            Sur les 20 dernieres annees, l&apos;immobilier francais a
            progresse en moyenne de 2% a 3% par an. Les variations sont
            importantes selon les zones geographiques.
          </p>
        </div>
      </div>
    </div>
  )
}
