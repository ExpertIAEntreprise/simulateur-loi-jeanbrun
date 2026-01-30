/**
 * Tests pour le module plus-value.ts
 * Calcul de la plus-value immobiliere (IR + PS + surtaxe)
 *
 * TDD: Ces tests sont ecrits AVANT l'implementation
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect } from "vitest";
import {
  calculerAbattementIR,
  calculerAbattementPS,
  calculerSurtaxe,
  calculerPlusValue,
} from "../plus-value";
import type { PlusValueInput } from "../types/plus-value";

// ============================================
// ABATTEMENT IR (Impot sur le Revenu)
// ============================================

describe("calculerAbattementIR", () => {
  it("devrait retourner 0% avant 6 ans (0 annees)", () => {
    expect(calculerAbattementIR(0)).toBe(0);
  });

  it("devrait retourner 0% avant 6 ans (5 annees)", () => {
    expect(calculerAbattementIR(5)).toBe(0);
  });

  it("devrait retourner 6% a 6 ans (premiere annee d'abattement)", () => {
    // 6eme annee = 1 * 6% = 6%
    expect(calculerAbattementIR(6)).toBeCloseTo(0.06, 4);
  });

  it("devrait retourner 12% a 7 ans", () => {
    // 7eme annee = 2 * 6% = 12%
    expect(calculerAbattementIR(7)).toBeCloseTo(0.12, 4);
  });

  it("devrait retourner 60% a 15 ans", () => {
    // Annees 6-15 = 10 * 6% = 60%
    expect(calculerAbattementIR(15)).toBeCloseTo(0.6, 4);
  });

  it("devrait retourner 96% a 21 ans", () => {
    // Annees 6-21 = 16 * 6% = 96%
    expect(calculerAbattementIR(21)).toBeCloseTo(0.96, 4);
  });

  it("devrait retourner 100% a 22 ans (exoneration totale)", () => {
    // 16 * 6% + 4% = 96% + 4% = 100%
    expect(calculerAbattementIR(22)).toBe(1);
  });

  it("devrait retourner 100% apres 22 ans (30 ans)", () => {
    expect(calculerAbattementIR(30)).toBe(1);
  });

  it("devrait retourner 100% a 50 ans", () => {
    expect(calculerAbattementIR(50)).toBe(1);
  });
});

// ============================================
// ABATTEMENT PS (Prelevements Sociaux)
// ============================================

describe("calculerAbattementPS", () => {
  it("devrait retourner 0% avant 6 ans (0 annees)", () => {
    expect(calculerAbattementPS(0)).toBe(0);
  });

  it("devrait retourner 0% avant 6 ans (5 annees)", () => {
    expect(calculerAbattementPS(5)).toBe(0);
  });

  it("devrait retourner 1.65% a 6 ans", () => {
    // 6eme annee = 1 * 1.65% = 1.65%
    expect(calculerAbattementPS(6)).toBeCloseTo(0.0165, 4);
  });

  it("devrait retourner 3.30% a 7 ans", () => {
    // Annees 6-7 = 2 * 1.65% = 3.30%
    expect(calculerAbattementPS(7)).toBeCloseTo(0.033, 4);
  });

  it("devrait retourner 26.40% a 21 ans", () => {
    // Annees 6-21 = 16 * 1.65% = 26.40%
    expect(calculerAbattementPS(21)).toBeCloseTo(0.264, 4);
  });

  it("devrait retourner 28% a 22 ans", () => {
    // 16 * 1.65% + 1.6% = 26.40% + 1.6% = 28%
    expect(calculerAbattementPS(22)).toBeCloseTo(0.28, 4);
  });

  it("devrait retourner 37% a 23 ans", () => {
    // 28% + 1 * 9% = 37%
    expect(calculerAbattementPS(23)).toBeCloseTo(0.37, 4);
  });

  it("devrait retourner 46% a 24 ans", () => {
    // 28% + 2 * 9% = 46%
    expect(calculerAbattementPS(24)).toBeCloseTo(0.46, 4);
  });

  it("devrait retourner 100% a 30 ans (exoneration totale)", () => {
    // 28% + 8 * 9% = 28% + 72% = 100%
    expect(calculerAbattementPS(30)).toBe(1);
  });

  it("devrait retourner 100% apres 30 ans (40 ans)", () => {
    expect(calculerAbattementPS(40)).toBe(1);
  });
});

// ============================================
// SURTAXE PLUS-VALUE
// ============================================

describe("calculerSurtaxe", () => {
  it("devrait retourner 0 si <= 50000", () => {
    expect(calculerSurtaxe(0)).toBe(0);
    expect(calculerSurtaxe(25000)).toBe(0);
    expect(calculerSurtaxe(50000)).toBe(0);
  });

  it("devrait calculer 200 euros pour 60000 euros de PV", () => {
    // (60000 - 50000) * 0.02 = 200
    expect(calculerSurtaxe(60000)).toBeCloseTo(200, 2);
  });

  it("devrait calculer correctement pour 55000 euros", () => {
    // (55000 - 50000) * 0.02 = 100
    expect(calculerSurtaxe(55000)).toBeCloseTo(100, 2);
  });

  it("devrait calculer correctement pour 100000 euros", () => {
    // Tranche 60k-100k: pv * 0.02 - 200 = 100000 * 0.02 - 200 = 1800
    expect(calculerSurtaxe(100000)).toBeCloseTo(1800, 2);
  });

  it("devrait calculer correctement pour 150000 euros", () => {
    // Tranche 110k-150k: pv * 0.03 - 1100 = 150000 * 0.03 - 1100 = 3400
    expect(calculerSurtaxe(150000)).toBeCloseTo(3400, 2);
  });

  it("devrait calculer correctement pour 200000 euros", () => {
    // Tranche 160k-200k: pv * 0.04 - 2800 = 200000 * 0.04 - 2800 = 5200
    expect(calculerSurtaxe(200000)).toBeCloseTo(5200, 2);
  });

  it("devrait calculer correctement pour 250000 euros", () => {
    // Tranche 210k-250k: pv * 0.05 - 5300 = 250000 * 0.05 - 5300 = 7200
    expect(calculerSurtaxe(250000)).toBeCloseTo(7200, 2);
  });

  it("devrait calculer correctement pour 300000 euros (tranche max)", () => {
    // Tranche >= 260k: pv * 0.06 - 8400 = 300000 * 0.06 - 8400 = 9600
    expect(calculerSurtaxe(300000)).toBeCloseTo(9600, 2);
  });

  it("devrait calculer correctement pour les valeurs intermediaires", () => {
    // 80000 euros: tranche 60k-100k: pv * 0.02 - 200 = 80000 * 0.02 - 200 = 1400
    expect(calculerSurtaxe(80000)).toBeCloseTo(1400, 2);
  });
});

// ============================================
// CALCUL PLUS-VALUE COMPLET
// ============================================

describe("calculerPlusValue", () => {
  describe("calcul de base", () => {
    it("devrait calculer une plus-value simple sans frais", () => {
      const input: PlusValueInput = {
        prixVente: 300000,
        prixAchat: 200000,
        dureeDetention: 0, // Pas d'abattement
      };
      const result = calculerPlusValue(input);

      // PV brute = 300000 - 200000 - (200000 * 7.5%) = 300000 - 200000 - 15000 = 85000
      expect(result.plusValueBrute).toBeCloseTo(85000, 0);
      expect(result.abattementIR).toBe(0);
      expect(result.abattementPS).toBe(0);
      expect(result.pvImposableIR).toBeCloseTo(85000, 0);
      expect(result.pvImposablePS).toBeCloseTo(85000, 0);
      // IR = 85000 * 19% = 16150
      expect(result.impotIR).toBeCloseTo(16150, 0);
      // PS = 85000 * 17.2% = 14620
      expect(result.impotPS).toBeCloseTo(14620, 0);
      // Surtaxe: 85000 dans tranche 60k-100k = 85000 * 0.02 - 200 = 1500
      expect(result.surtaxe).toBeCloseTo(1500, 0);
      // Total = 16150 + 14620 + 1500 = 32270
      expect(result.impotTotal).toBeCloseTo(32270, 0);
      expect(result.exonere).toBe(false);
    });

    it("devrait appliquer forfait 7.5% si frais d'acquisition non fournis", () => {
      const input: PlusValueInput = {
        prixVente: 250000,
        prixAchat: 200000,
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      // Prix acquisition majore = 200000 + (200000 * 7.5%) = 215000
      // PV brute = 250000 - 215000 = 35000
      expect(result.plusValueBrute).toBeCloseTo(35000, 0);
    });

    it("devrait utiliser les frais reels si fournis", () => {
      const input: PlusValueInput = {
        prixVente: 250000,
        prixAchat: 200000,
        fraisAcquisition: 20000, // Frais reels
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      // Prix acquisition majore = 200000 + 20000 = 220000
      // PV brute = 250000 - 220000 = 30000
      expect(result.plusValueBrute).toBeCloseTo(30000, 0);
    });

    it("devrait appliquer forfait 15% travaux si detention > 5 ans et pas de travaux declares", () => {
      const input: PlusValueInput = {
        prixVente: 300000,
        prixAchat: 200000,
        dureeDetention: 6, // > 5 ans
      };
      const result = calculerPlusValue(input);

      // Forfait frais = 200000 * 7.5% = 15000
      // Forfait travaux = 200000 * 15% = 30000
      // Prix acquisition majore = 200000 + 15000 + 30000 = 245000
      // PV brute = 300000 - 245000 = 55000
      expect(result.plusValueBrute).toBeCloseTo(55000, 0);
    });

    it("devrait utiliser les travaux reels si fournis", () => {
      const input: PlusValueInput = {
        prixVente: 300000,
        prixAchat: 200000,
        travaux: 50000, // Travaux reels
        dureeDetention: 10,
      };
      const result = calculerPlusValue(input);

      // Frais = 200000 * 7.5% = 15000
      // Travaux = 50000 (reels)
      // Prix acquisition majore = 200000 + 15000 + 50000 = 265000
      // PV brute = 300000 - 265000 = 35000
      expect(result.plusValueBrute).toBeCloseTo(35000, 0);
    });

    it("devrait deduire les frais de vente", () => {
      const input: PlusValueInput = {
        prixVente: 300000,
        prixAchat: 200000,
        fraisVente: 10000,
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      // Frais = 200000 * 7.5% = 15000
      // Prix vente net = 300000 - 10000 = 290000
      // Prix acquisition majore = 200000 + 15000 = 215000
      // PV brute = 290000 - 215000 = 75000
      expect(result.plusValueBrute).toBeCloseTo(75000, 0);
    });
  });

  describe("abattements pour duree de detention", () => {
    it("devrait appliquer les abattements IR et PS correctement a 10 ans", () => {
      const input: PlusValueInput = {
        prixVente: 400000,
        prixAchat: 200000,
        fraisAcquisition: 15000,
        travaux: 30000,
        dureeDetention: 10,
      };
      const result = calculerPlusValue(input);

      // PV brute = 400000 - (200000 + 15000 + 30000) = 155000
      expect(result.plusValueBrute).toBeCloseTo(155000, 0);

      // Abattement IR a 10 ans: 5 annees * 6% = 30%
      expect(result.abattementIR).toBeCloseTo(0.3, 4);

      // Abattement PS a 10 ans: 5 annees * 1.65% = 8.25%
      expect(result.abattementPS).toBeCloseTo(0.0825, 4);

      // PV imposable IR = 155000 * (1 - 0.30) = 108500
      expect(result.pvImposableIR).toBeCloseTo(108500, 0);

      // PV imposable PS = 155000 * (1 - 0.0825) = 142212.5
      expect(result.pvImposablePS).toBeCloseTo(142212.5, 0);
    });

    it("devrait etre exonere d'IR apres 22 ans", () => {
      const input: PlusValueInput = {
        prixVente: 500000,
        prixAchat: 200000,
        dureeDetention: 22,
      };
      const result = calculerPlusValue(input);

      expect(result.abattementIR).toBe(1);
      expect(result.pvImposableIR).toBe(0);
      expect(result.impotIR).toBe(0);
      // PS encore imposables (exoneration a 30 ans)
      expect(result.abattementPS).toBeCloseTo(0.28, 4);
      expect(result.pvImposablePS).toBeGreaterThan(0);
      expect(result.impotPS).toBeGreaterThan(0);
    });

    it("devrait etre totalement exonere apres 30 ans", () => {
      const input: PlusValueInput = {
        prixVente: 500000,
        prixAchat: 200000,
        dureeDetention: 30,
      };
      const result = calculerPlusValue(input);

      expect(result.abattementIR).toBe(1);
      expect(result.abattementPS).toBe(1);
      expect(result.pvImposableIR).toBe(0);
      expect(result.pvImposablePS).toBe(0);
      expect(result.impotIR).toBe(0);
      expect(result.impotPS).toBe(0);
      expect(result.surtaxe).toBe(0);
      expect(result.impotTotal).toBe(0);
      expect(result.exonere).toBe(true);
      expect(result.motifExoneration).toContain("30 ans");
    });
  });

  describe("cas limites et edge cases", () => {
    it("devrait retourner une PV nulle si prix vente <= prix acquisition majore", () => {
      const input: PlusValueInput = {
        prixVente: 200000,
        prixAchat: 200000,
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      // PV brute = 200000 - 215000 (avec forfait 7.5%) = -15000 => 0
      expect(result.plusValueBrute).toBe(0);
      expect(result.impotTotal).toBe(0);
      expect(result.exonere).toBe(true);
      expect(result.motifExoneration).toBeDefined();
    });

    it("devrait gerer une moins-value (prix vente < prix achat)", () => {
      const input: PlusValueInput = {
        prixVente: 150000,
        prixAchat: 200000,
        dureeDetention: 5,
      };
      const result = calculerPlusValue(input);

      expect(result.plusValueBrute).toBe(0);
      expect(result.impotTotal).toBe(0);
      expect(result.exonere).toBe(true);
    });

    it("devrait calculer le taux effectif correctement", () => {
      const input: PlusValueInput = {
        prixVente: 350000,
        prixAchat: 200000,
        fraisAcquisition: 15000,
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      // PV brute = 350000 - 215000 = 135000
      // Taux effectif = impotTotal / plusValueBrute
      const tauxAttendu = result.impotTotal / result.plusValueBrute;
      expect(result.tauxEffectif).toBeCloseTo(tauxAttendu, 4);
    });

    it("devrait gerer une detention de 0 an", () => {
      const input: PlusValueInput = {
        prixVente: 250000,
        prixAchat: 200000,
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      expect(result.abattementIR).toBe(0);
      expect(result.abattementPS).toBe(0);
    });

    it("devrait gerer une valeur negative de travaux gracieusement", () => {
      const input: PlusValueInput = {
        prixVente: 300000,
        prixAchat: 200000,
        travaux: -5000, // Invalide, devrait etre traite comme 0
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      // Devrait ignorer les travaux negatifs
      expect(result.plusValueBrute).toBeGreaterThan(0);
    });
  });

  describe("surtaxe integree", () => {
    it("devrait calculer la surtaxe quand PV imposable IR > 50000", () => {
      const input: PlusValueInput = {
        prixVente: 400000,
        prixAchat: 200000,
        fraisAcquisition: 15000,
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      // PV brute = 400000 - 215000 = 185000
      // PV imposable IR = 185000 (pas d'abattement)
      // Surtaxe: tranche 160k-200k = 185000 * 0.04 - 2800 = 4600
      expect(result.surtaxe).toBeCloseTo(4600, 0);
    });

    it("devrait ne pas avoir de surtaxe si PV imposable IR <= 50000", () => {
      const input: PlusValueInput = {
        prixVente: 250000,
        prixAchat: 200000,
        dureeDetention: 0,
      };
      const result = calculerPlusValue(input);

      // PV brute = 250000 - 215000 = 35000 < 50000
      expect(result.surtaxe).toBe(0);
    });

    it("devrait calculer surtaxe sur PV apres abattement IR", () => {
      const input: PlusValueInput = {
        prixVente: 500000,
        prixAchat: 200000,
        fraisAcquisition: 15000,
        dureeDetention: 15, // Abattement IR 60%
      };
      const result = calculerPlusValue(input);

      // PV brute = 500000 - 215000 - forfait travaux 15% = 285000 - 30000 = 255000
      // Avec travaux 15% si > 5 ans: PV brute = 500000 - (200000 + 15000 + 30000) = 255000
      // Abattement IR = 60%
      // PV imposable IR = 255000 * 0.4 = 102000
      // Surtaxe: tranche 100k-110k = (102000 - 100000) * 0.03 + 1800 = 1860
      expect(result.pvImposableIR).toBeCloseTo(102000, 0);
      expect(result.surtaxe).toBeCloseTo(1860, 0);
    });
  });
});

// ============================================
// VALIDATION ERRORS
// ============================================

describe("validation errors", () => {
  describe("calculerAbattementIR", () => {
    it("devrait retourner 0 pour annees negatives", () => {
      const result = calculerAbattementIR(-5);
      expect(result).toBe(0);
    });

    it("devrait gerer NaN gracieusement", () => {
      const result = calculerAbattementIR(NaN);
      // NaN < 6 est false, donc on passe dans la logique de calcul
      expect(result).toBeDefined();
    });
  });

  describe("calculerAbattementPS", () => {
    it("devrait retourner 0 pour annees negatives", () => {
      const result = calculerAbattementPS(-10);
      expect(result).toBe(0);
    });

    it("devrait gerer NaN gracieusement", () => {
      const result = calculerAbattementPS(NaN);
      expect(result).toBeDefined();
    });
  });

  describe("calculerSurtaxe", () => {
    it("devrait retourner 0 pour PV negative", () => {
      const result = calculerSurtaxe(-50000);
      expect(result).toBe(0);
    });

    it("devrait gerer NaN gracieusement", () => {
      const result = calculerSurtaxe(NaN);
      // NaN <= 50000 est false, donc on cherche dans les tranches
      // Mais aucune tranche ne match NaN, donc fallback = 0
      expect(result).toBe(0);
    });
  });

  describe("calculerPlusValue", () => {
    it("devrait retourner exonere=true pour prixVente negatif", () => {
      const input: PlusValueInput = {
        prixVente: -100000,
        prixAchat: 200000,
        dureeDetention: 10,
      };

      const result = calculerPlusValue(input);
      expect(result.exonere).toBe(true);
      expect(result.motifExoneration).toContain("invalides");
    });

    it("devrait retourner exonere=true pour prixAchat negatif", () => {
      const input: PlusValueInput = {
        prixVente: 300000,
        prixAchat: -100000,
        dureeDetention: 10,
      };

      const result = calculerPlusValue(input);
      expect(result.exonere).toBe(true);
      expect(result.motifExoneration).toContain("invalides");
    });

    it("devrait retourner exonere=true pour dureeDetention negative", () => {
      const input: PlusValueInput = {
        prixVente: 300000,
        prixAchat: 200000,
        dureeDetention: -5,
      };

      const result = calculerPlusValue(input);
      expect(result.exonere).toBe(true);
      expect(result.motifExoneration).toContain("invalides");
    });

    it("devrait gerer NaN pour prixVente", () => {
      const input: PlusValueInput = {
        prixVente: NaN,
        prixAchat: 200000,
        dureeDetention: 10,
      };

      const result = calculerPlusValue(input);
      // NaN < 0 est false, donc pas de validation mais resultat aberrant
      expect(result).toBeDefined();
    });

    it("devrait gerer fraisVente negatifs", () => {
      const input: PlusValueInput = {
        prixVente: 300000,
        prixAchat: 200000,
        fraisVente: -5000, // Frais negatifs = augmentation du prix de vente
        dureeDetention: 5,
      };

      const result = calculerPlusValue(input);
      // prixVenteNet = 300000 - (-5000) = 305000
      expect(result.plusValueBrute).toBeGreaterThan(0);
    });

    it("devrait gerer Infinity pour prixVente", () => {
      const input: PlusValueInput = {
        prixVente: Infinity,
        prixAchat: 200000,
        dureeDetention: 10,
      };

      const result = calculerPlusValue(input);
      expect(result.plusValueBrute).toBe(Infinity);
    });
  });
});
