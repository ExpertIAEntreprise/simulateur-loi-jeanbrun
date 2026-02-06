"use client"

import { useContext } from "react"
import {
  SimulationContext,
  type SimulationContextValue,
} from "@/contexts/SimulationContext"

/**
 * Hook pour accéder au contexte de simulation du wizard.
 *
 * @throws Error si utilisé en dehors de SimulationProvider
 *
 * @example
 * ```tsx
 * function StepForm() {
 *   const { state, updateStep1, nextStep, isStepValid } = useSimulation()
 *
 *   const handleSubmit = () => {
 *     if (isStepValid(1)) {
 *       nextStep()
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       ...
 *     </form>
 *   )
 * }
 * ```
 */
export function useSimulation(): SimulationContextValue {
  const context = useContext(SimulationContext)

  if (!context) {
    throw new Error(
      "useSimulation must be used within a SimulationProvider. " +
        "Wrap your component tree with <SimulationProvider>."
    )
  }

  return context
}

/**
 * Hook pour accéder uniquement à l'étape courante et la navigation.
 * Utile pour les composants de navigation.
 */
export function useSimulationNavigation() {
  const { state, goToStep, nextStep, prevStep, isStepValid } = useSimulation()

  return {
    currentStep: state.currentStep,
    isLoading: state.isLoading,
    goToStep,
    nextStep,
    prevStep,
    isCurrentStepValid: isStepValid(state.currentStep),
    canGoBack: state.currentStep > 1,
    canGoNext: isStepValid(state.currentStep),
    isLastStep: state.currentStep === 6,
  }
}
