"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { ArrowLeft, Download, Lock, Phone, Share2 } from "lucide-react";
// Lightweight components - static import
import {
  SyntheseCard,
  TableauAnnuel,
  EncartFinancement,
} from "@/components/simulateur/resultats";
import type {
  PatrimoineDataPoint,
  TableauAnnuelData,
  RegimeData,
} from "@/components/simulateur/resultats";
import { Skeleton } from "@/components/ui/skeleton";

// Heavy components (Recharts) - dynamic import for better performance
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orchestrerSimulation, JEANBRUN_NEUF } from "@/lib/calculs";
import type { SimulationCalculInput, ZoneFiscale, NiveauLoyerJeanbrun, TypeBien } from "@/lib/calculs";
import { analyserFinancement } from "@/lib/calculs/analyse-financement";
import type { AnalyseFinancement } from "@/types/lead-financement";

// ============================================================================
// Types
// ============================================================================

interface WizardState {
  step1: {
    situation?: string;
    parts?: number;
    revenuNet?: number;
    revenusFonciers?: number;
    objectif?: string;
  };
  step2: {
    typeBien?: string;
    villeId?: string;
    villeNom?: string;
    zoneFiscale?: string;
    surface?: number;
    prixAcquisition?: number;
    montantTravaux?: number;
    dpeActuel?: string;
    dpeApres?: string;
  };
  step3: {
    apport?: number;
    dureeCredit?: number;
    tauxCredit?: number;
    differe?: number;
    autresCredits?: number;
  };
  step4: {
    niveauLoyer?: string;
    loyerMensuel?: number;
    chargesAnnuelles?: number;
    taxeFonciere?: number;
    vacance?: number;
  };
  step5: {
    dureeDetention?: number;
    revalorisation?: number;
    strategieSortie?: string;
  };
  step6: {
    structure?: string;
  };
}

interface SimulationResults {
  synthese: {
    economieFiscale: number;
    cashFlowMensuel: number;
    rendementNet: number;
    effortEpargne: number;
  };
  graphiqueData: PatrimoineDataPoint[];
  tableauAnnuel: TableauAnnuelData[];
  comparatifLMNP: {
    jeanbrun: RegimeData;
    lmnp: RegimeData;
  };
  financement: AnalyseFinancement;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "simulation-wizard-state";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate total project price (acquisition + travaux for ancien)
 */
function calculatePrixTotal(step2: WizardState['step2']): number {
  return step2.typeBien === "ancien" && step2.montantTravaux
    ? step2.prixAcquisition! + step2.montantTravaux
    : step2.prixAcquisition!;
}

function loadWizardState(): WizardState | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as unknown;
      if (parsed && typeof parsed === "object") {
        return parsed as WizardState;
      }
    }
  } catch {
    // Invalid JSON
  }
  return null;
}

function isValidWizardState(state: WizardState | null): state is WizardState {
  if (!state) return false;

  const { step1, step2, step3, step4, step5, step6 } = state;

  return Boolean(
    step1?.revenuNet &&
    step1?.parts &&
    step2?.prixAcquisition &&
    step2?.surface &&
    step2?.zoneFiscale &&
    step3?.dureeCredit &&
    step3?.tauxCredit !== undefined &&
    step4?.loyerMensuel &&
    step4?.niveauLoyer &&
    step5?.dureeDetention &&
    step6?.structure
  );
}

function calculateResults(state: WizardState): SimulationResults | null {
  try {
    const { step1, step2, step3, step4, step5 } = state;

    // Build orchestrator input
    const input: SimulationCalculInput = {
      revenuNetImposable: step1.revenuNet!,
      nombreParts: step1.parts!,
      typeBien: (step2.typeBien ?? "neuf") as TypeBien,
      prixAcquisition: step2.prixAcquisition!,
      surface: step2.surface!,
      zoneFiscale: step2.zoneFiscale as ZoneFiscale,
      niveauLoyer: step4.niveauLoyer as NiveauLoyerJeanbrun,
      apportPersonnel: step3.apport ?? 0,
      tauxCredit: (step3.tauxCredit ?? 3.5) / 100,
      dureeCredit: step3.dureeCredit!,
      tauxAssurance: 0.0036,
      chargesCopropriete: step4.chargesAnnuelles ?? 0,
      taxeFonciere: step4.taxeFonciere ?? 0,
      comparerLMNP: true,
      calculerPlusValue: step5.strategieSortie === "revente",
    };

    // Add optional fields only if they have values
    if (step4.loyerMensuel !== undefined) {
      input.loyerMensuelEstime = step4.loyerMensuel;
    }
    if (step5.dureeDetention !== undefined) {
      input.dureeDetentionPrevue = step5.dureeDetention;
    }

    // Add travaux for ancien
    if (step2.typeBien === "ancien" && step2.montantTravaux) {
      input.montantTravaux = step2.montantTravaux;
    }

    // Estimate resale price
    if (step5.strategieSortie === "revente" && step5.dureeDetention) {
      const revalorisation = 1 + (step5.revalorisation ?? 2) / 100;
      const prixTotal = calculatePrixTotal(step2);
      input.prixReventeEstime = Math.round(
        prixTotal * Math.pow(revalorisation, step5.dureeDetention)
      );
    }

    // Run orchestrator
    const calcResult = orchestrerSimulation(input);

    // Check eligibility
    if (
      calcResult.jeanbrun &&
      "eligible" in calcResult.jeanbrun &&
      !calcResult.jeanbrun.eligible
    ) {
      return null;
    }

    // Calculate financing
    const revenuMensuel = step1.revenuNet! / 12;
    const montantProjet = calculatePrixTotal(step2);

    const financement = analyserFinancement({
      revenuMensuel,
      chargesActuelles: step3.autresCredits ?? 0,
      montantProjet,
      apport: step3.apport ?? 0,
      dureeEmpruntMois: step3.dureeCredit! * 12,
      tauxAnnuel: (step3.tauxCredit ?? 3.5) / 100,
    });

    // Generate graphique data
    const dureeAns = step5.dureeDetention!;
    const revalorisation = 1 + (step5.revalorisation ?? 2) / 100;
    const prixInitial = calculatePrixTotal(step2);
    const economieAnnuelle = calcResult.economieImpot.economieTotaleAnnuelle;
    const montantEmprunt = prixInitial - (step3.apport ?? 0);
    const capitalRembourseAnnuel = montantEmprunt / step3.dureeCredit!;

    const graphiqueData: PatrimoineDataPoint[] = [];
    for (let annee = 0; annee <= dureeAns; annee++) {
      graphiqueData.push({
        annee,
        valeurBien: Math.round(prixInitial * Math.pow(revalorisation, annee)),
        capitalRembourse: annee === 0 ? 0 : Math.round(capitalRembourseAnnuel * annee),
        economiesFiscales:
          annee === 0 ? 0 : Math.round(economieAnnuelle * Math.min(annee, 9)),
      });
    }

    // Generate tableau annuel
    const currentYear = new Date().getFullYear();
    const loyerAnnuel = step4.loyerMensuel! * 12;
    const chargesAnnuelles = (step4.chargesAnnuelles ?? 0) + (step4.taxeFonciere ?? 0);
    const amortissementAnnuel =
      "amortissementNet" in calcResult.jeanbrun && calcResult.jeanbrun.amortissementNet
        ? calcResult.jeanbrun.amortissementNet
        : 0;
    const mensualite = calcResult.credit?.mensualiteAvecAssurance ?? 0;
    const interetsAnnuels = calcResult.credit?.totalInterets
      ? (calcResult.credit.totalInterets / (step3.dureeCredit! * 12)) * 12
      : 0;

    const tableauAnnuel: TableauAnnuelData[] = [];
    for (let i = 0; i < dureeAns; i++) {
      const annee = currentYear + i;
      const inEngagementPeriod = i < JEANBRUN_NEUF.dureeEngagement;
      const reductionIR = inEngagementPeriod
        ? Math.round(amortissementAnnuel * calcResult.tmi.tmi)
        : 0;
      const valeurBien = Math.round(prixInitial * Math.pow(revalorisation, i + 1));
      const cashFlow = loyerAnnuel - chargesAnnuelles - mensualite * 12 + reductionIR;

      tableauAnnuel.push({
        annee,
        loyers: Math.round(loyerAnnuel),
        charges: Math.round(chargesAnnuelles),
        interets: Math.round(interetsAnnuels),
        amortissement: inEngagementPeriod ? Math.round(amortissementAnnuel) : 0,
        reductionIR,
        cashFlow: Math.round(cashFlow),
        patrimoine: valeurBien,
      });
    }

    // Generate LMNP comparison
    const recettesApresAbattement = loyerAnnuel * 0.5;
    const impotLMNP = recettesApresAbattement * calcResult.tmi.tmi;
    const economieLMNP =
      (loyerAnnuel - recettesApresAbattement) * calcResult.tmi.tmi * 9;

    const chargesMensuelles = chargesAnnuelles / 12;
    const effortJeanbrun =
      mensualite +
      chargesMensuelles -
      step4.loyerMensuel! -
      economieAnnuelle / 12;
    const effortLMNP =
      mensualite + chargesMensuelles - step4.loyerMensuel! + impotLMNP / 12;

    const comparatifLMNP: { jeanbrun: RegimeData; lmnp: RegimeData } = {
      jeanbrun: {
        reductionImpot: Math.round(calcResult.economieImpot.economieTotale9ans),
        cashFlowMoyen: calcResult.cashflowMensuel,
        effortEpargne: Math.round(effortJeanbrun),
        rendementNet: Math.round(calcResult.rendements.rendementNet * 100) / 100,
        fiscaliteRevente:
          step5.dureeDetention! >= 22
            ? "Exoneration totale IR"
            : `Abattement ${Math.min(6 * (step5.dureeDetention! - 5), 100)}%`,
        complexite: "Moyenne",
      },
      lmnp: {
        reductionImpot: Math.round(economieLMNP),
        cashFlowMoyen: Math.round(
          calcResult.cashflowMensuel - economieAnnuelle / 12 + impotLMNP / 12
        ),
        effortEpargne: Math.round(effortLMNP),
        rendementNet: Math.round((calcResult.rendements.rendementNet - 0.5) * 100) / 100,
        fiscaliteRevente: "Amortissements reintegres",
        complexite: "Elevee",
      },
    };

    // Build synthese
    const synthese = {
      economieFiscale: calcResult.economieImpot.economieTotale9ans,
      cashFlowMensuel: calcResult.cashflowMensuel,
      rendementNet: calcResult.rendements.rendementNet,
      effortEpargne: Math.round(effortJeanbrun),
    };

    return {
      synthese,
      graphiqueData,
      tableauAnnuel,
      comparatifLMNP,
      financement,
    };
  } catch (error) {
    // Log only in development to avoid noise in production
    if (process.env.NODE_ENV === "development") {
      console.error("Error calculating results:", error);
    }
    return null;
  }
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function ResultatLoadingSkeleton() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Synthese */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>

      {/* Graphique */}
      <Skeleton className="h-[400px] w-full" />

      {/* Financement */}
      <Skeleton className="h-64 w-full" />

      {/* Premium sections */}
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface ResultatPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultatPage(_props: ResultatPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [wizardState, setWizardState] = useState<WizardState | null>(null);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isPremium] = useState(false); // TODO: Check user subscription
  const [, setShowPremiumModal] = useState(false);
  const hasInitialized = useRef(false);
  const [isPending, startTransition] = useTransition();

  // Load wizard state from localStorage
  useEffect(() => {
    // Avoid re-initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const state = loadWizardState();
    setWizardState(state);

    if (isValidWizardState(state)) {
      // Use startTransition for non-blocking calculation
      startTransition(() => {
        const calculatedResults = calculateResults(state);
        setResults(calculatedResults);
      });
    }

    setIsLoading(false);
  }, []);

  // Redirect if no valid data
  useEffect(() => {
    if (!isLoading && !isValidWizardState(wizardState)) {
      router.push("/simulateur/avance");
    }
  }, [isLoading, wizardState, router]);

  // Handle premium unlock
  const handleUnlock = () => {
    // TODO: Implement Stripe checkout
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
    // TODO: Open Calendly or contact form
    toast.info("Demande de rappel", {
      description: "Formulaire Calendly a venir",
    });
  };

  // Loading state (including calculation pending)
  if (isLoading || isPending) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            onClick={() => router.push("/simulateur/avance/etape-6")}
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
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

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
            montantProjet:
              wizardState?.step2?.typeBien === "ancien" && wizardState?.step2?.montantTravaux
                ? (wizardState?.step2?.prixAcquisition ?? 0) + wizardState?.step2?.montantTravaux
                : wizardState?.step2?.prixAcquisition ?? 0,
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
          onUnlock={handleUnlock}
        />

        {/* Comparatif LMNP */}
        <ComparatifLMNP
          jeanbrun={results.comparatifLMNP.jeanbrun}
          lmnp={results.comparatifLMNP.lmnp}
          isPremium={isPremium}
          onUnlock={handleUnlock}
        />
      </div>

      {/* CTA Section */}
      <Separator className="my-8" />

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
              onClick={handleUnlock}
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
              onClick={handleCallbackRequest}
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

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center mt-8 space-y-1">
        <p>
          * Les resultats presentes sont des estimations basees sur les informations fournies.
        </p>
        <p>
          Ils ne constituent pas un conseil fiscal ou juridique. Consultez un professionnel pour votre situation specifique.
        </p>
      </div>
    </div>
  );
}
