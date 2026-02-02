"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSimulation } from "@/lib/hooks/useSimulation"
import { SimulateurLayout } from "@/components/simulateur/SimulateurLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WizardStep2 } from "@/contexts/SimulationContext"
import type { ZoneFiscale } from "@/types/ville"

// Étape 2 composants
import {
  TypeBienSelector,
  TravauxValidator,
  VilleAutocomplete,
  RecapProjet,
} from "@/components/simulateur/etape-2"

// ============================================================================
// Validation Schema
// ============================================================================

const projetFormSchema = z.object({
  typeBien: z.enum(["neuf", "ancien"]),
  surface: z
    .number({ error: "La surface doit être un nombre" })
    .min(9, "Surface minimum 9 m² (loi Carrez)")
    .max(500, "Surface maximum 500 m²"),
  prixAcquisition: z
    .number({ error: "Le prix doit être un nombre" })
    .min(10000, "Prix minimum 10 000 €")
    .max(10000000, "Prix maximum 10 000 000 €"),
  montantTravaux: z
    .number({ error: "Le montant des travaux doit être un nombre" })
    .min(0, "Le montant doit être positif")
    .optional(),
  dpeActuel: z.enum(["A", "B", "C", "D", "E", "F", "G"]).optional(),
  dpeApres: z.enum(["A", "B"]).optional(),
})

type ProjetFormData = z.infer<typeof projetFormSchema>

// ============================================================================
// Component
// ============================================================================

export default function Etape2Page() {
  const router = useRouter()
  const { state, updateStep2, isStepValid } = useSimulation()

  // Redirect to step 1 if not completed
  useEffect(() => {
    if (!state.isLoading && !isStepValid(1)) {
      router.push("/simulateur/avance")
    }
  }, [state.isLoading, isStepValid, router])

  const form = useForm<ProjetFormData>({
    resolver: zodResolver(projetFormSchema),
    mode: "onBlur",
    defaultValues: {
      ...(state.step2.typeBien && { typeBien: state.step2.typeBien }),
      surface: state.step2.surface ?? 0,
      prixAcquisition: state.step2.prixAcquisition ?? 0,
      montantTravaux: state.step2.montantTravaux ?? 0,
      ...(state.step2.dpeActuel && { dpeActuel: state.step2.dpeActuel }),
      ...(state.step2.dpeApres && { dpeApres: state.step2.dpeApres }),
    },
  })

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  // Watch values
  const typeBien = watch("typeBien")
  const surface = watch("surface")
  const prixAcquisition = watch("prixAcquisition")
  const montantTravaux = watch("montantTravaux")
  const dpeActuel = watch("dpeActuel")
  const dpeApres = watch("dpeApres")

  // Sync with context
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.typeBien && values.surface && values.prixAcquisition) {
        const update: Partial<WizardStep2> = {
          typeBien: values.typeBien as WizardStep2["typeBien"],
          surface: values.surface,
          prixAcquisition: values.prixAcquisition,
        }
        if (values.montantTravaux !== undefined) {
          update.montantTravaux = values.montantTravaux
        }
        if (values.dpeActuel) {
          update.dpeActuel = values.dpeActuel as "A" | "B" | "C" | "D" | "E" | "F" | "G"
        }
        if (values.dpeApres) {
          update.dpeApres = values.dpeApres as "A" | "B"
        }
        updateStep2(update)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, updateStep2])

  const handleBack = () => {
    router.push("/simulateur/avance")
  }

  const handleNext = () => {
    router.push("/simulateur/avance/etape-3")
  }

  const handleTypeBienChange = (value: "neuf" | "ancien") => {
    setValue("typeBien", value, { shouldValidate: true })
    // Reset travaux fields if switching to neuf
    if (value === "neuf") {
      setValue("montantTravaux", 0)
      setValue("dpeActuel", undefined)
      setValue("dpeApres", undefined)
    }
  }

  const handleVilleChange = (ville: { id: string; nom: string; zoneFiscale: ZoneFiscale }) => {
    updateStep2({
      villeId: ville.id,
      villeNom: ville.nom,
      zoneFiscale: ville.zoneFiscale,
    })
  }

  // Loading state
  if (state.isLoading) {
    return (
      <SimulateurLayout
        currentStep={2}
        onNext={() => {}}
        canGoNext={false}
        canGoBack={true}
        onBack={() => {}}
      >
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </SimulateurLayout>
    )
  }

  const isAncien = typeBien === "ancien"
  const showTravauxSection = isAncien

  return (
    <SimulateurLayout
      currentStep={2}
      onBack={handleBack}
      onNext={handleNext}
      canGoBack={true}
      canGoNext={isStepValid(2)}
      isLastStep={false}
    >
      <Card className="border-dashed border-accent/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Votre projet immobilier
          </CardTitle>
          <CardDescription className="text-base">
            Décrivez le bien que vous souhaitez acquérir : type, localisation, surface et budget.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Type de bien */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">Type de bien</Label>
            <TypeBienSelector
              value={typeBien}
              onChange={handleTypeBienChange}
            />
          </div>

          {/* Localisation */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">Ville du projet</Label>
            <VilleAutocomplete
              value={
                state.step2.villeId && state.step2.villeNom && state.step2.zoneFiscale
                  ? {
                      id: state.step2.villeId,
                      nom: state.step2.villeNom,
                      zoneFiscale: state.step2.zoneFiscale,
                    }
                  : undefined
              }
              onChange={handleVilleChange}
            />
          </div>

          {/* Surface et Prix */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Surface */}
            <div className="space-y-2">
              <Label htmlFor="surface" className="text-muted-foreground">
                Surface (m²)
              </Label>
              <Input
                id="surface"
                type="number"
                min={9}
                max={500}
                step={1}
                {...register("surface", { valueAsNumber: true })}
                className={cn(
                  "bg-background border-border",
                  "focus-visible:ring-2 focus-visible:ring-amber-500/50",
                  errors.surface && "border-destructive ring-2 ring-destructive/20"
                )}
                placeholder="Ex: 45"
              />
              {errors.surface && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Info className="size-4" />
                  {errors.surface.message}
                </p>
              )}
            </div>

            {/* Prix acquisition */}
            <div className="space-y-2">
              <Label htmlFor="prixAcquisition" className="text-muted-foreground">
                Prix d&apos;acquisition (€)
              </Label>
              <Input
                id="prixAcquisition"
                type="number"
                min={10000}
                step={1000}
                {...register("prixAcquisition", { valueAsNumber: true })}
                className={cn(
                  "bg-background border-border",
                  "focus-visible:ring-2 focus-visible:ring-amber-500/50",
                  errors.prixAcquisition && "border-destructive ring-2 ring-destructive/20"
                )}
                placeholder="Ex: 250 000"
              />
              {errors.prixAcquisition && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Info className="size-4" />
                  {errors.prixAcquisition.message}
                </p>
              )}
            </div>
          </div>

          {/* Section Travaux (ancien uniquement) */}
          {showTravauxSection && (
            <div className="space-y-6 p-4 rounded-lg border border-dashed border-accent/30 bg-accent/5">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-accent" />
                Travaux de rénovation
              </h3>

              {/* Montant travaux */}
              <div className="space-y-2">
                <Label htmlFor="montantTravaux" className="text-muted-foreground">
                  Montant des travaux (€)
                </Label>
                <Input
                  id="montantTravaux"
                  type="number"
                  min={0}
                  step={1000}
                  {...register("montantTravaux", { valueAsNumber: true })}
                  className={cn(
                    "bg-background border-border",
                    "focus-visible:ring-2 focus-visible:ring-amber-500/50",
                    errors.montantTravaux && "border-destructive ring-2 ring-destructive/20"
                  )}
                  placeholder="Ex: 80 000"
                />
                {errors.montantTravaux && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Info className="size-4" />
                    {errors.montantTravaux.message}
                  </p>
                )}
              </div>

              {/* Validation travaux */}
              {prixAcquisition > 0 && (
                <TravauxValidator
                  montantTravaux={montantTravaux ?? 0}
                  prixAcquisition={prixAcquisition}
                />
              )}

              {/* DPE */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* DPE actuel */}
                <div className="space-y-2">
                  <Label htmlFor="dpeActuel" className="text-muted-foreground">
                    DPE actuel
                  </Label>
                  <Select
                    value={dpeActuel ?? ""}
                    onValueChange={(value) =>
                      setValue("dpeActuel", value as WizardStep2["dpeActuel"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      id="dpeActuel"
                      className={cn(
                        "bg-background border-border",
                        errors.dpeActuel && "border-destructive ring-2 ring-destructive/20"
                      )}
                    >
                      <SelectValue placeholder="Classe énergétique actuelle" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D", "E", "F", "G"].map((dpe) => (
                        <SelectItem key={dpe} value={dpe}>
                          Classe {dpe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* DPE après travaux */}
                <div className="space-y-2">
                  <Label htmlFor="dpeApres" className="text-muted-foreground">
                    DPE après travaux
                  </Label>
                  <Select
                    value={dpeApres ?? ""}
                    onValueChange={(value) =>
                      setValue("dpeApres", value as WizardStep2["dpeApres"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      id="dpeApres"
                      className={cn(
                        "bg-background border-border",
                        errors.dpeApres && "border-destructive ring-2 ring-destructive/20"
                      )}
                    >
                      <SelectValue placeholder="Classe cible (A ou B)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Classe A</SelectItem>
                      <SelectItem value="B">Classe B</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    La loi Jeanbrun exige un DPE A ou B après travaux
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Récapitulatif projet */}
          {typeBien && prixAcquisition > 0 && surface > 0 && (
            <RecapProjet
              typeBien={typeBien}
              prixAcquisition={prixAcquisition}
              surface={surface}
              {...(isAncien && montantTravaux !== undefined && { montantTravaux })}
              {...(state.step2.zoneFiscale && { zoneFiscale: state.step2.zoneFiscale })}
            />
          )}
        </CardContent>
      </Card>
    </SimulateurLayout>
  )
}
