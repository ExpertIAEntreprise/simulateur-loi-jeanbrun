/**
 * Types pour l'intégration EspoCRM du Simulateur Loi Jeanbrun
 *
 * Entités EspoCRM:
 * - CJeanbrunVille: Villes éligibles (51 villes)
 * - CJeanbrunProgramme: Programmes immobiliers neufs
 * - Contact: Leads générés par le simulateur
 */

import type { LeadInput } from "@/types/lead";
import type { ZoneFiscale, TensionLocative, NiveauLoyer } from "@/types/ville";

/**
 * Ville EspoCRM (entité CJeanbrunVille)
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
  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string
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
  cPrixMin: number | null; // Prix minimum (en euros)
  cPrixMax: number | null; // Prix maximum (en euros)
  cSurfaceMin: number | null; // Surface minimale (en m²)
  cSurfaceMax: number | null; // Surface maximale (en m²)
  cDateLivraison: string | null; // Date de livraison prévue (ISO date string)
  cActif: boolean; // Programme actif/inactif
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
    nom: espo.name,
    promoteur: espo.cPromoteur,
    adresse: espo.cAdresse,
    codePostal: espo.cCodePostal,
    prixMin: espo.cPrixMin,
    prixMax: espo.cPrixMax,
    surfaceMin: espo.cSurfaceMin,
    surfaceMax: espo.cSurfaceMax,
    dateLivraison: espo.cDateLivraison,
    actif: espo.cActif,
    espoId: espo.id,
    createdAt: new Date(espo.createdAt),
    updatedAt: new Date(espo.modifiedAt),
  };
}
