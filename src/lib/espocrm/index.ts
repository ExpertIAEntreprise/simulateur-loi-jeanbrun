/**
 * Export centralisé du client EspoCRM
 */

export { EspoCRMClient, EspoCRMError } from "./client";
export type {
  EspoVille,
  EspoProgramme,
  EspoLead,
  EspoListResponse,
  EspoVilleFilters,
  EspoProgrammeFilters,
  EspoProgrammeAvecVille,
} from "./types";
export { toEspoLead, fromEspoVille, fromEspoProgramme } from "./types";

import { EspoCRMClient } from "./client";

/**
 * Client EspoCRM singleton (côté serveur uniquement)
 * Configuration depuis variables d'environnement
 */
let espoCRMClientInstance: EspoCRMClient | null = null;

/**
 * Récupère le client EspoCRM singleton
 * Throw une erreur si ESPOCRM_API_KEY n'est pas configurée
 */
export function getEspoCRMClient(): EspoCRMClient {
  if (!espoCRMClientInstance) {
    const apiKey = process.env.ESPOCRM_API_KEY;
    const baseUrl =
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
