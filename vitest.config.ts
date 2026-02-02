import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["**/node_modules/**", "**/e2e/**", "**/*.e2e.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        // Seuils globaux - ajustes pour cette phase (composants principaux couverts)
        lines: 50,
        functions: 35,
        branches: 40,
        statements: 50,
      },
      include: [
        "src/lib/calculs/**/*.ts",
        "src/components/simulateur/**/*.tsx",
        "src/contexts/**/*.tsx",
        "src/lib/hooks/**/*.ts",
      ],
      exclude: [
        "src/lib/calculs/__tests__/**",
        "src/lib/calculs/index.ts",
        "src/lib/calculs/types.ts",
        "src/lib/calculs/types/**",
        "src/lib/calculs/constants.ts",
        "src/components/simulateur/__tests__/**",
        "src/components/simulateur/**/index.ts",
        // Composants non prioritaires pour cette phase
        "src/components/simulateur/etape-4/**",
        "src/components/simulateur/etape-5/**",
        "src/components/simulateur/etape-6/**",
        "src/components/simulateur/resultats/**",
        "src/contexts/__tests__/**",
        "src/lib/hooks/__tests__/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
