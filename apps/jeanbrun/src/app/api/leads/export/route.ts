/**
 * API Route: Lead CSV Export
 *
 * GET /api/leads/export?platform=...&status=...
 *
 * Exports leads as CSV with all filters applied.
 * Protected by admin bearer token.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin-auth";
import { db, desc, eq, and, gte, lte } from "@repo/database";
import { leads } from "@repo/database/schema";

export async function GET(request: NextRequest) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const conditions = [];

    if (platform === "jeanbrun" || platform === "stop-loyer") {
      conditions.push(eq(leads.platform, platform));
    }
    if (status === "new" || status === "dispatched" || status === "contacted" || status === "converted" || status === "lost") {
      conditions.push(eq(leads.status, status));
    }
    if (dateFrom) {
      const d = new Date(dateFrom);
      if (!isNaN(d.getTime())) conditions.push(gte(leads.createdAt, d));
    }
    if (dateTo) {
      const d = new Date(dateTo);
      if (!isNaN(d.getTime())) {
        d.setHours(23, 59, 59, 999);
        conditions.push(lte(leads.createdAt, d));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
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
        sourcePage: leads.sourcePage,
        utmSource: leads.utmSource,
        utmMedium: leads.utmMedium,
        utmCampaign: leads.utmCampaign,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .where(whereClause)
      .orderBy(desc(leads.createdAt))
      .limit(10000);

    // Build CSV
    const headers = [
      "ID", "Plateforme", "Email", "Telephone", "Prenom", "Nom",
      "Score", "Statut", "Consent Promoteur", "Consent Courtier",
      "Source", "UTM Source", "UTM Medium", "UTM Campaign", "Date",
    ];

    const rows = data.map((lead) => [
      lead.id,
      lead.platform,
      lead.email,
      lead.telephone ?? "",
      lead.prenom ?? "",
      lead.nom ?? "",
      String(lead.score ?? ""),
      lead.status,
      lead.consentPromoter ? "Oui" : "Non",
      lead.consentBroker ? "Oui" : "Non",
      lead.sourcePage ?? "",
      lead.utmSource ?? "",
      lead.utmMedium ?? "",
      lead.utmCampaign ?? "",
      lead.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")
      ),
    ].join("\n");

    const timestamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-export-${timestamp}.csv"`,
      },
    });
  } catch (error) {
    console.error("[Lead Export] Error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'export" },
      { status: 500 }
    );
  }
}
