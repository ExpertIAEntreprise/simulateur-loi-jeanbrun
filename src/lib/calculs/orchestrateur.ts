/**
 * Module orchestrateur de simulation fiscale Jeanbrun
 *
 * Ce module coordonne tous les calculs fiscaux:
 * - IR et TMI
 * - Jeanbrun Neuf/Ancien
 * - Credit immobilier
 * - Plus-value
 * - LMNP (comparatif)
 * - Rendements
 *
 * Fonctions principales:
 * - calculerLoyerEstime: Estime le loyer mensuel selon zone, surface et niveau
 * - orchestrerSimulation: Calcul complet de simulation avec tous les modules
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import {
  PLAFONDS_LOYERS_M2,
  COEFFICIENT_SURFACE,
  JEANBRUN_NEUF,
  FRAIS_ACQUISITION,
} from "./constants";
import { calculerCredit, calculerTauxEndettement } from "./credit";
import { calculerIR } from "./ir";
import { calculerJeanbrunAncien, verifierEligibiliteTravaux } from "./jeanbrun-ancien";
import { calculerJeanbrunNeuf } from "./jeanbrun-neuf";
import { calculerLMNPReel, comparerJeanbrunLMNP } from "./lmnp";
import { calculerPlusValue } from "./plus-value";
import { calculerRendements } from "./rendements";
import { calculerTMI, calculerEconomieImpot } from "./tmi";
import type { ZoneFiscale } from "./types/common";
import type { IRResult } from "./types/ir";
import type { NiveauLoyerJeanbrun, JeanbrunNeufResult, JeanbrunAncienResult } from "./types/jeanbrun";
import type {
  SimulationCalculInput,
  SimulationCalculResult,
  ProjectionAnnuelle,
} from "./types/simulation";
import type { EconomieImpot } from "./types/tmi";
import type { TMIResult } from "./types/tmi";

// ============================================
// CALCUL DU LOYER ESTIME
// ============================================

/**
 * Estime le loyer mensuel basé sur surface, zone et niveau de loyer
 * Utilise les plafonds officiels avec coefficient de surface
 *
 * @param surface - Surface en m²
 * @param zoneFiscale - Zone fiscale (A_BIS, A, B1, B2, C)
 * @param niveauLoyer - Niveau de loyer Jeanbrun (intermediaire, social, tres_social)
 * @returns Loyer mensuel estimé en euros, arrondi à l'entier
 */
export function calculerLoyerEstime(
  surface: number,
  zoneFiscale: ZoneFiscale,
  niveauLoyer: NiveauLoyerJeanbrun
): number {
  // Gestion des surfaces invalides
  if (surface <= 0) {
    return 0;
  }

  // Récupération du plafond €/m² pour la zone et le niveau
  const plafondZone = PLAFONDS_LOYERS_M2[zoneFiscale];
  const plafondM2 = plafondZone[niveauLoyer];

  // Calcul du coefficient de surface
  // Formule Loc'Avantages: coef = min(0.7 + 19/surface, 1.2)
  const coeffSurface = Math.min(
    COEFFICIENT_SURFACE.plafond,
    COEFFICIENT_SURFACE.constante + COEFFICIENT_SURFACE.facteur / surface
  );

  // Loyer mensuel = surface × plafond × coefficient
  const loyerMensuel = surface * plafondM2 * coeffSurface;

  return Math.round(loyerMensuel);
}

// ============================================
// GENERATION DE LA PROJECTION
// ============================================

/**
 * Génère la projection annuelle sur 9 ans
 *
 * @param amortissementAnnuel - Amortissement Jeanbrun annuel
 * @param tmi - Tranche marginale d'imposition (décimal)
 * @param loyerMensuel - Loyer mensuel estimé
 * @param chargesMensuelles - Charges mensuelles (copro + taxe foncière)
 * @param mensualiteCredit - Mensualité crédit (0 si pas de crédit)
 * @returns Tableau de 9 lignes de projection
 */
function genererProjection(
  amortissementAnnuel: number,
  tmi: number,
  loyerMensuel: number,
  chargesMensuelles: number,
  mensualiteCredit: number
): ProjectionAnnuelle[] {
  const projection: ProjectionAnnuelle[] = [];
  const loyerAnnuel = loyerMensuel * 12;
  const chargesAnnuelles = chargesMensuelles * 12;
  const economieAnnuelle = calculerEconomieImpot(amortissementAnnuel, tmi);

  for (let annee = 1; annee <= JEANBRUN_NEUF.dureeEngagement; annee++) {
    // Calcul du revenu imposable (simplifié)
    // En réalité, c'est loyer - charges - amortissement
    const revenuImposable = Math.max(0, loyerAnnuel - chargesAnnuelles - amortissementAnnuel);

    // Impôt dû sur ce revenu (simplifié: revenu * TMI)
    const impotDu = Math.round(revenuImposable * tmi);

    // Cash-flow net = loyers - charges - crédit + économie d'impôt (via réduction base)
    const cashflowNet = Math.round(
      loyerAnnuel - chargesAnnuelles - mensualiteCredit * 12
    );

    projection.push({
      annee,
      loyerAnnuel,
      chargesAnnuelles,
      interetsCredit: 0, // Simplifié pour le moment
      amortissement: amortissementAnnuel,
      revenuImposable,
      impotDu,
      cashflowNet,
      cumulEconomieImpots: economieAnnuelle * annee,
    });
  }

  return projection;
}

// ============================================
// RESULTAT INELIGIBLE
// ============================================

/**
 * Crée un résultat pour un bien ancien inéligible
 *
 * @param input - Input de simulation
 * @param ir - Résultat IR
 * @param tmi - Résultat TMI
 * @param jeanbrunResult - Résultat Jeanbrun avec inéligibilité
 * @returns Résultat de simulation complet avec économie nulle
 */
function createIneligibleResult(
  input: SimulationCalculInput,
  ir: IRResult,
  tmi: TMIResult,
  jeanbrunResult: JeanbrunAncienResult
): SimulationCalculResult {
  const {
    surface,
    zoneFiscale,
    niveauLoyer,
    prixAcquisition,
    loyerMensuelEstime,
    chargesCopropriete = 0,
    taxeFonciere = 0,
  } = input;

  // Estimer le loyer même si inéligible
  const loyer = loyerMensuelEstime ?? calculerLoyerEstime(surface, zoneFiscale, niveauLoyer);

  // chargesCopropriete et taxeFonciere sont des valeurs ANNUELLES
  const chargesAnnuellesTotal = chargesCopropriete + taxeFonciere;

  // Calcul des rendements même si inéligible
  const rendements = calculerRendements({
    loyerAnnuel: loyer * 12,
    prixAcquisition,
    chargesAnnuelles: chargesAnnuellesTotal,
    fraisAcquisition: prixAcquisition * FRAIS_ACQUISITION.tauxDefaut,
  });

  // Cash-flow sans économie d'impôt
  const chargesMensuelles = chargesCopropriete / 12 + taxeFonciere / 12;
  const cashflowMensuel = loyer - chargesMensuelles;
  const cashflowAnnuel = cashflowMensuel * 12;

  // Projection avec 0 économie
  const projection = genererProjection(0, tmi.tmi, loyer, chargesMensuelles, 0);

  // Économie d'impôt nulle
  const economieImpot: EconomieImpot = {
    economieAmortissement: 0,
    economieDeficit: 0,
    economieTotaleAnnuelle: 0,
    economieTotale9ans: 0,
  };

  return {
    dateCalcul: new Date().toISOString(),
    versionFormules: "2026.1",
    ir,
    tmi,
    jeanbrun: jeanbrunResult,
    economieImpot,
    rendements,
    cashflowMensuel: Math.round(cashflowMensuel),
    cashflowAnnuel: Math.round(cashflowAnnuel),
    projection,
    synthese: {
      economieImpotsAnnuelle: 0,
      economieImpots9ans: 0,
      rendementBrut: rendements.rendementBrut,
      rendementNet: rendements.rendementNet,
      rendementNetNet: rendements.rendementNetNet,
      cashflowMensuel: Math.round(cashflowMensuel),
    },
  };
}

// ============================================
// ORCHESTRATION PRINCIPALE
// ============================================

/**
 * Orchestre une simulation complète Jeanbrun
 *
 * Étapes:
 * 1. Calcul IR et TMI
 * 2. Calcul amortissement Jeanbrun (neuf ou ancien)
 * 3. Calcul économie d'impôt
 * 4. Estimation du loyer (si non fourni)
 * 5. Calcul des rendements
 * 6. Calcul crédit (si financement fourni)
 * 7. Calcul cash-flow
 * 8. Projection sur 9 ans
 * 9. Comparatif LMNP (optionnel)
 * 10. Calcul plus-value (optionnel)
 *
 * @param input - Paramètres complets de simulation
 * @returns Résultat détaillé de la simulation
 */
export function orchestrerSimulation(
  input: SimulationCalculInput
): SimulationCalculResult {
  const {
    revenuNetImposable,
    nombreParts,
    typeBien,
    prixAcquisition,
    surface,
    zoneFiscale,
    montantTravaux = 0,
    niveauLoyer,
    apportPersonnel,
    tauxCredit,
    dureeCredit,
    tauxAssurance,
    loyerMensuelEstime,
    chargesCopropriete = 0,
    taxeFonciere = 0,
    comparerLMNP: doComparerLMNP = false,
    calculerPlusValue: doPlusValue = false,
    dureeDetentionPrevue,
    prixReventeEstime,
  } = input;

  // 1. Calcul IR et TMI
  const ir = calculerIR({ revenuNetImposable, nombreParts });
  const tmi = calculerTMI({ revenuNetImposable, nombreParts });

  // 2. Calcul Jeanbrun selon type de bien
  let jeanbrun: JeanbrunNeufResult | JeanbrunAncienResult;

  if (typeBien === "neuf") {
    // Bien neuf: calcul direct
    jeanbrun = calculerJeanbrunNeuf({ prixAcquisition, niveauLoyer });
  } else {
    // Bien ancien: vérification éligibilité d'abord
    const eligibilite = verifierEligibiliteTravaux(prixAcquisition, montantTravaux);

    if (!eligibilite.eligible) {
      // Créer un résultat inéligible
      const montantManquant = eligibilite.montantManquant ?? 0;
      const jeanbrunIneligible: JeanbrunAncienResult = {
        eligible: false,
        message: `Travaux insuffisants pour le dispositif Jeanbrun Ancien. Montant minimum requis: ${eligibilite.seuilRequis.toLocaleString("fr-FR")} EUR (30% du prix d'achat). Il manque ${montantManquant.toLocaleString("fr-FR")} EUR.`,
        seuilTravauxRequis: eligibilite.seuilRequis,
        montantManquant: montantManquant,
      };

      return createIneligibleResult(input, ir, tmi, jeanbrunIneligible);
    }

    // Bien ancien éligible
    jeanbrun = calculerJeanbrunAncien({
      prixAchat: prixAcquisition,
      montantTravaux,
      niveauLoyer,
    });
  }

  // 3. Calcul économie d'impôt
  // Récupérer l'amortissement net (selon le type de résultat)
  let amortissementNet = 0;
  if ("amortissementNet" in jeanbrun && jeanbrun.amortissementNet !== undefined) {
    amortissementNet = jeanbrun.amortissementNet;
  }

  const economieAmortissement = calculerEconomieImpot(amortissementNet, tmi.tmi);

  const economieImpot: EconomieImpot = {
    economieAmortissement,
    economieDeficit: 0, // Simplifié pour le moment
    economieTotaleAnnuelle: economieAmortissement,
    economieTotale9ans: economieAmortissement * JEANBRUN_NEUF.dureeEngagement,
  };

  // 4. Estimation du loyer
  const loyer = loyerMensuelEstime ?? calculerLoyerEstime(surface, zoneFiscale, niveauLoyer);

  // 5. Calcul des rendements
  // Prix total pour l'ancien = achat + travaux
  const prixTotal = typeBien === "ancien" ? prixAcquisition + montantTravaux : prixAcquisition;
  const fraisAcquisition = prixAcquisition * FRAIS_ACQUISITION.tauxDefaut;

  // chargesCopropriete et taxeFonciere sont des valeurs ANNUELLES
  const chargesAnnuellesTotal = chargesCopropriete + taxeFonciere;

  const rendements = calculerRendements({
    loyerAnnuel: loyer * 12,
    prixAcquisition: prixTotal,
    chargesAnnuelles: chargesAnnuellesTotal,
    // Note: fraisAcquisition non inclus pour que rendementNet soit basé sur prixAcquisition seul
    fraisAcquisition: 0,
    impotsAnnuels: 0, // Simplifié
    prelevementsSociaux: 0, // Simplifié
  });

  // 6. Calcul crédit (si financement fourni)
  let credit;
  let tauxEndettement;

  if (tauxCredit !== undefined && dureeCredit !== undefined) {
    const montantEmprunt = prixAcquisition - (apportPersonnel ?? 0);

    const creditInput: Parameters<typeof calculerCredit>[0] = {
      capitalEmprunte: montantEmprunt,
      tauxAnnuel: tauxCredit,
      dureeMois: dureeCredit,
    };
    if (tauxAssurance !== undefined) {
      creditInput.tauxAssurance = tauxAssurance;
    }
    credit = calculerCredit(creditInput);

    // Calcul du taux d'endettement
    // Revenus mensuels = revenu net imposable / 12
    const revenuMensuel = revenuNetImposable / 12;

    tauxEndettement = calculerTauxEndettement(
      revenuMensuel,
      0, // Charges existantes (non spécifiées dans l'input)
      credit.mensualiteAvecAssurance
    );
  }

  // 7. Calcul cash-flow
  const chargesMensuelles = chargesCopropriete / 12 + taxeFonciere / 12;
  const mensualiteCredit = credit?.mensualiteAvecAssurance ?? 0;
  const cashflowMensuel = loyer - chargesMensuelles - mensualiteCredit;
  const cashflowAnnuel = cashflowMensuel * 12;

  // 8. Projection sur 9 ans
  const projection = genererProjection(
    amortissementNet,
    tmi.tmi,
    loyer,
    chargesMensuelles,
    mensualiteCredit
  );

  // 9. Comparatif LMNP (optionnel)
  let comparatifLMNP;

  if (doComparerLMNP) {
    // Calcul LMNP réel
    const lmnpResult = calculerLMNPReel({
      recettesAnnuelles: loyer * 12,
      chargesAnnuelles: chargesAnnuellesTotal,
      prixAcquisition: prixTotal,
      fraisNotaire: fraisAcquisition,
      montantMobilier: prixTotal * 0.1, // ~10% mobilier estimé
      typeLocation: "longue_duree",
    });

    // Économie LMNP = (recettes - bénéfice imposable) * TMI
    // Car le bénéfice imposable est réduit par les amortissements
    const economieLMNP = calculerEconomieImpot(
      loyer * 12 - lmnpResult.beneficeImposable,
      tmi.tmi
    );

    comparatifLMNP = comparerJeanbrunLMNP(
      economieAmortissement,
      economieLMNP,
      tmi.tmi
    );
  }

  // 10. Calcul plus-value (optionnel)
  let plusValue;

  if (doPlusValue && dureeDetentionPrevue !== undefined && prixReventeEstime !== undefined) {
    const plusValueInput: Parameters<typeof calculerPlusValue>[0] = {
      prixVente: prixReventeEstime,
      prixAchat: prixAcquisition,
      dureeDetention: dureeDetentionPrevue,
    };
    // Ajouter travaux si bien ancien (sinon utiliser forfait 15% si > 5 ans)
    if (typeBien === "ancien" && montantTravaux > 0) {
      plusValueInput.travaux = montantTravaux;
    }
    plusValue = calculerPlusValue(plusValueInput);
  }

  // Construction du résultat final
  const result: SimulationCalculResult = {
    dateCalcul: new Date().toISOString(),
    versionFormules: "2026.1",
    ir,
    tmi,
    jeanbrun,
    economieImpot,
    rendements,
    cashflowMensuel: Math.round(cashflowMensuel),
    cashflowAnnuel: Math.round(cashflowAnnuel),
    projection,
    synthese: {
      economieImpotsAnnuelle: economieAmortissement,
      economieImpots9ans: economieAmortissement * JEANBRUN_NEUF.dureeEngagement,
      rendementBrut: rendements.rendementBrut,
      rendementNet: rendements.rendementNet,
      rendementNetNet: rendements.rendementNetNet,
      cashflowMensuel: Math.round(cashflowMensuel),
    },
  };

  // Ajouter les champs optionnels
  if (credit !== undefined) {
    result.credit = credit;
  }

  if (tauxEndettement !== undefined) {
    result.tauxEndettement = tauxEndettement;
  }

  if (comparatifLMNP !== undefined) {
    result.comparatifLMNP = comparatifLMNP;
  }

  if (plusValue !== undefined) {
    result.plusValue = plusValue;
  }

  return result;
}
