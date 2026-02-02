"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WizardStep1 } from "@/contexts/SimulationContext"
import { useSimulation } from "@/lib/hooks/useSimulation"
import { cn } from "@/lib/utils"

// ============================================================================
// Validation Schema
// ============================================================================

const profilFormSchema = z.object({
  situation: z.enum(["celibataire", "marie", "pacse"], {
    error: "Veuillez sélectionner votre situation",
  }),
  parts: z
    .number({ error: "Le nombre de parts doit être un nombre" })
    .min(1, "Minimum 1 part fiscale")
    .max(10, "Maximum 10 parts fiscales"),
  revenuNet: z
    .number({ error: "Le revenu doit être un nombre" })
    .min(1, "Le revenu doit être supérieur à 0"),
  revenusFonciers: z
    .number({ error: "Les revenus fonciers doivent être un nombre" })
    .min(0, "Les revenus fonciers doivent être positifs")
    .optional()
    .or(z.literal(0)),
})

type ProfilFormData = z.infer<typeof profilFormSchema>

// ============================================================================
// Component Props
// ============================================================================

interface ProfilFormProps {
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calcule le nombre de parts fiscales suggéré selon la situation.
 */
function getSuggestedParts(situation: WizardStep1["situation"]): number {
  switch (situation) {
    case "celibataire":
      return 1
    case "marie":
    case "pacse":
      return 2
    default:
      return 1
  }
}

/**
 * Formate un nombre avec des séparateurs de milliers.
 * Ex: 50000 → "50 000"
 */
function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return ""
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(num)
}


// ============================================================================
// Component
// ============================================================================

export function ProfilForm({ className }: ProfilFormProps) {
  const { state, updateStep1 } = useSimulation()

  const form = useForm<ProfilFormData>({
    resolver: zodResolver(profilFormSchema),
    mode: "onBlur",
    defaultValues: {
      situation: state.step1.situation ?? "celibataire",
      parts: state.step1.parts ?? 1,
      revenuNet: state.step1.revenuNet ?? 0,
      revenusFonciers: state.step1.revenusFonciers ?? 0,
    },
  })

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  // Watch pour détecter les changements et auto-update des parts
  const situation = watch("situation")
  const parts = watch("parts")
  const revenuNet = watch("revenuNet")
  const revenusFonciers = watch("revenusFonciers")

  // Auto-update des parts fiscales selon la situation
  useEffect(() => {
    if (situation) {
      const suggested = getSuggestedParts(situation)
      setValue("parts", suggested, { shouldValidate: true })
    }
  }, [situation, setValue])

  // Sync avec le context global à chaque changement validé
  useEffect(() => {
    const subscription = form.watch((values) => {
      const isValid = form.formState.isValid

      if (isValid && values.situation && values.parts && values.revenuNet) {
        updateStep1({
          situation: values.situation as WizardStep1["situation"],
          parts: values.parts,
          revenuNet: values.revenuNet,
          ...(values.revenusFonciers !== undefined && { revenusFonciers: values.revenusFonciers }),
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [form, updateStep1])

  return (
    <form className={cn("space-y-6", className)}>
      {/* Situation familiale */}
      <div className="space-y-2">
        <Label htmlFor="situation" className="text-muted-foreground">
          Situation familiale
        </Label>
        <Select
          value={situation}
          onValueChange={(value) =>
            setValue("situation", value as WizardStep1["situation"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            id="situation"
            aria-describedby={errors.situation ? "situation-error" : undefined}
            aria-invalid={!!errors.situation}
            className={cn(
              "bg-background border-border",
              errors.situation && "border-destructive ring-2 ring-destructive/20"
            )}
          >
            <SelectValue placeholder="Sélectionnez votre situation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="celibataire">Célibataire</SelectItem>
            <SelectItem value="marie">Marié(e)</SelectItem>
            <SelectItem value="pacse">Pacsé(e)</SelectItem>
          </SelectContent>
        </Select>
        {errors.situation && (
          <p id="situation-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <Info className="size-4" aria-hidden="true" />
            {errors.situation.message}
          </p>
        )}
      </div>

      {/* Parts fiscales */}
      <div className="space-y-2">
        <Label htmlFor="parts" className="text-muted-foreground flex items-center gap-2">
          Nombre de parts fiscales
          <span
            className="text-xs text-muted-foreground/70 flex items-center gap-1"
            title="Le nombre de parts est calculé automatiquement selon votre situation familiale"
          >
            <Info className="size-3" />
            Auto-calculé
          </span>
        </Label>
        <Input
          id="parts"
          type="number"
          min={1}
          max={10}
          step={0.5}
          {...register("parts", { valueAsNumber: true })}
          aria-describedby={errors.parts ? "parts-error" : "parts-hint"}
          aria-invalid={!!errors.parts}
          className={cn(
            "bg-background border-border",
            "focus-visible:ring-2 focus-visible:ring-amber-500/50",
            errors.parts && "border-destructive ring-2 ring-destructive/20"
          )}
          placeholder="Ex: 2"
        />
        {errors.parts && (
          <p id="parts-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <Info className="size-4" aria-hidden="true" />
            {errors.parts.message}
          </p>
        )}
        <p id="parts-hint" className="text-xs text-muted-foreground/70">
          1 part pour célibataire, 2 parts pour couple, + 0.5 par enfant
        </p>
      </div>

      {/* Revenu net imposable */}
      <div className="space-y-2">
        <Label htmlFor="revenuNet" className="text-muted-foreground flex items-center gap-2">
          Revenu net imposable annuel (€)
          <span
            className="text-xs text-muted-foreground/70 flex items-center gap-1"
            title="Montant indiqué sur votre avis d'imposition (ligne 'Revenu imposable')"
          >
            <Info className="size-3" />
            Voir avis d'imposition
          </span>
        </Label>
        <Input
          id="revenuNet"
          type="number"
          min={0}
          step={1000}
          {...register("revenuNet", { valueAsNumber: true })}
          aria-describedby={errors.revenuNet ? "revenuNet-error" : undefined}
          aria-invalid={!!errors.revenuNet}
          className={cn(
            "bg-background border-border",
            "focus-visible:ring-2 focus-visible:ring-amber-500/50",
            errors.revenuNet && "border-destructive ring-2 ring-destructive/20"
          )}
          placeholder="Ex: 50 000"
        />
        {errors.revenuNet && (
          <p id="revenuNet-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <Info className="size-4" aria-hidden="true" />
            {errors.revenuNet.message}
          </p>
        )}
        {revenuNet > 0 && (
          <p className="text-xs text-muted-foreground/70">
            Montant saisi : {formatNumber(revenuNet)} €
          </p>
        )}
      </div>

      {/* Revenus fonciers existants (optionnel) */}
      <div className="space-y-2">
        <Label htmlFor="revenusFonciers" className="text-muted-foreground flex items-center gap-2">
          Revenus fonciers existants (€)
          <span className="text-xs text-muted-foreground/70">(optionnel)</span>
        </Label>
        <Input
          id="revenusFonciers"
          type="number"
          min={0}
          step={1000}
          {...register("revenusFonciers", { valueAsNumber: true })}
          aria-describedby={errors.revenusFonciers ? "revenusFonciers-error" : "revenusFonciers-hint"}
          aria-invalid={!!errors.revenusFonciers}
          className={cn(
            "bg-background border-border",
            "focus-visible:ring-2 focus-visible:ring-amber-500/50",
            errors.revenusFonciers && "border-destructive ring-2 ring-destructive/20"
          )}
          placeholder="Ex: 10 000"
        />
        {errors.revenusFonciers && (
          <p id="revenusFonciers-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <Info className="size-4" aria-hidden="true" />
            {errors.revenusFonciers.message}
          </p>
        )}
        {revenusFonciers !== undefined && revenusFonciers > 0 && (
          <p className="text-xs text-muted-foreground/70">
            Montant saisi : {formatNumber(revenusFonciers)} €
          </p>
        )}
        <p id="revenusFonciers-hint" className="text-xs text-muted-foreground/70">
          Si vous percevez déjà des loyers d'autres biens
        </p>
      </div>

      {/* Info bulle récapitulatif */}
      {situation && parts && revenuNet > 0 && (
        <div className="p-4 rounded-md bg-amber-500/10 border border-amber-500/20 text-sm">
          <p className="font-medium text-foreground mb-1">Récapitulatif</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              Situation : <span className="text-foreground font-medium">{situation}</span>
            </li>
            <li>
              Parts fiscales : <span className="text-foreground font-medium">{parts}</span>
            </li>
            <li>
              Revenu net : <span className="text-foreground font-medium">{formatNumber(revenuNet)} €</span>
            </li>
            {revenusFonciers !== undefined && revenusFonciers > 0 && (
              <li>
                Revenus fonciers :{" "}
                <span className="text-foreground font-medium">{formatNumber(revenusFonciers)} €</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </form>
  )
}
