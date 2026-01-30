/**
 * Point d'entrée pour tous les types du module de calculs
 *
 * Re-exporte les types depuis les sous-modules thématiques
 * pour une importation centralisée et cohérente.
 *
 * @example
 * ```typescript
 * import type {
 *   JeanbrunNeufInput,
 *   JeanbrunNeufResult,
 *   SimulationCalculInput,
 *   SimulationCalculResult
 * } from "./types"
 * ```
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

// ============================================
// TYPES COMMUNS
// ============================================

export type { ZoneFiscale, RegimeFiscal, SituationFamiliale } from "./common";
export { REGIME_FISCAL_LABELS } from "./common";

// ============================================
// TYPES IR (Impôt sur le Revenu)
// ============================================

export type { IRInput, IRResult, TrancheIR } from "./ir";

// ============================================
// TYPES TMI (Tranche Marginale d'Imposition)
// ============================================

export type { TMIInput, TMIResult, EconomieImpot } from "./tmi";

// ============================================
// TYPES JEANBRUN
// ============================================

export type {
  NiveauLoyerJeanbrun,
  TypeBien,
  JeanbrunNeufInput,
  JeanbrunNeufResult,
  JeanbrunAncienInput,
  JeanbrunAncienResult,
  JeanbrunAncienEligible,
  JeanbrunAncienIneligible,
  NiveauJeanbrun,
  LigneAmortissementJeanbrun,
  EligibiliteTravauxResult,
} from "./jeanbrun";

export {
  NIVEAU_LOYER_JEANBRUN_LABELS,
  TYPE_BIEN_LABELS,
  isJeanbrunEligible,
} from "./jeanbrun";

// ============================================
// TYPES CRÉDIT IMMOBILIER
// ============================================

export type {
  CreditInput,
  LigneAmortissement,
  CreditResult,
  CapaciteEmpruntResult,
  TauxEndettementResult,
} from "./credit";

// ============================================
// TYPES PLUS-VALUE
// ============================================

export type { PlusValueInput, PlusValueResult } from "./plus-value";

// ============================================
// TYPES LMNP
// ============================================

export type {
  TypeLocationLMNP,
  LMNPInput,
  LMNPResult,
  ComparatifJeanbrunLMNP,
} from "./lmnp";

// ============================================
// TYPES DÉFICIT FONCIER
// ============================================

export type {
  DeficitFoncierInput,
  DeficitFoncierResult,
  LigneReportDeficit,
} from "./deficit-foncier";

// ============================================
// TYPES RENDEMENTS
// ============================================

export type { RendementsInput, RendementsResult } from "./rendements";

// ============================================
// TYPES SIMULATION
// ============================================

export type {
  SimulationCalculInput,
  ProjectionAnnuelle,
  SimulationCalculResult,
} from "./simulation";
