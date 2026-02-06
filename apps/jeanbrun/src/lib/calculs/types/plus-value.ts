/**
 * Types pour le calcul de la plus-value
 *
 * Gère les calculs d'imposition sur les plus-values immobilières
 * avec abattements selon la durée de détention.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Entrée pour le calcul de la plus-value
 */
export interface PlusValueInput {
  /** Prix de vente en euros */
  prixVente: number;
  /** Prix d'achat en euros */
  prixAchat: number;
  /** Frais d'acquisition en euros */
  fraisAcquisition?: number;
  /** Montant des travaux en euros */
  travaux?: number;
  /** Frais de vente en euros */
  fraisVente?: number;
  /** Durée de détention en années */
  dureeDetention: number;
}

/**
 * Résultat du calcul de plus-value
 */
export interface PlusValueResult {
  /** Plus-value brute */
  plusValueBrute: number;
  /** Abattement IR (pourcentage) */
  abattementIR: number;
  /** Abattement PS (pourcentage) */
  abattementPS: number;
  /** Plus-value imposable IR */
  pvImposableIR: number;
  /** Plus-value imposable PS */
  pvImposablePS: number;
  /** Impôt IR */
  impotIR: number;
  /** Prélèvements sociaux */
  impotPS: number;
  /** Surtaxe si applicable */
  surtaxe: number;
  /** Impôt total */
  impotTotal: number;
  /** Taux effectif d'imposition */
  tauxEffectif: number;
  /** Indique si exonéré */
  exonere: boolean;
  /** Motif d'exonération */
  motifExoneration?: string;
}
