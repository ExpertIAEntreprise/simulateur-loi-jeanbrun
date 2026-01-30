/**
 * Types pour la simulation complète
 *
 * Gère les entrées/sorties complètes de l'orchestrateur de simulation
 * et les projections annuelles.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import type { ZoneFiscale } from "./common";
import type { NiveauLoyerJeanbrun, TypeBien } from "./jeanbrun";
import type { IRResult } from "./ir";
import type { TMIResult } from "./tmi";
import type { JeanbrunNeufResult, JeanbrunAncienResult } from "./jeanbrun";
import type { EconomieImpot } from "./tmi";
import type { CreditResult, TauxEndettementResult } from "./credit";
import type { RendementsResult } from "./rendements";
import type { ComparatifJeanbrunLMNP } from "./lmnp";
import type { PlusValueResult } from "./plus-value";

/**
 * Entrée complète pour l'orchestrateur de simulation
 */
export interface SimulationCalculInput {
  // Situation fiscale
  revenuNetImposable: number;
  nombreParts: number;

  // Bien immobilier
  typeBien: TypeBien;
  prixAcquisition: number;
  surface: number;
  zoneFiscale: ZoneFiscale;
  montantTravaux?: number;

  // Niveau de loyer Jeanbrun
  niveauLoyer: NiveauLoyerJeanbrun;

  // Financement
  apportPersonnel?: number;
  tauxCredit?: number;
  dureeCredit?: number;
  tauxAssurance?: number;

  // Revenus locatifs
  loyerMensuelEstime?: number;
  chargesCopropriete?: number;
  taxeFonciere?: number;

  // Options
  comparerLMNP?: boolean;
  calculerPlusValue?: boolean;
  dureeDetentionPrevue?: number;
  prixReventeEstime?: number;
}

/**
 * Projection annuelle pour la simulation
 */
export interface ProjectionAnnuelle {
  /** Année (1 à N) */
  annee: number;
  /** Loyer annuel */
  loyerAnnuel: number;
  /** Charges annuelles */
  chargesAnnuelles: number;
  /** Intérêts crédit */
  interetsCredit: number;
  /** Amortissement Jeanbrun */
  amortissement: number;
  /** Revenu imposable */
  revenuImposable: number;
  /** Impôt dû */
  impotDu: number;
  /** Cash-flow net */
  cashflowNet: number;
  /** Cumul économie d'impôts */
  cumulEconomieImpots: number;
}

/**
 * Résultat complet de la simulation
 */
export interface SimulationCalculResult {
  // Identifiants
  dateCalcul: string;
  versionFormules: string;

  // Résultat IR
  ir: IRResult;
  tmi: TMIResult;

  // Résultat Jeanbrun
  jeanbrun: JeanbrunNeufResult | JeanbrunAncienResult;
  economieImpot: EconomieImpot;

  // Crédit (si applicable)
  credit?: CreditResult;
  tauxEndettement?: TauxEndettementResult;

  // Rendements
  rendements: RendementsResult;

  // Cash-flow
  cashflowMensuel: number;
  cashflowAnnuel: number;

  // Projection
  projection: ProjectionAnnuelle[];

  // Comparatif LMNP (si demandé)
  comparatifLMNP?: ComparatifJeanbrunLMNP;

  // Plus-value (si demandé)
  plusValue?: PlusValueResult;

  // Synthèse
  synthese: {
    economieImpotsAnnuelle: number;
    economieImpots9ans: number;
    rendementBrut: number;
    rendementNet: number;
    rendementNetNet: number;
    cashflowMensuel: number;
  };
}
