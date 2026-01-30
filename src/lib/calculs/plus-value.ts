/**
 * Module de calcul de la plus-value immobiliere
 *
 * Calcule l'imposition sur la plus-value de cession immobiliere:
 * - Impot sur le revenu (IR) au taux de 19%
 * - Prelevements sociaux (PS) au taux de 17.2%
 * - Surtaxe pour les plus-values elevees (> 50 000 euros)
 *
 * Abattements pour duree de detention:
 * - IR: exoneration totale apres 22 ans
 * - PS: exoneration totale apres 30 ans
 *
 * @see https://www.impots.gouv.fr/particulier/plus-values-immobilieres
 * @version 1.0
 * @date 30 janvier 2026
 */

import {
  TAUX_PLUS_VALUE,
  ABATTEMENT_DUREE_DETENTION_IR,
  ABATTEMENT_DUREE_DETENTION_PS,
  SURTAXE_PLUS_VALUE,
} from "./constants";
import type { PlusValueInput, PlusValueResult } from "./types/plus-value";

// ============================================
// FORFAITS LEGAUX
// ============================================

/**
 * Forfait pour frais d'acquisition si non declares (7.5% du prix d'achat)
 * Comprend: frais de notaire, droits d'enregistrement, etc.
 */
const FORFAIT_FRAIS_ACQUISITION = 0.075;

/**
 * Forfait pour travaux si detention > 5 ans et travaux non declares (15% du prix d'achat)
 */
const FORFAIT_TRAVAUX = 0.15;

/**
 * Seuil de detention pour appliquer le forfait travaux (5 ans)
 */
const SEUIL_DETENTION_FORFAIT_TRAVAUX = 5;

// ============================================
// FONCTIONS D'ABATTEMENT
// ============================================

/**
 * Calcule l'abattement pour duree de detention sur l'IR
 *
 * Regles:
 * - < 6 ans: 0%
 * - 6 a 21 ans: 6% par an
 * - 22 ans: 4% supplementaire (total 100%)
 * - > 22 ans: 100% (exoneration totale)
 *
 * @param anneesDetention - Nombre d'annees de detention du bien
 * @returns Taux d'abattement (0 a 1)
 */
export function calculerAbattementIR(anneesDetention: number): number {
  const { seuilDebut, seuilExoneration, tauxAnnuel } =
    ABATTEMENT_DUREE_DETENTION_IR;

  // Avant le seuil de debut (6 ans), pas d'abattement
  if (anneesDetention < seuilDebut) {
    return 0;
  }

  // Apres 22 ans, exoneration totale
  if (anneesDetention >= seuilExoneration) {
    return 1;
  }

  // Entre 6 et 21 ans: 6% par annee
  // La 6eme annee compte comme la premiere annee d'abattement
  const anneesAbattement = anneesDetention - seuilDebut + 1;

  // A la 22eme annee (seuilExoneration), on ajoute 4%
  if (anneesDetention === seuilExoneration - 1) {
    // 21 ans: 16 annees * 6% = 96%
    return anneesAbattement * tauxAnnuel;
  }

  return anneesAbattement * tauxAnnuel;
}

/**
 * Calcule l'abattement pour duree de detention sur les PS
 *
 * Regles:
 * - < 6 ans: 0%
 * - 6 a 21 ans: 1.65% par an
 * - 22eme annee: 1.6% supplementaire
 * - 23 a 30 ans: 9% par an
 * - > 30 ans: 100% (exoneration totale)
 *
 * @param anneesDetention - Nombre d'annees de detention du bien
 * @returns Taux d'abattement (0 a 1)
 */
export function calculerAbattementPS(anneesDetention: number): number {
  const { seuilDebut, seuilExoneration, tauxPhase1, tauxAnnee22, tauxPhase2 } =
    ABATTEMENT_DUREE_DETENTION_PS;

  // Avant le seuil de debut (6 ans), pas d'abattement
  if (anneesDetention < seuilDebut) {
    return 0;
  }

  // Apres 30 ans, exoneration totale
  if (anneesDetention >= seuilExoneration) {
    return 1;
  }

  // Phase 1: 6 a 21 ans (1.65% par an)
  // La 6eme annee compte comme la premiere annee d'abattement
  const anneesPhase1 = Math.min(anneesDetention, 21) - seuilDebut + 1;
  let abattement = anneesPhase1 * tauxPhase1;

  // 22eme annee: 1.6% supplementaire
  if (anneesDetention >= 22) {
    abattement += tauxAnnee22;
  }

  // Phase 2: 23 a 30 ans (9% par an)
  if (anneesDetention >= 23) {
    const anneesPhase2 = Math.min(anneesDetention, seuilExoneration) - 22;
    abattement += anneesPhase2 * tauxPhase2;
  }

  return Math.min(abattement, 1);
}

// ============================================
// CALCUL DE LA SURTAXE
// ============================================

/**
 * Calcule la surtaxe sur les plus-values elevees
 *
 * La surtaxe s'applique aux plus-values imposables a l'IR > 50 000 euros
 * Bareme progressif de 2% a 6% selon tranches
 *
 * @param pvImposableIR - Plus-value imposable a l'IR apres abattement
 * @returns Montant de la surtaxe en euros
 */
export function calculerSurtaxe(pvImposableIR: number): number {
  // Pas de surtaxe si PV <= 50 000 euros
  if (pvImposableIR <= 50000) {
    return 0;
  }

  // Trouver la tranche applicable
  // Note: La derniere tranche a max=Infinity, donc on trouvera toujours une correspondance
  for (const tranche of SURTAXE_PLUS_VALUE) {
    if (pvImposableIR > tranche.min && pvImposableIR <= tranche.max) {
      return tranche.calcul(pvImposableIR);
    }
  }

  // Fallback theorique (ne devrait jamais etre atteint avec le bareme actuel)
  return 0;
}

// ============================================
// CALCUL COMPLET DE LA PLUS-VALUE
// ============================================

/**
 * Calcule la plus-value immobiliere complete
 *
 * Etapes de calcul:
 * 1. Determiner le prix d'acquisition majore (frais + travaux)
 * 2. Calculer la plus-value brute
 * 3. Appliquer les abattements pour duree de detention
 * 4. Calculer l'impot IR (19%) et PS (17.2%)
 * 5. Calculer la surtaxe si applicable
 *
 * @param input - Donnees de la transaction
 * @returns Resultat complet du calcul de plus-value
 */
export function calculerPlusValue(input: PlusValueInput): PlusValueResult {
  const {
    prixVente,
    prixAchat,
    fraisAcquisition,
    travaux,
    fraisVente,
    dureeDetention,
  } = input;

  // 1. Calculer le prix d'acquisition majore
  // Frais d'acquisition: reels ou forfait 7.5%
  const fraisAcquisitionEffectifs =
    fraisAcquisition !== undefined && fraisAcquisition >= 0
      ? fraisAcquisition
      : prixAchat * FORFAIT_FRAIS_ACQUISITION;

  // Travaux: reels ou forfait 15% si detention > 5 ans
  let travauxEffectifs = 0;
  if (travaux !== undefined && travaux >= 0) {
    travauxEffectifs = travaux;
  } else if (dureeDetention > SEUIL_DETENTION_FORFAIT_TRAVAUX) {
    travauxEffectifs = prixAchat * FORFAIT_TRAVAUX;
  }

  const prixAcquisitionMajore =
    prixAchat + fraisAcquisitionEffectifs + travauxEffectifs;

  // Prix de vente net (moins frais de vente si declares)
  const prixVenteNet = prixVente - (fraisVente ?? 0);

  // 2. Calculer la plus-value brute
  const plusValueBrute = Math.max(0, prixVenteNet - prixAcquisitionMajore);

  // Cas de moins-value ou plus-value nulle
  if (plusValueBrute === 0) {
    return {
      plusValueBrute: 0,
      abattementIR: 0,
      abattementPS: 0,
      pvImposableIR: 0,
      pvImposablePS: 0,
      impotIR: 0,
      impotPS: 0,
      surtaxe: 0,
      impotTotal: 0,
      tauxEffectif: 0,
      exonere: true,
      motifExoneration: "Moins-value ou plus-value nulle",
    };
  }

  // 3. Calculer les abattements
  const abattementIR = calculerAbattementIR(dureeDetention);
  const abattementPS = calculerAbattementPS(dureeDetention);

  // 4. Calculer les plus-values imposables
  const pvImposableIR = plusValueBrute * (1 - abattementIR);
  const pvImposablePS = plusValueBrute * (1 - abattementPS);

  // Verifier l'exoneration totale (30 ans)
  if (abattementIR === 1 && abattementPS === 1) {
    return {
      plusValueBrute,
      abattementIR,
      abattementPS,
      pvImposableIR: 0,
      pvImposablePS: 0,
      impotIR: 0,
      impotPS: 0,
      surtaxe: 0,
      impotTotal: 0,
      tauxEffectif: 0,
      exonere: true,
      motifExoneration: "Detention superieure ou egale a 30 ans",
    };
  }

  // 5. Calculer les impots
  const impotIR = pvImposableIR * TAUX_PLUS_VALUE.ir;
  const impotPS = pvImposablePS * TAUX_PLUS_VALUE.ps;

  // 6. Calculer la surtaxe (sur PV imposable IR)
  const surtaxe = calculerSurtaxe(pvImposableIR);

  // 7. Calculer l'impot total
  const impotTotal = impotIR + impotPS + surtaxe;

  // 8. Calculer le taux effectif
  const tauxEffectif = plusValueBrute > 0 ? impotTotal / plusValueBrute : 0;

  return {
    plusValueBrute,
    abattementIR,
    abattementPS,
    pvImposableIR,
    pvImposablePS,
    impotIR,
    impotPS,
    surtaxe,
    impotTotal,
    tauxEffectif,
    exonere: false,
  };
}
