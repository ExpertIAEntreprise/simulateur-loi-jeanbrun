/**
 * Module de calcul des rendements immobiliers
 *
 * Calcule les trois types de rendements pour un investissement immobilier:
 * - Rendement brut: loyers / prix d'acquisition
 * - Rendement net: (loyers - charges) / investissement total
 * - Rendement net-net: (loyers - charges - impots - PS) / investissement total
 *
 * @see docs/technical/FORMULES.md section 9
 * @version 1.0
 * @date 30 janvier 2026
 */

import type { RendementsInput, RendementsResult } from "./types/rendements";

/**
 * Arrondit un nombre a 2 decimales
 * Utilise Math.round pour un arrondi standard (0.5 -> 1)
 *
 * @param value - Valeur a arrondir
 * @returns Valeur arrondie a 2 decimales
 */
function arrondir2Decimales(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calcule les trois types de rendements immobiliers
 *
 * Formules:
 * - Rendement brut = (loyerAnnuel / prixAcquisition) * 100
 * - Rendement net = ((loyerAnnuel - chargesAnnuelles) / investissementTotal) * 100
 * - Rendement net-net = ((loyerAnnuel - chargesAnnuelles - impotsAnnuels - prelevementsSociaux) / investissementTotal) * 100
 *
 * @param input - Donnees d'entree pour le calcul
 * @returns Les trois rendements en pourcentage, arrondis a 2 decimales
 *
 * @example
 * ```typescript
 * const result = calculerRendements({
 *   loyerAnnuel: 9600,
 *   prixAcquisition: 200000,
 *   chargesAnnuelles: 1200,
 *   fraisAcquisition: 16000,
 *   impotsAnnuels: 2520,
 *   prelevementsSociaux: 1445
 * });
 * // result.rendementBrut = 4.8
 * // result.rendementNet = 3.89
 * // result.rendementNetNet = 2.05
 * ```
 */
export function calculerRendements(input: RendementsInput): RendementsResult {
  const {
    loyerAnnuel,
    prixAcquisition,
    chargesAnnuelles = 0,
    fraisAcquisition = 0,
    impotsAnnuels = 0,
    prelevementsSociaux = 0,
  } = input;

  // Protection contre division par zero
  if (prixAcquisition <= 0) {
    return {
      rendementBrut: 0,
      rendementNet: 0,
      rendementNetNet: 0,
    };
  }

  // Calcul de l'investissement total (prix + frais d'acquisition)
  const investissementTotal = prixAcquisition + fraisAcquisition;

  // Protection contre investissement total = 0 (cas theorique)
  if (investissementTotal <= 0) {
    return {
      rendementBrut: 0,
      rendementNet: 0,
      rendementNetNet: 0,
    };
  }

  // Rendement brut = loyers / prix d'acquisition
  // Formule: rendementBrut = (loyerAnnuel / prixAcquisition) * 100
  const rendementBrut = arrondir2Decimales(
    (loyerAnnuel / prixAcquisition) * 100
  );

  // Rendement net = (loyers - charges) / investissement total
  // Formule: rendementNet = ((loyerAnnuel - chargesAnnuelles) / investissementTotal) * 100
  const loyerNet = loyerAnnuel - chargesAnnuelles;
  const rendementNet = arrondir2Decimales(
    (loyerNet / investissementTotal) * 100
  );

  // Rendement net-net = (loyers - charges - impots - PS) / investissement total
  // Formule: rendementNetNet = ((loyerAnnuel - chargesAnnuelles - impotsAnnuels - prelevementsSociaux) / investissementTotal) * 100
  const loyerNetNet =
    loyerAnnuel - chargesAnnuelles - impotsAnnuels - prelevementsSociaux;
  const rendementNetNet = arrondir2Decimales(
    (loyerNetNet / investissementTotal) * 100
  );

  return {
    rendementBrut,
    rendementNet,
    rendementNetNet,
  };
}
