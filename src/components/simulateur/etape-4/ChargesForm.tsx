"use client"

import { Info, Euro, Percent, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

// ============================================================================
// Types
// ============================================================================

export interface ChargesFormProps {
  chargesAnnuelles: number
  taxeFonciere: number
  vacance: number
  onChargesChange: (value: number) => void
  onTaxeFonciereChange: (value: number) => void
  onVacanceChange: (value: number) => void
  errors?: {
    chargesAnnuelles?: string
    taxeFonciere?: string
    vacance?: string
  }
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

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

export function ChargesForm({
  chargesAnnuelles,
  taxeFonciere,
  vacance,
  onChargesChange,
  onTaxeFonciereChange,
  onVacanceChange,
  errors,
  className,
}: ChargesFormProps) {
  const handleChargesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    onChargesChange(Math.max(0, value))
  }

  const handleTaxeFonciereChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    onTaxeFonciereChange(Math.max(0, value))
  }

  const handleVacanceSliderChange = (values: number[]) => {
    const value = values[0]
    if (typeof value === "number") {
      onVacanceChange(value)
    }
  }

  // Calcul du total des charges annuelles
  const totalCharges = chargesAnnuelles + taxeFonciere

  return (
    <div className={cn("space-y-8", className)}>
      {/* Charges de copropriete */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="chargesAnnuelles" className="text-base font-medium">
            Charges de copropriete (annuelles)
          </Label>
        </div>

        <Input
          id="chargesAnnuelles"
          type="number"
          min={0}
          step={100}
          value={chargesAnnuelles || ""}
          onChange={handleChargesChange}
          className={cn(
            "bg-background border-border h-12 max-w-xs",
            "focus-visible:ring-2 focus-visible:ring-amber-500/50",
            errors?.chargesAnnuelles && "border-destructive ring-2 ring-destructive/20"
          )}
          placeholder="Ex: 1 800"
        />

        {errors?.chargesAnnuelles && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <Info className="size-4" />
            {errors.chargesAnnuelles}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Estimation moyenne : 30 EUR/m2/an pour un appartement
        </p>
      </div>

      {/* Taxe fonciere */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="taxeFonciere" className="text-base font-medium">
            Taxe fonciere (annuelle)
          </Label>
        </div>

        <Input
          id="taxeFonciere"
          type="number"
          min={0}
          step={100}
          value={taxeFonciere || ""}
          onChange={handleTaxeFonciereChange}
          className={cn(
            "bg-background border-border h-12 max-w-xs",
            "focus-visible:ring-2 focus-visible:ring-amber-500/50",
            errors?.taxeFonciere && "border-destructive ring-2 ring-destructive/20"
          )}
          placeholder="Ex: 1 200"
        />

        {errors?.taxeFonciere && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <Info className="size-4" />
            {errors.taxeFonciere}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Variable selon la commune. Consultez le simulateur des impots ou demandez au vendeur.
        </p>
      </div>

      {/* Taux de vacance locative */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-muted-foreground" />
          <Label className="text-base font-medium">
            Taux de vacance locative
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">0%</span>
            <span className="text-lg font-semibold text-foreground">
              {vacance}%
            </span>
            <span className="text-sm text-muted-foreground">10%</span>
          </div>

          <Slider
            value={[vacance]}
            onValueChange={handleVacanceSliderChange}
            min={0}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {errors?.vacance && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <Info className="size-4" />
            {errors.vacance}
          </p>
        )}

        <div
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg",
            "bg-info-subtle border border-info/30"
          )}
        >
          <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Le taux de vacance represente les periodes sans locataire
            (entre deux baux, travaux...). En zone tendue, comptez 2-3%.
            En zone detendue, 5-8% est plus realiste.
          </p>
        </div>
      </div>

      {/* Recapitulatif charges */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
        <h4 className="font-medium text-foreground">Recapitulatif des charges</h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Charges copropriete</span>
            <span className="font-medium text-foreground">
              {formatNumber(chargesAnnuelles)} EUR/an
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxe fonciere</span>
            <span className="font-medium text-foreground">
              {formatNumber(taxeFonciere)} EUR/an
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Vacance locative</span>
            <span className="font-medium text-foreground">{vacance}%</span>
          </div>

          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-medium text-foreground">Total charges fixes</span>
              <span className="font-bold text-foreground">
                {formatNumber(totalCharges)} EUR/an
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Soit {formatNumber(Math.round(totalCharges / 12))} EUR/mois
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
