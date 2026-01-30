/**
 * Point d'entrée pour tous les types du simulateur Loi Jeanbrun
 *
 * Usage:
 * import { Ville, Programme, SimulationInput, Lead } from "@/types"
 */

// Types Ville
export type {
  Ville,
  VilleMarche,
  VilleFilters,
  ZoneFiscale,
  TensionLocative,
  NiveauLoyer,
} from "./ville";

export {
  ZONE_FISCALE_LABELS,
  TENSION_LOCATIVE_LABELS,
  NIVEAU_LOYER_LABELS,
} from "./ville";

// Types Programme
export type {
  Programme,
  ProgrammeAvecVille,
  ProgrammeCarte,
  ProgrammeFilters,
  ProgrammeInput,
  ProgrammeStats,
} from "./programme";

// Types Simulation
export type {
  SimulationInput,
  SimulationResultat,
  SimulationProjection,
  Simulation,
  SimulationResume,
  DureeAmortissement,
} from "./simulation";

export { PARAMETRES_JEANBRUN } from "./simulation";

// Types Lead
export type {
  Lead,
  LeadInput,
  LeadResume,
  LeadFilters,
  LeadStatut,
  ConsentementsRgpd,
} from "./lead";

export {
  LEAD_STATUT_LABELS,
  LEAD_STATUT_COLORS,
  CONSENTEMENTS_TEXTES,
} from "./lead";
