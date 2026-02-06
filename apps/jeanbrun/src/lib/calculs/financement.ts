/**
 * Formules de financement pour la section interactive
 *
 * Fonctions pures 100% client-side (pas d'API call).
 * Utilisees par SectionFinancement.tsx avec les sliders.
 */

import { FRAIS_ACQUISITION } from "./constants";

/**
 * Calcule la mensualite d'un credit immobilier
 *
 * Formule d'amortissement constant :
 * M = C * (t / (1 - (1 + t)^-n))
 *
 * @param montant - Capital emprunte en euros
 * @param tauxAnnuel - Taux d'interet annuel (decimal, ex: 0.034 pour 3.4%)
 * @param dureeAnnees - Duree du credit en annees
 * @returns Mensualite en euros, arrondie a l'entier
 */
export function calculerMensualiteCredit(
  montant: number,
  tauxAnnuel: number,
  dureeAnnees: number
): number {
  if (montant <= 0 || tauxAnnuel <= 0 || dureeAnnees <= 0) return 0;

  const tauxMensuel = tauxAnnuel / 12;
  const nbMois = dureeAnnees * 12;

  const mensualite =
    montant * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -nbMois)));

  return Math.round(mensualite);
}

/**
 * Calcule les frais de notaire pour un bien neuf (~3%)
 *
 * @param prix - Prix du bien en euros
 * @returns Frais de notaire estimes en euros
 */
export function calculerFraisNotaireNeuf(prix: number): number {
  if (prix <= 0) return 0;
  return Math.round(prix * FRAIS_ACQUISITION.tauxNeuf);
}

/**
 * Calcule les frais de notaire pour un bien ancien (~8%)
 *
 * @param prix - Prix du bien en euros
 * @returns Frais de notaire estimes en euros
 */
export function calculerFraisNotaireAncien(prix: number): number {
  if (prix <= 0) return 0;
  return Math.round(prix * FRAIS_ACQUISITION.tauxAncien);
}

/**
 * Calcule l'effort mensuel = mensualite credit - loyer estime
 *
 * Un effort negatif = le loyer couvre plus que la mensualite (cashflow positif)
 * Un effort positif = l'investisseur doit completer chaque mois
 *
 * @param mensualite - Mensualite du credit en euros
 * @param loyerEstime - Loyer mensuel estime en euros
 * @returns Effort mensuel en euros
 */
export function calculerEffortMensuel(
  mensualite: number,
  loyerEstime: number
): number {
  return Math.round(mensualite - loyerEstime);
}

/**
 * Calcule le cout total d'investissement
 *
 * @param prixBien - Prix du bien en euros
 * @param fraisNotaire - Frais de notaire en euros
 * @returns Cout total en euros
 */
export function calculerCoutTotal(
  prixBien: number,
  fraisNotaire: number
): number {
  return prixBien + fraisNotaire;
}

/**
 * Calcule le montant emprunte apres apport
 *
 * @param prixBien - Prix du bien en euros
 * @param fraisNotaire - Frais de notaire en euros
 * @param apportPersonnel - Apport en euros
 * @returns Montant a emprunter en euros
 */
export function calculerMontantEmprunte(
  prixBien: number,
  fraisNotaire: number,
  apportPersonnel: number
): number {
  const total = prixBien + fraisNotaire;
  return Math.max(0, total - apportPersonnel);
}
