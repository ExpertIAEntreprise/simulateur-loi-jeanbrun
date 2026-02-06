/**
 * Module de calcul de l'Impot sur le Revenu (IR)
 *
 * Implements:
 * - calculerImpotSansQF: Calcul progressif par tranches pour 1 part
 * - determinerTMI: Determination de la tranche marginale d'imposition
 * - calculerIR: Calcul complet IR avec quotient familial, plafonnement et decote
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import {
  TRANCHES_IR_2026,
  PLAFOND_QUOTIENT_FAMILIAL,
  DECOTE_2026,
} from "./constants";
import type { IRInput, IRResult } from "./types/ir";

/**
 * Calcule l'impot sur le revenu pour 1 part (sans quotient familial)
 * Utilise le bareme progressif par tranches
 *
 * @param revenu - Revenu net imposable en euros
 * @returns Impot calcule, arrondi a l'euro
 */
export function calculerImpotSansQF(revenu: number): number {
  // Revenus negatifs ou nuls = pas d'impot
  if (revenu <= 0) {
    return 0;
  }

  let impot = 0;

  for (const tranche of TRANCHES_IR_2026) {
    if (revenu <= tranche.min) {
      // Revenu en dessous de cette tranche, on a fini
      break;
    }

    // Calcul de la part du revenu dans cette tranche
    const revenuDansTranche = Math.min(revenu, tranche.max) - tranche.min;

    // Ajout de l'impot pour cette tranche
    impot += revenuDansTranche * tranche.taux;
  }

  return Math.round(impot);
}

/**
 * Determine la tranche marginale d'imposition
 *
 * @param revenu - Revenu net imposable en euros
 * @param parts - Nombre de parts fiscales
 * @returns Taux de la tranche marginale (0, 0.11, 0.30, 0.41, 0.45)
 */
export function determinerTMI(revenu: number, parts: number): number {
  // Revenus negatifs ou nuls = tranche 0%
  if (revenu <= 0) {
    return 0;
  }

  // Calcul du quotient familial
  const quotientFamilial = revenu / parts;

  // Recherche de la tranche applicable
  for (const tranche of TRANCHES_IR_2026) {
    if (quotientFamilial <= tranche.max) {
      return tranche.taux;
    }
  }

  // Si on depasse toutes les tranches, on est dans la derniere (45%)
  return TRANCHES_IR_2026[TRANCHES_IR_2026.length - 1]?.taux ?? 0.45;
}

/**
 * Determine si le couple est imposable pour appliquer la decote "couple"
 * On considere couple si parts >= 2
 */
function estCouple(parts: number): boolean {
  return parts >= 2;
}

/**
 * Calcule la decote applicable pour les petits impots
 *
 * La decote s'applique si l'impot brut est inferieur a un seuil:
 * - Celibataire: seuil 1964 EUR, base 889 EUR
 * - Couple: seuil 3249 EUR, base 1470 EUR
 *
 * Formule: decote = base - (impot * 0.4525)
 * La decote est limitee au montant de l'impot (pas de remboursement)
 *
 * @param impotBrut - Impot avant decote
 * @param parts - Nombre de parts fiscales
 * @returns Montant de la decote
 */
function calculerDecote(impotBrut: number, parts: number): number {
  if (impotBrut <= 0) {
    return 0;
  }

  const isCouple = estCouple(parts);
  const { seuil, montantBase } = isCouple
    ? DECOTE_2026.couple
    : DECOTE_2026.celibataire;

  // Pas de decote si impot superieur au seuil
  if (impotBrut >= seuil) {
    return 0;
  }

  // Calcul de la decote
  // Formule 2026: decote = montantBase - (impot * 0.4525)
  const decote = montantBase - impotBrut * 0.4525;

  // La decote ne peut pas etre negative ni superieure a l'impot
  return Math.max(0, Math.min(decote, impotBrut));
}

/**
 * Calcule l'impot sur le revenu complet avec:
 * - Quotient familial
 * - Plafonnement du quotient familial
 * - Decote pour petits revenus
 *
 * @param input - Parametres de calcul (revenu, parts)
 * @returns Resultat detaille du calcul IR
 */
export function calculerIR(input: IRInput): IRResult {
  const { revenuNetImposable, nombreParts } = input;

  // Gestion des revenus negatifs ou nuls
  if (revenuNetImposable <= 0) {
    return {
      quotientFamilial: 0,
      tmi: 0,
      impotParPart: 0,
      impotBrut: 0,
      plafonnementApplique: false,
      decote: 0,
      impotNet: 0,
      tauxMoyen: 0,
    };
  }

  // Calcul du quotient familial
  const quotientFamilial = revenuNetImposable / nombreParts;

  // Determination de la TMI
  const tmi = determinerTMI(revenuNetImposable, nombreParts);

  // Calcul de l'impot par part
  const impotParPart = calculerImpotSansQF(quotientFamilial);

  // Calcul de l'impot brut (avant plafonnement)
  let impotBrut = impotParPart * nombreParts;
  let plafonnementApplique = false;

  // Application du plafonnement du quotient familial
  // Le plafonnement s'applique pour les parts au-dela de 2 (couple) ou 1 (celibataire)
  const partsBase = estCouple(nombreParts) ? 2 : 1;
  const partsSupplementaires = nombreParts - partsBase;

  if (partsSupplementaires > 0) {
    // Calcul de l'impot sans les parts supplementaires
    const impotSansPartsSupp =
      calculerImpotSansQF(revenuNetImposable / partsBase) * partsBase;

    // Calcul de l'avantage fiscal des parts supplementaires
    const avantagePartsSupp = impotSansPartsSupp - impotBrut;

    // Plafond de l'avantage (1791 EUR par demi-part)
    const plafondAvantage = partsSupplementaires * 2 * PLAFOND_QUOTIENT_FAMILIAL;

    // Si l'avantage depasse le plafond, on plafonne
    if (avantagePartsSupp > plafondAvantage) {
      impotBrut = impotSansPartsSupp - plafondAvantage;
      plafonnementApplique = true;
    }
  }

  // Application de la decote
  const decote = calculerDecote(impotBrut, nombreParts);

  // Calcul de l'impot net
  const impotNet = Math.max(0, Math.round(impotBrut - decote));

  // Calcul du taux moyen
  const tauxMoyen =
    revenuNetImposable > 0 ? impotNet / revenuNetImposable : 0;

  return {
    quotientFamilial: Math.round(quotientFamilial * 100) / 100,
    tmi,
    impotParPart: Math.round(impotParPart),
    impotBrut: Math.round(impotBrut),
    plafonnementApplique,
    decote: Math.round(decote),
    impotNet,
    tauxMoyen: Math.round(tauxMoyen * 10000) / 10000,
  };
}
