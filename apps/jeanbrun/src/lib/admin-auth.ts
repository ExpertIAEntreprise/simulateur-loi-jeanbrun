/**
 * Centralized admin authentication with timing-safe comparison.
 *
 * Used by all admin API routes (GET/PATCH /api/leads, etc.)
 * to verify the ADMIN_API_TOKEN bearer token.
 */

import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Verify ADMIN_API_TOKEN bearer token using timing-safe comparison.
 * Returns a 401/500 NextResponse if invalid, or null if valid.
 */
export function verifyAdminAuth(request: NextRequest): NextResponse | null {
  const adminToken = process.env.ADMIN_API_TOKEN;

  if (!adminToken) {
    return NextResponse.json(
      { success: false, message: "Configuration serveur manquante" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Non autorise" },
      { status: 401 }
    );
  }

  const provided = authHeader.slice(7);

  // Timing-safe comparison to prevent timing attacks
  const isValid =
    provided.length === adminToken.length &&
    crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(adminToken));

  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Non autorise" },
      { status: 401 }
    );
  }

  return null;
}
