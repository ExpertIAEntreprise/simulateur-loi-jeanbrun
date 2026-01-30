/**
 * Endpoint de test pour l'API EspoCRM
 *
 * GET /api/espocrm/test
 * Teste la connexion à EspoCRM et récupère les 5 premières villes
 */

import { NextResponse } from "next/server";
import { getEspoCRMClient, isEspoCRMAvailable } from "@/lib/espocrm";

export const dynamic = "force-dynamic"; // Désactiver cache pour tester

export async function GET() {
  // Block access in production - test endpoint only for development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    // Vérifier si EspoCRM est configuré
    if (!isEspoCRMAvailable()) {
      return NextResponse.json(
        {
          success: false,
          error: "EspoCRM API is not configured (missing ESPOCRM_API_KEY)",
          villes: [],
          count: 0,
        },
        { status: 503 } // Service Unavailable
      );
    }

    // Récupérer le client
    const client = getEspoCRMClient();

    // Tester la connexion avec les 5 premières villes
    const response = await client.getVilles(undefined, { limit: 5, offset: 0 });

    return NextResponse.json({
      success: true,
      villes: response.list,
      count: response.total,
      message: `EspoCRM API is working. Found ${response.total} villes, showing first 5.`,
    });
  } catch (error) {
    console.error("EspoCRM test endpoint error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        villes: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}
