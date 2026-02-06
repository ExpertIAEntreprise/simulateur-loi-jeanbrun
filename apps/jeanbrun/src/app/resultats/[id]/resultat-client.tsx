/**
 * Client component principal pour la page resultats
 * URL canonique : /resultats/[id]
 * @module resultats/resultat-client
 */

"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { ArrowLeft, Share2 } from "lucide-react";

import {
  SyntheseCard,
  TableauAnnuel,
  EncartFinancement,
} from "@/components/simulateur/resultats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import type { WizardState, SimulationResults } from "@/lib/simulation-results/types";
import { loadWizardState } from "@/lib/simulation-results/load-wizard-state";
import { isValidWizardState } from "@/lib/simulation-results/validate-state";
import { calculateResults, calculatePrixTotal } from "@/lib/simulation-results/calculate-results";
import { ResultatLoadingSkeleton } from "./loading-skeleton";

// Dynamic imports for heavy Recharts components
const GraphiquePatrimoine = dynamic(
  () =>
    import("@/components/simulateur/resultats/GraphiquePatrimoine").then(
      (mod) => mod.GraphiquePatrimoine
    ),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-[400px] w-full rounded-lg bg-zinc-800/50" />
    ),
  }
);

const ComparatifLMNP = dynamic(
  () =>
    import("@/components/simulateur/resultats/ComparatifLMNP").then(
      (mod) => mod.ComparatifLMNP
    ),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-96 w-full rounded-lg bg-zinc-800/50" />
    ),
  }
);

// ============================================================================
// Main Component
// ============================================================================

export function ResultatClient() {
  const router = useRouter();
  const [wizardState] = useState<WizardState | null>(() => loadWizardState());
  const [results, setResults] = useState<SimulationResults | null>(null);
  const hasInitialized = useRef(false);
  const [isPending, startTransition] = useTransition();

  // Calculate results on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (isValidWizardState(wizardState)) {
      startTransition(() => {
        const calculatedResults = calculateResults(wizardState);
        setResults(calculatedResults);
      });
    }
  }, [wizardState]);

  // Redirect if no valid data
  useEffect(() => {
    if (!isValidWizardState(wizardState)) {
      router.push("/simulateur/avance");
    }
  }, [wizardState, router]);

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Ma simulation Loi Jeanbrun",
        text: "Decouvrez les avantages fiscaux de la loi Jeanbrun pour votre investissement immobilier",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copie dans le presse-papiers !");
    }
  };

  // Loading state
  if (isPending) {
    return <ResultatLoadingSkeleton />;
  }

  // No results
  if (!results) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-lg text-destructive mb-4">
              Impossible de calculer les resultats de votre simulation.
            </p>
            <Button onClick={() => router.push("/simulateur/avance")}>
              Recommencer la simulation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <ResultatHeader
        wizardState={wizardState}
        onBack={() => router.push("/simulateur/avance/etape-6")}
        onShare={handleShare}
      />

      {/* Synthese - 4 KPIs */}
      <section>
        <SyntheseCard
          economieFiscale={results.synthese.economieFiscale}
          cashFlowMensuel={results.synthese.cashFlowMensuel}
          rendementNet={results.synthese.rendementNet}
          effortEpargne={results.synthese.effortEpargne}
        />
      </section>

      {/* Graphique Patrimoine */}
      <section>
        <GraphiquePatrimoine data={results.graphiqueData} />
      </section>

      {/* Encart Financement */}
      <section>
        <EncartFinancement
          analyse={results.financement}
          simulationData={{
            revenuMensuel: (wizardState?.step1?.revenuNet ?? 0) / 12,
            montantProjet: calculatePrixTotal(wizardState?.step2 ?? {}),
            apport: wizardState?.step3?.apport ?? 0,
            montantEmprunt: results.financement.montantEmprunt,
            dureeEmpruntMois: (wizardState?.step3?.dureeCredit ?? 20) * 12,
            tauxEndettement: results.financement.tauxEndettement,
            mensualiteEstimee: results.financement.mensualiteEstimee,
            ...(wizardState?.step2?.villeNom !== undefined && { villeProjet: wizardState.step2.villeNom }),
            ...(wizardState?.step2?.typeBien !== undefined && { typeBien: wizardState.step2.typeBien as "neuf" | "ancien" }),
          }}
        />
      </section>

      <Separator className="my-8" />

      {/* Analyse detaillee */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Analyse detaillee</h2>

        {/* Tableau Annuel */}
        <TableauAnnuel data={results.tableauAnnuel} />

        {/* Comparatif LMNP */}
        <ComparatifLMNP
          jeanbrun={results.comparatifLMNP.jeanbrun}
          lmnp={results.comparatifLMNP.lmnp}
        />
      </div>

      {/* Disclaimer */}
      <Separator className="my-8" />
      <Disclaimer />
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface ResultatHeaderProps {
  wizardState: WizardState | null;
  onBack: () => void;
  onShare: () => void;
}

function ResultatHeader({ wizardState, onBack, onShare }: ResultatHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Modifier ma simulation
        </Button>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">
          Vos resultats de simulation
        </h1>
        <p className="text-muted-foreground mt-1">
          {wizardState?.step6?.structure === "sci_ir"
            ? "En SCI a l'IR"
            : wizardState?.step6?.structure === "sci_is"
              ? "En SCI a l'IS"
              : "En nom propre"}{" "}
          - Dispositif Loi Jeanbrun
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </div>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="text-xs text-muted-foreground text-center mt-8 space-y-1">
      <p>
        * Les resultats presentes sont des estimations basees sur les informations fournies.
      </p>
      <p>
        Ils ne constituent pas un conseil fiscal ou juridique. Consultez un professionnel pour votre situation specifique.
      </p>
    </div>
  );
}
