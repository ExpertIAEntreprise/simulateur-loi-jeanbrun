/**
 * Client API EspoCRM pour le Simulateur Loi Jeanbrun
 *
 * Gère les requêtes vers EspoCRM avec retry automatique et gestion d'erreurs.
 */

import { espocrmLogger } from "@/lib/logger";
import type {
  EspoVille,
  EspoProgramme,
  EspoLead,
  EspoListResponse,
  EspoVilleFilters,
  EspoProgrammeFilters,
} from "./types";

/**
 * Options pour les requêtes avec pagination
 */
interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * Configuration de retry
 */
interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // Délai de base en ms (exponential backoff)
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1s, 2s, 4s
};

/**
 * Erreur EspoCRM personnalisée
 */
export class EspoCRMError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public espoMessage?: string
  ) {
    super(message);
    this.name = "EspoCRMError";
  }
}

/**
 * Client API EspoCRM
 */
export class EspoCRMClient {
  private baseUrl: string;
  private apiKey: string;
  private retryConfig: RetryConfig;

  constructor(
    baseUrl: string,
    apiKey: string,
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Enlever trailing slash
    this.apiKey = apiKey;
    this.retryConfig = retryConfig;
  }

  /**
   * Fetch avec retry automatique et exponential backoff
   */
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "X-Api-Key": this.apiKey,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      // Si erreur serveur 5xx, retry
      if (response.status >= 500 && attempt < this.retryConfig.maxRetries) {
        const delay = this.retryConfig.baseDelay * Math.pow(2, attempt - 1);
        espocrmLogger.warn(
          { status: response.status, attempt, maxRetries: this.retryConfig.maxRetries, delayMs: delay },
          "EspoCRM request failed, retrying"
        );
        await this.sleep(delay);
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }

      // Si erreur client 4xx, ne pas retry
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new EspoCRMError(
          `EspoCRM API error: ${response.status} ${response.statusText}`,
          response.status,
          errorData.message || errorData.error
        );
      }

      return response.json();
    } catch (error: unknown) {
      // Retry sur erreur réseau uniquement
      if (
        attempt < this.retryConfig.maxRetries &&
        (error instanceof TypeError ||
          (error instanceof Error && error.message?.includes("fetch")))
      ) {
        const delay = this.retryConfig.baseDelay * Math.pow(2, attempt - 1);
        espocrmLogger.warn(
          { attempt, maxRetries: this.retryConfig.maxRetries, delayMs: delay },
          "Network error, retrying"
        );
        await this.sleep(delay);
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }

      // Erreur finale après tous les retries
      if (error instanceof EspoCRMError) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      throw new EspoCRMError(
        `Failed to fetch from EspoCRM: ${errorMessage}`,
        undefined,
        errorMessage
      );
    }
  }

  /**
   * Utilitaire: sleep pour retry
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Construit une URL avec query params
   */
  private buildUrl(
    path: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    return url.toString();
  }

  /**
   * Construit les where clauses pour filtres
   */
  private buildWhereParams(filters: Record<string, unknown>): Record<string, string> {
    const params: Record<string, string> = {};
    let index = 0;

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[`where[${index}][type]`] = "equals";
        params[`where[${index}][attribute]`] = key;
        params[`where[${index}][value]`] = String(value);
        index++;
      }
    });

    return params;
  }

  /**
   * Récupère la liste des villes éligibles
   */
  async getVilles(
    filters?: EspoVilleFilters,
    options?: PaginationOptions
  ): Promise<EspoListResponse<EspoVille>> {
    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      orderBy: "name",
      order: "asc",
    };

    // Ajouter filtres
    if (filters) {
      const whereParams = this.buildWhereParams({
        cDepartement: filters.departement,
        cZoneFiscale: filters.zoneFiscale,
        cTensionLocative: filters.tensionLocative,
      });

      Object.assign(params, whereParams);

      // Recherche par nom (like)
      if (filters.search) {
        const searchIndex = Object.keys(whereParams).length / 3; // 3 params par where clause
        params[`where[${searchIndex}][type]`] = "like";
        params[`where[${searchIndex}][attribute]`] = "name";
        params[`where[${searchIndex}][value]`] = `%${filters.search}%`;
      }
    }

    const url = this.buildUrl("/CJeanbrunVille", params);

    return this.fetchWithRetry<EspoListResponse<EspoVille>>(url);
  }

  /**
   * Récupère une ville par son slug
   */
  async getVilleBySlug(slug: string): Promise<EspoVille | null> {
    const params = this.buildWhereParams({ cSlug: slug });

    const url = this.buildUrl("/CJeanbrunVille", {
      maxSize: 1,
      ...params,
    });

    const response = await this.fetchWithRetry<EspoListResponse<EspoVille>>(url);

    return response.list[0] ?? null;
  }

  /**
   * Récupère la liste des programmes immobiliers
   */
  async getProgrammes(
    filters?: EspoProgrammeFilters,
    options?: PaginationOptions
  ): Promise<EspoListResponse<EspoProgramme>> {
    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      orderBy: "name",
      order: "asc",
    };

    // Ajouter filtres
    if (filters) {
      const whereParams = this.buildWhereParams({
        cVilleId: filters.villeId,
        cPromoteur: filters.promoteur,
        cActif: filters.actif,
      });

      Object.assign(params, whereParams);

      // Filtres prix (range)
      let whereIndex = Object.keys(whereParams).length / 3;

      if (filters.prixMin !== undefined) {
        params[`where[${whereIndex}][type]`] = "greaterThanOrEquals";
        params[`where[${whereIndex}][attribute]`] = "cPrixMin";
        params[`where[${whereIndex}][value]`] = filters.prixMin;
        whereIndex++;
      }

      if (filters.prixMax !== undefined) {
        params[`where[${whereIndex}][type]`] = "lessThanOrEquals";
        params[`where[${whereIndex}][attribute]`] = "cPrixMax";
        params[`where[${whereIndex}][value]`] = filters.prixMax;
        whereIndex++;
      }
    }

    const url = this.buildUrl("/CJeanbrunProgramme", params);

    return this.fetchWithRetry<EspoListResponse<EspoProgramme>>(url);
  }

  /**
   * Récupère un programme par ID
   */
  async getProgrammeById(id: string): Promise<EspoProgramme> {
    const url = `${this.baseUrl}/CJeanbrunProgramme/${id}`;
    return this.fetchWithRetry<EspoProgramme>(url);
  }

  /**
   * Crée un lead dans EspoCRM (entité Contact)
   */
  async createLead(lead: EspoLead): Promise<EspoLead> {
    const url = `${this.baseUrl}/Contact`;

    return this.fetchWithRetry<EspoLead>(url, {
      method: "POST",
      body: JSON.stringify(lead),
    });
  }

  /**
   * Vérifie si un lead existe déjà par email
   */
  async findLeadByEmail(email: string): Promise<EspoLead | null> {
    const params = this.buildWhereParams({
      emailAddress: email,
      cSource: "simulateur-jeanbrun",
    });

    const url = this.buildUrl("/Contact", {
      maxSize: 1,
      ...params,
    });

    const response = await this.fetchWithRetry<EspoListResponse<EspoLead>>(url);

    return response.list[0] ?? null;
  }

  /**
   * Vérifie la connexion à l'API EspoCRM
   */
  async healthCheck(): Promise<boolean> {
    try {
      const url = this.buildUrl("/CJeanbrunVille", { maxSize: 1 });
      await this.fetchWithRetry(url);
      return true;
    } catch (error) {
      espocrmLogger.error({ err: error }, "EspoCRM health check failed");
      return false;
    }
  }
}
