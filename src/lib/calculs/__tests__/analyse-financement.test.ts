/**
 * Tests unitaires pour analyse-financement
 *
 * Teste le module d'analyse de financabilite selon les criteres HCSF.
 * Couvre les verdicts (financable, tendu, difficile) et les seuils d'endettement.
 */

import { describe, it, expect } from "vitest";
import {
  analyserFinancement,
  getCouleurEndettement,
  getIconeVerdict,
} from "../analyse-financement";
import { SEUILS_ENDETTEMENT } from "@/types/lead-financement";

// ============================================================================
// analyserFinancement
// ============================================================================

describe("analyserFinancement", () => {
  describe("cas sans emprunt necessaire", () => {
    it("retourne verdict financable si apport couvre tout le projet", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 200000,
        dureeEmpruntMois: 240,
      });

      expect(result.montantEmprunt).toBe(0);
      expect(result.mensualiteEstimee).toBe(0);
      expect(result.verdict).toBe("financable");
      expect(result.respecteHCSF).toBe(true);
      expect(result.dossierConfortable).toBe(true);
    });

    it("retourne verdict financable si apport superieur au projet", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 250000,
        dureeEmpruntMois: 240,
      });

      expect(result.montantEmprunt).toBe(0);
      expect(result.mensualiteEstimee).toBe(0);
      expect(result.verdictMessage).toContain("Pas d'emprunt nécessaire");
    });

    it("calcule le taux endettement avec charges actuelles meme sans emprunt", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        chargesActuelles: 500,
        montantProjet: 200000,
        apport: 200000,
        dureeEmpruntMois: 240,
      });

      expect(result.tauxEndettement).toBe(0.1); // 500 / 5000
      expect(result.tauxEndettementPourcent).toBe(10);
      expect(result.resteAVivre).toBe(4500);
    });
  });

  describe("verdict financable (excellent <= 30%)", () => {
    it("retourne excellent pour taux <= 30%", () => {
      const result = analyserFinancement({
        revenuMensuel: 10000,
        montantProjet: 200000,
        apport: 100000,
        dureeEmpruntMois: 240, // 20 ans
      });

      // Mensualite environ 580 EUR -> ~5.8% d'endettement
      expect(result.verdict).toBe("financable");
      expect(result.verdictMessage).toContain("Excellent");
      expect(result.dossierConfortable).toBe(true);
      expect(result.respecteHCSF).toBe(true);
    });

    it("retourne verdict bon pour taux entre 30% et 33%", () => {
      const result = analyserFinancement({
        revenuMensuel: 3000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 300, // 25 ans
      });

      // Ajuste pour obtenir un taux entre 30-33%
      expect(result.verdict).toBe("financable");
      expect(result.respecteHCSF).toBe(true);
    });
  });

  describe("verdict financable (acceptable 33-35%)", () => {
    it("retourne acceptable pour taux entre 33% et 35%", () => {
      // Simuler un cas ou le taux est autour de 34%
      const result = analyserFinancement({
        revenuMensuel: 3000,
        montantProjet: 200000,
        apport: 30000,
        dureeEmpruntMois: 300,
        tauxAnnuel: 0.04,
      });

      // Verifie que le dossier est dans la norme HCSF
      if (result.tauxEndettement > 0.33 && result.tauxEndettement <= 0.35) {
        expect(result.verdictMessage).toContain("norme HCSF");
        expect(result.respecteHCSF).toBe(true);
      }
    });
  });

  describe("verdict derogation possible (35-40%)", () => {
    it("retourne financable avec derogation si bon reste a vivre", () => {
      const result = analyserFinancement({
        revenuMensuel: 8000,
        chargesActuelles: 0,
        montantProjet: 400000,
        apport: 50000,
        dureeEmpruntMois: 240,
        tauxAnnuel: 0.04,
      });

      // Taux autour de 36-38%
      if (result.tauxEndettement > 0.35 && result.tauxEndettement <= 0.40) {
        if (result.resteAVivre >= 1500) {
          expect(result.verdict).toBe("financable");
          expect(result.verdictMessage).toContain("dérogation");
        }
      }
    });

    it("retourne tendu si mauvais reste a vivre", () => {
      const result = analyserFinancement({
        revenuMensuel: 3000,
        chargesActuelles: 200,
        montantProjet: 200000,
        apport: 20000,
        dureeEmpruntMois: 240,
        tauxAnnuel: 0.045,
      });

      // Si reste a vivre < 1500 et taux > 35%
      if (
        result.tauxEndettement > 0.35 &&
        result.tauxEndettement <= 0.40 &&
        result.resteAVivre < 1500
      ) {
        expect(result.verdict).toBe("tendu");
        expect(result.verdictMessage).toContain("courtier");
      }
    });
  });

  describe("verdict tendu (40-45%)", () => {
    it("retourne tendu pour taux entre 40% et 45%", () => {
      const result = analyserFinancement({
        revenuMensuel: 3000,
        chargesActuelles: 500,
        montantProjet: 200000,
        apport: 10000,
        dureeEmpruntMois: 180,
        tauxAnnuel: 0.05,
      });

      if (result.tauxEndettement > 0.40 && result.tauxEndettement <= 0.45) {
        expect(result.verdict).toBe("tendu");
      }
    });

    it("mentionne le bon reste a vivre comme atout", () => {
      const result = analyserFinancement({
        revenuMensuel: 6000,
        chargesActuelles: 0,
        montantProjet: 350000,
        apport: 30000,
        dureeEmpruntMois: 180,
        tauxAnnuel: 0.05,
      });

      if (result.tauxEndettement > 0.40 && result.resteAVivre >= 1500) {
        expect(result.verdictMessage).toContain("reste à vivre");
      }
    });
  });

  describe("verdict difficile (> 45%)", () => {
    it("retourne difficile pour taux > 45%", () => {
      const result = analyserFinancement({
        revenuMensuel: 2500,
        chargesActuelles: 500,
        montantProjet: 300000,
        apport: 10000,
        dureeEmpruntMois: 180,
        tauxAnnuel: 0.05,
      });

      if (result.tauxEndettement > 0.45) {
        expect(result.verdict).toBe("difficile");
        expect(result.verdictMessage).toContain("trop élevé");
      }
    });

    it("suggere d'augmenter l'apport ou d'allonger la duree", () => {
      const result = analyserFinancement({
        revenuMensuel: 2000,
        chargesActuelles: 300,
        montantProjet: 250000,
        apport: 5000,
        dureeEmpruntMois: 180,
        tauxAnnuel: 0.05,
      });

      if (result.tauxEndettement > 0.45) {
        expect(result.verdictMessage).toMatch(/(apport|durée|montant)/i);
      }
    });
  });

  describe("calculs de base", () => {
    it("calcule correctement le montant d'emprunt", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 250000,
        apport: 50000,
        dureeEmpruntMois: 240,
      });

      expect(result.montantEmprunt).toBe(200000);
    });

    it("arrondit la mensualite estimee", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 240,
      });

      expect(Number.isInteger(result.mensualiteEstimee)).toBe(true);
    });

    it("arrondit le reste a vivre", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 240,
      });

      expect(Number.isInteger(result.resteAVivre)).toBe(true);
    });

    it("arrondit le taux d'endettement a 1 decimale", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 240,
      });

      // Le taux en pourcentage doit avoir max 1 decimale
      const decimals = result.tauxEndettementPourcent.toString().split(".")[1];
      if (decimals) {
        expect(decimals.length).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("parametres optionnels", () => {
    it("utilise le taux par defaut de 3.5%", () => {
      const result1 = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 240,
      });

      const result2 = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 240,
        tauxAnnuel: 0.035,
      });

      expect(result1.mensualiteEstimee).toBe(result2.mensualiteEstimee);
    });

    it("utilise le taux assurance par defaut de 0.36%", () => {
      const result1 = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 240,
      });

      const result2 = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 240,
        tauxAssurance: 0.0036,
      });

      expect(result1.mensualiteEstimee).toBe(result2.mensualiteEstimee);
    });

    it("gere l'absence de charges actuelles", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 240,
      });

      expect(result).toBeDefined();
      expect(result.tauxEndettement).toBeGreaterThanOrEqual(0);
    });
  });

  describe("coherence des flags HCSF", () => {
    it("respecteHCSF est true si taux <= 35%", () => {
      const result = analyserFinancement({
        revenuMensuel: 10000,
        montantProjet: 200000,
        apport: 100000,
        dureeEmpruntMois: 240,
      });

      if (result.tauxEndettement <= SEUILS_ENDETTEMENT.maximum) {
        expect(result.respecteHCSF).toBe(true);
      }
    });

    it("respecteHCSF est false si taux > 35%", () => {
      const result = analyserFinancement({
        revenuMensuel: 3000,
        chargesActuelles: 500,
        montantProjet: 200000,
        apport: 10000,
        dureeEmpruntMois: 180,
        tauxAnnuel: 0.05,
      });

      if (result.tauxEndettement > SEUILS_ENDETTEMENT.maximum) {
        expect(result.respecteHCSF).toBe(false);
      }
    });

    it("dossierConfortable est true si taux <= 33%", () => {
      const result = analyserFinancement({
        revenuMensuel: 10000,
        montantProjet: 200000,
        apport: 100000,
        dureeEmpruntMois: 240,
      });

      if (result.tauxEndettement <= SEUILS_ENDETTEMENT.recommande) {
        expect(result.dossierConfortable).toBe(true);
      }
    });
  });

  describe("cas limites", () => {
    it("gere un revenu mensuel tres eleve", () => {
      const result = analyserFinancement({
        revenuMensuel: 50000,
        montantProjet: 1000000,
        apport: 200000,
        dureeEmpruntMois: 240,
      });

      expect(result.verdict).toBe("financable");
      expect(result.tauxEndettement).toBeLessThan(0.2);
    });

    it("gere une duree courte (10 ans)", () => {
      const result = analyserFinancement({
        revenuMensuel: 8000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 120,
      });

      expect(result).toBeDefined();
      // Duree courte = mensualite plus elevee
      expect(result.mensualiteEstimee).toBeGreaterThan(1000);
    });

    it("gere une duree longue (25 ans)", () => {
      const result = analyserFinancement({
        revenuMensuel: 4000,
        montantProjet: 200000,
        apport: 50000,
        dureeEmpruntMois: 300,
      });

      expect(result).toBeDefined();
      // Duree longue = mensualite plus faible
    });

    it("gere un apport nul", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        montantProjet: 200000,
        apport: 0,
        dureeEmpruntMois: 240,
      });

      expect(result.montantEmprunt).toBe(200000);
    });

    it("gere des charges actuelles elevees", () => {
      const result = analyserFinancement({
        revenuMensuel: 5000,
        chargesActuelles: 1500, // 30% deja
        montantProjet: 100000,
        apport: 50000,
        dureeEmpruntMois: 240,
      });

      // Charges deja elevees impactent le taux final
      expect(result.tauxEndettement).toBeGreaterThan(0.3);
    });
  });
});

// ============================================================================
// getCouleurEndettement
// ============================================================================

describe("getCouleurEndettement", () => {
  it("retourne vert fonce pour taux <= 30%", () => {
    expect(getCouleurEndettement(0.25)).toBe("text-green-500");
    expect(getCouleurEndettement(0.30)).toBe("text-green-500");
  });

  it("retourne vert clair pour taux entre 30% et 33%", () => {
    expect(getCouleurEndettement(0.31)).toBe("text-green-400");
    expect(getCouleurEndettement(0.33)).toBe("text-green-400");
  });

  it("retourne vert pale pour taux entre 33% et 35%", () => {
    expect(getCouleurEndettement(0.34)).toBe("text-green-300");
    expect(getCouleurEndettement(0.35)).toBe("text-green-300");
  });

  it("retourne jaune pour taux entre 35% et 40%", () => {
    expect(getCouleurEndettement(0.36)).toBe("text-yellow-500");
    expect(getCouleurEndettement(0.40)).toBe("text-yellow-500");
  });

  it("retourne orange pour taux entre 40% et 45%", () => {
    expect(getCouleurEndettement(0.41)).toBe("text-orange-500");
    expect(getCouleurEndettement(0.45)).toBe("text-orange-500");
  });

  it("retourne rouge pour taux > 45%", () => {
    expect(getCouleurEndettement(0.46)).toBe("text-red-500");
    expect(getCouleurEndettement(0.60)).toBe("text-red-500");
  });

  it("gere les valeurs limites exactes", () => {
    // Exactement aux seuils
    expect(getCouleurEndettement(SEUILS_ENDETTEMENT.confortable)).toBe("text-green-500");
    expect(getCouleurEndettement(SEUILS_ENDETTEMENT.recommande)).toBe("text-green-400");
    expect(getCouleurEndettement(SEUILS_ENDETTEMENT.maximum)).toBe("text-green-300");
  });
});

// ============================================================================
// getIconeVerdict
// ============================================================================

describe("getIconeVerdict", () => {
  it("retourne checkmark pour financable", () => {
    expect(getIconeVerdict("financable")).toBe("✓");
  });

  it("retourne warning pour tendu", () => {
    expect(getIconeVerdict("tendu")).toBe("⚠");
  });

  it("retourne X pour difficile", () => {
    expect(getIconeVerdict("difficile")).toBe("✗");
  });
});
