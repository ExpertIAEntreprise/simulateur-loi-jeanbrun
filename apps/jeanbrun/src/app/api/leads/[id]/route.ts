/**
 * API Route: Lead Detail & Update
 *
 * GET   /api/leads/:id - Lead detail (admin, bearer auth)
 * PATCH /api/leads/:id - Update lead status/revenue (admin, bearer auth)
 *
 * @security Bearer token auth via ADMIN_API_TOKEN
 * @security Rate limited to 100 requests per minute
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createRateLimiter,
  checkRateLimit,
  getClientIP,
} from "@/lib/rate-limit";
import { verifyAdminAuth } from "@/lib/admin-auth";
import { db, eq } from "@repo/database";
import { leads, promoters, brokers } from "@repo/database/schema";

// ---------------------------------------------------------------------------
// Rate limiter: 100 req/min for admin endpoints
// ---------------------------------------------------------------------------
const adminDetailRateLimiter = createRateLimiter(100);

// ---------------------------------------------------------------------------
// UUID validation regex
// ---------------------------------------------------------------------------
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------------------------------------------------------------------------
// Valid status transitions (P1-01)
// ---------------------------------------------------------------------------
const VALID_TRANSITIONS: Record<string, string[]> = {
  new: ["dispatched", "lost"],
  dispatched: ["contacted", "lost"],
  contacted: ["converted", "lost"],
  converted: [],
  lost: ["new"],
};

// ---------------------------------------------------------------------------
// PATCH validation schema
// ---------------------------------------------------------------------------
const leadUpdateSchema = z
  .object({
    status: z
      .enum(["new", "dispatched", "contacted", "converted", "lost"])
      .optional(),
    revenuePromoter: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Format invalide (ex: 150.00)")
      .optional(),
    revenueBroker: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Format invalide (ex: 150.00)")
      .optional(),
    convertedAt: z.string().datetime().optional(),
  })
  .refine(
    (data) =>
      data.status !== undefined ||
      data.revenuePromoter !== undefined ||
      data.revenueBroker !== undefined ||
      data.convertedAt !== undefined,
    {
      message: "Au moins un champ a mettre a jour est requis",
    }
  );

// ---------------------------------------------------------------------------
// Route context type
// ---------------------------------------------------------------------------
interface RouteContext {
  params: Promise<{ id: string }>;
}

// ---------------------------------------------------------------------------
// GET /api/leads/:id
// ---------------------------------------------------------------------------
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // 1. Authenticate
    const authError = verifyAdminAuth(request);
    if (authError) return authError;

    // 2. Rate limit
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(adminDetailRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // 3. Validate ID format
    const { id } = await context.params;
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, message: "Format d'identifiant invalide" },
        { status: 400 }
      );
    }

    // 4. Fetch lead
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, id))
      .limit(1);

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead non trouve" },
        { status: 404 }
      );
    }

    // 5. Fetch associated promoter (if any)
    let promoter = null;
    if (lead.promoterId) {
      const [promoterResult] = await db
        .select({
          id: promoters.id,
          name: promoters.name,
          contactName: promoters.contactName,
          contactEmail: promoters.contactEmail,
          contactPhone: promoters.contactPhone,
          pricingModel: promoters.pricingModel,
          pricePerLead: promoters.pricePerLead,
        })
        .from(promoters)
        .where(eq(promoters.id, lead.promoterId))
        .limit(1);

      promoter = promoterResult ?? null;
    }

    // 6. Fetch associated broker (if any)
    let broker = null;
    if (lead.brokerId) {
      const [brokerResult] = await db
        .select({
          id: brokers.id,
          name: brokers.name,
          contactName: brokers.contactName,
          contactEmail: brokers.contactEmail,
          contactPhone: brokers.contactPhone,
          pricePerLead: brokers.pricePerLead,
        })
        .from(brokers)
        .where(eq(brokers.id, lead.brokerId))
        .limit(1);

      broker = brokerResult ?? null;
    }

    // 7. Return lead with partner details
    return NextResponse.json({
      success: true,
      data: {
        ...lead,
        promoter,
        broker,
      },
    });
  } catch (error) {
    console.error("[Lead Detail] Unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la recuperation du lead.",
      },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/leads/:id
// ---------------------------------------------------------------------------
export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // 1. Authenticate
    const authError = verifyAdminAuth(request);
    if (authError) return authError;

    // 2. Rate limit
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(adminDetailRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // 3. Validate ID format
    const { id } = await context.params;
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { success: false, message: "Format d'identifiant invalide" },
        { status: 400 }
      );
    }

    // 4. Parse and validate request body
    const body: unknown = await request.json();
    const data = leadUpdateSchema.parse(body);

    // 5. Check lead exists and fetch current status
    const [existingLead] = await db
      .select({ id: leads.id, status: leads.status })
      .from(leads)
      .where(eq(leads.id, id))
      .limit(1);

    if (!existingLead) {
      return NextResponse.json(
        { success: false, message: "Lead non trouve" },
        { status: 404 }
      );
    }

    // 5.5 Validate status transition
    if (data.status !== undefined) {
      const allowed = VALID_TRANSITIONS[existingLead.status] ?? [];
      if (!allowed.includes(data.status)) {
        return NextResponse.json(
          {
            success: false,
            message: `Transition de statut invalide: ${existingLead.status} -> ${data.status}. Transitions autorisees: ${allowed.join(", ") || "aucune"}`,
          },
          { status: 422 }
        );
      }
    }

    // 6. Build update payload (immutable - create new object)
    const updatePayload: Record<string, unknown> = {};

    if (data.status !== undefined) {
      updatePayload.status = data.status;
    }

    if (data.revenuePromoter !== undefined) {
      updatePayload.revenuePromoter = data.revenuePromoter;
    }

    if (data.revenueBroker !== undefined) {
      updatePayload.revenueBroker = data.revenueBroker;
    }

    if (data.convertedAt !== undefined) {
      updatePayload.convertedAt = new Date(data.convertedAt);
    }

    // 7. Update lead
    const [updatedLead] = await db
      .update(leads)
      .set(updatePayload)
      .where(eq(leads.id, id))
      .returning({
        id: leads.id,
        status: leads.status,
        revenuePromoter: leads.revenuePromoter,
        revenueBroker: leads.revenueBroker,
        convertedAt: leads.convertedAt,
        updatedAt: leads.updatedAt,
      });

    // 8. Return updated lead
    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: "Lead mis a jour avec succes",
    });
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

    console.error("[Lead Update] Unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la mise a jour du lead.",
      },
      { status: 500 }
    );
  }
}

