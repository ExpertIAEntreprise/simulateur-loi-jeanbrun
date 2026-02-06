/**
 * Types pour les leads (prospects découverte patrimoniale)
 */

/**
 * Statut du lead dans le pipeline
 */
export type LeadStatut =
  | "nouveau"
  | "contacte"
  | "qualifie"
  | "prospect_chaud"
  | "perdu"
  | "converti";

/**
 * Interface Lead complète
 */
export interface Lead {
  id: string;
  userId: string | null;
  simulationId: string | null;
  email: string;
  telephone: string | null;
  prenom: string | null;
  nom: string | null;
  statut: LeadStatut;
  consentementRgpd: boolean;
  consentementMarketing: boolean;
  dateConsentement: Date | null;
  sourceUtm: string | null;
  espoId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input pour création de lead
 */
export interface LeadInput {
  email: string;
  telephone?: string | null;
  prenom?: string | null;
  nom?: string | null;
  simulationId?: string | null;
  consentementRgpd: boolean;
  consentementMarketing?: boolean;
  sourceUtm?: string | null;
}

/**
 * Lead pour affichage liste
 */
export interface LeadResume {
  id: string;
  email: string;
  prenom: string | null;
  nom: string | null;
  statut: LeadStatut;
  createdAt: Date;
}

/**
 * Filtres pour recherche de leads
 */
export interface LeadFilters {
  statut?: LeadStatut;
  dateDebut?: Date;
  dateFin?: Date;
  search?: string;
  avecSimulation?: boolean;
}

/**
 * Labels français pour les statuts
 */
export const LEAD_STATUT_LABELS: Record<LeadStatut, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  qualifie: "Qualifié",
  prospect_chaud: "Prospect chaud",
  perdu: "Perdu",
  converti: "Converti",
};

/**
 * Couleurs pour badges statut
 */
export const LEAD_STATUT_COLORS: Record<LeadStatut, string> = {
  nouveau: "bg-blue-100 text-blue-800",
  contacte: "bg-yellow-100 text-yellow-800",
  qualifie: "bg-purple-100 text-purple-800",
  prospect_chaud: "bg-orange-100 text-orange-800",
  perdu: "bg-gray-100 text-gray-800",
  converti: "bg-green-100 text-green-800",
};

/**
 * Consentements RGPD requis
 */
export interface ConsentementsRgpd {
  rgpd: boolean; // Obligatoire - traitement données personnelles
  marketing: boolean; // Facultatif - emails commerciaux
}

/**
 * Textes de consentement pour affichage
 */
export const CONSENTEMENTS_TEXTES = {
  rgpd: "J'accepte que mes données soient traitées pour réaliser ma simulation et être recontacté par un conseiller. Voir notre politique de confidentialité.",
  marketing:
    "J'accepte de recevoir des informations commerciales et actualités par email.",
} as const;
