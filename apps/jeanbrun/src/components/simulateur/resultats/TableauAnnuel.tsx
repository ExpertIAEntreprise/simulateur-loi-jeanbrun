"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface TableauAnnuelData {
  annee: number;
  loyers: number;
  charges: number;
  interets: number;
  amortissement: number;
  reductionIR: number;
  cashFlow: number;
  patrimoine: number;
}

export interface TableauAnnuelProps {
  data: TableauAnnuelData[];
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format a number in French locale with EUR symbol
 * @example formatMontant(123456.78) => "123 456 EUR"
 */
function formatMontant(value: number): string {
  return Math.round(value).toLocaleString("fr-FR") + " \u20ac";
}

/**
 * Get current year for highlighting
 */
function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Calculate totals for all columns
 */
function calculateTotals(data: TableauAnnuelData[]): Omit<TableauAnnuelData, "annee" | "patrimoine"> & { patrimoine: number } {
  const totals = data.reduce(
    (acc, row) => ({
      loyers: acc.loyers + row.loyers,
      charges: acc.charges + row.charges,
      interets: acc.interets + row.interets,
      amortissement: acc.amortissement + row.amortissement,
      reductionIR: acc.reductionIR + row.reductionIR,
      cashFlow: acc.cashFlow + row.cashFlow,
    }),
    {
      loyers: 0,
      charges: 0,
      interets: 0,
      amortissement: 0,
      reductionIR: 0,
      cashFlow: 0,
    }
  );

  // Patrimoine is the last row's patrimoine (not a sum)
  const lastRow = data[data.length - 1];
  return {
    ...totals,
    patrimoine: lastRow?.patrimoine ?? 0,
  };
}

// ============================================================================
// Sub-components
// ============================================================================

function MontantCell({ value, isNegative }: { value: number; isNegative?: boolean }) {
  const shouldShowNegative = isNegative ?? value < 0;

  return (
    <span
      className={cn(
        "font-mono text-xs sm:text-sm",
        shouldShowNegative ? "text-destructive" : "text-foreground"
      )}
    >
      {formatMontant(value)}
    </span>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * TableauAnnuel - Detailed year-by-year breakdown table
 *
 * Features:
 * - Sticky header on vertical scroll
 * - Horizontal scroll on mobile
 * - Total row at bottom
 * - Current year row highlighted
 */
export function TableauAnnuel({
  data,
  className,
}: TableauAnnuelProps) {
  const currentYear = getCurrentYear();
  const totals = calculateTotals(data);

  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">
            Tableau detaille annee par annee
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-xs whitespace-nowrap"
          >
            {data.length} ans
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative px-2 sm:px-6">
        <div className="overflow-x-auto rounded-lg border border-border -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="sticky left-0 z-30 bg-muted/50 text-center font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    Annee
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    Loyers
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    Charges
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    Interets
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    Amort.
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    Reduction IR
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    Cash-flow
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    Patrimoine
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((row, index) => {
                  const isCurrentYear = row.annee === currentYear;
                  const isEvenRow = index % 2 === 0;

                  return (
                    <TableRow
                      key={row.annee}
                      className={cn(
                        "transition-colors",
                        isCurrentYear && "bg-accent/10",
                        !isCurrentYear && isEvenRow && "bg-card",
                        !isCurrentYear && !isEvenRow && "bg-muted/20"
                      )}
                    >
                      <TableCell className={cn(
                        "sticky left-0 z-10 text-center font-medium px-2 sm:px-4 py-2 sm:py-3",
                        isCurrentYear && "bg-accent/10",
                        !isCurrentYear && isEvenRow && "bg-card",
                        !isCurrentYear && !isEvenRow && "bg-muted/20"
                      )}>
                        <span className="whitespace-nowrap">
                          {row.annee}
                          {isCurrentYear && (
                            <span className="ml-1 sm:ml-2 text-xs text-accent-foreground hidden sm:inline">(actuelle)</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <MontantCell value={row.loyers} />
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <MontantCell value={row.charges} isNegative />
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <MontantCell value={row.interets} isNegative />
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <MontantCell value={row.amortissement} />
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <MontantCell value={row.reductionIR} />
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <MontantCell value={row.cashFlow} />
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <MontantCell value={row.patrimoine} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

              <TableFooter className="bg-muted/50">
                <TableRow className="font-semibold hover:bg-transparent">
                  <TableCell className="sticky left-0 z-10 bg-muted/50 text-center px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                    Total
                  </TableCell>
                  <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <MontantCell value={totals.loyers} />
                  </TableCell>
                  <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <MontantCell value={totals.charges} isNegative />
                  </TableCell>
                  <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <MontantCell value={totals.interets} isNegative />
                  </TableCell>
                  <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <MontantCell value={totals.amortissement} />
                  </TableCell>
                  <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <MontantCell value={totals.reductionIR} />
                  </TableCell>
                  <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <MontantCell value={totals.cashFlow} />
                  </TableCell>
                  <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <MontantCell value={totals.patrimoine} />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground px-2 sm:px-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm bg-accent/10 border border-accent/20 shrink-0" />
            <span>Annee en cours</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-destructive font-mono">-1 234 \u20ac</span>
            <span>Depense / sortie de tresorerie</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
