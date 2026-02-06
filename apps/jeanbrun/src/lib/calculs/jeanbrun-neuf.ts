/**
 * Module de calcul Jeanbrun NEUF
 *
 * Implements:
 * - calculerJeanbrunNeuf: Calcul de l'amortissement annuel pour bien neuf
 * - tableauAmortissementNeuf: Tableau d'amortissement sur 9 ans
 *
 * Parametres:
 * - Base amortissement: 80% du prix d'acquisition (terrain exclu)
 * - Duree engagement: 9 ans obligatoire
 * - Niveaux de loyer:
 *   - Intermediaire: 3.5%, plafond 8 000 EUR/an
 *   - Social: 4.5%, plafond 10 000 EUR/an
 *   - Tres social: 5.5%, plafond 12 000 EUR/an
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { JEANBRUN_NEUF } from "./constants";
import type {
  JeanbrunNeufInput,
  JeanbrunNeufResult,
  LigneAmortissementJeanbrun,
} from "./types/jeanbrun";

/**
 * Calcule l'amortissement Jeanbrun pour un bien NEUF
 *
 * Formule:
 * 1. Base = prixAcquisition * 0.8 (80% hors terrain)
 * 2. Amortissement brut = base * taux du niveau
 * 3. Amortissement net = min(brut, plafond du niveau)
 *
 * @param input - Prix d'acquisition et niveau de loyer
 * @returns Resultat detaille avec base, brut, net, plafond
 */
export function calculerJeanbrunNeuf(
  input: JeanbrunNeufInput
): JeanbrunNeufResult {
  const { prixAcquisition, niveauLoyer } = input;

  // Gestion des prix negatifs ou nuls
  if (prixAcquisition <= 0) {
    const niveau = JEANBRUN_NEUF.niveaux[niveauLoyer];
    return {
      baseAmortissement: 0,
      amortissementBrut: 0,
      amortissementNet: 0,
      plafondApplique: false,
      plafond: niveau.plafond,
      taux: niveau.taux,
    };
  }

  // Recuperation des parametres du niveau
  const niveau = JEANBRUN_NEUF.niveaux[niveauLoyer];
  const { taux, plafond } = niveau;

  // Calcul de la base d'amortissement (80% du prix)
  const baseAmortissement = Math.round(
    prixAcquisition * JEANBRUN_NEUF.baseAmortissement
  );

  // Calcul de l'amortissement brut
  const amortissementBrut = Math.round(baseAmortissement * taux);

  // Application du plafond
  const plafondApplique = amortissementBrut > plafond;
  const amortissementNet = plafondApplique ? plafond : amortissementBrut;

  return {
    baseAmortissement,
    amortissementBrut,
    amortissementNet,
    plafondApplique,
    plafond,
    taux,
  };
}

/**
 * Genere le tableau d'amortissement sur 9 ans pour un bien neuf
 *
 * @param input - Prix d'acquisition et niveau de loyer
 * @returns Tableau de 9 lignes avec annee, amortissement et cumul
 */
export function tableauAmortissementNeuf(
  input: JeanbrunNeufInput
): LigneAmortissementJeanbrun[] {
  // Calcul de l'amortissement annuel
  const result = calculerJeanbrunNeuf(input);
  const amortissementAnnuel = result.amortissementNet;

  // Generation du tableau sur 9 ans
  const tableau: LigneAmortissementJeanbrun[] = [];

  for (let annee = 1; annee <= JEANBRUN_NEUF.dureeEngagement; annee++) {
    tableau.push({
      annee,
      amortissement: amortissementAnnuel,
      cumul: amortissementAnnuel * annee,
    });
  }

  return tableau;
}
