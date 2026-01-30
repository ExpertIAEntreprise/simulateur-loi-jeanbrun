/**
 * Tests pour le module de calcul Jeanbrun NEUF
 *
 * TDD Phase 3 - Tests ecrits AVANT l'implementation
 *
 * Parametres Jeanbrun Neuf:
 * - Base amortissement: 80% du prix d'acquisition (terrain exclu)
 * - Duree engagement: 9 ans obligatoire
 * - Niveaux de loyer:
 *   - Intermediaire: 3.5%, plafond 8 000 EUR/an
 *   - Social: 4.5%, plafond 10 000 EUR/an
 *   - Tres social: 5.5%, plafond 12 000 EUR/an
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect } from "vitest";
import {
  calculerJeanbrunNeuf,
  tableauAmortissementNeuf,
} from "../jeanbrun-neuf";
import type { JeanbrunNeufInput } from "../types/jeanbrun";

describe("calculerJeanbrunNeuf", () => {
  describe("niveau intermediaire (3.5%, plafond 8 000 EUR)", () => {
    it("calcule correctement pour 200k EUR sans plafonnement", () => {
      // Prix 200 000 EUR
      // Base = 200 000 * 0.8 = 160 000 EUR
      // Amortissement brut = 160 000 * 0.035 = 5 600 EUR
      // Amortissement net = 5 600 EUR (< plafond 8 000)
      const input: JeanbrunNeufInput = {
        prixAcquisition: 200000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(160000);
      expect(result.amortissementBrut).toBe(5600);
      expect(result.amortissementNet).toBe(5600);
      expect(result.plafondApplique).toBe(false);
      expect(result.plafond).toBe(8000);
      expect(result.taux).toBe(0.035);
    });

    it("applique le plafond pour 300k EUR", () => {
      // Prix 300 000 EUR
      // Base = 300 000 * 0.8 = 240 000 EUR
      // Amortissement brut = 240 000 * 0.035 = 8 400 EUR
      // Amortissement net = 8 000 EUR (plafond atteint)
      const input: JeanbrunNeufInput = {
        prixAcquisition: 300000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(240000);
      expect(result.amortissementBrut).toBe(8400);
      expect(result.amortissementNet).toBe(8000);
      expect(result.plafondApplique).toBe(true);
      expect(result.plafond).toBe(8000);
      expect(result.taux).toBe(0.035);
    });

    it("calcule correctement pour 100k EUR", () => {
      // Prix 100 000 EUR
      // Base = 100 000 * 0.8 = 80 000 EUR
      // Amortissement brut = 80 000 * 0.035 = 2 800 EUR
      const input: JeanbrunNeufInput = {
        prixAcquisition: 100000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(80000);
      expect(result.amortissementBrut).toBe(2800);
      expect(result.amortissementNet).toBe(2800);
      expect(result.plafondApplique).toBe(false);
    });
  });

  describe("niveau social (4.5%, plafond 10 000 EUR)", () => {
    it("calcule correctement pour 200k EUR sans plafonnement", () => {
      // Prix 200 000 EUR
      // Base = 200 000 * 0.8 = 160 000 EUR
      // Amortissement brut = 160 000 * 0.045 = 7 200 EUR
      // Amortissement net = 7 200 EUR (< plafond 10 000)
      const input: JeanbrunNeufInput = {
        prixAcquisition: 200000,
        niveauLoyer: "social",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(160000);
      expect(result.amortissementBrut).toBe(7200);
      expect(result.amortissementNet).toBe(7200);
      expect(result.plafondApplique).toBe(false);
      expect(result.plafond).toBe(10000);
      expect(result.taux).toBe(0.045);
    });

    it("applique le plafond pour 300k EUR", () => {
      // Prix 300 000 EUR
      // Base = 300 000 * 0.8 = 240 000 EUR
      // Amortissement brut = 240 000 * 0.045 = 10 800 EUR
      // Amortissement net = 10 000 EUR (plafond atteint)
      const input: JeanbrunNeufInput = {
        prixAcquisition: 300000,
        niveauLoyer: "social",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(240000);
      expect(result.amortissementBrut).toBe(10800);
      expect(result.amortissementNet).toBe(10000);
      expect(result.plafondApplique).toBe(true);
    });
  });

  describe("niveau tres social (5.5%, plafond 12 000 EUR)", () => {
    it("calcule correctement pour 200k EUR sans plafonnement", () => {
      // Prix 200 000 EUR
      // Base = 200 000 * 0.8 = 160 000 EUR
      // Amortissement brut = 160 000 * 0.055 = 8 800 EUR
      // Amortissement net = 8 800 EUR (< plafond 12 000)
      const input: JeanbrunNeufInput = {
        prixAcquisition: 200000,
        niveauLoyer: "tres_social",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(160000);
      expect(result.amortissementBrut).toBe(8800);
      expect(result.amortissementNet).toBe(8800);
      expect(result.plafondApplique).toBe(false);
      expect(result.plafond).toBe(12000);
      expect(result.taux).toBe(0.055);
    });

    it("applique le plafond pour 300k EUR", () => {
      // Prix 300 000 EUR
      // Base = 300 000 * 0.8 = 240 000 EUR
      // Amortissement brut = 240 000 * 0.055 = 13 200 EUR
      // Amortissement net = 12 000 EUR (plafond atteint)
      const input: JeanbrunNeufInput = {
        prixAcquisition: 300000,
        niveauLoyer: "tres_social",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(240000);
      expect(result.amortissementBrut).toBe(13200);
      expect(result.amortissementNet).toBe(12000);
      expect(result.plafondApplique).toBe(true);
    });
  });

  describe("cas limites", () => {
    it("retourne 0 pour un prix de 0", () => {
      const input: JeanbrunNeufInput = {
        prixAcquisition: 0,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(0);
      expect(result.amortissementBrut).toBe(0);
      expect(result.amortissementNet).toBe(0);
      expect(result.plafondApplique).toBe(false);
    });

    it("gere un prix negatif", () => {
      const input: JeanbrunNeufInput = {
        prixAcquisition: -100000,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(result.baseAmortissement).toBe(0);
      expect(result.amortissementBrut).toBe(0);
      expect(result.amortissementNet).toBe(0);
    });

    it("arrondit les montants a l'euro", () => {
      // Prix 123 456 EUR
      // Base = 123 456 * 0.8 = 98 764.8 -> 98 765 EUR
      // Amortissement brut = 98 764.8 * 0.035 = 3 456.768 -> 3 457 EUR
      const input: JeanbrunNeufInput = {
        prixAcquisition: 123456,
        niveauLoyer: "intermediaire",
      };

      const result = calculerJeanbrunNeuf(input);

      expect(Number.isInteger(result.baseAmortissement)).toBe(true);
      expect(Number.isInteger(result.amortissementBrut)).toBe(true);
      expect(Number.isInteger(result.amortissementNet)).toBe(true);
    });
  });
});

describe("tableauAmortissementNeuf", () => {
  it("genere un tableau de 9 lignes pour 200k EUR intermediaire", () => {
    const input: JeanbrunNeufInput = {
      prixAcquisition: 200000,
      niveauLoyer: "intermediaire",
    };

    const tableau = tableauAmortissementNeuf(input);

    // Duree engagement = 9 ans
    expect(tableau).toHaveLength(9);

    // Amortissement annuel = 5 600 EUR (calcule precedemment)
    const amortissementAnnuel = 5600;

    // Verification de chaque ligne
    for (let i = 0; i < 9; i++) {
      const ligne = tableau[i];
      expect(ligne).toBeDefined();
      expect(ligne!.annee).toBe(i + 1);
      expect(ligne!.amortissement).toBe(amortissementAnnuel);
      expect(ligne!.cumul).toBe(amortissementAnnuel * (i + 1));
    }

    // Verification du cumul total
    const derniereLigne = tableau[8];
    expect(derniereLigne!.cumul).toBe(amortissementAnnuel * 9); // 50 400 EUR
  });

  it("genere un tableau avec plafonnement pour 300k EUR intermediaire", () => {
    const input: JeanbrunNeufInput = {
      prixAcquisition: 300000,
      niveauLoyer: "intermediaire",
    };

    const tableau = tableauAmortissementNeuf(input);

    expect(tableau).toHaveLength(9);

    // Amortissement plafonne a 8 000 EUR
    const amortissementAnnuel = 8000;

    for (let i = 0; i < 9; i++) {
      const ligne = tableau[i];
      expect(ligne!.amortissement).toBe(amortissementAnnuel);
      expect(ligne!.cumul).toBe(amortissementAnnuel * (i + 1));
    }

    // Cumul total = 72 000 EUR
    const derniereLigne = tableau[8];
    expect(derniereLigne!.cumul).toBe(72000);
  });

  it("genere un tableau vide pour un prix de 0", () => {
    const input: JeanbrunNeufInput = {
      prixAcquisition: 0,
      niveauLoyer: "intermediaire",
    };

    const tableau = tableauAmortissementNeuf(input);

    // Meme avec 0 EUR, on doit avoir 9 lignes a 0 EUR
    expect(tableau).toHaveLength(9);
    for (const ligne of tableau) {
      expect(ligne.amortissement).toBe(0);
    }
  });

  it("retourne des entiers pour tous les montants", () => {
    const input: JeanbrunNeufInput = {
      prixAcquisition: 123456,
      niveauLoyer: "intermediaire",
    };

    const tableau = tableauAmortissementNeuf(input);

    for (const ligne of tableau) {
      expect(Number.isInteger(ligne.annee)).toBe(true);
      expect(Number.isInteger(ligne.amortissement)).toBe(true);
      expect(Number.isInteger(ligne.cumul)).toBe(true);
    }
  });

  it("calcule correctement pour niveau tres social sur 9 ans", () => {
    const input: JeanbrunNeufInput = {
      prixAcquisition: 200000,
      niveauLoyer: "tres_social",
    };

    const tableau = tableauAmortissementNeuf(input);

    // Amortissement annuel = 8 800 EUR
    expect(tableau).toHaveLength(9);

    const premiereLigne = tableau[0];
    expect(premiereLigne!.annee).toBe(1);
    expect(premiereLigne!.amortissement).toBe(8800);
    expect(premiereLigne!.cumul).toBe(8800);

    const derniereLigne = tableau[8];
    expect(derniereLigne!.annee).toBe(9);
    expect(derniereLigne!.cumul).toBe(8800 * 9); // 79 200 EUR
  });
});
