"use client"

import { User, Building2, Building, Info } from "lucide-react"

import type { WizardStep6 } from "@/contexts/SimulationContext"
import { cn } from "@/lib/utils"

// ============================================================================
// Types
// ============================================================================

export interface StructureCardsProps {
  value: WizardStep6["structure"] | undefined
  onChange: (value: WizardStep6["structure"]) => void
  className?: string
}

interface StructureOption {
  id: WizardStep6["structure"]
  title: string
  subtitle: string
  description: string
  icon: typeof User
  avantages: string[]
  inconvenients: string[]
  fiscalite: string
  recommande?: string
}

// ============================================================================
// Constants
// ============================================================================

const STRUCTURES: readonly StructureOption[] = [
  {
    id: "nom_propre",
    title: "Nom propre",
    subtitle: "Personne physique",
    description: "Detenir le bien en votre nom personnel, la solution la plus simple.",
    icon: User,
    avantages: [
      "Simplicite de gestion",
      "Pas de frais de structure",
      "Eligible a la loi Jeanbrun",
    ],
    inconvenients: [
      "Patrimoine personnel expose",
      "Transmission moins optimisee",
      "Imposition a l'IR progressive",
    ],
    fiscalite: "Revenus fonciers imposes au bareme de l'IR",
    recommande: "Investisseurs debutants, projets simples",
  },
  {
    id: "sci_ir",
    title: "SCI a l'IR",
    subtitle: "Societe Civile Immobiliere",
    description: "Structure societaire avec transparence fiscale (IR).",
    icon: Building2,
    avantages: [
      "Protection du patrimoine personnel",
      "Facilite la transmission",
      "Eligible a la loi Jeanbrun",
    ],
    inconvenients: [
      "Couts de creation et gestion",
      "Comptabilite obligatoire",
      "Formalisme juridique",
    ],
    fiscalite: "Transparence fiscale : revenus imposes a l'IR des associes",
    recommande: "Couples, transmission familiale",
  },
  {
    id: "sci_is",
    title: "SCI a l'IS",
    subtitle: "Option Impot sur les Societes",
    description: "SCI soumise a l'impot sur les societes.",
    icon: Building,
    avantages: [
      "Taux IS fixe (15-25%)",
      "Amortissement comptable du bien",
      "Tresorerie accumulee en societe",
    ],
    inconvenients: [
      "Non eligible a la loi Jeanbrun",
      "Plus-value professionnelle a la revente",
      "Double imposition (IS + dividendes)",
    ],
    fiscalite: "IS 15% jusqu'a 42 500 EUR, puis 25%",
  },
] as const

// ============================================================================
// Component
// ============================================================================

export function StructureCards({
  value,
  onChange,
  className,
}: StructureCardsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-medium text-foreground">
          Mode de detention
        </h3>
      </div>

      {/* Options */}
      <div className="grid gap-4">
        {STRUCTURES.map((structure) => {
          const isSelected = value === structure.id
          const Icon = structure.icon
          const isNotEligible = structure.id === "sci_is"

          return (
            <button
              key={structure.id}
              type="button"
              onClick={() => onChange(structure.id)}
              className={cn(
                // Base styles
                "relative flex flex-col p-5",
                "rounded-lg border-2 text-left",
                "transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                // Default state
                "border-border bg-card hover:border-accent/50 hover:scale-[1.005]",
                // Selected state
                isSelected && [
                  "border-accent bg-accent/5",
                  "shadow-glow",
                ],
                // Not eligible
                isNotEligible && !isSelected && "opacity-70"
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

              {/* Header */}
              <div className="flex items-start gap-4 pr-8">
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

                {/* Title */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={cn(
                        "text-base font-semibold transition-colors duration-200",
                        isSelected ? "text-accent" : "text-foreground"
                      )}
                    >
                      {structure.title}
                    </h4>
                    {isNotEligible && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                        Non eligible Jeanbrun
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {structure.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mt-4">
                {structure.description}
              </p>

              {/* Avantages / Inconvenients */}
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs font-medium text-success mb-2">Avantages</p>
                  <ul className="space-y-1">
                    {structure.avantages.map((avantage, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="h-1 w-1 rounded-full bg-success" />
                        {avantage}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-destructive mb-2">Inconvenients</p>
                  <ul className="space-y-1">
                    {structure.inconvenients.map((inconvenient, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="h-1 w-1 rounded-full bg-destructive" />
                        {inconvenient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Fiscalite */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Fiscalite :</span>{" "}
                  {structure.fiscalite}
                </p>
              </div>

              {/* Recommande */}
              {structure.recommande && (
                <div className="mt-2">
                  <p className="text-xs text-accent">
                    <span className="font-medium">Recommande pour :</span>{" "}
                    {structure.recommande}
                  </p>
                </div>
              )}
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
            Eligibilite a la loi Jeanbrun
          </p>
          <p className="text-sm text-muted-foreground">
            La loi Jeanbrun s&apos;applique uniquement aux personnes physiques
            et aux SCI transparentes (option IR). Les SCI a l&apos;IS ne sont
            pas eligibles au dispositif.
          </p>
        </div>
      </div>
    </div>
  )
}
