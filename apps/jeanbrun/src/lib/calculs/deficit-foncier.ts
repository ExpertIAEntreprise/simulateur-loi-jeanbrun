/**
 * Module de calcul du deficit foncier
 *
 * Gere le calcul du deficit foncier et son imputation:
 * - Sur le revenu global (dans la limite du plafond)
 * - En report sur les revenus fonciers futurs (10 ans max)
 *
 * Regles fiscales:
 * - Les interets d'emprunt sont imputables uniquement sur revenus fonciers
 * - Les charges hors interets sont imputables sur revenu global (plafond 10700 ou 21400)
 * - Le plafond bonifie (21400) s'applique aux travaux energetiques jusqu'au 31/12/2027
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { DEFICIT_FONCIER } from "./constants";
import type {
  DeficitFoncierInput,
  DeficitFoncierResult,
  LigneReportDeficit,
} from "./types/deficit-foncier";

// Re-export du type pour maintenir la compatibilite avec les imports existants
export type { LigneReportDeficit } from "./types/deficit-foncier";

/**
 * Determine si le plafond bonifie est applicable
 *
 * Conditions:
 * - Travaux de renovation energetique realises
 * - Date d'application <= 31/12/2027
 *
 * @param travauxEnergetiques - Indique si travaux energetiques
 * @param dateApplication - Date d'application
 * @returns true si le plafond bonifie s'applique
 */
function estPlafondBonifieApplicable(
  travauxEnergetiques: boolean | undefined,
  dateApplication: Date | undefined
): boolean {
  if (!travauxEnergetiques) {
    return false;
  }

  const dateLimite = DEFICIT_FONCIER.dateLimiteBonification;
  const dateRef = dateApplication ?? new Date();

  // Compare les dates en ne gardant que jour/mois/annee
  const dateLimiteNormalisee = new Date(
    dateLimite.getFullYear(),
    dateLimite.getMonth(),
    dateLimite.getDate()
  );
  const dateRefNormalisee = new Date(
    dateRef.getFullYear(),
    dateRef.getMonth(),
    dateRef.getDate()
  );

  return dateRefNormalisee <= dateLimiteNormalisee;
}

/**
 * Calcule le deficit foncier et son imputation
 *
 * Algorithme:
 * 1. Calcule le revenu foncier net (loyers - charges - interets)
 * 2. Si positif: pas de deficit
 * 3. Si negatif: calcule le deficit total
 * 4. Separe le deficit hors interets (imputable sur RG) des interets (report uniquement)
 * 5. Applique le plafond (standard ou bonifie)
 * 6. Calcule l'imputation sur revenu global et le report
 *
 * @param input - Donnees d'entree pour le calcul
 * @returns Resultat detaille du calcul de deficit foncier
 */
export function calculerDeficitFoncier(
  input: DeficitFoncierInput
): DeficitFoncierResult {
  const { loyersPercus, chargesDeductibles, interetsEmprunt } = input;
  const { travauxEnergetiques, dateApplication } = input;

  // Determine le plafond applicable
  const plafondBonifie = estPlafondBonifieApplicable(
    travauxEnergetiques,
    dateApplication
  );
  const plafondApplicable = plafondBonifie
    ? DEFICIT_FONCIER.plafondBonifie
    : DEFICIT_FONCIER.plafondStandard;

  // Calcule le revenu foncier net
  const revenuFoncierBrut = loyersPercus - chargesDeductibles - interetsEmprunt;

  // Cas 1: Pas de deficit (revenu positif ou nul)
  if (revenuFoncierBrut >= 0) {
    return {
      revenuFoncierNet: revenuFoncierBrut,
      deficitTotal: 0,
      deficitHorsInterets: 0,
      plafondApplicable,
      imputationRevenuGlobal: 0,
      reportRevenusFonciers: 0,
      dureeReport: DEFICIT_FONCIER.dureeReport,
    };
  }

  // Cas 2: Deficit foncier
  const deficitTotal = Math.abs(revenuFoncierBrut);

  // Calcul du deficit hors interets
  // Le deficit hors interets = loyers - charges (sans les interets)
  // Si ce montant est negatif, c'est le deficit imputable sur RG
  // Les interets ne s'imputent que sur les revenus fonciers
  const revenuHorsInterets = loyersPercus - chargesDeductibles;

  // Les interets s'imputent d'abord sur les revenus fonciers
  // S'il reste des revenus apres imputation des charges, les interets s'y imputent
  // Sinon les interets sont en report

  let deficitHorsInterets: number;
  let interetsNonImputes: number;

  if (revenuHorsInterets >= 0) {
    // Les charges sont couvertes par les loyers
    // Le deficit vient uniquement des interets
    deficitHorsInterets = 0;
    // Les interets s'imputent sur le revenu positif, le reste est reporte
    interetsNonImputes = Math.max(0, interetsEmprunt - revenuHorsInterets);
  } else {
    // Les charges depassent les loyers = deficit hors interets
    deficitHorsInterets = Math.abs(revenuHorsInterets);
    // Tous les interets sont en report (pas de revenus fonciers pour les absorber)
    interetsNonImputes = interetsEmprunt;
  }

  // Imputation sur revenu global = deficit hors interets plafonne
  const imputationRevenuGlobal = Math.min(deficitHorsInterets, plafondApplicable);

  // Report sur revenus fonciers = deficit hors interets excedant le plafond + interets
  const excedentDeficitHorsInterets = Math.max(
    0,
    deficitHorsInterets - plafondApplicable
  );
  const reportRevenusFonciers = excedentDeficitHorsInterets + interetsNonImputes;

  return {
    revenuFoncierNet: 0, // En cas de deficit, le revenu net est 0
    deficitTotal,
    deficitHorsInterets,
    plafondApplicable,
    imputationRevenuGlobal,
    reportRevenusFonciers,
    dureeReport: DEFICIT_FONCIER.dureeReport,
  };
}

/**
 * Genere le tableau de report du deficit sur les revenus fonciers futurs
 *
 * Regles:
 * - Le deficit se reporte sur 10 ans maximum
 * - Chaque annee, il s'impute sur les revenus fonciers positifs
 * - Si revenus fonciers negatifs, pas d'imputation (le deficit reste)
 * - Le tableau s'arrete apres 10 ans ou si le tableau de revenus est epuise
 *
 * @param deficitInitial - Montant du deficit a reporter
 * @param revenusFonciersAnnuels - Tableau des revenus fonciers previsionnels par annee
 * @returns Tableau detaillant le report annee par annee
 */
export function tableauReportDeficit(
  deficitInitial: number,
  revenusFonciersAnnuels: number[]
): LigneReportDeficit[] {
  const tableau: LigneReportDeficit[] = [];

  // Limite a 10 ans maximum
  const nbAnnees = Math.min(revenusFonciersAnnuels.length, DEFICIT_FONCIER.dureeReport);

  let deficitRestant = deficitInitial;

  for (let i = 0; i < nbAnnees; i++) {
    const annee = i + 1;
    const revenuFoncier = revenusFonciersAnnuels[i] ?? 0;

    // Report de l'annee = deficit restant de l'annee precedente
    const deficitReporte = deficitRestant;

    // Imputation possible uniquement si revenus fonciers positifs
    let imputation = 0;
    if (revenuFoncier > 0 && deficitRestant > 0) {
      imputation = Math.min(revenuFoncier, deficitRestant);
    }

    // Calcul du solde
    const solde = deficitRestant - imputation;

    tableau.push({
      annee,
      deficitReporte,
      imputation,
      solde,
    });

    // Mise a jour du deficit restant pour l'annee suivante
    deficitRestant = solde;
  }

  return tableau;
}
