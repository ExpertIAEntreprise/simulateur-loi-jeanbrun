/**
 * Better Auth API Route Handler
 *
 * Handles all authentication endpoints (login, register, logout, etc.)
 *
 * @version 1.1
 * @date 30 janvier 2026
 *
 * @security Rate limited to 20 requests/minute per IP to prevent brute force attacks
 */

import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { authRateLimiter, checkRateLimit, getClientIP } from "@/lib/rate-limit";

const betterAuthHandler = toNextJsHandler(auth);

/**
 * GET handler with rate limiting
 * Used for: session retrieval, CSRF token, etc.
 */
export async function GET(request: Request) {
  // Rate limiting: 20 requests per minute per IP
  const ip = getClientIP(request);
  const rateLimitResponse = await checkRateLimit(authRateLimiter, ip);
  if (rateLimitResponse) return rateLimitResponse;

  return betterAuthHandler.GET(request);
}

/**
 * POST handler with rate limiting
 * Used for: login, register, password reset, etc.
 */
export async function POST(request: Request) {
  // Rate limiting: 20 requests per minute per IP
  const ip = getClientIP(request);
  const rateLimitResponse = await checkRateLimit(authRateLimiter, ip);
  if (rateLimitResponse) return rateLimitResponse;

  return betterAuthHandler.POST(request);
}