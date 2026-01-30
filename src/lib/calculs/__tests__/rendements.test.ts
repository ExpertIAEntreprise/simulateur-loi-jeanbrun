/**
 * Tests pour le module de calcul des rendements immobiliers
 *
 * TDD Phase 5 - Tests ecrits AVANT l'implementation
 *
 * Formules (FORMULES.md section 9):
 * - Rendement brut = (loyerAnnuel / prixAcquisition) * 100
 * - Rendement net = ((loyerAnnuel - chargesAnnuelles) / (prixAcquisition + fraisAcquisition)) * 100
 * - Rendement net-net = ((loyerAnnuel - chargesAnnuelles - impotsAnnuels - prelevementsSociaux) / investissementTotal) * 100
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect } from "vitest";
import { calculerRendements } from "../rendements";
import type { RendementsInput } from "../types/rendements";

describe("calculerRendements", () => {
  describe("rendement brut", () => {
    it("devrait calculer le rendement brut basique", () => {
      const input: RendementsInput = {
        loyerAnnuel: 9600,
        prixAcquisition: 200000,
      };

      const result = calculerRendements(input);

      // 9600 / 200000 * 100 = 4.8%
      expect(result.rendementBrut).toBe(4.8);
    });

    it("devrait calculer un rendement brut eleve (8%)", () => {
      const input: RendementsInput = {
        loyerAnnuel: 12000,
        prixAcquisition: 150000,
      };

      const result = calculerRendements(input);

      // 12000 / 150000 * 100 = 8%
      expect(result.rendementBrut).toBe(8);
    });

    it("devrait calculer un rendement brut faible (3%)", () => {
      const input: RendementsInput = {
        loyerAnnuel: 6000,
        prixAcquisition: 200000,
      };

      const result = calculerRendements(input);

      // 6000 / 200000 * 100 = 3%
      expect(result.rendementBrut).toBe(3);
    });
  });

  describe("rendement net de charges", () => {
    it("devrait calculer le rendement net avec charges et frais d'acquisition", () => {
      const input: RendementsInput = {
        loyerAnnuel: 9600,
        prixAcquisition: 200000,
        chargesAnnuelles: 1200, // copro + taxe fonciere
        fraisAcquisition: 16000, // 8% frais notaire
      };

      const result = calculerRendements(input);

      // loyerNet = 9600 - 1200 = 8400
      // investissementTotal = 200000 + 16000 = 216000
      // rendementNet = (8400 / 216000) * 100 = 3.888...%
      expect(result.rendementNet).toBeCloseTo(3.89, 1);
    });

    it("devrait calculer le rendement net avec charges elevees", () => {
      const input: RendementsInput = {
        loyerAnnuel: 12000,
        prixAcquisition: 180000,
        chargesAnnuelles: 3000,
        fraisAcquisition: 14400, // 8%
      };

      const result = calculerRendements(input);

      // loyerNet = 12000 - 3000 = 9000
      // investissementTotal = 180000 + 14400 = 194400
      // rendementNet = (9000 / 194400) * 100 = 4.629...%
      expect(result.rendementNet).toBeCloseTo(4.63, 1);
    });
  });

  describe("rendement net-net apres fiscalite", () => {
    it("devrait calculer le rendement net-net avec impots et prelevements sociaux", () => {
      const input: RendementsInput = {
        loyerAnnuel: 9600,
        prixAcquisition: 200000,
        chargesAnnuelles: 1200,
        fraisAcquisition: 16000,
        impotsAnnuels: 2520, // TMI 30% sur 8400 EUR de revenu foncier
        prelevementsSociaux: 1445, // 17.2%
      };

      const result = calculerRendements(input);

      // loyerNetNet = 9600 - 1200 - 2520 - 1445 = 4435
      // investissementTotal = 200000 + 16000 = 216000
      // rendementNetNet = (4435 / 216000) * 100 = 2.053...%
      expect(result.rendementNetNet).toBeCloseTo(2.05, 1);
    });

    it("devrait calculer le rendement net-net pour TMI 41%", () => {
      const input: RendementsInput = {
        loyerAnnuel: 15000,
        prixAcquisition: 250000,
        chargesAnnuelles: 2000,
        fraisAcquisition: 20000, // 8%
        impotsAnnuels: 5330, // TMI 41% sur revenu net 13000
        prelevementsSociaux: 2236, // 17.2% sur 13000
      };

      const result = calculerRendements(input);

      // loyerNetNet = 15000 - 2000 - 5330 - 2236 = 5434
      // investissementTotal = 250000 + 20000 = 270000
      // rendementNetNet = (5434 / 270000) * 100 = 2.012...%
      expect(result.rendementNetNet).toBeCloseTo(2.01, 1);
    });

    it("devrait gerer un rendement net-net negatif (charges > loyers)", () => {
      const input: RendementsInput = {
        loyerAnnuel: 6000,
        prixAcquisition: 200000,
        chargesAnnuelles: 3000,
        fraisAcquisition: 16000,
        impotsAnnuels: 2000,
        prelevementsSociaux: 1500,
      };

      const result = calculerRendements(input);

      // loyerNetNet = 6000 - 3000 - 2000 - 1500 = -500
      // investissementTotal = 216000
      // rendementNetNet = (-500 / 216000) * 100 = -0.231...%
      expect(result.rendementNetNet).toBeCloseTo(-0.23, 1);
    });
  });

  describe("valeurs par defaut (0)", () => {
    it("devrait utiliser 0 pour les valeurs optionnelles non fournies", () => {
      const input: RendementsInput = {
        loyerAnnuel: 12000,
        prixAcquisition: 150000,
      };

      const result = calculerRendements(input);

      // rendementBrut = 12000 / 150000 * 100 = 8%
      expect(result.rendementBrut).toBe(8);

      // rendementNet = (12000 - 0) / (150000 + 0) * 100 = 8%
      expect(result.rendementNet).toBe(8);

      // rendementNetNet = (12000 - 0 - 0 - 0) / (150000 + 0) * 100 = 8%
      expect(result.rendementNetNet).toBe(8);
    });

    it("devrait utiliser 0 pour chargesAnnuelles non fournies", () => {
      const input: RendementsInput = {
        loyerAnnuel: 10000,
        prixAcquisition: 200000,
        fraisAcquisition: 16000,
      };

      const result = calculerRendements(input);

      // rendementNet = 10000 / 216000 * 100 = 4.629...%
      expect(result.rendementNet).toBeCloseTo(4.63, 1);
    });

    it("devrait utiliser 0 pour fraisAcquisition non fournis", () => {
      const input: RendementsInput = {
        loyerAnnuel: 10000,
        prixAcquisition: 200000,
        chargesAnnuelles: 1000,
      };

      const result = calculerRendements(input);

      // rendementNet = (10000 - 1000) / 200000 * 100 = 4.5%
      expect(result.rendementNet).toBe(4.5);
    });
  });

  describe("arrondi a 2 decimales", () => {
    it("devrait arrondir le rendement brut a 2 decimales", () => {
      const input: RendementsInput = {
        loyerAnnuel: 10000,
        prixAcquisition: 333333,
      };

      const result = calculerRendements(input);

      // 10000 / 333333 = 3.000003... -> 3.00
      expect(result.rendementBrut).toBe(3);
    });

    it("devrait arrondir correctement 4.444444 a 4.44", () => {
      const input: RendementsInput = {
        loyerAnnuel: 8000,
        prixAcquisition: 180000,
      };

      const result = calculerRendements(input);

      // 8000 / 180000 = 4.444...%
      expect(result.rendementBrut).toBe(4.44);
    });

    it("devrait arrondir correctement 3.33333 a 3.33", () => {
      const input: RendementsInput = {
        loyerAnnuel: 10000,
        prixAcquisition: 300000,
      };

      const result = calculerRendements(input);

      // 10000 / 300000 = 3.333...%
      expect(result.rendementBrut).toBe(3.33);
    });

    it("devrait arrondir vers le haut 3.335 -> 3.34", () => {
      const input: RendementsInput = {
        loyerAnnuel: 6670,
        prixAcquisition: 200000,
      };

      const result = calculerRendements(input);

      // 6670 / 200000 = 3.335%
      expect(result.rendementBrut).toBe(3.34);
    });
  });

  describe("cas limites", () => {
    it("devrait retourner 0 pour tous les rendements si prixAcquisition = 0", () => {
      const input: RendementsInput = {
        loyerAnnuel: 10000,
        prixAcquisition: 0,
      };

      const result = calculerRendements(input);

      expect(result.rendementBrut).toBe(0);
      expect(result.rendementNet).toBe(0);
      expect(result.rendementNetNet).toBe(0);
    });

    it("devrait retourner 0 pour tous les rendements si loyerAnnuel = 0", () => {
      const input: RendementsInput = {
        loyerAnnuel: 0,
        prixAcquisition: 200000,
      };

      const result = calculerRendements(input);

      expect(result.rendementBrut).toBe(0);
      expect(result.rendementNet).toBe(0);
      expect(result.rendementNetNet).toBe(0);
    });

    it("devrait gerer un investissement total = 0 (prix + frais = 0)", () => {
      const input: RendementsInput = {
        loyerAnnuel: 10000,
        prixAcquisition: 0,
        fraisAcquisition: 0,
      };

      const result = calculerRendements(input);

      // Protection contre division par 0
      expect(result.rendementBrut).toBe(0);
      expect(result.rendementNet).toBe(0);
      expect(result.rendementNetNet).toBe(0);
    });

    it("devrait gerer des valeurs negatives pour loyer (cas theorique)", () => {
      const input: RendementsInput = {
        loyerAnnuel: -5000, // Cas aberrant mais a gerer
        prixAcquisition: 200000,
      };

      const result = calculerRendements(input);

      // -5000 / 200000 * 100 = -2.5%
      expect(result.rendementBrut).toBe(-2.5);
    });

    it("devrait gerer fraisAcquisition negatifs rendant investissementTotal <= 0", () => {
      // Cas theorique: frais negatifs qui annulent le prix
      const input: RendementsInput = {
        loyerAnnuel: 10000,
        prixAcquisition: 100,
        fraisAcquisition: -200, // frais negatifs (cas aberrant)
      };

      const result = calculerRendements(input);

      // investissementTotal = 100 + (-200) = -100 <= 0
      // Protection contre division par valeur negative/zero
      expect(result.rendementBrut).toBe(0);
      expect(result.rendementNet).toBe(0);
      expect(result.rendementNetNet).toBe(0);
    });
  });

  describe("exemples de la documentation", () => {
    it("devrait correspondre a l'exemple FORMULES.md: 9600/200000 = 4.8%", () => {
      const input: RendementsInput = {
        loyerAnnuel: 9600,
        prixAcquisition: 200000,
      };

      const result = calculerRendements(input);

      expect(result.rendementBrut).toBe(4.8);
    });

    it("devrait calculer un scenario complet realiste", () => {
      // Bien a 250000 EUR, frais notaire 8%, loyer 900 EUR/mois
      // Charges: 1500 EUR copro + 1200 EUR taxe fonciere = 2700 EUR/an
      // TMI 30%: impot sur revenu net (10800-2700=8100) = 2430 EUR
      // PS 17.2%: 8100 * 0.172 = 1393 EUR
      const input: RendementsInput = {
        loyerAnnuel: 10800, // 900 EUR/mois * 12
        prixAcquisition: 250000,
        chargesAnnuelles: 2700,
        fraisAcquisition: 20000, // 8%
        impotsAnnuels: 2430,
        prelevementsSociaux: 1393,
      };

      const result = calculerRendements(input);

      // Rendement brut = 10800 / 250000 * 100 = 4.32%
      expect(result.rendementBrut).toBe(4.32);

      // Rendement net = (10800 - 2700) / 270000 * 100 = 3%
      expect(result.rendementNet).toBe(3);

      // Rendement net-net = (10800 - 2700 - 2430 - 1393) / 270000 * 100 = 1.58%
      expect(result.rendementNetNet).toBeCloseTo(1.58, 1);
    });
  });

  describe("type de retour", () => {
    it("devrait retourner un objet RendementsResult complet", () => {
      const input: RendementsInput = {
        loyerAnnuel: 9600,
        prixAcquisition: 200000,
      };

      const result = calculerRendements(input);

      expect(result).toHaveProperty("rendementBrut");
      expect(result).toHaveProperty("rendementNet");
      expect(result).toHaveProperty("rendementNetNet");
      expect(typeof result.rendementBrut).toBe("number");
      expect(typeof result.rendementNet).toBe("number");
      expect(typeof result.rendementNetNet).toBe("number");
    });
  });
});
