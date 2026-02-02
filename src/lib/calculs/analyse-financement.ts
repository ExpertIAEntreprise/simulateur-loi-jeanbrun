/**
 * Module d'analyse de finançabilité
 *
 * Analyse les données de simulation pour déterminer si le dossier
 * est finançable selon les critères HCSF (35% endettement max).
 *
 * @module analyse-financement
 * @version 1.0
 * @date 31 janvier 2026
 */

import type { AnalyseFinancement } from "@/types/lead-financement";
import { SEUILS_ENDETTEMENT } from "@/types/lead-financement";
import { calculerTauxEndettement, calculerCredit } from "./credit";

interface AnalyseFinancementInput {
  /** Revenus mensuels nets du foyer */
  revenuMensuel: number;
  /** Charges mensuelles existantes (autres crédits, pensions, etc.) */
  chargesActuelles?: number;
  /** Montant total du projet immobilier */
  montantProjet: number;
  /** Apport personnel */
  apport: number;
  /** Durée souhaitée en mois */
  dureeEmpruntMois: number;
  /** Taux annuel estimé (par défaut 3.5%) */
  tauxAnnuel?: number;
  /** Taux assurance annuel (par défaut 0.36%) */
  tauxAssurance?: number;
}

/**
 * Analyse la finançabilité d'un projet immobilier
 *
 * Calcule le taux d'endettement et détermine si le dossier respecte
 * les critères HCSF (35% max) ou est confortable (< 33%).
 *
 * @param input - Données financières du projet
 * @returns Analyse complète de finançabilité
 */
export function analyserFinancement(input: AnalyseFinancementInput): AnalyseFinancement {
  const {
    revenuMensuel,
    chargesActuelles = 0,
    montantProjet,
    apport,
    dureeEmpruntMois,
    tauxAnnuel = 0.035,
    tauxAssurance = 0.0036,
  } = input;

  // Montant à emprunter
  const montantEmprunt = Math.max(0, montantProjet - apport);

  // Si pas d'emprunt nécessaire
  if (montantEmprunt === 0) {
    return {
      montantEmprunt: 0,
      mensualiteEstimee: 0,
      tauxEndettement: chargesActuelles / revenuMensuel,
      tauxEndettementPourcent: (chargesActuelles / revenuMensuel) * 100,
      respecteHCSF: true,
      dossierConfortable: true,
      resteAVivre: revenuMensuel - chargesActuelles,
      verdict: "financable",
      verdictMessage: "Pas d'emprunt nécessaire avec votre apport.",
    };
  }

  // Calcul du crédit
  const creditResult = calculerCredit({
    capitalEmprunte: montantEmprunt,
    tauxAnnuel,
    dureeMois: dureeEmpruntMois,
    tauxAssurance,
  });

  const mensualiteEstimee = creditResult.mensualiteAvecAssurance;

  // Calcul du taux d'endettement
  const endettementResult = calculerTauxEndettement(
    revenuMensuel,
    chargesActuelles,
    mensualiteEstimee
  );

  const tauxEndettement = endettementResult.tauxEndettement;
  const tauxEndettementPourcent = Math.round(tauxEndettement * 1000) / 10;

  // Analyse du verdict
  const respecteHCSF = tauxEndettement <= SEUILS_ENDETTEMENT.maximum;
  const dossierConfortable = tauxEndettement <= SEUILS_ENDETTEMENT.recommande;

  // Seuil minimum de reste à vivre considéré comme confortable
  const RESTE_A_VIVRE_CONFORTABLE = 1500; // €/mois après crédit
  const resteAVivre = endettementResult.resteAVivre;
  const bonResteAVivre = resteAVivre >= RESTE_A_VIVRE_CONFORTABLE;

  let verdict: AnalyseFinancement["verdict"];
  let verdictMessage: string;

  if (tauxEndettement <= SEUILS_ENDETTEMENT.confortable) {
    // <= 30% : Excellent
    verdict = "financable";
    verdictMessage = `Excellent ! Avec ${tauxEndettementPourcent}% d'endettement, votre dossier est très solide.`;
  } else if (tauxEndettement <= SEUILS_ENDETTEMENT.recommande) {
    // 30-33% : Bon
    verdict = "financable";
    verdictMessage = `Dossier finançable sans difficulté (${tauxEndettementPourcent}% d'endettement).`;
  } else if (tauxEndettement <= SEUILS_ENDETTEMENT.maximum) {
    // 33-35% : Acceptable
    verdict = "financable";
    verdictMessage = `Dossier finançable (${tauxEndettementPourcent}% d'endettement). Vous êtes dans la norme HCSF.`;
  } else if (tauxEndettement <= 0.40) {
    // 35-40% : Possible avec dérogation
    // Les banques peuvent déroger sur 20% de leurs dossiers annuels
    if (bonResteAVivre) {
      verdict = "financable";
      verdictMessage = `Endettement de ${tauxEndettementPourcent}% au-dessus des 35% HCSF, mais votre reste à vivre de ${resteAVivre.toLocaleString("fr-FR")}€/mois est confortable. Les banques disposent d'une marge de dérogation (20% de leurs dossiers) pour ce type de profil.`;
    } else {
      verdict = "tendu";
      verdictMessage = `Endettement de ${tauxEndettementPourcent}% au-dessus des 35% HCSF. Possible avec dérogation bancaire (20% des dossiers), mais votre reste à vivre est un peu juste. Un courtier peut vous aider à trouver la bonne banque.`;
    }
  } else if (tauxEndettement <= 0.45) {
    // 40-45% : Difficile mais pas impossible
    verdict = "tendu";
    verdictMessage = `Endettement élevé (${tauxEndettementPourcent}%). ${bonResteAVivre ? "Votre bon reste à vivre peut jouer en votre faveur." : "Envisagez d'augmenter votre apport ou d'allonger la durée."} Un courtier peut rechercher des solutions adaptées.`;
  } else {
    // > 45% : Très difficile
    verdict = "difficile";
    verdictMessage = `Endettement trop élevé (${tauxEndettementPourcent}%). Envisagez d'augmenter votre apport, d'allonger la durée, ou de revoir le montant du projet.`;
  }

  return {
    montantEmprunt,
    mensualiteEstimee: Math.round(mensualiteEstimee),
    tauxEndettement,
    tauxEndettementPourcent,
    respecteHCSF,
    dossierConfortable,
    resteAVivre: Math.round(endettementResult.resteAVivre),
    verdict,
    verdictMessage,
  };
}

/**
 * Génère une couleur CSS selon le taux d'endettement
 *
 * Note: Au-dessus de 35%, ce n'est pas forcément bloquant.
 * Les banques ont 20% de dérogation et le reste à vivre compte.
 *
 * @param tauxEndettement - Taux d'endettement (0-1)
 * @returns Classe CSS de couleur
 */
export function getCouleurEndettement(tauxEndettement: number): string {
  if (tauxEndettement <= SEUILS_ENDETTEMENT.confortable) {
    return "text-green-500"; // Vert foncé - Excellent (< 30%)
  } else if (tauxEndettement <= SEUILS_ENDETTEMENT.recommande) {
    return "text-green-400"; // Vert clair - Bon (30-33%)
  } else if (tauxEndettement <= SEUILS_ENDETTEMENT.maximum) {
    return "text-green-300"; // Vert pâle - Acceptable (33-35%)
  } else if (tauxEndettement <= 0.40) {
    return "text-yellow-500"; // Jaune - Dérogation possible (35-40%)
  } else if (tauxEndettement <= 0.45) {
    return "text-orange-500"; // Orange - Tendu (40-45%)
  } else {
    return "text-red-500"; // Rouge - Difficile (> 45%)
  }
}

/**
 * Génère une icône selon le verdict
 *
 * @param verdict - Verdict de l'analyse
 * @returns Emoji représentatif
 */
export function getIconeVerdict(verdict: AnalyseFinancement["verdict"]): string {
  switch (verdict) {
    case "financable":
      return "✓";
    case "tendu":
      return "⚠";
    case "difficile":
      return "✗";
  }
}
