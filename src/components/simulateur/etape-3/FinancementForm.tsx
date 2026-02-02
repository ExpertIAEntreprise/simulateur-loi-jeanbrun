"use client"

import { Info, Euro, Clock, Percent } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// ============================================================================
// Types
// ============================================================================

export interface FinancementFormProps {
  apport: number
  dureeCredit: number
  tauxCredit: number
  autresCredits?: number
  prixTotal: number
  onApportChange: (value: number) => void
  onDureeCreditChange: (value: number) => void
  onTauxCreditChange: (value: number) => void
  onAutresCreditsChange: (value: number) => void
  errors?: {
    apport?: string
    dureeCredit?: string
    tauxCredit?: string
    autresCredits?: string
  }
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formate un nombre avec des separateurs de milliers.
 * Ex: 50000 -> "50 000"
 */
function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return ""
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Calcule le montant a emprunter.
 */
function calculerMontantEmprunt(prixTotal: number, apport: number): number {
  return Math.max(0, prixTotal - apport)
}

/**
 * Calcule le pourcentage d'apport.
 */
function calculerPourcentageApport(apport: number, prixTotal: number): number {
  if (prixTotal <= 0) return 0
  return (apport / prixTotal) * 100
}

// ============================================================================
// Component
// ============================================================================

export function FinancementForm({
  apport,
  dureeCredit,
  tauxCredit,
  autresCredits = 0,
  prixTotal,
  onApportChange,
  onDureeCreditChange,
  onTauxCreditChange,
  onAutresCreditsChange,
  errors,
  className,
}: FinancementFormProps) {
  const montantEmprunt = calculerMontantEmprunt(prixTotal, apport)
  const pourcentageApport = calculerPourcentageApport(apport, prixTotal)

  const handleApportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    onApportChange(Math.min(value, prixTotal))
  }

  const handleApportSliderChange = (values: number[]) => {
    const value = values[0]
    if (typeof value === "number") {
      onApportChange(value)
    }
  }

  const handleDureeSliderChange = (values: number[]) => {
    const value = values[0]
    if (typeof value === "number") {
      onDureeCreditChange(value)
    }
  }

  const handleTauxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    onTauxCreditChange(Math.max(0, Math.min(value, 10)))
  }

  const handleAutresCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    onAutresCreditsChange(Math.max(0, value))
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Apport personnel */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="apport" className="text-base font-medium">
            Apport personnel
          </Label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Input
              id="apport"
              type="number"
              min={0}
              max={prixTotal}
              step={1000}
              value={apport || ""}
              onChange={handleApportChange}
              aria-describedby={errors?.apport ? "apport-error" : undefined}
              aria-invalid={!!errors?.apport}
              className={cn(
                "bg-background border-border h-12",
                "focus-visible:ring-2 focus-visible:ring-amber-500/50",
                errors?.apport && "border-destructive ring-2 ring-destructive/20"
              )}
              placeholder="Ex: 50 000"
            />
            {errors?.apport && (
              <p id="apport-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
                <Info className="size-4" aria-hidden="true" />
                {errors.apport}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Slider
              value={[apport]}
              onValueChange={handleApportSliderChange}
              max={prixTotal}
              step={1000}
              className="flex-1"
              aria-label={`Apport personnel: ${apport} euros sur ${prixTotal} euros`}
            />
            <span className="text-sm font-medium text-muted-foreground w-16 text-right">
              {pourcentageApport.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Info calcule */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Montant a emprunter</span>
            <span className="font-semibold text-foreground">
              {formatNumber(montantEmprunt)} EUR
            </span>
          </div>
        </div>

        {pourcentageApport < 10 && apport > 0 && (
          <div
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg",
              "bg-amber-500/10 border border-amber-500/30"
            )}
          >
            <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Un apport inferieur a 10% peut compliquer l'obtention du pret.
              Les banques apprecient generalement un apport d'au moins 10%.
            </p>
          </div>
        )}
      </div>

      {/* Duree du credit */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <Label className="text-base font-medium">
            Duree du credit
          </Label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">10 ans</span>
            <span className="text-lg font-semibold text-foreground" aria-live="polite">
              {dureeCredit} ans
            </span>
            <span className="text-sm text-muted-foreground">25 ans</span>
          </div>

          <Slider
            value={[dureeCredit]}
            onValueChange={handleDureeSliderChange}
            min={10}
            max={25}
            step={1}
            className="w-full"
            aria-label={`Duree du credit: ${dureeCredit} ans`}
          />
        </div>

        {errors?.dureeCredit && (
          <p id="dureeCredit-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <Info className="size-4" aria-hidden="true" />
            {errors.dureeCredit}
          </p>
        )}

        {dureeCredit > 20 && (
          <div
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg",
              "bg-info-subtle border border-info/30"
            )}
          >
            <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Une duree superieure a 20 ans augmente le cout total du credit
              mais reduit les mensualites.
            </p>
          </div>
        )}
      </div>

      {/* Taux d'interet */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="tauxCredit" className="text-base font-medium">
            Taux d'interet annuel (%)
          </Label>
        </div>

        <Input
          id="tauxCredit"
          type="number"
          min={0}
          max={10}
          step={0.01}
          value={tauxCredit || ""}
          onChange={handleTauxChange}
          aria-describedby={errors?.tauxCredit ? "tauxCredit-error" : "tauxCredit-hint"}
          aria-invalid={!!errors?.tauxCredit}
          className={cn(
            "bg-background border-border h-12 max-w-xs",
            "focus-visible:ring-2 focus-visible:ring-amber-500/50",
            errors?.tauxCredit && "border-destructive ring-2 ring-destructive/20"
          )}
          placeholder="Ex: 3.5"
        />

        {errors?.tauxCredit && (
          <p id="tauxCredit-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <Info className="size-4" aria-hidden="true" />
            {errors.tauxCredit}
          </p>
        )}

        <p id="tauxCredit-hint" className="text-xs text-muted-foreground">
          Taux moyen actuel : environ 3.5% (hors assurance)
        </p>
      </div>

      {/* Autres credits en cours */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="autresCredits" className="text-base font-medium">
            Autres credits en cours (mensualites)
          </Label>
          <span className="text-xs text-muted-foreground">(optionnel)</span>
        </div>

        <Input
          id="autresCredits"
          type="number"
          min={0}
          step={50}
          value={autresCredits || ""}
          onChange={handleAutresCreditsChange}
          aria-describedby={errors?.autresCredits ? "autresCredits-error" : "autresCredits-hint"}
          aria-invalid={!!errors?.autresCredits}
          className={cn(
            "bg-background border-border h-12 max-w-xs",
            "focus-visible:ring-2 focus-visible:ring-amber-500/50",
            errors?.autresCredits && "border-destructive ring-2 ring-destructive/20"
          )}
          placeholder="Ex: 500"
        />

        {errors?.autresCredits && (
          <p id="autresCredits-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <Info className="size-4" aria-hidden="true" />
            {errors.autresCredits}
          </p>
        )}

        <p id="autresCredits-hint" className="text-xs text-muted-foreground">
          Credit auto, credit conso, autres prets immobiliers...
        </p>
      </div>
    </div>
  )
}
