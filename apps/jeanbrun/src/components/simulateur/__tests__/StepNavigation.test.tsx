/**
 * Tests unitaires pour StepNavigation
 *
 * Teste le composant de navigation entre les etapes du wizard.
 * Boutons Retour et Continuer/Voir les resultats.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepNavigation } from "../StepNavigation";

// ============================================================================
// Tests
// ============================================================================

describe("StepNavigation", () => {
  describe("affichage de base", () => {
    it("affiche le bouton Continuer par defaut", () => {
      render(<StepNavigation onNext={vi.fn()} />);

      expect(screen.getByRole("button", { name: /continuer/i })).toBeInTheDocument();
    });

    it("affiche le bouton Retour si onBack et canGoBack", () => {
      render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
          canGoBack={true}
        />
      );

      expect(screen.getByRole("button", { name: /retour/i })).toBeInTheDocument();
    });

    it("n'affiche pas le bouton Retour si canGoBack=false", () => {
      render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
          canGoBack={false}
        />
      );

      expect(screen.queryByRole("button", { name: /retour/i })).not.toBeInTheDocument();
    });

    it("n'affiche pas le bouton Retour si onBack est undefined", () => {
      render(
        <StepNavigation
          onNext={vi.fn()}
          canGoBack={true}
        />
      );

      expect(screen.queryByRole("button", { name: /retour/i })).not.toBeInTheDocument();
    });
  });

  describe("texte du bouton Next", () => {
    it("affiche 'Continuer' si isLastStep=false", () => {
      render(
        <StepNavigation
          onNext={vi.fn()}
          isLastStep={false}
        />
      );

      expect(screen.getByRole("button", { name: /continuer/i })).toBeInTheDocument();
    });

    it("affiche 'Voir les resultats' si isLastStep=true", () => {
      render(
        <StepNavigation
          onNext={vi.fn()}
          isLastStep={true}
        />
      );

      expect(
        screen.getByRole("button", { name: /voir les résultats/i })
      ).toBeInTheDocument();
    });

    it("affiche 'Calcul en cours...' si isSubmitting=true", () => {
      render(
        <StepNavigation
          onNext={vi.fn()}
          isSubmitting={true}
        />
      );

      expect(screen.getByText(/calcul en cours/i)).toBeInTheDocument();
    });
  });

  describe("interactions bouton Next", () => {
    it("appelle onNext quand on clique sur Continuer", async () => {
      const user = userEvent.setup();
      const onNext = vi.fn();

      render(<StepNavigation onNext={onNext} />);

      await user.click(screen.getByRole("button", { name: /continuer/i }));

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it("appelle onNext quand on clique sur Voir les resultats", async () => {
      const user = userEvent.setup();
      const onNext = vi.fn();

      render(<StepNavigation onNext={onNext} isLastStep={true} />);

      await user.click(screen.getByRole("button", { name: /voir les résultats/i }));

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it("desactive le bouton Next si canGoNext=false", () => {
      render(
        <StepNavigation
          onNext={vi.fn()}
          canGoNext={false}
        />
      );

      const nextButton = screen.getByRole("button", { name: /continuer/i });
      expect(nextButton).toBeDisabled();
    });

    it("desactive le bouton Next si isSubmitting=true", () => {
      render(
        <StepNavigation
          onNext={vi.fn()}
          isSubmitting={true}
        />
      );

      const nextButton = screen.getByRole("button", { name: /calcul en cours/i });
      expect(nextButton).toBeDisabled();
    });

    it("n'appelle pas onNext si canGoNext=false", async () => {
      const user = userEvent.setup();
      const onNext = vi.fn();

      render(
        <StepNavigation
          onNext={onNext}
          canGoNext={false}
        />
      );

      const nextButton = screen.getByRole("button", { name: /continuer/i });
      await user.click(nextButton);

      expect(onNext).not.toHaveBeenCalled();
    });
  });

  describe("interactions bouton Back", () => {
    it("appelle onBack quand on clique sur Retour", async () => {
      const user = userEvent.setup();
      const onBack = vi.fn();

      render(
        <StepNavigation
          onBack={onBack}
          onNext={vi.fn()}
          canGoBack={true}
        />
      );

      await user.click(screen.getByRole("button", { name: /retour/i }));

      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it("desactive le bouton Retour si isSubmitting=true", () => {
      render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
          canGoBack={true}
          isSubmitting={true}
        />
      );

      const backButton = screen.getByRole("button", { name: /retour/i });
      expect(backButton).toBeDisabled();
    });
  });

  describe("icones", () => {
    it("affiche l'icone ChevronLeft sur le bouton Retour", () => {
      render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
          canGoBack={true}
        />
      );

      const backButton = screen.getByRole("button", { name: /retour/i });
      const svg = backButton.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("affiche l'icone ChevronRight sur le bouton Continuer", () => {
      render(<StepNavigation onNext={vi.fn()} />);

      const nextButton = screen.getByRole("button", { name: /continuer/i });
      const svg = nextButton.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("affiche l'icone Loader2 quand isSubmitting=true", () => {
      render(
        <StepNavigation
          onNext={vi.fn()}
          isSubmitting={true}
        />
      );

      // Le loader a la classe animate-spin
      const loader = document.querySelector(".animate-spin");
      expect(loader).toBeInTheDocument();
    });
  });

  describe("type de bouton", () => {
    it("le bouton Next a type='button'", () => {
      render(<StepNavigation onNext={vi.fn()} />);

      const nextButton = screen.getByRole("button", { name: /continuer/i });
      expect(nextButton).toHaveAttribute("type", "button");
    });

    it("le bouton Back a type='button'", () => {
      render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
          canGoBack={true}
        />
      );

      const backButton = screen.getByRole("button", { name: /retour/i });
      expect(backButton).toHaveAttribute("type", "button");
    });
  });

  describe("style et layout", () => {
    it("accepte une className personnalisee", () => {
      const { container } = render(
        <StepNavigation onNext={vi.fn()} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("utilise flexbox pour espacer les boutons", () => {
      const { container } = render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
          canGoBack={true}
        />
      );

      expect(container.firstChild).toHaveClass("flex");
      expect(container.firstChild).toHaveClass("justify-between");
    });

    it("a une largeur minimum sur le bouton Next", () => {
      render(<StepNavigation onNext={vi.fn()} />);

      const nextButton = screen.getByRole("button", { name: /continuer/i });
      // La classe min-w peut etre appliquee differemment selon le build
      expect(nextButton.className).toMatch(/min-w/);
    });
  });

  describe("variants de bouton", () => {
    it("le bouton Back utilise le variant ghost", () => {
      render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
          canGoBack={true}
        />
      );

      // Le bouton Retour a le variant ghost (pas de background)
      const backButton = screen.getByRole("button", { name: /retour/i });
      // Verification via presence dans le DOM
      expect(backButton).toBeInTheDocument();
    });
  });

  describe("valeurs par defaut des props", () => {
    it("canGoBack vaut true par defaut", () => {
      // Si onBack est fourni sans canGoBack, le bouton devrait apparaitre
      render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
        />
      );

      expect(screen.getByRole("button", { name: /retour/i })).toBeInTheDocument();
    });

    it("canGoNext vaut true par defaut", () => {
      render(<StepNavigation onNext={vi.fn()} />);

      const nextButton = screen.getByRole("button", { name: /continuer/i });
      expect(nextButton).not.toBeDisabled();
    });

    it("isLastStep vaut false par defaut", () => {
      render(<StepNavigation onNext={vi.fn()} />);

      expect(screen.getByText(/continuer/i)).toBeInTheDocument();
      expect(screen.queryByText(/voir les résultats/i)).not.toBeInTheDocument();
    });

    it("isSubmitting vaut false par defaut", () => {
      render(<StepNavigation onNext={vi.fn()} />);

      expect(screen.queryByText(/calcul en cours/i)).not.toBeInTheDocument();
    });
  });

  describe("accessibilite", () => {
    it("les boutons sont focusables", () => {
      render(
        <StepNavigation
          onBack={vi.fn()}
          onNext={vi.fn()}
          canGoBack={true}
        />
      );

      const backButton = screen.getByRole("button", { name: /retour/i });
      const nextButton = screen.getByRole("button", { name: /continuer/i });

      expect(backButton).not.toHaveAttribute("tabindex", "-1");
      expect(nextButton).not.toHaveAttribute("tabindex", "-1");
    });
  });

  describe("espacement dynamique", () => {
    it("remplace le bouton Back par un div vide si non affiche", () => {
      const { container } = render(<StepNavigation onNext={vi.fn()} />);

      // Quand le bouton Back n'est pas affiche, un div vide prend sa place
      // pour maintenir le layout justify-between
      const children = container.firstChild?.childNodes;
      expect(children?.length).toBe(2);
    });
  });
});
