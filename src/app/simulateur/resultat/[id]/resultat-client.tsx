/**
 * Client component principal pour la page resultats
 * @module simulateur/resultat/resultat-client
 */

"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { ArrowLeft, Download, Lock, Phone, Share2 } from "lucide-react";

// Static imports for lightweight components
import {
  SyntheseCard,
  TableauAnnuel,
  EncartFinancement,
} from "@/components/simulateur/resultats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Local imports
import type { WizardState, SimulationResults } from "./types";
import { loadWizardState } from "./helpers/load-wizard-state";
import { isValidWizardState } from "./helpers/validate-state";
import { calculateResults, calculatePrixTotal } from "./helpers/calculate-results";
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
  // Lazy initialization from localStorage (runs once on mount)
  const [wizardState] = useState<WizardState | null>(() => loadWizardState());
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isPremium] = useState(false); // TODO: Check user subscription
  const [, setShowPremiumModal] = useState(false);
  const hasInitialized = useRef(false);
  const [isPending, startTransition] = useTransition();

  // Calculate results on mount (separate from state initialization)
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

  // Handle premium unlock
  const handleUnlock = () => {
    setShowPremiumModal(true);
    toast.info("Fonctionnalite premium", {
      description: "Paiement Stripe a venir (9,90 EUR)",
    });
  };

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

  // Handle export (placeholder)
  const handleExport = () => {
    toast.info("Export PDF", {
      description: "Fonctionnalite premium a venir",
    });
  };

  // Handle callback request
  const handleCallbackRequest = () => {
    toast.info("Demande de rappel", {
      description: "Formulaire Calendly a venir",
    });
  };

  // Loading state (during calculation)
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
        onExport={handleExport}
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

      {/* Premium Sections */}
      <PremiumSections
        results={results}
        isPremium={isPremium}
        onUnlock={handleUnlock}
      />

      {/* CTA Section */}
      <Separator className="my-8" />

      <CTASection
        onUnlock={handleUnlock}
        onCallbackRequest={handleCallbackRequest}
      />

      {/* Disclaimer */}
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
  onExport: () => void;
}

function ResultatHeader({ wizardState, onBack, onShare, onExport }: ResultatHeaderProps) {
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
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}

interface PremiumSectionsProps {
  results: SimulationResults;
  isPremium: boolean;
  onUnlock: () => void;
}

function PremiumSections({ results, isPremium, onUnlock }: PremiumSectionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analyse detaillee</h2>
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
        >
          Premium
        </Badge>
      </div>

      {/* Tableau Annuel */}
      <TableauAnnuel
        data={results.tableauAnnuel}
        isPremium={isPremium}
        onUnlock={onUnlock}
      />

      {/* Comparatif LMNP */}
      <ComparatifLMNP
        jeanbrun={results.comparatifLMNP.jeanbrun}
        lmnp={results.comparatifLMNP.lmnp}
        isPremium={isPremium}
        onUnlock={onUnlock}
      />
    </div>
  );
}

interface CTASectionProps {
  onUnlock: () => void;
  onCallbackRequest: () => void;
}

function CTASection({ onUnlock, onCallbackRequest }: CTASectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* CTA Premium */}
      <Card className="border-accent bg-gradient-to-br from-accent/10 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-accent" />
            Debloquer l&apos;analyse complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-accent">&#x2713;</span>
              Tableau detaille annee par annee
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">&#x2713;</span>
              Comparatif complet Jeanbrun vs LMNP
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">&#x2713;</span>
              Export PDF professionnel
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">&#x2713;</span>
              Simulation illimitee pendant 30 jours
            </li>
          </ul>
          <Button
            onClick={onUnlock}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
          >
            Debloquer pour 9,90 EUR
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Paiement securise par Stripe - Satisfait ou rembourse
          </p>
        </CardContent>
      </Card>

      {/* CTA Conseiller */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-primary" />
            Etre rappele par un conseiller
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Un conseiller specialise en investissement locatif vous accompagne pour :
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">&#x2713;</span>
              Valider votre projet d&apos;investissement
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">&#x2713;</span>
              Trouver le bien ideal
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">&#x2713;</span>
              Optimiser votre financement
            </li>
          </ul>
          <Button
            onClick={onCallbackRequest}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10"
            size="lg"
          >
            Demander un rappel gratuit
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Reponse sous 24h - Sans engagement
          </p>
        </CardContent>
      </Card>
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
