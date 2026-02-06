/**
 * Types partages pour les resultats de simulation
 * Extraits pour reutilisation entre /simulateur/resultat et /resultats
 * @module lib/simulation-results/types
 */

import type {
  PatrimoineDataPoint,
  TableauAnnuelData,
  RegimeData,
} from "@/components/simulateur/resultats";
import type { AnalyseFinancement } from "@/types/lead-financement";
import type { SimulationWizardState } from "@/contexts/SimulationContext";

/**
 * Local alias for wizard state used in results page.
 * Uses the unified type from SimulationContext to avoid duplication.
 */
export type WizardState = Pick<
  SimulationWizardState,
  "step1" | "step2" | "step3" | "step4" | "step5" | "step6"
>;

/**
 * Calculated simulation results for display
 */
export interface SimulationResults {
  synthese: {
    economieFiscale: number;
    cashFlowMensuel: number;
    rendementNet: number;
    effortEpargne: number;
  };
  graphiqueData: PatrimoineDataPoint[];
  tableauAnnuel: TableauAnnuelData[];
  comparatifLMNP: {
    jeanbrun: RegimeData;
    lmnp: RegimeData;
  };
  financement: AnalyseFinancement;
}
