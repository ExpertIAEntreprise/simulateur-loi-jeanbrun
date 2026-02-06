/**
 * API Route: Lead Retention Cleanup (RGPD 36 months)
 *
 * POST /api/leads/retention
 *
 * Anonymizes or deletes leads older than 36 months (non-converted).
 * Copies consent proof to consent_audit_log before anonymization.
 * Protected by admin bearer token.
 *
 * @security Bearer token auth via ADMIN_API_TOKEN
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin-auth";
import { db, and, lte, ne, sql } from "@repo/database";
import { leads, consentAuditLog } from "@repo/database/schema";

export async function POST(request: NextRequest) {
  // 1. Authenticate
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const thirtySixMonthsAgo = new Date();
    thirtySixMonthsAgo.setMonth(thirtySixMonthsAgo.getMonth() - 36);

    // 2. Find leads eligible for retention cleanup
    const expiredLeads = await db
      .select({
        id: leads.id,
        email: leads.email,
        ipAddress: leads.ipAddress,
        userAgent: leads.userAgent,
        consentPromoter: leads.consentPromoter,
        consentBroker: leads.consentBroker,
        consentNewsletter: leads.consentNewsletter,
        consentDate: leads.consentDate,
      })
      .from(leads)
      .where(
        and(
          lte(leads.createdAt, thirtySixMonthsAgo),
          ne(leads.status, "converted")
        )
      );

    if (expiredLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Aucun lead a anonymiser",
        data: { processed: 0 },
      });
    }

    // 3. Copy consent proof to audit log
    const auditEntries = expiredLeads.map((lead) => ({
      leadId: lead.id,
      email: lead.email,
      ipAddress: lead.ipAddress,
      userAgent: lead.userAgent,
      consentPromoter: lead.consentPromoter,
      consentBroker: lead.consentBroker,
      consentNewsletter: lead.consentNewsletter,
      action: "revoked" as const,
    }));

    await db.insert(consentAuditLog).values(auditEntries);

    // 4. Anonymize the expired leads (keep structure for analytics)
    const anonymized = await db
      .update(leads)
      .set({
        email: sql`'anonymized-' || substring(${leads.id}::text, 1, 8) || '@deleted.local'`,
        telephone: null,
        prenom: null,
        nom: null,
        ipAddress: null,
        userAgent: null,
        simulationData: null,
        consentPromoter: false,
        consentBroker: false,
        consentNewsletter: false,
        unsubscribeToken: null,
      })
      .where(
        and(
          lte(leads.createdAt, thirtySixMonthsAgo),
          ne(leads.status, "converted")
        )
      )
      .returning({ id: leads.id });

    return NextResponse.json({
      success: true,
      message: `${anonymized.length} leads anonymises (retention 36 mois)`,
      data: {
        processed: anonymized.length,
        auditLogged: auditEntries.length,
      },
    });
  } catch (error) {
    console.error("[Lead Retention] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors du nettoyage de retention",
      },
      { status: 500 }
    );
  }
}
