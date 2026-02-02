/**
 * API Route: Lead Financement / Courtier
 *
 * Capture les leads financement pour transmission au courtier partenaire.
 * Stocke le lead et peut déclencher un webhook/email vers le courtier.
 *
 * POST /api/leads/financement
 */

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  simulationRateLimiter,
  checkRateLimit,
  getClientIP,
} from "@/lib/rate-limit";

// Schema de validation
const leadFinancementSchema = z.object({
  // Coordonnées
  prenom: z.string().min(2),
  nom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(10),

  // Données simulation
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
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requests per minute per IP (stricter for lead capture)
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(simulationRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // Parse et validation du body
    const body = await request.json();
    const data = leadFinancementSchema.parse(body);

    // Récupérer l'IP et User-Agent pour tracking
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const userAgent = headersList.get("user-agent");

    // Construction du lead
    const leadData = {
      ...data,
      statut: "nouveau",
      dateConsentement: new Date().toISOString(),
      ip: forwardedFor?.split(",")[0]?.trim() || "unknown",
      userAgent: userAgent || "unknown",
      source: "simulateur_jeanbrun",
      createdAt: new Date().toISOString(),
    };

    // TODO: Stocker le lead en base (Drizzle)
    // const savedLead = await db.insert(leadsFinancement).values(lead).returning();

    // TODO: Envoyer notification au courtier partenaire
    // Options:
    // 1. Webhook vers le CRM du courtier
    // 2. Email via Mailjet/SendGrid
    // 3. Notification Slack/Discord
    // 4. Sync vers EspoCRM puis workflow n8n

    // Pour l'instant, on log et on simule le succès
    console.log("[Lead Financement]", {
      email: leadData.email,
      montantEmprunt: leadData.montantEmprunt,
      tauxEndettement: `${(data.tauxEndettement * 100).toFixed(1)}%`,
      timestamp: leadData.createdAt,
    });

    // Exemple d'envoi webhook courtier (à décommenter et configurer)
    // if (process.env.WEBHOOK_COURTIER_URL) {
    //   await fetch(process.env.WEBHOOK_COURTIER_URL, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${process.env.WEBHOOK_COURTIER_TOKEN}`
    //     },
    //     body: JSON.stringify(lead),
    //   });
    // }

    // Exemple d'envoi vers EspoCRM (à décommenter)
    // if (process.env.ESPOCRM_API_KEY) {
    //   await fetch(`${process.env.ESPOCRM_URL}/api/v1/CLeadFinancement`, {
    //     method: "POST",
    //     headers: {
    //       "X-Api-Key": process.env.ESPOCRM_API_KEY,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       firstName: data.prenom,
    //       lastName: data.nom,
    //       emailAddress: data.email,
    //       phoneNumber: data.telephone,
    //       cMontantEmprunt: data.montantEmprunt,
    //       cTauxEndettement: data.tauxEndettement,
    //       cMensualite: data.mensualiteEstimee,
    //       cVilleProjet: data.villeProjet,
    //       cTypeBien: data.typeBien,
    //       cSource: "Simulateur Jeanbrun",
    //       status: "New",
    //     }),
    //   });
    // }

    return NextResponse.json(
      {
        success: true,
        message: "Votre demande a été transmise à notre courtier partenaire.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Lead Financement Error]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Données invalides",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre demande.",
      },
      { status: 500 }
    );
  }
}
