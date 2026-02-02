"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

// ============================================================================
// Types
// ============================================================================

export interface JaugeEndettementProps {
  revenuMensuel: number
  mensualiteCredit: number
  autresCredits?: number
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calcule le taux d'endettement.
 * Formule: (mensualites totales / revenu mensuel) * 100
 */
function calculerTauxEndettement(
  revenuMensuel: number,
  mensualiteCredit: number,
  autresCredits: number = 0
): number {
  if (revenuMensuel <= 0) return 0
  const mensualitesTotales = mensualiteCredit + autresCredits
  return (mensualitesTotales / revenuMensuel) * 100
}

/**
 * Calcule le reste a vivre.
 * Formule: revenu mensuel - mensualites totales
 */
function calculerResteAVivre(
  revenuMensuel: number,
  mensualiteCredit: number,
  autresCredits: number = 0
): number {
  const mensualitesTotales = mensualiteCredit + autresCredits
  return Math.max(0, revenuMensuel - mensualitesTotales)
}

/**
 * Determine le niveau de risque selon le taux d'endettement.
 */
function getNiveauRisque(taux: number): "ok" | "attention" | "danger" {
  if (taux <= 33) return "ok"
  if (taux <= 35) return "attention"
  return "danger"
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

export function JaugeEndettement({
  revenuMensuel,
  mensualiteCredit,
  autresCredits = 0,
  className,
}: JaugeEndettementProps) {
  const tauxEndettement = calculerTauxEndettement(
    revenuMensuel,
    mensualiteCredit,
    autresCredits
  )
  const resteAVivre = calculerResteAVivre(
    revenuMensuel,
    mensualiteCredit,
    autresCredits
  )
  const niveauRisque = getNiveauRisque(tauxEndettement)

  // Clamp le taux a 50% pour l'affichage visuel
  const tauxAffiche = Math.min(tauxEndettement, 50)

  // Position du seuil 35% sur la jauge
  const positionSeuil35 = 70 // 35% sur une echelle de 0-50% = 70%

  const getBarColor = () => {
    switch (niveauRisque) {
      case "ok":
        return "bg-emerald-500"
      case "attention":
        return "bg-amber-500"
      case "danger":
        return "bg-red-500"
    }
  }

  const getIcon = () => {
    switch (niveauRisque) {
      case "ok":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "attention":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "danger":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getMessage = () => {
    switch (niveauRisque) {
      case "ok":
        return "Votre taux d'endettement est dans les normes bancaires."
      case "attention":
        return "Vous approchez du seuil maximal de 35% fixe par le HCSF."
      case "danger":
        return "Votre taux depasse les 35%. Un courtier peut vous aider a trouver des solutions."
    }
  }

  const mensualitesTotales = mensualiteCredit + autresCredits

  return (
    <div className={cn("space-y-6", className)}>
      {/* Titre */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-medium text-foreground">
          Taux d'endettement
        </h3>
      </div>

      {/* Jauge visuelle */}
      <div className="space-y-3">
        {/* Barre de progression */}
        <div className="relative h-6 rounded-full bg-muted overflow-hidden">
          {/* Barre de remplissage */}
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
              getBarColor()
            )}
            style={{ width: `${(tauxAffiche / 50) * 100}%` }}
          />

          {/* Marqueur 35% */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground/70"
            style={{ left: `${positionSeuil35}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground whitespace-nowrap">
              Seuil 35%
            </span>
          </div>
        </div>

        {/* Legende */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>25%</span>
          <span>50%+</span>
        </div>
      </div>

      {/* Valeur du taux */}
      <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        {getIcon()}
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">
            {tauxEndettement.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">d'endettement</p>
        </div>
      </div>

      {/* Message contextuel */}
      <div
        className={cn(
          "p-4 rounded-lg border",
          niveauRisque === "ok" && "bg-emerald-500/10 border-emerald-500/30",
          niveauRisque === "attention" && "bg-amber-500/10 border-amber-500/30",
          niveauRisque === "danger" && "bg-red-500/10 border-red-500/30"
        )}
      >
        <p
          className={cn(
            "text-sm font-medium",
            niveauRisque === "ok" && "text-emerald-500",
            niveauRisque === "attention" && "text-amber-500",
            niveauRisque === "danger" && "text-red-500"
          )}
        >
          {getMessage()}
        </p>
      </div>

      {/* Details */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Mensualites totales</p>
          <p className="text-lg font-semibold text-foreground">
            {formatNumber(mensualitesTotales)} EUR/mois
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Reste a vivre</p>
          <p
            className={cn(
              "text-lg font-semibold",
              resteAVivre < 1000 ? "text-red-500" : "text-foreground"
            )}
          >
            {formatNumber(resteAVivre)} EUR/mois
          </p>
        </div>
      </div>

      {/* Avertissement reste a vivre */}
      {resteAVivre < 1000 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Votre reste a vivre est inferieur a 1 000 EUR. Les banques
            considerent generalement qu'un reste a vivre minimum de 1 000 EUR
            par personne est necessaire.
          </p>
        </div>
      )}
    </div>
  )
}
