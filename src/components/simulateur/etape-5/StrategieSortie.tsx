"use client"

import { Store, TrendingUp, Gift, Info } from "lucide-react"

import type { WizardStep5 } from "@/contexts/SimulationContext"
import { cn } from "@/lib/utils"

// ============================================================================
// Types
// ============================================================================

export interface StrategieSortieProps {
  value: WizardStep5["strategieSortie"] | undefined
  onChange: (value: WizardStep5["strategieSortie"]) => void
  dureeDetention?: number
  className?: string
}

interface StrategieOption {
  id: WizardStep5["strategieSortie"]
  title: string
  description: string
  icon: typeof Store
  avantages: string[]
  fiscalite: string
}

// ============================================================================
// Constants
// ============================================================================

const STRATEGIES: readonly StrategieOption[] = [
  {
    id: "revente",
    title: "Revente",
    description: "Vendre le bien a l'issue de la periode d'engagement",
    icon: Store,
    avantages: [
      "Recuperation du capital investi",
      "Plus-value potentielle",
      "Reinvestissement possible",
    ],
    fiscalite: "Plus-value imposee (abattements selon duree)",
  },
  {
    id: "conservation",
    title: "Conservation",
    description: "Conserver le bien pour des revenus locatifs continus",
    icon: TrendingUp,
    avantages: [
      "Revenus locatifs perennes",
      "Patrimoine transmissible",
      "Libre de toute contrainte Jeanbrun",
    ],
    fiscalite: "Revenus fonciers imposes au bareme IR",
  },
  {
    id: "donation",
    title: "Donation",
    description: "Transmettre le bien a ses enfants ou heritiers",
    icon: Gift,
    avantages: [
      "Transmission anticipee du patrimoine",
      "Abattements sur les donations",
      "Optimisation successorale",
    ],
    fiscalite: "Droits de donation selon lien de parente",
  },
] as const

// ============================================================================
// Helper Functions
// ============================================================================

function getAbattementPlusValue(duree: number): number {
  // Abattement pour duree de detention (plus-value immobiliere)
  // 6% par an de la 6e a la 21e annee, puis 4% la 22e annee
  if (duree < 6) return 0
  if (duree <= 21) return (duree - 5) * 6
  if (duree === 22) return 96 + 4
  return 100 // Exoneration totale apres 22 ans
}

// ============================================================================
// Component
// ============================================================================

export function StrategieSortie({
  value,
  onChange,
  dureeDetention = 12,
  className,
}: StrategieSortieProps) {
  const abattement = getAbattementPlusValue(dureeDetention)
  const isExonere = abattement >= 100

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Store className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-medium text-foreground">
          Strategie de sortie
        </h3>
      </div>

      {/* Abattement info */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Abattement plus-value a {dureeDetention} ans
            </p>
            <p className="text-2xl font-bold text-foreground">
              {abattement}%
            </p>
          </div>
          <div
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium",
              isExonere
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            )}
          >
            {isExonere ? "Exoneration totale" : "Imposition partielle"}
          </div>
        </div>
        {!isExonere && (
          <p className="text-xs text-muted-foreground mt-2">
            Augmentez la duree de detention pour atteindre l&apos;exoneration
            totale (22 ans).
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-4">
        {STRATEGIES.map((strategie) => {
          const isSelected = value === strategie.id
          const Icon = strategie.icon

          return (
            <button
              key={strategie.id}
              type="button"
              onClick={() => onChange(strategie.id)}
              className={cn(
                // Base styles
                "relative flex items-start gap-4 p-5",
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
              aria-pressed={isSelected}
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
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-accent-foreground" />
                )}
              </div>

              {/* Icon */}
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                  "transition-colors duration-200",
                  isSelected ? "bg-accent/20" : "bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors duration-200",
                    isSelected ? "text-accent" : "text-muted-foreground"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-8">
                <h4
                  className={cn(
                    "text-base font-semibold transition-colors duration-200",
                    isSelected ? "text-accent" : "text-foreground"
                  )}
                >
                  {strategie.title}
                </h4>

                <p className="text-sm text-muted-foreground mt-1">
                  {strategie.description}
                </p>

                {/* Avantages */}
                <ul className="mt-3 space-y-1">
                  {strategie.avantages.map((avantage, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {avantage}
                    </li>
                  ))}
                </ul>

                {/* Fiscalite */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Fiscalite :</span>{" "}
                    {strategie.fiscalite}
                  </p>
                </div>
              </div>
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
            Flexibilite apres l&apos;engagement
          </p>
          <p className="text-sm text-muted-foreground">
            Apres la periode d&apos;engagement Jeanbrun (minimum 9 ans),
            vous etes libre de vendre, conserver ou transmettre le bien
            sans penalite fiscale liee au dispositif.
          </p>
        </div>
      </div>
    </div>
  )
}
