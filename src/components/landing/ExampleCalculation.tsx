"use client";

import { useMemo, useSyncExternalStore } from "react";
import { User, Building2, Calculator, TrendingDown, Sparkles } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface CalculationLine {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
  negative?: boolean;
}

const profileData = {
  tmi: 45,
  revenusFonciers: 30000,
  investissement: 300000,
} as const;

const calculationResults: CalculationLine[] = [
  {
    label: "Investissement",
    value: 300000,
    suffix: "\u00A0\u20AC",
  },
  {
    label: "Base amortissable (80%)",
    value: 240000,
    suffix: "\u00A0\u20AC",
  },
  {
    label: "Amortissement annuel (5%)",
    value: 12000,
    suffix: "\u00A0\u20AC/an",
  },
  {
    label: "Amortissement total (9 ans)",
    value: 108000,
    suffix: "\u00A0\u20AC",
  },
  {
    label: "Votre TMI",
    value: 45,
    suffix: "%",
  },
  {
    label: "Economie d'impot totale",
    value: 48600,
    suffix: "\u00A0\u20AC",
    highlight: true,
  },
] as const;

/**
 * Format a number to French locale with space as thousand separator
 */
function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("fr-FR");
}

/**
 * Easing function: easeOutQuart
 */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

interface AnimationStore {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => number;
  getServerSnapshot: () => number;
}

function createAnimationStore(duration: number): AnimationStore {
  let progress = 0;
  let startTime: number | null = null;
  let animationId: number | null = null;
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const animate = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    progress = Math.min(elapsed / duration, 1);

    notify();

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    }
  };

  return {
    subscribe: (callback: () => void) => {
      listeners.add(callback);
      if (listeners.size === 1 && animationId === null) {
        animationId = requestAnimationFrame(animate);
      }
      return () => {
        listeners.delete(callback);
        if (listeners.size === 0 && animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      };
    },
    getSnapshot: () => progress,
    getServerSnapshot: () => 1,
  };
}

function AnimatedValue({
  value,
  suffix = "",
  highlight = false,
  duration = 1500,
}: {
  value: number;
  suffix?: string | undefined;
  highlight?: boolean | undefined;
  duration?: number | undefined;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const store = useMemo(() => createAnimationStore(duration), [duration]);

  const progress = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const easedProgress = easeOutQuart(progress);
  const currentValue = prefersReducedMotion ? value : easedProgress * value;

  return (
    <span
      className={cn(
        "font-mono tabular-nums",
        highlight && "font-bold"
      )}
      style={
        highlight
          ? {
              color: "var(--anchor-amount)",
              textShadow: "var(--anchor-glow)",
            }
          : undefined
      }
    >
      {formatNumber(currentValue)}
      {suffix}
    </span>
  );
}

/**
 * ExampleCalculation - Exemple de calcul concret pour TMI 45%
 *
 * Features:
 * - Profil type: TMI 45%, 30 000EUR revenus fonciers, 300 000EUR investissement
 * - Animation des chiffres au scroll (respect prefers-reduced-motion)
 * - Mise en valeur du resultat final (48 600EUR)
 * - Design card avec icones
 */
export function ExampleCalculation() {
  return (
    <section
      aria-labelledby="example-calculation-title"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <h2
          id="example-calculation-title"
          className="text-2xl md:text-3xl font-serif text-center mb-4"
        >
          Un exemple <span className="text-primary">concret</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Decouvrez l'economie d'impot pour un investisseur type
        </p>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile card */}
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
              Profil investisseur
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" aria-hidden="true" />
                  Tranche marginale d'imposition
                </span>
                <span className="font-mono font-semibold text-primary">
                  {profileData.tmi}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calculator className="h-4 w-4" aria-hidden="true" />
                  Revenus fonciers existants
                </span>
                <span className="font-mono font-semibold">
                  {formatNumber(profileData.revenusFonciers)}{"\u00A0"}\u20AC/an
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  Investissement envisage
                </span>
                <span className="font-mono font-semibold">
                  {formatNumber(profileData.investissement)}{"\u00A0"}\u20AC
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Zone tres sociale - Logement neuf BBC
              </p>
            </div>
          </div>

          {/* Calculation card */}
          <div className="p-6 rounded-lg bg-card border border-primary/30 shadow-glow">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              Calcul de votre economie
            </h3>

            <div className="space-y-3">
              {calculationResults.map((line, index) => (
                <div
                  key={line.label}
                  className={cn(
                    "flex items-center justify-between py-2",
                    index < calculationResults.length - 1 && "border-b border-border/50",
                    line.highlight && "pt-4 mt-2 border-t-2 border-primary/50"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm",
                      line.highlight ? "font-semibold text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {line.label}
                  </span>
                  <AnimatedValue
                    value={line.value}
                    suffix={line.suffix}
                    highlight={line.highlight}
                    duration={1500 + index * 200}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-md bg-primary/10 border border-primary/30">
              <p className="text-sm text-center">
                <span className="text-muted-foreground">Soit environ </span>
                <span className="font-mono font-bold text-primary">5 400{"\u00A0"}\u20AC/an</span>
                <span className="text-muted-foreground"> d'economie d'impot</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
          * Simulation indicative basee sur un investissement de {formatNumber(profileData.investissement)}{"\u00A0"}\u20AC
          en zone tres sociale. Le resultat reel depend de votre situation personnelle et des caracteristiques du bien.
        </p>
      </div>
    </section>
  );
}

export default ExampleCalculation;
