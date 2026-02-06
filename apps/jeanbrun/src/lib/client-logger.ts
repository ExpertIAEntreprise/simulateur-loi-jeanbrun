/**
 * Client-side logger for browser environments
 *
 * Pino doesn't work in browsers, so we use a simple console wrapper
 * that respects production mode (silent) vs development mode (verbose).
 *
 * Usage:
 *   import { clientLogger } from "@/lib/client-logger";
 *   clientLogger.error("Something went wrong", error);
 */

/* eslint-disable no-console */

type LogLevel = "debug" | "info" | "warn" | "error";

interface ClientLogger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

const isDevelopment = process.env.NODE_ENV === "development";

function createClientLogger(): ClientLogger {
  const noop = () => {};

  const log = (level: LogLevel, message: string, ...args: unknown[]) => {
    // In production, only log errors and warnings
    if (!isDevelopment && level !== "error" && level !== "warn") {
      return;
    }

    const prefix = `[${level.toUpperCase()}]`;

    switch (level) {
      case "debug":
        console.debug(prefix, message, ...args);
        break;
      case "info":
        console.info(prefix, message, ...args);
        break;
      case "warn":
        console.warn(prefix, message, ...args);
        break;
      case "error":
        console.error(prefix, message, ...args);
        break;
    }
  };

  return {
    debug: isDevelopment ? (message, ...args) => log("debug", message, ...args) : noop,
    info: isDevelopment ? (message, ...args) => log("info", message, ...args) : noop,
    warn: (message, ...args) => log("warn", message, ...args),
    error: (message, ...args) => log("error", message, ...args),
  };
}

export const clientLogger = createClientLogger();
