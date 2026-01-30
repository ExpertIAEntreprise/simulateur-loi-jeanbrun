/**
 * Types TypeScript pour le moteur de calcul fiscal
 *
 * Ces types sont spécifiques au module de calcul et complètent
 * les types de simulation existants dans src/types/simulation.ts
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

// ============================================
// ÉNUMÉRATIONS
// ============================================

/**
 * Niveau de loyer pour le dispositif Jeanbrun
 * Détermine le taux d'amortissement applicable
 */
export type NiveauLoyerJeanbrun = "intermediaire" | "social" | "tres_social";

/**
 * Zone fiscale (Pinel/Jeanbrun)
 * Réexporté depuis types/ville pour cohérence
 */
export type ZoneFiscale = "A_BIS" | "A" | "B1" | "B2" | "C";

/**
 * Type de bien immobilier
 */
export type TypeBien = "neuf" | "ancien";

/**
 * Régime fiscal pour la location
 */
export type RegimeFiscal =
  | "jeanbrun"
  | "lmnp_reel"
  | "lmnp_micro"
  | "location_nue_reel"
  | "location_nue_micro";

/**
 * Type de location LMNP
 */
export type TypeLocationLMNP =
  | "longue_duree"
  | "tourisme_classe"
  | "tourisme_non_classe"
  | "chambres_hotes";

/**
 * Situation familiale pour le calcul IR
 */
export type SituationFamiliale = "celibataire" | "couple";

// ============================================
// TYPES D'ENTRÉE (INPUTS)
// ============================================

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
 * Entrée pour le calcul de la TMI
 */
export interface TMIInput {
  /** Revenu net imposable en euros */
  revenuNetImposable: number;
  /** Nombre de parts fiscales */
  nombreParts: number;
}

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
 * Entrée pour le calcul du déficit foncier
 */
export interface DeficitFoncierInput {
  /** Loyers perçus en euros */
  loyersPercus: number;
  /** Charges déductibles en euros */
  chargesDeductibles: number;
  /** Intérêts d'emprunt en euros */
  interetsEmprunt: number;
  /** Indique si travaux de rénovation énergétique */
  travauxEnergetiques?: boolean;
  /** Date d'application (pour plafond bonifié) */
  dateApplication?: Date;
}

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
 * Entrée pour le calcul de la plus-value
 */
export interface PlusValueInput {
  /** Prix de vente en euros */
  prixVente: number;
  /** Prix d'achat en euros */
  prixAchat: number;
  /** Frais d'acquisition en euros */
  fraisAcquisition?: number;
  /** Montant des travaux en euros */
  travaux?: number;
  /** Frais de vente en euros */
  fraisVente?: number;
  /** Durée de détention en années */
  dureeDetention: number;
}

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
 * Entrée pour le calcul des rendements
 */
export interface RendementsInput {
  /** Loyer annuel en euros */
  loyerAnnuel: number;
  /** Prix d'acquisition en euros */
  prixAcquisition: number;
  /** Charges annuelles en euros */
  chargesAnnuelles?: number;
  /** Frais d'acquisition (notaire, etc.) */
  fraisAcquisition?: number;
  /** Impôts annuels en euros */
  impotsAnnuels?: number;
  /** Prélèvements sociaux en euros */
  prelevementsSociaux?: number;
}

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

// ============================================
// TYPES DE SORTIE (OUTPUTS)
// ============================================

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
 * Résultat du calcul de déficit foncier
 */
export interface DeficitFoncierResult {
  /** Revenu foncier net (ou 0 si déficit) */
  revenuFoncierNet: number;
  /** Déficit total */
  deficitTotal: number;
  /** Déficit hors intérêts */
  deficitHorsInterets?: number;
  /** Plafond applicable */
  plafondApplicable: number;
  /** Montant imputable sur revenu global */
  imputationRevenuGlobal: number;
  /** Montant reportable sur revenus fonciers */
  reportRevenusFonciers: number;
  /** Durée de report en années */
  dureeReport: number;
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
 * Résultat du calcul de plus-value
 */
export interface PlusValueResult {
  /** Plus-value brute */
  plusValueBrute: number;
  /** Abattement IR (pourcentage) */
  abattementIR: number;
  /** Abattement PS (pourcentage) */
  abattementPS: number;
  /** Plus-value imposable IR */
  pvImposableIR: number;
  /** Plus-value imposable PS */
  pvImposablePS: number;
  /** Impôt IR */
  impotIR: number;
  /** Prélèvements sociaux */
  impotPS: number;
  /** Surtaxe si applicable */
  surtaxe: number;
  /** Impôt total */
  impotTotal: number;
  /** Taux effectif d'imposition */
  tauxEffectif: number;
  /** Indique si exonéré */
  exonere: boolean;
  /** Motif d'exonération */
  motifExoneration?: string;
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
 * Résultat du calcul des rendements
 */
export interface RendementsResult {
  /** Rendement brut (%) */
  rendementBrut: number;
  /** Rendement net de charges (%) */
  rendementNet: number;
  /** Rendement net-net après fiscalité (%) */
  rendementNetNet: number;
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

// ============================================
// TYPES UTILITAIRES
// ============================================

/**
 * Type pour les tranches IR
 */
export interface TrancheIR {
  min: number;
  max: number;
  taux: number;
}

/**
 * Type pour les niveaux Jeanbrun
 */
export interface NiveauJeanbrun {
  taux: number;
  plafond: number;
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

/**
 * Labels français pour les régimes fiscaux
 */
export const REGIME_FISCAL_LABELS: Record<RegimeFiscal, string> = {
  jeanbrun: "Loi Jeanbrun",
  lmnp_reel: "LMNP Réel",
  lmnp_micro: "LMNP Micro-BIC",
  location_nue_reel: "Location nue (Réel)",
  location_nue_micro: "Location nue (Micro-foncier)",
};

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
