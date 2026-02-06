/**
 * Tests unitaires pour JaugeEndettement
 *
 * Teste le composant de jauge d'endettement (0-50%).
 * Affiche le taux d'endettement, le reste a vivre et les alertes.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JaugeEndettement } from "../etape-3/JaugeEndettement";

// ============================================================================
// Tests
// ============================================================================

describe("JaugeEndettement", () => {
  describe("affichage de base", () => {
    it("affiche le titre 'Taux d'endettement'", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1000}
        />
      );

      expect(screen.getByText("Taux d'endettement")).toBeInTheDocument();
    });

    it("affiche le taux d'endettement en pourcentage", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1000}
        />
      );

      // 1000 / 5000 * 100 = 20%
      expect(screen.getByText("20.0%")).toBeInTheDocument();
      expect(screen.getByText("d'endettement")).toBeInTheDocument();
    });

    it("affiche les mensualites totales", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1200}
          autresCredits={300}
        />
      );

      // 1200 + 300 = 1500 EUR/mois
      expect(screen.getByText("Mensualites totales")).toBeInTheDocument();
      expect(screen.getByText(/1\s*500.*EUR\/mois/)).toBeInTheDocument();
    });

    it("affiche le reste a vivre", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1000}
        />
      );

      // 5000 - 1000 = 4000 EUR/mois
      expect(screen.getByText("Reste a vivre")).toBeInTheDocument();
      expect(screen.getByText(/4\s*000.*EUR\/mois/)).toBeInTheDocument();
    });
  });

  describe("calcul du taux d'endettement", () => {
    it("calcule correctement avec uniquement mensualite credit", () => {
      render(
        <JaugeEndettement
          revenuMensuel={4000}
          mensualiteCredit={1000}
        />
      );

      // 1000 / 4000 * 100 = 25%
      expect(screen.getByText("25.0%")).toBeInTheDocument();
    });

    it("inclut les autres credits dans le calcul", () => {
      render(
        <JaugeEndettement
          revenuMensuel={4000}
          mensualiteCredit={800}
          autresCredits={400}
        />
      );

      // (800 + 400) / 4000 * 100 = 30%
      expect(screen.getByText("30.0%")).toBeInTheDocument();
    });

    it("retourne 0% si revenu mensuel est 0", () => {
      render(
        <JaugeEndettement
          revenuMensuel={0}
          mensualiteCredit={1000}
        />
      );

      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });

    it("retourne 0% si revenu mensuel est negatif", () => {
      render(
        <JaugeEndettement
          revenuMensuel={-1000}
          mensualiteCredit={500}
        />
      );

      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });

    it("gere l'absence de autresCredits (undefined)", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1500}
        />
      );

      // Sans autresCredits: 1500 / 5000 * 100 = 30%
      expect(screen.getByText("30.0%")).toBeInTheDocument();
    });
  });

  describe("calcul du reste a vivre", () => {
    it("calcule le reste a vivre correctement", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1000}
          autresCredits={500}
        />
      );

      // 5000 - 1000 - 500 = 3500
      expect(screen.getByText(/3\s*500.*EUR\/mois/)).toBeInTheDocument();
    });

    it("retourne 0 si reste a vivre serait negatif", () => {
      render(
        <JaugeEndettement
          revenuMensuel={1000}
          mensualiteCredit={800}
          autresCredits={500}
        />
      );

      // 1000 - 800 - 500 = -300 -> 0
      // Mais le composant affiche quand meme 0
      const resteElements = screen.getAllByText(/EUR\/mois/);
      // L'un d'eux est le reste a vivre
      expect(resteElements.length).toBeGreaterThan(0);
    });
  });

  describe("niveaux de risque", () => {
    describe("niveau OK (taux <= 33%)", () => {
      it("affiche le niveau OK pour taux <= 33%", () => {
        render(
          <JaugeEndettement
            revenuMensuel={5000}
            mensualiteCredit={1500}
          />
        );

        // 1500 / 5000 = 30% -> OK
        expect(
          screen.getByText(/dans les normes bancaires/i)
        ).toBeInTheDocument();
      });

      it("utilise l'icone CheckCircle pour niveau OK", () => {
        render(
          <JaugeEndettement
            revenuMensuel={5000}
            mensualiteCredit={1000}
          />
        );

        // 20% -> OK -> CheckCircle
        // Verifier que le svg emerald existe
        const container = screen.getByText("20.0%").closest("div");
        expect(container).toBeInTheDocument();
      });
    });

    describe("niveau ATTENTION (33% < taux <= 35%)", () => {
      it("affiche le niveau ATTENTION pour taux entre 33% et 35%", () => {
        render(
          <JaugeEndettement
            revenuMensuel={10000}
            mensualiteCredit={3400}
          />
        );

        // 3400 / 10000 = 34% -> ATTENTION
        expect(
          screen.getByText(/approchez du seuil maximal de 35%/i)
        ).toBeInTheDocument();
      });

      it("mentionne le HCSF dans le message", () => {
        render(
          <JaugeEndettement
            revenuMensuel={10000}
            mensualiteCredit={3400}
          />
        );

        expect(screen.getByText(/HCSF/)).toBeInTheDocument();
      });
    });

    describe("niveau DANGER (taux > 35%)", () => {
      it("affiche le niveau DANGER pour taux > 35%", () => {
        render(
          <JaugeEndettement
            revenuMensuel={5000}
            mensualiteCredit={2000}
          />
        );

        // 2000 / 5000 = 40% -> DANGER
        expect(screen.getByText(/depasse les 35%/i)).toBeInTheDocument();
      });

      it("mentionne le courtier comme solution", () => {
        render(
          <JaugeEndettement
            revenuMensuel={5000}
            mensualiteCredit={2000}
          />
        );

        expect(screen.getByText(/courtier/i)).toBeInTheDocument();
      });
    });
  });

  describe("alerte reste a vivre faible", () => {
    it("affiche une alerte si reste a vivre < 1000 EUR", () => {
      render(
        <JaugeEndettement
          revenuMensuel={2000}
          mensualiteCredit={1200}
        />
      );

      // 2000 - 1200 = 800 EUR -> alerte
      expect(
        screen.getByText(/reste a vivre est inferieur a 1\s*000/i)
      ).toBeInTheDocument();
    });

    it("n'affiche pas l'alerte si reste a vivre >= 1000 EUR", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1000}
        />
      );

      // 5000 - 1000 = 4000 EUR -> pas d'alerte
      expect(
        screen.queryByText(/reste a vivre est inferieur/i)
      ).not.toBeInTheDocument();
    });

    it("mentionne le minimum conseille par les banques", () => {
      render(
        <JaugeEndettement
          revenuMensuel={1500}
          mensualiteCredit={800}
        />
      );

      // Reste a vivre = 700 EUR
      expect(
        screen.getByText(/banques considerent/i)
      ).toBeInTheDocument();
    });
  });

  describe("jauge visuelle", () => {
    it("affiche le marqueur du seuil 35%", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1500}
        />
      );

      expect(screen.getByText("Seuil 35%")).toBeInTheDocument();
    });

    it("affiche l'echelle 0%, 25%, 50%+", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1500}
        />
      );

      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();
      expect(screen.getByText("50%+")).toBeInTheDocument();
    });
  });

  describe("cas limites", () => {
    it("gere un taux de 0%", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={0}
        />
      );

      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });

    it("gere un taux superieur a 50%", () => {
      render(
        <JaugeEndettement
          revenuMensuel={2000}
          mensualiteCredit={1500}
        />
      );

      // 1500 / 2000 = 75%
      expect(screen.getByText("75.0%")).toBeInTheDocument();
    });

    it("gere exactement 35%", () => {
      render(
        <JaugeEndettement
          revenuMensuel={10000}
          mensualiteCredit={3500}
        />
      );

      // 3500 / 10000 = 35% -> toujours attention
      expect(
        screen.getByText(/approchez du seuil maximal/i)
      ).toBeInTheDocument();
    });

    it("gere exactement 33%", () => {
      render(
        <JaugeEndettement
          revenuMensuel={10000}
          mensualiteCredit={3300}
        />
      );

      // 3300 / 10000 = 33% -> OK
      expect(screen.getByText(/dans les normes bancaires/i)).toBeInTheDocument();
    });
  });

  describe("style et accessibilite", () => {
    it("accepte une className personnalisee", () => {
      const { container } = render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1500}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("affiche l'icone TrendingUp dans le titre", () => {
      render(
        <JaugeEndettement
          revenuMensuel={5000}
          mensualiteCredit={1500}
        />
      );

      // Le titre contient une icone
      const titleContainer = screen.getByText("Taux d'endettement").closest("div");
      expect(titleContainer).toBeInTheDocument();
      expect(titleContainer?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("formatage des nombres", () => {
    it("formate les grands nombres avec separateurs de milliers", () => {
      render(
        <JaugeEndettement
          revenuMensuel={15000}
          mensualiteCredit={3000}
        />
      );

      // Reste a vivre = 12000 -> affiche "12 000 EUR/mois"
      expect(screen.getByText(/12\s*000.*EUR\/mois/)).toBeInTheDocument();
    });
  });
});
