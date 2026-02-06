"use client"

import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface TravauxValidatorProps {
  montantTravaux: number
  prixAcquisition: number
  className?: string | undefined
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
 * Get the color class based on percentage threshold
 */
function getProgressColor(pourcentage: number): string {
  if (pourcentage < 30) return "bg-[oklch(0.63_0.24_25)]" // Rouge
  if (pourcentage < 50) return "bg-[oklch(0.70_0.20_45)]" // Orange
  return "bg-[oklch(0.72_0.20_145)]" // Vert
}

/**
 * Get the status message based on percentage
 */
function getStatusMessage(pourcentage: number): {
  label: string
  color: "danger" | "warning" | "success"
} {
  if (pourcentage < 30) {
    return { label: "Non eligible", color: "danger" }
  }
  if (pourcentage < 50) {
    return { label: "Limite", color: "warning" }
  }
  return { label: "Confortable", color: "success" }
}

export function TravauxValidator({
  montantTravaux,
  prixAcquisition,
  className,
}: TravauxValidatorProps) {
  // Prevent division by zero
  if (prixAcquisition <= 0) {
    return (
      <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
        <p className="text-sm text-muted-foreground">
          Veuillez d'abord saisir le prix d'acquisition.
        </p>
      </div>
    )
  }

  // Calculate values
  const pourcentage = (montantTravaux / prixAcquisition) * 100
  const montantMinimum = prixAcquisition * 0.3
  const manquant = Math.max(0, montantMinimum - montantTravaux)
  const isEligible = pourcentage >= 30

  const status = getStatusMessage(pourcentage)
  const progressColor = getProgressColor(pourcentage)

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all duration-300",
        isEligible
          ? "border-dashed border-2 border-[oklch(0.78_0.18_75_/_0.5)] bg-card"
          : "border-border bg-card",
        className
      )}
    >
      {/* Header with badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isEligible ? (
            <CheckCircle2 className="h-5 w-5 text-[oklch(0.72_0.20_145)]" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-[oklch(0.63_0.24_25)]" />
          )}
          <span className="font-medium text-foreground">
            Validation travaux
          </span>
        </div>

        <Badge
          className={cn(
            "transition-colors duration-200",
            status.color === "success" && "bg-[oklch(0.72_0.20_145)] text-white hover:bg-[oklch(0.72_0.20_145)]",
            status.color === "warning" && "bg-[oklch(0.70_0.20_45)] text-white hover:bg-[oklch(0.70_0.20_45)]",
            status.color === "danger" && "bg-[oklch(0.63_0.24_25)] text-white hover:bg-[oklch(0.63_0.24_25)]"
          )}
        >
          {isEligible ? (
            <>Eligible <span className="ml-1">&#x2713;</span></>
          ) : (
            "Non eligible"
          )}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div
          className="relative h-4 rounded-full overflow-hidden bg-muted"
          role="progressbar"
          aria-valuenow={Math.round(pourcentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Part des travaux: ${pourcentage.toFixed(1)}% - ${isEligible ? "Eligible" : "Non eligible"} Jeanbrun`}
        >
          {/* Progress fill */}
          <div
            className={cn(
              "absolute h-full transition-all duration-500 ease-out",
              progressColor
            )}
            style={{ width: `${Math.min(pourcentage, 100)}%` }}
            aria-hidden="true"
          />

          {/* 30% threshold marker */}
          <div
            className="absolute h-full w-0.5 bg-accent z-10"
            style={{ left: "30%" }}
            aria-hidden="true"
          />

          {/* 50% threshold marker (subtle) */}
          <div
            className="absolute h-full w-0.5 bg-muted-foreground/30 z-10"
            style={{ left: "50%" }}
            aria-hidden="true"
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
          <span>0%</span>
          <span className="text-accent font-medium">30% min</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Percentage and amount info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            Part travaux
          </span>
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
              isEligible ? "text-[oklch(0.72_0.20_145)]" : "text-[oklch(0.63_0.24_25)]"
            )}
          >
            {pourcentage.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            Montant travaux
          </span>
          <span className="text-sm font-medium text-foreground tabular-nums">
            {formatCurrency(montantTravaux)}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            Minimum requis (30%)
          </span>
          <span className="text-sm font-medium text-foreground tabular-nums">
            {formatCurrency(montantMinimum)}
          </span>
        </div>
      </div>

      {/* Alert if not eligible */}
      {!isEligible && manquant > 0 && (
        <div
          className={cn(
            "mt-4 flex items-start gap-3 p-3 rounded-lg",
            "bg-[oklch(0.15_0.05_25)] border border-[oklch(0.63_0.24_25_/_0.3)]",
            "animate-fade-in"
          )}
          role="alert"
        >
          <AlertTriangle className="h-4 w-4 text-[oklch(0.63_0.24_25)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-[oklch(0.85_0.15_25)]">
              Non eligible Jeanbrun
            </p>
            <p className="text-sm text-muted-foreground">
              Il manque{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {formatCurrency(manquant)}
              </span>{" "}
              pour atteindre les 30% requis.
            </p>
          </div>
        </div>
      )}

      {/* Success message if eligible */}
      {isEligible && (
        <div
          className={cn(
            "mt-4 flex items-start gap-3 p-3 rounded-lg",
            "bg-[oklch(0.15_0.05_145)] border border-[oklch(0.72_0.20_145_/_0.3)]",
            "animate-fade-in"
          )}
          role="status"
        >
          <CheckCircle2 className="h-4 w-4 text-[oklch(0.72_0.20_145)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-[oklch(0.85_0.15_150)]">
              {status.label === "Confortable"
                ? "Budget travaux confortable"
                : "Budget travaux limite"
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {status.label === "Confortable"
                ? "Votre part travaux depasse largement le seuil de 30% requis."
                : "Votre part travaux atteint le minimum de 30% requis, mais sans marge."
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
