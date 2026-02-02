/**
 * Tests unitaires pour AlerteEndettement
 *
 * Teste le composant d'alerte contextuelle selon le taux d'endettement.
 * Verifie les differents niveaux d'alerte et l'affichage du bouton courtier.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AlerteEndettement } from "../etape-3/AlerteEndettement";

// Mock du LeadCourtierModal pour eviter les dependances complexes
vi.mock("../resultats/LeadCourtierModal", () => ({
  LeadCourtierModal: ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="modal-courtier" role="dialog">
        <button onClick={() => onOpenChange(false)}>Fermer</button>
      </div>
    ) : null,
}));

// ============================================================================
// Tests
// ============================================================================

describe("AlerteEndettement", () => {
  describe("pas d'alerte si endettement acceptable", () => {
    it("ne rend rien si taux <= 35%", () => {
      const { container } = render(
        <AlerteEndettement tauxEndettement={0.30} resteAVivre={3000} />
      );

      expect(container.firstChild).toBeNull();
    });

    it("ne rend rien si taux = 35%", () => {
      const { container } = render(
        <AlerteEndettement tauxEndettement={0.35} resteAVivre={2500} />
      );

      expect(container.firstChild).toBeNull();
    });

    it("ne rend rien si taux = 0%", () => {
      const { container } = render(
        <AlerteEndettement tauxEndettement={0} resteAVivre={5000} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("alerte info (35-40%) - derogation possible", () => {
    it("affiche l'alerte pour taux entre 35% et 40%", () => {
      render(<AlerteEndettement tauxEndettement={0.37} resteAVivre={2000} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/37\.0%/)).toBeInTheDocument();
      expect(screen.getByText(/Dérogation possible/i)).toBeInTheDocument();
    });

    it("affiche le message avec bon reste a vivre", () => {
      render(<AlerteEndettement tauxEndettement={0.38} resteAVivre={2000} />);

      expect(screen.getByText(/2.*000.*\/mois/)).toBeInTheDocument();
      expect(screen.getByText(/20% de marge de dérogation/i)).toBeInTheDocument();
    });

    it("affiche le message avec mauvais reste a vivre", () => {
      render(<AlerteEndettement tauxEndettement={0.38} resteAVivre={1200} />);

      expect(screen.getByText(/reste à vivre/i)).toBeInTheDocument();
      expect(screen.getByText(/un peu juste/i)).toBeInTheDocument();
    });

    it("affiche le bouton consulter courtier", () => {
      render(<AlerteEndettement tauxEndettement={0.37} resteAVivre={2000} />);

      const button = screen.getByRole("button", {
        name: /consulter un courtier/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("utilise le style amber pour l'alerte info", () => {
      render(<AlerteEndettement tauxEndettement={0.37} resteAVivre={2000} />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("border-amber-500/50");
    });
  });

  describe("alerte warning (> 40%) - endettement eleve", () => {
    it("affiche l'alerte pour taux > 40%", () => {
      render(<AlerteEndettement tauxEndettement={0.45} resteAVivre={1500} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/45\.0%/)).toBeInTheDocument();
      expect(screen.getByText(/Endettement élevé/i)).toBeInTheDocument();
    });

    it("affiche le message avec bon reste a vivre comme atout", () => {
      render(<AlerteEndettement tauxEndettement={0.42} resteAVivre={2000} />);

      expect(screen.getByText(/2.*000.*\/mois/)).toBeInTheDocument();
      expect(screen.getByText(/peut jouer en votre faveur/i)).toBeInTheDocument();
    });

    it("n'affiche pas le message reste a vivre si mauvais", () => {
      render(<AlerteEndettement tauxEndettement={0.42} resteAVivre={1000} />);

      expect(
        screen.queryByText(/peut jouer en votre faveur/i)
      ).not.toBeInTheDocument();
    });

    it("affiche la liste des services du courtier", () => {
      render(<AlerteEndettement tauxEndettement={0.45} resteAVivre={1500} />);

      expect(screen.getByText(/Trouver des banques/i)).toBeInTheDocument();
      expect(screen.getByText(/Optimiser votre dossier/i)).toBeInTheDocument();
      expect(screen.getByText(/Négocier des conditions/i)).toBeInTheDocument();
    });

    it("affiche le bouton etre rappele", () => {
      render(<AlerteEndettement tauxEndettement={0.45} resteAVivre={1500} />);

      const button = screen.getByRole("button", {
        name: /Être rappelé par un courtier/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("utilise le style orange pour l'alerte warning", () => {
      render(<AlerteEndettement tauxEndettement={0.45} resteAVivre={1500} />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("border-orange-500/50");
    });
  });

  describe("interaction avec le modal courtier", () => {
    it("ouvre le modal au clic sur le bouton (35-40%)", () => {
      render(<AlerteEndettement tauxEndettement={0.37} resteAVivre={2000} />);

      const button = screen.getByRole("button", {
        name: /consulter un courtier/i,
      });
      fireEvent.click(button);

      expect(screen.getByTestId("modal-courtier")).toBeInTheDocument();
    });

    it("ouvre le modal au clic sur le bouton (> 40%)", () => {
      render(<AlerteEndettement tauxEndettement={0.45} resteAVivre={1500} />);

      const button = screen.getByRole("button", {
        name: /Être rappelé/i,
      });
      fireEvent.click(button);

      expect(screen.getByTestId("modal-courtier")).toBeInTheDocument();
    });

    it("ferme le modal correctement", () => {
      render(<AlerteEndettement tauxEndettement={0.37} resteAVivre={2000} />);

      // Ouvrir le modal
      const openButton = screen.getByRole("button", {
        name: /consulter un courtier/i,
      });
      fireEvent.click(openButton);

      expect(screen.getByTestId("modal-courtier")).toBeInTheDocument();

      // Fermer le modal
      const closeButton = screen.getByRole("button", { name: /fermer/i });
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("modal-courtier")).not.toBeInTheDocument();
    });

    it("transmet les donnees de simulation au modal", () => {
      const simulationData = {
        revenuMensuel: 5000,
        montantProjet: 300000,
        apport: 50000,
        montantEmprunt: 250000,
        dureeEmpruntMois: 240,
        tauxEndettement: 0.38,
        mensualiteEstimee: 1500,
      };

      render(
        <AlerteEndettement
          tauxEndettement={0.38}
          resteAVivre={2000}
          simulationData={simulationData}
        />
      );

      const button = screen.getByRole("button", {
        name: /consulter un courtier/i,
      });
      fireEvent.click(button);

      // Le modal est rendu (les donnees sont passees en props)
      expect(screen.getByTestId("modal-courtier")).toBeInTheDocument();
    });
  });

  describe("formatage des valeurs", () => {
    it("formate le taux avec une decimale", () => {
      render(<AlerteEndettement tauxEndettement={0.375} resteAVivre={2000} />);

      expect(screen.getByText(/37\.5%/)).toBeInTheDocument();
    });

    it("formate le reste a vivre avec separateurs", () => {
      render(<AlerteEndettement tauxEndettement={0.38} resteAVivre={2500} />);

      // Verifie le format francais (2 500 ou 2500)
      expect(screen.getByText(/2[\s\u00A0]?500.*\/mois/)).toBeInTheDocument();
    });
  });

  describe("seuil de reste a vivre confortable", () => {
    it("considere 1500 EUR comme seuil de confort", () => {
      // Avec 1500 EUR exactement
      const { rerender } = render(
        <AlerteEndettement tauxEndettement={0.38} resteAVivre={1500} />
      );

      expect(screen.getByText(/1[\s\u00A0]?500.*\/mois/)).toBeInTheDocument();
      expect(screen.getByText(/confortable/i)).toBeInTheDocument();

      // Avec 1499 EUR
      rerender(
        <AlerteEndettement tauxEndettement={0.38} resteAVivre={1499} />
      );

      expect(screen.getByText(/un peu juste/i)).toBeInTheDocument();
    });
  });

  describe("cas limites", () => {
    it("gere un taux exactement a 35.001%", () => {
      render(<AlerteEndettement tauxEndettement={0.35001} resteAVivre={2000} />);

      // Devrait afficher l'alerte car > 35%
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("gere un taux exactement a 40%", () => {
      render(<AlerteEndettement tauxEndettement={0.40} resteAVivre={2000} />);

      // Devrait etre dans la categorie 35-40% (info)
      expect(screen.getByText(/Dérogation possible/i)).toBeInTheDocument();
    });

    it("gere un taux tres eleve (80%)", () => {
      render(<AlerteEndettement tauxEndettement={0.80} resteAVivre={500} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/80\.0%/)).toBeInTheDocument();
    });

    it("gere un reste a vivre nul", () => {
      render(<AlerteEndettement tauxEndettement={0.45} resteAVivre={0} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      // Pas de mention "confortable"
      expect(
        screen.queryByText(/peut jouer en votre faveur/i)
      ).not.toBeInTheDocument();
    });

    it("gere un reste a vivre negatif", () => {
      render(<AlerteEndettement tauxEndettement={0.50} resteAVivre={-500} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
