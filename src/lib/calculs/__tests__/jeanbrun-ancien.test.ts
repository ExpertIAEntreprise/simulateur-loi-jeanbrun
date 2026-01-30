/**
 * Tests pour le module de calcul Jeanbrun ANCIEN
 *
 * TDD Phase 3 - Tests ecrits AVANT l'implementation
 *
 * Parametres Jeanbrun Ancien:
 * - Condition: travaux >= 30% du prix d'achat
 * - Base amortissement: 80% du prix total (achat + travaux)
 * - Duree engagement: 9 ans obligatoire
 * - Plafond unique: 10 700 EUR/an
 * - Niveaux de loyer:
 *   - Intermediaire: 3.0%, plafond 10 700 EUR/an
 *   - Social: 3.5%, plafond 10 700 EUR/an
 *   - Tres social: 4.0%, plafond 10 700 EUR/an
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect } from "vitest";
import {
  calculerJeanbrunAncien,
  calculerTravauxMinimum,
  verifierEligibiliteTravaux,
} from "../jeanbrun-ancien";
import type { JeanbrunAncienInput } from "../types/jeanbrun";

describe("calculerTravauxMinimum", () => {
  it("calcule le seuil minimum de travaux (30% du prix d'achat)", () => {
    // Prix achat 150 000 EUR
    // Seuil travaux = 150 000 * 0.3 = 45 000 EUR
    expect(calculerTravauxMinimum(150000)).toBe(45000);
  });

  it("calcule pour un prix de 100 000 EUR", () => {
    expect(calculerTravauxMinimum(100000)).toBe(30000);
  });

  it("calcule pour un prix de 200 000 EUR", () => {
    expect(calculerTravauxMinimum(200000)).toBe(60000);
  });

  it("retourne 0 pour un prix de 0", () => {
    expect(calculerTravauxMinimum(0)).toBe(0);
  });

  it("retourne 0 pour un prix negatif", () => {
    expect(calculerTravauxMinimum(-100000)).toBe(0);
  });

  it("arrondit a l'euro", () => {
    // Prix achat 123 456 EUR
    // Seuil = 123 456 * 0.3 = 37 036.8 -> 37 037 EUR
    const result = calculerTravauxMinimum(123456);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("verifierEligibiliteTravaux", () => {
  describe("eligibilite avec travaux suffisants", () => {
    it("retourne eligible pour travaux = 30% exact", () => {
      // Prix achat 150 000 EUR
      // Travaux 45 000 EUR (= 30%)
      const result = verifierEligibiliteTravaux(150000, 45000);

      expect(result.eligible).toBe(true);
      expect(result.seuilRequis).toBe(45000);
      expect(result.montantManquant).toBeUndefined();
    });

    it("retourne eligible pour travaux > 30%", () => {
      // Prix achat 150 000 EUR
      // Travaux 50 000 EUR (= 33%)
      const result = verifierEligibiliteTravaux(150000, 50000);

      expect(result.eligible).toBe(true);
      expect(result.seuilRequis).toBe(45000);
      expect(result.montantManquant).toBeUndefined();
    });
  });

  describe("ineligibilite avec travaux insuffisants", () => {
    it("retourne ineligible pour travaux < 30%", () => {
      // Prix achat 150 000 EUR
      // Travaux 37 500 EUR (= 25%)
      // Seuil requis = 45 000 EUR
      // Montant manquant = 45 000 - 37 500 = 7 500 EUR
      const result = verifierEligibiliteTravaux(150000, 37500);

      expect(result.eligible).toBe(false);
      expect(result.seuilRequis).toBe(45000);
      expect(result.montantManquant).toBe(7500);
    });

    it("retourne ineligible pour travaux a 20%", () => {
      // Prix achat 100 000 EUR
      // Travaux 20 000 EUR (= 20%)
      // Seuil requis = 30 000 EUR
      // Montant manquant = 30 000 - 20 000 = 10 000 EUR
      const result = verifierEligibiliteTravaux(100000, 20000);

      expect(result.eligible).toBe(false);
      expect(result.seuilRequis).toBe(30000);
      expect(result.montantManquant).toBe(10000);
    });

    it("retourne ineligible pour travaux a 0", () => {
      const result = verifierEligibiliteTravaux(150000, 0);

      expect(result.eligible).toBe(false);
      expect(result.seuilRequis).toBe(45000);
      expect(result.montantManquant).toBe(45000);
    });
  });

  describe("cas limites", () => {
    it("gere un prix d'achat de 0", () => {
      const result = verifierEligibiliteTravaux(0, 10000);

      // Avec 0 EUR d'achat, le seuil est 0, donc eligible
      expect(result.eligible).toBe(true);
      expect(result.seuilRequis).toBe(0);
    });

    it("gere des valeurs negatives", () => {
      const result = verifierEligibiliteTravaux(-100000, 30000);

      // Prix negatif -> seuil 0 -> eligible
      expect(result.seuilRequis).toBe(0);
    });
  });
});

describe("calculerJeanbrunAncien", () => {
  describe("ineligibilite - travaux insuffisants", () => {
    it("retourne ineligible pour travaux 25% (150k EUR + 37.5k EUR)", () => {
      // Prix achat 150 000 EUR
      // Travaux 37 500 EUR (= 25% < 30%)
      const input: JeanbrunAncienInput = {
        prixAchat: 150000,
        montantTravaux: 37500,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(false);
      // Type narrowing: apres la verification ci-dessus, TypeScript sait que c'est JeanbrunAncienIneligible
      if (!result.eligible) {
        expect(result.message).toBeDefined();
        expect(result.seuilTravauxRequis).toBe(45000);
        expect(result.montantManquant).toBe(7500);
      }

      // Les champs de calcul ne doivent pas exister sur JeanbrunAncienIneligible
      expect("prixTotal" in result).toBe(false);
      expect("baseAmortissement" in result).toBe(false);
      expect("amortissementBrut" in result).toBe(false);
      expect("amortissementNet" in result).toBe(false);
    });

    it("retourne ineligible pour travaux 20%", () => {
      // Prix achat 100 000 EUR
      // Travaux 20 000 EUR (= 20%)
      const input: JeanbrunAncienInput = {
        prixAchat: 100000,
        montantTravaux: 20000,
        niveauLoyer: "social",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(false);
      if (!result.eligible) {
        expect(result.seuilTravauxRequis).toBe(30000);
        expect(result.montantManquant).toBe(10000);
      }
    });
  });

  describe("eligibilite - niveau intermediaire (3.0%)", () => {
    it("calcule correctement pour 30% de travaux", () => {
      // Prix achat 150 000 EUR
      // Travaux 45 000 EUR (= 30%)
      // Prix total = 150 000 + 45 000 = 195 000 EUR
      // Base = 195 000 * 0.8 = 156 000 EUR
      // Amortissement brut = 156 000 * 0.03 = 4 680 EUR
      // Amortissement net = 4 680 EUR (< plafond 10 700)
      const input: JeanbrunAncienInput = {
        prixAchat: 150000,
        montantTravaux: 45000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.prixTotal).toBe(195000);
        expect(result.baseAmortissement).toBe(156000);
        expect(result.amortissementBrut).toBe(4680);
        expect(result.amortissementNet).toBe(4680);
        expect(result.plafondApplique).toBe(false);
      }
    });

    it("calcule correctement pour 33% de travaux (150k + 50k)", () => {
      // Prix achat 150 000 EUR
      // Travaux 50 000 EUR (= 33%)
      // Prix total = 150 000 + 50 000 = 200 000 EUR
      // Base = 200 000 * 0.8 = 160 000 EUR
      // Amortissement brut = 160 000 * 0.03 = 4 800 EUR
      const input: JeanbrunAncienInput = {
        prixAchat: 150000,
        montantTravaux: 50000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.prixTotal).toBe(200000);
        expect(result.baseAmortissement).toBe(160000);
        expect(result.amortissementBrut).toBe(4800);
        expect(result.amortissementNet).toBe(4800);
        expect(result.plafondApplique).toBe(false);
      }
    });
  });

  describe("eligibilite - niveau social (3.5%)", () => {
    it("calcule correctement pour niveau social", () => {
      // Prix achat 150 000 EUR
      // Travaux 50 000 EUR
      // Prix total = 200 000 EUR
      // Base = 160 000 EUR
      // Amortissement brut = 160 000 * 0.035 = 5 600 EUR
      const input: JeanbrunAncienInput = {
        prixAchat: 150000,
        montantTravaux: 50000,
        niveauLoyer: "social",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.amortissementBrut).toBe(5600);
        expect(result.amortissementNet).toBe(5600);
        expect(result.plafondApplique).toBe(false);
      }
    });
  });

  describe("eligibilite - niveau tres social (4.0%)", () => {
    it("calcule correctement pour niveau tres social", () => {
      // Prix achat 150 000 EUR
      // Travaux 50 000 EUR
      // Prix total = 200 000 EUR
      // Base = 160 000 EUR
      // Amortissement brut = 160 000 * 0.04 = 6 400 EUR
      const input: JeanbrunAncienInput = {
        prixAchat: 150000,
        montantTravaux: 50000,
        niveauLoyer: "tres_social",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.amortissementBrut).toBe(6400);
        expect(result.amortissementNet).toBe(6400);
        expect(result.plafondApplique).toBe(false);
      }
    });
  });

  describe("plafonnement a 10 700 EUR", () => {
    it("applique le plafond pour un bien couteux niveau intermediaire", () => {
      // Prix achat 400 000 EUR
      // Travaux 150 000 EUR (37.5% > 30%)
      // Prix total = 550 000 EUR
      // Base = 550 000 * 0.8 = 440 000 EUR
      // Amortissement brut = 440 000 * 0.03 = 13 200 EUR
      // Amortissement net = 10 700 EUR (plafond)
      const input: JeanbrunAncienInput = {
        prixAchat: 400000,
        montantTravaux: 150000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.prixTotal).toBe(550000);
        expect(result.baseAmortissement).toBe(440000);
        expect(result.amortissementBrut).toBe(13200);
        expect(result.amortissementNet).toBe(10700);
        expect(result.plafondApplique).toBe(true);
      }
    });

    it("applique le plafond pour niveau tres social", () => {
      // Prix achat 300 000 EUR
      // Travaux 100 000 EUR (33% > 30%)
      // Prix total = 400 000 EUR
      // Base = 400 000 * 0.8 = 320 000 EUR
      // Amortissement brut = 320 000 * 0.04 = 12 800 EUR
      // Amortissement net = 10 700 EUR (plafond)
      const input: JeanbrunAncienInput = {
        prixAchat: 300000,
        montantTravaux: 100000,
        niveauLoyer: "tres_social",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.amortissementBrut).toBe(12800);
        expect(result.amortissementNet).toBe(10700);
        expect(result.plafondApplique).toBe(true);
      }
    });

    it("n'applique pas le plafond si en dessous", () => {
      // Prix achat 200 000 EUR
      // Travaux 60 000 EUR (30%)
      // Prix total = 260 000 EUR
      // Base = 260 000 * 0.8 = 208 000 EUR
      // Amortissement brut = 208 000 * 0.035 = 7 280 EUR (< 10 700)
      const input: JeanbrunAncienInput = {
        prixAchat: 200000,
        montantTravaux: 60000,
        niveauLoyer: "social",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.amortissementBrut).toBe(7280);
        expect(result.amortissementNet).toBe(7280);
        expect(result.plafondApplique).toBe(false);
      }
    });
  });

  describe("cas limites", () => {
    it("gere un prix d'achat de 0", () => {
      const input: JeanbrunAncienInput = {
        prixAchat: 0,
        montantTravaux: 10000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);

      // Avec 0 EUR d'achat, techniquement eligible (seuil = 0)
      // mais le calcul donne des resultats a 0
      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.prixTotal).toBe(10000);
      }
    });

    it("gere des valeurs negatives", () => {
      const input: JeanbrunAncienInput = {
        prixAchat: -100000,
        montantTravaux: 50000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);

      // Prix negatif traite comme 0, donc prixTotal = 0 + 50000 = 50000
      // Base = 50000 * 0.8 = 40000
      // Amortissement = 40000 * 0.03 = 1200
      expect(result.eligible).toBe(true);
      if (result.eligible) {
        expect(result.prixTotal).toBe(50000);
        expect(result.baseAmortissement).toBe(40000);
        expect(result.amortissementNet).toBe(1200);
      }
    });

    it("arrondit les montants a l'euro", () => {
      const input: JeanbrunAncienInput = {
        prixAchat: 123456,
        montantTravaux: 37037, // 30.00008%
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);

      if (result.eligible) {
        expect(Number.isInteger(result.prixTotal)).toBe(true);
        expect(Number.isInteger(result.baseAmortissement)).toBe(true);
        expect(Number.isInteger(result.amortissementBrut)).toBe(true);
        expect(Number.isInteger(result.amortissementNet)).toBe(true);
      }
    });
  });

  describe("message d'erreur pour ineligibilite", () => {
    it("fournit un message explicatif en cas d'ineligibilite", () => {
      const input: JeanbrunAncienInput = {
        prixAchat: 150000,
        montantTravaux: 30000, // 20% < 30%
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);

      expect(result.eligible).toBe(false);
      if (!result.eligible) {
        expect(result.message).toBeDefined();
        expect(typeof result.message).toBe("string");
        expect(result.message.length).toBeGreaterThan(0);
      }
    });
  });
});

describe("validation errors", () => {
  describe("calculerTravauxMinimum", () => {
    it("devrait retourner NaN pour prix NaN", () => {
      const result = calculerTravauxMinimum(NaN);
      expect(Number.isNaN(result)).toBe(true);
    });

    it("devrait retourner Infinity pour prix Infinity", () => {
      const result = calculerTravauxMinimum(Infinity);
      expect(result).toBe(Infinity);
    });
  });

  describe("verifierEligibiliteTravaux", () => {
    it("devrait gerer prixAchat NaN", () => {
      const result = verifierEligibiliteTravaux(NaN, 50000);
      // seuilRequis sera NaN, la comparaison montantTravaux >= NaN est false
      expect(result.eligible).toBe(false);
    });

    it("devrait gerer montantTravaux NaN", () => {
      const result = verifierEligibiliteTravaux(150000, NaN);
      // NaN >= 45000 est false
      expect(result.eligible).toBe(false);
    });

    it("devrait gerer montantTravaux negatif", () => {
      const result = verifierEligibiliteTravaux(150000, -10000);
      // -10000 < 45000 donc ineligible
      expect(result.eligible).toBe(false);
      expect(result.montantManquant).toBe(55000); // 45000 - (-10000)
    });
  });

  describe("calculerJeanbrunAncien", () => {
    it("devrait gerer prixAchat NaN", () => {
      const input: JeanbrunAncienInput = {
        prixAchat: NaN,
        montantTravaux: 50000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunAncien(input);
      // seuilTravaux sera NaN, donc ineligible
      expect(result.eligible).toBe(false);
    });

    it("devrait gerer montantTravaux NaN", () => {
      const input: JeanbrunAncienInput = {
        prixAchat: 150000,
        montantTravaux: NaN,
        niveauLoyer: "social",
      };

      const result = calculerJeanbrunAncien(input);
      expect(result.eligible).toBe(false);
    });

    it("devrait gerer les deux valeurs negatives", () => {
      const input: JeanbrunAncienInput = {
        prixAchat: -100000,
        montantTravaux: -50000,
        niveauLoyer: "tres_social",
      };

      const result = calculerJeanbrunAncien(input);
      // prixAchat negatif -> seuil = 0 -> -50000 < 0 -> ineligible
      expect(result.eligible).toBe(false);
    });
  });
});
