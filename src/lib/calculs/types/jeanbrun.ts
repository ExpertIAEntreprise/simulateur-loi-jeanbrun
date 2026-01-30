/**
 * Types pour le dispositif Jeanbrun (Loi Jeanbrun)
 *
 * Gère les types pour les biens neufs et anciens,
 * les niveaux de loyer et les amortissements.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Niveau de loyer pour le dispositif Jeanbrun
 * Détermine le taux d'amortissement applicable
 */
export type NiveauLoyerJeanbrun = "intermediaire" | "social" | "tres_social";

/**
 * Type de bien immobilier
 */
export type TypeBien = "neuf" | "ancien";

/**
 * Entrée pour le calcul Jeanbrun Neuf
 */
export interface JeanbrunNeufInput {
  /** Prix d'acquisition en euros */
  prixAcquisition: number;
  /** Niveau de loyer choisi */
  niveauLoyer: NiveauLoyerJeanbrun;
}

/**
 * Résultat du calcul Jeanbrun Neuf
 */
export interface JeanbrunNeufResult {
  /** Base d'amortissement (80% du prix) */
  baseAmortissement: number;
  /** Amortissement brut calculé */
  amortissementBrut: number;
  /** Amortissement net (après plafond) */
  amortissementNet: number;
  /** Indique si le plafond est appliqué */
  plafondApplique: boolean;
  /** Plafond applicable */
  plafond: number;
  /** Taux appliqué */
  taux: number;
}

/**
 * Entrée pour le calcul Jeanbrun Ancien
 */
export interface JeanbrunAncienInput {
  /** Prix d'achat du bien en euros */
  prixAchat: number;
  /** Montant des travaux en euros */
  montantTravaux: number;
  /** Niveau de loyer choisi */
  niveauLoyer: NiveauLoyerJeanbrun;
}

/**
 * Résultat du calcul Jeanbrun Ancien
 */
export interface JeanbrunAncienResult {
  /** Indique si le bien est éligible */
  eligible: boolean;
  /** Message si inéligible */
  message?: string;
  /** Seuil de travaux requis */
  seuilTravauxRequis?: number;
  /** Montant manquant si inéligible */
  montantManquant?: number;
  /** Prix total (achat + travaux) */
  prixTotal?: number;
  /** Base d'amortissement */
  baseAmortissement?: number;
  /** Amortissement brut */
  amortissementBrut?: number;
  /** Amortissement net */
  amortissementNet?: number;
  /** Indique si le plafond est appliqué */
  plafondApplique?: boolean;
}

/**
 * Type pour les niveaux Jeanbrun
 */
export interface NiveauJeanbrun {
  taux: number;
  plafond: number;
}

/**
 * Ligne du tableau d'amortissement Jeanbrun
 * Utilise pour les projections annuelles sur 9 ans
 */
export interface LigneAmortissementJeanbrun {
  /** Annee (1 a 9) */
  annee: number;
  /** Amortissement de l'annee en euros */
  amortissement: number;
  /** Cumul des amortissements depuis le debut */
  cumul: number;
}

/**
 * Resultat de verification d'eligibilite travaux Jeanbrun Ancien
 */
export interface EligibiliteTravauxResult {
  /** Indique si les travaux sont suffisants (>= 30%) */
  eligible: boolean;
  /** Seuil de travaux requis en euros */
  seuilRequis: number;
  /** Montant manquant si ineligible */
  montantManquant?: number;
}

/**
 * Labels français pour les niveaux de loyer Jeanbrun
 */
export const NIVEAU_LOYER_JEANBRUN_LABELS: Record<NiveauLoyerJeanbrun, string> = {
  intermediaire: "Loyer intermédiaire",
  social: "Loyer social",
  tres_social: "Loyer très social",
};

/**
 * Labels français pour les types de bien
 */
export const TYPE_BIEN_LABELS: Record<TypeBien, string> = {
  neuf: "Neuf",
  ancien: "Ancien avec travaux",
};
