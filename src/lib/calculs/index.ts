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

// Énumérations
export type {
  NiveauLoyerJeanbrun,
  ZoneFiscale,
  TypeBien,
  RegimeFiscal,
  TypeLocationLMNP,
  SituationFamiliale,
} from "./types";

// Types d'entrée
export type {
  IRInput,
  TMIInput,
  JeanbrunNeufInput,
  JeanbrunAncienInput,
  DeficitFoncierInput,
  CreditInput,
  PlusValueInput,
  LMNPInput,
  RendementsInput,
  SimulationCalculInput,
} from "./types";

// Types de sortie
export type {
  IRResult,
  TMIResult,
  JeanbrunNeufResult,
  JeanbrunAncienResult,
  DeficitFoncierResult,
  LigneAmortissement,
  CreditResult,
  PlusValueResult,
  LMNPResult,
  RendementsResult,
  EconomieImpot,
  CapaciteEmpruntResult,
  TauxEndettementResult,
  ProjectionAnnuelle,
  ComparatifJeanbrunLMNP,
  SimulationCalculResult,
  LigneAmortissementJeanbrun,
  EligibiliteTravauxResult,
} from "./types";

// Types utilitaires
export type { TrancheIR, NiveauJeanbrun } from "./types";

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
