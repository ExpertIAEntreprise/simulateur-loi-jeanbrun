/**
 * Tests d'integration pour SimulationContext
 *
 * @module tests/simulateur/context
 * @description Tests du contexte de simulation (etat, validation, persistance)
 *
 * Tests couverts:
 * - Initialisation du contexte
 * - Validation des etapes (isStepValid)
 * - Mise a jour des etapes (updateStep1-6)
 * - Navigation (nextStep, prevStep, goToStep)
 * - Calcul du TMI
 * - Reset de l'etat
 * - Hydratation depuis localStorage
 *
 * @version 1.0
 * @date 2 fevrier 2026
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  SimulationProvider,
  type WizardStep1,
  type WizardStep2,
  type WizardStep3,
  type WizardStep4,
  type WizardStep5,
  type WizardStep6,
} from "@/contexts/SimulationContext";
import { useSimulation } from "@/lib/hooks/useSimulation";

// ============================================================================
// Mock localStorage
// ============================================================================

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// ============================================================================
// Constants - Test Data
// ============================================================================

const STORAGE_KEY = "simulation-wizard-state";

const VALID_STEP1: WizardStep1 = {
  situation: "marie",
  parts: 2,
  revenuNet: 60000,
  objectif: "reduire_impots",
};

const VALID_STEP2_NEUF: WizardStep2 = {
  typeBien: "neuf",
  villeId: "69123",
  villeNom: "Lyon",
  zoneFiscale: "A",
  surface: 50,
  prixAcquisition: 250000,
};

const VALID_STEP2_ANCIEN: WizardStep2 = {
  typeBien: "ancien",
  villeId: "13055",
  villeNom: "Marseille",
  zoneFiscale: "B1",
  surface: 60,
  prixAcquisition: 150000,
  montantTravaux: 50000,
  dpeActuel: "F",
  dpeApres: "B",
};

const VALID_STEP3: WizardStep3 = {
  apport: 50000,
  dureeCredit: 20,
  tauxCredit: 3.5,
  differe: 0,
};

const VALID_STEP4: WizardStep4 = {
  niveauLoyer: "intermediaire",
  loyerMensuel: 758,
  chargesAnnuelles: 1800,
  taxeFonciere: 1200,
  vacance: 3,
};

const VALID_STEP5: WizardStep5 = {
  dureeDetention: 12,
  revalorisation: 2,
  strategieSortie: "revente",
};

const VALID_STEP6: WizardStep6 = {
  structure: "nom_propre",
};

// ============================================================================
// Wrapper Component
// ============================================================================

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SimulationProvider>{children}</SimulationProvider>
);

// ============================================================================
// Tests - Initialisation
// ============================================================================

describe("SimulationContext - Initialisation", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it("devrait initialiser avec un etat vide", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    // Attendre que le loading soit termine
    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    expect(result.current.state.currentStep).toBe(1);
    expect(result.current.state.step1).toEqual({});
    expect(result.current.state.step2).toEqual({});
    expect(result.current.state.step3).toEqual({});
    expect(result.current.state.step4).toEqual({});
    expect(result.current.state.step5).toEqual({});
    expect(result.current.state.step6).toEqual({});
    expect(result.current.state.tmiCalcule).toBeUndefined();
    expect(result.current.state.isDirty).toBe(false);
  });

  it("devrait hydrater depuis localStorage si donnees valides", async () => {
    // Pre-remplir localStorage
    const savedState = {
      currentStep: 3,
      step1: VALID_STEP1,
      step2: VALID_STEP2_NEUF,
      step3: {},
      step4: {},
      step5: {},
      step6: {},
      tmiCalcule: 0.3,
      isLoading: false,
      isDirty: true,
    };

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(savedState));

    const { result } = renderHook(() => useSimulation(), { wrapper });

    // Attendre l'hydratation
    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    expect(result.current.state.currentStep).toBe(3);
    expect(result.current.state.step1.situation).toBe("marie");
    expect(result.current.state.step2.typeBien).toBe("neuf");
    expect(result.current.state.tmiCalcule).toBe(0.3);
  });

  it("devrait ignorer localStorage invalide et demarrer frais", async () => {
    // Mettre des donnees invalides dans localStorage
    localStorageMock.setItem(STORAGE_KEY, "invalid json {{}");

    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    // Devrait avoir un etat vide
    expect(result.current.state.currentStep).toBe(1);
    expect(result.current.state.step1).toEqual({});
  });
});

// ============================================================================
// Tests - Validation des Etapes
// ============================================================================

describe("SimulationContext - Validation isStepValid", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("step 1: devrait etre invalide sans donnees", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    expect(result.current.isStepValid(1)).toBe(false);
  });

  it("step 1: devrait etre valide avec toutes les donnees requises", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep1(VALID_STEP1);
    });

    expect(result.current.isStepValid(1)).toBe(true);
  });

  it("step 1: devrait etre invalide si revenu = 0", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep1({ ...VALID_STEP1, revenuNet: 0 });
    });

    expect(result.current.isStepValid(1)).toBe(false);
  });

  it("step 2 neuf: devrait etre valide avec donnees minimales", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep2(VALID_STEP2_NEUF);
    });

    expect(result.current.isStepValid(2)).toBe(true);
  });

  it("step 2 ancien: devrait etre invalide sans travaux", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep2({
        typeBien: "ancien",
        villeId: "13055",
        surface: 60,
        prixAcquisition: 150000,
        // Pas de montantTravaux, dpeActuel, dpeApres
      });
    });

    expect(result.current.isStepValid(2)).toBe(false);
  });

  it("step 2 ancien: devrait etre valide avec travaux et DPE", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep2(VALID_STEP2_ANCIEN);
    });

    expect(result.current.isStepValid(2)).toBe(true);
  });

  it("step 3: devrait etre invalide avec duree hors limites", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep3({ ...VALID_STEP3, dureeCredit: 5 }); // < 10 ans
    });

    expect(result.current.isStepValid(3)).toBe(false);

    act(() => {
      result.current.updateStep3({ ...VALID_STEP3, dureeCredit: 30 }); // > 25 ans
    });

    expect(result.current.isStepValid(3)).toBe(false);
  });

  it("step 3: devrait etre valide avec donnees correctes", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep3(VALID_STEP3);
    });

    expect(result.current.isStepValid(3)).toBe(true);
  });

  it("step 4: devrait etre valide avec toutes les donnees", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep4(VALID_STEP4);
    });

    expect(result.current.isStepValid(4)).toBe(true);
  });

  it("step 5: devrait etre invalide si duree < 9 ans", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep5({ ...VALID_STEP5, dureeDetention: 5 });
    });

    expect(result.current.isStepValid(5)).toBe(false);
  });

  it("step 5: devrait etre valide avec duree >= 9 ans", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep5(VALID_STEP5);
    });

    expect(result.current.isStepValid(5)).toBe(true);
  });

  it("step 6: devrait etre valide avec structure definie", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep6(VALID_STEP6);
    });

    expect(result.current.isStepValid(6)).toBe(true);
  });

  it("step 6: devrait etre invalide sans structure", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    expect(result.current.isStepValid(6)).toBe(false);
  });
});

// ============================================================================
// Tests - Navigation
// ============================================================================

describe("SimulationContext - Navigation", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("nextStep devrait incrementer currentStep", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    expect(result.current.state.currentStep).toBe(1);

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.state.currentStep).toBe(2);
  });

  it("prevStep devrait decrementer currentStep", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.goToStep(3);
    });

    expect(result.current.state.currentStep).toBe(3);

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.state.currentStep).toBe(2);
  });

  it("goToStep devrait aller a l'etape specifiee", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.goToStep(5);
    });

    expect(result.current.state.currentStep).toBe(5);
  });

  it("goToStep devrait etre limite entre 1 et 6", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.goToStep(0);
    });

    expect(result.current.state.currentStep).toBe(1);

    act(() => {
      result.current.goToStep(10);
    });

    expect(result.current.state.currentStep).toBe(6);
  });
});

// ============================================================================
// Tests - Mise a jour des etapes
// ============================================================================

describe("SimulationContext - Mise a jour", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("updateStep1 devrait mettre a jour step1", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep1({ situation: "celibataire" });
    });

    expect(result.current.state.step1.situation).toBe("celibataire");
    expect(result.current.state.isDirty).toBe(true);
  });

  it("updateStep1 devrait merger avec l'etat existant", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep1({ situation: "marie" });
    });

    act(() => {
      result.current.updateStep1({ revenuNet: 50000 });
    });

    expect(result.current.state.step1.situation).toBe("marie");
    expect(result.current.state.step1.revenuNet).toBe(50000);
  });

  it("setTMI devrait mettre a jour tmiCalcule", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.setTMI(0.3);
    });

    expect(result.current.state.tmiCalcule).toBe(0.3);
  });
});

// ============================================================================
// Tests - Persistance localStorage
// ============================================================================

describe("SimulationContext - Persistance", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("devrait sauvegarder dans localStorage apres mise a jour", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep1(VALID_STEP1);
    });

    // Attendre la sauvegarde
    await vi.waitFor(() => {
      const saved = localStorageMock.getItem(STORAGE_KEY);
      expect(saved).not.toBeNull();
    });

    const saved = JSON.parse(localStorageMock.getItem(STORAGE_KEY)!);
    expect(saved.step1.situation).toBe("marie");
  });

  it("reset devrait effacer localStorage et l'etat", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    // Remplir l'etat
    act(() => {
      result.current.updateStep1(VALID_STEP1);
      result.current.updateStep2(VALID_STEP2_NEUF);
    });

    // Verifier que localStorage a ete rempli
    await vi.waitFor(() => {
      const saved = localStorageMock.getItem(STORAGE_KEY);
      expect(saved).not.toBeNull();
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    // Verifier que localStorage est vide
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();

    // Verifier que l'etat est reinitialise
    expect(result.current.state.step1).toEqual({});
    expect(result.current.state.step2).toEqual({});
    expect(result.current.state.currentStep).toBe(1);
    expect(result.current.state.isDirty).toBe(false);
  });
});

// ============================================================================
// Tests - Hook useSimulation
// ============================================================================

describe("useSimulation Hook", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("devrait lever une erreur si utilise hors du Provider", () => {
    // Rendre le hook sans le wrapper
    expect(() => {
      renderHook(() => useSimulation());
    }).toThrow(/SimulationProvider/);
  });

  it("devrait retourner toutes les methodes du contexte", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    expect(result.current.state).toBeDefined();
    expect(typeof result.current.goToStep).toBe("function");
    expect(typeof result.current.nextStep).toBe("function");
    expect(typeof result.current.prevStep).toBe("function");
    expect(typeof result.current.updateStep1).toBe("function");
    expect(typeof result.current.updateStep2).toBe("function");
    expect(typeof result.current.updateStep3).toBe("function");
    expect(typeof result.current.updateStep4).toBe("function");
    expect(typeof result.current.updateStep5).toBe("function");
    expect(typeof result.current.updateStep6).toBe("function");
    expect(typeof result.current.setTMI).toBe("function");
    expect(typeof result.current.reset).toBe("function");
    expect(typeof result.current.isStepValid).toBe("function");
  });
});

// ============================================================================
// Tests - Edge Cases
// ============================================================================

describe("SimulationContext - Edge Cases", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("devrait gerer les mises a jour rapides successives", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep1({ situation: "celibataire" });
      result.current.updateStep1({ parts: 1 });
      result.current.updateStep1({ revenuNet: 30000 });
      result.current.updateStep1({ objectif: "patrimoine" });
    });

    expect(result.current.state.step1.situation).toBe("celibataire");
    expect(result.current.state.step1.parts).toBe(1);
    expect(result.current.state.step1.revenuNet).toBe(30000);
    expect(result.current.state.step1.objectif).toBe("patrimoine");
  });

  it("devrait gerer les valeurs numeriques limites", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateStep1({
        ...VALID_STEP1,
        revenuNet: 1000000, // 1M EUR
      });
    });

    expect(result.current.state.step1.revenuNet).toBe(1000000);

    act(() => {
      result.current.updateStep2({
        ...VALID_STEP2_NEUF,
        surface: 9, // Surface minimum Carrez
      });
    });

    expect(result.current.state.step2.surface).toBe(9);
  });

  it("devrait gerer le changement de type de bien (neuf -> ancien)", async () => {
    const { result } = renderHook(() => useSimulation(), { wrapper });

    await vi.waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    // Commencer avec neuf
    act(() => {
      result.current.updateStep2(VALID_STEP2_NEUF);
    });

    expect(result.current.isStepValid(2)).toBe(true);

    // Changer en ancien sans les champs requis
    act(() => {
      result.current.updateStep2({ typeBien: "ancien" });
    });

    expect(result.current.isStepValid(2)).toBe(false);

    // Ajouter les champs requis pour ancien
    act(() => {
      result.current.updateStep2({
        typeBien: "ancien",
        montantTravaux: 50000,
        dpeActuel: "F",
        dpeApres: "B",
      });
    });

    expect(result.current.isStepValid(2)).toBe(true);
  });
});
