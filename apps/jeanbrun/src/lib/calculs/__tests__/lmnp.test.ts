/**
 * Tests pour le module de calcul LMNP (Location Meublee Non Professionnelle)
 *
 * TDD Phase 2 - Tests ecrits AVANT l'implementation
 *
 * Regimes LMNP:
 * - Micro-BIC: abattement forfaitaire (50% longue duree, 30% tourisme non classe, 71% chambres hotes)
 * - Reel: amortissement par composants (terrain 15%, gros oeuvre 50%, etc.)
 *
 * Constantes (constants.ts):
 * - LMNP_MICRO_BIC: plafonds et abattements par type de location
 * - LMNP_COMPOSANTS: taux d'amortissement par composant
 * - LMNP_REPARTITION_TYPE: repartition standard d'un bien
 */

import { describe, it, expect } from "vitest";
import {
  calculerLMNPMicroBIC,
  calculerLMNPReel,
  calculerLMNP,
  comparerJeanbrunLMNP,
} from "../lmnp";
import type { LMNPInput } from "../types/lmnp";

// ============================================
// TESTS MICRO-BIC
// ============================================

describe("calculerLMNPMicroBIC", () => {
  describe("abattement forfaitaire", () => {
    it("devrait appliquer abattement 50% pour longue duree", () => {
      // Recettes 10000 EUR -> abattement 50% -> benefice imposable 5000 EUR
      const result = calculerLMNPMicroBIC(10000, "longue_duree");

      expect(result.regime).toBe("micro");
      expect(result.recettes).toBe(10000);
      expect(result.beneficeImposable).toBe(5000);
    });

    it("devrait appliquer abattement 50% pour tourisme classe", () => {
      // Recettes 20000 EUR -> abattement 50% -> benefice imposable 10000 EUR
      const result = calculerLMNPMicroBIC(20000, "tourisme_classe");

      expect(result.regime).toBe("micro");
      expect(result.recettes).toBe(20000);
      expect(result.beneficeImposable).toBe(10000);
    });

    it("devrait appliquer abattement 30% pour tourisme non classe", () => {
      // Recettes 10000 EUR -> abattement 30% -> benefice imposable 7000 EUR
      const result = calculerLMNPMicroBIC(10000, "tourisme_non_classe");

      expect(result.regime).toBe("micro");
      expect(result.recettes).toBe(10000);
      expect(result.beneficeImposable).toBe(7000);
    });

    it("devrait appliquer abattement 71% pour chambres hotes", () => {
      // Recettes 10000 EUR -> abattement 71% -> benefice imposable 2900 EUR
      const result = calculerLMNPMicroBIC(10000, "chambres_hotes");

      expect(result.regime).toBe("micro");
      expect(result.recettes).toBe(10000);
      expect(result.beneficeImposable).toBe(2900);
    });
  });

  describe("eligibilite plafond", () => {
    it("devrait etre eligible si recettes < plafond longue duree (77700)", () => {
      const result = calculerLMNPMicroBIC(50000, "longue_duree");

      expect(result.regime).toBe("micro");
      expect(result.beneficeImposable).toBe(25000); // 50% de 50000
    });

    it("devrait retourner ineligible si recettes > plafond longue duree (77700)", () => {
      const result = calculerLMNPMicroBIC(80000, "longue_duree");

      // Quand ineligible au micro, le benefice imposable devrait etre 0
      // et un message ou indicateur devrait signaler l'ineligibilite
      expect(result.regime).toBe("micro");
      expect(result.beneficeImposable).toBe(0);
    });

    it("devrait etre eligible si recettes = plafond exactement", () => {
      const result = calculerLMNPMicroBIC(77700, "longue_duree");

      expect(result.regime).toBe("micro");
      expect(result.beneficeImposable).toBe(38850); // 50% de 77700
    });

    it("devrait retourner ineligible si recettes > plafond tourisme non classe (15000)", () => {
      const result = calculerLMNPMicroBIC(16000, "tourisme_non_classe");

      expect(result.regime).toBe("micro");
      expect(result.beneficeImposable).toBe(0);
    });

    it("devrait etre eligible si recettes <= plafond tourisme non classe (15000)", () => {
      const result = calculerLMNPMicroBIC(15000, "tourisme_non_classe");

      expect(result.regime).toBe("micro");
      expect(result.beneficeImposable).toBe(10500); // 30% abattement -> 70% imposable
    });
  });

  describe("cas limites", () => {
    it("devrait gerer recettes = 0", () => {
      const result = calculerLMNPMicroBIC(0, "longue_duree");

      expect(result.regime).toBe("micro");
      expect(result.recettes).toBe(0);
      expect(result.beneficeImposable).toBe(0);
    });

    it("devrait gerer recettes negatives (erreur)", () => {
      const result = calculerLMNPMicroBIC(-1000, "longue_duree");

      expect(result.regime).toBe("micro");
      expect(result.recettes).toBe(0);
      expect(result.beneficeImposable).toBe(0);
    });
  });
});

// ============================================
// TESTS REGIME REEL
// ============================================

describe("calculerLMNPReel", () => {
  describe("amortissement par composants", () => {
    it("devrait calculer amortissement par composants standard", () => {
      // Bien 200000 EUR:
      // - Terrain 15% = 30000 EUR -> 0 EUR/an (non amortissable)
      // - Gros oeuvre 50% = 100000 EUR -> 2500 EUR/an (2.5%)
      // - Facade 10% = 20000 EUR -> 800 EUR/an (4%)
      // - Equipements 10% = 20000 EUR -> 1334 EUR/an (6.67%)
      // - Agencements 10% = 20000 EUR -> 1000 EUR/an (5%)
      // - Mobilier 5% = 10000 EUR -> 1429 EUR/an (14.29%)
      // Total amortissement: ~7063 EUR/an

      const input: LMNPInput = {
        recettesAnnuelles: 12000,
        chargesAnnuelles: 2000,
        prixAcquisition: 200000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      expect(result.regime).toBe("reel");
      expect(result.recettes).toBe(12000);
      expect(result.amortissementAnnuel).toBeDefined();
      expect(result.amortissementAnnuel).toBeGreaterThan(7000);
      expect(result.amortissementAnnuel).toBeLessThan(7200);
    });

    it("devrait exclure le terrain de l'amortissement (15%)", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 10000,
        chargesAnnuelles: 1000,
        prixAcquisition: 100000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      // Terrain = 15% de 100000 = 15000 EUR -> non amorti
      // Donc base amortissable = 85000 EUR
      expect(result.detailAmortissements).toBeDefined();
      if (result.detailAmortissements) {
        expect(result.detailAmortissements["terrain"]?.amortissement).toBe(0);
        expect(result.detailAmortissements["terrain"]?.valeur).toBe(15000);
      }
    });

    it("devrait inclure les frais de notaire dans la base amortissable", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 10000,
        chargesAnnuelles: 1000,
        prixAcquisition: 100000,
        fraisNotaire: 8000, // 8% typique dans l'ancien
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      // Base = 100000 + 8000 = 108000 EUR
      // Amortissement superieur a celui sans frais notaire
      expect(result.amortissementAnnuel).toBeGreaterThan(3500);
    });

    it("devrait amortir le mobilier separement si specifie", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 12000,
        chargesAnnuelles: 2000,
        prixAcquisition: 200000,
        montantMobilier: 15000, // Mobilier specifie separement
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      expect(result.detailAmortissements).toBeDefined();
      if (result.detailAmortissements) {
        // Mobilier amorti sur 7 ans (14.29%)
        // 15000 * 0.1429 = 2143 EUR/an
        expect(result.detailAmortissements["mobilier"]?.valeur).toBe(15000);
        expect(
          result.detailAmortissements["mobilier"]?.amortissement
        ).toBeCloseTo(2143, -1);
      }
    });
  });

  describe("calcul du benefice imposable", () => {
    it("devrait calculer benefice = recettes - charges - amortissements", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 15000,
        chargesAnnuelles: 3000,
        prixAcquisition: 200000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      // Recettes: 15000
      // Charges: 3000
      // Amortissements: ~7063
      // Benefice: 15000 - 3000 - 7063 = 4937 EUR
      expect(result.recettes).toBe(15000);
      expect(result.beneficeImposable).toBeCloseTo(15000 - 3000 - (result.amortissementAnnuel ?? 0), 0);
    });

    it("devrait limiter l'amortissement au resultat avant amortissement", () => {
      // Regle LMNP: l'amortissement ne peut pas creer de deficit
      // Il est limite au resultat comptable avant amortissement
      const input: LMNPInput = {
        recettesAnnuelles: 8000,
        chargesAnnuelles: 5000,
        prixAcquisition: 200000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      // Resultat avant amortissement: 8000 - 5000 = 3000 EUR
      // Amortissement theorique: ~7063 EUR
      // Amortissement limite: 3000 EUR
      // Benefice imposable: 0 EUR (pas de deficit possible via amortissement)
      expect(result.beneficeImposable).toBe(0);
      expect(result.deficitReportable).toBeUndefined();
    });
  });

  describe("deficit reportable", () => {
    it("devrait reporter le deficit sur BIC futurs (charges > recettes)", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 5000,
        chargesAnnuelles: 7000, // Charges > recettes (hors amortissement)
        prixAcquisition: 100000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      // Deficit charges: 5000 - 7000 = -2000 EUR
      // Ce deficit est reportable sur BIC futurs (10 ans)
      expect(result.deficitReportable).toBe(2000);
      expect(result.beneficeImposable).toBe(0);
    });

    it("devrait ne pas reporter de deficit si resultat positif", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 12000,
        chargesAnnuelles: 2000,
        prixAcquisition: 100000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      expect(result.deficitReportable).toBeUndefined();
    });
  });

  describe("cas limites", () => {
    it("devrait gerer un bien sans charges", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 10000,
        chargesAnnuelles: 0,
        prixAcquisition: 100000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      expect(result.regime).toBe("reel");
      expect(result.beneficeImposable).toBeGreaterThanOrEqual(0);
    });

    it("devrait gerer un prix d'acquisition nul", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 10000,
        chargesAnnuelles: 2000,
        prixAcquisition: 0,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);

      expect(result.regime).toBe("reel");
      expect(result.amortissementAnnuel).toBe(0);
      expect(result.beneficeImposable).toBe(8000); // recettes - charges
    });
  });
});

// ============================================
// TESTS CHOIX AUTOMATIQUE DU REGIME
// ============================================

describe("calculerLMNP", () => {
  describe("choix du meilleur regime", () => {
    it("devrait choisir micro si abattement > amortissements", () => {
      // Cas ou le micro-BIC est plus avantageux
      // Recettes faibles, bien cher = micro gagne
      const input: LMNPInput = {
        recettesAnnuelles: 8000,
        chargesAnnuelles: 500,
        prixAcquisition: 50000, // Petit bien, peu d'amortissement
        typeLocation: "longue_duree",
      };

      const result = calculerLMNP(input);

      // Micro: 8000 * 50% = 4000 EUR imposable
      // Reel: 8000 - 500 - ~1766 (amortissement) = ~5734 EUR imposable
      // Micro meilleur car benefice imposable plus bas
      expect(result.regime).toBe("micro");
      expect(result.beneficeImposable).toBe(4000);
    });

    it("devrait choisir reel si amortissements > abattement", () => {
      // Cas ou le reel est plus avantageux
      // Bien cher, charges elevees = reel gagne
      const input: LMNPInput = {
        recettesAnnuelles: 15000,
        chargesAnnuelles: 5000,
        prixAcquisition: 300000, // Bien cher, beaucoup d'amortissement
        typeLocation: "longue_duree",
      };

      const result = calculerLMNP(input);

      // Micro: 15000 * 50% = 7500 EUR imposable
      // Reel: 15000 - 5000 - ~10594 (amortissement) = ~0 EUR (limite)
      // Reel meilleur car benefice imposable plus bas
      expect(result.regime).toBe("reel");
      expect(result.beneficeImposable).toBeLessThan(7500);
    });

    it("devrait forcer le reel si recettes > plafond micro-BIC", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 80000, // > 77700 EUR plafond
        chargesAnnuelles: 10000,
        prixAcquisition: 400000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNP(input);

      // Ineligible au micro-BIC, donc reel obligatoire
      expect(result.regime).toBe("reel");
    });

    it("devrait comparer chambres hotes (71% abattement) vs reel", () => {
      // Chambres hotes: abattement 71% tres avantageux
      const input: LMNPInput = {
        recettesAnnuelles: 30000,
        chargesAnnuelles: 3000,
        prixAcquisition: 200000,
        typeLocation: "chambres_hotes",
      };

      const result = calculerLMNP(input);

      // Micro chambres hotes: 30000 * 29% = 8700 EUR imposable
      // Reel: 30000 - 3000 - ~7063 = ~19937 EUR imposable
      // Micro beaucoup plus avantageux avec 71% d'abattement
      expect(result.regime).toBe("micro");
      expect(result.beneficeImposable).toBe(8700);
    });
  });

  describe("retour du detail", () => {
    it("devrait retourner le detail des amortissements si regime reel choisi", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 20000,
        chargesAnnuelles: 8000,
        prixAcquisition: 400000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNP(input);

      if (result.regime === "reel") {
        expect(result.detailAmortissements).toBeDefined();
        expect(result.amortissementAnnuel).toBeDefined();
      }
    });

    it("devrait ne pas retourner de detail amortissements si micro choisi", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 8000,
        chargesAnnuelles: 500,
        prixAcquisition: 50000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNP(input);

      if (result.regime === "micro") {
        expect(result.detailAmortissements).toBeUndefined();
        expect(result.amortissementAnnuel).toBeUndefined();
      }
    });
  });
});

// ============================================
// TESTS COMPARATIF JEANBRUN VS LMNP
// ============================================

describe("comparerJeanbrunLMNP", () => {
  describe("recommandation", () => {
    it("devrait recommander Jeanbrun si economie > LMNP", () => {
      // Economie Jeanbrun superieure
      const result = comparerJeanbrunLMNP(5000, 3000, 0.3);

      expect(result.recommandation).toBe("jeanbrun");
      expect(result.difference).toBe(2000); // 5000 - 3000
      expect(result.justification).toContain("Jeanbrun");
    });

    it("devrait recommander LMNP si economie > Jeanbrun", () => {
      // Economie LMNP superieure
      const result = comparerJeanbrunLMNP(3000, 5000, 0.3);

      expect(result.recommandation).toBe("lmnp");
      expect(result.difference).toBe(-2000); // 3000 - 5000
      expect(result.justification).toContain("LMNP");
    });

    it("devrait recommander equivalent si ecart < 500 EUR", () => {
      const result = comparerJeanbrunLMNP(5000, 5200, 0.3);

      expect(result.recommandation).toBe("equivalent");
      expect(Math.abs(result.difference)).toBeLessThan(500);
    });

    it("devrait recommander equivalent si ecart = 0", () => {
      const result = comparerJeanbrunLMNP(4000, 4000, 0.3);

      expect(result.recommandation).toBe("equivalent");
      expect(result.difference).toBe(0);
    });
  });

  describe("calcul economie sur 9 ans", () => {
    it("devrait calculer les economies sur 9 ans pour Jeanbrun", () => {
      const result = comparerJeanbrunLMNP(5000, 3000, 0.3);

      // Jeanbrun: engagement 9 ans
      // Economie annuelle: 5000 EUR
      // Economie 9 ans: 45000 EUR
      expect(result.jeanbrun.economieAnnuelle).toBe(5000);
      expect(result.jeanbrun.economie9ans).toBe(45000);
    });

    it("devrait calculer les economies sur 9 ans pour LMNP", () => {
      const result = comparerJeanbrunLMNP(5000, 3000, 0.3);

      // LMNP: meme periode de comparaison (9 ans)
      // Economie annuelle: 3000 EUR
      // Economie 9 ans: 27000 EUR
      expect(result.lmnpReel.economieAnnuelle).toBe(3000);
      expect(result.lmnpReel.economie9ans).toBe(27000);
    });
  });

  describe("justification", () => {
    it("devrait inclure la TMI dans la justification", () => {
      const result = comparerJeanbrunLMNP(5000, 3000, 0.41);

      expect(result.justification).toContain("41");
    });

    it("devrait expliquer l'avantage Jeanbrun", () => {
      const result = comparerJeanbrunLMNP(8000, 4000, 0.3);

      expect(result.justification.length).toBeGreaterThan(20);
      expect(result.recommandation).toBe("jeanbrun");
    });

    it("devrait expliquer l'avantage LMNP", () => {
      const result = comparerJeanbrunLMNP(3000, 7000, 0.3);

      expect(result.justification.length).toBeGreaterThan(20);
      expect(result.recommandation).toBe("lmnp");
    });
  });

  describe("cas limites", () => {
    it("devrait gerer des economies nulles", () => {
      const result = comparerJeanbrunLMNP(0, 0, 0.3);

      expect(result.recommandation).toBe("equivalent");
      expect(result.jeanbrun.economieAnnuelle).toBe(0);
      expect(result.lmnpReel.economieAnnuelle).toBe(0);
    });

    it("devrait gerer TMI 0%", () => {
      const result = comparerJeanbrunLMNP(5000, 3000, 0);

      expect(result.recommandation).toBe("jeanbrun");
      expect(result.justification).toBeDefined();
    });

    it("devrait gerer TMI 45%", () => {
      const result = comparerJeanbrunLMNP(10000, 8000, 0.45);

      expect(result.recommandation).toBe("jeanbrun");
      expect(result.justification).toContain("45");
    });
  });
});

// ============================================
// VALIDATION ERRORS
// ============================================

describe("validation errors", () => {
  describe("calculerLMNPMicroBIC", () => {
    it("devrait gerer recettes NaN", () => {
      const result = calculerLMNPMicroBIC(NaN, "longue_duree");
      expect(result.regime).toBe("micro");
      // Note: L'implementation actuelle ne valide pas NaN explicitement
      // NaN est traite comme une valeur normale (propagation)
      expect(result).toBeDefined();
    });

    it("devrait gerer recettes Infinity", () => {
      const result = calculerLMNPMicroBIC(Infinity, "longue_duree");
      // Infinity > plafond 77700, donc ineligible
      expect(result.beneficeImposable).toBe(0);
    });
  });

  describe("calculerLMNPReel", () => {
    it("devrait gerer recettes negatives", () => {
      const input: LMNPInput = {
        recettesAnnuelles: -5000,
        chargesAnnuelles: 1000,
        prixAcquisition: 100000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);
      // Resultat avant amortissement negatif = deficit
      expect(result.deficitReportable).toBeDefined();
    });

    it("devrait gerer charges negatives", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 10000,
        chargesAnnuelles: -2000, // Charges negatives = aberrant
        prixAcquisition: 100000,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);
      // Resultat = 10000 - (-2000) = 12000
      expect(result).toBeDefined();
    });

    it("devrait gerer prix acquisition NaN", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 10000,
        chargesAnnuelles: 2000,
        prixAcquisition: NaN,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);
      // Amortissement sera NaN
      expect(Number.isNaN(result.amortissementAnnuel)).toBe(true);
    });

    it("devrait gerer frais notaire negatifs", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 10000,
        chargesAnnuelles: 1000,
        prixAcquisition: 100000,
        fraisNotaire: -5000, // Frais negatifs
        typeLocation: "longue_duree",
      };

      const result = calculerLMNPReel(input);
      expect(result).toBeDefined();
    });
  });

  describe("calculerLMNP", () => {
    it("devrait gerer valeurs limites sans planter", () => {
      const input: LMNPInput = {
        recettesAnnuelles: 0,
        chargesAnnuelles: 0,
        prixAcquisition: 0,
        typeLocation: "longue_duree",
      };

      const result = calculerLMNP(input);
      expect(result).toBeDefined();
      expect(result.beneficeImposable).toBe(0);
    });
  });

  describe("comparerJeanbrunLMNP", () => {
    it("devrait gerer economies NaN", () => {
      const result = comparerJeanbrunLMNP(NaN, 3000, 0.3);
      expect(Number.isNaN(result.difference)).toBe(true);
    });

    it("devrait gerer TMI negative", () => {
      const result = comparerJeanbrunLMNP(5000, 3000, -0.1);
      // TMI negative = calcul aberrant mais pas d'erreur
      expect(result).toBeDefined();
    });

    it("devrait gerer TMI > 1", () => {
      const result = comparerJeanbrunLMNP(5000, 3000, 1.5);
      // TMI > 100% = aberrant
      expect(result).toBeDefined();
    });
  });
});
