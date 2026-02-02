/**
 * Storage adapter for the simulation wizard state.
 *
 * This abstraction enables:
 * - Easy mocking in tests (inject a memory storage)
 * - Potential future storage backends (sessionStorage, IndexedDB, server-side)
 * - SSR safety (window check centralized here)
 *
 * @module lib/storage/wizard-storage
 */

import type { SimulationWizardState } from "@/contexts/SimulationContext";

const STORAGE_KEY = "simulation-wizard-state";

/**
 * Interface for wizard state storage.
 * Implementations can use localStorage, sessionStorage, memory, or any backend.
 */
export interface WizardStorage {
  /**
   * Load wizard state from storage.
   * @returns The saved state, or null if not found or invalid.
   */
  load(): SimulationWizardState | null;

  /**
   * Save wizard state to storage.
   * @param state - The state to persist.
   */
  save(state: SimulationWizardState): void;

  /**
   * Clear stored wizard state.
   */
  clear(): void;
}

/**
 * localStorage-based implementation of WizardStorage.
 * Safe for SSR (returns null/no-op when window is undefined).
 */
export const localWizardStorage: WizardStorage = {
  load(): SimulationWizardState | null {
    if (typeof window === "undefined") return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved) as unknown;

      // Basic structure validation
      if (
        parsed &&
        typeof parsed === "object" &&
        "currentStep" in parsed &&
        "step1" in parsed
      ) {
        return parsed as SimulationWizardState;
      }

      return null;
    } catch {
      // Invalid JSON or structure
      return null;
    }
  },

  save(state: SimulationWizardState): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage might be full or disabled
      console.warn("[WizardStorage] Failed to save state to localStorage");
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

/**
 * In-memory storage implementation for testing.
 * Does not persist between page reloads.
 */
export function createMemoryStorage(): WizardStorage {
  let stored: SimulationWizardState | null = null;

  return {
    load(): SimulationWizardState | null {
      return stored;
    },

    save(state: SimulationWizardState): void {
      stored = { ...state };
    },

    clear(): void {
      stored = null;
    },
  };
}
