/**
 * Types pour les leads financement/courtier
 */

/**
 * Statut du lead financement
 */
export type LeadFinancementStatut =
  | "nouveau"
  | "transmis_courtier"
  | "en_cours"
  | "finance"
  | "refuse"
  | "abandonne";

/**
 * Analyse de finançabilité d'un dossier
 */
export interface AnalyseFinancement {
  /** Montant à emprunter (prix - apport) */
  montantEmprunt: number;
  /** Mensualité estimée du crédit */
  mensualiteEstimee: number;
  /** Taux d'endettement calculé (0-1) */
  tauxEndettement: number;
  /** Taux d'endettement en pourcentage (0-100) */
  tauxEndettementPourcent: number;
  /** Le dossier respecte-t-il les 35% HCSF ? */
  respecteHCSF: boolean;
  /** Le dossier est-il sous 33% (confortable) ? */
  dossierConfortable: boolean;
  /** Reste à vivre mensuel après crédit */
  resteAVivre: number;
  /** Message d'analyse */
  verdict: "financable" | "tendu" | "difficile";
  /** Description du verdict */
  verdictMessage: string;
}

/**
 * Données d'un lead financement
 */
export interface LeadFinancement {
  id: string;
  simulationId: string | null;

  // Coordonnées
  email: string;
  telephone: string;
  prenom: string;
  nom: string;

  // Données financières (issues de la simulation)
  revenuMensuel: number;
  montantProjet: number;
  apport: number;
  montantEmprunt: number;
  dureeEmpruntMois: number;
  tauxEndettement: number;
  mensualiteEstimee: number;

  // Données projet
  villeProjet: string | null;
  typeBien: "neuf" | "ancien" | null;

  // Statut
  statut: LeadFinancementStatut;
  courtierPartenaire: string | null;

  // RGPD
  consentementRgpd: boolean;
  consentementCourtier: boolean;
  dateConsentement: Date;

  // Tracking
  sourceUtm: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input pour création de lead financement
 */
export interface LeadFinancementInput {
  email: string;
  telephone: string;
  prenom: string;
  nom: string;

  // Données simulation (optionnelles, pré-remplies si disponibles)
  simulationId?: string | null;
  revenuMensuel: number;
  montantProjet: number;
  apport: number;
  montantEmprunt: number;
  dureeEmpruntMois: number;
  tauxEndettement: number;
  mensualiteEstimee: number;
  villeProjet?: string | null;
  typeBien?: "neuf" | "ancien" | null;

  // Consentements
  consentementRgpd: boolean;
  consentementCourtier: boolean;

  // Tracking
  sourceUtm?: string | null;
}

/**
 * Labels français pour les statuts
 */
export const LEAD_FINANCEMENT_STATUT_LABELS: Record<LeadFinancementStatut, string> = {
  nouveau: "Nouveau",
  transmis_courtier: "Transmis au courtier",
  en_cours: "En cours de traitement",
  finance: "Financé",
  refuse: "Refusé",
  abandonne: "Abandonné",
};

/**
 * Seuils d'endettement HCSF
 */
export const SEUILS_ENDETTEMENT = {
  /** Seuil maximum HCSF (35%) */
  maximum: 0.35,
  /** Seuil recommandé (33%) */
  recommande: 0.33,
  /** Seuil confortable (30%) */
  confortable: 0.30,
} as const;

/**
 * Textes de consentement spécifiques au financement
 */
export const CONSENTEMENTS_FINANCEMENT = {
  rgpd: "J'accepte que mes données soient transmises à un courtier partenaire pour étudier mon financement. Voir notre politique de confidentialité.",
  courtier: "J'accepte d'être recontacté par téléphone par un courtier partenaire dans les 48h.",
} as const;
