/**
 * Client API EspoCRM pour le Simulateur Loi Jeanbrun
 *
 * Gère les requêtes vers EspoCRM avec retry automatique et gestion d'erreurs.
 */

import type { ZoneFiscale } from "@/types/ville";
import { espocrmLogger } from "@/lib/logger";
import type {
  EspoVille,
  EspoProgramme,
  EspoLead,
  EspoBarometre,
  EspoListResponse,
  EspoVilleFilters,
  EspoProgrammeFilters,
  EspoBarometreFilters,
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
    // Déterminer le champ de tri EspoCRM
    let orderByField = "name";
    let orderDirection: "asc" | "desc" = "asc";

    if (filters?.orderBy) {
      switch (filters.orderBy) {
        case "prix":
          orderByField = "prixM2Moyen";
          break;
        default:
          orderByField = "name";
      }
    }

    if (filters?.order) {
      orderDirection = filters.order;
    }

    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      orderBy: orderByField,
      order: orderDirection,
    };

    // Ajouter filtres
    if (filters) {
      const whereParams = this.buildWhereParams({
        departementId: filters.departementId,
        regionId: filters.regionId,
        isMetropole: filters.isMetropole,
      });

      Object.assign(params, whereParams);

      // Calculer l'index pour les where clauses additionnelles
      let whereIndex = Object.keys(whereParams).length / 3; // 3 params par where clause

      // Recherche par nom (like)
      if (filters.search) {
        params[`where[${whereIndex}][type]`] = "like";
        params[`where[${whereIndex}][attribute]`] = "name";
        params[`where[${whereIndex}][value]`] = `%${filters.search}%`;
        whereIndex++;
      }

      // Filtre prix minimum
      if (filters.prixMin !== undefined) {
        params[`where[${whereIndex}][type]`] = "greaterThanOrEquals";
        params[`where[${whereIndex}][attribute]`] = "prixM2Moyen";
        params[`where[${whereIndex}][value]`] = filters.prixMin;
        whereIndex++;
      }

      // Filtre prix maximum
      if (filters.prixMax !== undefined) {
        params[`where[${whereIndex}][type]`] = "lessThanOrEquals";
        params[`where[${whereIndex}][attribute]`] = "prixM2Moyen";
        params[`where[${whereIndex}][value]`] = filters.prixMax;
      }
    }

    const url = this.buildUrl("/CJeanbrunVille", params);

    return this.fetchWithRetry<EspoListResponse<EspoVille>>(url);
  }

  /**
   * Récupère une ville par son slug
   */
  async getVilleBySlug(slug: string): Promise<EspoVille | null> {
    const params = this.buildWhereParams({ slug: slug });

    const url = this.buildUrl("/CJeanbrunVille", {
      maxSize: 1,
      ...params,
    });

    const response = await this.fetchWithRetry<EspoListResponse<EspoVille>>(url);

    return response.list[0] ?? null;
  }

  /**
   * Récupère une ville par son ID
   */
  async getVilleById(id: string): Promise<EspoVille> {
    const url = `${this.baseUrl}/CJeanbrunVille/${id}`;
    return this.fetchWithRetry<EspoVille>(url);
  }

  /**
   * Récupère toutes les métropoles (isMetropole=true)
   */
  async getMetropoles(options?: PaginationOptions): Promise<EspoListResponse<EspoVille>> {
    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 100,
      offset: options?.offset ?? 0,
      orderBy: "name",
      order: "asc",
    };

    const whereParams = this.buildWhereParams({ isMetropole: true });
    Object.assign(params, whereParams);

    const url = this.buildUrl("/CJeanbrunVille", params);

    return this.fetchWithRetry<EspoListResponse<EspoVille>>(url);
  }

  /**
   * Récupère les villes périphériques d'une métropole
   */
  async getVillesPeripheriques(
    metropoleId: string,
    options?: PaginationOptions
  ): Promise<EspoListResponse<EspoVille>> {
    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      orderBy: "name",
      order: "asc",
    };

    const whereParams = this.buildWhereParams({ metropoleParentId: metropoleId });
    Object.assign(params, whereParams);

    const url = this.buildUrl("/CJeanbrunVille", params);

    return this.fetchWithRetry<EspoListResponse<EspoVille>>(url);
  }

  /**
   * Récupère une ville par slug avec données enrichies (programmes, baromètre, villes proches)
   */
  async getVilleBySlugEnriched(slug: string): Promise<{
    ville: EspoVille | null;
    programmes: EspoProgramme[];
    barometre: EspoBarometre | null;
    villesPeripheriques: EspoVille[];
    metropoleParent: EspoVille | null;
    villesProches: EspoVille[];
  }> {
    const ville = await this.getVilleBySlug(slug);

    if (!ville) {
      return {
        ville: null,
        programmes: [],
        barometre: null,
        villesPeripheriques: [],
        metropoleParent: null,
        villesProches: [],
      };
    }

    // Récupérer en parallèle: programmes, baromètre, villes liées, villes proches
    const [programmesResponse, barometre, villesLiees, metropoleParent, villesProches] = await Promise.all([
      this.getProgrammes({ villeId: ville.id, actif: true, authorized: true }, { limit: 10 }),
      this.getLatestBarometre(ville.id),
      ville.isMetropole
        ? this.getVillesPeripheriques(ville.id, { limit: 8 })
        : Promise.resolve({ total: 0, list: [] }),
      ville.metropoleParentId
        ? this.getVilleById(ville.metropoleParentId).catch(() => null)
        : Promise.resolve(null),
      this.getVillesProches(ville, 6),
    ]);

    return {
      ville,
      programmes: programmesResponse.list,
      barometre,
      villesPeripheriques: villesLiees.list,
      metropoleParent,
      villesProches,
    };
  }

  /**
   * Récupère tous les slugs de villes pour generateStaticParams()
   */
  async getAllVilleSlugs(): Promise<string[]> {
    const slugs: string[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getVilles(undefined, { limit, offset });
      slugs.push(...response.list.map((v) => v.slug));

      if (response.list.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    return slugs;
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
      // Note: les champs EspoCRM n'ont PAS de prefixe 'c'
      const whereParams = this.buildWhereParams({
        villeId: filters.villeId,
        promoteur: filters.promoteur,
        authorized: filters.authorized,
        // actif n'existe pas, utiliser statut si necessaire
      });

      Object.assign(params, whereParams);

      // Filtres prix (range)
      let whereIndex = Object.keys(whereParams).length / 3;

      if (filters.prixMin !== undefined) {
        params[`where[${whereIndex}][type]`] = "greaterThanOrEquals";
        params[`where[${whereIndex}][attribute]`] = "prixMin";
        params[`where[${whereIndex}][value]`] = filters.prixMin;
        whereIndex++;
      }

      if (filters.prixMax !== undefined) {
        params[`where[${whereIndex}][type]`] = "lessThanOrEquals";
        params[`where[${whereIndex}][attribute]`] = "prixMax";
        params[`where[${whereIndex}][value]`] = filters.prixMax;
        whereIndex++;
      }
    }

    const url = this.buildUrl("/CJeanbrunProgramme", params);

    return this.fetchWithRetry<EspoListResponse<EspoProgramme>>(url);
  }

  /**
   * Récupère un programme par son slug
   */
  async getProgrammeBySlug(slug: string): Promise<EspoProgramme | null> {
    const params = this.buildWhereParams({ slug: slug, authorized: true });

    const url = this.buildUrl("/CJeanbrunProgramme", {
      maxSize: 1,
      ...params,
    });

    const response = await this.fetchWithRetry<EspoListResponse<EspoProgramme>>(url);

    return response.list[0] ?? null;
  }

  /**
   * Récupère tous les slugs de programmes pour generateStaticParams()
   */
  async getAllProgrammeSlugs(): Promise<string[]> {
    const slugs: string[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getProgrammes({ authorized: true }, { limit, offset });
      for (const p of response.list) {
        if (p.slug) {
          slugs.push(p.slug);
        }
      }

      if (response.list.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    return slugs;
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
   * Récupère le dernier baromètre d'une ville
   */
  async getLatestBarometre(villeId: string): Promise<EspoBarometre | null> {
    const params: Record<string, string | number> = {
      maxSize: 1,
      orderBy: "mois",
      order: "desc",
    };

    // Note: les champs EspoCRM n'ont PAS de prefixe 'c'
    const whereParams = this.buildWhereParams({ villeId: villeId });
    Object.assign(params, whereParams);

    const url = this.buildUrl("/CJeanbrunBarometre", params);

    const response = await this.fetchWithRetry<EspoListResponse<EspoBarometre>>(url);

    return response.list[0] ?? null;
  }

  /**
   * Récupère l'historique des baromètres d'une ville sur N mois
   */
  async getBarometreHistorique(
    villeId: string,
    months: number = 12
  ): Promise<EspoBarometre[]> {
    const params: Record<string, string | number> = {
      maxSize: months,
      orderBy: "mois",
      order: "desc",
    };

    // Note: les champs EspoCRM n'ont PAS de prefixe 'c'
    const whereParams = this.buildWhereParams({ villeId: villeId });
    Object.assign(params, whereParams);

    const url = this.buildUrl("/CJeanbrunBarometre", params);

    const response = await this.fetchWithRetry<EspoListResponse<EspoBarometre>>(url);

    return response.list;
  }

  /**
   * Récupère les baromètres avec filtres
   */
  async getBarometres(
    filters?: EspoBarometreFilters,
    options?: PaginationOptions
  ): Promise<EspoListResponse<EspoBarometre>> {
    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      orderBy: "mois",
      order: "desc",
    };

    if (filters) {
      // Note: les champs EspoCRM n'ont PAS de prefixe 'c'
      const whereParams = this.buildWhereParams({
        villeId: filters.villeId,
      });
      Object.assign(params, whereParams);

      // Filtres de date
      let whereIndex = Object.keys(whereParams).length / 3;

      if (filters.moisMin) {
        params[`where[${whereIndex}][type]`] = "greaterThanOrEquals";
        params[`where[${whereIndex}][attribute]`] = "mois";
        params[`where[${whereIndex}][value]`] = filters.moisMin;
        whereIndex++;
      }

      if (filters.moisMax) {
        params[`where[${whereIndex}][type]`] = "lessThanOrEquals";
        params[`where[${whereIndex}][attribute]`] = "mois";
        params[`where[${whereIndex}][value]`] = filters.moisMax;
      }
    }

    const url = this.buildUrl("/CJeanbrunBarometre", params);

    return this.fetchWithRetry<EspoListResponse<EspoBarometre>>(url);
  }

  /**
   * Récupère les villes de la même région (pour maillage interne)
   */
  async getVillesByRegionId(
    regionId: string,
    excludeSlug?: string,
    options?: PaginationOptions
  ): Promise<EspoListResponse<EspoVille>> {
    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 10,
      offset: options?.offset ?? 0,
      orderBy: "prixM2Moyen",
      order: "desc",
    };

    const whereParams = this.buildWhereParams({ regionId: regionId });
    Object.assign(params, whereParams);

    // Exclure la ville actuelle si spécifiée
    if (excludeSlug) {
      const whereIndex = Object.keys(whereParams).length / 3;
      params[`where[${whereIndex}][type]`] = "notEquals";
      params[`where[${whereIndex}][attribute]`] = "slug";
      params[`where[${whereIndex}][value]`] = excludeSlug;
    }

    const url = this.buildUrl("/CJeanbrunVille", params);

    return this.fetchWithRetry<EspoListResponse<EspoVille>>(url);
  }

  /**
   * Récupère les villes d'un département (hors ville exclue)
   */
  async getVillesByDepartementId(
    departementId: string,
    excludeSlug?: string,
    options?: PaginationOptions
  ): Promise<EspoListResponse<EspoVille>> {
    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 10,
      offset: options?.offset ?? 0,
      orderBy: "prixM2Moyen",
      order: "desc",
    };

    const whereParams = this.buildWhereParams({ departementId: departementId });
    Object.assign(params, whereParams);

    if (excludeSlug) {
      const whereIndex = Object.keys(whereParams).length / 3;
      params[`where[${whereIndex}][type]`] = "notEquals";
      params[`where[${whereIndex}][attribute]`] = "slug";
      params[`where[${whereIndex}][value]`] = excludeSlug;
    }

    const url = this.buildUrl("/CJeanbrunVille", params);

    return this.fetchWithRetry<EspoListResponse<EspoVille>>(url);
  }

  /**
   * Récupère les métropoles d'une zone fiscale donnée, triées par prix décroissant
   */
  private async getMetropolesByZoneFiscale(
    zoneFiscale: ZoneFiscale,
    excludeSlug?: string,
    options?: PaginationOptions
  ): Promise<EspoListResponse<EspoVille>> {
    const params: Record<string, string | number> = {
      maxSize: options?.limit ?? 10,
      offset: options?.offset ?? 0,
      orderBy: "prixM2Moyen",
      order: "desc",
    };

    const whereParams = this.buildWhereParams({
      isMetropole: true,
      zoneFiscale,
    });
    Object.assign(params, whereParams);

    if (excludeSlug) {
      const whereIndex = Object.keys(whereParams).length / 3;
      params[`where[${whereIndex}][type]`] = "notEquals";
      params[`where[${whereIndex}][attribute]`] = "slug";
      params[`where[${whereIndex}][value]`] = excludeSlug;
    }

    const url = this.buildUrl("/CJeanbrunVille", params);

    return this.fetchWithRetry<EspoListResponse<EspoVille>>(url);
  }

  /**
   * Récupère les métropoles triées par prix décroissant (fallback final)
   */
  private async getMetropolesByPrix(
    excludeSlug?: string,
    options?: PaginationOptions
  ): Promise<EspoListResponse<EspoVille>> {
    const params: Record<string, string | number> = {
      maxSize: (options?.limit ?? 10) + 1,
      offset: options?.offset ?? 0,
      orderBy: "prixM2Moyen",
      order: "desc",
    };

    const whereParams = this.buildWhereParams({ isMetropole: true });
    Object.assign(params, whereParams);

    if (excludeSlug) {
      const whereIndex = Object.keys(whereParams).length / 3;
      params[`where[${whereIndex}][type]`] = "notEquals";
      params[`where[${whereIndex}][attribute]`] = "slug";
      params[`where[${whereIndex}][value]`] = excludeSlug;
    }

    const url = this.buildUrl("/CJeanbrunVille", params);

    const result =
      await this.fetchWithRetry<EspoListResponse<EspoVille>>(url);

    return {
      ...result,
      list: result.list.slice(0, options?.limit ?? 10),
    };
  }

  /**
   * Récupère les villes proches pour le maillage interne
   * Priorise les villes de la même région, puis du même département,
   * puis la même zone fiscale, puis les métropoles par prix
   */
  async getVillesProches(
    ville: EspoVille,
    limit: number = 6
  ): Promise<EspoVille[]> {
    // Si c'est une périphérique, récupérer les autres périphériques de la même métropole
    if (!ville.isMetropole && ville.metropoleParentId) {
      const peripheriques = await this.getVillesPeripheriques(
        ville.metropoleParentId,
        { limit: limit + 1 }
      );
      // Exclure la ville actuelle
      return peripheriques.list
        .filter((v) => v.slug !== ville.slug)
        .slice(0, limit);
    }

    // Si c'est une métropole, récupérer d'autres métropoles de la même région
    if (ville.regionId) {
      const villesRegion = await this.getVillesByRegionId(
        ville.regionId,
        ville.slug,
        { limit: limit }
      );
      if (villesRegion.list.length > 0) {
        return villesRegion.list;
      }
    }

    // Fallback par département si regionId absent ou vide
    if (ville.departementId) {
      const villesDept = await this.getVillesByDepartementId(
        ville.departementId,
        ville.slug,
        { limit: limit }
      );
      if (villesDept.list.length > 0) {
        return villesDept.list;
      }
    }

    // Fallback par zone fiscale: villes de la même zone triées par prix
    if (ville.zoneFiscale) {
      const villesZone = await this.getMetropolesByZoneFiscale(
        ville.zoneFiscale,
        ville.slug,
        { limit }
      );
      if (villesZone.list.length > 0) {
        return villesZone.list;
      }
    }

    // Dernier fallback: métropoles triées par prix (grandes villes avec du marché)
    const metropoles = await this.getMetropolesByPrix(ville.slug, {
      limit,
    });
    return metropoles.list;
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
