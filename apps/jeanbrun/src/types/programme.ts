/**
 * Types pour les programmes immobiliers neufs
 */

import type { VilleMarche } from "./ville";

/**
 * Interface Programme immobilier
 * Convertit les centimes en euros et m²×100 en m²
 */
export interface Programme {
  id: string;
  villeId: string;
  nom: string;
  promoteur: string | null;
  adresse: string | null;
  codePostal: string | null;
  prixMin: number | null; // En euros (converti depuis centimes)
  prixMax: number | null; // En euros (converti depuis centimes)
  surfaceMin: number | null; // En m² (converti depuis m²×100)
  surfaceMax: number | null; // En m² (converti depuis m²×100)
  dateLivraison: string | null; // ISO date string
  actif: boolean;
  espoId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Programme avec données ville associées
 */
export interface ProgrammeAvecVille extends Programme {
  ville: VilleMarche | null;
}

/**
 * Données programme pour carte/liste
 */
export interface ProgrammeCarte {
  id: string;
  nom: string;
  promoteur: string | null;
  prixMin: number | null;
  prixMax: number | null;
  surfaceMin: number | null;
  surfaceMax: number | null;
  dateLivraison: string | null;
  ville: {
    nom: string;
    slug: string;
    departement: string;
  };
}

/**
 * Filtres pour recherche de programmes
 */
export interface ProgrammeFilters {
  villeId?: string;
  departement?: string;
  prixMin?: number;
  prixMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  promoteur?: string;
  actif?: boolean;
}

/**
 * Input pour création/mise à jour de programme
 */
export interface ProgrammeInput {
  villeId: string;
  nom: string;
  promoteur?: string | null;
  adresse?: string | null;
  codePostal?: string | null;
  prixMin?: number | null; // En euros
  prixMax?: number | null; // En euros
  surfaceMin?: number | null; // En m²
  surfaceMax?: number | null; // En m²
  dateLivraison?: string | null;
  actif?: boolean;
}

/**
 * Statistiques programmes pour une ville
 */
export interface ProgrammeStats {
  total: number;
  actifs: number;
  prixMoyenMin: number | null;
  prixMoyenMax: number | null;
  surfaceMoyenneMin: number | null;
  surfaceMoyenneMax: number | null;
}
