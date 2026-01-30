/**
 * Module de calcul Jeanbrun ANCIEN
 *
 * Implements:
 * - calculerTravauxMinimum: Calcul du seuil minimum de travaux (30%)
 * - verifierEligibiliteTravaux: Verification de l'eligibilite
 * - calculerJeanbrunAncien: Calcul complet avec verification prealable
 *
 * Parametres:
 * - Condition: travaux >= 30% du prix d'achat
 * - Base amortissement: 80% du prix total (achat + travaux)
 * - Duree engagement: 9 ans obligatoire
 * - Plafond unique: 10 700 EUR/an
 * - Niveaux de loyer:
 *   - Intermediaire: 3.0%, plafond 10 700 EUR/an
 *   - Social: 3.5%, plafond 10 700 EUR/an
 *   - Tres social: 4.0%, plafond 10 700 EUR/an
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { JEANBRUN_ANCIEN } from "./constants";
import type {
  JeanbrunAncienInput,
  JeanbrunAncienResult,
  EligibiliteTravauxResult,
} from "./types/jeanbrun";

/**
 * Calcule le montant minimum de travaux requis (30% du prix d'achat)
 *
 * @param prixAchat - Prix d'achat du bien en euros
 * @returns Montant minimum de travaux requis, arrondi a l'euro
 */
export function calculerTravauxMinimum(prixAchat: number): number {
  // Gestion des prix negatifs ou nuls
  if (prixAchat <= 0) {
    return 0;
  }

  return Math.round(prixAchat * JEANBRUN_ANCIEN.seuilTravaux);
}

/**
 * Verifie si les travaux sont suffisants pour etre eligible au Jeanbrun Ancien
 *
 * Condition: travaux >= 30% du prix d'achat
 *
 * @param prixAchat - Prix d'achat du bien en euros
 * @param montantTravaux - Montant des travaux en euros
 * @returns Resultat avec eligibilite, seuil requis et montant manquant si applicable
 */
export function verifierEligibiliteTravaux(
  prixAchat: number,
  montantTravaux: number
): EligibiliteTravauxResult {
  const seuilRequis = calculerTravauxMinimum(prixAchat);

  // Verification de l'eligibilite
  const eligible = montantTravaux >= seuilRequis;

  if (eligible) {
    return {
      eligible: true,
      seuilRequis,
    };
  }

  // Calcul du montant manquant
  const montantManquant = seuilRequis - montantTravaux;

  return {
    eligible: false,
    seuilRequis,
    montantManquant,
  };
}

/**
 * Calcule l'amortissement Jeanbrun pour un bien ANCIEN
 *
 * Processus:
 * 1. Verification de l'eligibilite (travaux >= 30%)
 * 2. Si ineligible: retourne eligible=false avec message et montant manquant
 * 3. Si eligible:
 *    - Prix total = prixAchat + montantTravaux
 *    - Base = prixTotal * 0.8
 *    - Amortissement brut = base * taux du niveau
 *    - Amortissement net = min(brut, 10 700)
 *
 * @param input - Prix d'achat, montant travaux et niveau de loyer
 * @returns Resultat avec eligibilite et calculs si eligible
 */
export function calculerJeanbrunAncien(
  input: JeanbrunAncienInput
): JeanbrunAncienResult {
  const { prixAchat, montantTravaux, niveauLoyer } = input;

  // Verification de l'eligibilite
  const eligibilite = verifierEligibiliteTravaux(prixAchat, montantTravaux);

  if (!eligibilite.eligible) {
    const montantManquant = eligibilite.montantManquant ?? 0;
    return {
      eligible: false,
      message: `Travaux insuffisants pour le dispositif Jeanbrun Ancien. Montant minimum requis: ${eligibilite.seuilRequis.toLocaleString("fr-FR")} EUR (30% du prix d'achat). Il manque ${montantManquant.toLocaleString("fr-FR")} EUR.`,
      seuilTravauxRequis: eligibilite.seuilRequis,
      montantManquant,
    };
  }

  // Calcul du prix total (utilise les valeurs negatives comme 0)
  const prixAchatPositif = Math.max(0, prixAchat);
  const travauxPositif = Math.max(0, montantTravaux);
  const prixTotal = Math.round(prixAchatPositif + travauxPositif);

  // Recuperation des parametres du niveau
  const niveau = JEANBRUN_ANCIEN.niveaux[niveauLoyer];
  const { taux, plafond } = niveau;

  // Calcul de la base d'amortissement (80% du prix total)
  // Si prixAchat est negatif, on ne compte que les travaux
  const baseAmortissement = Math.round(
    prixTotal * JEANBRUN_ANCIEN.baseAmortissement
  );

  // Calcul de l'amortissement brut
  const amortissementBrut = Math.round(baseAmortissement * taux);

  // Application du plafond unique (10 700 EUR)
  const plafondApplique = amortissementBrut > plafond;
  const amortissementNet = plafondApplique ? plafond : amortissementBrut;

  return {
    eligible: true,
    prixTotal,
    baseAmortissement,
    amortissementBrut,
    amortissementNet,
    plafondApplique,
  };
}
