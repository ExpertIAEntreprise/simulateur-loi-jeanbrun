"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"
import { z } from "zod"

// ============================================================================
// Zod Schemas for localStorage validation (Security: prevent bypass of business validation)
// ============================================================================

const wizardStep1Schema = z.object({
  situation: z.enum(["celibataire", "marie", "pacse"]).optional(),
  parts: z.number().min(1).max(10).optional(),
  revenuNet: z.number().min(0).max(10_000_000).optional(),
  revenusFonciers: z.number().min(0).max(10_000_000).optional(),
  objectif: z
    .enum(["reduire_impots", "revenus", "patrimoine", "retraite"])
    .optional(),
})

const wizardStep2Schema = z.object({
  typeBien: z.enum(["neuf", "ancien"]).optional(),
  villeId: z.string().max(100).optional(),
  villeNom: z.string().max(200).optional(),
  zoneFiscale: z.enum(["A_BIS", "A", "B1", "B2", "C"]).optional(),
  surface: z.number().min(0).max(10_000).optional(),
  prixAcquisition: z.number().min(0).max(100_000_000).optional(),
  montantTravaux: z.number().min(0).max(50_000_000).optional(),
  dpeActuel: z.enum(["A", "B", "C", "D", "E", "F", "G"]).optional(),
  dpeApres: z.enum(["A", "B"]).optional(),
})

const wizardStep3Schema = z.object({
  apport: z.number().min(0).max(100_000_000).optional(),
  dureeCredit: z.number().min(1).max(30).optional(),
  tauxCredit: z.number().min(0).max(20).optional(),
  differe: z.union([z.literal(0), z.literal(12), z.literal(24)]).optional(),
  autresCredits: z.number().min(0).max(100_000_000).optional(),
})

const wizardStep4Schema = z.object({
  niveauLoyer: z
    .enum(["intermediaire", "social", "tres_social"])
    .optional(),
  loyerMensuel: z.number().min(0).max(1_000_000).optional(),
  chargesAnnuelles: z.number().min(0).max(10_000_000).optional(),
  taxeFonciere: z.number().min(0).max(1_000_000).optional(),
  vacance: z.number().min(0).max(100).optional(),
})

const wizardStep5Schema = z.object({
  dureeDetention: z.number().min(1).max(50).optional(),
  revalorisation: z.number().min(-20).max(50).optional(),
  strategieSortie: z.enum(["revente", "conservation", "donation"]).optional(),
})

const wizardStep6Schema = z.object({
  structure: z.enum(["nom_propre", "sci_ir", "sci_is"]).optional(),
})

const storedStateSchema = z.object({
  currentStep: z.number().min(1).max(6),
  step1: wizardStep1Schema,
  step2: wizardStep2Schema,
  step3: wizardStep3Schema,
  step4: wizardStep4Schema,
  step5: wizardStep5Schema,
  step6: wizardStep6Schema,
  tmiCalcule: z.number().min(0).max(100).optional(),
  isLoading: z.boolean().optional(),
  isDirty: z.boolean().optional(),
})

/**
 * Remove undefined values from an object to comply with exactOptionalPropertyTypes.
 * This ensures that optional properties are either present with a value or absent entirely.
 */
function removeUndefinedValues<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {}
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) {
      result[key] = obj[key]
    }
  }
  return result
}

// ============================================================================
// Types pour le wizard 6 étapes
// ============================================================================

export interface WizardStep1 {
  situation: "celibataire" | "marie" | "pacse"
  parts: number
  revenuNet: number
  revenusFonciers?: number
  objectif: "reduire_impots" | "revenus" | "patrimoine" | "retraite"
}

export interface WizardStep2 {
  typeBien: "neuf" | "ancien"
  villeId: string
  villeNom?: string
  zoneFiscale?: "A_BIS" | "A" | "B1" | "B2" | "C"
  surface: number
  prixAcquisition: number
  montantTravaux?: number
  dpeActuel?: "A" | "B" | "C" | "D" | "E" | "F" | "G"
  dpeApres?: "A" | "B"
}

export interface WizardStep3 {
  apport: number
  dureeCredit: number
  tauxCredit: number
  differe: 0 | 12 | 24
  autresCredits?: number
}

export interface WizardStep4 {
  niveauLoyer: "intermediaire" | "social" | "tres_social"
  loyerMensuel: number
  chargesAnnuelles: number
  taxeFonciere: number
  vacance: number
}

export interface WizardStep5 {
  dureeDetention: number
  revalorisation: number
  strategieSortie: "revente" | "conservation" | "donation"
}

export interface WizardStep6 {
  structure: "nom_propre" | "sci_ir" | "sci_is"
}

export interface SimulationWizardState {
  currentStep: number
  step1: Partial<WizardStep1>
  step2: Partial<WizardStep2>
  step3: Partial<WizardStep3>
  step4: Partial<WizardStep4>
  step5: Partial<WizardStep5>
  step6: Partial<WizardStep6>
  tmiCalcule: number | undefined
  isLoading: boolean
  isDirty: boolean
}

export interface SimulationContextValue {
  state: SimulationWizardState
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateStep1: (data: Partial<WizardStep1>) => void
  updateStep2: (data: Partial<WizardStep2>) => void
  updateStep3: (data: Partial<WizardStep3>) => void
  updateStep4: (data: Partial<WizardStep4>) => void
  updateStep5: (data: Partial<WizardStep5>) => void
  updateStep6: (data: Partial<WizardStep6>) => void
  setTMI: (tmi: number) => void
  reset: () => void
  isStepValid: (step: number) => boolean
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "simulation-wizard-state"
const TOTAL_STEPS = 6

const initialState: SimulationWizardState = {
  currentStep: 1,
  step1: {},
  step2: {},
  step3: {},
  step4: {},
  step5: {},
  step6: {},
  tmiCalcule: undefined,
  isLoading: true,
  isDirty: false,
}

// ============================================================================
// Reducer
// ============================================================================

type Action =
  | { type: "SET_STEP"; step: number }
  | { type: "UPDATE_STEP1"; data: Partial<WizardStep1> }
  | { type: "UPDATE_STEP2"; data: Partial<WizardStep2> }
  | { type: "UPDATE_STEP3"; data: Partial<WizardStep3> }
  | { type: "UPDATE_STEP4"; data: Partial<WizardStep4> }
  | { type: "UPDATE_STEP5"; data: Partial<WizardStep5> }
  | { type: "UPDATE_STEP6"; data: Partial<WizardStep6> }
  | { type: "SET_TMI"; tmi: number }
  | { type: "RESET" }
  | { type: "HYDRATE"; state: SimulationWizardState }
  | { type: "SET_LOADING"; isLoading: boolean }

function simulationReducer(
  state: SimulationWizardState,
  action: Action
): SimulationWizardState {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        currentStep: Math.max(1, Math.min(action.step, TOTAL_STEPS)),
      }

    case "UPDATE_STEP1":
      return {
        ...state,
        step1: { ...state.step1, ...action.data },
        isDirty: true,
      }

    case "UPDATE_STEP2":
      return {
        ...state,
        step2: { ...state.step2, ...action.data },
        isDirty: true,
      }

    case "UPDATE_STEP3":
      return {
        ...state,
        step3: { ...state.step3, ...action.data },
        isDirty: true,
      }

    case "UPDATE_STEP4":
      return {
        ...state,
        step4: { ...state.step4, ...action.data },
        isDirty: true,
      }

    case "UPDATE_STEP5":
      return {
        ...state,
        step5: { ...state.step5, ...action.data },
        isDirty: true,
      }

    case "UPDATE_STEP6":
      return {
        ...state,
        step6: { ...state.step6, ...action.data },
        isDirty: true,
      }

    case "SET_TMI":
      return {
        ...state,
        tmiCalcule: action.tmi,
      }

    case "RESET":
      return {
        ...initialState,
        isLoading: false,
      }

    case "HYDRATE":
      return {
        ...action.state,
        isLoading: false,
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading,
      }

    default:
      return state
  }
}

// ============================================================================
// Context
// ============================================================================

export const SimulationContext = createContext<SimulationContextValue | null>(
  null
)

// ============================================================================
// Validation helpers
// ============================================================================

function isStep1Valid(step: Partial<WizardStep1>): boolean {
  return !!(
    step.situation &&
    step.parts !== undefined &&
    step.parts >= 1 &&
    step.revenuNet !== undefined &&
    step.revenuNet > 0 &&
    step.objectif
  )
}

function isStep2Valid(step: Partial<WizardStep2>): boolean {
  const baseValid = !!(
    step.typeBien &&
    step.villeId &&
    step.surface !== undefined &&
    step.surface >= 9 &&
    step.prixAcquisition !== undefined &&
    step.prixAcquisition > 0
  )

  if (step.typeBien === "ancien") {
    return (
      baseValid &&
      step.montantTravaux !== undefined &&
      step.montantTravaux > 0 &&
      step.dpeActuel !== undefined &&
      step.dpeApres !== undefined
    )
  }

  return baseValid
}

function isStep3Valid(step: Partial<WizardStep3>): boolean {
  return !!(
    step.apport !== undefined &&
    step.dureeCredit !== undefined &&
    step.dureeCredit >= 10 &&
    step.dureeCredit <= 25 &&
    step.tauxCredit !== undefined &&
    step.tauxCredit > 0 &&
    step.differe !== undefined
  )
}

function isStep4Valid(step: Partial<WizardStep4>): boolean {
  return !!(
    step.niveauLoyer &&
    step.loyerMensuel !== undefined &&
    step.loyerMensuel > 0 &&
    step.chargesAnnuelles !== undefined &&
    step.taxeFonciere !== undefined &&
    step.vacance !== undefined
  )
}

function isStep5Valid(step: Partial<WizardStep5>): boolean {
  return !!(
    step.dureeDetention !== undefined &&
    step.dureeDetention >= 9 &&
    step.revalorisation !== undefined &&
    step.strategieSortie
  )
}

function isStep6Valid(step: Partial<WizardStep6>): boolean {
  return !!step.structure
}

// ============================================================================
// Provider
// ============================================================================

interface SimulationProviderProps {
  children: ReactNode
}

export function SimulationProvider({ children }: SimulationProviderProps) {
  const [state, dispatch] = useReducer(simulationReducer, initialState)

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      dispatch({ type: "SET_LOADING", isLoading: false })
      return
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const jsonParsed: unknown = JSON.parse(saved)

        // Use Zod safeParse to validate localStorage data (Security: prevent malicious data injection)
        const result = storedStateSchema.safeParse(jsonParsed)

        if (result.success) {
          // Remove undefined values to comply with exactOptionalPropertyTypes
          dispatch({
            type: "HYDRATE",
            state: {
              currentStep: result.data.currentStep,
              step1: removeUndefinedValues(result.data.step1) as Partial<WizardStep1>,
              step2: removeUndefinedValues(result.data.step2) as Partial<WizardStep2>,
              step3: removeUndefinedValues(result.data.step3) as Partial<WizardStep3>,
              step4: removeUndefinedValues(result.data.step4) as Partial<WizardStep4>,
              step5: removeUndefinedValues(result.data.step5) as Partial<WizardStep5>,
              step6: removeUndefinedValues(result.data.step6) as Partial<WizardStep6>,
              tmiCalcule: result.data.tmiCalcule,
              isLoading: false,
              isDirty: false,
            },
          })
          return
        } else {
          // Invalid data structure, remove corrupted localStorage entry
          localStorage.removeItem(STORAGE_KEY)
          // Log validation errors in development for debugging
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "SimulationContext: Invalid localStorage data removed",
              result.error.issues
            )
          }
        }
      }
    } catch {
      // Invalid JSON, remove corrupted entry
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // Ignore localStorage errors
      }
    }

    dispatch({ type: "SET_LOADING", isLoading: false })
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (typeof window === "undefined" || state.isLoading || !state.isDirty) {
      return
    }

    const toSave: SimulationWizardState = {
      ...state,
      isLoading: false,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [state])

  // Actions
  const goToStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", step })
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: "SET_STEP", step: state.currentStep + 1 })
  }, [state.currentStep])

  const prevStep = useCallback(() => {
    dispatch({ type: "SET_STEP", step: state.currentStep - 1 })
  }, [state.currentStep])

  const updateStep1 = useCallback((data: Partial<WizardStep1>) => {
    dispatch({ type: "UPDATE_STEP1", data })
  }, [])

  const updateStep2 = useCallback((data: Partial<WizardStep2>) => {
    dispatch({ type: "UPDATE_STEP2", data })
  }, [])

  const updateStep3 = useCallback((data: Partial<WizardStep3>) => {
    dispatch({ type: "UPDATE_STEP3", data })
  }, [])

  const updateStep4 = useCallback((data: Partial<WizardStep4>) => {
    dispatch({ type: "UPDATE_STEP4", data })
  }, [])

  const updateStep5 = useCallback((data: Partial<WizardStep5>) => {
    dispatch({ type: "UPDATE_STEP5", data })
  }, [])

  const updateStep6 = useCallback((data: Partial<WizardStep6>) => {
    dispatch({ type: "UPDATE_STEP6", data })
  }, [])

  const setTMI = useCallback((tmi: number) => {
    dispatch({ type: "SET_TMI", tmi })
  }, [])

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
    dispatch({ type: "RESET" })
  }, [])

  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return isStep1Valid(state.step1)
        case 2:
          return isStep2Valid(state.step2)
        case 3:
          return isStep3Valid(state.step3)
        case 4:
          return isStep4Valid(state.step4)
        case 5:
          return isStep5Valid(state.step5)
        case 6:
          return isStep6Valid(state.step6)
        default:
          return false
      }
    },
    [
      state.step1,
      state.step2,
      state.step3,
      state.step4,
      state.step5,
      state.step6,
    ]
  )

  const value = useMemo<SimulationContextValue>(
    () => ({
      state,
      goToStep,
      nextStep,
      prevStep,
      updateStep1,
      updateStep2,
      updateStep3,
      updateStep4,
      updateStep5,
      updateStep6,
      setTMI,
      reset,
      isStepValid,
    }),
    [
      state,
      goToStep,
      nextStep,
      prevStep,
      updateStep1,
      updateStep2,
      updateStep3,
      updateStep4,
      updateStep5,
      updateStep6,
      setTMI,
      reset,
      isStepValid,
    ]
  )

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  )
}
