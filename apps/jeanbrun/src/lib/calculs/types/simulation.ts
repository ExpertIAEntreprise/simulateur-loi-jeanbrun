/**
 * Types pour la simulation complete
 *
 * Gere les entrees/sorties completes de l'orchestrateur de simulation
 * et les projections annuelles.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import type { ZoneFiscale } from "./common";
import type { CreditResult, TauxEndettementResult } from "./credit";
import type { IRResult } from "./ir";
import type { NiveauLoyerJeanbrun, TypeBien } from "./jeanbrun";
import type { JeanbrunNeufResult, JeanbrunAncienResult } from "./jeanbrun";
import type { ComparatifJeanbrunLMNP } from "./lmnp";
import type { PlusValueResult } from "./plus-value";
import type { RendementsResult } from "./rendements";
import type { EconomieImpot } from "./tmi";
import type { TMIResult } from "./tmi";

/**
 * Entree complete pour l'orchestrateur de simulation
 */
export interface SimulationCalculInput {
  // ─────────────────────────────────────────────────────────────────
  // Situation fiscale
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Revenu net imposable annuel en euros
   * @example 45000 // pour 45 000 EUR/an
   */
  revenuNetImposable: number;
  
  /**
   * Nombre de parts fiscales (quotient familial)
   * @example 2.5 // couple marie avec 1 enfant
   */
  nombreParts: number;

  // ─────────────────────────────────────────────────────────────────
  // Bien immobilier
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Type de bien (neuf ou ancien avec travaux)
   */
  typeBien: TypeBien;
  
  /**
   * Prix d'acquisition du bien en euros
   * @example 250000 // pour 250 000 EUR
   */
  prixAcquisition: number;
  
  /**
   * Surface habitable en metres carres
   * @example 65 // pour 65 m2
   */
  surface: number;
  
  /**
   * Zone fiscale du bien (A, A_bis, B1, B2, C)
   */
  zoneFiscale: ZoneFiscale;
  
  /**
   * Montant des travaux en euros (pour bien ancien uniquement)
   * @example 50000 // pour 50 000 EUR de travaux
   */
  montantTravaux?: number;

  // ─────────────────────────────────────────────────────────────────
  // Niveau de loyer Jeanbrun
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Niveau de loyer choisi pour le dispositif Jeanbrun
   * Determine le taux d'amortissement applicable
   */
  niveauLoyer: NiveauLoyerJeanbrun;

  // ─────────────────────────────────────────────────────────────────
  // Financement
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Apport personnel en euros
   * @example 50000 // pour 50 000 EUR d'apport
   */
  apportPersonnel?: number;
  
  /**
   * Taux d'interet annuel du credit (en decimal)
   * @example 0.035 // pour 3,5% par an
   */
  tauxCredit?: number;
  
  /**
   * Duree du credit en annees
   * @example 20 // pour un credit sur 20 ans
   */
  dureeCredit?: number;
  
  /**
   * Taux d'assurance annuel du credit (en decimal)
   * @example 0.003 // pour 0,3% par an
   */
  tauxAssurance?: number;

  // ─────────────────────────────────────────────────────────────────
  // Revenus locatifs
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Loyer mensuel estime en euros
   * @example 850 // pour 850 EUR/mois
   */
  loyerMensuelEstime?: number;
  
  /**
   * Charges de copropriete annuelles en euros
   * @example 1200 // pour 100 EUR/mois (1200 EUR/an)
   */
  chargesCopropriete?: number;
  
  /**
   * Taxe fonciere annuelle en euros
   * @example 1500 // montant annuel complet
   */
  taxeFonciere?: number;

  // ─────────────────────────────────────────────────────────────────
  // Options de simulation
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Activer la comparaison avec le regime LMNP
   */
  comparerLMNP?: boolean;
  
  /**
   * Activer le calcul de plus-value a la revente
   */
  calculerPlusValue?: boolean;
  
  /**
   * Duree de detention prevue en annees
   * @example 15 // pour 15 ans de detention
   */
  dureeDetentionPrevue?: number;
  
  /**
   * Prix de revente estime en euros
   * @example 300000 // pour 300 000 EUR
   */
  prixReventeEstime?: number;
}

/**
 * Projection annuelle pour la simulation
 */
export interface ProjectionAnnuelle {
  /**
   * Annee de la projection (1 a N)
   * @example 1 // premiere annee
   */
  annee: number;
  
  /**
   * Loyer annuel en euros
   * @example 10200 // pour 850 EUR/mois x 12
   */
  loyerAnnuel: number;
  
  /**
   * Charges annuelles totales en euros (copro + taxe fonciere + autres)
   * @example 2700 // charges + taxe fonciere
   */
  chargesAnnuelles: number;
  
  /**
   * Interets de credit payes dans l'annee en euros
   */
  interetsCredit: number;
  
  /**
   * Amortissement Jeanbrun de l'annee en euros
   */
  amortissement: number;
  
  /**
   * Revenu foncier imposable de l'annee en euros
   * (loyers - charges - interets - amortissement)
   */
  revenuImposable: number;
  
  /**
   * Impot du a l'IR sur les revenus fonciers en euros
   */
  impotDu: number;
  
  /**
   * Cash-flow net annuel en euros
   * (loyers - charges - mensualites credit - impots)
   */
  cashflowNet: number;
  
  /**
   * Cumul des economies d'impots depuis le debut en euros
   */
  cumulEconomieImpots: number;
}

/**
 * Resultat complet de la simulation
 */
export interface SimulationCalculResult {
  // ─────────────────────────────────────────────────────────────────
  // Identifiants
  // ─────────────────────────────────────────────────────────────────
  
  /** Date du calcul (format ISO) */
  dateCalcul: string;
  
  /** Version des formules de calcul */
  versionFormules: string;

  // ─────────────────────────────────────────────────────────────────
  // Resultats fiscaux
  // ─────────────────────────────────────────────────────────────────
  
  /** Resultat du calcul IR */
  ir: IRResult;
  
  /** Resultat du calcul TMI */
  tmi: TMIResult;

  // ─────────────────────────────────────────────────────────────────
  // Resultat Jeanbrun
  // ─────────────────────────────────────────────────────────────────
  
  /** Resultat du calcul Jeanbrun (neuf ou ancien) */
  jeanbrun: JeanbrunNeufResult | JeanbrunAncienResult;
  
  /** Economies d'impot detaillees */
  economieImpot: EconomieImpot;

  // ─────────────────────────────────────────────────────────────────
  // Credit (si applicable)
  // ─────────────────────────────────────────────────────────────────
  
  /** Resultat du calcul de credit */
  credit?: CreditResult;
  
  /** Resultat du calcul de taux d'endettement */
  tauxEndettement?: TauxEndettementResult;

  // ─────────────────────────────────────────────────────────────────
  // Rendements
  // ─────────────────────────────────────────────────────────────────
  
  /** Rendements brut, net et net-net */
  rendements: RendementsResult;

  // ─────────────────────────────────────────────────────────────────
  // Cash-flow
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Cash-flow mensuel moyen en euros
   * @example 150 // pour 150 EUR/mois
   */
  cashflowMensuel: number;
  
  /**
   * Cash-flow annuel total en euros
   * @example 1800 // pour 1 800 EUR/an
   */
  cashflowAnnuel: number;

  // ─────────────────────────────────────────────────────────────────
  // Projection
  // ─────────────────────────────────────────────────────────────────
  
  /** Projection annuelle sur la duree d'engagement */
  projection: ProjectionAnnuelle[];

  // ─────────────────────────────────────────────────────────────────
  // Options (si demandees)
  // ─────────────────────────────────────────────────────────────────
  
  /** Comparatif LMNP (si comparerLMNP = true) */
  comparatifLMNP?: ComparatifJeanbrunLMNP;
  
  /** Plus-value a la revente (si calculerPlusValue = true) */
  plusValue?: PlusValueResult;

  // ─────────────────────────────────────────────────────────────────
  // Synthese
  // ─────────────────────────────────────────────────────────────────
  
  /** Synthese des indicateurs cles */
  synthese: {
    /**
     * Economie d'impots annuelle en euros
     */
    economieImpotsAnnuelle: number;
    
    /**
     * Economie d'impots totale sur 9 ans en euros
     */
    economieImpots9ans: number;
    
    /**
     * Rendement brut en pourcentage
     * @example 4.5 // pour 4,5%
     */
    rendementBrut: number;
    
    /**
     * Rendement net de charges en pourcentage
     * @example 3.8 // pour 3,8%
     */
    rendementNet: number;
    
    /**
     * Rendement net-net apres fiscalite en pourcentage
     * @example 3.2 // pour 3,2%
     */
    rendementNetNet: number;
    
    /**
     * Cash-flow mensuel moyen en euros
     * @example 150 // pour 150 EUR/mois
     */
    cashflowMensuel: number;
  };
}
