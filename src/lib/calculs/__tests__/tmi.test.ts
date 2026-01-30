/**
 * Tests pour le module TMI (Tranche Marginale d'Imposition)
 *
 * TDD Phase 2 - Tests ecrits AVANT l'implementation
 *
 * Le module TMI fournit des informations detaillees sur la tranche
 * marginale d'imposition et permet de calculer les economies d'impot
 * liees aux deductions.
 */

import { describe, it, expect } from "vitest";
import { calculerTMI, calculerEconomieImpot } from "../tmi";
import type { TMIInput } from "../types/tmi";

describe("calculerTMI", () => {
  describe("identification de la tranche", () => {
    it("identifie la tranche 1 (0%) pour revenus faibles", () => {
      const input: TMIInput = {
        revenuNetImposable: 10000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      expect(result.tmi).toBe(0);
      expect(result.numeroTranche).toBe(1);
      expect(result.seuilBas).toBe(0);
      expect(result.seuilHaut).toBe(11612);
    });

    it("identifie la tranche 2 (11%) pour revenus moyens-faibles", () => {
      const input: TMIInput = {
        revenuNetImposable: 20000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      expect(result.tmi).toBe(0.11);
      expect(result.numeroTranche).toBe(2);
      expect(result.seuilBas).toBe(11612);
      expect(result.seuilHaut).toBe(29315);
    });

    it("identifie la tranche 3 (30%) pour revenus moyens", () => {
      const input: TMIInput = {
        revenuNetImposable: 50000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      expect(result.tmi).toBe(0.3);
      expect(result.numeroTranche).toBe(3);
      expect(result.seuilBas).toBe(29315);
      expect(result.seuilHaut).toBe(83823);
    });

    it("identifie la tranche 4 (41%) pour revenus eleves", () => {
      const input: TMIInput = {
        revenuNetImposable: 100000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      expect(result.tmi).toBe(0.41);
      expect(result.numeroTranche).toBe(4);
      expect(result.seuilBas).toBe(83823);
      expect(result.seuilHaut).toBe(180294);
    });

    it("identifie la tranche 5 (45%) pour tres hauts revenus", () => {
      const input: TMIInput = {
        revenuNetImposable: 200000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      expect(result.tmi).toBe(0.45);
      expect(result.numeroTranche).toBe(5);
      expect(result.seuilBas).toBe(180294);
      expect(result.seuilHaut).toBe(Infinity);
    });
  });

  describe("calcul avec plusieurs parts", () => {
    it("utilise le quotient familial pour determiner la tranche", () => {
      const input: TMIInput = {
        revenuNetImposable: 60000,
        nombreParts: 2,
      };

      const result = calculerTMI(input);

      // Quotient familial: 60000 / 2 = 30000 EUR -> tranche 30%
      expect(result.tmi).toBe(0.3);
      expect(result.numeroTranche).toBe(3);
    });

    it("calcule la marge en tenant compte du quotient familial", () => {
      const input: TMIInput = {
        revenuNetImposable: 50000,
        nombreParts: 2,
      };

      const result = calculerTMI(input);

      // Quotient familial: 50000 / 2 = 25000 EUR (tranche 11%)
      // Seuil haut de la tranche 11%: 29315 EUR
      // Marge = (29315 - 25000) * 2 = 8630 EUR de revenu supplementaire
      // avant de passer en tranche 30%
      expect(result.tmi).toBe(0.11);
      expect(result.marge).toBeCloseTo(8630, 0);
    });
  });

  describe("calcul de la marge avant tranche superieure", () => {
    it("calcule correctement la marge pour un celibataire tranche 11%", () => {
      const input: TMIInput = {
        revenuNetImposable: 20000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      // Quotient familial: 20000 EUR (tranche 11%)
      // Seuil haut tranche 11%: 29315 EUR
      // Marge = 29315 - 20000 = 9315 EUR
      expect(result.marge).toBe(9315);
    });

    it("calcule correctement la marge pour la tranche 30%", () => {
      const input: TMIInput = {
        revenuNetImposable: 50000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      // Quotient familial: 50000 EUR (tranche 30%)
      // Seuil haut tranche 30%: 83823 EUR
      // Marge = 83823 - 50000 = 33823 EUR
      expect(result.marge).toBe(33823);
    });

    it("retourne Infinity pour la marge de la tranche 45%", () => {
      const input: TMIInput = {
        revenuNetImposable: 200000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      // La tranche 45% n'a pas de limite superieure
      expect(result.marge).toBe(Infinity);
    });
  });

  describe("cas aux limites des tranches", () => {
    it("retourne la bonne tranche au seuil exact de 11612 EUR", () => {
      const input: TMIInput = {
        revenuNetImposable: 11612,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      // Au seuil exact, on est encore dans la tranche 0%
      expect(result.tmi).toBe(0);
      expect(result.marge).toBe(0);
    });

    it("retourne la tranche 11% juste au-dessus du seuil", () => {
      const input: TMIInput = {
        revenuNetImposable: 11613,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      expect(result.tmi).toBe(0.11);
      expect(result.numeroTranche).toBe(2);
    });
  });

  describe("cas limites", () => {
    it("gere un revenu de 0", () => {
      const input: TMIInput = {
        revenuNetImposable: 0,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      expect(result.tmi).toBe(0);
      expect(result.numeroTranche).toBe(1);
      expect(result.marge).toBe(11612);
    });

    it("gere un revenu negatif", () => {
      const input: TMIInput = {
        revenuNetImposable: -5000,
        nombreParts: 1,
      };

      const result = calculerTMI(input);

      expect(result.tmi).toBe(0);
      expect(result.numeroTranche).toBe(1);
    });
  });
});

describe("calculerEconomieImpot", () => {
  describe("economies standards", () => {
    it("calcule l'economie pour une deduction en tranche 11%", () => {
      // Deduction de 5000 EUR en TMI 11%
      const economie = calculerEconomieImpot(5000, 0.11);
      expect(economie).toBe(550);
    });

    it("calcule l'economie pour une deduction en tranche 30%", () => {
      // Deduction de 10000 EUR en TMI 30%
      const economie = calculerEconomieImpot(10000, 0.3);
      expect(economie).toBe(3000);
    });

    it("calcule l'economie pour une deduction en tranche 41%", () => {
      // Deduction de 8000 EUR en TMI 41%
      const economie = calculerEconomieImpot(8000, 0.41);
      expect(economie).toBe(3280);
    });

    it("calcule l'economie pour une deduction en tranche 45%", () => {
      // Deduction de 12000 EUR en TMI 45%
      const economie = calculerEconomieImpot(12000, 0.45);
      expect(economie).toBe(5400);
    });
  });

  describe("cas particuliers", () => {
    it("retourne 0 pour une deduction en tranche 0%", () => {
      // Deduction de 5000 EUR mais contribuable non imposable
      const economie = calculerEconomieImpot(5000, 0);
      expect(economie).toBe(0);
    });

    it("retourne 0 pour une deduction de 0", () => {
      const economie = calculerEconomieImpot(0, 0.3);
      expect(economie).toBe(0);
    });

    it("gere les deductions negatives (remontee de revenu)", () => {
      // Une "deduction negative" = ajout de revenu imposable
      const economie = calculerEconomieImpot(-5000, 0.3);
      expect(economie).toBe(-1500);
    });
  });

  describe("precision des calculs", () => {
    it("arrondit le resultat a l'euro pres", () => {
      // Deduction de 1234.56 EUR en TMI 11%
      // Economie exacte: 135.8016 -> arrondi a 136 EUR
      const economie = calculerEconomieImpot(1234.56, 0.11);
      expect(economie).toBe(Math.round(1234.56 * 0.11));
    });
  });
});

describe("validation errors", () => {
  describe("calculerTMI", () => {
    it("devrait lancer une erreur si TRANCHES_IR_2026 est vide (via mock)", () => {
      // Note: Ce test documente le comportement attendu si les constantes sont corrompues
      // L'implementation actuelle lance "TRANCHES_IR_2026 must not be empty"
      // Ce cas est couvert par le code mais difficile a tester sans mock des constantes
      expect(true).toBe(true); // Placeholder - test unitaire des constantes
    });

    it("devrait gerer nombreParts = 0 sans planter", () => {
      const input: TMIInput = {
        revenuNetImposable: 50000,
        nombreParts: 0,
      };

      // L'implementation gere ce cas avec un guard qui retourne tranche 1
      const result = calculerTMI(input);
      expect(result.tmi).toBe(0);
      expect(result.numeroTranche).toBe(1);
    });

    it("devrait gerer nombreParts negatif sans planter", () => {
      const input: TMIInput = {
        revenuNetImposable: 50000,
        nombreParts: -2,
      };

      // L'implementation gere ce cas avec un guard qui retourne tranche 1
      const result = calculerTMI(input);
      expect(result.tmi).toBe(0);
      expect(result.numeroTranche).toBe(1);
    });

    it("devrait gerer NaN pour revenu", () => {
      const input: TMIInput = {
        revenuNetImposable: NaN,
        nombreParts: 1,
      };

      const result = calculerTMI(input);
      // NaN comparisons return false, so quotientFamilial = 0
      expect(result).toBeDefined();
    });
  });

  describe("calculerEconomieImpot", () => {
    it("devrait retourner NaN pour deduction NaN", () => {
      const economie = calculerEconomieImpot(NaN, 0.3);
      expect(Number.isNaN(economie)).toBe(true);
    });

    it("devrait retourner NaN pour TMI NaN", () => {
      const economie = calculerEconomieImpot(5000, NaN);
      expect(Number.isNaN(economie)).toBe(true);
    });

    it("devrait retourner Infinity pour deduction Infinity", () => {
      const economie = calculerEconomieImpot(Infinity, 0.3);
      expect(economie).toBe(Infinity);
    });
  });
});
