/**
 * API Route: Lead Capture & Admin Listing
 *
 * POST /api/leads - Main lead capture endpoint (public, rate-limited)
 * GET  /api/leads - Admin lead listing with filters (bearer auth)
 *
 * @security POST: Rate limited to 5 requests per IP per minute (via Upstash Redis)
 * @security POST: All consents are optional per RGPD Art. 7(4)
 * @security POST: French phone number format enforced
 * @security GET: Bearer token auth via ADMIN_API_TOKEN
 * @security GET: Rate limited to 100 requests per minute
 */

import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createRateLimiter,
  checkRateLimit,
  getClientIP,
} from "@/lib/rate-limit";
import { verifyAdminAuth } from "@/lib/admin-auth";
import { db, and, eq, gte, lte, desc, sql } from "@repo/database";
import { leads } from "@repo/database/schema";
import { calculateLeadScore } from "@repo/leads";
import { dispatchLead } from "@/lib/lead-dispatch";

// ---------------------------------------------------------------------------
// Rate limiters
// ---------------------------------------------------------------------------
const leadCaptureRateLimiter = createRateLimiter(5);
const adminListRateLimiter = createRateLimiter(100);

// ---------------------------------------------------------------------------
// French phone regex (international +33 or local 0x format)
// Matches: +33612345678, 0612345678, 06 12 34 56 78, 06.12.34.56.78
// ---------------------------------------------------------------------------
const FRENCH_PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// ---------------------------------------------------------------------------
// Zod validation schema (POST)
// ---------------------------------------------------------------------------
const leadCaptureSchema = z.object({
  email: z.string().email("Email invalide"),
  telephone: z
    .string()
    .regex(FRENCH_PHONE_REGEX, "Numero de telephone francais invalide"),
  prenom: z.string().min(2, "Prenom requis (min 2 caracteres)"),
  nom: z.string().min(2, "Nom requis (min 2 caracteres)"),

  // Consents (RGPD) - all optional per RGPD Art. 7(4)
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

    // 4. Insert lead into database (with IP and user-agent for RGPD consent proof)
    const clientIp = request.headers.get("x-real-ip")
      ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? null;
    const clientUserAgent = request.headers.get("user-agent") ?? null;

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
        unsubscribeToken: crypto.randomBytes(32).toString("hex"),
        simulationData: simulationData ?? null,
        score: leadScore.total,
        status: "new",
        sourcePage: data.sourcePage ?? null,
        utmSource: data.utmSource ?? null,
        utmMedium: data.utmMedium ?? null,
        utmCampaign: data.utmCampaign ?? null,
        ipAddress: clientIp,
        userAgent: clientUserAgent,
      })
      .returning({ id: leads.id, score: leads.score });

    // 4.5 Dispatch lead asynchronously (fire-and-forget)
    // Do NOT await - dispatch happens in background
    if (lead?.id) {
      dispatchLead(lead.id).catch((err) => {
        console.error("[Lead Dispatch] Error:", err);
      });
    }

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
// GET /api/leads (admin list with filters)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate: check ADMIN_API_TOKEN bearer token
    const authError = verifyAdminAuth(request);
    if (authError) return authError;

    // 2. Rate limit: 100 req/min
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(adminListRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // 3. Parse query params
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const scoreMin = searchParams.get("scoreMin");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20)
    );
    const offset = (page - 1) * limit;

    // 4. Build filter conditions
    const conditions = [];

    if (platform === "jeanbrun" || platform === "stop-loyer") {
      conditions.push(eq(leads.platform, platform));
    }

    if (
      status === "new" ||
      status === "dispatched" ||
      status === "contacted" ||
      status === "converted" ||
      status === "lost"
    ) {
      conditions.push(eq(leads.status, status));
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (!isNaN(fromDate.getTime())) {
        conditions.push(gte(leads.createdAt, fromDate));
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      if (!isNaN(toDate.getTime())) {
        conditions.push(lte(leads.createdAt, toDate));
      }
    }

    if (scoreMin) {
      const minScore = parseInt(scoreMin, 10);
      if (!isNaN(minScore) && minScore >= 0) {
        conditions.push(gte(leads.score, minScore));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 5. Query total count
    const [countResult] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(leads)
      .where(whereClause);

    const total = countResult?.total ?? 0;

    // 6. Query paginated leads
    const results = await db
      .select({
        id: leads.id,
        platform: leads.platform,
        email: leads.email,
        telephone: leads.telephone,
        prenom: leads.prenom,
        nom: leads.nom,
        score: leads.score,
        status: leads.status,
        consentPromoter: leads.consentPromoter,
        consentBroker: leads.consentBroker,
        promoterId: leads.promoterId,
        brokerId: leads.brokerId,
        dispatchedPromoterAt: leads.dispatchedPromoterAt,
        dispatchedBrokerAt: leads.dispatchedBrokerAt,
        convertedAt: leads.convertedAt,
        revenuePromoter: leads.revenuePromoter,
        revenueBroker: leads.revenueBroker,
        sourcePage: leads.sourcePage,
        utmSource: leads.utmSource,
        utmMedium: leads.utmMedium,
        utmCampaign: leads.utmCampaign,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
      })
      .from(leads)
      .where(whereClause)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);

    // 7. Return paginated results
    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Lead List] Unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la recuperation des leads.",
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

