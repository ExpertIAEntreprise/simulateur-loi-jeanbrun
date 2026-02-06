/**
 * Rate Limiting Utilities
 *
 * Provides IP-based rate limiting using Upstash Redis.
 * Falls back gracefully to no-op when Redis is not configured.
 *
 * @security CRITICAL - Prevents DoS attacks and API abuse
 * @version 1.0
 * @date 30 janvier 2026
 */

import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Redis client singleton - graceful fallback if not configured
 * Only initializes if both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

/**
 * No-op rate limiter result for when Redis is not configured
 * Always allows requests in development
 */
interface RateLimitResult {
  success: boolean;
  limit: number;
  reset: number;
  remaining: number;
}

interface NoOpRateLimiter {
  limit: (identifier: string) => Promise<RateLimitResult>;
}

/**
 * Creates a rate limiter with specified requests per minute
 *
 * @param requestsPerMinute - Maximum requests allowed per minute
 * @returns Rate limiter instance (real or no-op)
 *
 * @example
 * const limiter = createRateLimiter(10); // 10 req/min
 * const { success } = await limiter.limit("user-ip-123");
 */
export function createRateLimiter(
  requestsPerMinute: number
): Ratelimit | NoOpRateLimiter {
  if (!redis) {
    // SECURITY: In production, Redis MUST be configured for rate limiting
    // Without it, the API is vulnerable to DoS attacks
    if (process.env.NODE_ENV === "production") {
      console.error(
        "CRITICAL: Redis not configured in production - rate limiting will reject all requests"
      );
      return {
        limit: async (): Promise<RateLimitResult> => ({
          success: false,
          limit: 0,
          reset: Date.now(),
          remaining: 0,
        }),
      };
    }

    // In development, allow requests without rate limiting (with warning)
    console.warn(
      "Rate limiting disabled: Redis not configured (acceptable in development only)"
    );
    return {
      limit: async (): Promise<RateLimitResult> => ({
        success: true,
        limit: requestsPerMinute,
        reset: Date.now() + 60000,
        remaining: requestsPerMinute,
      }),
    };
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requestsPerMinute, "1 m"),
    analytics: true,
    prefix: "ratelimit:jeanbrun",
  });
}

/**
 * Pre-configured rate limiters for different endpoint types
 *
 * - simulation: 10 req/min - CPU-intensive calculations
 * - chat: 5 req/min - AI API calls (expensive)
 * - auth: 20 req/min - Auth operations (more permissive)
 */
export const simulationRateLimiter = createRateLimiter(10);
export const chatRateLimiter = createRateLimiter(5);
export const authRateLimiter = createRateLimiter(20);

/**
 * Checks rate limit and returns 429 response if exceeded
 *
 * @param limiter - Rate limiter instance to use
 * @param identifier - Unique identifier (typically client IP)
 * @returns NextResponse with 429 status if rate limited, null otherwise
 *
 * @example
 * const ip = getClientIP(request);
 * const rateLimitResponse = await checkRateLimit(simulationRateLimiter, ip);
 * if (rateLimitResponse) return rateLimitResponse;
 *
 * @security Includes standard rate limit headers for client visibility
 */
export async function checkRateLimit(
  limiter: Ratelimit | NoOpRateLimiter,
  identifier: string
): Promise<NextResponse | null> {
  const { success, limit, reset, remaining } = await limiter.limit(identifier);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        error: "Trop de requetes. Veuillez reessayer plus tard.",
        code: "RATE_LIMIT_EXCEEDED",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null; // No rate limit hit, proceed with request
}

/**
 * Extracts client IP from request headers
 *
 * Priority order:
 * 1. x-real-ip: Vercel's trusted header (cannot be spoofed by clients)
 * 2. x-forwarded-for: May be spoofed, used only as fallback
 * 3. 127.0.0.1: Fallback for local development
 *
 * @param request - Incoming HTTP request
 * @returns Client IP address string
 *
 * @security IMPORTANT: x-real-ip is set by Vercel's edge network and cannot
 * be spoofed by clients. x-forwarded-for CAN be spoofed, so we only use it
 * as a fallback when x-real-ip is not available (non-Vercel environments).
 */
export function getClientIP(request: Request): string {
  // 1. x-real-ip: Vercel's trusted header (cannot be spoofed)
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // 2. x-forwarded-for: May be spoofed, use only as fallback
  // This header can contain multiple IPs: "client, proxy1, proxy2"
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP (client IP)
    const firstIp = forwardedFor.split(",")[0];
    if (firstIp) {
      return firstIp.trim();
    }
  }

  // 3. Fallback for local development
  return "127.0.0.1";
}
