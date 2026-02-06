/**
 * Client component principal pour la page resultats
 * URL canonique : /resultats/[id]
 *
 * Architecture Phase 4 :
 * 1. Section TEASER gratuit (visible immediatement) : synthese KPIs + graphique + comparatif rapide
 * 2. Section Direct Promoteur (avantage client)
 * 3. Lead Gate inline (formulaire capture lead)
 * 4. Section detaillee (visible apres soumission lead OU directement pour preview)
 *
 * @module resultats/resultat-client
 */

"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { ArrowLeft, Share2, Lock, Eye } from "lucide-react";

import {
  SyntheseCard,
  TableauAnnuel,
  EncartFinancement,
  DirectPromoteurBanner,
  LeadGateForm,
} from "@/components/simulateur/resultats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
  const params = useParams<{ id: string }>();
  const simulationId = params.id;
  const [wizardState] = useState<WizardState | null>(() => loadWizardState());
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`lead_submitted_${simulationId}`) === "true";
  });
  const hasInitialized = useRef(false);
  const [isPending, startTransition] = useTransition();
  const detailSectionRef = useRef<HTMLDivElement>(null);

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

  // Handle lead gate success
  const handleLeadSubmitSuccess = useCallback(() => {
    setLeadSubmitted(true);
    try {
      localStorage.setItem(`lead_submitted_${simulationId}`, "true");
    } catch {
      // localStorage may be full or disabled
    }
    toast.success("Votre rapport detaille vous sera envoye par email !");

    // Scroll to detailed section after a short delay
    setTimeout(() => {
      detailSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, []);

  // Build simulation data payload for the lead
  const buildSimulationPayload = (): Record<string, unknown> => {
    if (!wizardState || !results) return {};
    return {
      // Wizard inputs
      revenuNet: wizardState.step1?.revenuNet,
      parts: wizardState.step1?.parts,
      prixAcquisition: wizardState.step2?.prixAcquisition,
      surface: wizardState.step2?.surface,
      zoneFiscale: wizardState.step2?.zoneFiscale,
      typeBien: wizardState.step2?.typeBien,
      villeNom: wizardState.step2?.villeNom,
      apport: wizardState.step3?.apport,
      dureeCredit: wizardState.step3?.dureeCredit,
      tauxCredit: wizardState.step3?.tauxCredit,
      loyerMensuel: wizardState.step4?.loyerMensuel,
      dureeDetention: wizardState.step5?.dureeDetention,
      structure: wizardState.step6?.structure,
      // Calculated results
      economieFiscale: results.synthese.economieFiscale,
      cashFlowMensuel: results.synthese.cashFlowMensuel,
      rendementNet: results.synthese.rendementNet,
      effortEpargne: results.synthese.effortEpargne,
      montantEmprunt: results.financement.montantEmprunt,
      mensualiteEstimee: results.financement.mensualiteEstimee,
      tauxEndettement: results.financement.tauxEndettement,
      resteAVivre: results.financement.resteAVivre,
      verdict: results.financement.verdict,
      // Meta
      montantInvestissement: calculatePrixTotal(wizardState.step2 ?? {}),
      revenuMensuel: (wizardState.step1?.revenuNet ?? 0) / 12,
    };
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
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <ResultatHeader
        wizardState={wizardState}
        onBack={() => router.push("/simulateur/avance/etape-6")}
        onShare={handleShare}
      />

      {/* ================================================================== */}
      {/* SECTION 1 : TEASER GRATUIT */}
      {/* ================================================================== */}
      <section aria-label="Apercu des resultats">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Apercu de vos resultats</h2>
          <Badge variant="secondary" className="text-xs">Gratuit</Badge>
        </div>

        {/* 4 KPIs */}
        <SyntheseCard
          economieFiscale={results.synthese.economieFiscale}
          cashFlowMensuel={results.synthese.cashFlowMensuel}
          rendementNet={results.synthese.rendementNet}
          effortEpargne={results.synthese.effortEpargne}
        />
      </section>

      {/* Graphique Patrimoine */}
      <section aria-label="Evolution du patrimoine">
        <GraphiquePatrimoine data={results.graphiqueData} />
      </section>

      {/* Encart Financement */}
      <section aria-label="Analyse de financement">
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

      {/* ================================================================== */}
      {/* SECTION 2 : AVANTAGE DIRECT PROMOTEUR */}
      {/* ================================================================== */}
      <section aria-label="Avantages direct promoteur">
        <DirectPromoteurBanner />
      </section>

      {/* ================================================================== */}
      {/* SECTION 3 : LEAD GATE (si pas encore soumis) */}
      {/* ================================================================== */}
      {!leadSubmitted && (
        <section aria-label="Recevoir le rapport complet">
          <LeadGateForm
            simulationData={buildSimulationPayload()}
            onSubmitSuccess={handleLeadSubmitSuccess}
          />
        </section>
      )}

      {/* ================================================================== */}
      {/* SECTION 4 : ANALYSE DETAILLEE */}
      {/* ================================================================== */}
      <div ref={detailSectionRef}>
        {leadSubmitted ? (
          <section aria-label="Analyse detaillee" className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Analyse detaillee</h2>
              <Badge className="bg-emerald-500 text-emerald-950">Debloque</Badge>
            </div>

            {/* Tableau Annuel */}
            <TableauAnnuel data={results.tableauAnnuel} />

            {/* Comparatif LMNP */}
            <ComparatifLMNP
              jeanbrun={results.comparatifLMNP.jeanbrun}
              lmnp={results.comparatifLMNP.lmnp}
            />
          </section>
        ) : (
          <LockedDetailSection />
        )}
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

function LockedDetailSection() {
  return (
    <section aria-label="Contenu verrouille" className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Analyse detaillee
        </h2>
        <Lock className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Blurred preview */}
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none opacity-40 space-y-4">
          <Card className="h-64 w-full" />
          <Card className="h-48 w-full" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2 p-6 bg-background/80 rounded-lg border shadow-lg max-w-sm">
            <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="font-semibold text-sm">
              Remplissez le formulaire ci-dessus pour debloquer l'analyse
              detaillee
            </p>
            <p className="text-xs text-muted-foreground">
              Tableau annee par annee, comparatif LMNP, et rapport PDF complet
            </p>
          </div>
        </div>
      </div>
    </section>
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
