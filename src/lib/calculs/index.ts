/**
 * Point d'entrée du module de calculs fiscaux
 *
 * Ce module expose toutes les fonctions et constantes nécessaires
 * pour calculer les avantages fiscaux de la Loi Jeanbrun.
 *
 * @example
 * ```typescript
 * import {
 *   TRANCHES_IR_2026,
 *   JEANBRUN_NEUF,
 *   type JeanbrunNeufInput,
 *   type JeanbrunNeufResult
 * } from "@/lib/calculs";
 * ```
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

// ============================================
// CONSTANTES FISCALES
// ============================================

export {
  // Barème IR 2026
  TRANCHES_IR_2026,
  PLAFOND_QUOTIENT_FAMILIAL,
  PLAFOND_QUART_PART,
  DECOTE_2026,
  // Jeanbrun Neuf
  JEANBRUN_NEUF,
  // Jeanbrun Ancien
  JEANBRUN_ANCIEN,
  // Déficit Foncier
  DEFICIT_FONCIER,
  // Plafonds de loyers
  PLAFONDS_LOYERS_M2,
  COEFFICIENT_SURFACE,
  // Plus-value
  TAUX_PLUS_VALUE,
  ABATTEMENT_DUREE_DETENTION_IR,
  ABATTEMENT_DUREE_DETENTION_PS,
  SURTAXE_PLUS_VALUE,
  // Prélèvements sociaux
  PRELEVEMENTS_SOCIAUX,
  // LMNP
  LMNP_MICRO_BIC,
  LMNP_COMPOSANTS,
  LMNP_REPARTITION_TYPE,
  // Crédit
  SEUILS_ENDETTEMENT,
  // Micro-foncier
  MICRO_FONCIER,
  // Période Jeanbrun
  PERIODE_JEANBRUN,
} from "./constants";

// ============================================
// TYPES
// ============================================

// Re-export all types from the types module
export type {
  // Common types
  ZoneFiscale,
  RegimeFiscal,
  SituationFamiliale,
  // IR types
  IRInput,
  IRResult,
  TrancheIR,
  // TMI types
  TMIInput,
  TMIResult,
  EconomieImpot,
  // Jeanbrun types
  NiveauLoyerJeanbrun,
  TypeBien,
  JeanbrunNeufInput,
  JeanbrunNeufResult,
  JeanbrunAncienInput,
  JeanbrunAncienResult,
  NiveauJeanbrun,
  LigneAmortissementJeanbrun,
  EligibiliteTravauxResult,
  // Credit types
  CreditInput,
  LigneAmortissement,
  CreditResult,
  CapaciteEmpruntResult,
  TauxEndettementResult,
  // Plus-value types
  PlusValueInput,
  PlusValueResult,
  // LMNP types
  TypeLocationLMNP,
  LMNPInput,
  LMNPResult,
  ComparatifJeanbrunLMNP,
  // Deficit foncier types
  DeficitFoncierInput,
  DeficitFoncierResult,
  // Rendements types
  RendementsInput,
  RendementsResult,
  // Simulation types
  SimulationCalculInput,
  ProjectionAnnuelle,
  SimulationCalculResult,
} from "./types";

// Labels
export {
  NIVEAU_LOYER_JEANBRUN_LABELS,
  TYPE_BIEN_LABELS,
  REGIME_FISCAL_LABELS,
} from "./types";

// ============================================
// FONCTIONS DE CALCUL
// ============================================

// Phase 2: IR + TMI
export { calculerIR, determinerTMI, calculerImpotSansQF } from "./ir";
export { calculerTMI, calculerEconomieImpot } from "./tmi";

// Phase 3: Jeanbrun
export { calculerJeanbrunNeuf, tableauAmortissementNeuf } from "./jeanbrun-neuf";
export {
  calculerJeanbrunAncien,
  calculerTravauxMinimum,
  verifierEligibiliteTravaux,
} from "./jeanbrun-ancien";

// Phase 4: Déficit + Crédit
export { calculerDeficitFoncier, tableauReportDeficit } from "./deficit-foncier";
export {
  calculerCredit,
  calculerCapaciteEmprunt,
  calculerTauxEndettement,
} from "./credit";

// Phase 5: Plus-Value + LMNP + Rendements
export {
  calculerPlusValue,
  calculerAbattementIR,
  calculerAbattementPS,
  calculerSurtaxe,
} from "./plus-value";
export {
  calculerLMNP,
  calculerLMNPMicroBIC,
  calculerLMNPReel,
  comparerJeanbrunLMNP,
} from "./lmnp";
export { calculerRendements } from "./rendements";

// Phase 6: Orchestrateur
export { orchestrerSimulation, calculerLoyerEstime } from "./orchestrateur";
