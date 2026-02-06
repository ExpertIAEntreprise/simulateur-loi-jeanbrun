/**
 * API Route: Lead Financement / Courtier
 *
 * Captures financing leads and dispatches them to partner brokers.
 * Persists the lead in the `leads` table (sourcePage = "financement")
 * and triggers async dispatch (email to matching broker).
 *
 * POST /api/leads/financement
 *
 * @security Rate limited to 5 requests per IP per minute
 * @security consentementCourtier: z.literal(true) enforced at validation
 * @security PII is never logged (Pino redact config in logger.ts)
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
import { dispatchLead } from "@/lib/lead-dispatch";
import { createLogger } from "@/lib/logger";

// ---------------------------------------------------------------------------
// Logger & rate limiter
// ---------------------------------------------------------------------------
const log = createLogger("lead-financement");
const financementRateLimiter = createRateLimiter(5);

// ---------------------------------------------------------------------------
// Zod validation schema
// ---------------------------------------------------------------------------
const leadFinancementSchema = z.object({
  // Coordonnees
  prenom: z.string().min(2),
  nom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(10),

  // Simulation financiere
  simulationId: z.string().optional().nullable(),
  revenuMensuel: z.number().positive(),
  montantProjet: z.number().positive(),
  apport: z.number().min(0),
  montantEmprunt: z.number().positive(),
  dureeEmpruntMois: z.number().int().min(12).max(360),
  tauxEndettement: z.number().min(0).max(1),
  mensualiteEstimee: z.number().positive(),
  villeProjet: z.string().optional().nullable(),
  typeBien: z.enum(["neuf", "ancien"]).optional().nullable(),

  // Consentements
  consentementRgpd: z.literal(true),
  consentementCourtier: z.literal(true),

  // UTM tracking (optional)
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
});

// ---------------------------------------------------------------------------
// POST /api/leads/financement
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(financementRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // 2. Parse and validate request body
    const body: unknown = await request.json();
    const data = leadFinancementSchema.parse(body);

    // 3. Build simulation data snapshot (financial fields as JSONB)
    const simulationData: Record<string, unknown> = {
      simulationId: data.simulationId ?? null,
      revenuMensuel: data.revenuMensuel,
      montantProjet: data.montantProjet,
      apport: data.apport,
      montantEmprunt: data.montantEmprunt,
      dureeEmpruntMois: data.dureeEmpruntMois,
      tauxEndettement: data.tauxEndettement,
      mensualiteEstimee: data.mensualiteEstimee,
      villeProjet: data.villeProjet ?? null,
      typeBien: data.typeBien ?? null,
    };

    // 4. Calculate lead score
    const leadScore = calculateLeadScore({
      hasEmail: true,
      hasPhone: !!data.telephone,
      hasName: !!(data.prenom && data.nom),
      hasSimulationData: true,
      consentPromoter: false,
      consentBroker: true,
      investmentAmount: data.montantProjet,
      monthlyIncome: data.revenuMensuel,
      hasDownPayment: data.apport > 0,
    });

    // 5. Insert lead into database
    const [lead] = await db
      .insert(leads)
      .values({
        platform: "jeanbrun",
        sourcePage: "financement",
        email: data.email,
        telephone: data.telephone,
        prenom: data.prenom,
        nom: data.nom,
        consentBroker: true,
        consentPromoter: false,
        consentNewsletter: false,
        consentDate: new Date(),
        simulationData,
        score: leadScore.total,
        status: "new",
        utmSource: data.utmSource ?? null,
        utmMedium: data.utmMedium ?? null,
        utmCampaign: data.utmCampaign ?? null,
      })
      .returning({ id: leads.id, score: leads.score });

    log.info(
      { leadId: lead?.id, score: lead?.score },
      "Financement lead created"
    );

    // 6. Dispatch lead asynchronously (fire-and-forget)
    if (lead?.id) {
      dispatchLead(lead.id).catch((err) => {
        log.error({ err, leadId: lead.id }, "Lead dispatch error");
      });
    }

    // 7. Return success
    return NextResponse.json(
      {
        success: true,
        data: { id: lead?.id, score: lead?.score },
        message:
          "Votre demande a ete transmise a notre courtier partenaire.",
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
    log.error({ err: error }, "Unexpected error in lead financement route");

    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre demande.",
      },
      { status: 500 }
    );
  }
}
