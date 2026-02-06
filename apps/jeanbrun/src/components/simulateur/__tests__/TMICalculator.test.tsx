/**
 * Tests unitaires pour TMICalculator
 *
 * Teste le composant de calcul et affichage de la Tranche Marginale d'Imposition.
 * Le composant calcule le TMI en temps reel basé sur le revenu net et le nombre de parts.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TMICalculator } from "../etape-1/TMICalculator";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Helper pour trouver le badge TMI qui affiche le pourcentage
 */
function getTMIBadge() {
  // Le badge contient le taux suivi de %
  return screen.getByText(/%$/);
}

// ============================================================================
// Tests
// ============================================================================

describe("TMICalculator", () => {
  describe("affichage de base", () => {
    it("affiche le titre 'Votre TMI'", () => {
      render(<TMICalculator revenuNet={50000} parts={1} />);

      expect(screen.getByText("Votre TMI")).toBeInTheDocument();
    });

    it("affiche le badge avec le taux TMI", () => {
      render(<TMICalculator revenuNet={50000} parts={1} />);

      const badge = getTMIBadge();
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toBe("30%");
    });

    it("affiche le quotient familial formate en francais", () => {
      render(<TMICalculator revenuNet={60000} parts={2} />);

      // 60000 / 2 = 30000
      expect(screen.getByText(/30\s*000/)).toBeInTheDocument();
      expect(screen.getByText(/euros\/part/)).toBeInTheDocument();
    });
  });

  describe("calcul TMI selon bareme IR 2026", () => {
    it("retourne 0% pour revenu sous 11294 EUR", () => {
      render(<TMICalculator revenuNet={10000} parts={1} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("0%");
      expect(screen.getByText("Non imposable")).toBeInTheDocument();
    });

    it("retourne 11% pour quotient entre 11294 et 28797 EUR", () => {
      render(<TMICalculator revenuNet={20000} parts={1} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("11%");
      expect(screen.getByText(/Tranche intermédiaire basse/i)).toBeInTheDocument();
    });

    it("retourne 30% pour quotient entre 28797 et 82341 EUR", () => {
      render(<TMICalculator revenuNet={50000} parts={1} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("30%");
      expect(screen.getByText(/Tranche intermédiaire haute/i)).toBeInTheDocument();
    });

    it("retourne 41% pour quotient entre 82341 et 177106 EUR", () => {
      render(<TMICalculator revenuNet={100000} parts={1} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("41%");
      expect(screen.getByText(/Tranche haute/i)).toBeInTheDocument();
    });

    it("retourne 45% pour quotient au-dessus de 177106 EUR", () => {
      render(<TMICalculator revenuNet={200000} parts={1} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("45%");
      expect(screen.getByText(/Tranche marginale maximale/i)).toBeInTheDocument();
    });
  });

  describe("calcul avec quotient familial", () => {
    it("divise le revenu par le nombre de parts", () => {
      // 60000 / 2 = 30000 -> TMI 30%
      render(<TMICalculator revenuNet={60000} parts={2} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("30%");
    });

    it("reduit la TMI pour un couple avec 60000 EUR (vs celibataire)", () => {
      // Celibataire: 60000 / 1 = 60000 -> TMI 30%
      // Couple: 60000 / 2 = 30000 -> TMI 30% (mais plus proche du seuil bas)
      const { rerender } = render(<TMICalculator revenuNet={60000} parts={1} />);
      expect(getTMIBadge().textContent).toBe("30%");

      // Couple avec 56000 EUR / 2 = 28000 -> TMI 11%
      rerender(<TMICalculator revenuNet={56000} parts={2} />);
      expect(getTMIBadge().textContent).toBe("11%");
    });
  });

  describe("cas limites", () => {
    it("retourne 0% pour un revenu de 0", () => {
      render(<TMICalculator revenuNet={0} parts={1} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("0%");
    });

    it("retourne 0% pour un revenu negatif", () => {
      render(<TMICalculator revenuNet={-5000} parts={1} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("0%");
    });

    it("retourne 0% si nombre de parts est 0 ou negatif", () => {
      render(<TMICalculator revenuNet={50000} parts={0} />);

      const badge = getTMIBadge();
      expect(badge.textContent).toBe("0%");
    });

    it("n'affiche pas le quotient si parts <= 0", () => {
      render(<TMICalculator revenuNet={50000} parts={0} />);

      expect(screen.queryByText(/euros\/part/)).not.toBeInTheDocument();
    });
  });

  describe("callback onTMIChange", () => {
    it("appelle onTMIChange avec le nouveau TMI quand il change", async () => {
      const onTMIChange = vi.fn();

      const { rerender } = render(
        <TMICalculator revenuNet={20000} parts={1} onTMIChange={onTMIChange} />
      );

      // Premier appel avec TMI 11%
      await waitFor(() => {
        expect(onTMIChange).toHaveBeenCalledWith(11);
      });

      // Changer le revenu pour passer en TMI 30%
      rerender(
        <TMICalculator revenuNet={50000} parts={1} onTMIChange={onTMIChange} />
      );

      await waitFor(() => {
        expect(onTMIChange).toHaveBeenCalledWith(30);
      });
    });

    it("n'appelle pas onTMIChange si undefined", () => {
      // Ne devrait pas planter
      expect(() => {
        render(<TMICalculator revenuNet={50000} parts={1} />);
      }).not.toThrow();
    });
  });

  describe("tooltip bareme IR", () => {
    it("affiche un bouton d'aide avec icone HelpCircle", () => {
      render(<TMICalculator revenuNet={50000} parts={1} />);

      const helpButton = screen.getByRole("button", {
        name: /informations sur le bareme/i,
      });
      expect(helpButton).toBeInTheDocument();
    });

    it("affiche le tooltip au survol du bouton d'aide", async () => {
      const user = userEvent.setup();
      render(<TMICalculator revenuNet={50000} parts={1} />);

      const helpButton = screen.getByRole("button", {
        name: /informations sur le bareme/i,
      });

      await user.hover(helpButton);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
        expect(screen.getByText(/Bareme IR 2026/i)).toBeInTheDocument();
      });
    });

    it("masque le tooltip quand on quitte le bouton", async () => {
      const user = userEvent.setup();
      render(<TMICalculator revenuNet={50000} parts={1} />);

      const helpButton = screen.getByRole("button", {
        name: /informations sur le bareme/i,
      });

      await user.hover(helpButton);
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      await user.unhover(helpButton);
      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });

  describe("accessibilite", () => {
    it("le bouton d'aide a un aria-label descriptif", () => {
      render(<TMICalculator revenuNet={50000} parts={1} />);

      const helpButton = screen.getByRole("button", {
        name: /informations sur le bareme/i,
      });
      expect(helpButton).toHaveAttribute("aria-label");
    });

    it("accepte une className personnalisee", () => {
      const { container } = render(
        <TMICalculator
          revenuNet={50000}
          parts={1}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });
});
