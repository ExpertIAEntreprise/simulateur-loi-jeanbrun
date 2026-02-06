"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ComparatifTable,
  StructureCards,
} from "@/components/simulateur/etape-6"
import { SimulateurLayout } from "@/components/simulateur/SimulateurLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { WizardStep6 } from "@/contexts/SimulationContext"
import { useSimulation } from "@/lib/hooks/useSimulation"

// ============================================================================
// Component
// ============================================================================

export default function Etape6Page() {
  const router = useRouter()
  const { state, updateStep6, isStepValid } = useSimulation()

  // Redirect vers etape 5 si non completee
  useEffect(() => {
    if (!state.isLoading && !isStepValid(5)) {
      router.push("/simulateur/avance/etape-5")
    }
  }, [state.isLoading, isStepValid, router])

  // Handlers
  const handleBack = () => {
    router.push("/simulateur/avance/etape-5")
  }

  const handleNext = () => {
    // Rediriger vers la page de resultats (URL canonique)
    router.push("/resultats")
  }

  const handleStructureChange = (value: WizardStep6["structure"]) => {
    updateStep6({ structure: value })
  }

  // Loading state
  if (state.isLoading) {
    return (
      <SimulateurLayout
        currentStep={6}
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
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </SimulateurLayout>
    )
  }

  return (
    <SimulateurLayout
      currentStep={6}
      onBack={handleBack}
      onNext={handleNext}
      canGoBack={true}
      canGoNext={isStepValid(6)}
      isLastStep={true}
    >
      <Card className="border-dashed border-accent/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Structure juridique
          </CardTitle>
          <CardDescription className="text-base">
            Choisissez le mode de detention optimal pour votre investissement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Selection de la structure */}
          <StructureCards
            value={state.step6.structure}
            onChange={handleStructureChange}
          />

          {/* Tableau comparatif */}
          <ComparatifTable
            selectedStructure={state.step6.structure}
          />
        </CardContent>
      </Card>
    </SimulateurLayout>
  )
}
