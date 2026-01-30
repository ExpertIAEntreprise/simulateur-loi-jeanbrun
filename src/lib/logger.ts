/**
 * Structured logging with Pino
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info({ context: "auth" }, "User logged in");
 *   logger.error({ err: error, context: "api" }, "Request failed");
 *
 * Log levels: trace, debug, info, warn, error, fatal
 */

import pino, { type LoggerOptions } from "pino";

const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

/**
 * Build Pino options conditionally to satisfy exactOptionalPropertyTypes
 */
function buildLoggerOptions(): LoggerOptions {
  const baseOptions: LoggerOptions = {
    level: isTest ? "silent" : process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
    // Redact sensitive fields from logs
    redact: {
      paths: [
        "password",
        "secret",
        "token",
        "apiKey",
        "email",
        "resetUrl",
        "verificationUrl",
        "Authorization",
        "X-Api-Key",
      ],
      censor: "[REDACTED]",
    },
  };

  // Only add transport in development (pino-pretty)
  if (isDevelopment) {
    return {
      ...baseOptions,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
    };
  }

  return baseOptions;
}

/**
 * Pino logger configuration
 * - Pretty printing in development
 * - JSON output in production (for log aggregators)
 * - Silent in test mode
 */
export const logger = pino(buildLoggerOptions());

/**
 * Create a child logger with a specific context
 * Useful for categorizing logs by module/feature
 *
 * @example
 * const authLogger = createLogger("auth");
 * authLogger.info("User logged in");
 */
export function createLogger(context: string) {
  return logger.child({ context });
}

// Pre-configured loggers for common modules
export const authLogger = createLogger("auth");
export const dbLogger = createLogger("database");
export const apiLogger = createLogger("api");
export const emailLogger = createLogger("email");
export const espocrmLogger = createLogger("espocrm");
export const simulationLogger = createLogger("simulation");

export default logger;
