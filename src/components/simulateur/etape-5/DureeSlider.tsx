"use client"

import { Calendar, Info } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// ============================================================================
// Types
// ============================================================================

export interface DureeSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

// ============================================================================
// Constants
// ============================================================================

const MILESTONES = [
  { year: 9, label: "Minimum Jeanbrun", description: "Duree minimale pour beneficier de l'avantage fiscal" },
  { year: 12, label: "Engagement standard", description: "Duree d'engagement classique" },
  { year: 15, label: "Optimisation patrimoine", description: "Horizon ideal pour une revente sans impot sur plus-value" },
  { year: 20, label: "Investissement long terme", description: "Strategie de capitalisation maximale" },
] as const

// ============================================================================
// Component
// ============================================================================

export function DureeSlider({
  value,
  onChange,
  min = 9,
  max = 25,
  className,
}: DureeSliderProps) {
  const currentMilestone = MILESTONES.find((m) => value >= m.year)
  const percentComplete = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-medium text-foreground">
          Duree de detention
        </h3>
      </div>

      {/* Current value display */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
        <div>
          <p className="text-sm text-muted-foreground">Duree selectionnee</p>
          <p className="text-3xl font-bold text-foreground">
            {value} <span className="text-lg font-normal text-muted-foreground">ans</span>
          </p>
        </div>
        {currentMilestone && (
          <div className="text-right">
            <p className="text-sm font-medium text-accent">{currentMilestone.label}</p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              {currentMilestone.description}
            </p>
          </div>
        )}
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
          min={min}
          max={max}
          step={1}
          className="w-full"
          aria-label={`Duree de detention: ${value} ans`}
        />

        {/* Progress indicator */}
        <div
          className="relative h-2 rounded-full bg-muted overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/80 to-accent transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Range labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min} ans</span>
          <span>{max} ans</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-2 gap-3">
        {MILESTONES.map((milestone) => {
          const isActive = value >= milestone.year
          return (
            <button
              key={milestone.year}
              type="button"
              onClick={() => onChange(milestone.year)}
              aria-label={`Selectionner ${milestone.year} ans - ${milestone.label}`}
              aria-pressed={isActive}
              className={cn(
                "p-3 rounded-lg border text-left transition-all duration-200",
                "hover:scale-[1.02]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "border-accent bg-accent/5"
                  : "border-border bg-card hover:border-accent/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-lg font-bold",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                >
                  {milestone.year} ans
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {milestone.label}
              </p>
            </button>
          )
        })}
      </div>

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
            Engagement minimum 9 ans
          </p>
          <p className="text-sm text-muted-foreground">
            La loi Jeanbrun impose une detention minimale de 9 ans pour conserver
            l&apos;avantage fiscal. Une revente anticipee entraine le remboursement
            des reductions d&apos;impot percues.
          </p>
        </div>
      </div>
    </div>
  )
}
