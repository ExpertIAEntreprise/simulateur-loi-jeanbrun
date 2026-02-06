"use client";

import { Award, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type ComplexiteLevel = "Faible" | "Moyenne" | "Elevee";

export interface RegimeData {
  reductionImpot: number;
  cashFlowMoyen: number;
  effortEpargne: number;
  rendementNet: number;
  fiscaliteRevente: string;
  complexite: ComplexiteLevel;
}

export interface ComparatifLMNPProps {
  jeanbrun: RegimeData;
  lmnp: RegimeData;
  className?: string;
}

interface CriteriaConfig {
  label: string;
  key: keyof RegimeData;
  format: (value: number | string) => string;
  higherIsBetter: boolean;
  isNumeric: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const CRITERIA: readonly CriteriaConfig[] = [
  {
    label: "Reduction d'impot totale",
    key: "reductionImpot",
    format: (v) => formatMontant(v as number),
    higherIsBetter: true,
    isNumeric: true,
  },
  {
    label: "Cash-flow moyen mensuel",
    key: "cashFlowMoyen",
    format: (v) => formatMontant(v as number) + "/mois",
    higherIsBetter: true,
    isNumeric: true,
  },
  {
    label: "Effort d'epargne mensuel",
    key: "effortEpargne",
    format: (v) => formatMontant(v as number) + "/mois",
    higherIsBetter: false, // Lower effort is better
    isNumeric: true,
  },
  {
    label: "Rendement net",
    key: "rendementNet",
    format: (v) => (v as number).toFixed(2) + " %",
    higherIsBetter: true,
    isNumeric: true,
  },
  {
    label: "Fiscalite a la revente",
    key: "fiscaliteRevente",
    format: (v) => v as string,
    higherIsBetter: true, // Determined by specific comparison
    isNumeric: false,
  },
  {
    label: "Complexite administrative",
    key: "complexite",
    format: (v) => v as string,
    higherIsBetter: false, // Lower complexity is better
    isNumeric: false,
  },
] as const;

const COMPLEXITE_SCORES: Record<ComplexiteLevel, number> = {
  Faible: 1,
  Moyenne: 2,
  Elevee: 3,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format a number in French locale with EUR symbol
 */
function formatMontant(value: number): string {
  return Math.round(value).toLocaleString("fr-FR") + " \u20ac";
}

/**
 * Compare two values and determine which is better
 * @returns 1 if first is better, -1 if second is better, 0 if equal
 */
function compareValues(
  jeanbrunValue: number | string,
  lmnpValue: number | string,
  higherIsBetter: boolean,
  isNumeric: boolean,
  key: keyof RegimeData
): { winner: "jeanbrun" | "lmnp" | "tie" } {
  if (!isNumeric) {
    // Handle complexite comparison
    if (key === "complexite") {
      const jeanbrunScore = COMPLEXITE_SCORES[jeanbrunValue as ComplexiteLevel];
      const lmnpScore = COMPLEXITE_SCORES[lmnpValue as ComplexiteLevel];

      if (jeanbrunScore === lmnpScore) return { winner: "tie" };
      // Lower complexity is better
      return { winner: jeanbrunScore < lmnpScore ? "jeanbrun" : "lmnp" };
    }
    // For fiscaliteRevente, we can't easily compare strings
    return { winner: "tie" };
  }

  const numJeanbrun = jeanbrunValue as number;
  const numLmnp = lmnpValue as number;

  if (Math.abs(numJeanbrun - numLmnp) < 0.01) {
    return { winner: "tie" };
  }

  if (higherIsBetter) {
    return { winner: numJeanbrun > numLmnp ? "jeanbrun" : "lmnp" };
  } else {
    return { winner: numJeanbrun < numLmnp ? "jeanbrun" : "lmnp" };
  }
}

/**
 * Calculate overall winner based on criteria scores
 */
function calculateOverallWinner(
  jeanbrun: RegimeData,
  lmnp: RegimeData
): { winner: "jeanbrun" | "lmnp" | "tie"; jeanbrunScore: number; lmnpScore: number } {
  let jeanbrunScore = 0;
  let lmnpScore = 0;

  for (const criteria of CRITERIA) {
    const { winner } = compareValues(
      jeanbrun[criteria.key],
      lmnp[criteria.key],
      criteria.higherIsBetter,
      criteria.isNumeric,
      criteria.key
    );

    if (winner === "jeanbrun") jeanbrunScore++;
    else if (winner === "lmnp") lmnpScore++;
  }

  if (jeanbrunScore === lmnpScore) {
    return { winner: "tie", jeanbrunScore, lmnpScore };
  }

  return {
    winner: jeanbrunScore > lmnpScore ? "jeanbrun" : "lmnp",
    jeanbrunScore,
    lmnpScore,
  };
}

// ============================================================================
// Sub-components
// ============================================================================

function WinnerIndicator({ winner }: { winner: "jeanbrun" | "lmnp" | "tie" }) {
  if (winner === "tie") {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
  if (winner === "jeanbrun") {
    return <TrendingUp className="h-4 w-4 text-success" />;
  }
  return <TrendingDown className="h-4 w-4 text-destructive" />;
}

function CriteriaRow({
  criteria,
  jeanbrunValue,
  lmnpValue,
}: {
  criteria: CriteriaConfig;
  jeanbrunValue: number | string;
  lmnpValue: number | string;
}) {
  const { winner } = compareValues(
    jeanbrunValue,
    lmnpValue,
    criteria.higherIsBetter,
    criteria.isNumeric,
    criteria.key
  );

  const jeanbrunWins = winner === "jeanbrun";
  const lmnpWins = winner === "lmnp";

  return (
    <div className="grid grid-cols-[1fr,auto,1fr] gap-4 py-3 border-b border-border last:border-0">
      {/* Jeanbrun value */}
      <div
        className={cn(
          "flex items-center justify-end gap-2 px-3 py-2 rounded-md transition-colors",
          jeanbrunWins && "bg-success/10"
        )}
      >
        <span
          className={cn(
            "font-mono text-sm",
            jeanbrunWins ? "text-success font-medium" : "text-foreground"
          )}
        >
          {criteria.format(jeanbrunValue)}
        </span>
        {jeanbrunWins && <WinnerIndicator winner="jeanbrun" />}
      </div>

      {/* Criteria label (center) */}
      <div className="flex items-center justify-center px-2">
        <span className="text-sm text-muted-foreground text-center whitespace-nowrap">
          {criteria.label}
        </span>
      </div>

      {/* LMNP value */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          lmnpWins && "bg-success/10"
        )}
      >
        {lmnpWins && <WinnerIndicator winner="lmnp" />}
        <span
          className={cn(
            "font-mono text-sm",
            lmnpWins ? "text-success font-medium" : "text-foreground"
          )}
        >
          {criteria.format(lmnpValue)}
        </span>
      </div>
    </div>
  );
}

function VerdictSection({
  winner,
  jeanbrunScore,
  lmnpScore,
}: {
  winner: "jeanbrun" | "lmnp" | "tie";
  jeanbrunScore: number;
  lmnpScore: number;
}) {
  const totalCriteria = CRITERIA.length;

  let verdictTitle: string;
  let verdictDescription: string;
  let verdictColor: string;

  if (winner === "tie") {
    verdictTitle = "Resultats equilibres";
    verdictDescription =
      "Les deux regimes presentent des avantages equivalents. Votre choix dependra de vos priorites (simplicite vs optimisation fiscale).";
    verdictColor = "text-muted-foreground";
  } else if (winner === "jeanbrun") {
    verdictTitle = "La Loi Jeanbrun est recommandee";
    verdictDescription =
      "Pour votre profil, le dispositif Jeanbrun offre de meilleurs avantages fiscaux et un meilleur rendement global sur la duree de l'investissement.";
    verdictColor = "text-success";
  } else {
    verdictTitle = "Le LMNP est recommande";
    verdictDescription =
      "Pour votre profil, le regime LMNP offre une meilleure optimisation. La Loi Jeanbrun reste interessante si vous privilegiez la reduction d'impot immediate.";
    verdictColor = "text-amber-500";
  }

  return (
    <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
            winner === "jeanbrun"
              ? "bg-success/10"
              : winner === "lmnp"
                ? "bg-amber-500/10"
                : "bg-muted"
          )}
        >
          <Award className={cn("h-5 w-5", verdictColor)} />
        </div>
        <div className="space-y-1">
          <h4 className={cn("font-semibold", verdictColor)}>{verdictTitle}</h4>
          <p className="text-sm text-muted-foreground">{verdictDescription}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Score: Jeanbrun {jeanbrunScore}/{totalCriteria} vs LMNP {lmnpScore}/
            {totalCriteria}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * ComparatifLMNP - Side-by-side comparison of Jeanbrun vs LMNP
 *
 * Features:
 * - 2-column layout with criteria in center
 * - Best value highlighted in green
 * - "Recommande" badge on winning column header
 * - Verdict section with explanation
 */
export function ComparatifLMNP({
  jeanbrun,
  lmnp,
  className,
}: ComparatifLMNPProps) {
  const { winner, jeanbrunScore, lmnpScore } = calculateOverallWinner(jeanbrun, lmnp);

  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Comparatif Jeanbrun vs LMNP</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Column headers */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 mb-4">
          {/* Jeanbrun header */}
          <div
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border",
              winner === "jeanbrun"
                ? "border-success bg-success/5"
                : "border-border bg-muted/20"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Loi Jeanbrun</span>
              {winner === "jeanbrun" && (
                <Badge className="bg-success text-success-foreground border-0">
                  Recommande
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">PLF 2026</span>
          </div>

          {/* Center spacer */}
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">vs</span>
          </div>

          {/* LMNP header */}
          <div
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border",
              winner === "lmnp"
                ? "border-success bg-success/5"
                : "border-border bg-muted/20"
            )}
          >
            <div className="flex items-center gap-2">
              {winner === "lmnp" && (
                <Badge className="bg-success text-success-foreground border-0">
                  Recommande
                </Badge>
              )}
              <span className="font-semibold text-foreground">LMNP</span>
            </div>
            <span className="text-xs text-muted-foreground">Regime actuel</span>
          </div>
        </div>

        {/* Criteria rows */}
        <div className="rounded-lg border border-border overflow-hidden">
          {CRITERIA.map((criteria) => (
            <CriteriaRow
              key={criteria.key}
              criteria={criteria}
              jeanbrunValue={jeanbrun[criteria.key]}
              lmnpValue={lmnp[criteria.key]}
            />
          ))}
        </div>

        {/* Verdict */}
        <VerdictSection
          winner={winner}
          jeanbrunScore={jeanbrunScore}
          lmnpScore={lmnpScore}
        />
      </CardContent>
    </Card>
  );
}
