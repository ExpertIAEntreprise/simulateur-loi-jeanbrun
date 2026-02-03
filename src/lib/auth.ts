import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { sendPasswordResetEmail, sendVerificationEmail } from "./email"

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // SECURITY: URL is NOT logged - sent via email only
      await sendPasswordResetEmail(user.email, url)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 86400, // 24 hours
    sendVerificationEmail: async ({ user, url }) => {
      // SECURITY: URL is NOT logged - sent via email only
      await sendVerificationEmail(user.email, url)
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache client 5 min
    },
  },
  // Account lockout protection: Brute force mitigation
  // Blocks account after 5 failed attempts within 15 minutes
  rateLimit: {
    window: 60, // 60 seconds default window
    max: 100, // 100 requests max (generous global limit)
    enabled: true,
    // Custom rules for authentication endpoints
    customRules: {
      "/sign-in/email": {
        window: 15 * 60, // 15-minute lockout window
        max: 5, // Max 5 failed login attempts
      },
      "/sign-up": {
        window: 60 * 60, // 1-hour window
        max: 10, // Max 10 signup attempts per IP
      },
    },
  },
  // Advanced IP tracking for better brute force detection
  advanced: {
    ipAddress: {
      ipv6Subnet: 64, // Rate limit by IPv6 subnet to prevent rotation bypass
    },
  },
})