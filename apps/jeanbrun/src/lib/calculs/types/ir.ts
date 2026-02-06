/**
 * Types pour l'Impôt sur le Revenu (IR)
 *
 * Gère les calculs liés à l'impôt sur le revenu,
 * la tranche marginale d'imposition et les mécanismes de plafonnement.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Entrée pour le calcul de l'impôt sur le revenu
 */
export interface IRInput {
  /** Revenu net imposable en euros */
  revenuNetImposable: number;
  /** Nombre de parts fiscales */
  nombreParts: number;
}

/**
 * Résultat du calcul IR
 */
export interface IRResult {
  /** Quotient familial */
  quotientFamilial: number;
  /** Tranche marginale d'imposition (taux décimal) */
  tmi: number;
  /** Impôt par part */
  impotParPart: number;
  /** Impôt brut avant plafonnement */
  impotBrut: number;
  /** Indique si le plafonnement QF est appliqué */
  plafonnementApplique: boolean;
  /** Montant de la décote */
  decote: number;
  /** Impôt net final */
  impotNet: number;
  /** Taux moyen d'imposition */
  tauxMoyen: number;
}

/**
 * Type pour les tranches IR
 */
export interface TrancheIR {
  min: number;
  max: number;
  taux: number;
}
