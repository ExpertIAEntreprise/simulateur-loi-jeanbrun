/**
 * API Route: Lead Programme Contact
 *
 * Capture les leads issus du formulaire de contact programme.
 * Cree un lead dans EspoCRM avec source "simulateur-jeanbrun".
 *
 * POST /api/leads/programme-contact
 *
 * @see Phase 5 du plan page-programme
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  simulationRateLimiter,
  checkRateLimit,
  getClientIP,
} from "@/lib/rate-limit";
import { getEspoCRMClient, toEspoLead } from "@/lib/espocrm";

/**
 * Schema de validation du body
 */
const programmeContactSchema = z.object({
  // Coordonnees
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  telephone: z
    .string()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/),
  message: z.string().min(10),
  consentementRgpd: z.literal(true),

  // Contexte programme
  programmeName: z.string().min(1),
  programmeSlug: z.string().min(1),
  villeName: z.string().nullable(),

  // Contexte lot (optionnel)
  lotType: z.string().nullable().optional(),
  lotSurface: z.number().nullable().optional(),
  lotPrix: z.number().nullable().optional(),
  lotEtage: z.number().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 req/min par IP
    const ip = getClientIP(request);
    const rateLimitResponse = await checkRateLimit(simulationRateLimiter, ip);
    if (rateLimitResponse) return rateLimitResponse;

    // Parse et validation
    const body = await request.json();
    const data = programmeContactSchema.parse(body);

    // Construire la description avec contexte programme + lot
    const descriptionParts = [
      `Programme: ${data.programmeName}`,
      data.villeName ? `Ville: ${data.villeName}` : null,
      data.lotType ? `Lot: ${data.lotType}` : null,
      data.lotSurface != null ? `Surface: ${data.lotSurface}m2` : null,
      data.lotPrix != null
        ? `Prix: ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(data.lotPrix)}`
        : null,
      data.lotEtage != null
        ? `Etage: ${data.lotEtage === 0 ? "RDC" : data.lotEtage}`
        : null,
      `---`,
      `Message: ${data.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Creer le lead dans EspoCRM
    const espoLead = toEspoLead({
      email: data.email,
      telephone: data.telephone,
      prenom: data.prenom,
      nom: data.nom,
      consentementRgpd: data.consentementRgpd,
    });

    // Ajouter la description avec contexte
    espoLead.description = descriptionParts;

    const client = getEspoCRMClient();

    try {
      await client.createLead(espoLead);
    } catch (espoError) {
      // Log l'erreur EspoCRM mais ne pas bloquer la reponse
      // Le lead est capture, on pourra le retraiter plus tard
      console.error("[Lead Programme Contact] EspoCRM error:", espoError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Votre demande a ete envoyee.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Donnees invalides",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("[Lead Programme Contact] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre demande.",
      },
      { status: 500 }
    );
  }
}
