"use client"

import { useRouter } from "next/navigation"
import { ObjectifSelector, type ObjectifType } from "@/components/simulateur/etape-1/ObjectifSelector"
import { ProfilForm } from "@/components/simulateur/etape-1/ProfilForm"
import { TMICalculator } from "@/components/simulateur/etape-1/TMICalculator"
import { SimulateurLayout } from "@/components/simulateur/SimulateurLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useSimulation } from "@/lib/hooks/useSimulation"

// Étape 1 composants

export default function SimulateurAvancePage() {
  const router = useRouter()
  const { state, prevStep, nextStep, isStepValid, updateStep1, setTMI } = useSimulation()

  const handleBack = () => {
    if (state.currentStep > 1) {
      prevStep()
    }
  }

  const handleNext = () => {
    if (state.currentStep === 1) {
      // Go to step 2
      router.push("/simulateur/avance/etape-2")
    } else if (state.currentStep < 6) {
      nextStep()
    } else {
      // Last step - navigate to results
      router.push("/simulateur/resultat")
    }
  }

  const handleObjectifChange = (objectif: ObjectifType) => {
    updateStep1({ objectif })
  }

  const handleTMIChange = (tmi: number) => {
    setTMI(tmi)
  }

  // Loading state
  if (state.isLoading) {
    return (
      <SimulateurLayout
        currentStep={1}
        onNext={() => {}}
        canGoNext={false}
        canGoBack={false}
      >
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </SimulateurLayout>
    )
  }

  // Step 1 content
  return (
    <SimulateurLayout
      currentStep={1}
      onBack={handleBack}
      onNext={handleNext}
      canGoBack={false}
      canGoNext={isStepValid(1)}
      isLastStep={false}
    >
      <Card className="border-dashed border-accent/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Votre profil investisseur
          </CardTitle>
          <CardDescription className="text-base">
            Commençons par votre situation fiscale pour calculer votre TMI et personnaliser la simulation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Formulaire profil */}
          <ProfilForm className="space-y-6" />

          {/* Calcul TMI */}
          {state.step1.revenuNet && state.step1.revenuNet > 0 && state.step1.parts && (
            <TMICalculator
              revenuNet={state.step1.revenuNet}
              parts={state.step1.parts}
              onTMIChange={handleTMIChange}
            />
          )}

          {/* Sélection objectif */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">
              Quel est votre objectif principal ?
            </Label>
            <ObjectifSelector
              value={state.step1.objectif}
              onChange={handleObjectifChange}
            />
          </div>
        </CardContent>
      </Card>
    </SimulateurLayout>
  )
}
