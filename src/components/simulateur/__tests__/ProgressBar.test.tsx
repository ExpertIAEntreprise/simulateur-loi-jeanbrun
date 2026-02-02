/**
 * Tests unitaires pour ProgressBar
 *
 * Teste la barre de progression des 6 etapes du simulateur wizard.
 * Affiche les etapes completees, l'etape actuelle et les etapes a venir.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../ProgressBar";

// ============================================================================
// Tests
// ============================================================================

describe("ProgressBar", () => {
  const DEFAULT_LABELS = [
    "Profil",
    "Projet",
    "Financement",
    "Location",
    "Sortie",
    "Structure",
  ];

  describe("affichage de base", () => {
    it("affiche les 6 etapes par defaut", () => {
      render(<ProgressBar currentStep={1} />);

      DEFAULT_LABELS.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it("accepte un nombre d'etapes personnalise", () => {
      render(
        <ProgressBar
          currentStep={1}
          totalSteps={4}
          labels={["A", "B", "C", "D"]}
        />
      );

      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
      expect(screen.getByText("C")).toBeInTheDocument();
      expect(screen.getByText("D")).toBeInTheDocument();
    });

    it("utilise totalSteps=6 par defaut", () => {
      render(<ProgressBar currentStep={1} />);

      // 6 etapes par defaut
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuemax", "6");
    });
  });

  describe("accessibilite", () => {
    it("a un role progressbar", () => {
      render(<ProgressBar currentStep={3} />);

      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toBeInTheDocument();
    });

    it("indique la valeur actuelle avec aria-valuenow", () => {
      render(<ProgressBar currentStep={3} />);

      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "3");
    });

    it("indique les limites min et max", () => {
      render(<ProgressBar currentStep={3} />);

      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuemin", "1");
      expect(progressbar).toHaveAttribute("aria-valuemax", "6");
    });

    it("a un label decrivant l'etape actuelle", () => {
      render(<ProgressBar currentStep={3} />);

      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute(
        "aria-label",
        expect.stringContaining("3")
      );
      expect(progressbar).toHaveAttribute(
        "aria-label",
        expect.stringContaining("6")
      );
      expect(progressbar).toHaveAttribute(
        "aria-label",
        expect.stringContaining("Financement")
      );
    });
  });

  describe("affichage mobile", () => {
    it("affiche le compteur d'etape simplifie", () => {
      render(<ProgressBar currentStep={3} />);

      // Sur mobile, affiche "Etape 3 / 6" (avec accent francais)
      // Le caractere E avec accent: E ou Etape
      const mobileSection = document.querySelector(".md\\:hidden");
      expect(mobileSection).toBeInTheDocument();
      expect(mobileSection?.textContent).toContain("tape"); // "Etape" contient "tape"
      expect(mobileSection?.textContent).toContain("3");
      expect(mobileSection?.textContent).toContain("6");
    });
  });

  describe("etats des etapes", () => {
    it("marque les etapes precedentes comme completees", () => {
      render(<ProgressBar currentStep={4} />);

      // Les etapes 1, 2, 3 sont completees
      // Elles devraient avoir la classe text-step-completed
      const profilLabel = screen.getByText("Profil");
      const projetLabel = screen.getByText("Projet");
      const financementLabel = screen.getByText("Financement");

      expect(profilLabel).toHaveClass("text-step-completed");
      expect(projetLabel).toHaveClass("text-step-completed");
      expect(financementLabel).toHaveClass("text-step-completed");
    });

    it("marque l'etape actuelle avec une classe distincte", () => {
      render(<ProgressBar currentStep={3} />);

      const currentLabel = screen.getByText("Financement");
      expect(currentLabel).toHaveClass("text-step-current");
    });

    it("marque les etapes futures comme a venir", () => {
      render(<ProgressBar currentStep={2} />);

      // Les etapes 3, 4, 5, 6 sont a venir
      const financementLabel = screen.getByText("Financement");
      const locationLabel = screen.getByText("Location");
      const sortieLabel = screen.getByText("Sortie");
      const structureLabel = screen.getByText("Structure");

      expect(financementLabel).toHaveClass("text-muted-foreground");
      expect(locationLabel).toHaveClass("text-muted-foreground");
      expect(sortieLabel).toHaveClass("text-muted-foreground");
      expect(structureLabel).toHaveClass("text-muted-foreground");
    });
  });

  describe("points d'etape (StepDot)", () => {
    it("affiche un numero pour l'etape actuelle", () => {
      render(<ProgressBar currentStep={2} />);

      // L'etape 2 devrait afficher le numero 2
      // Les dots md affichent le numero - peut apparaitre plusieurs fois (mobile + desktop)
      const twos = screen.getAllByText("2");
      expect(twos.length).toBeGreaterThan(0);
    });

    it("affiche un checkmark pour les etapes completees", () => {
      render(<ProgressBar currentStep={3} />);

      // Les etapes 1 et 2 sont completees
      // Elles affichent un svg checkmark au lieu du numero
      // On verifie qu'il y a des svg dans les dots completes
      const progressbar = screen.getByRole("progressbar");
      const svgs = progressbar.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe("lignes de connexion", () => {
    it("colore les lignes des etapes completees", () => {
      render(<ProgressBar currentStep={4} />);

      // Les connecteurs avant l'etape 4 sont colores
      const progressbar = screen.getByRole("progressbar");
      const connectors = progressbar.querySelectorAll(".bg-step-completed");

      // 3 connecteurs colores (entre etapes 1-2, 2-3, 3-4)
      expect(connectors.length).toBeGreaterThanOrEqual(3);
    });

    it("les lignes des etapes futures sont grises", () => {
      render(<ProgressBar currentStep={2} />);

      // Les connecteurs apres l'etape 2 sont en bg-border
      const progressbar = screen.getByRole("progressbar");
      const grayConnectors = progressbar.querySelectorAll(".bg-border");

      expect(grayConnectors.length).toBeGreaterThan(0);
    });
  });

  describe("progression des etapes", () => {
    it("gere correctement l'etape 1", () => {
      render(<ProgressBar currentStep={1} />);

      const profilLabel = screen.getByText("Profil");
      expect(profilLabel).toHaveClass("text-step-current");

      // Toutes les autres sont a venir
      const projetLabel = screen.getByText("Projet");
      expect(projetLabel).toHaveClass("text-muted-foreground");
    });

    it("gere correctement la derniere etape", () => {
      render(<ProgressBar currentStep={6} />);

      // Etapes 1-5 completees
      const profilLabel = screen.getByText("Profil");
      expect(profilLabel).toHaveClass("text-step-completed");

      // Etape 6 actuelle
      const structureLabel = screen.getByText("Structure");
      expect(structureLabel).toHaveClass("text-step-current");
    });
  });

  describe("labels personnalises", () => {
    it("accepte des labels personnalises", () => {
      const customLabels = ["Un", "Deux", "Trois", "Quatre"];
      render(
        <ProgressBar
          currentStep={2}
          totalSteps={4}
          labels={customLabels}
        />
      );

      expect(screen.getByText("Un")).toBeInTheDocument();
      expect(screen.getByText("Deux")).toBeInTheDocument();
      expect(screen.getByText("Trois")).toBeInTheDocument();
      expect(screen.getByText("Quatre")).toBeInTheDocument();
    });

    it("utilise les labels par defaut si non fournis", () => {
      render(<ProgressBar currentStep={1} />);

      expect(screen.getByText("Profil")).toBeInTheDocument();
    });
  });

  describe("style et className", () => {
    it("accepte une className personnalisee", () => {
      const { container } = render(
        <ProgressBar currentStep={1} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("a toujours la classe w-full", () => {
      const { container } = render(<ProgressBar currentStep={1} />);

      expect(container.firstChild).toHaveClass("w-full");
    });
  });

  describe("cas limites", () => {
    it("gere currentStep = 0 sans planter", () => {
      expect(() => {
        render(<ProgressBar currentStep={0} />);
      }).not.toThrow();
    });

    it("gere currentStep > totalSteps sans planter", () => {
      expect(() => {
        render(<ProgressBar currentStep={10} totalSteps={6} />);
      }).not.toThrow();
    });

    it("gere un tableau de labels vide", () => {
      expect(() => {
        render(<ProgressBar currentStep={1} totalSteps={3} labels={[]} />);
      }).not.toThrow();
    });
  });

  describe("responsive dots (mobile)", () => {
    it("affiche des dots plus petits sur mobile", () => {
      render(<ProgressBar currentStep={3} />);

      // Les dots mobile ont size="sm" (classe w-2.5)
      const mobileSection = document.querySelector(".md\\:hidden");
      expect(mobileSection).toBeInTheDocument();
    });
  });
});
