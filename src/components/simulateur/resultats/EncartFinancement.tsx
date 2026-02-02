"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCouleurEndettement } from "@/lib/calculs/analyse-financement";
import type { AnalyseFinancement } from "@/types/lead-financement";
import { LeadCourtierModal } from "./LeadCourtierModal";

interface EncartFinancementProps {
  analyse: AnalyseFinancement;
  /** Données pour pré-remplir le formulaire lead */
  simulationData?: {
    simulationId?: string;
    revenuMensuel: number;
    montantProjet: number;
    apport: number;
    montantEmprunt: number;
    dureeEmpruntMois: number;
    tauxEndettement: number;
    mensualiteEstimee: number;
    villeProjet?: string;
    typeBien?: "neuf" | "ancien";
  };
}

/**
 * Encart d'analyse de financement affiché dans la page résultats
 *
 * Affiche :
 * - Mensualité estimée
 * - Taux d'endettement avec jauge visuelle
 * - Verdict de finançabilité
 * - CTA pour contacter un courtier partenaire
 */
export function EncartFinancement({ analyse, simulationData }: EncartFinancementProps) {
  const [showModal, setShowModal] = useState(false);

  const couleurEndettement = getCouleurEndettement(analyse.tauxEndettement);

  // Calcul de la largeur de la jauge (max 100%)
  const largeurJauge = Math.min(analyse.tauxEndettementPourcent, 50) * 2;

  // Couleur de la jauge selon le seuil
  const couleurJauge =
    analyse.tauxEndettement <= 0.33
      ? "bg-green-500"
      : analyse.tauxEndettement <= 0.35
        ? "bg-yellow-500"
        : analyse.tauxEndettement <= 0.4
          ? "bg-orange-500"
          : "bg-red-500";

  // Badge de verdict
  const badgeVariant =
    analyse.verdict === "financable"
      ? "default"
      : analyse.verdict === "tendu"
        ? "secondary"
        : "destructive";

  const badgeLabel =
    analyse.verdict === "financable"
      ? "Finançable"
      : analyse.verdict === "tendu"
        ? "Dossier tendu"
        : "Difficile";

  return (
    <>
      <Card className="border-dashed border-amber-500/50 bg-gradient-to-br from-amber-950/20 to-background">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-amber-500">💰</span>
              Analyse de votre financement
            </CardTitle>
            <Badge variant={badgeVariant}>{badgeLabel}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mensualité et endettement */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Mensualité estimée</p>
              <p className="text-2xl font-bold font-mono">
                {analyse.mensualiteEstimee.toLocaleString("fr-FR")} €
                <span className="text-sm font-normal text-muted-foreground">/mois</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taux d'endettement</p>
              <p className={`text-2xl font-bold font-mono ${couleurEndettement}`}>
                {analyse.tauxEndettementPourcent.toFixed(1)} %
              </p>
            </div>
          </div>

          {/* Jauge d'endettement */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="text-yellow-500">33%</span>
              <span className="text-red-500">35% HCSF</span>
              <span>50%</span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
              {/* Seuil 33% */}
              <div
                className="absolute top-0 bottom-0 w-px bg-yellow-500/50"
                style={{ left: "66%" }}
              />
              {/* Seuil 35% HCSF */}
              <div
                className="absolute top-0 bottom-0 w-px bg-red-500/50"
                style={{ left: "70%" }}
              />
              {/* Jauge */}
              <div
                className={`h-full transition-all duration-500 ${couleurJauge}`}
                style={{ width: `${largeurJauge}%` }}
              />
            </div>
          </div>

          {/* Verdict */}
          <p className="text-sm text-muted-foreground">{analyse.verdictMessage}</p>

          {/* Reste à vivre */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Reste à vivre mensuel</span>
            <span className="font-mono font-medium">
              {analyse.resteAVivre.toLocaleString("fr-FR")} €
            </span>
          </div>

          <Separator className="my-2" />

          {/* CTA */}
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              Obtenez votre taux personnalisé avec un courtier partenaire
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              size="lg"
            >
              Être rappelé par un courtier
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Gratuit et sans engagement • Réponse sous 48h
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de lead */}
      <LeadCourtierModal
        open={showModal}
        onOpenChange={setShowModal}
        simulationData={simulationData}
      />
    </>
  );
}
