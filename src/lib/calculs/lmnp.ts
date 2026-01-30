/**
 * Module de calcul LMNP (Location Meublee Non Professionnelle)
 *
 * Deux regimes disponibles:
 * - Micro-BIC: abattement forfaitaire (plafonds et taux selon type de location)
 * - Reel: deduction des charges et amortissements par composants
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import {
  LMNP_MICRO_BIC,
  LMNP_COMPOSANTS,
  LMNP_REPARTITION_TYPE,
} from "./constants";
import type {
  LMNPInput,
  LMNPResult,
  TypeLocationLMNP,
  ComparatifJeanbrunLMNP,
} from "./types";

// ============================================
// REGIME MICRO-BIC
// ============================================

/**
 * Calcule le resultat LMNP en regime Micro-BIC
 *
 * @param recettes - Recettes annuelles en euros
 * @param typeLocation - Type de location (longue_duree, tourisme_classe, tourisme_non_classe, chambres_hotes)
 * @returns Resultat LMNP avec benefice imposable apres abattement
 *
 * @example
 * ```typescript
 * const result = calculerLMNPMicroBIC(10000, "longue_duree");
 * // result.beneficeImposable = 5000 (50% abattement)
 * ```
 */
export function calculerLMNPMicroBIC(
  recettes: number,
  typeLocation: TypeLocationLMNP
): LMNPResult {
  // Gestion des cas limites
  if (recettes <= 0) {
    return {
      regime: "micro",
      recettes: 0,
      beneficeImposable: 0,
    };
  }

  const parametres = LMNP_MICRO_BIC[typeLocation];

  // Verification eligibilite (recettes <= plafond)
  if (recettes > parametres.plafond) {
    return {
      regime: "micro",
      recettes: recettes,
      beneficeImposable: 0, // Ineligible
    };
  }

  // Calcul du benefice imposable apres abattement
  const abattement = parametres.abattement;
  const beneficeImposable = Math.round(recettes * (1 - abattement));

  return {
    regime: "micro",
    recettes: recettes,
    beneficeImposable: beneficeImposable,
  };
}

// ============================================
// REGIME REEL
// ============================================

/**
 * Calcule l'amortissement annuel par composants
 *
 * @param prixBase - Prix de base du bien (acquisition + frais eventuels)
 * @param montantMobilier - Montant du mobilier si specifie separement
 * @returns Objet avec le total et le detail par composant
 */
function calculerAmortissementParComposants(
  prixBase: number,
  montantMobilier?: number
): {
  total: number;
  detail: Record<string, { valeur: number; amortissement: number }>;
} {
  if (prixBase <= 0) {
    return {
      total: 0,
      detail: {},
    };
  }

  const detail: Record<string, { valeur: number; amortissement: number }> = {};
  let totalAmortissement = 0;

  // Si mobilier specifie, on le retire de la base immobiliere
  const baseImmobiliere = prixBase;
  let mobilierEffectif = 0;

  if (montantMobilier && montantMobilier > 0) {
    mobilierEffectif = montantMobilier;
    // Le mobilier est traite separement, on utilise la repartition sans mobilier
    // On recalcule les pourcentages sans mobilier (normaliser sur 95%)
    const facteurNormalisation = 1 / (1 - LMNP_REPARTITION_TYPE.mobilier);

    // Terrain
    const valeurTerrain =
      baseImmobiliere * LMNP_REPARTITION_TYPE.terrain * facteurNormalisation;
    detail["terrain"] = {
      valeur: Math.round(valeurTerrain),
      amortissement: 0, // Terrain non amortissable
    };

    // Gros oeuvre
    const valeurGrosOeuvre =
      baseImmobiliere *
      LMNP_REPARTITION_TYPE.gros_oeuvre *
      facteurNormalisation;
    const amortGrosOeuvre = valeurGrosOeuvre * LMNP_COMPOSANTS.gros_oeuvre.taux;
    detail["gros_oeuvre"] = {
      valeur: Math.round(valeurGrosOeuvre),
      amortissement: Math.round(amortGrosOeuvre),
    };
    totalAmortissement += amortGrosOeuvre;

    // Facade
    const valeurFacade =
      baseImmobiliere * LMNP_REPARTITION_TYPE.facade * facteurNormalisation;
    const amortFacade = valeurFacade * LMNP_COMPOSANTS.facade.taux;
    detail["facade"] = {
      valeur: Math.round(valeurFacade),
      amortissement: Math.round(amortFacade),
    };
    totalAmortissement += amortFacade;

    // Equipements
    const valeurEquipements =
      baseImmobiliere *
      LMNP_REPARTITION_TYPE.equipements *
      facteurNormalisation;
    const amortEquipements =
      valeurEquipements * LMNP_COMPOSANTS.equipements.taux;
    detail["equipements"] = {
      valeur: Math.round(valeurEquipements),
      amortissement: Math.round(amortEquipements),
    };
    totalAmortissement += amortEquipements;

    // Agencements
    const valeurAgencements =
      baseImmobiliere *
      LMNP_REPARTITION_TYPE.agencements *
      facteurNormalisation;
    const amortAgencements =
      valeurAgencements * LMNP_COMPOSANTS.agencements.taux;
    detail["agencements"] = {
      valeur: Math.round(valeurAgencements),
      amortissement: Math.round(amortAgencements),
    };
    totalAmortissement += amortAgencements;

    // Mobilier (specifie separement)
    const amortMobilier = mobilierEffectif * LMNP_COMPOSANTS.mobilier.taux;
    detail["mobilier"] = {
      valeur: mobilierEffectif,
      amortissement: Math.round(amortMobilier),
    };
    totalAmortissement += amortMobilier;
  } else {
    // Repartition standard incluant mobilier
    // Terrain (15%)
    const valeurTerrain = baseImmobiliere * LMNP_REPARTITION_TYPE.terrain;
    detail["terrain"] = {
      valeur: Math.round(valeurTerrain),
      amortissement: 0, // Terrain non amortissable
    };

    // Gros oeuvre (50%)
    const valeurGrosOeuvre =
      baseImmobiliere * LMNP_REPARTITION_TYPE.gros_oeuvre;
    const amortGrosOeuvre = valeurGrosOeuvre * LMNP_COMPOSANTS.gros_oeuvre.taux;
    detail["gros_oeuvre"] = {
      valeur: Math.round(valeurGrosOeuvre),
      amortissement: Math.round(amortGrosOeuvre),
    };
    totalAmortissement += amortGrosOeuvre;

    // Facade (10%)
    const valeurFacade = baseImmobiliere * LMNP_REPARTITION_TYPE.facade;
    const amortFacade = valeurFacade * LMNP_COMPOSANTS.facade.taux;
    detail["facade"] = {
      valeur: Math.round(valeurFacade),
      amortissement: Math.round(amortFacade),
    };
    totalAmortissement += amortFacade;

    // Equipements (10%)
    const valeurEquipements =
      baseImmobiliere * LMNP_REPARTITION_TYPE.equipements;
    const amortEquipements =
      valeurEquipements * LMNP_COMPOSANTS.equipements.taux;
    detail["equipements"] = {
      valeur: Math.round(valeurEquipements),
      amortissement: Math.round(amortEquipements),
    };
    totalAmortissement += amortEquipements;

    // Agencements (10%)
    const valeurAgencements =
      baseImmobiliere * LMNP_REPARTITION_TYPE.agencements;
    const amortAgencements =
      valeurAgencements * LMNP_COMPOSANTS.agencements.taux;
    detail["agencements"] = {
      valeur: Math.round(valeurAgencements),
      amortissement: Math.round(amortAgencements),
    };
    totalAmortissement += amortAgencements;

    // Mobilier (5%)
    const valeurMobilier = baseImmobiliere * LMNP_REPARTITION_TYPE.mobilier;
    const amortMobilier = valeurMobilier * LMNP_COMPOSANTS.mobilier.taux;
    detail["mobilier"] = {
      valeur: Math.round(valeurMobilier),
      amortissement: Math.round(amortMobilier),
    };
    totalAmortissement += amortMobilier;
  }

  return {
    total: Math.round(totalAmortissement),
    detail: detail,
  };
}

/**
 * Calcule le resultat LMNP en regime reel
 *
 * @param input - Parametres LMNP (recettes, charges, prix acquisition, etc.)
 * @returns Resultat LMNP avec detail des amortissements
 *
 * @example
 * ```typescript
 * const result = calculerLMNPReel({
 *   recettesAnnuelles: 12000,
 *   chargesAnnuelles: 2000,
 *   prixAcquisition: 200000,
 *   typeLocation: "longue_duree"
 * });
 * // result.amortissementAnnuel ~ 7063
 * // result.beneficeImposable = max(0, 12000 - 2000 - 7063)
 * ```
 */
export function calculerLMNPReel(input: LMNPInput): LMNPResult {
  const { recettesAnnuelles, chargesAnnuelles, prixAcquisition, fraisNotaire, montantMobilier } =
    input;

  // Cas particulier: prix d'acquisition nul
  if (prixAcquisition <= 0) {
    const resultatSansAmortissement = recettesAnnuelles - chargesAnnuelles;
    const result: LMNPResult = {
      regime: "reel",
      recettes: recettesAnnuelles,
      beneficeImposable: Math.max(0, resultatSansAmortissement),
      amortissementAnnuel: 0,
    };
    if (resultatSansAmortissement < 0) {
      result.deficitReportable = Math.abs(resultatSansAmortissement);
    }
    return result;
  }

  // Base d'amortissement = prix acquisition + frais notaire
  const baseAmortissement = prixAcquisition + (fraisNotaire ?? 0);

  // Calcul des amortissements par composants
  const { total: amortissementTheorique, detail } =
    calculerAmortissementParComposants(baseAmortissement, montantMobilier);

  // Resultat avant amortissement (charges hors amortissement)
  const resultatAvantAmortissement = recettesAnnuelles - chargesAnnuelles;

  // Deficit charges (si charges > recettes, hors amortissement)
  let deficitReportable: number | undefined;
  if (resultatAvantAmortissement < 0) {
    deficitReportable = Math.abs(resultatAvantAmortissement);
  }

  // L'amortissement ne peut pas creer de deficit
  // Il est limite au resultat positif avant amortissement
  const amortissementEffectif =
    resultatAvantAmortissement > 0
      ? Math.min(amortissementTheorique, resultatAvantAmortissement)
      : 0;

  // Benefice imposable = resultat avant amortissement - amortissement effectif
  const beneficeImposable =
    resultatAvantAmortissement > 0
      ? Math.max(0, resultatAvantAmortissement - amortissementEffectif)
      : 0;

  const result: LMNPResult = {
    regime: "reel",
    recettes: recettesAnnuelles,
    beneficeImposable: beneficeImposable,
    amortissementAnnuel: amortissementTheorique,
    detailAmortissements: detail,
  };
  if (deficitReportable !== undefined) {
    result.deficitReportable = deficitReportable;
  }
  return result;
}

// ============================================
// CHOIX AUTOMATIQUE DU REGIME
// ============================================

/**
 * Calcule le resultat LMNP avec choix automatique du meilleur regime
 *
 * Compare le regime micro-BIC et le regime reel, et retourne celui
 * qui donne le benefice imposable le plus bas.
 *
 * @param input - Parametres LMNP
 * @returns Resultat LMNP avec le regime le plus avantageux
 *
 * @example
 * ```typescript
 * const result = calculerLMNP({
 *   recettesAnnuelles: 15000,
 *   chargesAnnuelles: 5000,
 *   prixAcquisition: 300000,
 *   typeLocation: "longue_duree"
 * });
 * // Choisit automatiquement micro ou reel selon avantage
 * ```
 */
export function calculerLMNP(input: LMNPInput): LMNPResult {
  const { recettesAnnuelles, typeLocation } = input;

  // Calculer le micro-BIC
  const resultMicro = calculerLMNPMicroBIC(recettesAnnuelles, typeLocation);

  // Verifier eligibilite micro-BIC (beneficeImposable = 0 si ineligible)
  const microIneligible = recettesAnnuelles > 0 && resultMicro.beneficeImposable === 0;

  // Calculer le regime reel
  const resultReel = calculerLMNPReel(input);

  // Si ineligible au micro-BIC, forcer le reel
  if (microIneligible) {
    return resultReel;
  }

  // Comparer les deux regimes et choisir le plus avantageux
  // (benefice imposable le plus bas)
  if (resultMicro.beneficeImposable <= resultReel.beneficeImposable) {
    return resultMicro;
  } else {
    return resultReel;
  }
}

// ============================================
// COMPARATIF JEANBRUN VS LMNP
// ============================================

/**
 * Compare les economies d'impot entre Jeanbrun et LMNP sur 9 ans
 *
 * @param economieJeanbrun - Economie annuelle Jeanbrun en euros
 * @param economieLMNP - Economie annuelle LMNP en euros
 * @param tmi - Taux marginal d'imposition (decimal, ex: 0.30 pour 30%)
 * @returns Comparatif avec recommandation et justification
 *
 * @example
 * ```typescript
 * const comparatif = comparerJeanbrunLMNP(5000, 3000, 0.30);
 * // comparatif.recommandation = "jeanbrun"
 * // comparatif.difference = 2000
 * ```
 */
export function comparerJeanbrunLMNP(
  economieJeanbrun: number,
  economieLMNP: number,
  tmi: number
): ComparatifJeanbrunLMNP {
  const DUREE_ENGAGEMENT = 9; // Jeanbrun = 9 ans
  const SEUIL_EQUIVALENT = 500; // Ecart < 500 EUR = equivalent

  // Calcul des economies sur 9 ans
  const economie9ansJeanbrun = economieJeanbrun * DUREE_ENGAGEMENT;
  const economie9ansLMNP = economieLMNP * DUREE_ENGAGEMENT;

  // Difference (positif = Jeanbrun meilleur)
  const difference = economieJeanbrun - economieLMNP;

  // Determination de la recommandation
  let recommandation: "jeanbrun" | "lmnp" | "equivalent";
  let justification: string;

  const tmiPourcent = Math.round(tmi * 100);

  if (Math.abs(difference) < SEUIL_EQUIVALENT) {
    recommandation = "equivalent";
    justification = `Avec une TMI de ${tmiPourcent}%, les deux dispositifs offrent des economies quasi identiques (ecart de ${Math.abs(difference)} EUR/an). Le choix peut se faire sur d'autres criteres: flexibilite (LMNP) vs stabilite (Jeanbrun).`;
  } else if (difference > 0) {
    recommandation = "jeanbrun";
    justification = `Avec une TMI de ${tmiPourcent}%, le dispositif Jeanbrun est plus avantageux (${economieJeanbrun} EUR/an vs ${economieLMNP} EUR/an pour LMNP). Sur 9 ans, cela represente une economie supplementaire de ${difference * DUREE_ENGAGEMENT} EUR.`;
  } else {
    recommandation = "lmnp";
    justification = `Avec une TMI de ${tmiPourcent}%, le LMNP reel est plus avantageux (${economieLMNP} EUR/an vs ${economieJeanbrun} EUR/an pour Jeanbrun). Sur 9 ans, cela represente une economie supplementaire de ${Math.abs(difference) * DUREE_ENGAGEMENT} EUR.`;
  }

  return {
    jeanbrun: {
      economieAnnuelle: economieJeanbrun,
      economie9ans: economie9ansJeanbrun,
    },
    lmnpReel: {
      economieAnnuelle: economieLMNP,
      economie9ans: economie9ansLMNP,
    },
    difference: difference,
    recommandation: recommandation,
    justification: justification,
  };
}
