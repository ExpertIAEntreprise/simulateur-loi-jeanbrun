/**
 * Types pour le crédit immobilier
 *
 * Gère les calculs de crédit, d'amortissement et d'endettement.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Entrée pour le calcul de crédit immobilier
 */
export interface CreditInput {
  /** Capital emprunté en euros */
  capitalEmprunte: number;
  /** Taux annuel (décimal, ex: 0.035 pour 3.5%) */
  tauxAnnuel: number;
  /** Durée en mois */
  dureeMois: number;
  /** Taux d'assurance annuel optionnel */
  tauxAssurance?: number;
}

/**
 * Ligne du tableau d'amortissement crédit
 */
export interface LigneAmortissement {
  /** Numéro du mois */
  mois: number;
  /** Mensualité totale */
  mensualite: number;
  /** Part capital */
  capital: number;
  /** Part intérêts */
  interets: number;
  /** Capital restant dû */
  capitalRestant: number;
  /** Assurance mensuelle */
  assurance?: number;
}

/**
 * Résultat du calcul de crédit
 */
export interface CreditResult {
  /** Mensualité hors assurance */
  mensualiteHorsAssurance: number;
  /** Mensualité avec assurance */
  mensualiteAvecAssurance: number;
  /** Coût total du crédit */
  coutTotal: number;
  /** Total des intérêts */
  totalInterets: number;
  /** Total assurance */
  totalAssurance?: number;
  /** TAEG estimé */
  taegEstime?: number;
  /** Tableau d'amortissement */
  tableau: LigneAmortissement[];
}

/**
 * Résultat du calcul de capacité d'emprunt
 */
export interface CapaciteEmpruntResult {
  /** Mensualité maximale */
  mensualiteMax: number;
  /** Capacité d'emprunt */
  capaciteEmprunt: number;
  /** Message si problème */
  message?: string;
}

/**
 * Résultat du calcul de taux d'endettement
 */
export interface TauxEndettementResult {
  /** Revenus mensuels */
  revenus: number;
  /** Charges après nouvelle mensualité */
  chargesApres: number;
  /** Taux d'endettement (décimal) */
  tauxEndettement: number;
  /** Reste à vivre */
  resteAVivre: number;
  /** Indique si acceptable (< 35%) */
  acceptable: boolean;
  /** Indique si recommandé (< 33%) */
  recommande: boolean;
}
