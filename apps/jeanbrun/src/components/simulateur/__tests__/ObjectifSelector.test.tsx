/**
 * Tests unitaires pour ObjectifSelector
 *
 * Teste le composant de selection d'objectif d'investissement.
 * Le composant affiche 4 cartes cliquables pour choisir l'objectif principal.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ObjectifSelector } from "../etape-1/ObjectifSelector";

// ============================================================================
// Tests
// ============================================================================

describe("ObjectifSelector", () => {
  describe("affichage des 4 objectifs", () => {
    it("affiche les 4 options d'objectif", () => {
      render(<ObjectifSelector onChange={vi.fn()} />);

      expect(screen.getByText("Reduire mes impots")).toBeInTheDocument();
      expect(screen.getByText("Generer des revenus")).toBeInTheDocument();
      expect(screen.getByText("Construire un patrimoine")).toBeInTheDocument();
      expect(screen.getByText("Preparer ma retraite")).toBeInTheDocument();
    });

    it("affiche les descriptions de chaque objectif", () => {
      render(<ObjectifSelector onChange={vi.fn()} />);

      expect(screen.getByText("Optimiser ma fiscalite")).toBeInTheDocument();
      expect(screen.getByText("Revenus complementaires")).toBeInTheDocument();
      expect(screen.getByText("Investir dans l'immobilier")).toBeInTheDocument();
      expect(screen.getByText("Anticiper l'avenir")).toBeInTheDocument();
    });

    it("affiche une icone pour chaque objectif", () => {
      render(<ObjectifSelector onChange={vi.fn()} />);

      // Chaque carte contient une icone (dans un div avec classes specifiques)
      const buttons = screen.getAllByRole("radio");
      expect(buttons).toHaveLength(4);

      // Verifier que chaque bouton a une icone (svg)
      buttons.forEach((button) => {
        const svg = button.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe("semantique radiogroup", () => {
    it("utilise un radiogroup pour l'accessibilite", () => {
      render(<ObjectifSelector onChange={vi.fn()} />);

      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toBeInTheDocument();
      expect(radiogroup).toHaveAttribute(
        "aria-label",
        "Selectionnez votre objectif principal"
      );
    });

    it("chaque option est un radio button", () => {
      render(<ObjectifSelector onChange={vi.fn()} />);

      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(4);
    });

    it("aucune option n'est selectionnee par defaut si value est undefined", () => {
      render(<ObjectifSelector value={undefined} onChange={vi.fn()} />);

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute("aria-checked", "false");
      });
    });
  });

  describe("selection d'objectif", () => {
    it("appelle onChange avec le bon type quand on clique sur 'Reduire mes impots'", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ObjectifSelector onChange={onChange} />);

      const button = screen.getByRole("radio", { name: /reduire mes impots/i });
      await user.click(button);

      expect(onChange).toHaveBeenCalledWith("reduire_impots");
    });

    it("appelle onChange avec 'revenus' quand on clique sur 'Generer des revenus'", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ObjectifSelector onChange={onChange} />);

      const button = screen.getByRole("radio", { name: /generer des revenus/i });
      await user.click(button);

      expect(onChange).toHaveBeenCalledWith("revenus");
    });

    it("appelle onChange avec 'patrimoine' quand on clique sur 'Construire un patrimoine'", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ObjectifSelector onChange={onChange} />);

      const button = screen.getByRole("radio", {
        name: /construire un patrimoine/i,
      });
      await user.click(button);

      expect(onChange).toHaveBeenCalledWith("patrimoine");
    });

    it("appelle onChange avec 'retraite' quand on clique sur 'Preparer ma retraite'", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ObjectifSelector onChange={onChange} />);

      const button = screen.getByRole("radio", { name: /preparer ma retraite/i });
      await user.click(button);

      expect(onChange).toHaveBeenCalledWith("retraite");
    });
  });

  describe("etat selectionne", () => {
    it("marque l'option selectionnee avec aria-checked='true'", () => {
      render(<ObjectifSelector value="reduire_impots" onChange={vi.fn()} />);

      const selectedRadio = screen.getByRole("radio", {
        name: /reduire mes impots/i,
      });
      expect(selectedRadio).toHaveAttribute("aria-checked", "true");
    });

    it("les autres options ont aria-checked='false'", () => {
      render(<ObjectifSelector value="reduire_impots" onChange={vi.fn()} />);

      const otherRadios = screen
        .getAllByRole("radio")
        .filter(
          (radio) => !radio.textContent?.includes("Reduire mes impots")
        );

      otherRadios.forEach((radio) => {
        expect(radio).toHaveAttribute("aria-checked", "false");
      });
    });

    it("met en valeur visuellement l'option selectionnee", () => {
      render(<ObjectifSelector value="patrimoine" onChange={vi.fn()} />);

      // L'option selectionnee devrait avoir la classe border-2
      const selectedRadio = screen.getByRole("radio", {
        name: /construire un patrimoine/i,
      });

      // Verifier que le Card enfant a les classes de selection
      const card = selectedRadio.querySelector('[class*="border-2"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe("changement de selection", () => {
    it("permet de changer d'objectif selectionne", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      const { rerender } = render(
        <ObjectifSelector value="reduire_impots" onChange={onChange} />
      );

      // Verifier la selection initiale
      expect(
        screen.getByRole("radio", { name: /reduire mes impots/i })
      ).toHaveAttribute("aria-checked", "true");

      // Cliquer sur un autre objectif
      await user.click(
        screen.getByRole("radio", { name: /generer des revenus/i })
      );

      expect(onChange).toHaveBeenCalledWith("revenus");

      // Simuler la mise a jour de la prop value
      rerender(<ObjectifSelector value="revenus" onChange={onChange} />);

      expect(
        screen.getByRole("radio", { name: /generer des revenus/i })
      ).toHaveAttribute("aria-checked", "true");
      expect(
        screen.getByRole("radio", { name: /reduire mes impots/i })
      ).toHaveAttribute("aria-checked", "false");
    });
  });

  describe("layout et style", () => {
    it("utilise une grille 2 colonnes sur desktop", () => {
      render(<ObjectifSelector onChange={vi.fn()} />);

      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toHaveClass("sm:grid-cols-2");
    });

    it("accepte une className personnalisee", () => {
      render(
        <ObjectifSelector onChange={vi.fn()} className="custom-class" />
      );

      const radiogroup = screen.getByRole("radiogroup");
      expect(radiogroup).toHaveClass("custom-class");
    });
  });

  describe("types ObjectifType", () => {
    it.each([
      ["reduire_impots", "Reduire mes impots"],
      ["revenus", "Generer des revenus"],
      ["patrimoine", "Construire un patrimoine"],
      ["retraite", "Preparer ma retraite"],
    ] as const)("affiche correctement l'objectif %s", (value, label) => {
      render(<ObjectifSelector value={value} onChange={vi.fn()} />);

      const radio = screen.getByRole("radio", { name: new RegExp(label, "i") });
      expect(radio).toHaveAttribute("aria-checked", "true");
    });
  });
});
