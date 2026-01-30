/**
 * Types pour le déficit foncier
 *
 * Gère les calculs et report du déficit foncier sur les revenus globaux.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Entrée pour le calcul de déficit foncier
 */
export interface DeficitFoncierInput {
  /** Loyers perçus en euros */
  loyersPercus: number;
  /** Charges déductibles en euros */
  chargesDeductibles: number;
  /** Intérêts d'emprunt en euros */
  interetsEmprunt: number;
  /** Indique si travaux de rénovation énergétique */
  travauxEnergetiques?: boolean;
  /** Date d'application (pour plafond bonifié) */
  dateApplication?: Date;
}

/**
 * Résultat du calcul de déficit foncier
 */
export interface DeficitFoncierResult {
  /** Revenu foncier net (ou 0 si déficit) */
  revenuFoncierNet: number;
  /** Déficit total */
  deficitTotal: number;
  /** Déficit hors intérêts */
  deficitHorsInterets?: number;
  /** Plafond applicable */
  plafondApplicable: number;
  /** Montant imputable sur revenu global */
  imputationRevenuGlobal: number;
  /** Montant reportable sur revenus fonciers */
  reportRevenusFonciers: number;
  /** Durée de report en années */
  dureeReport: number;
}
