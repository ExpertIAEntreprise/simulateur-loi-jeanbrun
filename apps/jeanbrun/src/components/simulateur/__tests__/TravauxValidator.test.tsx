/**
 * Tests unitaires pour TravauxValidator
 *
 * Teste le composant de validation du seuil de 30% travaux requis par la Loi Jeanbrun.
 * Affiche une jauge de progression et les messages d'eligibilite.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TravauxValidator } from "../etape-2/TravauxValidator";

// ============================================================================
// Tests
// ============================================================================

describe("TravauxValidator", () => {
  describe("affichage de base", () => {
    it("affiche le titre 'Validation travaux'", () => {
      render(<TravauxValidator montantTravaux={30000} prixAcquisition={100000} />);

      expect(screen.getByText("Validation travaux")).toBeInTheDocument();
    });

    it("affiche le montant des travaux formate", () => {
      render(<TravauxValidator montantTravaux={35000} prixAcquisition={100000} />);

      // 35000 formate en EUR
      expect(screen.getByText(/35\s*000/)).toBeInTheDocument();
    });

    it("affiche le minimum requis (30% du prix)", () => {
      render(<TravauxValidator montantTravaux={25000} prixAcquisition={100000} />);

      // Minimum requis = 100000 * 0.3 = 30000 EUR
      expect(screen.getByText("Minimum requis (30%)")).toBeInTheDocument();
      expect(screen.getByText(/30\s*000/)).toBeInTheDocument();
    });
  });

  describe("cas prix acquisition <= 0", () => {
    it("affiche un message d'erreur si prix acquisition est 0", () => {
      render(<TravauxValidator montantTravaux={30000} prixAcquisition={0} />);

      expect(
        screen.getByText(/Veuillez d'abord saisir le prix d'acquisition/i)
      ).toBeInTheDocument();
    });

    it("affiche un message d'erreur si prix acquisition est negatif", () => {
      render(<TravauxValidator montantTravaux={30000} prixAcquisition={-50000} />);

      expect(
        screen.getByText(/Veuillez d'abord saisir le prix d'acquisition/i)
      ).toBeInTheDocument();
    });

    it("n'affiche pas la jauge si prix acquisition <= 0", () => {
      render(<TravauxValidator montantTravaux={30000} prixAcquisition={0} />);

      expect(screen.queryByText("Validation travaux")).not.toBeInTheDocument();
      expect(screen.queryByText(/30% min/)).not.toBeInTheDocument();
    });
  });

  describe("calcul du pourcentage", () => {
    it("calcule 30% pour 30000 sur 100000", () => {
      render(<TravauxValidator montantTravaux={30000} prixAcquisition={100000} />);

      expect(screen.getByText("30.0%")).toBeInTheDocument();
    });

    it("calcule 50% pour 50000 sur 100000", () => {
      render(<TravauxValidator montantTravaux={50000} prixAcquisition={100000} />);

      expect(screen.getByText("50.0%")).toBeInTheDocument();
    });

    it("calcule 15% pour 15000 sur 100000", () => {
      render(<TravauxValidator montantTravaux={15000} prixAcquisition={100000} />);

      expect(screen.getByText("15.0%")).toBeInTheDocument();
    });

    it("gere les decimales correctement", () => {
      // 33333 / 100000 = 33.333%
      render(<TravauxValidator montantTravaux={33333} prixAcquisition={100000} />);

      expect(screen.getByText("33.3%")).toBeInTheDocument();
    });
  });

  describe("eligibilite Jeanbrun (seuil 30%)", () => {
    describe("non eligible (< 30%)", () => {
      it("affiche 'Non eligible' si pourcentage < 30%", () => {
        render(<TravauxValidator montantTravaux={20000} prixAcquisition={100000} />);

        expect(screen.getByText("Non eligible")).toBeInTheDocument();
      });

      it("affiche l'icone d'alerte si non eligible", () => {
        render(<TravauxValidator montantTravaux={20000} prixAcquisition={100000} />);

        // AlertTriangle icon est utilise
        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
      });

      it("affiche le montant manquant", () => {
        // 20000 / 100000 = 20% -> il manque 10000 pour atteindre 30%
        render(<TravauxValidator montantTravaux={20000} prixAcquisition={100000} />);

        expect(screen.getByText(/Il manque/)).toBeInTheDocument();
        expect(screen.getByText(/10\s*000/)).toBeInTheDocument();
      });

      it("affiche 'Non eligible Jeanbrun' dans l'alerte", () => {
        render(<TravauxValidator montantTravaux={20000} prixAcquisition={100000} />);

        expect(screen.getByText("Non eligible Jeanbrun")).toBeInTheDocument();
      });
    });

    describe("eligible (>= 30%)", () => {
      it("affiche 'Eligible' avec checkmark si pourcentage >= 30%", () => {
        render(<TravauxValidator montantTravaux={30000} prixAcquisition={100000} />);

        // Rechercher le badge Eligible avec le checkmark
        const eligibleBadge = screen.getByText(/Eligible/);
        expect(eligibleBadge).toBeInTheDocument();
      });

      it("affiche l'icone de succes si eligible", () => {
        render(<TravauxValidator montantTravaux={35000} prixAcquisition={100000} />);

        // CheckCircle2 icon -> role="status"
        const status = screen.getByRole("status");
        expect(status).toBeInTheDocument();
      });

      it("n'affiche pas le montant manquant si eligible", () => {
        render(<TravauxValidator montantTravaux={35000} prixAcquisition={100000} />);

        expect(screen.queryByText(/Il manque/)).not.toBeInTheDocument();
      });
    });
  });

  describe("niveaux de statut", () => {
    it("affiche 'Non eligible' pour < 30%", () => {
      render(<TravauxValidator montantTravaux={25000} prixAcquisition={100000} />);

      const badge = screen.getByText("Non eligible");
      expect(badge).toBeInTheDocument();
    });

    it("affiche 'Limite' pour 30-49%", () => {
      render(<TravauxValidator montantTravaux={35000} prixAcquisition={100000} />);

      // Le message indique "Budget travaux limite"
      expect(screen.getByText(/Budget travaux limite/)).toBeInTheDocument();
    });

    it("affiche 'Confortable' pour >= 50%", () => {
      render(<TravauxValidator montantTravaux={55000} prixAcquisition={100000} />);

      expect(screen.getByText(/Budget travaux confortable/)).toBeInTheDocument();
    });
  });

  describe("jauge de progression", () => {
    it("affiche les marqueurs de seuil 30% et 50%", () => {
      render(<TravauxValidator montantTravaux={40000} prixAcquisition={100000} />);

      expect(screen.getByText("30% min")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("affiche l'echelle 0% a 100%", () => {
      render(<TravauxValidator montantTravaux={40000} prixAcquisition={100000} />);

      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  describe("messages contextuels", () => {
    it("affiche un message explicatif pour budget limite", () => {
      render(<TravauxValidator montantTravaux={32000} prixAcquisition={100000} />);

      expect(
        screen.getByText(/atteint le minimum de 30% requis, mais sans marge/i)
      ).toBeInTheDocument();
    });

    it("affiche un message explicatif pour budget confortable", () => {
      render(<TravauxValidator montantTravaux={60000} prixAcquisition={100000} />);

      expect(
        screen.getByText(/depasse largement le seuil de 30% requis/i)
      ).toBeInTheDocument();
    });

    it("affiche un message explicatif pour non eligible", () => {
      render(<TravauxValidator montantTravaux={20000} prixAcquisition={100000} />);

      expect(
        screen.getByText(/pour atteindre les 30% requis/i)
      ).toBeInTheDocument();
    });
  });

  describe("calcul montant manquant", () => {
    it("calcule correctement le manquant a 0 travaux", () => {
      // 0 / 100000 = 0% -> il manque 30000
      render(<TravauxValidator montantTravaux={0} prixAcquisition={100000} />);

      // Le montant manquant = 30000 EUR
      const alertText = screen.getByRole("alert").textContent;
      expect(alertText).toContain("30");
    });

    it("calcule correctement le manquant pour divers montants", () => {
      // 25000 / 100000 = 25% -> il manque 5000 pour 30%
      render(<TravauxValidator montantTravaux={25000} prixAcquisition={100000} />);

      // Le montant manquant apparait dans le message d'alerte
      const alertElement = screen.getByRole("alert");
      expect(alertElement.textContent).toContain("5");
    });

    it("retourne 0 comme manquant si deja eligible", () => {
      render(<TravauxValidator montantTravaux={35000} prixAcquisition={100000} />);

      expect(screen.queryByText(/Il manque/)).not.toBeInTheDocument();
    });
  });

  describe("style et classes", () => {
    it("accepte une className personnalisee", () => {
      const { container } = render(
        <TravauxValidator
          montantTravaux={30000}
          prixAcquisition={100000}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("utilise une bordure en pointilles si eligible", () => {
      const { container } = render(
        <TravauxValidator montantTravaux={35000} prixAcquisition={100000} />
      );

      expect(container.firstChild).toHaveClass("border-dashed");
    });

    it("utilise une bordure normale si non eligible", () => {
      const { container } = render(
        <TravauxValidator montantTravaux={20000} prixAcquisition={100000} />
      );

      expect(container.firstChild).not.toHaveClass("border-dashed");
    });
  });

  describe("cas extremes", () => {
    it("gere 100% de travaux", () => {
      render(<TravauxValidator montantTravaux={100000} prixAcquisition={100000} />);

      expect(screen.getByText("100.0%")).toBeInTheDocument();
      expect(screen.getByText(/Budget travaux confortable/)).toBeInTheDocument();
    });

    it("gere plus de 100% de travaux", () => {
      render(<TravauxValidator montantTravaux={150000} prixAcquisition={100000} />);

      // Affiche 150%
      expect(screen.getByText("150.0%")).toBeInTheDocument();
    });

    it("gere des tres petits montants", () => {
      render(<TravauxValidator montantTravaux={100} prixAcquisition={100000} />);

      expect(screen.getByText("0.1%")).toBeInTheDocument();
    });
  });
});
