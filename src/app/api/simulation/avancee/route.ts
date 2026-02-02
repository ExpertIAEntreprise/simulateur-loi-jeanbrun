/**
 * API Route pour la simulation avancee Jeanbrun (6 etapes)
 *
 * Endpoint POST: Recoit les donnees des 6 etapes du wizard et calcule les resultats
 *
 * @version 1.0
 * @date 2 fevrier 2026
 *
 * @security Rate limited to 10 requests/minute per IP
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  orchestrerSimulation,
  JEANBRUN_NEUF,
  type SimulationCalculInput,
  type ZoneFiscale,
  type NiveauLoyerJeanbrun,
  type TypeBien,
} from "@/lib/calculs";
import { analyserFinancement } from "@/lib/calculs/analyse-financement";
import { simulationLogger } from "@/lib/logger";
import {
  simulationRateLimiter,
  checkRateLimit,
  getClientIP,
} from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================================
// Zod Schemas for Wizard Steps
// ============================================================================

const Step1Schema = z.object({
  situation: z.enum(["celibataire", "marie", "pacse"]),
  parts: z.number().min(1).max(10),
  revenuNet: z.number().positive(),
  revenusFonciers: z.number().optional(),
  objectif: z.enum(["reduire_impots", "revenus", "patrimoine", "retraite"]),
});

const Step2Schema = z.object({
  typeBien: z.enum(["neuf", "ancien"]),
  ville: z.string().min(1),
  zoneFiscale: z.enum(["A_BIS", "A", "B1", "B2", "C"]),
  surface: z.number().min(9).max(500),
  prixAcquisition: z.number().positive(),
  montantTravaux: z.number().optional(),
  dpeActuel: z.enum(["A", "B", "C", "D", "E", "F", "G"]).optional(),
  dpeApres: z.enum(["A", "B"]).optional(),
});

const Step3Schema = z.object({
  apport: z.number().min(0),
  dureeCredit: z.number().min(10).max(25),
  tauxInteret: z.number().min(0.5).max(10),
  differeMois: z.number().optional(),
  autresCredits: z.number().optional(),
});

const Step4Schema = z.object({
  niveauLoyer: z.enum(["intermediaire", "social", "tres_social"]),
  loyerMensuel: z.number().positive(),
  chargesAnnuelles: z.number().min(0),
  taxeFonciere: z.number().min(0),
  vacanceMois: z.number().min(0).max(12),
});

const Step5Schema = z.object({
  dureeDetention: z.number().min(9).max(30),
  revalorisation: z.number().min(0).max(5),
  strategieSortie: z.enum(["revente", "conservation", "donation"]),
});

const Step6Schema = z.object({
  structure: z.enum(["nom_propre", "sci_ir", "sci_is"]),
});

const SimulationInputSchema = z.object({
  step1: Step1Schema,
  step2: Step2Schema,
  step3: Step3Schema,
  step4: Step4Schema,
  step5: Step5Schema,
  step6: Step6Schema,
});

export type SimulationInput = z.infer<typeof SimulationInputSchema>;

// ============================================================================
// Response Types
// ============================================================================

export interface SimulationSynthese {
  economieFiscale: number;
  cashFlowMensuel: number;
  rendementNet: number;
  effortEpargne: number;
}

export interface GraphiqueDataPoint {
  annee: number;
  valeurBien: number;
  capitalRembourse: number;
  economiesFiscales: number;
}

export interface TableauAnnuelRow {
  annee: number;
  loyers: number;
  charges: number;
  interets: number;
  amortissement: number;
  reductionIR: number;
  cashFlow: number;
  patrimoine: number;
}

export interface RegimeComparatif {
  reductionImpot: number;
  cashFlowMoyen: number;
  effortEpargne: number;
  rendementNet: number;
  fiscaliteRevente: string;
  complexite: "Faible" | "Moyenne" | "Elevee";
}

export interface SimulationResponse {
  id: string;
  synthese: SimulationSynthese;
  graphiqueData: GraphiqueDataPoint[];
  tableauAnnuel: TableauAnnuelRow[];
  comparatifLMNP: {
    jeanbrun: RegimeComparatif;
    lmnp: RegimeComparatif;
  };
  financement: {
    montantEmprunt: number;
    mensualiteEstimee: number;
    tauxEndettement: number;
    tauxEndettementPourcent: number;
    respecteHCSF: boolean;
    dossierConfortable: boolean;
    resteAVivre: number;
    verdict: "financable" | "tendu" | "difficile";
    verdictMessage: string;
  };
}

// ============================================================================
// Helper Functions
// ============================================================================



/**
 * Transform wizard input to orchestrator input
 */
function transformToOrchestatorInput(input: SimulationInput): SimulationCalculInput {
  const { step1, step2, step3, step4, step5 } = input;

  const result: SimulationCalculInput = {
    revenuNetImposable: step1.revenuNet,
    nombreParts: step1.parts,
    typeBien: step2.typeBien as TypeBien,
    prixAcquisition: step2.prixAcquisition,
    surface: step2.surface,
    zoneFiscale: step2.zoneFiscale as ZoneFiscale,
    niveauLoyer: step4.niveauLoyer as NiveauLoyerJeanbrun,
    apportPersonnel: step3.apport,
    tauxCredit: step3.tauxInteret / 100, // Convert % to decimal
    dureeCredit: step3.dureeCredit,
    tauxAssurance: 0.0036, // Default 0.36%
    loyerMensuelEstime: step4.loyerMensuel,
    chargesCopropriete: step4.chargesAnnuelles,
    taxeFonciere: step4.taxeFonciere,
    comparerLMNP: true,
    calculerPlusValue: step5.strategieSortie === "revente",
    dureeDetentionPrevue: step5.dureeDetention,
  };

  // Add optional fields
  if (step2.typeBien === "ancien" && step2.montantTravaux !== undefined) {
    result.montantTravaux = step2.montantTravaux;
  }

  // Estimate resale price based on revalorisation
  if (step5.strategieSortie === "revente") {
    const revalorisation = 1 + step5.revalorisation / 100;
    const prixTotal =
      step2.typeBien === "ancien" && step2.montantTravaux
        ? step2.prixAcquisition + step2.montantTravaux
        : step2.prixAcquisition;
    result.prixReventeEstime = Math.round(
      prixTotal * Math.pow(revalorisation, step5.dureeDetention)
    );
  }

  return result;
}

/**
 * Generate graphique data for patrimoine evolution
 */
function generateGraphiqueData(
  input: SimulationInput,
  dureeAns: number,
  economieAnnuelle: number,
  capitalRembourseAnnuel: number
): GraphiqueDataPoint[] {
  const { step2, step5 } = input;
  const revalorisation = 1 + step5.revalorisation / 100;
  const prixInitial =
    step2.typeBien === "ancien" && step2.montantTravaux
      ? step2.prixAcquisition + step2.montantTravaux
      : step2.prixAcquisition;

  const data: GraphiqueDataPoint[] = [];

  for (let annee = 0; annee <= dureeAns; annee++) {
    data.push({
      annee,
      valeurBien: Math.round(prixInitial * Math.pow(revalorisation, annee)),
      capitalRembourse: annee === 0 ? 0 : Math.round(capitalRembourseAnnuel * annee),
      economiesFiscales: annee === 0 ? 0 : Math.round(economieAnnuelle * Math.min(annee, 9)),
    });
  }

  return data;
}

/**
 * Generate tableau annuel data
 */
function generateTableauAnnuel(
  input: SimulationInput,
  calculResult: ReturnType<typeof orchestrerSimulation>,
  dureeAns: number
): TableauAnnuelRow[] {
  const { step2, step4, step5 } = input;
  const revalorisation = 1 + step5.revalorisation / 100;
  const prixInitial =
    step2.typeBien === "ancien" && step2.montantTravaux
      ? step2.prixAcquisition + step2.montantTravaux
      : step2.prixAcquisition;

  const loyerAnnuel = step4.loyerMensuel * 12;
  const chargesAnnuelles = step4.chargesAnnuelles + step4.taxeFonciere;
  const amortissementAnnuel =
    "amortissementNet" in calculResult.jeanbrun && calculResult.jeanbrun.amortissementNet
      ? calculResult.jeanbrun.amortissementNet
      : 0;

  // Get credit info
  const mensualite = calculResult.credit?.mensualiteAvecAssurance ?? 0;
  const interetsAnnuels = calculResult.credit?.totalInterets
    ? calculResult.credit.totalInterets / (calculResult.credit.tableau?.length ?? 1) * 12
    : 0;

  const currentYear = new Date().getFullYear();
  const tableauData: TableauAnnuelRow[] = [];

  let cumulCapital = 0;
  let cumulEconomie = 0;

  for (let i = 0; i < dureeAns; i++) {
    const annee = currentYear + i;
    const inEngagementPeriod = i < JEANBRUN_NEUF.dureeEngagement;

    // Calculate reduction IR (only during engagement period)
    const reductionIR = inEngagementPeriod
      ? Math.round(amortissementAnnuel * calculResult.tmi.tmi)
      : 0;

    cumulEconomie += reductionIR;

    // Simple capital remboursement estimation (linear for MVP)
    const capitalAnnuel = mensualite > 0
      ? (prixInitial - input.step3.apport) / input.step3.dureeCredit
      : 0;
    cumulCapital += capitalAnnuel;

    // Calculate patrimoine (bien + capital rembourse + economies cumulees)
    const valeurBien = Math.round(prixInitial * Math.pow(revalorisation, i + 1));
    const patrimoine = valeurBien; // In MVP, just the property value

    // Cash-flow
    const cashFlow = loyerAnnuel - chargesAnnuelles - (mensualite * 12) + reductionIR;

    tableauData.push({
      annee,
      loyers: Math.round(loyerAnnuel),
      charges: Math.round(chargesAnnuelles),
      interets: Math.round(interetsAnnuels),
      amortissement: inEngagementPeriod ? Math.round(amortissementAnnuel) : 0,
      reductionIR,
      cashFlow: Math.round(cashFlow),
      patrimoine,
    });
  }

  return tableauData;
}

/**
 * Generate LMNP comparison data
 */
function generateComparatifLMNP(
  input: SimulationInput,
  calculResult: ReturnType<typeof orchestrerSimulation>
): { jeanbrun: RegimeComparatif; lmnp: RegimeComparatif } {
  const economieTotaleJeanbrun = calculResult.economieImpot.economieTotale9ans;
  const cashFlowMensuel = calculResult.cashflowMensuel;
  const rendementNet = calculResult.rendements.rendementNet;

  // Estimate LMNP benefits (simplified for MVP)
  const loyerAnnuel = input.step4.loyerMensuel * 12;

  // LMNP micro-BIC: 50% abattement forfaitaire
  const recettesApresAbattement = loyerAnnuel * 0.5;
  const impotLMNP = recettesApresAbattement * calculResult.tmi.tmi;
  const economieLMNP = (loyerAnnuel - recettesApresAbattement) * calculResult.tmi.tmi * 9;

  // Calculate effort d'epargne
  const mensualite = calculResult.credit?.mensualiteAvecAssurance ?? 0;
  const chargesMensuelles = (input.step4.chargesAnnuelles + input.step4.taxeFonciere) / 12;
  const effortJeanbrun = mensualite + chargesMensuelles - input.step4.loyerMensuel - (calculResult.economieImpot.economieTotaleAnnuelle / 12);
  const effortLMNP = mensualite + chargesMensuelles - input.step4.loyerMensuel + (impotLMNP / 12);

  return {
    jeanbrun: {
      reductionImpot: Math.round(economieTotaleJeanbrun),
      cashFlowMoyen: cashFlowMensuel,
      effortEpargne: Math.round(effortJeanbrun),
      rendementNet: Math.round(rendementNet * 100) / 100,
      fiscaliteRevente: input.step5.dureeDetention >= 22
        ? "Exoneration totale IR"
        : `Abattement ${Math.min(6 * (input.step5.dureeDetention - 5), 100)}%`,
      complexite: "Moyenne",
    },
    lmnp: {
      reductionImpot: Math.round(economieLMNP),
      cashFlowMoyen: Math.round(cashFlowMensuel - (calculResult.economieImpot.economieTotaleAnnuelle / 12) + (impotLMNP / 12)),
      effortEpargne: Math.round(effortLMNP),
      rendementNet: Math.round((rendementNet - 0.5) * 100) / 100, // Slightly lower for LMNP
      fiscaliteRevente: "Amortissements reintegres",
      complexite: "Elevee",
    },
  };
}

// ============================================================================
// API Handler
// ============================================================================

/**
 * POST /api/simulation/avancee
 *
 * Recoit les donnees des 6 etapes du wizard et retourne les resultats de simulation
 */
export async function POST(request: NextRequest) {
  try {
    // CORS: Verify request origin
    const origin = request.headers.get("origin");
    const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL];
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { success: false, error: "Origin not allowed" },
        { status: 403 }
      );
    }

    // Content-Length check for DoS prevention
    const contentLength = request.headers.get("content-length");
    const MAX_BODY_SIZE = 10 * 1024; // 10KB
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { success: false, error: "Request body too large" },
        { status: 413 }
      );
    }

    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(simulationRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // Parse JSON body
    const body: unknown = await request.json();

    // Validate input with Zod
    const parsed = SimulationInputSchema.safeParse(body);

    if (!parsed.success) {
      const isProduction = process.env.NODE_ENV === "production";
      return NextResponse.json(
        {
          success: false,
          error: "Donnees de simulation invalides",
          ...(isProduction ? {} : { details: parsed.error.flatten().fieldErrors }),
        },
        { status: 400 }
      );
    }

    const input = parsed.data;

    // Transform to orchestrator input
    const orchestratorInput = transformToOrchestatorInput(input);

    // Run calculation
    const calculResult = orchestrerSimulation(orchestratorInput);

    // Check for ineligibility
    if (
      calculResult.jeanbrun &&
      "eligible" in calculResult.jeanbrun &&
      !calculResult.jeanbrun.eligible
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Bien non eligible au dispositif Jeanbrun",
          details: {
            message: calculResult.jeanbrun.message,
            seuilRequis: calculResult.jeanbrun.seuilTravauxRequis,
            montantManquant: calculResult.jeanbrun.montantManquant,
          },
        },
        { status: 422 }
      );
    }

    // Calculate financing analysis
    const revenuMensuel = input.step1.revenuNet / 12;
    const montantProjet =
      input.step2.typeBien === "ancien" && input.step2.montantTravaux
        ? input.step2.prixAcquisition + input.step2.montantTravaux
        : input.step2.prixAcquisition;

    const analyseFinancementResult = analyserFinancement({
      revenuMensuel,
      chargesActuelles: input.step3.autresCredits ?? 0,
      montantProjet,
      apport: input.step3.apport,
      dureeEmpruntMois: input.step3.dureeCredit * 12,
      tauxAnnuel: input.step3.tauxInteret / 100,
    });

    // Generate response data
    const dureeAns = input.step5.dureeDetention;
    const economieAnnuelle = calculResult.economieImpot.economieTotaleAnnuelle;

    // Calculate capital rembourse per year (simplified)
    const montantEmprunt = montantProjet - input.step3.apport;
    const capitalRembourseAnnuel = montantEmprunt / input.step3.dureeCredit;

    const graphiqueData = generateGraphiqueData(
      input,
      dureeAns,
      economieAnnuelle,
      capitalRembourseAnnuel
    );

    const tableauAnnuel = generateTableauAnnuel(input, calculResult, dureeAns);
    const comparatifLMNP = generateComparatifLMNP(input, calculResult);

    // Calculate synthese
    const mensualite = calculResult.credit?.mensualiteAvecAssurance ?? 0;
    const chargesMensuelles = (input.step4.chargesAnnuelles + input.step4.taxeFonciere) / 12;
    const effortEpargne =
      mensualite +
      chargesMensuelles -
      input.step4.loyerMensuel -
      economieAnnuelle / 12;

    const response: SimulationResponse = {
      id: crypto.randomUUID(),
      synthese: {
        economieFiscale: calculResult.economieImpot.economieTotale9ans,
        cashFlowMensuel: calculResult.cashflowMensuel,
        rendementNet: calculResult.rendements.rendementNet,
        effortEpargne: Math.round(effortEpargne),
      },
      graphiqueData,
      tableauAnnuel,
      comparatifLMNP,
      financement: {
        montantEmprunt: analyseFinancementResult.montantEmprunt,
        mensualiteEstimee: analyseFinancementResult.mensualiteEstimee,
        tauxEndettement: analyseFinancementResult.tauxEndettement,
        tauxEndettementPourcent: analyseFinancementResult.tauxEndettementPourcent,
        respecteHCSF: analyseFinancementResult.respecteHCSF,
        dossierConfortable: analyseFinancementResult.dossierConfortable,
        resteAVivre: analyseFinancementResult.resteAVivre,
        verdict: analyseFinancementResult.verdict,
        verdictMessage: analyseFinancementResult.verdictMessage,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    simulationLogger.error({ err: error }, "Simulation avancee calculation error");

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "JSON invalide",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du calcul de la simulation",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/simulation/avancee
 *
 * Documentation de l'API
 */
export async function GET() {
  return NextResponse.json({
    name: "Simulation Avancee API",
    version: "1.0",
    description: "API pour le wizard 6 etapes de simulation Jeanbrun",
    endpoints: {
      POST: {
        description: "Executer une simulation complete a partir des 6 etapes",
        body: "SimulationInput (step1 a step6)",
        response: "SimulationResponse avec synthese, graphique, tableau et comparatif",
      },
      GET: {
        description: "Documentation de l'API",
      },
    },
  });
}
