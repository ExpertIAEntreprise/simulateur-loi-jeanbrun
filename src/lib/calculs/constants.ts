/**
 * Constantes fiscales pour le moteur de calcul Loi Jeanbrun
 *
 * Sources:
 * - PLF 2026 (dispositif Jeanbrun)
 * - Barème IR 2026 (revenus 2025)
 * - Loc'Avantages (plafonds loyers indicatifs)
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

// ============================================
// BARÈME IMPÔT SUR LE REVENU 2026
// ============================================

/**
 * Tranches du barème progressif IR 2026
 * Note: Seule la 1ère tranche est revalorisée de 1% en 2026 (gel partiel)
 */
export const TRANCHES_IR_2026 = [
  { min: 0, max: 11612, taux: 0 },
  { min: 11612, max: 29315, taux: 0.11 },
  { min: 29315, max: 83823, taux: 0.3 },
  { min: 83823, max: 180294, taux: 0.41 },
  { min: 180294, max: Infinity, taux: 0.45 },
] as const;

/**
 * Plafond de l'avantage en impôt par demi-part supplémentaire
 */
export const PLAFOND_QUOTIENT_FAMILIAL = 1791;

/**
 * Plafond par quart de part
 */
export const PLAFOND_QUART_PART = 896;

/**
 * Paramètres de la décote 2026
 */
export const DECOTE_2026 = {
  celibataire: { seuil: 1964, montantBase: 889 },
  couple: { seuil: 3249, montantBase: 1470 },
} as const;

// ============================================
// DISPOSITIF JEANBRUN - NEUF
// ============================================

/**
 * Paramètres Jeanbrun pour l'immobilier NEUF
 * Base d'amortissement = 80% du prix d'acquisition
 */
export const JEANBRUN_NEUF = {
  /** Pourcentage du prix excluant le terrain */
  baseAmortissement: 0.8,
  /** Durée d'engagement obligatoire en années */
  dureeEngagement: 9,
  /** Taux et plafonds selon niveau de loyer */
  niveaux: {
    intermediaire: { taux: 0.035, plafond: 8000 },
    social: { taux: 0.045, plafond: 10000 },
    tres_social: { taux: 0.055, plafond: 12000 },
  },
} as const;

// ============================================
// DISPOSITIF JEANBRUN - ANCIEN
// ============================================

/**
 * Paramètres Jeanbrun pour l'immobilier ANCIEN
 * Condition: travaux >= 30% du prix d'achat
 * Base = 80% du prix total (achat + travaux)
 */
export const JEANBRUN_ANCIEN = {
  /** Pourcentage du prix excluant le terrain */
  baseAmortissement: 0.8,
  /** Seuil minimum de travaux (30% du prix d'achat) */
  seuilTravaux: 0.3,
  /** Durée d'engagement obligatoire en années */
  dureeEngagement: 9,
  /** Plafond unique pour l'ancien */
  plafondUnique: 10700,
  /** Taux selon niveau de loyer */
  niveaux: {
    intermediaire: { taux: 0.03, plafond: 10700 },
    social: { taux: 0.035, plafond: 10700 },
    tres_social: { taux: 0.04, plafond: 10700 },
  },
} as const;

// ============================================
// DÉFICIT FONCIER
// ============================================

/**
 * Plafonds du déficit foncier imputable sur le revenu global
 */
export const DEFICIT_FONCIER = {
  /** Plafond standard de droit commun */
  plafondStandard: 10700,
  /** Plafond bonifié pour travaux énergétiques (jusqu'au 31/12/2027) */
  plafondBonifie: 21400,
  /** Date limite d'application du plafond bonifié */
  dateLimiteBonification: new Date("2027-12-31"),
  /** Durée de report sur revenus fonciers (en années) */
  dureeReport: 10,
} as const;

// ============================================
// PLAFONDS DE LOYERS JEANBRUN
// ============================================

/**
 * Plafonds de loyer en €/m²/mois selon zone et niveau
 * Basé sur les plafonds Loc'Avantages (indicatifs, à confirmer par décret)
 */
export const PLAFONDS_LOYERS_M2 = {
  A_BIS: { intermediaire: 18.89, social: 15.11, tres_social: 12.09 },
  A: { intermediaire: 14.03, social: 11.22, tres_social: 8.98 },
  B1: { intermediaire: 11.31, social: 9.05, tres_social: 7.24 },
  B2: { intermediaire: 9.83, social: 7.86, tres_social: 6.29 },
  C: { intermediaire: 9.83, social: 7.86, tres_social: 6.29 },
} as const;

/**
 * Coefficient de surface pour pondérer les petites surfaces
 * Formule Loc'Avantages: coef = min(0.7 + 19/surface, 1.2)
 */
export const COEFFICIENT_SURFACE = {
  constante: 0.7,
  facteur: 19,
  plafond: 1.2,
} as const;

// ============================================
// PLUS-VALUE IMMOBILIÈRE
// ============================================

/**
 * Taux d'imposition sur la plus-value immobilière
 */
export const TAUX_PLUS_VALUE = {
  /** Taux IR sur plus-value */
  ir: 0.19,
  /** Taux prélèvements sociaux */
  ps: 0.172,
} as const;

/**
 * Abattement pour durée de détention - IR
 * Exonération totale après 22 ans
 */
export const ABATTEMENT_DUREE_DETENTION_IR = {
  /** Années avant tout abattement */
  seuilDebut: 6,
  /** Années pour exonération totale */
  seuilExoneration: 22,
  /** Taux par année entre 6 et 21 ans */
  tauxAnnuel: 0.06,
  /** Taux supplémentaire la 22ème année */
  tauxDerniereAnnee: 0.04,
} as const;

/**
 * Abattement pour durée de détention - Prélèvements Sociaux
 * Exonération totale après 30 ans
 */
export const ABATTEMENT_DUREE_DETENTION_PS = {
  /** Années avant tout abattement */
  seuilDebut: 6,
  /** Années pour exonération totale */
  seuilExoneration: 30,
  /** Taux par année entre 6 et 21 ans */
  tauxPhase1: 0.0165,
  /** Taux la 22ème année */
  tauxAnnee22: 0.016,
  /** Taux par année entre 23 et 30 ans */
  tauxPhase2: 0.09,
} as const;

/**
 * Seuils de surtaxe sur les plus-values élevées
 */
export const SURTAXE_PLUS_VALUE = [
  { min: 50000, max: 60000, calcul: (pv: number) => (pv - 50000) * 0.02 },
  { min: 60000, max: 100000, calcul: (pv: number) => pv * 0.02 - 200 },
  { min: 100000, max: 110000, calcul: (pv: number) => (pv - 100000) * 0.03 + 1800 },
  { min: 110000, max: 150000, calcul: (pv: number) => pv * 0.03 - 1100 },
  { min: 150000, max: 160000, calcul: (pv: number) => (pv - 150000) * 0.04 + 3400 },
  { min: 160000, max: 200000, calcul: (pv: number) => pv * 0.04 - 2800 },
  { min: 200000, max: 210000, calcul: (pv: number) => (pv - 200000) * 0.05 + 5200 },
  { min: 210000, max: 250000, calcul: (pv: number) => pv * 0.05 - 5300 },
  { min: 250000, max: 260000, calcul: (pv: number) => (pv - 250000) * 0.06 + 7200 },
  { min: 260000, max: Infinity, calcul: (pv: number) => pv * 0.06 - 8400 },
] as const;

// ============================================
// PRÉLÈVEMENTS SOCIAUX
// ============================================

/**
 * Détail des prélèvements sociaux 2026
 */
export const PRELEVEMENTS_SOCIAUX = {
  csg: 0.092,
  crds: 0.005,
  ps: 0.045,
  casa: 0.003,
  solidarite: 0.02,
  total: 0.172,
  /** Taux avec contribution forfaitaire autonomie (dividendes, intérêts) */
  totalAvecCFA: 0.186,
} as const;

// ============================================
// LMNP (Location Meublée Non Professionnelle)
// ============================================

/**
 * Régime Micro-BIC LMNP
 */
export const LMNP_MICRO_BIC = {
  longue_duree: { plafond: 77700, abattement: 0.5 },
  tourisme_classe: { plafond: 77700, abattement: 0.5 },
  tourisme_non_classe: { plafond: 15000, abattement: 0.3 },
  chambres_hotes: { plafond: 77700, abattement: 0.71 },
} as const;

/**
 * Amortissement par composants LMNP (régime réel)
 */
export const LMNP_COMPOSANTS = {
  terrain: { taux: 0, duree: null },
  gros_oeuvre: { taux: 0.025, duree: 40 },
  facade: { taux: 0.04, duree: 25 },
  equipements: { taux: 0.0667, duree: 15 },
  agencements: { taux: 0.05, duree: 20 },
  mobilier: { taux: 0.1429, duree: 7 },
  electromenager: { taux: 0.2, duree: 5 },
} as const;

/**
 * Répartition type d'un bien immobilier LMNP
 */
export const LMNP_REPARTITION_TYPE = {
  terrain: 0.15,
  gros_oeuvre: 0.5,
  facade: 0.1,
  equipements: 0.1,
  agencements: 0.1,
  mobilier: 0.05,
} as const;

// ============================================
// CRÉDIT IMMOBILIER
// ============================================

/**
 * Seuils d'endettement recommandés
 */
export const SEUILS_ENDETTEMENT = {
  /** Seuil recommandé (33%) */
  recommande: 0.33,
  /** Seuil maximum HCSF (35%) */
  maximum: 0.35,
} as const;

// ============================================
// MICRO-FONCIER
// ============================================

/**
 * Régime micro-foncier (location nue)
 */
export const MICRO_FONCIER = {
  /** Plafond de loyers bruts annuels */
  plafond: 15000,
  /** Abattement forfaitaire */
  abattement: 0.3,
} as const;

// ============================================
// PÉRIODE D'APPLICATION JEANBRUN
// ============================================

/**
 * Période d'application du dispositif Jeanbrun
 */
export const PERIODE_JEANBRUN = {
  debut: new Date("2026-01-01"),
  fin: new Date("2028-12-31"),
} as const;

// ============================================
// FRAIS D'ACQUISITION IMMOBILIÈRE
// ============================================

/**
 * Frais d'acquisition (frais de notaire)
 * Environ 8% pour l'ancien, 2-3% pour le neuf
 */
export const FRAIS_ACQUISITION = {
  /** Taux estimé pour bien ancien (~8%) */
  tauxAncien: 0.08,
  /** Taux estimé pour bien neuf (~3%) */
  tauxNeuf: 0.03,
  /** Taux par défaut utilisé dans les calculs */
  tauxDefaut: 0.08,
} as const;
