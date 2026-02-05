/**
 * Types pour l'intégration EspoCRM du Simulateur Loi Jeanbrun
 *
 * Entités EspoCRM:
 * - CJeanbrunVille: Villes éligibles (382 villes: 52 métropoles + 330 périphériques)
 * - CJeanbrunProgramme: Programmes immobiliers neufs
 * - CJeanbrunBarometre: Baromètre mensuel par ville
 * - Contact: Leads générés par le simulateur
 */

import type { LeadInput } from "@/types/lead";
import type { ZoneFiscale, TensionLocative, NiveauLoyer } from "@/types/ville";

/**
 * Item FAQ pour JSON-LD FAQPage
 */
export interface EspoFaqItem {
  question: string;
  answer: string;
}

/**
 * Arguments d'investissement personnalisés
 */
export interface EspoArgumentInvestissement {
  titre: string;
  description?: string;
}

/**
 * Ville EspoCRM (entité CJeanbrunVille)
 * 382 villes: 52 métropoles + 330 périphériques
 *
 * Note: Les noms de champs correspondent à l'API EspoCRM (sans préfixe c)
 */
export interface EspoVille {
  id: string;
  name: string; // Nom de la ville
  deleted?: boolean;

  // Identifiants
  codeInsee: string; // Code INSEE
  codePostal: string | null; // Code postal
  slug: string; // Slug URL

  // Localisation
  departementId: string | null; // ID du département
  departementName?: string | null; // Nom du département (expand)
  regionId: string | null; // ID de la région
  regionName?: string | null; // Nom de la région (expand)

  // Métropole/périphérique
  isMetropole: boolean; // true pour les 52 métropoles principales
  metropoleParentId: string | null; // ID de la métropole parent (pour périphériques)
  metropoleParentName?: string | null; // Nom de la métropole parent (expand)

  // Données marché
  prixM2Moyen: number | null; // Prix moyen au m² (en euros)
  prixM2Median: number | null; // Prix médian au m² (en euros)
  evolutionPrix1An: number | null; // Évolution prix sur 1 an (%)
  nbTransactions12Mois: number | null; // Nombre de transactions sur 12 mois

  // Arguments et FAQ (JSON strings)
  argumentsInvestissement: string | null; // JSON array string
  faqItems: string | null; // JSON array string

  // Zone fiscale et marché locatif
  zoneFiscale: ZoneFiscale | null;
  tensionLocative: TensionLocative | null;
  niveauLoyer: NiveauLoyer | null;
  loyerM2Moyen: number | null;

  // Plafonds Jeanbrun
  plafondLoyerJeanbrun: number | null;
  plafondPrixJeanbrun: number | null;

  // Données INSEE
  population: number | null;
  revenuMedian: number | null;

  // Géolocalisation
  latitude: number | null;
  longitude: number | null;

  // Contenu SEO
  photoVille: string | null;
  photoVilleAlt: string | null;
  contenuEditorial: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

/**
 * Baromètre mensuel EspoCRM (entité CJeanbrunBarometre)
 */
export interface EspoBarometre {
  id: string;
  name: string; // Ex: "Lyon - Janvier 2026"
  cVilleId: string; // ID de la ville
  cVilleName?: string; // Nom de la ville (expand)
  cMois: string; // Format: "YYYY-MM-01"
  cScoreAttractivite: number; // Score 0-100
  cPrixM2: number | null; // Prix au m²
  cEvolutionPrixMois: number | null; // Évolution prix sur le mois (%)
  cLoyerM2: number | null; // Loyer au m²
  cRendementBrut: number | null; // Rendement brut (%)
  cNbProgrammesActifs: number; // Nombre de programmes actifs
  cMeilleureOpportuniteId: string | null; // ID du meilleur programme
  cMeilleureOpportuniteName?: string | null; // Nom du programme (expand)
  cAnalyseIA: string | null; // Analyse IA (~300 mots)
  createdAt: string;
  modifiedAt: string;
}

/**
 * Filtres pour récupération de baromètres
 */
export interface EspoBarometreFilters {
  villeId?: string;
  moisMin?: string; // Format: "YYYY-MM-01"
  moisMax?: string; // Format: "YYYY-MM-01"
}

/**
 * Programme immobilier EspoCRM (entité CJeanbrunProgramme)
 *
 * Note: Les noms de champs correspondent à l'API EspoCRM (sans préfixe c)
 */
export interface EspoProgramme {
  id: string;
  name: string; // Nom du programme
  description: string | null; // Description du programme (remplie par scraping)
  promoteur: string | null; // Nom du promoteur
  adresse: string | null; // Adresse
  codePostal: string | null; // Code postal
  villeId: string; // ID de la ville (relation)
  villeName?: string; // Nom de la ville (expand)
  prixMin: number | null; // Prix minimum (en euros)
  prixMax: number | null; // Prix maximum (en euros)
  prixM2Moyen: number | null; // Prix moyen au m²
  surfaceMin: number | null; // Surface minimale (en m²)
  surfaceMax: number | null; // Surface maximale (en m²)
  dateLivraison: string | null; // Date de livraison prévue (ISO date string)

  // Images SEO
  imagePrincipale: string | null; // URL image principale
  imageAlt: string | null; // Alt text SEO

  // Géolocalisation
  latitude: number | null;
  longitude: number | null;

  // Lots disponibles
  nbLotsTotal: number | null;
  nbLotsDisponibles: number | null;
  typesLots: string | null; // JSON array: ["T1", "T2", "T3", "T4"]

  // Statut et éligibilité
  statut: string | null; // Ex: "disponible", "en_commercialisation"
  zoneFiscale: string | null; // Zone fiscale (A_BIS, A, B1, B2, C)
  eligibleJeanbrun: boolean | null; // Éligible à la loi Jeanbrun

  // URLs et identifiants externes
  slug: string | null; // Slug URL
  urlExterne: string | null; // URL vers le site du promoteur
  sourceApi: string | null; // Source de l'API (ex: "nexity")
  idExterne: string | null; // ID externe du programme

  // Informations complémentaires
  isLocal: boolean | null; // Programme local
  siteWeb: string | null; // Site web du promoteur
  telephone: string | null; // Téléphone contact
  images: string | null; // JSON array d'URLs d'images supplémentaires

  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string
}

/**
 * Programme avec données ville jointes
 */
export interface EspoProgrammeAvecVille extends EspoProgramme {
  ville?: EspoVille; // Données de la ville (si expand utilisé)
}

/**
 * Lead EspoCRM (entité Contact avec champ source)
 */
export interface EspoLead {
  id?: string;
  emailAddress: string;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  cSource: "simulateur-jeanbrun"; // Source fixe
  cSimulationId?: string | null; // ID de la simulation locale
  cConsentementRgpd?: boolean; // Consentement RGPD
  cConsentementMarketing?: boolean; // Consentement marketing
  cDateConsentement?: string | null; // Date consentement (ISO date string)
  cSourceUtm?: string | null; // Source UTM
  description?: string | null; // Notes
}

/**
 * Options de tri pour les villes
 */
export type VilleSortField = "name" | "prix" | "population";
export type SortOrder = "asc" | "desc";

/**
 * Filtres pour recherche de villes
 */
export interface EspoVilleFilters {
  departementId?: string;
  regionId?: string;
  search?: string; // Recherche par nom
  prixMin?: number; // Prix m² minimum
  prixMax?: number; // Prix m² maximum
  orderBy?: VilleSortField; // Champ de tri
  order?: SortOrder; // Direction du tri
  isMetropole?: boolean; // Filtrer par métropole
  zoneFiscale?: ZoneFiscale; // Filtre par zone fiscale
  tensionLocative?: TensionLocative; // Filtre par tension locative
}

/**
 * Filtres pour recherche de programmes
 */
export interface EspoProgrammeFilters {
  villeId?: string;
  departement?: string;
  promoteur?: string;
  actif?: boolean;
  prixMin?: number;
  prixMax?: number;
}

/**
 * Réponse API EspoCRM pour liste
 */
export interface EspoListResponse<T> {
  total: number;
  list: T[];
}

/**
 * Convertit un Lead local en EspoLead pour création
 */
export function toEspoLead(lead: LeadInput): EspoLead {
  const espoLead: EspoLead = {
    emailAddress: lead.email,
    cSource: "simulateur-jeanbrun",
    cConsentementRgpd: lead.consentementRgpd,
    cDateConsentement: new Date().toISOString(),
  };

  // Ajouter les champs optionnels seulement s'ils sont définis
  if (lead.telephone !== undefined && lead.telephone !== null) {
    espoLead.phoneNumber = lead.telephone;
  }

  if (lead.prenom !== undefined && lead.prenom !== null) {
    espoLead.firstName = lead.prenom;
  }

  if (lead.nom !== undefined && lead.nom !== null) {
    espoLead.lastName = lead.nom;
  }

  if (lead.simulationId !== undefined && lead.simulationId !== null) {
    espoLead.cSimulationId = lead.simulationId;
  }

  if (lead.consentementMarketing !== undefined) {
    espoLead.cConsentementMarketing = lead.consentementMarketing;
  }

  if (lead.sourceUtm !== undefined && lead.sourceUtm !== null) {
    espoLead.cSourceUtm = lead.sourceUtm;
  }

  return espoLead;
}

/**
 * Convertit une EspoVille en Ville locale
 */
export function fromEspoVille(espo: EspoVille) {
  return {
    id: espo.id, // On utilise l'ID EspoCRM comme ID local pour sync
    codeInsee: espo.codeInsee,
    codePostal: espo.codePostal,
    nom: espo.name,
    departement: espo.departementName ?? null,
    departementId: espo.departementId,
    region: espo.regionName ?? null,
    regionId: espo.regionId,
    prixM2Moyen: espo.prixM2Moyen,
    prixM2Median: espo.prixM2Median,
    slug: espo.slug,
    espoId: espo.id,
    zoneFiscale: espo.zoneFiscale,
    tensionLocative: espo.tensionLocative,
    niveauLoyer: espo.niveauLoyer,
    loyerM2Moyen: espo.loyerM2Moyen,
    population: espo.population,
  };
}

/**
 * Convertit un EspoProgramme en Programme local
 */
export function fromEspoProgramme(espo: EspoProgramme) {
  return {
    id: espo.id, // On utilise l'ID EspoCRM comme ID local pour sync
    villeId: espo.villeId,
    villeName: espo.villeName ?? null,
    nom: espo.name,
    promoteur: espo.promoteur,
    adresse: espo.adresse,
    codePostal: espo.codePostal,
    prixMin: espo.prixMin,
    prixMax: espo.prixMax,
    prixM2Moyen: espo.prixM2Moyen,
    surfaceMin: espo.surfaceMin,
    surfaceMax: espo.surfaceMax,
    dateLivraison: espo.dateLivraison,
    statut: espo.statut,
    imagePrincipale: espo.imagePrincipale,
    imageAlt: espo.imageAlt,
    latitude: espo.latitude,
    longitude: espo.longitude,
    nbLotsTotal: espo.nbLotsTotal,
    nbLotsDisponibles: espo.nbLotsDisponibles,
    typesLots: parseJsonField<string[]>(espo.typesLots, []),
    zoneFiscale: espo.zoneFiscale,
    eligibleJeanbrun: espo.eligibleJeanbrun,
    slug: espo.slug,
    urlExterne: espo.urlExterne,
    sourceApi: espo.sourceApi,
    idExterne: espo.idExterne,
    espoId: espo.id,
    createdAt: new Date(espo.createdAt),
    updatedAt: new Date(espo.modifiedAt),
  };
}

/**
 * Convertit un EspoBarometre en Barometre local
 */
export function fromEspoBarometre(espo: EspoBarometre) {
  return {
    id: espo.id,
    villeId: espo.cVilleId,
    villeName: espo.cVilleName ?? null,
    mois: espo.cMois,
    scoreAttractivite: espo.cScoreAttractivite,
    prixM2: espo.cPrixM2,
    evolutionPrixMois: espo.cEvolutionPrixMois,
    loyerM2: espo.cLoyerM2,
    rendementBrut: espo.cRendementBrut,
    nbProgrammesActifs: espo.cNbProgrammesActifs,
    meilleureOpportuniteId: espo.cMeilleureOpportuniteId,
    meilleureOpportuniteName: espo.cMeilleureOpportuniteName ?? null,
    analyseIA: espo.cAnalyseIA,
    createdAt: new Date(espo.createdAt),
    updatedAt: new Date(espo.modifiedAt),
  };
}

/**
 * Parse un champ JSON string vers un type typé
 */
export function parseJsonField<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Extrait les arguments d'investissement d'une ville
 * Note: argumentsInvestissement est un JSON array string ou "Array" si non parsé
 */
export function getVilleArguments(ville: EspoVille): string[] {
  if (!ville.argumentsInvestissement) return [];
  if (ville.argumentsInvestissement === "Array") return [];
  return parseJsonField<string[]>(ville.argumentsInvestissement, []);
}

/**
 * Extrait les FAQ d'une ville
 * Note: faqItems est un JSON array string ou "Array" si non parsé
 */
export function getVilleFaq(ville: EspoVille): EspoFaqItem[] {
  if (!ville.faqItems) return [];
  if (ville.faqItems === "Array") return [];
  return parseJsonField<EspoFaqItem[]>(ville.faqItems, []);
}

/**
 * Convertit fromEspoVille enrichie avec champs métropole/périphérique
 */
export function fromEspoVilleEnriched(espo: EspoVille) {
  const base = fromEspoVille(espo);
  return {
    ...base,
    isMetropole: espo.isMetropole,
    metropoleParentId: espo.metropoleParentId,
    metropoleParentName: espo.metropoleParentName ?? null,
    arguments: getVilleArguments(espo),
    faqItems: getVilleFaq(espo),
    evolutionPrix1An: espo.evolutionPrix1An,
    nbTransactions12Mois: espo.nbTransactions12Mois,
    plafondLoyerJeanbrun: espo.plafondLoyerJeanbrun,
    plafondPrixJeanbrun: espo.plafondPrixJeanbrun,
    latitude: espo.latitude,
    longitude: espo.longitude,
    photoVille: espo.photoVille,
    photoVilleAlt: espo.photoVilleAlt,
    contenuEditorial: espo.contenuEditorial,
    metaTitle: espo.metaTitle,
    metaDescription: espo.metaDescription,
    revenuMedian: espo.revenuMedian,
  };
}
