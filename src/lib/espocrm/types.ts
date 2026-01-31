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
 */
export interface EspoVille {
  id: string;
  name: string; // Nom de la ville
  cCodeInsee: string; // Code INSEE
  cDepartement: string; // Code département
  cRegion: string | null; // Région
  cZoneFiscale: ZoneFiscale; // A_BIS, A, B1, B2, C
  cTensionLocative: TensionLocative | null; // tres_tendu, tendu, equilibre, detendu
  cNiveauLoyer: NiveauLoyer | null; // haut, moyen, bas
  cPrixM2Moyen: number | null; // Prix moyen au m² (en euros)
  cLoyerM2Moyen: number | null; // Loyer moyen au m²/mois (en euros)
  cPopulationCommune: number | null; // Population de la commune
  cSlug: string; // Slug URL

  // Champs métropole/périphérique (Phase 2)
  cIsMetropole: boolean; // true pour les 52 métropoles principales
  cMetropoleParentId: string | null; // ID de la métropole parent (pour périphériques)
  cMetropoleParentName?: string | null; // Nom de la métropole parent (expand)

  // Contenu éditorial SEO
  cPhotoVille: string | null; // URL photo représentative
  cPhotoVilleAlt: string | null; // Alt text SEO
  cContenuEditorial: string | null; // Contenu 300-600 mots
  cMetaTitle: string | null; // Meta title SEO
  cMetaDescription: string | null; // Meta description SEO

  // Arguments et FAQ (JSON strings)
  cArgumentsInvestissement: string | null; // JSON array of EspoArgumentInvestissement
  cFaqItems: string | null; // JSON array of EspoFaqItem

  // Géolocalisation
  cLatitude: number | null;
  cLongitude: number | null;

  // Données DVF
  cEvolutionPrix1An: number | null; // Évolution prix sur 1 an (%)
  cNbTransactions12Mois: number | null; // Nombre de transactions sur 12 mois

  // Données INSEE
  cRevenuMedian: number | null; // Revenu médian

  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string
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
 */
export interface EspoProgramme {
  id: string;
  name: string; // Nom du programme
  cPromoteur: string | null; // Nom du promoteur
  cAdresse: string | null; // Adresse
  cCodePostal: string | null; // Code postal
  cVilleId: string; // ID de la ville (relation)
  cVilleName?: string; // Nom de la ville (expand)
  cPrixMin: number | null; // Prix minimum (en euros)
  cPrixMax: number | null; // Prix maximum (en euros)
  cPrixM2Moyen: number | null; // Prix moyen au m²
  cSurfaceMin: number | null; // Surface minimale (en m²)
  cSurfaceMax: number | null; // Surface maximale (en m²)
  cDateLivraison: string | null; // Date de livraison prévue (ISO date string)
  cActif: boolean; // Programme actif/inactif

  // Images SEO
  cImagePrincipale: string | null; // URL image principale
  cImageAlt: string | null; // Alt text SEO

  // Géolocalisation
  cLatitude: number | null;
  cLongitude: number | null;

  // Lots disponibles
  cNbLotsTotal: number | null;
  cNbLotsDisponibles: number | null;
  cTypesLots: string | null; // JSON array: ["T1", "T2", "T3", "T4"]

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
 * Filtres pour recherche de villes
 */
export interface EspoVilleFilters {
  departement?: string;
  zoneFiscale?: ZoneFiscale;
  tensionLocative?: TensionLocative;
  search?: string; // Recherche par nom
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
    codeInsee: espo.cCodeInsee,
    nom: espo.name,
    departement: espo.cDepartement,
    region: espo.cRegion,
    zoneFiscale: espo.cZoneFiscale,
    tensionLocative: espo.cTensionLocative,
    niveauLoyer: espo.cNiveauLoyer,
    prixM2Moyen: espo.cPrixM2Moyen,
    loyerM2Moyen: espo.cLoyerM2Moyen,
    populationCommune: espo.cPopulationCommune,
    slug: espo.cSlug,
    espoId: espo.id,
    createdAt: new Date(espo.createdAt),
    updatedAt: new Date(espo.modifiedAt),
  };
}

/**
 * Convertit un EspoProgramme en Programme local
 */
export function fromEspoProgramme(espo: EspoProgramme) {
  return {
    id: espo.id, // On utilise l'ID EspoCRM comme ID local pour sync
    villeId: espo.cVilleId,
    villeName: espo.cVilleName ?? null,
    nom: espo.name,
    promoteur: espo.cPromoteur,
    adresse: espo.cAdresse,
    codePostal: espo.cCodePostal,
    prixMin: espo.cPrixMin,
    prixMax: espo.cPrixMax,
    prixM2Moyen: espo.cPrixM2Moyen,
    surfaceMin: espo.cSurfaceMin,
    surfaceMax: espo.cSurfaceMax,
    dateLivraison: espo.cDateLivraison,
    actif: espo.cActif,
    imagePrincipale: espo.cImagePrincipale,
    imageAlt: espo.cImageAlt,
    latitude: espo.cLatitude,
    longitude: espo.cLongitude,
    nbLotsTotal: espo.cNbLotsTotal,
    nbLotsDisponibles: espo.cNbLotsDisponibles,
    typesLots: parseJsonField<string[]>(espo.cTypesLots, []),
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
 */
export function getVilleArguments(ville: EspoVille): EspoArgumentInvestissement[] {
  return parseJsonField<EspoArgumentInvestissement[]>(ville.cArgumentsInvestissement, []);
}

/**
 * Extrait les FAQ d'une ville
 */
export function getVilleFaq(ville: EspoVille): EspoFaqItem[] {
  return parseJsonField<EspoFaqItem[]>(ville.cFaqItems, []);
}

/**
 * Convertit fromEspoVille enrichie avec champs métropole/périphérique
 */
export function fromEspoVilleEnriched(espo: EspoVille) {
  const base = fromEspoVille(espo);
  return {
    ...base,
    isMetropole: espo.cIsMetropole,
    metropoleParentId: espo.cMetropoleParentId,
    metropoleParentName: espo.cMetropoleParentName ?? null,
    photoVille: espo.cPhotoVille,
    photoVilleAlt: espo.cPhotoVilleAlt,
    contenuEditorial: espo.cContenuEditorial,
    metaTitle: espo.cMetaTitle,
    metaDescription: espo.cMetaDescription,
    arguments: getVilleArguments(espo),
    faqItems: getVilleFaq(espo),
    latitude: espo.cLatitude,
    longitude: espo.cLongitude,
    evolutionPrix1An: espo.cEvolutionPrix1An,
    nbTransactions12Mois: espo.cNbTransactions12Mois,
    revenuMedian: espo.cRevenuMedian,
  };
}
