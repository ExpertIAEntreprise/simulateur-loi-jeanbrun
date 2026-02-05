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
// BAREME IMPOT SUR LE REVENU 2026
// ============================================

/**
 * Tranches du bareme progressif IR 2026
 * Note: Seule la 1ere tranche est revalorisee de 1% en 2026 (gel partiel)
 *
 * @source BOFiP IR - Bareme progressif (BOI-IR-LIQ-20-20-10)
 * @fiscalYear 2026 (revenus 2025)
 * @lastUpdated 30 janvier 2026
 */
export const TRANCHES_IR_2026 = [
  { min: 0, max: 11612, taux: 0 },
  { min: 11612, max: 29315, taux: 0.11 },
  { min: 29315, max: 83823, taux: 0.3 },
  { min: 83823, max: 180294, taux: 0.41 },
  { min: 180294, max: Infinity, taux: 0.45 },
] as const;

/**
 * Plafond de l'avantage en impot par demi-part supplementaire
 *
 * @source BOFiP IR - Quotient familial (BOI-IR-LIQ-20-20-20)
 * @fiscalYear 2026 (revenus 2025)
 * @lastUpdated 30 janvier 2026
 */
export const PLAFOND_QUOTIENT_FAMILIAL = 1791;

/**
 * Plafond par quart de part
 *
 * @source BOFiP IR - Quotient familial (BOI-IR-LIQ-20-20-20)
 * @fiscalYear 2026 (revenus 2025)
 * @lastUpdated 30 janvier 2026
 */
export const PLAFOND_QUART_PART = 896;

/**
 * Parametres de la decote 2026
 *
 * @source BOFiP IR - Decote (BOI-IR-LIQ-20-30)
 * @fiscalYear 2026 (revenus 2025)
 * @lastUpdated 30 janvier 2026
 */
export const DECOTE_2026 = {
  celibataire: { seuil: 1964, montantBase: 889 },
  couple: { seuil: 3249, montantBase: 1470 },
} as const;

// ============================================
// DISPOSITIF JEANBRUN - NEUF
// ============================================

/**
 * Parametres Jeanbrun pour l'immobilier NEUF
 * Base d'amortissement = 80% du prix d'acquisition
 *
 * @source PLF 2026 - Dispositif Jeanbrun Article 199 novovicies bis CGI
 * @fiscalYear 2026-2028 (periode d'application)
 * @lastUpdated 30 janvier 2026
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
 * Parametres Jeanbrun pour l'immobilier ANCIEN
 * Condition: travaux >= 30% du prix d'achat
 * Base = 80% du prix total (achat + travaux)
 * Plafonds identiques au neuf par niveau de loyer (Art. 31-1-j CGI)
 *
 * @source PLF 2026 - Dispositif Jeanbrun Art. 31-1-j du CGI
 * @fiscalYear 2026-2028 (periode d'application)
 * @lastUpdated 5 fevrier 2026
 */
export const JEANBRUN_ANCIEN = {
  /** Pourcentage du prix excluant le terrain */
  baseAmortissement: 0.8,
  /** Seuil minimum de travaux (30% du prix d'achat) */
  seuilTravaux: 0.3,
  /** Durée d'engagement obligatoire en années */
  dureeEngagement: 9,
  /** Taux et plafonds selon niveau de loyer (alignes sur le neuf) */
  niveaux: {
    intermediaire: { taux: 0.03, plafond: 8000 },
    social: { taux: 0.035, plafond: 10000 },
    tres_social: { taux: 0.04, plafond: 12000 },
  },
} as const;

// ============================================
// DEFICIT FONCIER
// ============================================

/**
 * Plafonds du deficit foncier imputable sur le revenu global
 *
 * IMPORTANT: Le plafond bonifie (21 400 EUR) est une disposition GENERALE
 * pour travaux de renovation energetique (passoires DPE F/G vers A-D).
 * Il n'est PAS specifique au dispositif Jeanbrun.
 * Pour Jeanbrun, le plafond de deficit foncier reste 10 700 EUR/an (Art. 31-1-i/j CGI).
 *
 * @source BOFiP RF - Deficit foncier (BOI-RFPI-BASE-30-20)
 * @source LF 2023 art. 5 pour le plafond bonifie (travaux energetiques passoires)
 * @fiscalYear 2026 (application jusqu'au 31/12/2027 pour bonifie)
 * @lastUpdated 5 fevrier 2026
 */
export const DEFICIT_FONCIER = {
  /** Plafond standard de droit commun (applicable a Jeanbrun) */
  plafondStandard: 10700,
  /**
   * Plafond bonifie pour travaux energetiques sur passoires thermiques
   * Conditions: DPE F/G avant travaux -> DPE A/B/C/D apres travaux
   * NON lie a Jeanbrun: regime general Art. 156-I-3 CGI
   */
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
 * Plafonds de loyer en EUR/m2/mois selon zone et niveau
 * Valeurs issues de l'Arrete ministeriel du 27 septembre 2024
 * (bareme Pinel 2026 / locatif conventionne)
 *
 * @source Arrete ministeriel du 27 septembre 2024
 * @source Bareme Pinel 2026 (zones A bis, A, B1, B2, C)
 * @fiscalYear 2026
 * @lastUpdated 5 fevrier 2026
 */
export const PLAFONDS_LOYERS_M2 = {
  A_BIS: { intermediaire: 19.51, social: 13.68, tres_social: 10.93 },
  A: { intermediaire: 14.49, social: 10.17, tres_social: 8.12 },
  B1: { intermediaire: 11.68, social: 8.20, tres_social: 6.55 },
  B2: { intermediaire: 10.15, social: 7.12, tres_social: 5.69 },
  C: { intermediaire: 10.15, social: 6.15, tres_social: 4.91 },
} as const;

/**
 * Coefficient de surface pour ponderer les petites surfaces
 * Formule Loc'Avantages: coef = min(0.7 + 19/surface, 1.2)
 *
 * @source Loc'Avantages - Formule coefficient surface (art. 2 terdecies D CGI Annexe III)
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
 */
export const COEFFICIENT_SURFACE = {
  constante: 0.7,
  facteur: 19,
  plafond: 1.2,
} as const;

// ============================================
// PLUS-VALUE IMMOBILIERE
// ============================================

/**
 * Taux d'imposition sur la plus-value immobiliere
 *
 * @source CGI Article 200 B (taux IR 19%)
 * @source BOFiP RFPI-PVI-20-20 (prelevements sociaux)
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
 */
export const TAUX_PLUS_VALUE = {
  /** Taux IR sur plus-value */
  ir: 0.19,
  /** Taux prélèvements sociaux */
  ps: 0.172,
} as const;

/**
 * Abattement pour duree de detention - IR
 * Exoneration totale apres 22 ans
 *
 * @source CGI Article 150 VC II (abattement duree de detention)
 * @source BOFiP RFPI-PVI-20-20-20
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
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
 * Abattement pour duree de detention - Prelevements Sociaux
 * Exoneration totale apres 30 ans
 *
 * @source CGI Article 150 VC III (abattement PS)
 * @source BOFiP RFPI-PVI-20-20-20
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
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
 * Seuils de surtaxe sur les plus-values elevees
 *
 * @source CGI Article 1609 nonies G (surtaxe PV > 50 000 EUR)
 * @source BOFiP RFPI-PVI-30
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
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
// PRELEVEMENTS SOCIAUX
// ============================================

/**
 * Detail des prelevements sociaux 2026
 *
 * @source CSS L136-7 (CSG), Ordonnance 96-50 (CRDS)
 * @source BOFiP IR-DOMIC-10-20-20-60
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
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
// LMNP (Location Meublee Non Professionnelle)
// ============================================

/**
 * Regime Micro-BIC LMNP
 *
 * @source CGI Article 50-0 (micro-BIC)
 * @source LF 2024 art. 45 (modification plafonds meuble tourisme)
 * @source BOFiP BIC-DECLA-10-10-20
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
 */
export const LMNP_MICRO_BIC = {
  longue_duree: { plafond: 77700, abattement: 0.5 },
  tourisme_classe: { plafond: 77700, abattement: 0.5 },
  tourisme_non_classe: { plafond: 15000, abattement: 0.3 },
  chambres_hotes: { plafond: 77700, abattement: 0.71 },
} as const;

/**
 * Amortissement par composants LMNP (regime reel)
 *
 * @source CGI Article 39 C (amortissement lineaire)
 * @source BOFiP BIC-AMT-10-40 (composants)
 * @source Jurisprudence CE (durees d'usage)
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
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
 * Repartition type d'un bien immobilier LMNP
 *
 * @source Pratique comptable - Repartition indicative
 * @source BOFiP BIC-AMT-10-40 (principes de decomposition)
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
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
// CREDIT IMMOBILIER
// ============================================

/**
 * Seuils d'endettement recommandes
 *
 * @source HCSF Decision D-HCSF-2021-7 du 29 septembre 2021
 * @source HCSF Decision D-HCSF-2022-1 (juridiquement contraignante)
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
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
 * Regime micro-foncier (location nue)
 *
 * @source CGI Article 32 (micro-foncier)
 * @source BOFiP RFPI-DECLA-10
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
 */
export const MICRO_FONCIER = {
  /** Plafond de loyers bruts annuels */
  plafond: 15000,
  /** Abattement forfaitaire */
  abattement: 0.3,
} as const;

// ============================================
// PERIODE D'APPLICATION JEANBRUN
// ============================================

/**
 * Periode d'application du dispositif Jeanbrun
 *
 * @source PLF 2026 - Dispositif Jeanbrun Article 199 novovicies bis CGI
 * @fiscalYear 2026-2028 (periode d'application)
 * @lastUpdated 30 janvier 2026
 */
export const PERIODE_JEANBRUN = {
  debut: new Date("2026-01-01"),
  fin: new Date("2028-12-31"),
} as const;

// ============================================
// FRAIS D'ACQUISITION IMMOBILIERE
// ============================================

/**
 * Frais d'acquisition (frais de notaire)
 * Environ 8% pour l'ancien, 2-3% pour le neuf
 *
 * @source CGI Article 683 et suivants (droits de mutation)
 * @source Tarif des notaires (arrete du 26 fevrier 2016 modifie)
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
 */
export const FRAIS_ACQUISITION = {
  /** Taux estimé pour bien ancien (~8%) */
  tauxAncien: 0.08,
  /** Taux estimé pour bien neuf (~3%) */
  tauxNeuf: 0.03,
  /** Taux par défaut utilisé dans les calculs */
  tauxDefaut: 0.08,
} as const;

// ============================================
// FORFAITS PLUS-VALUE
// ============================================

/**
 * Forfait pour frais d'acquisition si non declares (7.5% du prix d'achat)
 * Comprend: frais de notaire, droits d'enregistrement, etc.
 *
 * @source CGI Article 150 VB II 4 (forfait frais acquisition 7.5%)
 * @source BOFiP RFPI-PVI-20-10-20-20
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
 */
export const FORFAIT_FRAIS_ACQUISITION = 0.075;

/**
 * Forfait pour travaux si detention > 5 ans et travaux non declares (15% du prix d'achat)
 *
 * @source CGI Article 150 VB II 4 (forfait travaux 15%)
 * @source BOFiP RFPI-PVI-20-10-20-30
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
 */
export const FORFAIT_TRAVAUX = 0.15;

/**
 * Seuil de detention pour appliquer le forfait travaux (5 ans)
 *
 * @source CGI Article 150 VB II 4 (condition 5 ans)
 * @source BOFiP RFPI-PVI-20-10-20-30
 * @fiscalYear 2026
 * @lastUpdated 30 janvier 2026
 */
export const SEUIL_DETENTION_FORFAIT_TRAVAUX = 5;

// ============================================
// VERSIONING PAR ANNÉE FISCALE
// ============================================

/**
 * Interface pour les constantes variant selon l'année fiscale
 *
 * Permet de supporter plusieurs années fiscales (2025, 2026, 2027...)
 * pour les comparaisons et les simulations prospectives.
 */
export interface FiscalYearConstants {
  /** Année fiscale concernée */
  year: number;

  /** Barème IR progressif */
  TRANCHES_IR: readonly {
    readonly min: number;
    readonly max: number;
    readonly taux: number;
  }[];

  /** Plafond avantage quotient familial par demi-part */
  PLAFOND_QUOTIENT_FAMILIAL: number;

  /** Plafond par quart de part */
  PLAFOND_QUART_PART: number;

  /** Paramètres de la décote */
  DECOTE: {
    readonly celibataire: { readonly seuil: number; readonly montantBase: number };
    readonly couple: { readonly seuil: number; readonly montantBase: number };
  };

  /** Plafonds micro-BIC LMNP */
  LMNP_MICRO_BIC: {
    readonly longue_duree: { readonly plafond: number; readonly abattement: number };
    readonly tourisme_classe: { readonly plafond: number; readonly abattement: number };
    readonly tourisme_non_classe: { readonly plafond: number; readonly abattement: number };
    readonly chambres_hotes: { readonly plafond: number; readonly abattement: number };
  };

  /** Plafond micro-foncier */
  MICRO_FONCIER: {
    readonly plafond: number;
    readonly abattement: number;
  };
}

/**
 * Constantes fiscales 2025 (revenus 2024)
 *
 * @source BOFiP IR 2025
 */
const FISCAL_YEAR_2025: FiscalYearConstants = {
  year: 2025,
  TRANCHES_IR: [
    { min: 0, max: 11497, taux: 0 },
    { min: 11497, max: 29024, taux: 0.11 },
    { min: 29024, max: 82991, taux: 0.3 },
    { min: 82991, max: 178513, taux: 0.41 },
    { min: 178513, max: Infinity, taux: 0.45 },
  ],
  PLAFOND_QUOTIENT_FAMILIAL: 1759,
  PLAFOND_QUART_PART: 880,
  DECOTE: {
    celibataire: { seuil: 1929, montantBase: 873 },
    couple: { seuil: 3191, montantBase: 1444 },
  },
  LMNP_MICRO_BIC: {
    longue_duree: { plafond: 77700, abattement: 0.5 },
    tourisme_classe: { plafond: 77700, abattement: 0.5 },
    tourisme_non_classe: { plafond: 15000, abattement: 0.3 },
    chambres_hotes: { plafond: 77700, abattement: 0.71 },
  },
  MICRO_FONCIER: {
    plafond: 15000,
    abattement: 0.3,
  },
};

/**
 * Constantes fiscales 2026 (revenus 2025)
 *
 * @source PLF 2026, BOFiP IR 2026
 */
const FISCAL_YEAR_2026: FiscalYearConstants = {
  year: 2026,
  TRANCHES_IR: TRANCHES_IR_2026,
  PLAFOND_QUOTIENT_FAMILIAL,
  PLAFOND_QUART_PART,
  DECOTE: DECOTE_2026,
  LMNP_MICRO_BIC,
  MICRO_FONCIER,
};

/**
 * Constantes fiscales 2027 (revenus 2026) - ESTIMÉES
 *
 * Basées sur une hypothèse de revalorisation de 2% (inflation prévue)
 *
 * @source Estimation basée sur PLF 2026 + inflation prévisionnelle
 * @warning Valeurs estimées, à confirmer avec le PLF 2027
 */
const FISCAL_YEAR_2027: FiscalYearConstants = {
  year: 2027,
  TRANCHES_IR: [
    { min: 0, max: 11844, taux: 0 }, // +2%
    { min: 11844, max: 29901, taux: 0.11 }, // +2%
    { min: 29901, max: 85499, taux: 0.3 }, // +2%
    { min: 85499, max: 183900, taux: 0.41 }, // +2%
    { min: 183900, max: Infinity, taux: 0.45 },
  ],
  PLAFOND_QUOTIENT_FAMILIAL: 1827, // +2%
  PLAFOND_QUART_PART: 914, // +2%
  DECOTE: {
    celibataire: { seuil: 2003, montantBase: 907 }, // +2%
    couple: { seuil: 3314, montantBase: 1499 }, // +2%
  },
  LMNP_MICRO_BIC: {
    longue_duree: { plafond: 77700, abattement: 0.5 },
    tourisme_classe: { plafond: 77700, abattement: 0.5 },
    tourisme_non_classe: { plafond: 15000, abattement: 0.3 },
    chambres_hotes: { plafond: 77700, abattement: 0.71 },
  },
  MICRO_FONCIER: {
    plafond: 15000,
    abattement: 0.3,
  },
};

/**
 * Constantes fiscales indexées par année
 *
 * @example
 * ```typescript
 * const constants2026 = TAX_CONSTANTS[2026];
 * const tmi = constants2026.TRANCHES_IR[2]?.taux; // 0.30
 * ```
 */
export const TAX_CONSTANTS: Record<number, FiscalYearConstants> = {
  2025: FISCAL_YEAR_2025,
  2026: FISCAL_YEAR_2026,
  2027: FISCAL_YEAR_2027,
};

/**
 * Années fiscales supportées
 */
export const SUPPORTED_FISCAL_YEARS = [2025, 2026, 2027] as const;

/**
 * Type pour les années fiscales supportées
 */
export type SupportedFiscalYear = (typeof SUPPORTED_FISCAL_YEARS)[number];

/**
 * Année fiscale par défaut (courante)
 */
export const DEFAULT_FISCAL_YEAR: SupportedFiscalYear = 2026;

/**
 * Récupère les constantes pour une année fiscale donnée
 *
 * @param year - Année fiscale (2025, 2026, 2027)
 * @returns Constantes pour l'année spécifiée
 * @throws Error si l'année n'est pas supportée
 *
 * @example
 * ```typescript
 * const constants = getConstantsForYear(2027);
 * console.log(constants.PLAFOND_QUOTIENT_FAMILIAL); // 1827
 * ```
 */
export function getConstantsForYear(year: number): FiscalYearConstants {
  const constants = TAX_CONSTANTS[year];
  if (!constants) {
    const supportedYears = SUPPORTED_FISCAL_YEARS.join(", ");
    throw new Error(
      `Année fiscale ${year} non supportée. Années disponibles: ${supportedYears}`
    );
  }
  return constants;
}

/**
 * Vérifie si une année fiscale est supportée
 *
 * @param year - Année à vérifier
 * @returns true si l'année est supportée
 */
export function isFiscalYearSupported(year: number): year is SupportedFiscalYear {
  return SUPPORTED_FISCAL_YEARS.includes(year as SupportedFiscalYear);
}
