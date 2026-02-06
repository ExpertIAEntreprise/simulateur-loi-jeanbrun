/**
 * Simulation results shared library
 * Used by both /resultats and /simulateur/resultat routes
 * @module lib/simulation-results
 */

export type { WizardState, SimulationResults } from "./types";
export { loadWizardState } from "./load-wizard-state";
export { isValidWizardState } from "./validate-state";
export { calculateResults, calculatePrixTotal } from "./calculate-results";
