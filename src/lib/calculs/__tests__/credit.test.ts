/**
 * Tests unitaires pour le module de calcul de credit immobilier
 *
 * @module credit.test
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect } from "vitest";
import {
  calculerCredit,
  calculerCapaciteEmprunt,
  calculerTauxEndettement,
} from "../credit";
import type { CreditInput } from "../types/credit";

// ============================================
// TESTS: calculerCredit
// ============================================

describe("calculerCredit", () => {
  describe("Calcul de la mensualite", () => {
    it("calcule correctement une mensualite pour 200 000 EUR a 3.5% sur 20 ans", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
      };

      // Act
      const result = calculerCredit(input);

      // Assert - Mensualite attendue environ 1160 EUR
      expect(result.mensualiteHorsAssurance).toBeCloseTo(1160, -1);
      expect(result.mensualiteHorsAssurance).toBeGreaterThan(1155);
      expect(result.mensualiteHorsAssurance).toBeLessThan(1165);
    });

    it("calcule correctement une mensualite pour 150 000 EUR a 4% sur 15 ans", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 150000,
        tauxAnnuel: 0.04,
        dureeMois: 180,
      };

      // Act
      const result = calculerCredit(input);

      // Assert - Verification par formule: M = 150000 * (0.04/12) / (1 - (1 + 0.04/12)^(-180))
      // M ≈ 1109.53
      expect(result.mensualiteHorsAssurance).toBeCloseTo(1109.53, 0);
    });

    it("calcule correctement une mensualite pour 300 000 EUR a 2.5% sur 25 ans", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 300000,
        tauxAnnuel: 0.025,
        dureeMois: 300,
      };

      // Act
      const result = calculerCredit(input);

      // Assert - M ≈ 1345.85
      expect(result.mensualiteHorsAssurance).toBeCloseTo(1345.85, 0);
    });

    it("inclut l'assurance dans la mensualite totale", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
        tauxAssurance: 0.0034, // 0.34% par an sur capital initial
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      // Assurance mensuelle = 200000 * 0.0034 / 12 ≈ 56.67
      const assuranceMensuelle = (200000 * 0.0034) / 12;
      expect(result.mensualiteAvecAssurance).toBeCloseTo(
        result.mensualiteHorsAssurance + assuranceMensuelle,
        2
      );
      expect(result.mensualiteAvecAssurance).toBeGreaterThan(
        result.mensualiteHorsAssurance
      );
    });

    it("gere le cas sans assurance (mensualites egales)", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0.03,
        dureeMois: 120,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      expect(result.mensualiteAvecAssurance).toBe(
        result.mensualiteHorsAssurance
      );
      expect(result.totalAssurance).toBeUndefined();
    });
  });

  describe("Calcul du cout total et des interets", () => {
    it("calcule le total des interets sur la duree du pret", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      // Total paye = mensualite * 240
      // Interets = Total paye - Capital
      const totalPaye = result.mensualiteHorsAssurance * 240;
      const interetsAttendus = totalPaye - 200000;
      expect(result.totalInterets).toBeCloseTo(interetsAttendus, 0);
      expect(result.totalInterets).toBeGreaterThan(70000); // Environ 78000 EUR
      expect(result.totalInterets).toBeLessThan(85000);
    });

    it("calcule le cout total du credit (capital + interets + assurance)", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
        tauxAssurance: 0.0034,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      const totalAssurance = result.totalAssurance ?? 0;
      const coutAttendu = 200000 + result.totalInterets + totalAssurance;
      expect(result.coutTotal).toBeCloseTo(coutAttendu, 0);
    });

    it("calcule le total de l'assurance sur la duree du pret", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
        tauxAssurance: 0.0034,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      // Assurance totale = (capital * tauxAssurance) * dureeAnnees
      const assuranceTotaleAttendue = 200000 * 0.0034 * 20;
      expect(result.totalAssurance).toBeCloseTo(assuranceTotaleAttendue, 0);
    });
  });

  describe("Tableau d'amortissement", () => {
    it("genere un tableau avec le bon nombre de lignes", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0.03,
        dureeMois: 120,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      expect(result.tableau).toHaveLength(120);
    });

    it("la somme des capitaux rembourses egale le montant emprunte", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      const sommeCapitaux = result.tableau.reduce(
        (sum, ligne) => sum + ligne.capital,
        0
      );
      expect(sommeCapitaux).toBeCloseTo(200000, 0);
    });

    it("la somme des interets egale le total des interets", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 150000,
        tauxAnnuel: 0.04,
        dureeMois: 180,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      const sommeInterets = result.tableau.reduce(
        (sum, ligne) => sum + ligne.interets,
        0
      );
      expect(sommeInterets).toBeCloseTo(result.totalInterets, 0);
    });

    it("le capital restant diminue a chaque mois", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0.03,
        dureeMois: 60,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      for (let i = 1; i < result.tableau.length; i++) {
        const lignePrecedente = result.tableau[i - 1];
        const ligneCourante = result.tableau[i];
        if (lignePrecedente && ligneCourante) {
          expect(ligneCourante.capitalRestant).toBeLessThan(
            lignePrecedente.capitalRestant
          );
        }
      }
    });

    it("le capital restant est nul a la derniere echeance", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      const derniereLigne = result.tableau[result.tableau.length - 1];
      expect(derniereLigne?.capitalRestant).toBeCloseTo(0, 0);
    });

    it("la mensualite est constante (hors assurance)", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0.04,
        dureeMois: 120,
      };

      // Act
      const result = calculerCredit(input);

      // Assert - Toutes les mensualites doivent etre egales (a 0.01 pres pour les arrondis)
      const premiereLigne = result.tableau[0];
      if (!premiereLigne) {
        throw new Error("Tableau vide");
      }
      const premiereMensualite = premiereLigne.mensualite;
      for (const ligne of result.tableau) {
        expect(ligne.mensualite).toBeCloseTo(premiereMensualite, 2);
      }
    });

    it("chaque ligne contient mensualite = capital + interets", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0.03,
        dureeMois: 60,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      for (const ligne of result.tableau) {
        expect(ligne.mensualite).toBeCloseTo(
          ligne.capital + ligne.interets,
          2
        );
      }
    });

    it("inclut l'assurance dans chaque ligne du tableau si fournie", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
        tauxAssurance: 0.0034,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      const assuranceMensuelleAttendue = (200000 * 0.0034) / 12;
      for (const ligne of result.tableau) {
        expect(ligne.assurance).toBeDefined();
        expect(ligne.assurance).toBeCloseTo(assuranceMensuelleAttendue, 2);
      }
    });

    it("les interets diminuent au fil du temps", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0.04,
        dureeMois: 120,
      };

      // Act
      const result = calculerCredit(input);

      // Assert - Les interets du premier mois > interets du dernier mois
      const premierMois = result.tableau[0];
      const dernierMois = result.tableau[result.tableau.length - 1];
      if (premierMois && dernierMois) {
        expect(premierMois.interets).toBeGreaterThan(dernierMois.interets);
      }
    });

    it("le capital rembourse augmente au fil du temps", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0.04,
        dureeMois: 120,
      };

      // Act
      const result = calculerCredit(input);

      // Assert - Le capital du premier mois < capital du dernier mois
      const premierMois = result.tableau[0];
      const dernierMois = result.tableau[result.tableau.length - 1];
      if (premierMois && dernierMois) {
        expect(premierMois.capital).toBeLessThan(dernierMois.capital);
      }
    });
  });

  describe("TAEG estime", () => {
    it("calcule un TAEG superieur ou egal au taux nominal quand assurance", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
        tauxAssurance: 0.0034,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      expect(result.taegEstime).toBeDefined();
      expect(result.taegEstime).toBeGreaterThan(0.035);
    });

    it("le TAEG est proche du taux nominal sans assurance", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 200000,
        tauxAnnuel: 0.035,
        dureeMois: 240,
      };

      // Act
      const result = calculerCredit(input);

      // Assert - TAEG approximation peut avoir une marge d'erreur
      // Le TAEG estime devrait etre proche du taux nominal (a 0.5% pres)
      expect(result.taegEstime).toBeCloseTo(0.035, 2);
    });
  });

  describe("Cas limites", () => {
    it("gere un capital de 1 EUR", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 1,
        tauxAnnuel: 0.03,
        dureeMois: 12,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      expect(result.mensualiteHorsAssurance).toBeGreaterThan(0);
      expect(result.coutTotal).toBeGreaterThan(1);
    });

    it("gere un taux de 0% (pret a taux zero)", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0,
        dureeMois: 120,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      // Mensualite = capital / duree
      expect(result.mensualiteHorsAssurance).toBeCloseTo(100000 / 120, 2);
      expect(result.totalInterets).toBe(0);
    });

    it("gere une duree de 1 mois", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 10000,
        tauxAnnuel: 0.05,
        dureeMois: 1,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      expect(result.tableau).toHaveLength(1);
      expect(result.mensualiteHorsAssurance).toBeGreaterThan(10000);
    });

    it("gere un taux eleve (10%)", () => {
      // Arrange
      const input: CreditInput = {
        capitalEmprunte: 100000,
        tauxAnnuel: 0.1,
        dureeMois: 120,
      };

      // Act
      const result = calculerCredit(input);

      // Assert
      expect(result.mensualiteHorsAssurance).toBeGreaterThan(1000);
      expect(result.totalInterets).toBeGreaterThan(50000);
    });
  });
});

// ============================================
// TESTS: calculerCapaciteEmprunt
// ============================================

describe("calculerCapaciteEmprunt", () => {
  describe("Calcul de la capacite", () => {
    it("calcule la capacite pour revenus 4000 EUR, charges 500 EUR", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 500;
      const tauxAnnuel = 0.035;
      const dureeMois = 240;

      // Act
      const result = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        tauxAnnuel,
        dureeMois
      );

      // Assert
      // Mensualite max = (4000 - 500) * 0.35 = 1225 EUR
      expect(result.mensualiteMax).toBeCloseTo(1225, 0);
      // Capacite = inverser la formule de mensualite
      expect(result.capaciteEmprunt).toBeGreaterThan(200000);
      expect(result.capaciteEmprunt).toBeLessThan(220000);
    });

    it("calcule la capacite pour revenus 3000 EUR sans charges", () => {
      // Arrange
      const revenuMensuel = 3000;
      const chargesActuelles = 0;
      const tauxAnnuel = 0.04;
      const dureeMois = 300;

      // Act
      const result = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        tauxAnnuel,
        dureeMois
      );

      // Assert
      // Mensualite max = 3000 * 0.35 = 1050 EUR
      expect(result.mensualiteMax).toBeCloseTo(1050, 0);
      expect(result.capaciteEmprunt).toBeGreaterThan(150000);
    });

    it("retourne une capacite plus faible avec des charges elevees", () => {
      // Arrange
      const revenuMensuel = 5000;
      const tauxAnnuel = 0.035;
      const dureeMois = 240;

      // Act
      const resultSansCharges = calculerCapaciteEmprunt(
        revenuMensuel,
        0,
        tauxAnnuel,
        dureeMois
      );
      const resultAvecCharges = calculerCapaciteEmprunt(
        revenuMensuel,
        1000,
        tauxAnnuel,
        dureeMois
      );

      // Assert
      expect(resultAvecCharges.capaciteEmprunt).toBeLessThan(
        resultSansCharges.capaciteEmprunt
      );
    });

    it("retourne une capacite plus elevee avec une duree plus longue", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 500;
      const tauxAnnuel = 0.035;

      // Act
      const result15ans = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        tauxAnnuel,
        180
      );
      const result25ans = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        tauxAnnuel,
        300
      );

      // Assert
      expect(result25ans.capaciteEmprunt).toBeGreaterThan(
        result15ans.capaciteEmprunt
      );
    });

    it("retourne une capacite plus elevee avec un taux plus bas", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 500;
      const dureeMois = 240;

      // Act
      const resultTauxBas = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        0.025,
        dureeMois
      );
      const resultTauxHaut = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        0.045,
        dureeMois
      );

      // Assert
      expect(resultTauxBas.capaciteEmprunt).toBeGreaterThan(
        resultTauxHaut.capaciteEmprunt
      );
    });
  });

  describe("Cas limites", () => {
    it("retourne capacite 0 si charges >= revenus", () => {
      // Arrange - charges >= revenus => revenu disponible <= 0
      const revenuMensuel = 4000;
      const chargesActuelles = 4000;
      const tauxAnnuel = 0.035;
      const dureeMois = 240;

      // Act
      const result = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        tauxAnnuel,
        dureeMois
      );

      // Assert
      expect(result.capaciteEmprunt).toBe(0);
      expect(result.mensualiteMax).toBeLessThanOrEqual(0);
    });

    it("gere un taux a 0%", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 500;
      const tauxAnnuel = 0;
      const dureeMois = 240;

      // Act
      const result = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        tauxAnnuel,
        dureeMois
      );

      // Assert
      // Capacite = mensualiteMax * dureeMois (pas d'interets)
      expect(result.capaciteEmprunt).toBeCloseTo(1225 * 240, 0);
    });

    it("retourne un message si capacite nulle", () => {
      // Arrange
      const revenuMensuel = 2000;
      const chargesActuelles = 2000;
      const tauxAnnuel = 0.035;
      const dureeMois = 240;

      // Act
      const result = calculerCapaciteEmprunt(
        revenuMensuel,
        chargesActuelles,
        tauxAnnuel,
        dureeMois
      );

      // Assert
      expect(result.capaciteEmprunt).toBe(0);
      expect(result.message).toBeDefined();
    });
  });
});

// ============================================
// TESTS: calculerTauxEndettement
// ============================================

describe("calculerTauxEndettement", () => {
  describe("Calcul du taux", () => {
    it("calcule le taux pour 4000 EUR revenus et 900 EUR nouvelles charges", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 0;
      const nouvelleMensualite = 900;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      // Taux = 900 / 4000 = 0.225 = 22.5%
      expect(result.tauxEndettement).toBeCloseTo(0.225, 3);
    });

    it("calcule le taux en incluant les charges existantes", () => {
      // Arrange
      const revenuMensuel = 5000;
      const chargesActuelles = 500;
      const nouvelleMensualite = 1000;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      // Taux = (500 + 1000) / 5000 = 0.30 = 30%
      expect(result.tauxEndettement).toBeCloseTo(0.3, 3);
    });

    it("retourne les revenus et charges dans le resultat", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 200;
      const nouvelleMensualite = 800;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.revenus).toBe(4000);
      expect(result.chargesApres).toBe(1000);
    });
  });

  describe("Seuils acceptable et recommande", () => {
    it("marque comme acceptable et recommande si taux < 33%", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 0;
      const nouvelleMensualite = 1000; // 25%

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.tauxEndettement).toBeLessThan(0.33);
      expect(result.acceptable).toBe(true);
      expect(result.recommande).toBe(true);
    });

    it("marque comme acceptable mais pas recommande si 33% <= taux < 35%", () => {
      // Arrange
      const revenuMensuel = 3000;
      const chargesActuelles = 0;
      const nouvelleMensualite = 1020; // 34%

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.tauxEndettement).toBeGreaterThanOrEqual(0.33);
      expect(result.tauxEndettement).toBeLessThan(0.35);
      expect(result.acceptable).toBe(true);
      expect(result.recommande).toBe(false);
    });

    it("marque comme non acceptable si taux >= 35%", () => {
      // Arrange
      const revenuMensuel = 3000;
      const chargesActuelles = 0;
      const nouvelleMensualite = 1100; // 36.67%

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.tauxEndettement).toBeGreaterThanOrEqual(0.35);
      expect(result.acceptable).toBe(false);
      expect(result.recommande).toBe(false);
    });

    it("taux exactement a 33% est acceptable mais pas recommande", () => {
      // Arrange
      const revenuMensuel = 3000;
      const chargesActuelles = 0;
      const nouvelleMensualite = 990; // 33%

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.tauxEndettement).toBeCloseTo(0.33, 2);
      expect(result.acceptable).toBe(true);
      expect(result.recommande).toBe(false);
    });

    it("taux exactement a 35% est non acceptable", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 0;
      const nouvelleMensualite = 1400; // 35%

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.tauxEndettement).toBeCloseTo(0.35, 2);
      expect(result.acceptable).toBe(false);
    });
  });

  describe("Reste a vivre", () => {
    it("calcule le reste a vivre correctement", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 200;
      const nouvelleMensualite = 800;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      // Reste a vivre = revenus - charges totales = 4000 - 1000 = 3000
      expect(result.resteAVivre).toBe(3000);
    });

    it("retourne reste a vivre positif meme avec taux eleve", () => {
      // Arrange
      const revenuMensuel = 3000;
      const chargesActuelles = 500;
      const nouvelleMensualite = 1200;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.resteAVivre).toBe(1300);
      expect(result.resteAVivre).toBeGreaterThan(0);
    });

    it("retourne reste a vivre nul si charges = revenus", () => {
      // Arrange
      const revenuMensuel = 3000;
      const chargesActuelles = 2000;
      const nouvelleMensualite = 1000;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.resteAVivre).toBe(0);
    });

    it("retourne reste a vivre negatif si charges > revenus", () => {
      // Arrange
      const revenuMensuel = 3000;
      const chargesActuelles = 2000;
      const nouvelleMensualite = 1500;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      expect(result.resteAVivre).toBe(-500);
      expect(result.resteAVivre).toBeLessThan(0);
    });
  });

  describe("Cas limites", () => {
    it("gere des revenus nuls (retourne taux infini ou erreur)", () => {
      // Arrange
      const revenuMensuel = 0;
      const chargesActuelles = 0;
      const nouvelleMensualite = 1000;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert - Taux devrait etre Infinity ou une valeur speciale
      expect(result.tauxEndettement).toBe(Infinity);
      expect(result.acceptable).toBe(false);
    });

    it("gere une mensualite nulle", () => {
      // Arrange
      const revenuMensuel = 4000;
      const chargesActuelles = 500;
      const nouvelleMensualite = 0;

      // Act
      const result = calculerTauxEndettement(
        revenuMensuel,
        chargesActuelles,
        nouvelleMensualite
      );

      // Assert
      // Taux = 500 / 4000 = 12.5%
      expect(result.tauxEndettement).toBeCloseTo(0.125, 3);
      expect(result.acceptable).toBe(true);
      expect(result.recommande).toBe(true);
    });
  });
});
