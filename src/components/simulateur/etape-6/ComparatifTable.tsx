"use client"

import { Check, X, Minus } from "lucide-react"

import type { WizardStep6 } from "@/contexts/SimulationContext"
import { cn } from "@/lib/utils"

// ============================================================================
// Types
// ============================================================================

export interface ComparatifTableProps {
  selectedStructure: WizardStep6["structure"] | undefined
  className?: string
}

type CriteriaValue = "oui" | "non" | "partiel" | string

interface Criteria {
  label: string
  nomPropre: CriteriaValue
  sciIr: CriteriaValue
  sciIs: CriteriaValue
  important?: boolean
}

// ============================================================================
// Constants
// ============================================================================

const CRITERIA: readonly Criteria[] = [
  {
    label: "Eligible loi Jeanbrun",
    nomPropre: "oui",
    sciIr: "oui",
    sciIs: "non",
    important: true,
  },
  {
    label: "Simplicite de gestion",
    nomPropre: "oui",
    sciIr: "partiel",
    sciIs: "non",
  },
  {
    label: "Protection patrimoine",
    nomPropre: "non",
    sciIr: "oui",
    sciIs: "oui",
  },
  {
    label: "Facilite transmission",
    nomPropre: "partiel",
    sciIr: "oui",
    sciIs: "oui",
  },
  {
    label: "Amortissement comptable",
    nomPropre: "non",
    sciIr: "non",
    sciIs: "oui",
  },
  {
    label: "Deficit imputable IR",
    nomPropre: "oui",
    sciIr: "oui",
    sciIs: "non",
  },
  {
    label: "Taux fixe (non progressif)",
    nomPropre: "non",
    sciIr: "non",
    sciIs: "oui",
  },
  {
    label: "Couts de structure",
    nomPropre: "Aucun",
    sciIr: "~500 EUR/an",
    sciIs: "~800 EUR/an",
  },
  {
    label: "Plus-value a la revente",
    nomPropre: "Particulier",
    sciIr: "Particulier",
    sciIs: "Professionnelle",
  },
] as const

// ============================================================================
// Helper Functions
// ============================================================================

function renderValue(value: CriteriaValue, isHighlighted: boolean) {
  if (value === "oui") {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-6 w-6 rounded-full mx-auto",
          isHighlighted ? "bg-success/20" : "bg-success/10"
        )}
      >
        <Check className="h-4 w-4 text-success" />
      </div>
    )
  }

  if (value === "non") {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-6 w-6 rounded-full mx-auto",
          isHighlighted ? "bg-destructive/20" : "bg-destructive/10"
        )}
      >
        <X className="h-4 w-4 text-destructive" />
      </div>
    )
  }

  if (value === "partiel") {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-6 w-6 rounded-full mx-auto",
          isHighlighted ? "bg-warning/20" : "bg-warning/10"
        )}
      >
        <Minus className="h-4 w-4 text-warning" />
      </div>
    )
  }

  // String value
  return (
    <span
      className={cn(
        "text-sm",
        isHighlighted ? "font-medium text-foreground" : "text-muted-foreground"
      )}
    >
      {value}
    </span>
  )
}

// ============================================================================
// Component
// ============================================================================

export function ComparatifTable({
  selectedStructure,
  className,
}: ComparatifTableProps) {
  const getColumnHighlight = (
    structure: WizardStep6["structure"]
  ): boolean => {
    return selectedStructure === structure
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <h3 className="text-base font-medium text-foreground">
        Comparatif des structures
      </h3>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th scope="col" className="px-4 py-3 text-left font-medium text-foreground">
                Critere
              </th>
              <th
                scope="col"
                className={cn(
                  "px-4 py-3 text-center font-medium transition-colors",
                  getColumnHighlight("nom_propre")
                    ? "bg-accent/10 text-accent"
                    : "text-foreground"
                )}
              >
                Nom propre
              </th>
              <th
                scope="col"
                className={cn(
                  "px-4 py-3 text-center font-medium transition-colors",
                  getColumnHighlight("sci_ir")
                    ? "bg-accent/10 text-accent"
                    : "text-foreground"
                )}
              >
                SCI IR
              </th>
              <th
                scope="col"
                className={cn(
                  "px-4 py-3 text-center font-medium transition-colors",
                  getColumnHighlight("sci_is")
                    ? "bg-accent/10 text-accent"
                    : "text-foreground"
                )}
              >
                SCI IS
              </th>
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((criteria, index) => (
              <tr
                key={criteria.label}
                className={cn(
                  "border-t border-border",
                  index % 2 === 0 ? "bg-card" : "bg-muted/20",
                  criteria.important && "bg-info-subtle/50"
                )}
              >
                <td
                  className={cn(
                    "px-4 py-3 text-left",
                    criteria.important
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {criteria.label}
                  {criteria.important && (
                    <span className="ml-2 text-xs text-info">*</span>
                  )}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-center transition-colors",
                    getColumnHighlight("nom_propre") && "bg-accent/5"
                  )}
                >
                  {renderValue(
                    criteria.nomPropre,
                    getColumnHighlight("nom_propre")
                  )}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-center transition-colors",
                    getColumnHighlight("sci_ir") && "bg-accent/5"
                  )}
                >
                  {renderValue(
                    criteria.sciIr,
                    getColumnHighlight("sci_ir")
                  )}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-center transition-colors",
                    getColumnHighlight("sci_is") && "bg-accent/5"
                  )}
                >
                  {renderValue(
                    criteria.sciIs,
                    getColumnHighlight("sci_is")
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-success/10">
            <Check className="h-3 w-3 text-success" />
          </div>
          <span>Oui</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-destructive/10">
            <X className="h-3 w-3 text-destructive" />
          </div>
          <span>Non</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-warning/10">
            <Minus className="h-3 w-3 text-warning" />
          </div>
          <span>Partiel</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-info">*</span>
          <span>Critere important</span>
        </div>
      </div>
    </div>
  )
}
