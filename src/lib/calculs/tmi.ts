/**
 * Module de calcul de la TMI (Tranche Marginale d'Imposition)
 *
 * Fournit des informations detaillees sur la tranche d'imposition
 * et permet de calculer les economies d'impot liees aux deductions.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { TRANCHES_IR_2026 } from "./constants";
import type { TMIInput, TMIResult, TrancheIR } from "./types";

/**
 * Calcule les informations detaillees sur la tranche marginale d'imposition
 *
 * @param input - Parametres de calcul (revenu, parts)
 * @returns Resultat detaille avec TMI, numero de tranche, seuils et marge
 */
export function calculerTMI(input: TMIInput): TMIResult {
  const { revenuNetImposable, nombreParts } = input;

  // Gestion des revenus negatifs ou nuls
  const quotientFamilial = revenuNetImposable > 0 ? revenuNetImposable / nombreParts : 0;

  // Recherche de la tranche applicable
  let trancheIndex = 0;
  // Utiliser le type TrancheIR pour permettre la reassignation
  let trancheTrouvee: TrancheIR = { ...TRANCHES_IR_2026[0] };

  for (let i = 0; i < TRANCHES_IR_2026.length; i++) {
    const tranche = TRANCHES_IR_2026[i];
    if (tranche === undefined) continue;

    if (quotientFamilial <= tranche.max) {
      trancheIndex = i;
      trancheTrouvee = { min: tranche.min, max: tranche.max, taux: tranche.taux };
      break;
    }
    // Si on arrive a la derniere tranche, on la garde
    trancheIndex = i;
    trancheTrouvee = { min: tranche.min, max: tranche.max, taux: tranche.taux };
  }

  // Calcul de la marge avant passage a la tranche superieure
  // Marge = (seuilHaut - quotientFamilial) * nombreParts
  let marge: number;
  if (trancheTrouvee.max === Infinity) {
    marge = Infinity;
  } else if (quotientFamilial <= trancheTrouvee.min) {
    // Si on est en dessous du seuil bas, la marge est la distance au seuil haut
    marge = (trancheTrouvee.max - quotientFamilial) * nombreParts;
  } else {
    marge = (trancheTrouvee.max - quotientFamilial) * nombreParts;
  }

  // Arrondi de la marge a l'euro
  if (marge !== Infinity) {
    marge = Math.round(marge);
  }

  return {
    tmi: trancheTrouvee.taux,
    numeroTranche: trancheIndex + 1,
    seuilBas: trancheTrouvee.min,
    seuilHaut: trancheTrouvee.max,
    marge,
  };
}

/**
 * Calcule l'economie d'impot generee par une deduction fiscale
 *
 * L'economie est directement proportionnelle a la TMI:
 * economie = deduction * tmi
 *
 * @param deduction - Montant de la deduction en euros
 * @param tmi - Tranche marginale d'imposition (taux decimal)
 * @returns Economie d'impot en euros, arrondie a l'euro
 */
export function calculerEconomieImpot(deduction: number, tmi: number): number {
  return Math.round(deduction * tmi);
}
