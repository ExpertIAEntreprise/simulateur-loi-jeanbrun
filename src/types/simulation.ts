/**
 * Types pour les simulations fiscales Loi Jeanbrun
 */

import type { ZoneFiscale } from "./ville";

/**
 * Données d'entrée du wizard de simulation (6 étapes)
 */
export interface SimulationInput {
  // Étape 1: Situation fiscale
  revenuFiscalReference: number; // En euros
  partsQuotientFamilial: number;
  trancheMarginaleImposition: number; // Pourcentage (ex: 30)

  // Étape 2: Investissement
  montantInvestissement: number; // En euros
  apportPersonnel: number; // En euros
  dureeCredit: number; // En années
  tauxCredit: number; // Pourcentage (ex: 3.5)

  // Étape 3: Bien immobilier
  surface: number; // En m²
  zoneFiscale: ZoneFiscale;
  villeId?: string;
  programmeId?: string;

  // Étape 4: Revenus locatifs
  loyerMensuelEstime: number; // En euros
  chargesCopropriete: number; // En euros/mois
  taxeFonciere: number; // En euros/an

  // Étape 5: Options Jeanbrun
  regimeChoisi: "jeanbrun" | "lmnp_reel" | "lmnp_micro";
  dureeAmortissement: number; // En années (10, 15, 20, 25)
  optionMeuble: boolean;

  // Étape 6: Coordonnées (facultatif pour simulation basique)
  email?: string;
  telephone?: string;
  prenom?: string;
  nom?: string;
}

/**
 * Résultats détaillés de la simulation
 */
export interface SimulationResultat {
  // Synthèse
  economieImpotsAnnuelle: number; // En euros
  economieImpots10Ans: number; // En euros
  economieImpotsTotale: number; // En euros (sur durée amortissement)
  rendementBrut: number; // Pourcentage
  rendementNet: number; // Pourcentage (après charges et impôts)
  cashflowMensuel: number; // En euros (loyer - mensualité - charges)

  // Détail fiscal Jeanbrun
  amortissementAnnuel: number; // En euros
  baseImposableApresAmortissement: number; // En euros
  impotAvantJeanbrun: number; // En euros/an
  impotApresJeanbrun: number; // En euros/an
  gainFiscalJeanbrun: number; // En euros/an

  // Comparaison LMNP
  comparaisonLmnpReel: {
    impotAnnuel: number;
    rendementNet: number;
    differenceJeanbrun: number;
  };
  comparaisonLmnpMicro: {
    impotAnnuel: number;
    rendementNet: number;
    differenceJeanbrun: number;
  };

  // Projection 10 ans
  projection: SimulationProjection[];

  // Métadonnées
  dateCalcul: string; // ISO date
  versionFormules: string;
}

/**
 * Projection année par année
 */
export interface SimulationProjection {
  annee: number;
  loyerAnnuel: number;
  chargesAnnuelles: number;
  interetsCredit: number;
  amortissement: number;
  revenuImposable: number;
  impotDu: number;
  cashflowNet: number;
  cumulEconomieImpots: number;
}

/**
 * Simulation complète avec métadonnées
 */
export interface Simulation {
  id: string;
  userId: string | null;
  villeId: string | null;
  programmeId: string | null;
  inputData: SimulationInput | null;
  resultats: SimulationResultat | null;
  montantInvestissement: number | null; // En euros
  rendementBrut: number | null; // Pourcentage
  economieImpots10Ans: number | null; // En euros
  estComplet: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Résumé simulation pour liste/dashboard
 */
export interface SimulationResume {
  id: string;
  villeNom: string | null;
  programmeNom: string | null;
  montantInvestissement: number | null;
  economieImpots10Ans: number | null;
  rendementBrut: number | null;
  estComplet: boolean;
  createdAt: Date;
}

/**
 * Paramètres fiscaux Loi Jeanbrun (constantes)
 */
export const PARAMETRES_JEANBRUN = {
  // Taux d'amortissement selon durée
  tauxAmortissement: {
    10: 10, // 10% par an sur 10 ans
    15: 6.67, // 6.67% par an sur 15 ans
    20: 5, // 5% par an sur 20 ans
    25: 4, // 4% par an sur 25 ans
  } as const,

  // Plafonds par zone
  plafondsPrixM2: {
    A_BIS: 5500,
    A: 4200,
    B1: 3500,
    B2: 3000,
    C: 2500,
  } as const,

  // Plafonds de loyer (€/m²/mois)
  plafondsLoyerM2: {
    A_BIS: 18.89,
    A: 14.03,
    B1: 11.31,
    B2: 9.83,
    C: 8.62,
  } as const,

  // Barème IR 2026 (tranches)
  baremeIR2026: [
    { limite: 11294, taux: 0 },
    { limite: 28797, taux: 11 },
    { limite: 82341, taux: 30 },
    { limite: 177106, taux: 41 },
    { limite: Infinity, taux: 45 },
  ] as const,

  // LMNP abattement micro-BIC
  abattementMicroBic: 50, // 50%
} as const;

/**
 * Type pour les durées d'amortissement valides
 */
export type DureeAmortissement = 10 | 15 | 20 | 25;
