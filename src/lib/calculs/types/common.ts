/**
 * Types communs pour le module de calculs
 *
 * Types énumérés et régimes fiscaux partagés.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Zone fiscale (Pinel/Jeanbrun)
 * Réexporté depuis types/ville pour cohérence
 */
export type ZoneFiscale = "A_BIS" | "A" | "B1" | "B2" | "C";

/**
 * Régime fiscal pour la location
 */
export type RegimeFiscal =
  | "jeanbrun"
  | "lmnp_reel"
  | "lmnp_micro"
  | "location_nue_reel"
  | "location_nue_micro";

/**
 * Situation familiale pour le calcul IR
 */
export type SituationFamiliale = "celibataire" | "couple";

/**
 * Labels français pour les régimes fiscaux
 */
export const REGIME_FISCAL_LABELS: Record<RegimeFiscal, string> = {
  jeanbrun: "Loi Jeanbrun",
  lmnp_reel: "LMNP Réel",
  lmnp_micro: "LMNP Micro-BIC",
  location_nue_reel: "Location nue (Réel)",
  location_nue_micro: "Location nue (Micro-foncier)",
};
