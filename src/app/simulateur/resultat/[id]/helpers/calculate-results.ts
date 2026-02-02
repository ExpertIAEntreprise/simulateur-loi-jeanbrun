/**
 * Helper pour calculer les resultats de simulation
 * @module simulateur/resultat/helpers/calculate-results
 */

import type { WizardState, SimulationResults } from "../types";
import type { PatrimoineDataPoint, TableauAnnuelData, RegimeData } from "@/components/simulateur/resultats";
import type { SimulationCalculInput, ZoneFiscale, NiveauLoyerJeanbrun, TypeBien } from "@/lib/calculs";
import { orchestrerSimulation, JEANBRUN_NEUF } from "@/lib/calculs";
import { analyserFinancement } from "@/lib/calculs/analyse-financement";

/**
 * Calculate total project price (acquisition + travaux for ancien)
 */
export function calculatePrixTotal(step2: WizardState['step2']): number {
  if (!step2?.prixAcquisition) return 0;
  return step2.typeBien === "ancien" && step2.montantTravaux
    ? step2.prixAcquisition + step2.montantTravaux
    : step2.prixAcquisition;
}

/**
 * Calculate all simulation results from wizard state
 * @param state - Valid wizard state
 * @returns SimulationResults or null if calculation fails
 */
export function calculateResults(state: WizardState): SimulationResults | null {
  try {
    const { step1, step2, step3, step4, step5 } = state;

    // Build orchestrator input
    const input: SimulationCalculInput = {
      revenuNetImposable: step1.revenuNet!,
      nombreParts: step1.parts!,
      typeBien: (step2.typeBien ?? "neuf") as TypeBien,
      prixAcquisition: step2.prixAcquisition!,
      surface: step2.surface!,
      zoneFiscale: step2.zoneFiscale as ZoneFiscale,
      niveauLoyer: step4.niveauLoyer as NiveauLoyerJeanbrun,
      apportPersonnel: step3.apport ?? 0,
      tauxCredit: (step3.tauxCredit ?? 3.5) / 100,
      dureeCredit: step3.dureeCredit!,
      tauxAssurance: 0.0036,
      chargesCopropriete: step4.chargesAnnuelles ?? 0,
      taxeFonciere: step4.taxeFonciere ?? 0,
      comparerLMNP: true,
      calculerPlusValue: step5.strategieSortie === "revente",
    };

    // Add optional fields only if they have values
    if (step4.loyerMensuel !== undefined) {
      input.loyerMensuelEstime = step4.loyerMensuel;
    }
    if (step5.dureeDetention !== undefined) {
      input.dureeDetentionPrevue = step5.dureeDetention;
    }

    // Add travaux for ancien
    if (step2.typeBien === "ancien" && step2.montantTravaux) {
      input.montantTravaux = step2.montantTravaux;
    }

    // Estimate resale price
    if (step5.strategieSortie === "revente" && step5.dureeDetention) {
      const revalorisation = 1 + (step5.revalorisation ?? 2) / 100;
      const prixTotal = calculatePrixTotal(step2);
      input.prixReventeEstime = Math.round(
        prixTotal * Math.pow(revalorisation, step5.dureeDetention)
      );
    }

    // Run orchestrator
    const calcResult = orchestrerSimulation(input);

    // Check eligibility
    if (
      calcResult.jeanbrun &&
      "eligible" in calcResult.jeanbrun &&
      !calcResult.jeanbrun.eligible
    ) {
      return null;
    }

    // Calculate financing
    const revenuMensuel = step1.revenuNet! / 12;
    const montantProjet = calculatePrixTotal(step2);

    const financement = analyserFinancement({
      revenuMensuel,
      chargesActuelles: step3.autresCredits ?? 0,
      montantProjet,
      apport: step3.apport ?? 0,
      dureeEmpruntMois: step3.dureeCredit! * 12,
      tauxAnnuel: (step3.tauxCredit ?? 3.5) / 100,
    });

    // Generate graphique data
    const graphiqueData = generateGraphiqueData(state, calcResult);

    // Generate tableau annuel
    const tableauAnnuel = generateTableauAnnuel(state, calcResult);

    // Generate LMNP comparison
    const comparatifLMNP = generateComparatifLMNP(state, calcResult);

    // Build synthese
    const mensualite = calcResult.credit?.mensualiteAvecAssurance ?? 0;
    const chargesAnnuelles = (step4.chargesAnnuelles ?? 0) + (step4.taxeFonciere ?? 0);
    const chargesMensuelles = chargesAnnuelles / 12;
    const economieAnnuelle = calcResult.economieImpot.economieTotaleAnnuelle;
    const effortJeanbrun =
      mensualite +
      chargesMensuelles -
      step4.loyerMensuel! -
      economieAnnuelle / 12;

    const synthese = {
      economieFiscale: calcResult.economieImpot.economieTotale9ans,
      cashFlowMensuel: calcResult.cashflowMensuel,
      rendementNet: calcResult.rendements.rendementNet,
      effortEpargne: Math.round(effortJeanbrun),
    };

    return {
      synthese,
      graphiqueData,
      tableauAnnuel,
      comparatifLMNP,
      financement,
    };
  } catch (error) {
    // Log only in development to avoid noise in production
    if (process.env.NODE_ENV === "development") {
      console.error("Error calculating results:", error);
    }
    return null;
  }
}

/**
 * Generate patrimoine chart data
 */
function generateGraphiqueData(
  state: WizardState,
  calcResult: ReturnType<typeof orchestrerSimulation>
): PatrimoineDataPoint[] {
  const { step2, step3, step5 } = state;
  const dureeAns = step5.dureeDetention!;
  const revalorisation = 1 + (step5.revalorisation ?? 2) / 100;
  const prixInitial = calculatePrixTotal(step2);
  const economieAnnuelle = calcResult.economieImpot.economieTotaleAnnuelle;
  const montantEmprunt = prixInitial - (step3.apport ?? 0);
  const capitalRembourseAnnuel = montantEmprunt / step3.dureeCredit!;

  const graphiqueData: PatrimoineDataPoint[] = [];
  for (let annee = 0; annee <= dureeAns; annee++) {
    graphiqueData.push({
      annee,
      valeurBien: Math.round(prixInitial * Math.pow(revalorisation, annee)),
      capitalRembourse: annee === 0 ? 0 : Math.round(capitalRembourseAnnuel * annee),
      economiesFiscales:
        annee === 0 ? 0 : Math.round(economieAnnuelle * Math.min(annee, 9)),
    });
  }
  return graphiqueData;
}

/**
 * Generate yearly table data
 */
function generateTableauAnnuel(
  state: WizardState,
  calcResult: ReturnType<typeof orchestrerSimulation>
): TableauAnnuelData[] {
  const { step2, step3, step4, step5 } = state;
  const currentYear = new Date().getFullYear();
  const dureeAns = step5.dureeDetention!;
  const loyerAnnuel = step4.loyerMensuel! * 12;
  const chargesAnnuelles = (step4.chargesAnnuelles ?? 0) + (step4.taxeFonciere ?? 0);
  const prixInitial = calculatePrixTotal(step2);
  const revalorisation = 1 + (step5.revalorisation ?? 2) / 100;

  const amortissementAnnuel =
    "amortissementNet" in calcResult.jeanbrun && calcResult.jeanbrun.amortissementNet
      ? calcResult.jeanbrun.amortissementNet
      : 0;
  const mensualite = calcResult.credit?.mensualiteAvecAssurance ?? 0;
  const interetsAnnuels = calcResult.credit?.totalInterets
    ? (calcResult.credit.totalInterets / (step3.dureeCredit! * 12)) * 12
    : 0;

  const tableauAnnuel: TableauAnnuelData[] = [];
  for (let i = 0; i < dureeAns; i++) {
    const annee = currentYear + i;
    const inEngagementPeriod = i < JEANBRUN_NEUF.dureeEngagement;
    const reductionIR = inEngagementPeriod
      ? Math.round(amortissementAnnuel * calcResult.tmi.tmi)
      : 0;
    const valeurBien = Math.round(prixInitial * Math.pow(revalorisation, i + 1));
    const cashFlow = loyerAnnuel - chargesAnnuelles - mensualite * 12 + reductionIR;

    tableauAnnuel.push({
      annee,
      loyers: Math.round(loyerAnnuel),
      charges: Math.round(chargesAnnuelles),
      interets: Math.round(interetsAnnuels),
      amortissement: inEngagementPeriod ? Math.round(amortissementAnnuel) : 0,
      reductionIR,
      cashFlow: Math.round(cashFlow),
      patrimoine: valeurBien,
    });
  }
  return tableauAnnuel;
}

/**
 * Generate LMNP comparison data
 */
function generateComparatifLMNP(
  state: WizardState,
  calcResult: ReturnType<typeof orchestrerSimulation>
): { jeanbrun: RegimeData; lmnp: RegimeData } {
  const { step4, step5 } = state;
  const loyerAnnuel = step4.loyerMensuel! * 12;
  const chargesAnnuelles = (step4.chargesAnnuelles ?? 0) + (step4.taxeFonciere ?? 0);
  const mensualite = calcResult.credit?.mensualiteAvecAssurance ?? 0;
  const economieAnnuelle = calcResult.economieImpot.economieTotaleAnnuelle;

  const recettesApresAbattement = loyerAnnuel * 0.5;
  const impotLMNP = recettesApresAbattement * calcResult.tmi.tmi;
  const economieLMNP =
    (loyerAnnuel - recettesApresAbattement) * calcResult.tmi.tmi * 9;

  const chargesMensuelles = chargesAnnuelles / 12;
  const effortJeanbrun =
    mensualite +
    chargesMensuelles -
    step4.loyerMensuel! -
    economieAnnuelle / 12;
  const effortLMNP =
    mensualite + chargesMensuelles - step4.loyerMensuel! + impotLMNP / 12;

  return {
    jeanbrun: {
      reductionImpot: Math.round(calcResult.economieImpot.economieTotale9ans),
      cashFlowMoyen: calcResult.cashflowMensuel,
      effortEpargne: Math.round(effortJeanbrun),
      rendementNet: Math.round(calcResult.rendements.rendementNet * 100) / 100,
      fiscaliteRevente:
        step5.dureeDetention! >= 22
          ? "Exoneration totale IR"
          : `Abattement ${Math.min(6 * (step5.dureeDetention! - 5), 100)}%`,
      complexite: "Moyenne",
    },
    lmnp: {
      reductionImpot: Math.round(economieLMNP),
      cashFlowMoyen: Math.round(
        calcResult.cashflowMensuel - economieAnnuelle / 12 + impotLMNP / 12
      ),
      effortEpargne: Math.round(effortLMNP),
      rendementNet: Math.round((calcResult.rendements.rendementNet - 0.5) * 100) / 100,
      fiscaliteRevente: "Amortissements reintegres",
      complexite: "Elevee",
    },
  };
}
