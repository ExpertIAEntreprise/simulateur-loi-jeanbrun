/**
 * Tests unitaires pour le module deficit-foncier.ts
 *
 * Workflow TDD - RED: Ces tests doivent echouer avant l'implementation
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect } from "vitest";
import { DEFICIT_FONCIER } from "../constants";
import {
  calculerDeficitFoncier,
  tableauReportDeficit,
} from "../deficit-foncier";
import type { DeficitFoncierInput } from "../types/deficit-foncier";

describe("calculerDeficitFoncier", () => {
  // ============================================
  // CAS 1: Revenus > Charges (pas de deficit)
  // ============================================
  describe("quand revenus > charges (pas de deficit)", () => {
    it("retourne un revenu foncier net positif sans deficit", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 12000,
        chargesDeductibles: 3000,
        interetsEmprunt: 2000,
      };

      const result = calculerDeficitFoncier(input);

      // Revenu net = 12000 - 3000 - 2000 = 7000
      expect(result.revenuFoncierNet).toBe(7000);
      expect(result.deficitTotal).toBe(0);
      expect(result.imputationRevenuGlobal).toBe(0);
      expect(result.reportRevenusFonciers).toBe(0);
    });

    it("retourne le plafond standard meme sans deficit", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 15000,
        chargesDeductibles: 5000,
        interetsEmprunt: 3000,
      };

      const result = calculerDeficitFoncier(input);

      expect(result.plafondApplicable).toBe(DEFICIT_FONCIER.plafondStandard);
    });
  });

  // ============================================
  // CAS 2: Deficit < plafond standard (tout imputable)
  // ============================================
  describe("quand deficit < plafond standard", () => {
    it("impute la totalite du deficit hors interets sur revenu global", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 5000,
        chargesDeductibles: 12000, // Charges hors interets = 12000
        interetsEmprunt: 2000,
      };

      const result = calculerDeficitFoncier(input);

      // Deficit total = 5000 - 12000 - 2000 = -9000 (deficit de 9000)
      // Deficit hors interets = 5000 - 12000 = -7000 (deficit de 7000)
      // 7000 < 10700 donc tout imputable sur revenu global
      expect(result.deficitTotal).toBe(9000);
      expect(result.deficitHorsInterets).toBe(7000);
      expect(result.imputationRevenuGlobal).toBe(7000);
      expect(result.reportRevenusFonciers).toBe(2000); // Les interets sont reportes
    });

    it("reporte les interets uniquement sur revenus fonciers", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 3000,
        chargesDeductibles: 8000,
        interetsEmprunt: 5000,
      };

      const result = calculerDeficitFoncier(input);

      // Deficit total = 3000 - 8000 - 5000 = -10000
      // Deficit hors interets = 3000 - 8000 = -5000
      // Interets = 5000 -> reportables uniquement
      expect(result.deficitTotal).toBe(10000);
      expect(result.imputationRevenuGlobal).toBe(5000);
      expect(result.reportRevenusFonciers).toBe(5000); // Interets reportes
    });
  });

  // ============================================
  // CAS 3: Deficit > plafond standard (partie reportable)
  // ============================================
  describe("quand deficit > plafond standard", () => {
    it("plafonne l'imputation sur revenu global", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 2000,
        chargesDeductibles: 20000, // Deficit hors interets = 18000 > 10700
        interetsEmprunt: 3000,
      };

      const result = calculerDeficitFoncier(input);

      // Deficit total = 2000 - 20000 - 3000 = -21000
      // Deficit hors interets = 2000 - 20000 = -18000
      // Imputation RG = min(18000, 10700) = 10700
      // Report = 21000 - 10700 = 10300
      expect(result.deficitTotal).toBe(21000);
      expect(result.deficitHorsInterets).toBe(18000);
      expect(result.plafondApplicable).toBe(10700);
      expect(result.imputationRevenuGlobal).toBe(10700);
      expect(result.reportRevenusFonciers).toBe(10300);
    });

    it("calcule correctement le report avec interets", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 0,
        chargesDeductibles: 15000,
        interetsEmprunt: 8000,
      };

      const result = calculerDeficitFoncier(input);

      // Deficit total = 0 - 15000 - 8000 = -23000
      // Deficit hors interets = 0 - 15000 = -15000
      // Imputation RG = min(15000, 10700) = 10700
      // Report = (15000 - 10700) + 8000 = 12300
      expect(result.deficitTotal).toBe(23000);
      expect(result.imputationRevenuGlobal).toBe(10700);
      expect(result.reportRevenusFonciers).toBe(12300);
    });
  });

  // ============================================
  // CAS 4: Plafond bonifie (travaux energetiques)
  // ============================================
  describe("quand travaux energetiques et date < 31/12/2027", () => {
    it("applique le plafond bonifie de 21400", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 2000,
        chargesDeductibles: 25000,
        interetsEmprunt: 4000,
        travauxEnergetiques: true,
        dateApplication: new Date("2027-06-15"),
      };

      const result = calculerDeficitFoncier(input);

      // Deficit total = 2000 - 25000 - 4000 = -27000
      // Deficit hors interets = 2000 - 25000 = -23000
      // Plafond bonifie = 21400
      // Imputation RG = min(23000, 21400) = 21400
      // Report = (23000 - 21400) + 4000 = 5600
      expect(result.plafondApplicable).toBe(21400);
      expect(result.imputationRevenuGlobal).toBe(21400);
      expect(result.reportRevenusFonciers).toBe(5600);
    });

    it("n'applique pas le plafond bonifie sans travaux energetiques", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 2000,
        chargesDeductibles: 25000,
        interetsEmprunt: 4000,
        travauxEnergetiques: false,
        dateApplication: new Date("2027-06-15"),
      };

      const result = calculerDeficitFoncier(input);

      expect(result.plafondApplicable).toBe(10700);
    });

    it("n'applique pas le plafond bonifie apres le 31/12/2027", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 2000,
        chargesDeductibles: 25000,
        interetsEmprunt: 4000,
        travauxEnergetiques: true,
        dateApplication: new Date("2028-01-01"),
      };

      const result = calculerDeficitFoncier(input);

      expect(result.plafondApplicable).toBe(10700);
    });

    it("applique le plafond bonifie exactement le 31/12/2027", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 2000,
        chargesDeductibles: 25000,
        interetsEmprunt: 4000,
        travauxEnergetiques: true,
        dateApplication: new Date("2027-12-31"),
      };

      const result = calculerDeficitFoncier(input);

      expect(result.plafondApplicable).toBe(21400);
    });
  });

  // ============================================
  // CAS 5: Duree de report
  // ============================================
  describe("duree de report", () => {
    it("retourne toujours 10 ans de duree de report", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 5000,
        chargesDeductibles: 20000,
        interetsEmprunt: 5000,
      };

      const result = calculerDeficitFoncier(input);

      expect(result.dureeReport).toBe(10);
    });
  });

  // ============================================
  // CAS 6: Edge cases
  // ============================================
  describe("edge cases", () => {
    it("gere les valeurs a zero", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 0,
        chargesDeductibles: 0,
        interetsEmprunt: 0,
      };

      const result = calculerDeficitFoncier(input);

      expect(result.revenuFoncierNet).toBe(0);
      expect(result.deficitTotal).toBe(0);
      expect(result.imputationRevenuGlobal).toBe(0);
      expect(result.reportRevenusFonciers).toBe(0);
    });

    it("gere le deficit exactement egal au plafond", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 0,
        chargesDeductibles: 10700,
        interetsEmprunt: 0,
      };

      const result = calculerDeficitFoncier(input);

      expect(result.deficitHorsInterets).toBe(10700);
      expect(result.imputationRevenuGlobal).toBe(10700);
      expect(result.reportRevenusFonciers).toBe(0);
    });

    it("gere les interets superieurs aux loyers", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 5000,
        chargesDeductibles: 0,
        interetsEmprunt: 10000,
      };

      const result = calculerDeficitFoncier(input);

      // Deficit total = 5000 - 0 - 10000 = -5000
      // Deficit hors interets = 5000 - 0 = 5000 (positif = pas de deficit hors interets)
      // Les interets s'imputent d'abord sur les loyers
      // Interets non imputes = 10000 - 5000 = 5000 -> report
      expect(result.deficitTotal).toBe(5000);
      expect(result.deficitHorsInterets).toBe(0);
      expect(result.imputationRevenuGlobal).toBe(0);
      expect(result.reportRevenusFonciers).toBe(5000);
    });
  });
});

describe("tableauReportDeficit", () => {
  // ============================================
  // Simulation report sur 10 ans
  // ============================================
  describe("simulation du report", () => {
    it("impute le deficit sur les revenus fonciers positifs chaque annee", () => {
      const deficitInitial = 15000;
      const revenusFonciersAnnuels = [5000, 5000, 5000, 5000, 5000]; // 5 ans de revenus

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);

      // Annee 1: deficit 15000, revenus 5000 -> imputation 5000, solde 10000
      // Annee 2: deficit 10000, revenus 5000 -> imputation 5000, solde 5000
      // Annee 3: deficit 5000, revenus 5000 -> imputation 5000, solde 0
      // Annee 4 et 5: plus de deficit
      expect(tableau).toHaveLength(5);
      expect(tableau[0]).toEqual({
        annee: 1,
        deficitReporte: 15000,
        imputation: 5000,
        solde: 10000,
      });
      expect(tableau[1]).toEqual({
        annee: 2,
        deficitReporte: 10000,
        imputation: 5000,
        solde: 5000,
      });
      expect(tableau[2]).toEqual({
        annee: 3,
        deficitReporte: 5000,
        imputation: 5000,
        solde: 0,
      });
      expect(tableau[3]).toEqual({
        annee: 4,
        deficitReporte: 0,
        imputation: 0,
        solde: 0,
      });
      expect(tableau[4]).toEqual({
        annee: 5,
        deficitReporte: 0,
        imputation: 0,
        solde: 0,
      });
    });

    it("limite le report a 10 ans maximum", () => {
      const deficitInitial = 100000;
      const revenusFonciersAnnuels = new Array(12).fill(5000); // 12 ans

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);

      // Ne retourne que 10 lignes maximum
      expect(tableau).toHaveLength(10);
      // Apres 10 ans, le deficit restant est perdu
      const derniereLigne = tableau[9];
      expect(derniereLigne?.annee).toBe(10);
    });

    it("gere les revenus fonciers negatifs (nouveaux deficits)", () => {
      const deficitInitial = 10000;
      const revenusFonciersAnnuels = [3000, -2000, 5000, 4000]; // Annee 2 = nouveau deficit

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);

      // Annee 1: deficit 10000, revenus 3000 -> imputation 3000, solde 7000
      // Annee 2: deficit 7000, revenus -2000 -> pas d'imputation, solde 7000 (nouveau deficit non cumule ici)
      // Annee 3: deficit 7000, revenus 5000 -> imputation 5000, solde 2000
      // Annee 4: deficit 2000, revenus 4000 -> imputation 2000, solde 0
      expect(tableau[0]).toEqual({
        annee: 1,
        deficitReporte: 10000,
        imputation: 3000,
        solde: 7000,
      });
      expect(tableau[1]).toEqual({
        annee: 2,
        deficitReporte: 7000,
        imputation: 0,
        solde: 7000,
      });
      expect(tableau[2]).toEqual({
        annee: 3,
        deficitReporte: 7000,
        imputation: 5000,
        solde: 2000,
      });
      expect(tableau[3]).toEqual({
        annee: 4,
        deficitReporte: 2000,
        imputation: 2000,
        solde: 0,
      });
    });

    it("gere un deficit initial de zero", () => {
      const deficitInitial = 0;
      const revenusFonciersAnnuels = [5000, 5000];

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);

      expect(tableau).toHaveLength(2);
      expect(tableau[0]).toEqual({
        annee: 1,
        deficitReporte: 0,
        imputation: 0,
        solde: 0,
      });
    });

    it("gere un tableau de revenus vide", () => {
      const deficitInitial = 10000;
      const revenusFonciersAnnuels: number[] = [];

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);

      expect(tableau).toHaveLength(0);
    });

    it("impute partiellement quand revenus < deficit restant", () => {
      const deficitInitial = 10000;
      const revenusFonciersAnnuels = [3000, 2000, 1000];

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);

      // Total impute: 3000 + 2000 + 1000 = 6000
      // Deficit restant: 10000 - 6000 = 4000
      expect(tableau[0]).toEqual({
        annee: 1,
        deficitReporte: 10000,
        imputation: 3000,
        solde: 7000,
      });
      expect(tableau[1]).toEqual({
        annee: 2,
        deficitReporte: 7000,
        imputation: 2000,
        solde: 5000,
      });
      expect(tableau[2]).toEqual({
        annee: 3,
        deficitReporte: 5000,
        imputation: 1000,
        solde: 4000,
      });
    });
  });
});

// ============================================
// VALIDATION ERRORS
// ============================================

describe("validation errors", () => {
  describe("calculerDeficitFoncier", () => {
    it("devrait gerer loyers negatifs (cas aberrant)", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: -5000,
        chargesDeductibles: 3000,
        interetsEmprunt: 2000,
      };

      const result = calculerDeficitFoncier(input);
      // Loyers negatifs = deficit plus important
      expect(result.deficitTotal).toBeGreaterThan(0);
    });

    it("devrait gerer charges negatives (cas aberrant)", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 12000,
        chargesDeductibles: -3000, // Charges negatives = remboursement?
        interetsEmprunt: 2000,
      };

      const result = calculerDeficitFoncier(input);
      // Resultat = 12000 - (-3000) - 2000 = 13000 (positif)
      expect(result.revenuFoncierNet).toBeGreaterThan(0);
    });

    it("devrait gerer interets negatifs (cas aberrant)", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 12000,
        chargesDeductibles: 3000,
        interetsEmprunt: -2000,
      };

      const result = calculerDeficitFoncier(input);
      expect(result).toBeDefined();
    });

    it("devrait gerer NaN pour loyers", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: NaN,
        chargesDeductibles: 3000,
        interetsEmprunt: 2000,
      };

      const result = calculerDeficitFoncier(input);
      // Note: L'implementation retourne 0 pour revenuFoncierNet en cas de deficit
      // NaN >= 0 retourne false, donc traite comme deficit
      expect(result.revenuFoncierNet).toBe(0);
      // Le deficitTotal sera NaN car Math.abs(NaN) = NaN
      expect(Number.isNaN(result.deficitTotal)).toBe(true);
    });

    it("devrait gerer date invalide pour travaux energetiques", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 5000,
        chargesDeductibles: 20000,
        interetsEmprunt: 3000,
        travauxEnergetiques: true,
        dateApplication: new Date("invalid-date"),
      };

      const result = calculerDeficitFoncier(input);
      // Date invalide = isNaN pour comparaison, donc plafond standard
      expect(result.plafondApplicable).toBe(DEFICIT_FONCIER.plafondStandard);
    });

    it("devrait gerer travauxEnergetiques undefined", () => {
      const input: DeficitFoncierInput = {
        loyersPercus: 5000,
        chargesDeductibles: 20000,
        interetsEmprunt: 3000,
        // travauxEnergetiques non specifie
      };

      const result = calculerDeficitFoncier(input);
      expect(result.plafondApplicable).toBe(DEFICIT_FONCIER.plafondStandard);
    });
  });

  describe("tableauReportDeficit", () => {
    it("devrait gerer deficit initial negatif (cas aberrant)", () => {
      const deficitInitial = -5000; // Deficit negatif = excedent?
      const revenusFonciersAnnuels = [3000, 3000];

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);
      // Le comportement depend de l'implementation
      expect(tableau).toBeDefined();
    });

    it("devrait gerer revenus NaN dans le tableau", () => {
      const deficitInitial = 10000;
      const revenusFonciersAnnuels = [3000, NaN, 2000];

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);
      expect(tableau).toHaveLength(3);
      // La ligne avec NaN aura des valeurs NaN
    });

    it("devrait gerer deficit initial NaN", () => {
      const deficitInitial = NaN;
      const revenusFonciersAnnuels = [5000, 5000];

      const tableau = tableauReportDeficit(deficitInitial, revenusFonciersAnnuels);
      expect(tableau).toHaveLength(2);
    });
  });
});
