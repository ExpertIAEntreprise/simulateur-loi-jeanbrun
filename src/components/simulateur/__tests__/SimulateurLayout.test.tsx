/**
 * Tests unitaires pour SimulateurLayout
 *
 * Teste le composant de mise en page du simulateur avec header sticky,
 * progress bar, et navigation.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SimulateurLayout } from "../SimulateurLayout";

// ============================================================================
// Tests
// ============================================================================

describe("SimulateurLayout", () => {
  const defaultProps = {
    currentStep: 1,
    onNext: vi.fn(),
  };

  describe("structure de base", () => {
    it("rend le contenu enfant", () => {
      render(
        <SimulateurLayout {...defaultProps}>
          <div data-testid="child-content">Contenu de l'etape</div>
        </SimulateurLayout>
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("Contenu de l'etape")).toBeInTheDocument();
    });

    it("affiche le header avec le logo", () => {
      render(
        <SimulateurLayout {...defaultProps}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      expect(screen.getByText("Jeanbrun")).toBeInTheDocument();
    });

    it("le logo est un lien vers l'accueil", () => {
      render(
        <SimulateurLayout {...defaultProps}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const logoLink = screen.getByRole("link", { name: /jeanbrun/i });
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("affiche le bouton sauvegarde automatique", () => {
      render(
        <SimulateurLayout {...defaultProps}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      expect(screen.getByText(/Sauvegardé/i)).toBeInTheDocument();
    });
  });

  describe("progress bar", () => {
    it("affiche la progress bar avec l'etape courante", () => {
      render(
        <SimulateurLayout {...defaultProps} currentStep={3} totalSteps={6}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      // La progress bar mobile affiche "Étape X / Y"
      expect(screen.getAllByText("Étape").length).toBeGreaterThan(0);
      expect(screen.getAllByText("3").length).toBeGreaterThan(0);
    });

    it("utilise 6 etapes par defaut", () => {
      render(
        <SimulateurLayout {...defaultProps} currentStep={2}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      // Il y a 2 progress bars (mobile et desktop)
      expect(screen.getAllByText("/ 6").length).toBeGreaterThan(0);
    });

    it("peut personnaliser le nombre total d'etapes", () => {
      render(
        <SimulateurLayout {...defaultProps} currentStep={1} totalSteps={4}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      // Il y a 2 progress bars (mobile et desktop)
      expect(screen.getAllByText("/ 4").length).toBeGreaterThan(0);
    });
  });

  describe("navigation", () => {
    it("affiche le bouton suivant", () => {
      const onNext = vi.fn();
      render(
        <SimulateurLayout {...defaultProps} onNext={onNext}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      // Le bouton affiche "Continuer"
      const nextButton = screen.getByRole("button", { name: /continuer/i });
      expect(nextButton).toBeInTheDocument();
    });

    it("appelle onNext au clic sur suivant", () => {
      const onNext = vi.fn();
      render(
        <SimulateurLayout {...defaultProps} onNext={onNext} canGoNext={true}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const nextButton = screen.getByRole("button", { name: /continuer/i });
      fireEvent.click(nextButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it("desactive le bouton suivant si canGoNext est false", () => {
      render(
        <SimulateurLayout {...defaultProps} canGoNext={false}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const nextButton = screen.getByRole("button", { name: /continuer/i });
      expect(nextButton).toBeDisabled();
    });

    it("affiche le bouton precedent si canGoBack est true et step > 1", () => {
      const onBack = vi.fn();
      render(
        <SimulateurLayout
          {...defaultProps}
          currentStep={2}
          onBack={onBack}
          canGoBack={true}
        >
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const backButton = screen.getByRole("button", { name: /retour/i });
      expect(backButton).toBeInTheDocument();
    });

    it("appelle onBack au clic sur precedent", () => {
      const onBack = vi.fn();
      render(
        <SimulateurLayout
          {...defaultProps}
          currentStep={2}
          onBack={onBack}
          canGoBack={true}
        >
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const backButton = screen.getByRole("button", { name: /retour/i });
      fireEvent.click(backButton);

      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it("masque le bouton precedent sur la premiere etape", () => {
      render(
        <SimulateurLayout {...defaultProps} currentStep={1} canGoBack={true}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      // Le bouton retour ne devrait pas etre present sur step 1
      const backButtons = screen.queryAllByRole("button", {
        name: /retour/i,
      });

      expect(backButtons.length).toBe(0);
    });
  });

  describe("derniere etape", () => {
    it("affiche 'Voir les resultats' au lieu de 'Continuer' sur la derniere etape", () => {
      render(
        <SimulateurLayout {...defaultProps} isLastStep={true}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      expect(
        screen.getByRole("button", { name: /voir les résultats/i })
      ).toBeInTheDocument();
    });

    it("gere l'etat de soumission", () => {
      render(
        <SimulateurLayout {...defaultProps} isLastStep={true} isSubmitting={true}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const submitButton = screen.getByRole("button", {
        name: /calcul en cours/i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("responsive", () => {
    it("affiche la progress bar", () => {
      render(
        <SimulateurLayout {...defaultProps} currentStep={2}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      // Au moins une progress bar doit etre presente
      const progressBars = screen.getAllByRole("progressbar");
      expect(progressBars.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("styles et classes", () => {
    it("applique une className personnalisee au main", () => {
      const { container } = render(
        <SimulateurLayout {...defaultProps} className="custom-class">
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const main = container.querySelector("main");
      expect(main).toHaveClass("custom-class");
    });

    it("le header est sticky", () => {
      const { container } = render(
        <SimulateurLayout {...defaultProps}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const header = container.querySelector("header");
      expect(header).toHaveClass("sticky");
      expect(header).toHaveClass("top-0");
    });

    it("le footer est sticky", () => {
      const { container } = render(
        <SimulateurLayout {...defaultProps}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("sticky");
      expect(footer).toHaveClass("bottom-0");
    });
  });

  describe("accessibilite", () => {
    it("utilise les elements semantiques header, main, footer", () => {
      const { container } = render(
        <SimulateurLayout {...defaultProps}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    it("le lien logo est accessible", () => {
      render(
        <SimulateurLayout {...defaultProps}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      const logoLink = screen.getByRole("link", { name: /jeanbrun/i });
      expect(logoLink).toBeVisible();
    });
  });

  describe("cas limites", () => {
    it("gere l'etape 0 sans erreur", () => {
      render(
        <SimulateurLayout {...defaultProps} currentStep={0}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      expect(screen.getByText("Contenu")).toBeInTheDocument();
    });

    it("gere une etape superieure au total", () => {
      render(
        <SimulateurLayout {...defaultProps} currentStep={10} totalSteps={6}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      expect(screen.getByText("Contenu")).toBeInTheDocument();
    });

    it("gere onBack undefined quand canGoBack est false", () => {
      render(
        <SimulateurLayout
          {...defaultProps}
          currentStep={2}
          onBack={undefined}
          canGoBack={false}
        >
          <div>Contenu</div>
        </SimulateurLayout>
      );

      // Pas d'erreur, le bouton precedent n'est pas rendu
      expect(screen.getByText("Contenu")).toBeInTheDocument();
    });

    it("fonctionne sans className", () => {
      render(
        <SimulateurLayout {...defaultProps}>
          <div>Contenu</div>
        </SimulateurLayout>
      );

      expect(screen.getByText("Contenu")).toBeInTheDocument();
    });
  });
});
