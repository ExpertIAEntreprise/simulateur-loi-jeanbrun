/**
 * Types pour le régime LMNP (Louage Meublé Non Professionnel)
 *
 * Gère les calculs LMNP en régime réel et micro-BIC.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Type de location LMNP
 */
export type TypeLocationLMNP =
  | "longue_duree"
  | "tourisme_classe"
  | "tourisme_non_classe"
  | "chambres_hotes";

/**
 * Entrée pour le calcul LMNP
 */
export interface LMNPInput {
  /** Recettes annuelles en euros */
  recettesAnnuelles: number;
  /** Charges annuelles en euros */
  chargesAnnuelles: number;
  /** Prix d'acquisition en euros */
  prixAcquisition: number;
  /** Frais de notaire en euros */
  fraisNotaire?: number;
  /** Montant mobilier en euros */
  montantMobilier?: number;
  /** Type de location */
  typeLocation: TypeLocationLMNP;
}

/**
 * Résultat du calcul LMNP
 */
export interface LMNPResult {
  /** Régime appliqué */
  regime: "micro" | "reel";
  /** Recettes */
  recettes: number;
  /** Bénéfice imposable */
  beneficeImposable: number;
  /** Déficit reportable (si applicable) */
  deficitReportable?: number;
  /** Amortissement annuel (régime réel) */
  amortissementAnnuel?: number;
  /** Détail des amortissements par composant */
  detailAmortissements?: Record<string, { valeur: number; amortissement: number }>;
}

/**
 * Comparatif Jeanbrun vs LMNP
 */
export interface ComparatifJeanbrunLMNP {
  /** Résultat Jeanbrun */
  jeanbrun: {
    economieAnnuelle: number;
    economie9ans: number;
  };
  /** Résultat LMNP réel */
  lmnpReel: {
    economieAnnuelle: number;
    economie9ans: number;
  };
  /** Différence (positif = Jeanbrun meilleur) */
  difference: number;
  /** Recommandation */
  recommandation: "jeanbrun" | "lmnp" | "equivalent";
  /** Justification */
  justification: string;
}
