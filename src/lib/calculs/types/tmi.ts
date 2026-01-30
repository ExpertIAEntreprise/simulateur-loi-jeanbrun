/**
 * Types pour la Tranche Marginale d'Imposition (TMI)
 *
 * Gère les calculs de TMI et les économies d'impôt associées.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Entrée pour le calcul de la TMI
 */
export interface TMIInput {
  /** Revenu net imposable en euros */
  revenuNetImposable: number;
  /** Nombre de parts fiscales */
  nombreParts: number;
}

/**
 * Résultat du calcul TMI
 */
export interface TMIResult {
  /** Tranche marginale d'imposition (taux décimal) */
  tmi: number;
  /** Numéro de la tranche (1 à 5) */
  numeroTranche: number;
  /** Seuil bas de la tranche */
  seuilBas: number;
  /** Seuil haut de la tranche */
  seuilHaut: number;
  /** Revenu restant avant passage à la tranche supérieure */
  marge: number;
}

/**
 * Économie d'impôt calculée
 */
export interface EconomieImpot {
  /** Économie sur l'amortissement */
  economieAmortissement: number;
  /** Économie sur le déficit foncier */
  economieDeficit: number;
  /** Économie totale annuelle */
  economieTotaleAnnuelle: number;
  /** Économie totale sur 9 ans */
  economieTotale9ans: number;
}
