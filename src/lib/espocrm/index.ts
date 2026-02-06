/**
 * Export centralisé du client EspoCRM
 *
 * Entités supportées:
 * - CJeanbrunVille (382 villes: 52 métropoles + 330 périphériques)
 * - CJeanbrunProgramme (programmes immobiliers)
 * - CJeanbrunBarometre (baromètre mensuel)
 * - Contact (leads)
 */

export { EspoCRMClient, EspoCRMError } from "./client";
export type {
  EspoVille,
  EspoProgramme,
  EspoLead,
  EspoBarometre,
  EspoListResponse,
  EspoVilleFilters,
  EspoProgrammeFilters,
  EspoBarometreFilters,
  EspoProgrammeAvecVille,
  EspoFaqItem,
  EspoArgumentInvestissement,
  Lot,
} from "./types";
export {
  toEspoLead,
  fromEspoVille,
  fromEspoProgramme,
  fromEspoBarometre,
  fromEspoVilleEnriched,
  parseJsonField,
  parseLots,
  getVilleArguments,
  getVilleFaq,
} from "./types";

import { EspoCRMClient } from "./client";

/**
 * Client EspoCRM singleton (côté serveur uniquement)
 * Configuration depuis variables d'environnement
 */
let espoCRMClientInstance: EspoCRMClient | null = null;

/**
 * Options de cache pour les requêtes Next.js
 */
export interface EspoCRMCacheOptions {
  /** Durée de cache en secondes (défaut: 3600 = 1h) */
  revalidate?: number;
  /** Tags pour invalidation ciblée */
  tags?: string[];
}

/** Cache par défaut: 1 heure */
const DEFAULT_CACHE_OPTIONS: EspoCRMCacheOptions = {
  revalidate: 3600,
};

/**
 * Récupère le client EspoCRM singleton
 * Throw une erreur si ESPOCRM_API_KEY n'est pas configurée
 */
export function getEspoCRMClient(): EspoCRMClient {
  if (!espoCRMClientInstance) {
    const apiKey = process.env.ESPOCRM_API_KEY;
    const baseUrl =
      process.env.ESPOCRM_URL ||
      process.env.ESPOCRM_BASE_URL ||
      "https://espocrm.expert-ia-entreprise.fr/api/v1";

    if (!apiKey) {
      throw new Error(
        "ESPOCRM_API_KEY is not configured. Cannot initialize EspoCRM client."
      );
    }

    espoCRMClientInstance = new EspoCRMClient(baseUrl, apiKey);
  }

  return espoCRMClientInstance;
}

/**
 * Vérifie si le client EspoCRM est disponible (API key configurée)
 */
export function isEspoCRMAvailable(): boolean {
  return !!process.env.ESPOCRM_API_KEY;
}

/**
 * Récupère le client avec options de cache (pour use dans Server Components)
 *
 * @example
 * ```typescript
 * // Dans un Server Component
 * const villes = await getEspoCRMWithCache({ revalidate: 3600, tags: ['villes'] })
 *   .getVilles();
 * ```
 */
export function getEspoCRMWithCache(
  options: EspoCRMCacheOptions = DEFAULT_CACHE_OPTIONS
): EspoCRMClient & { cacheOptions: EspoCRMCacheOptions } {
  const client = getEspoCRMClient();
  return Object.assign(client, { cacheOptions: options });
}

/**
 * Helpers pour cache tags Next.js
 */
export const ESPOCRM_CACHE_TAGS = {
  villes: "espocrm-villes",
  programmes: "espocrm-programmes",
  barometres: "espocrm-barometres",
  all: "espocrm",
} as const;

/**
 * Durées de cache recommandées (en secondes)
 */
export const ESPOCRM_CACHE_DURATIONS = {
  /** Données statiques (villes, zones) - 24h */
  static: 86400,
  /** Données semi-dynamiques (programmes) - 1h */
  semiDynamic: 3600,
  /** Données dynamiques (baromètre) - 15min */
  dynamic: 900,
  /** Pas de cache */
  none: 0,
} as const;
