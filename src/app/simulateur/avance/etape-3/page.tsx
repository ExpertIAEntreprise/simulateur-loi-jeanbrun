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

// Composants etape 3
import {
  FinancementForm,
  JaugeEndettement,
  DiffereSelector,
  AlerteEndettement,
} from "@/components/simulateur/etape-3"

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calcule la mensualite d'un credit immobilier.
 * Formule: M = K * (t/12) / (1 - (1 + t/12)^(-n*12))
 * @param capital Montant emprunte en EUR
 * @param tauxAnnuel Taux d'interet annuel en pourcentage (ex: 3.5 pour 3.5%)
 * @param dureeAnnees Duree du credit en annees
 * @returns Mensualite en EUR
 */
function calculerMensualite(
  capital: number,
  tauxAnnuel: number,
  dureeAnnees: number
): number {
  if (capital <= 0 || tauxAnnuel <= 0 || dureeAnnees <= 0) return 0

  const tauxMensuel = tauxAnnuel / 100 / 12
  const nombreMensualites = dureeAnnees * 12

  const mensualite =
    (capital * tauxMensuel) /
    (1 - Math.pow(1 + tauxMensuel, -nombreMensualites))

  return Math.round(mensualite)
}

// ============================================================================
// Component
// ============================================================================

export default function Etape3Page() {
  const router = useRouter()
  const { state, updateStep3, isStepValid } = useSimulation()

  // Redirect vers etape 2 si non completee
  useEffect(() => {
    if (!state.isLoading && !isStepValid(2)) {
      router.push("/simulateur/avance/etape-2")
    }
  }, [state.isLoading, isStepValid, router])

  // Calculs derives
  const calculations = useMemo(() => {
    const prixAcquisition = state.step2.prixAcquisition ?? 0
    const montantTravaux = state.step2.montantTravaux ?? 0
    const prixTotal = prixAcquisition + montantTravaux

    const apport = state.step3.apport ?? 0
    const montantEmprunt = Math.max(0, prixTotal - apport)

    const dureeCredit = state.step3.dureeCredit ?? 20
    const tauxCredit = state.step3.tauxCredit ?? 3.5
    const autresCredits = state.step3.autresCredits ?? 0

    const mensualite = calculerMensualite(
      montantEmprunt,
      tauxCredit,
      dureeCredit
    )

    const revenuNet = state.step1.revenuNet ?? 0
    const revenuMensuel = revenuNet / 12

    const tauxEndettement =
      revenuMensuel > 0
        ? ((mensualite + autresCredits) / revenuMensuel) * 100
        : 0

    return {
      prixTotal,
      montantEmprunt,
      mensualite,
      revenuMensuel,
      tauxEndettement,
      dureeCredit,
      tauxCredit,
      apport,
      autresCredits,
    }
  }, [state.step1, state.step2, state.step3])

  // Handlers
  const handleBack = () => {
    router.push("/simulateur/avance/etape-2")
  }

  const handleNext = () => {
    router.push("/simulateur/avance/etape-4")
  }

  const handleApportChange = (value: number) => {
    updateStep3({ apport: value })
  }

  const handleDureeCreditChange = (value: number) => {
    updateStep3({ dureeCredit: value })
  }

  const handleTauxCreditChange = (value: number) => {
    updateStep3({ tauxCredit: value })
  }

  const handleAutresCreditsChange = (value: number) => {
    updateStep3({ autresCredits: value })
  }

  const handleDiffereChange = (value: 0 | 12 | 24) => {
    updateStep3({ differe: value })
  }

  // Loading state
  if (state.isLoading) {
    return (
      <SimulateurLayout
        currentStep={3}
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
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </SimulateurLayout>
    )
  }

  const showAlerteEndettement = calculations.tauxEndettement > 35

  return (
    <SimulateurLayout
      currentStep={3}
      onBack={handleBack}
      onNext={handleNext}
      canGoBack={true}
      canGoNext={isStepValid(3)}
      isLastStep={false}
    >
      <Card className="border-dashed border-accent/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Configuration financement
          </CardTitle>
          <CardDescription className="text-base">
            Definissez votre plan de financement pour calculer votre taux
            d&apos;endettement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Formulaire financement */}
          <FinancementForm
            apport={calculations.apport}
            dureeCredit={calculations.dureeCredit}
            tauxCredit={calculations.tauxCredit}
            autresCredits={calculations.autresCredits}
            prixTotal={calculations.prixTotal}
            onApportChange={handleApportChange}
            onDureeCreditChange={handleDureeCreditChange}
            onTauxCreditChange={handleTauxCreditChange}
            onAutresCreditsChange={handleAutresCreditsChange}
          />

          {/* Differe */}
          <DiffereSelector
            value={state.step3.differe ?? 0}
            onChange={handleDiffereChange}
            typeBien={state.step2.typeBien}
          />

          {/* Recapitulatif mensualite */}
          {calculations.mensualite > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">
                  Mensualite estimee (hors assurance)
                </span>
                <span className="text-2xl font-bold text-foreground tabular-nums">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(calculations.mensualite)}
                  /mois
                </span>
              </div>
            </div>
          )}

          {/* Jauge endettement */}
          {calculations.revenuMensuel > 0 && calculations.mensualite > 0 && (
            <JaugeEndettement
              revenuMensuel={calculations.revenuMensuel}
              mensualiteCredit={calculations.mensualite}
              autresCredits={calculations.autresCredits}
            />
          )}

          {/* Alerte endettement si > 35% */}
          {showAlerteEndettement && (
            <AlerteEndettement
              tauxEndettement={calculations.tauxEndettement}
              resteAVivre={
                calculations.revenuMensuel -
                calculations.mensualite -
                calculations.autresCredits
              }
            />
          )}
        </CardContent>
      </Card>
    </SimulateurLayout>
  )
}
