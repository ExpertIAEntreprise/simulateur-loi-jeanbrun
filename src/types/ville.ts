/**
 * Types pour les villes et données marché immobilier
 */

// Enums correspondant aux pgEnum du schéma
export type ZoneFiscale = "A_BIS" | "A" | "B1" | "B2" | "C";

export type TensionLocative = "tres_tendu" | "tendu" | "equilibre" | "detendu";

export type NiveauLoyer = "haut" | "moyen" | "bas";

/**
 * Interface Ville pour le frontend
 * Convertit les centimes en euros et ajoute des champs calculés
 */
export interface Ville {
  id: string;
  codeInsee: string;
  nom: string;
  departement: string;
  region: string | null;
  zoneFiscale: ZoneFiscale;
  tensionLocative: TensionLocative | null;
  niveauLoyer: NiveauLoyer | null;
  prixM2Moyen: number | null; // En euros (converti depuis centimes)
  loyerM2Moyen: number | null; // En euros/mois (converti depuis centimes)
  populationCommune: number | null;
  slug: string;
  espoId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Données marché pour affichage condensé
 */
export interface VilleMarche {
  id: string;
  nom: string;
  slug: string;
  departement: string;
  zoneFiscale: ZoneFiscale;
  prixM2Moyen: number | null;
  loyerM2Moyen: number | null;
  tensionLocative: TensionLocative | null;
}

/**
 * Filtres pour recherche de villes
 */
export interface VilleFilters {
  departement?: string;
  zoneFiscale?: ZoneFiscale;
  tensionLocative?: TensionLocative;
  prixM2Min?: number;
  prixM2Max?: number;
  search?: string;
}

/**
 * Labels français pour les zones fiscales
 */
export const ZONE_FISCALE_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "Zone A bis (Paris et communes limitrophes)",
  A: "Zone A (Agglomération parisienne, Côte d'Azur)",
  B1: "Zone B1 (Grandes agglomérations > 250k hab.)",
  B2: "Zone B2 (Villes moyennes > 50k hab.)",
  C: "Zone C (Reste du territoire)",
};

/**
 * Labels français pour la tension locative
 */
export const TENSION_LOCATIVE_LABELS: Record<TensionLocative, string> = {
  tres_tendu: "Très tendu",
  tendu: "Tendu",
  equilibre: "Équilibré",
  detendu: "Détendu",
};

/**
 * Labels français pour le niveau de loyer
 */
export const NIVEAU_LOYER_LABELS: Record<NiveauLoyer, string> = {
  haut: "Loyer élevé",
  moyen: "Loyer moyen",
  bas: "Loyer bas",
};
