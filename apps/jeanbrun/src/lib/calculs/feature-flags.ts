/**
 * Feature Flags pour les réformes fiscales
 *
 * Ce module permet d'activer/désactiver des fonctionnalités fiscales
 * à venir ou en cours de transition, comme:
 * - Réforme PV 17 ans (proposition de loi)
 * - Déficit foncier bonifié (jusqu'au 31/12/2027)
 * - Dispositif Jeanbrun (2026-2028)
 *
 * Les flags peuvent être configurés via:
 * 1. Variables d'environnement (TAX_FLAG_*)
 * 2. Configuration runtime
 * 3. Valeurs par défaut
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

// ============================================
// INTERFACES
// ============================================

/**
 * Interface des feature flags fiscaux
 *
 * Chaque flag contrôle une fonctionnalité fiscale spécifique.
 * Les flags sont conçus pour être activables/désactivables
 * sans modification du code de calcul sous-jacent.
 */
export interface TaxFeatureFlags {
  // ============================================
  // PLUS-VALUE IMMOBILIÈRE
  // ============================================

  /**
   * Réforme PV exonération à 17 ans au lieu de 22 ans
   *
   * Proposition de loi visant à réduire la durée de détention
   * pour l'exonération totale IR de 22 ans à 17 ans.
   *
   * @default false (règle actuelle: 22 ans)
   * @proposed PLF futur (pas encore voté)
   */
  plusValue17YearsRule: boolean;

  /**
   * Réforme PV exonération PS à 25 ans au lieu de 30 ans
   *
   * Proposition complémentaire pour réduire la durée
   * d'exonération des prélèvements sociaux.
   *
   * @default false (règle actuelle: 30 ans)
   * @proposed PLF futur (pas encore voté)
   */
  plusValuePS25YearsRule: boolean;

  // ============================================
  // DÉFICIT FONCIER
  // ============================================

  /**
   * Plafond déficit foncier bonifié (21 400€ au lieu de 10 700€)
   *
   * Bonus pour travaux d'amélioration énergétique permettant
   * de sortir le bien du statut de passoire thermique.
   * Applicable jusqu'au 31/12/2027.
   *
   * @default true (en vigueur jusqu'au 31/12/2027)
   * @source LF 2023 art. 5
   */
  deficitFoncierBonifie: boolean;

  /**
   * Limite temporelle du déficit bonifié
   *
   * Si true, vérifie que la date est avant le 31/12/2027
   * avant d'appliquer le plafond bonifié.
   *
   * @default true (vérification activée)
   */
  deficitFoncierBonifieDateCheck: boolean;

  // ============================================
  // LOI JEANBRUN
  // ============================================

  /**
   * Dispositif Jeanbrun actif
   *
   * Active le calcul des avantages fiscaux Jeanbrun
   * pour les investissements locatifs neufs et anciens.
   *
   * @default true (dispositif en vigueur 2026-2028)
   * @source PLF 2026 - Article 199 novovicies bis CGI
   */
  jeanbrunEnabled: boolean;

  /**
   * Vérification des dates Jeanbrun
   *
   * Si true, vérifie que l'investissement est dans la période
   * d'application du dispositif (01/01/2026 - 31/12/2028).
   *
   * @default true (vérification activée)
   */
  jeanbrunDateCheck: boolean;

  /**
   * Mode strict Jeanbrun ancien
   *
   * Si true, exige strictement 30% de travaux minimum.
   * Si false, permet une tolérance de 1% pour arrondi.
   *
   * @default true (mode strict)
   */
  jeanbrunAncienStrictMode: boolean;

  // ============================================
  // LMNP
  // ============================================

  /**
   * Réforme LMNP amortissements
   *
   * Proposition de réintégration des amortissements
   * dans le calcul de la plus-value LMNP.
   *
   * @default false (règle actuelle: pas de réintégration)
   * @proposed PLF futur (discussions en cours)
   */
  lmnpAmortissementReintegration: boolean;

  /**
   * Nouveau plafond micro-BIC meublé tourisme
   *
   * Réduction du plafond et de l'abattement pour les
   * locations meublées de tourisme non classées.
   *
   * @default true (en vigueur depuis LF 2024)
   * @source LF 2024 art. 45
   */
  lmnpTourismeNewRules: boolean;

  // ============================================
  // IR / BARÈME
  // ============================================

  /**
   * Utiliser le barème IR 2026
   *
   * Si false, utilise le barème 2025 (pour comparaison).
   *
   * @default true (barème 2026 actif)
   */
  irBareme2026: boolean;

  /**
   * Appliquer le gel partiel des tranches IR
   *
   * En 2026, seule la 1ère tranche est revalorisée de 1%.
   *
   * @default true (gel partiel appliqué)
   */
  irGelPartiel2026: boolean;
}

// ============================================
// VALEURS PAR DÉFAUT
// ============================================

/**
 * Feature flags par défaut
 *
 * Ces valeurs représentent l'état actuel de la législation
 * fiscale française au 30 janvier 2026.
 */
export const DEFAULT_FEATURE_FLAGS: TaxFeatureFlags = {
  // Plus-value: règles actuelles (22 ans IR, 30 ans PS)
  plusValue17YearsRule: false,
  plusValuePS25YearsRule: false,

  // Déficit foncier: bonifié actif jusqu'au 31/12/2027
  deficitFoncierBonifie: true,
  deficitFoncierBonifieDateCheck: true,

  // Jeanbrun: actif 2026-2028
  jeanbrunEnabled: true,
  jeanbrunDateCheck: true,
  jeanbrunAncienStrictMode: true,

  // LMNP: nouvelles règles tourisme actives
  lmnpAmortissementReintegration: false,
  lmnpTourismeNewRules: true,

  // IR: barème 2026 avec gel partiel
  irBareme2026: true,
  irGelPartiel2026: true,
};

// ============================================
// CONFIGURATION RUNTIME
// ============================================

/**
 * Configuration runtime des feature flags
 *
 * Permet de modifier les flags en cours d'exécution
 * sans redémarrage. Utilisé principalement pour les tests
 * et les simulations "what-if".
 */
let runtimeFlags: Partial<TaxFeatureFlags> = {};

/**
 * Définit les flags runtime
 *
 * @param flags - Flags à surcharger
 *
 * @example
 * ```typescript
 * // Simuler la réforme PV 17 ans
 * setRuntimeFlags({ plusValue17YearsRule: true });
 * ```
 */
export function setRuntimeFlags(flags: Partial<TaxFeatureFlags>): void {
  runtimeFlags = { ...runtimeFlags, ...flags };
}

/**
 * Réinitialise les flags runtime
 *
 * Supprime toutes les surcharges runtime et revient
 * aux valeurs par défaut + variables d'environnement.
 */
export function resetRuntimeFlags(): void {
  runtimeFlags = {};
}

/**
 * Récupère les flags runtime actuels
 *
 * @returns Copie des flags runtime
 */
export function getRuntimeFlags(): Partial<TaxFeatureFlags> {
  return { ...runtimeFlags };
}

// ============================================
// LECTURE DES FLAGS
// ============================================

/**
 * Lit un flag booléen depuis les variables d'environnement
 *
 * @param key - Nom de la variable d'environnement
 * @param defaultValue - Valeur par défaut si non définie
 * @returns Valeur du flag
 */
function readEnvFlag(key: string, defaultValue: boolean): boolean {
  // En environnement serveur Node.js
  if (typeof process !== "undefined" && process.env) {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    // Accepte "true", "1", "yes", "on" comme true
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }
  return defaultValue;
}

/**
 * Récupère les feature flags actuels
 *
 * Priorité de résolution:
 * 1. Flags runtime (setRuntimeFlags)
 * 2. Variables d'environnement (TAX_FLAG_*)
 * 3. Valeurs par défaut
 *
 * @returns Feature flags résolus
 *
 * @example
 * ```typescript
 * const flags = getFeatureFlags();
 * if (flags.plusValue17YearsRule) {
 *   // Utiliser la règle 17 ans
 * }
 * ```
 */
export function getFeatureFlags(): TaxFeatureFlags {
  // Lire depuis les variables d'environnement
  const envFlags: TaxFeatureFlags = {
    plusValue17YearsRule: readEnvFlag(
      "TAX_FLAG_PV_17_YEARS",
      DEFAULT_FEATURE_FLAGS.plusValue17YearsRule
    ),
    plusValuePS25YearsRule: readEnvFlag(
      "TAX_FLAG_PV_PS_25_YEARS",
      DEFAULT_FEATURE_FLAGS.plusValuePS25YearsRule
    ),
    deficitFoncierBonifie: readEnvFlag(
      "TAX_FLAG_DEFICIT_BONIFIE",
      DEFAULT_FEATURE_FLAGS.deficitFoncierBonifie
    ),
    deficitFoncierBonifieDateCheck: readEnvFlag(
      "TAX_FLAG_DEFICIT_BONIFIE_DATE_CHECK",
      DEFAULT_FEATURE_FLAGS.deficitFoncierBonifieDateCheck
    ),
    jeanbrunEnabled: readEnvFlag(
      "TAX_FLAG_JEANBRUN_ENABLED",
      DEFAULT_FEATURE_FLAGS.jeanbrunEnabled
    ),
    jeanbrunDateCheck: readEnvFlag(
      "TAX_FLAG_JEANBRUN_DATE_CHECK",
      DEFAULT_FEATURE_FLAGS.jeanbrunDateCheck
    ),
    jeanbrunAncienStrictMode: readEnvFlag(
      "TAX_FLAG_JEANBRUN_ANCIEN_STRICT",
      DEFAULT_FEATURE_FLAGS.jeanbrunAncienStrictMode
    ),
    lmnpAmortissementReintegration: readEnvFlag(
      "TAX_FLAG_LMNP_AMORT_REINTEGRATION",
      DEFAULT_FEATURE_FLAGS.lmnpAmortissementReintegration
    ),
    lmnpTourismeNewRules: readEnvFlag(
      "TAX_FLAG_LMNP_TOURISME_NEW",
      DEFAULT_FEATURE_FLAGS.lmnpTourismeNewRules
    ),
    irBareme2026: readEnvFlag(
      "TAX_FLAG_IR_BAREME_2026",
      DEFAULT_FEATURE_FLAGS.irBareme2026
    ),
    irGelPartiel2026: readEnvFlag(
      "TAX_FLAG_IR_GEL_PARTIEL_2026",
      DEFAULT_FEATURE_FLAGS.irGelPartiel2026
    ),
  };

  // Fusionner: defaults < env < runtime
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...envFlags,
    ...runtimeFlags,
  };
}

/**
 * Récupère un flag spécifique
 *
 * @param flagName - Nom du flag
 * @returns Valeur du flag
 *
 * @example
 * ```typescript
 * if (getFeatureFlag("plusValue17YearsRule")) {
 *   // Appliquer la réforme 17 ans
 * }
 * ```
 */
export function getFeatureFlag<K extends keyof TaxFeatureFlags>(
  flagName: K
): TaxFeatureFlags[K] {
  return getFeatureFlags()[flagName];
}

// ============================================
// HELPERS POUR CALCULS
// ============================================

/**
 * Récupère le seuil d'exonération IR pour la plus-value
 *
 * @param flags - Feature flags (optionnel, utilise getFeatureFlags() sinon)
 * @returns Nombre d'années pour exonération totale IR
 */
export function getSeuilExonerationIR(flags?: TaxFeatureFlags): number {
  const f = flags ?? getFeatureFlags();
  return f.plusValue17YearsRule ? 17 : 22;
}

/**
 * Récupère le seuil d'exonération PS pour la plus-value
 *
 * @param flags - Feature flags (optionnel)
 * @returns Nombre d'années pour exonération totale PS
 */
export function getSeuilExonerationPS(flags?: TaxFeatureFlags): number {
  const f = flags ?? getFeatureFlags();
  return f.plusValuePS25YearsRule ? 25 : 30;
}

/**
 * Récupère le plafond déficit foncier applicable
 *
 * @param flags - Feature flags (optionnel)
 * @param dateInvestissement - Date pour vérification temporelle
 * @returns Plafond en euros (10 700 ou 21 400)
 */
export function getPlafondDeficitFoncier(
  flags?: TaxFeatureFlags,
  dateInvestissement?: Date
): number {
  const f = flags ?? getFeatureFlags();

  // Si bonifié désactivé, retourner le plafond standard
  if (!f.deficitFoncierBonifie) {
    return 10700;
  }

  // Si vérification de date activée
  if (f.deficitFoncierBonifieDateCheck && dateInvestissement) {
    const limiteBonification = new Date("2027-12-31");
    if (dateInvestissement > limiteBonification) {
      return 10700;
    }
  }

  return 21400;
}

/**
 * Vérifie si le dispositif Jeanbrun est applicable
 *
 * @param flags - Feature flags (optionnel)
 * @param dateInvestissement - Date de l'investissement
 * @returns true si Jeanbrun applicable
 */
export function isJeanbrunApplicable(
  flags?: TaxFeatureFlags,
  dateInvestissement?: Date
): boolean {
  const f = flags ?? getFeatureFlags();

  if (!f.jeanbrunEnabled) {
    return false;
  }

  if (f.jeanbrunDateCheck && dateInvestissement) {
    const debut = new Date("2026-01-01");
    const fin = new Date("2028-12-31");
    return dateInvestissement >= debut && dateInvestissement <= fin;
  }

  return true;
}

// ============================================
// EXPORT TYPE UTILITAIRES
// ============================================

/**
 * Type pour les noms de flags
 */
export type TaxFeatureFlagName = keyof TaxFeatureFlags;

/**
 * Type pour une configuration partielle de flags
 */
export type PartialTaxFeatureFlags = Partial<TaxFeatureFlags>;
