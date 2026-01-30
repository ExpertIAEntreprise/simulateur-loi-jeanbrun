import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Load .env.local for local development
config({ path: ".env.local" });

export default {
  dialect: "postgresql",
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
