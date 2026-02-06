/**
 * API Route: Lead Unsubscribe (RGPD Art. 7.3)
 *
 * POST /api/leads/unsubscribe - Withdraw consent via token
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, eq } from "@repo/database";
import { leads } from "@repo/database/schema";
import { createLogger } from "@/lib/logger";

const unsubscribeLogger = createLogger("unsubscribe");

const unsubscribeSchema = z.object({
  token: z.string().length(64, "Token invalide"),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { token } = unsubscribeSchema.parse(body);

    // Find lead by unsubscribe token
    const [lead] = await db
      .select({ id: leads.id, email: leads.email })
      .from(leads)
      .where(eq(leads.unsubscribeToken, token))
      .limit(1);

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Token invalide ou expire" },
        { status: 404 }
      );
    }

    // Revoke all consents
    await db
      .update(leads)
      .set({
        consentPromoter: false,
        consentBroker: false,
        consentNewsletter: false,
      })
      .where(eq(leads.unsubscribeToken, token));

    unsubscribeLogger.info(
      { leadId: lead.id },
      "Consent revoked via unsubscribe token"
    );

    return NextResponse.json({
      success: true,
      message: "Vos consentements ont ete retires avec succes.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Token invalide" },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Corps de requete invalide" },
        { status: 400 }
      );
    }

    unsubscribeLogger.error({ err: error }, "Unsubscribe failed");

    return NextResponse.json(
      { success: false, message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
