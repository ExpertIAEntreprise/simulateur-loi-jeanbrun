/**
 * Helper pour charger le state du wizard depuis localStorage
 * @module lib/simulation-results/load-wizard-state
 */

import type { WizardState } from "./types";

const STORAGE_KEY = "simulation-wizard-state";

/**
 * Load wizard state from localStorage
 * @returns WizardState if valid JSON exists, null otherwise
 */
export function loadWizardState(): WizardState | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as unknown;
      if (parsed && typeof parsed === "object") {
        return parsed as WizardState;
      }
    }
  } catch {
    // Invalid JSON - return null silently
  }
  return null;
}
