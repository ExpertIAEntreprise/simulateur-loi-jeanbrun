"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSimulation } from "@/lib/hooks/useSimulation"
import { SimulateurLayout } from "@/components/simulateur/SimulateurLayout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { WizardStep4 } from "@/contexts/SimulationContext"

// Composants etape 4
import {
  NiveauLoyerCards,
  ChargesForm,
  PerteGainVisualisation,
} from "@/components/simulateur/etape-4"

// ============================================================================
// Constants
// ============================================================================

// Plafonds de loyer par zone (EUR/m2) - Loi Jeanbrun
const PLAFONDS_LOYER: Record<string, Record<string, number>> = {
  intermediaire: {
    A_BIS: 18.89,
    A: 14.03,
    B1: 11.31,
    B2: 9.83,
    C: 8.6,
  },
  social: {
    A_BIS: 14.22,
    A: 10.55,
    B1: 8.51,
    B2: 7.4,
    C: 6.47,
  },
  tres_social: {
    A_BIS: 11.07,
    A: 8.22,
    B1: 6.63,
    B2: 5.76,
    C: 5.04,
  },
}

// Estimation loyer marche par zone (EUR/m2) - approximatif
const LOYER_MARCHE_PAR_ZONE: Record<string, number> = {
  A_BIS: 28,
  A: 20,
  B1: 14,
  B2: 11,
  C: 9,
}

// Taux d'amortissement Jeanbrun par niveau
const TAUX_AMORTISSEMENT: Record<string, number> = {
  intermediaire: 0.04, // 4% du prix/an
  social: 0.05, // 5% du prix/an
  tres_social: 0.06, // 6% du prix/an
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calcule le coefficient de surface.
 * Formule: min(1.2, 0.7 + 19/surface)
 */
function calculerCoefficientSurface(surface: number): number {
  if (surface <= 0) return 1.2
  return Math.min(1.2, 0.7 + 19 / surface)
}

/**
 * Calcule le loyer maximum mensuel selon Jeanbrun.
 */
function calculerLoyerMax(
  niveauLoyer: string,
  zoneFiscale: string,
  surface: number
): number {
  const plafonds = PLAFONDS_LOYER[niveauLoyer]
  if (!plafonds) return 0

  const plafondM2 = plafonds[zoneFiscale] ?? plafonds.B1 ?? 10
  const coef = calculerCoefficientSurface(surface)

  return Math.round(plafondM2 * surface * coef)
}

/**
 * Calcule le loyer de marche estime.
 */
function calculerLoyerMarche(zoneFiscale: string, surface: number): number {
  const loyerM2 = LOYER_MARCHE_PAR_ZONE[zoneFiscale] ?? 12
  return Math.round(loyerM2 * surface)
}

/**
 * Calcule l'economie d'impot annuelle grace a Jeanbrun.
 * Formule: prix * taux_amortissement * TMI
 */
function calculerEconomieImpot(
  prixTotal: number,
  niveauLoyer: string,
  tmi: number
): number {
  const tauxAmort = TAUX_AMORTISSEMENT[niveauLoyer] ?? 0.04
  return Math.round(prixTotal * tauxAmort * (tmi / 100))
}

// ============================================================================
// Component
// ============================================================================

export default function Etape4Page() {
  const router = useRouter()
  const { state, updateStep4, isStepValid } = useSimulation()

  // Redirect vers etape 3 si non completee
  useEffect(() => {
    if (!state.isLoading && !isStepValid(3)) {
      router.push("/simulateur/avance/etape-3")
    }
  }, [state.isLoading, isStepValid, router])

  // Calculs derives
  const calculations = useMemo(() => {
    const zoneFiscale = state.step2.zoneFiscale ?? "B1"
    const surface = state.step2.surface ?? 50
    const prixAcquisition = state.step2.prixAcquisition ?? 0
    const montantTravaux = state.step2.montantTravaux ?? 0
    const prixTotal = prixAcquisition + montantTravaux

    const niveauLoyer = state.step4.niveauLoyer ?? "intermediaire"
    const tmi = state.tmiCalcule ?? 30

    const loyerPlafonne = calculerLoyerMax(niveauLoyer, zoneFiscale, surface)
    const loyerMarche = calculerLoyerMarche(zoneFiscale, surface)
    const economieImpot = calculerEconomieImpot(prixTotal, niveauLoyer, tmi)

    return {
      zoneFiscale,
      surface,
      prixTotal,
      niveauLoyer,
      tmi,
      loyerPlafonne,
      loyerMarche,
      economieImpot,
    }
  }, [state.step2, state.step4, state.tmiCalcule])

  // Handlers
  const handleBack = () => {
    router.push("/simulateur/avance/etape-3")
  }

  const handleNext = () => {
    router.push("/simulateur/avance/etape-5")
  }

  const handleNiveauLoyerChange = (value: WizardStep4["niveauLoyer"]) => {
    // Recalculer le loyer mensuel automatiquement
    const loyerMensuel = calculerLoyerMax(
      value,
      calculations.zoneFiscale,
      calculations.surface
    )
    updateStep4({ niveauLoyer: value, loyerMensuel })
  }

  const handleChargesChange = (value: number) => {
    updateStep4({ chargesAnnuelles: value })
  }

  const handleTaxeFonciereChange = (value: number) => {
    updateStep4({ taxeFonciere: value })
  }

  const handleVacanceChange = (value: number) => {
    updateStep4({ vacance: value })
  }

  // Loading state
  if (state.isLoading) {
    return (
      <SimulateurLayout
        currentStep={4}
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
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </SimulateurLayout>
    )
  }

  return (
    <SimulateurLayout
      currentStep={4}
      onBack={handleBack}
      onNext={handleNext}
      canGoBack={true}
      canGoNext={isStepValid(4)}
      isLastStep={false}
    >
      <Card className="border-dashed border-accent/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Strategie locative
          </CardTitle>
          <CardDescription className="text-base">
            Choisissez votre niveau de loyer et estimez vos charges pour
            visualiser l&apos;impact fiscal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Selection niveau de loyer */}
          <NiveauLoyerCards
            value={state.step4.niveauLoyer ?? "intermediaire"}
            onChange={handleNiveauLoyerChange}
            zoneFiscale={calculations.zoneFiscale}
            surface={calculations.surface}
          />

          {/* Formulaire charges */}
          <ChargesForm
            chargesAnnuelles={state.step4.chargesAnnuelles ?? 1800}
            taxeFonciere={state.step4.taxeFonciere ?? 1200}
            vacance={state.step4.vacance ?? 3}
            onChargesChange={handleChargesChange}
            onTaxeFonciereChange={handleTaxeFonciereChange}
            onVacanceChange={handleVacanceChange}
          />

          {/* Visualisation perte/gain */}
          {state.step4.niveauLoyer && (
            <PerteGainVisualisation
              loyerPlafonne={calculations.loyerPlafonne}
              loyerMarche={calculations.loyerMarche}
              economieImpot={calculations.economieImpot}
              tmi={calculations.tmi}
            />
          )}
        </CardContent>
      </Card>
    </SimulateurLayout>
  )
}
