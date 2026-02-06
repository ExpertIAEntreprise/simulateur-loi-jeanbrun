/**
 * Types pour les rendements immobiliers
 *
 * Gère les calculs de rendement brut, net et net-net.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Entrée pour le calcul des rendements
 */
export interface RendementsInput {
  /** Loyer annuel en euros */
  loyerAnnuel: number;
  /** Prix d'acquisition en euros */
  prixAcquisition: number;
  /** Charges annuelles en euros */
  chargesAnnuelles?: number;
  /** Frais d'acquisition (notaire, etc.) */
  fraisAcquisition?: number;
  /** Impôts annuels en euros */
  impotsAnnuels?: number;
  /** Prélèvements sociaux en euros */
  prelevementsSociaux?: number;
}

/**
 * Résultat du calcul des rendements
 */
export interface RendementsResult {
  /** Rendement brut (%) */
  rendementBrut: number;
  /** Rendement net de charges (%) */
  rendementNet: number;
  /** Rendement net-net après fiscalité (%) */
  rendementNetNet: number;
}
