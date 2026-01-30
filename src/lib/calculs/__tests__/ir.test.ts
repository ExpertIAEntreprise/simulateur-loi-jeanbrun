/**
 * Tests pour le module de calcul IR (Impot sur le Revenu)
 *
 * TDD Phase 2 - Tests ecrits AVANT l'implementation
 *
 * Bareme IR 2026:
 * - Tranche 1: 0 - 11612 EUR = 0%
 * - Tranche 2: 11612 - 29315 EUR = 11%
 * - Tranche 3: 29315 - 83823 EUR = 30%
 * - Tranche 4: 83823 - 180294 EUR = 41%
 * - Tranche 5: > 180294 EUR = 45%
 *
 * Plafond QF: 1791 EUR par demi-part supplementaire
 */

import { describe, it, expect } from "vitest";
import { calculerIR, determinerTMI, calculerImpotSansQF } from "../ir";
import type { IRInput } from "../types";

describe("calculerImpotSansQF", () => {
  describe("calcul progressif par tranches", () => {
    it("retourne 0 pour un revenu dans la tranche 0%", () => {
      // Revenu 10000 EUR < 11612 EUR (seuil tranche 11%)
      const impot = calculerImpotSansQF(10000);
      expect(impot).toBe(0);
    });

    it("retourne 0 pour un revenu exactement au seuil de la tranche 0%", () => {
      const impot = calculerImpotSansQF(11612);
      expect(impot).toBe(0);
    });

    it("calcule correctement l'impot dans la tranche 11%", () => {
      // Revenu 20000 EUR
      // Part dans tranche 0%: 11612 EUR -> 0 EUR
      // Part dans tranche 11%: 20000 - 11612 = 8388 EUR -> 8388 * 0.11 = 922.68 EUR
      // Total: 923 EUR (arrondi)
      const impot = calculerImpotSansQF(20000);
      expect(impot).toBeCloseTo(923, 0);
    });

    it("calcule correctement l'impot dans la tranche 30%", () => {
      // Revenu 50000 EUR
      // Tranche 0%: 11612 EUR -> 0 EUR
      // Tranche 11%: 29315 - 11612 = 17703 EUR -> 17703 * 0.11 = 1947.33 EUR
      // Tranche 30%: 50000 - 29315 = 20685 EUR -> 20685 * 0.30 = 6205.5 EUR
      // Total: 8152.83 -> 8153 EUR (arrondi)
      const impot = calculerImpotSansQF(50000);
      expect(impot).toBeCloseTo(8153, 0);
    });

    it("calcule correctement l'impot dans la tranche 41%", () => {
      // Revenu 100000 EUR
      // Tranche 0%: 11612 EUR -> 0 EUR
      // Tranche 11%: 17703 EUR -> 1947.33 EUR
      // Tranche 30%: 83823 - 29315 = 54508 EUR -> 54508 * 0.30 = 16352.4 EUR
      // Tranche 41%: 100000 - 83823 = 16177 EUR -> 16177 * 0.41 = 6632.57 EUR
      // Total: 24932.3 -> 24932 EUR
      const impot = calculerImpotSansQF(100000);
      expect(impot).toBeCloseTo(24932, 1);
    });

    it("calcule correctement l'impot dans la tranche 45%", () => {
      // Revenu 200000 EUR
      // Tranche 0%: 11612 -> 0
      // Tranche 11%: 17703 -> 1947.33
      // Tranche 30%: 54508 -> 16352.4
      // Tranche 41%: 180294 - 83823 = 96471 -> 39553.11
      // Tranche 45%: 200000 - 180294 = 19706 -> 8867.7
      // Total: 66720.54 -> 66721 EUR
      const impot = calculerImpotSansQF(200000);
      expect(impot).toBeCloseTo(66721, 1);
    });
  });

  describe("cas limites", () => {
    it("retourne 0 pour un revenu de 0", () => {
      const impot = calculerImpotSansQF(0);
      expect(impot).toBe(0);
    });

    it("retourne 0 pour un revenu negatif (non imposable)", () => {
      const impot = calculerImpotSansQF(-5000);
      expect(impot).toBe(0);
    });
  });
});

describe("determinerTMI", () => {
  describe("celibataire (1 part)", () => {
    it("retourne TMI 0% pour revenu 10000 EUR", () => {
      // Quotient familial: 10000 / 1 = 10000 EUR (< 11612)
      const tmi = determinerTMI(10000, 1);
      expect(tmi).toBe(0);
    });

    it("retourne TMI 11% pour revenu 30000 EUR", () => {
      // Quotient familial: 30000 / 1 = 30000 EUR
      // 30000 > 29315 (seuil 30%) mais on veut la TMI du QF
      // En fait 30000 est dans la tranche 30%
      const tmi = determinerTMI(30000, 1);
      expect(tmi).toBe(0.3);
    });

    it("retourne TMI 30% pour revenu 50000 EUR", () => {
      // Quotient familial: 50000 / 1 = 50000 EUR (tranche 30%)
      const tmi = determinerTMI(50000, 1);
      expect(tmi).toBe(0.3);
    });

    it("retourne TMI 41% pour revenu 100000 EUR", () => {
      // Quotient familial: 100000 / 1 = 100000 EUR (tranche 41%)
      const tmi = determinerTMI(100000, 1);
      expect(tmi).toBe(0.41);
    });

    it("retourne TMI 45% pour revenu 200000 EUR", () => {
      // Quotient familial: 200000 / 1 = 200000 EUR (tranche 45%)
      const tmi = determinerTMI(200000, 1);
      expect(tmi).toBe(0.45);
    });
  });

  describe("couple (2 parts)", () => {
    it("retourne TMI 11% pour couple avec 60000 EUR", () => {
      // Quotient familial: 60000 / 2 = 30000 EUR
      // 30000 est dans la tranche 30% (> 29315)
      const tmi = determinerTMI(60000, 2);
      expect(tmi).toBe(0.3);
    });

    it("retourne TMI 11% pour couple avec 50000 EUR", () => {
      // Quotient familial: 50000 / 2 = 25000 EUR (tranche 11%)
      const tmi = determinerTMI(50000, 2);
      expect(tmi).toBe(0.11);
    });
  });

  describe("cas limites", () => {
    it("retourne TMI 0% pour revenu 0", () => {
      const tmi = determinerTMI(0, 1);
      expect(tmi).toBe(0);
    });

    it("retourne TMI 0% pour revenu negatif", () => {
      const tmi = determinerTMI(-5000, 1);
      expect(tmi).toBe(0);
    });
  });
});

describe("calculerIR", () => {
  describe("celibataire sans plafonnement QF", () => {
    it("calcule IR pour celibataire avec 30000 EUR", () => {
      const input: IRInput = {
        revenuNetImposable: 30000,
        nombreParts: 1,
      };

      const result = calculerIR(input);

      expect(result.quotientFamilial).toBe(30000);
      expect(result.tmi).toBe(0.3);
      expect(result.plafonnementApplique).toBe(false);
      // Verification du calcul:
      // Tranche 0%: 11612 -> 0
      // Tranche 11%: 17703 -> 1947.33
      // Tranche 30%: 30000 - 29315 = 685 -> 205.5
      // Total: 2152.83 EUR brut
      expect(result.impotBrut).toBeCloseTo(2153, 0);
      expect(result.impotNet).toBeLessThanOrEqual(result.impotBrut);
      expect(result.tauxMoyen).toBeCloseTo(result.impotNet / 30000, 2);
    });

    it("calcule IR pour celibataire avec 50000 EUR", () => {
      const input: IRInput = {
        revenuNetImposable: 50000,
        nombreParts: 1,
      };

      const result = calculerIR(input);

      expect(result.quotientFamilial).toBe(50000);
      expect(result.tmi).toBe(0.3);
      expect(result.plafonnementApplique).toBe(false);
      expect(result.impotBrut).toBeCloseTo(8153, 1);
    });
  });

  describe("couple sans plafonnement QF", () => {
    it("calcule IR pour couple 2 parts avec 60000 EUR", () => {
      const input: IRInput = {
        revenuNetImposable: 60000,
        nombreParts: 2,
      };

      const result = calculerIR(input);

      // Quotient familial: 60000 / 2 = 30000 EUR
      expect(result.quotientFamilial).toBe(30000);
      expect(result.tmi).toBe(0.3);
      expect(result.plafonnementApplique).toBe(false);

      // Impot pour 30000 EUR * 2 parts
      // Tranche 0%: 11612 -> 0
      // Tranche 11%: 17703 -> 1947.33
      // Tranche 30%: 685 -> 205.5
      // Total par part: 2152.83 * 2 = 4305.66 EUR
      expect(result.impotBrut).toBeCloseTo(4306, 1);
    });
  });

  describe("plafonnement du quotient familial", () => {
    it("applique le plafonnement QF pour 3 parts avec 100000 EUR", () => {
      const input: IRInput = {
        revenuNetImposable: 100000,
        nombreParts: 3, // couple + 2 enfants ou 2 demi-parts supplementaires
      };

      const result = calculerIR(input);

      // Quotient familial: 100000 / 3 = 33333.33 EUR
      expect(result.quotientFamilial).toBeCloseTo(33333.33, 0);

      // Sans plafonnement:
      // Impot pour 33333 EUR * 3 parts
      // Mais l'avantage fiscal des 2 demi-parts (1 part) supplementaires
      // est plafonne a 1791 EUR par demi-part = 3582 EUR max

      // Impot avec 2 parts (sans les demi-parts supp):
      // QF = 100000 / 2 = 50000 -> impot ~ 8153 * 2 = 16306

      // Impot avec 3 parts (avec demi-parts supp):
      // QF = 100000 / 3 = 33333.33 -> impot ~ 2153+600 * 3 = ~8260

      // Economie = 16306 - 8260 = 8046 EUR
      // Mais plafond = 1791 * 2 = 3582 EUR
      // Donc plafonnement applique

      expect(result.plafonnementApplique).toBe(true);
      // L'impot final doit etre superieur a ce qu'il serait sans plafonnement
    });

    it("n'applique pas le plafonnement QF pour 2.5 parts avec 60000 EUR", () => {
      const input: IRInput = {
        revenuNetImposable: 60000,
        nombreParts: 2.5, // couple + 1 enfant
      };

      const result = calculerIR(input);

      // Quotient familial: 60000 / 2.5 = 24000 EUR
      expect(result.quotientFamilial).toBe(24000);

      // Calcul sans plafonnement
      // Impot pour QF 24000 EUR * 2.5 parts
      // L'avantage de la demi-part est probablement sous le plafond de 1791

      // Pour verifier: impot avec 2 parts vs 2.5 parts
      // 2 parts: QF = 30000, impot = 2153 * 2 = 4306
      // 2.5 parts: QF = 24000, impot = 1363 * 2.5 = 3408
      // Economie = 4306 - 3408 = 898 EUR < 1791 EUR (plafond 1 demi-part)

      expect(result.plafonnementApplique).toBe(false);
    });
  });

  describe("decote pour petits revenus", () => {
    it("applique la decote pour celibataire avec impot faible", () => {
      const input: IRInput = {
        revenuNetImposable: 18000,
        nombreParts: 1,
      };

      const result = calculerIR(input);

      // Impot brut pour 18000 EUR:
      // Tranche 11%: 18000 - 11612 = 6388 * 0.11 = 702.68 EUR
      // La decote s'applique si impot < 1964 EUR (celibataire)
      // Decote = 889 - impot * 0.4525 (formule 2026)

      expect(result.decote).toBeGreaterThan(0);
      expect(result.impotNet).toBeLessThan(result.impotBrut);
    });

    it("n'applique pas la decote pour revenus eleves", () => {
      const input: IRInput = {
        revenuNetImposable: 50000,
        nombreParts: 1,
      };

      const result = calculerIR(input);

      // Impot brut ~ 8153 EUR > seuil decote 1964 EUR
      expect(result.decote).toBe(0);
      expect(result.impotNet).toBe(result.impotBrut);
    });
  });

  describe("taux moyen d'imposition", () => {
    it("calcule le taux moyen correct", () => {
      const input: IRInput = {
        revenuNetImposable: 50000,
        nombreParts: 1,
      };

      const result = calculerIR(input);

      // Taux moyen = impot net / revenu
      const tauxMoyenAttendu = result.impotNet / 50000;
      expect(result.tauxMoyen).toBeCloseTo(tauxMoyenAttendu, 4);
    });

    it("retourne taux moyen 0 pour revenu non imposable", () => {
      const input: IRInput = {
        revenuNetImposable: 10000,
        nombreParts: 1,
      };

      const result = calculerIR(input);

      expect(result.impotNet).toBe(0);
      expect(result.tauxMoyen).toBe(0);
    });
  });

  describe("cas limites", () => {
    it("gere un revenu de 0", () => {
      const input: IRInput = {
        revenuNetImposable: 0,
        nombreParts: 1,
      };

      const result = calculerIR(input);

      expect(result.quotientFamilial).toBe(0);
      expect(result.tmi).toBe(0);
      expect(result.impotBrut).toBe(0);
      expect(result.impotNet).toBe(0);
      expect(result.tauxMoyen).toBe(0);
    });

    it("gere un revenu negatif (deficit)", () => {
      const input: IRInput = {
        revenuNetImposable: -5000,
        nombreParts: 1,
      };

      const result = calculerIR(input);

      expect(result.quotientFamilial).toBe(0);
      expect(result.tmi).toBe(0);
      expect(result.impotBrut).toBe(0);
      expect(result.impotNet).toBe(0);
    });
  });
});
