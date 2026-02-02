"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  DureeSlider,
  RevalorisationInput,
  StrategieSortie,
} from "@/components/simulateur/etape-5"
import { SimulateurLayout } from "@/components/simulateur/SimulateurLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { WizardStep5 } from "@/contexts/SimulationContext"
import { useSimulation } from "@/lib/hooks/useSimulation"

// ============================================================================
// Component
// ============================================================================

export default function Etape5Page() {
  const router = useRouter()
  const { state, updateStep5, isStepValid } = useSimulation()

  // Redirect vers etape 4 si non completee
  useEffect(() => {
    if (!state.isLoading && !isStepValid(4)) {
      router.push("/simulateur/avance/etape-4")
    }
  }, [state.isLoading, isStepValid, router])

  // Calculs derives
  const calculations = useMemo(() => {
    const prixAcquisition = state.step2.prixAcquisition ?? 0
    const montantTravaux = state.step2.montantTravaux ?? 0
    const prixTotal = prixAcquisition + montantTravaux

    const dureeDetention = state.step5.dureeDetention ?? 12
    const revalorisation = state.step5.revalorisation ?? 2

    return {
      prixTotal,
      dureeDetention,
      revalorisation,
    }
  }, [state.step2, state.step5])

  // Handlers
  const handleBack = () => {
    router.push("/simulateur/avance/etape-4")
  }

  const handleNext = () => {
    router.push("/simulateur/avance/etape-6")
  }

  const handleDureeChange = (value: number) => {
    updateStep5({ dureeDetention: value })
  }

  const handleRevalorisationChange = (value: number) => {
    updateStep5({ revalorisation: value })
  }

  const handleStrategieChange = (value: WizardStep5["strategieSortie"]) => {
    updateStep5({ strategieSortie: value })
  }

  // Loading state
  if (state.isLoading) {
    return (
      <SimulateurLayout
        currentStep={5}
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
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </SimulateurLayout>
    )
  }

  return (
    <SimulateurLayout
      currentStep={5}
      onBack={handleBack}
      onNext={handleNext}
      canGoBack={true}
      canGoNext={isStepValid(5)}
      isLastStep={false}
    >
      <Card className="border-dashed border-accent/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Strategie de sortie
          </CardTitle>
          <CardDescription className="text-base">
            Definissez votre horizon d&apos;investissement et votre strategie
            de revente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Duree de detention */}
          <DureeSlider
            value={state.step5.dureeDetention ?? 12}
            onChange={handleDureeChange}
          />

          {/* Taux de revalorisation */}
          <RevalorisationInput
            value={state.step5.revalorisation ?? 2}
            onChange={handleRevalorisationChange}
            prixAcquisition={calculations.prixTotal}
            dureeDetention={calculations.dureeDetention}
          />

          {/* Strategie de sortie */}
          <StrategieSortie
            value={state.step5.strategieSortie}
            onChange={handleStrategieChange}
            dureeDetention={calculations.dureeDetention}
          />
        </CardContent>
      </Card>
    </SimulateurLayout>
  )
}
