/**
 * Module de calcul de credit immobilier
 *
 * Fonctions de calcul pour:
 * - Mensualite de credit
 * - Tableau d'amortissement
 * - Capacite d'emprunt
 * - Taux d'endettement
 *
 * @module credit
 * @version 1.0
 * @date 30 janvier 2026
 */

import { SEUILS_ENDETTEMENT } from "./constants";
import type {
  CreditInput,
  CreditResult,
  LigneAmortissement,
  CapaciteEmpruntResult,
  TauxEndettementResult,
} from "./types/credit";

/**
 * Calcule la mensualite d'un credit immobilier
 *
 * Formule standard: M = C * (t/12) / (1 - (1 + t/12)^(-n))
 * Ou:
 *   - M = mensualite
 *   - C = capital emprunte
 *   - t = taux annuel (decimal)
 *   - n = nombre de mois
 *
 * @param input - Parametres du credit
 * @returns Resultat complet avec mensualite, cout total et tableau d'amortissement
 */
export function calculerCredit(input: CreditInput): CreditResult {
  const { capitalEmprunte, tauxAnnuel, dureeMois, tauxAssurance } = input;

  // Calcul de la mensualite hors assurance
  const mensualiteHorsAssurance = calculerMensualite(
    capitalEmprunte,
    tauxAnnuel,
    dureeMois
  );

  // Calcul de l'assurance mensuelle si fournie
  const assuranceMensuelle = tauxAssurance
    ? (capitalEmprunte * tauxAssurance) / 12
    : undefined;

  // Mensualite totale avec assurance
  const mensualiteAvecAssurance =
    mensualiteHorsAssurance + (assuranceMensuelle ?? 0);

  // Generation du tableau d'amortissement
  const tableau = genererTableauAmortissement(
    capitalEmprunte,
    tauxAnnuel,
    dureeMois,
    mensualiteHorsAssurance,
    assuranceMensuelle
  );

  // Calcul des totaux
  const totalInterets = tableau.reduce((sum, ligne) => sum + ligne.interets, 0);

  // TAEG estime (approximation simple)
  const taegEstime = calculerTaegEstime(
    capitalEmprunte,
    mensualiteAvecAssurance,
    dureeMois
  );

  // Construction du resultat - on n'inclut totalAssurance que si defini
  if (tauxAssurance && assuranceMensuelle !== undefined) {
    const totalAssurance = assuranceMensuelle * dureeMois;
    const coutTotal = capitalEmprunte + totalInterets + totalAssurance;
    return {
      mensualiteHorsAssurance,
      mensualiteAvecAssurance,
      coutTotal,
      totalInterets,
      totalAssurance,
      taegEstime,
      tableau,
    };
  }

  // Cas sans assurance
  const coutTotal = capitalEmprunte + totalInterets;
  return {
    mensualiteHorsAssurance,
    mensualiteAvecAssurance,
    coutTotal,
    totalInterets,
    taegEstime,
    tableau,
  };
}

/**
 * Calcule la mensualite selon la formule standard du credit amortissable
 *
 * @param capital - Montant emprunte
 * @param tauxAnnuel - Taux annuel (decimal)
 * @param dureeMois - Duree en mois
 * @returns Mensualite hors assurance
 */
function calculerMensualite(
  capital: number,
  tauxAnnuel: number,
  dureeMois: number
): number {
  // Cas special: taux a 0%
  if (tauxAnnuel === 0) {
    return capital / dureeMois;
  }

  const tauxMensuel = tauxAnnuel / 12;

  // Formule: M = C * t / (1 - (1 + t)^(-n))
  const numerateur = capital * tauxMensuel;
  const denominateur = 1 - Math.pow(1 + tauxMensuel, -dureeMois);

  return numerateur / denominateur;
}

/**
 * Genere le tableau d'amortissement complet
 *
 * @param capital - Capital initial
 * @param tauxAnnuel - Taux annuel (decimal)
 * @param dureeMois - Duree en mois
 * @param mensualite - Mensualite hors assurance
 * @param assuranceMensuelle - Assurance mensuelle optionnelle
 * @returns Tableau des lignes d'amortissement
 */
function genererTableauAmortissement(
  capital: number,
  tauxAnnuel: number,
  dureeMois: number,
  mensualite: number,
  assuranceMensuelle?: number
): LigneAmortissement[] {
  const tableau: LigneAmortissement[] = [];
  let capitalRestant = capital;
  const tauxMensuel = tauxAnnuel / 12;

  for (let mois = 1; mois <= dureeMois; mois++) {
    // Interets du mois = capital restant * taux mensuel
    const interets = capitalRestant * tauxMensuel;

    // Capital rembourse = mensualite - interets
    let capitalRembourse = mensualite - interets;

    // Dernier mois: ajuster pour eviter les erreurs d'arrondi
    if (mois === dureeMois) {
      capitalRembourse = capitalRestant;
    }

    // Nouveau capital restant
    const nouveauCapitalRestant = Math.max(0, capitalRestant - capitalRembourse);

    // Mensualite effective (peut varier legerement le dernier mois)
    const mensualiteEffective =
      mois === dureeMois ? capitalRestant + interets : mensualite;

    const ligne: LigneAmortissement = {
      mois,
      mensualite: mensualiteEffective,
      capital: capitalRembourse,
      interets,
      capitalRestant: nouveauCapitalRestant,
    };

    // Ajouter assurance si fournie
    if (assuranceMensuelle !== undefined) {
      ligne.assurance = assuranceMensuelle;
    }

    tableau.push(ligne);
    capitalRestant = nouveauCapitalRestant;
  }

  return tableau;
}

/**
 * Estime le TAEG (Taux Annuel Effectif Global)
 *
 * Utilise la methode de Newton-Raphson pour trouver le taux qui equilibre
 * la valeur actuelle des mensualites avec le capital emprunte.
 *
 * @param capital - Capital emprunte
 * @param mensualite - Mensualite totale (avec assurance)
 * @param dureeMois - Duree en mois
 * @returns TAEG estime (decimal)
 */
function calculerTaegEstime(
  capital: number,
  mensualite: number,
  dureeMois: number
): number {
  // Estimation initiale: utiliser la formule inverse approximative
  // TAEG ≈ 2 * n * (M*n - C) / (C * (n + 1))
  const totalPaye = mensualite * dureeMois;
  const interetsEstimes = totalPaye - capital;

  if (interetsEstimes <= 0) {
    return 0;
  }

  // Approximation simplifiee du TAEG
  // Cette formule donne une bonne approximation pour les prets standards
  const taegApprox = (2 * 12 * interetsEstimes) / (capital * (dureeMois + 1));

  // Verification par iteration Newton-Raphson (3 iterations)
  let taegEstime = taegApprox;
  for (let i = 0; i < 3; i++) {
    const tauxMensuel = taegEstime / 12;
    if (tauxMensuel === 0) break;

    const mensualiteCalculee =
      (capital * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -dureeMois));

    // Ajustement proportionnel
    if (mensualiteCalculee > 0) {
      taegEstime = taegEstime * (mensualite / mensualiteCalculee);
    }
  }

  return taegEstime;
}

/**
 * Calcule la capacite d'emprunt maximale
 *
 * Utilise le seuil HCSF de 35% d'endettement maximum.
 * Inverse la formule de mensualite pour trouver le capital max.
 *
 * @param revenuMensuel - Revenu mensuel net
 * @param chargesActuelles - Charges mensuelles existantes
 * @param tauxAnnuel - Taux annuel du credit (decimal)
 * @param dureeMois - Duree souhaitee en mois
 * @returns Resultat avec capacite d'emprunt et mensualite max
 */
export function calculerCapaciteEmprunt(
  revenuMensuel: number,
  chargesActuelles: number,
  tauxAnnuel: number,
  dureeMois: number
): CapaciteEmpruntResult {
  // Mensualite maximale selon le seuil HCSF (35%)
  const revenuDisponible = revenuMensuel - chargesActuelles;
  const mensualiteMax = revenuDisponible * SEUILS_ENDETTEMENT.maximum;

  // Si mensualite max <= 0, pas de capacite d'emprunt
  if (mensualiteMax <= 0) {
    return {
      mensualiteMax: 0,
      capaciteEmprunt: 0,
      message:
        "Capacite d'emprunt nulle: les charges existantes sont trop elevees par rapport aux revenus.",
    };
  }

  // Cas special: taux a 0%
  if (tauxAnnuel === 0) {
    return {
      mensualiteMax,
      capaciteEmprunt: mensualiteMax * dureeMois,
    };
  }

  // Inverser la formule de mensualite pour trouver le capital max
  // M = C * t / (1 - (1 + t)^(-n))
  // => C = M * (1 - (1 + t)^(-n)) / t
  const tauxMensuel = tauxAnnuel / 12;
  const facteur = (1 - Math.pow(1 + tauxMensuel, -dureeMois)) / tauxMensuel;
  const capaciteEmprunt = mensualiteMax * facteur;

  return {
    mensualiteMax,
    capaciteEmprunt: Math.max(0, capaciteEmprunt),
  };
}

/**
 * Calcule le taux d'endettement apres un nouveau credit
 *
 * Compare le total des charges (existantes + nouvelle mensualite)
 * aux revenus pour determiner le taux d'endettement.
 *
 * @param revenuMensuel - Revenu mensuel net
 * @param chargesActuelles - Charges mensuelles existantes (hors nouveau credit)
 * @param nouvelleMensualite - Mensualite du nouveau credit
 * @returns Resultat avec taux, reste a vivre, et indicateurs
 */
export function calculerTauxEndettement(
  revenuMensuel: number,
  chargesActuelles: number,
  nouvelleMensualite: number
): TauxEndettementResult {
  // Total des charges apres nouveau credit
  const chargesApres = chargesActuelles + nouvelleMensualite;

  // Taux d'endettement
  const tauxEndettement =
    revenuMensuel > 0 ? chargesApres / revenuMensuel : Infinity;

  // Reste a vivre
  const resteAVivre = revenuMensuel - chargesApres;

  // Evaluation par rapport aux seuils
  const acceptable = tauxEndettement < SEUILS_ENDETTEMENT.maximum;
  const recommande = tauxEndettement < SEUILS_ENDETTEMENT.recommande;

  return {
    revenus: revenuMensuel,
    chargesApres,
    tauxEndettement,
    resteAVivre,
    acceptable,
    recommande,
  };
}
