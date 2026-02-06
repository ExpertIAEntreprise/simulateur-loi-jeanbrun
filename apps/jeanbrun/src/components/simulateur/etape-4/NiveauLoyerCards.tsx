"use client"

import { useCallback, useRef } from "react"
import { Home, Users, Heart, Info } from "lucide-react"
import type { WizardStep4 } from "@/contexts/SimulationContext"
import { cn } from "@/lib/utils"

// ============================================================================
// Types
// ============================================================================

export interface NiveauLoyerCardsProps {
  value?: WizardStep4["niveauLoyer"]
  onChange: (value: WizardStep4["niveauLoyer"]) => void
  zoneFiscale?: "A_BIS" | "A" | "B1" | "B2" | "C"
  surface?: number
  className?: string
}

type PlafondRecord = Record<string, number>

interface NiveauOption {
  id: WizardStep4["niveauLoyer"]
  title: string
  description: string
  icon: typeof Home
  reduction: string
  plafonds: PlafondRecord
}

// Plafonds de loyer par zone (EUR/m2) - Loi Jeanbrun
const PLAFONDS_LOYER: Record<string, Record<string, number>> = {
  intermediaire: {
    A_BIS: 18.89,
    A: 14.03,
    B1: 11.31,
    B2: 9.83,
    C: 8.6,
  },
  social: {
    A_BIS: 14.22,
    A: 10.55,
    B1: 8.51,
    B2: 7.4,
    C: 6.47,
  },
  tres_social: {
    A_BIS: 11.07,
    A: 8.22,
    B1: 6.63,
    B2: 5.76,
    C: 5.04,
  },
}

const options: readonly NiveauOption[] = [
  {
    id: "intermediaire",
    title: "Loyer Intermediaire",
    description: "Loyer 10-20% sous le marche. Public plus large.",
    icon: Home,
    reduction: "4% du prix/an",
    plafonds: PLAFONDS_LOYER.intermediaire as PlafondRecord,
  },
  {
    id: "social",
    title: "Loyer Social",
    description: "Loyer encadre pour menages modestes. Reduction majoree.",
    icon: Users,
    reduction: "5% du prix/an",
    plafonds: PLAFONDS_LOYER.social as PlafondRecord,
  },
  {
    id: "tres_social",
    title: "Loyer Tres Social",
    description: "Loyer tres encadre pour menages tres modestes. Reduction maximale.",
    icon: Heart,
    reduction: "6% du prix/an",
    plafonds: PLAFONDS_LOYER.tres_social as PlafondRecord,
  },
] as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calcule le coefficient de surface.
 * Formule: min(1.2, 0.7 + 19/surface)
 */
function calculerCoefficientSurface(surface: number): number {
  if (surface <= 0) return 1.2
  return Math.min(1.2, 0.7 + 19 / surface)
}

/**
 * Calcule le loyer maximum mensuel.
 * Formule: plafond_zone * surface * coefficient_surface
 */
function calculerLoyerMax(
  plafondM2: number,
  surface: number
): number {
  const coef = calculerCoefficientSurface(surface)
  return Math.round(plafondM2 * surface * coef)
}

/**
 * Formate un nombre avec des separateurs de milliers.
 */
function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value)
}

// ============================================================================
// Component
// ============================================================================

export function NiveauLoyerCards({
  value,
  onChange,
  zoneFiscale = "B1",
  surface = 50,
  className,
}: NiveauLoyerCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const getPlafondForOption = (option: NiveauOption): number => {
    const plafondZone = option.plafonds[zoneFiscale]
    return plafondZone ?? option.plafonds.B1 ?? 10
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = options.findIndex((o) => o.id === value)
      let nextIndex = currentIndex

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault()
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
          break
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault()
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
          break
        case "Home":
          e.preventDefault()
          nextIndex = 0
          break
        case "End":
          e.preventDefault()
          nextIndex = options.length - 1
          break
        default:
          return
      }

      const nextOption = options[nextIndex]
      if (nextOption) {
        onChange(nextOption.id)
        const buttons = containerRef.current?.querySelectorAll('[role="radio"]')
        const nextButton = buttons?.[nextIndex] as HTMLButtonElement | undefined
        nextButton?.focus()
      }
    },
    [value, onChange]
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Home className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-medium text-foreground">
          Niveau de loyer
        </h3>
      </div>

      {/* Info zone */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Zone fiscale : <span className="font-medium text-foreground">{zoneFiscale.replace("_", " ")}</span>
          {" "} | Surface : <span className="font-medium text-foreground">{surface} m2</span>
          {" "} | Coefficient : <span className="font-medium text-foreground">{calculerCoefficientSurface(surface).toFixed(2)}</span>
        </p>
      </div>

      {/* Options */}
      <div
        ref={containerRef}
        className="grid gap-3 sm:gap-4"
        role="radiogroup"
        aria-label="Niveau de loyer"
        onKeyDown={handleKeyDown}
      >
        {options.map((option, index) => {
          const isSelected = value === option.id
          const Icon = option.icon
          const plafondM2 = getPlafondForOption(option)
          const loyerMax = calculerLoyerMax(plafondM2, surface)

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (value === undefined && index === 0) ? 0 : -1}
              onClick={() => onChange(option.id)}
              className={cn(
                // Base styles
                "relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-5",
                "rounded-lg border-2 text-left",
                "transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                // Default state
                "border-border bg-card hover:border-accent/50 hover:scale-[1.01]",
                // Selected state
                isSelected && [
                  "border-accent bg-accent/5",
                  "shadow-glow",
                ]
              )}
            >
              {/* Radio indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 h-5 w-5 rounded-full border-2",
                  "flex items-center justify-center",
                  "transition-all duration-200",
                  isSelected
                    ? "border-accent bg-accent"
                    : "border-muted-foreground/40 bg-transparent"
                )}
                aria-hidden="true"
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-accent-foreground" />
                )}
              </div>

              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full",
                  "transition-colors duration-200",
                  isSelected ? "bg-accent/20" : "bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200",
                    isSelected ? "text-accent" : "text-muted-foreground"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={cn(
                      "text-sm sm:text-base font-semibold transition-colors duration-200",
                      isSelected ? "text-accent" : "text-foreground"
                    )}
                  >
                    {option.title}
                  </h4>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      isSelected
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {option.reduction}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {option.description}
                </p>

                {/* Loyer max */}
                <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Loyer max :</span>
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    {formatNumber(loyerMax)} EUR/mois
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({plafondM2.toFixed(2)} EUR/m2)
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Info complementaire */}
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg",
          "bg-info-subtle border border-info/30"
        )}
      >
        <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-info-foreground">
            Avantage fiscal progressif
          </p>
          <p className="text-sm text-muted-foreground">
            Plus le niveau de loyer est bas, plus la reduction d'impot est importante.
            Le loyer intermediaire offre 4% du prix d'achat en reduction annuelle,
            le social 5%, et le tres social 6%.
          </p>
        </div>
      </div>
    </div>
  )
}
