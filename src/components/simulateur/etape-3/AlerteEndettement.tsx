"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LeadCourtierModal } from "../resultats/LeadCourtierModal";

interface AlerteEndettementProps {
  tauxEndettement: number;
  resteAVivre: number;
  simulationData?: {
    revenuMensuel: number;
    montantProjet: number;
    apport: number;
    montantEmprunt: number;
    dureeEmpruntMois: number;
    tauxEndettement: number;
    mensualiteEstimee: number;
  };
}

/**
 * Alerte contextuelle selon le taux d'endettement
 *
 * - < 35% : Pas d'alerte (ou message positif)
 * - 35-40% : Alerte info avec suggestion courtier
 * - > 40% : Alerte warning avec forte suggestion courtier
 */
export function AlerteEndettement({
  tauxEndettement,
  resteAVivre,
  simulationData,
}: AlerteEndettementProps) {
  const [showModal, setShowModal] = useState(false);

  const tauxPourcent = (tauxEndettement * 100).toFixed(1);
  const bonResteAVivre = resteAVivre >= 1500;

  // Pas d'alerte si endettement acceptable
  if (tauxEndettement <= 0.35) {
    return null;
  }

  // 35-40% : Info, dérogation possible
  if (tauxEndettement <= 0.40) {
    return (
      <>
        <Alert className="border-amber-500/50 bg-amber-950/20">
          <AlertTitle className="flex items-center gap-2 text-amber-500">
            <span>💡</span>
            Endettement à {tauxPourcent}% - Dérogation possible
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm text-muted-foreground">
            {bonResteAVivre ? (
              <>
                Votre taux dépasse les 35% HCSF, mais votre reste à vivre de{" "}
                <strong>{resteAVivre.toLocaleString("fr-FR")}€/mois</strong> est
                confortable. Les banques ont <strong>20% de marge de dérogation</strong>{" "}
                sur leurs dossiers annuels.
              </>
            ) : (
              <>
                Votre taux dépasse les 35% HCSF. Les banques ont{" "}
                <strong>20% de marge de dérogation</strong> mais votre reste à vivre
                est un peu juste.
              </>
            )}
            <br />
            <br />
            Un courtier peut identifier les banques qui ont encore de la marge pour
            votre profil.
          </AlertDescription>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
              className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
            >
              Consulter un courtier gratuitement
            </Button>
          </div>
        </Alert>

        <LeadCourtierModal
          open={showModal}
          onOpenChange={setShowModal}
          simulationData={simulationData}
        />
      </>
    );
  }

  // > 40% : Warning plus prononcé
  return (
    <>
      <Alert className="border-orange-500/50 bg-orange-950/20">
        <AlertTitle className="flex items-center gap-2 text-orange-500">
          <span>⚠️</span>
          Endettement élevé ({tauxPourcent}%)
        </AlertTitle>
        <AlertDescription className="mt-2 text-sm text-muted-foreground">
          Votre taux d'endettement est au-dessus des normes bancaires standard.
          {bonResteAVivre && (
            <>
              {" "}
              Cependant, votre reste à vivre de{" "}
              <strong>{resteAVivre.toLocaleString("fr-FR")}€/mois</strong> peut jouer
              en votre faveur.
            </>
          )}
          <br />
          <br />
          <strong>Un courtier peut :</strong>
          <ul className="list-disc ml-4 mt-1">
            <li>Trouver des banques avec marge de dérogation</li>
            <li>Optimiser votre dossier (durée, montage)</li>
            <li>Négocier des conditions adaptées à votre profil</li>
          </ul>
        </AlertDescription>
        <div className="mt-3">
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Être rappelé par un courtier
          </Button>
        </div>
      </Alert>

      <LeadCourtierModal
        open={showModal}
        onOpenChange={setShowModal}
        simulationData={simulationData}
      />
    </>
  );
}
