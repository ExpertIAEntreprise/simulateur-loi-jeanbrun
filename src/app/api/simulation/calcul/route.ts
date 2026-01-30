/**
 * API Route pour le calcul de simulation Jeanbrun
 *
 * Endpoint POST: Exécute une simulation complète avec validation Zod
 * Endpoint GET: Documentation de l'API
 *
 * @version 1.1
 * @date 30 janvier 2026
 *
 * @security Rate limited to 10 requests/minute per IP
 */

import { NextRequest, NextResponse } from "next/server";
import { orchestrerSimulation, type SimulationCalculInput } from "@/lib/calculs";
import { simulationLogger } from "@/lib/logger";
import {
  simulationRateLimiter,
  checkRateLimit,
  getClientIP,
} from "@/lib/rate-limit";
import { simulationCalculInputSchema } from "@/lib/validations/simulation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Transform validated Zod data to SimulationCalculInput
 * Removes undefined values to comply with exactOptionalPropertyTypes
 */
function transformToSimulationInput(
  data: ReturnType<typeof simulationCalculInputSchema.parse>
): SimulationCalculInput {
  const input: SimulationCalculInput = {
    revenuNetImposable: data.revenuNetImposable,
    nombreParts: data.nombreParts,
    typeBien: data.typeBien,
    prixAcquisition: data.prixAcquisition,
    surface: data.surface,
    zoneFiscale: data.zoneFiscale,
    niveauLoyer: data.niveauLoyer,
  };

  // Only add optional properties if they have values
  if (data.montantTravaux !== undefined) {
    input.montantTravaux = data.montantTravaux;
  }
  if (data.apportPersonnel !== undefined) {
    input.apportPersonnel = data.apportPersonnel;
  }
  if (data.tauxCredit !== undefined) {
    input.tauxCredit = data.tauxCredit;
  }
  if (data.dureeCredit !== undefined) {
    input.dureeCredit = data.dureeCredit;
  }
  if (data.tauxAssurance !== undefined) {
    input.tauxAssurance = data.tauxAssurance;
  }
  if (data.loyerMensuelEstime !== undefined) {
    input.loyerMensuelEstime = data.loyerMensuelEstime;
  }
  if (data.chargesCopropriete !== undefined) {
    input.chargesCopropriete = data.chargesCopropriete;
  }
  if (data.taxeFonciere !== undefined) {
    input.taxeFonciere = data.taxeFonciere;
  }
  if (data.comparerLMNP !== undefined) {
    input.comparerLMNP = data.comparerLMNP;
  }
  if (data.calculerPlusValue !== undefined) {
    input.calculerPlusValue = data.calculerPlusValue;
  }
  if (data.dureeDetentionPrevue !== undefined) {
    input.dureeDetentionPrevue = data.dureeDetentionPrevue;
  }
  if (data.prixReventeEstime !== undefined) {
    input.prixReventeEstime = data.prixReventeEstime;
  }

  return input;
}

/**
 * POST /api/simulation/calcul
 *
 * Exécute une simulation fiscale complète pour la loi Jeanbrun.
 *
 * @param request - Corps JSON avec les données de simulation
 * @returns SimulationCalculResult ou erreur détaillée
 *
 * Codes de statut:
 * - 200: Succès
 * - 400: Données invalides (JSON malformé ou validation échouée)
 * - 422: Règle métier non respectée (ex: travaux insuffisants pour ancien)
 * - 500: Erreur serveur
 */
export async function POST(request: NextRequest) {
  try {
    // CORS: Verify request origin to prevent cross-site abuse
    const origin = request.headers.get("origin");
    const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL];
    // origin is null for same-origin requests (browser navigation, server-to-server)
    // Only block if origin is present AND not in allowed list
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { success: false, error: "Origin not allowed" },
        { status: 403 }
      );
    }

    // Rate limiting: 10 requests per minute per IP
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(simulationRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // Parse JSON body
    const body: unknown = await request.json();

    // Validate input with Zod
    const parsed = simulationCalculInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Données de simulation invalides",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Transform validated data to match SimulationCalculInput type
    const simulationInput = transformToSimulationInput(parsed.data);

    // Run calculation
    const result = orchestrerSimulation(simulationInput);

    // Check for ineligibility (ancien with insufficient travaux)
    if (
      result.jeanbrun &&
      "eligible" in result.jeanbrun &&
      !result.jeanbrun.eligible
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Bien non éligible au dispositif Jeanbrun",
          details: {
            message: result.jeanbrun.message,
            seuilRequis: result.jeanbrun.seuilTravauxRequis,
            montantManquant: result.jeanbrun.montantManquant,
          },
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    simulationLogger.error({ err: error }, "Simulation calculation error");

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
 * GET /api/simulation/calcul
 *
 * Retourne la documentation de l'API de simulation.
 */
export async function GET() {
  return NextResponse.json({
    name: "Simulation Calcul API",
    version: "1.0",
    description: "Calcul fiscal complet pour la loi Jeanbrun",
    endpoints: {
      POST: {
        description: "Exécuter une simulation complète",
        body: "SimulationCalculInput (voir documentation)",
        response: "SimulationCalculResult ou erreur",
        contentType: "application/json",
        requiredFields: [
          "revenuNetImposable",
          "nombreParts",
          "typeBien",
          "prixAcquisition",
          "surface",
          "zoneFiscale",
          "niveauLoyer",
        ],
        optionalFields: [
          "montantTravaux (obligatoire si typeBien='ancien')",
          "apportPersonnel",
          "tauxCredit",
          "dureeCredit",
          "tauxAssurance",
          "loyerMensuelEstime",
          "chargesCopropriete",
          "taxeFonciere",
          "comparerLMNP",
          "calculerPlusValue",
          "dureeDetentionPrevue",
          "prixReventeEstime",
        ],
      },
      GET: {
        description: "Documentation de l'API",
        response: "Informations sur les endpoints",
      },
    },
    statusCodes: {
      200: "Succès - simulation calculée",
      400: "Erreur de validation des données",
      422: "Règle métier non respectée (ex: travaux insuffisants)",
      500: "Erreur serveur interne",
    },
    example: {
      request: {
        revenuNetImposable: 60000,
        nombreParts: 2,
        typeBien: "neuf",
        prixAcquisition: 250000,
        surface: 45,
        zoneFiscale: "B1",
        niveauLoyer: "intermediaire",
      },
      response: {
        success: true,
        data: "SimulationCalculResult (voir types)",
      },
    },
  });
}
