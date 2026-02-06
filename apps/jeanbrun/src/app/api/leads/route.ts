/**
 * API Route: Lead Capture
 *
 * Main lead capture endpoint for the Jeanbrun simulator and stop-loyer platforms.
 * Validates input, enforces rate limiting, calculates lead score, and stores
 * the lead in Neon PostgreSQL via Drizzle ORM.
 *
 * POST /api/leads
 *
 * @security Rate limited to 5 requests per IP per hour (via Upstash Redis)
 * @security At least one consent (promoter or broker) required
 * @security French phone number format enforced
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createRateLimiter,
  checkRateLimit,
  getClientIP,
} from "@/lib/rate-limit";
import { db } from "@repo/database";
import { leads } from "@repo/database/schema";
import { calculateLeadScore } from "@repo/leads";

// ---------------------------------------------------------------------------
// Rate limiter: 5 leads per IP per hour (stricter than simulation endpoints)
// ---------------------------------------------------------------------------
const leadCaptureRateLimiter = createRateLimiter(5);

// ---------------------------------------------------------------------------
// French phone regex (international +33 or local 0x format)
// Matches: +33612345678, 0612345678, 06 12 34 56 78, 06.12.34.56.78
// ---------------------------------------------------------------------------
const FRENCH_PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// ---------------------------------------------------------------------------
// Zod validation schema
// ---------------------------------------------------------------------------
const leadCaptureSchema = z
  .object({
    email: z.string().email("Email invalide"),
    telephone: z
      .string()
      .regex(FRENCH_PHONE_REGEX, "Numero de telephone francais invalide"),
    prenom: z.string().min(2, "Prenom requis (min 2 caracteres)"),
    nom: z.string().min(2, "Nom requis (min 2 caracteres)"),

    // Consents (RGPD)
    consentPromoter: z.boolean(),
    consentBroker: z.boolean(),
    consentNewsletter: z.boolean(),

    // Simulation snapshot (stored as JSONB)
    simulationData: z.record(z.string(), z.unknown()).optional(),

    // Platform & tracking
    platform: z.enum(["jeanbrun", "stop-loyer"]).default("jeanbrun"),
    sourcePage: z.string().optional(),
    utmSource: z.string().max(255).optional(),
    utmMedium: z.string().max(255).optional(),
    utmCampaign: z.string().max(255).optional(),
  })
  .refine((data) => data.consentPromoter || data.consentBroker, {
    message:
      "Au moins un consentement (promoteur ou courtier) est requis pour traiter votre demande.",
    path: ["consentPromoter"],
  });

// ---------------------------------------------------------------------------
// POST /api/leads
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(leadCaptureRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // 2. Parse and validate request body
    const body: unknown = await request.json();
    const data = leadCaptureSchema.parse(body);

    // 3. Calculate lead score
    const simulationData = data.simulationData as
      | Record<string, unknown>
      | undefined;

    const leadScore = calculateLeadScore({
      hasEmail: true,
      hasPhone: !!data.telephone,
      hasName: !!(data.prenom && data.nom),
      hasSimulationData: !!simulationData,
      consentPromoter: data.consentPromoter,
      consentBroker: data.consentBroker,
      investmentAmount: toNumberOrUndefined(
        simulationData?.montantInvestissement
      ),
      monthlyIncome: toNumberOrUndefined(simulationData?.revenuMensuel),
      hasDownPayment: !!simulationData?.apport,
    });

    // 4. Insert lead into database
    const [lead] = await db
      .insert(leads)
      .values({
        platform: data.platform,
        email: data.email,
        telephone: data.telephone,
        prenom: data.prenom,
        nom: data.nom,
        consentPromoter: data.consentPromoter,
        consentBroker: data.consentBroker,
        consentNewsletter: data.consentNewsletter,
        consentDate: new Date(),
        simulationData: simulationData ?? null,
        score: leadScore.total,
        status: "new",
        sourcePage: data.sourcePage ?? null,
        utmSource: data.utmSource ?? null,
        utmMedium: data.utmMedium ?? null,
        utmCampaign: data.utmCampaign ?? null,
      })
      .returning({ id: leads.id, score: leads.score });

    // 5. Return success
    return NextResponse.json(
      {
        success: true,
        data: { id: lead?.id, score: lead?.score },
        message: "Lead cree avec succes",
      },
      { status: 201 }
    );
  } catch (error) {
    // Validation errors -> 400
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Donnees invalides",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // JSON parse errors -> 400
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Corps de la requete invalide (JSON attendu)",
        },
        { status: 400 }
      );
    }

    // Everything else -> 500 (do not leak internal details)
    console.error("[Lead Capture] Unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la creation du lead.",
      },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Safely coerces an unknown value to a number or returns undefined.
 * Used to extract numeric fields from the untyped simulationData JSONB.
 */
function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}
