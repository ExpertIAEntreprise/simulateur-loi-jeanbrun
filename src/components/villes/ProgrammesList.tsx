import { Building2 } from "lucide-react";
import type { EspoProgramme } from "@/lib/espocrm/types";
import { cn } from "@/lib/utils";
import { ProgrammeCard } from "./ProgrammeCard";

interface ProgrammesListProps {
  /** List of programmes to display */
  programmes: EspoProgramme[];
  /** Maximum number of programmes to display (default: 6) */
  maxItems?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * ProgrammesList - Grid display of real estate programmes
 *
 * Features:
 * - Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
 * - Limits display to top 6 programmes (configurable)
 * - Empty state with helpful message
 * - Section title "Programmes neufs eligibles"
 * - Priority loading for first 2 images (LCP optimization)
 */
export function ProgrammesList({
  programmes,
  maxItems = 6,
  className,
}: ProgrammesListProps) {
  // Limit to maxItems programmes
  const displayedProgrammes = programmes.slice(0, maxItems);
  const hasNoProgrammes = displayedProgrammes.length === 0;

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="programmes-title">
      {/* Section title */}
      <h2
        id="programmes-title"
        className="text-2xl font-bold tracking-tight md:text-3xl"
      >
        Programmes neufs eligibles
      </h2>

      {hasNoProgrammes ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Building2
            className="mb-4 size-12 text-muted-foreground/50"
            aria-hidden="true"
          />
          <p className="text-lg font-medium text-muted-foreground">
            Aucun programme disponible
          </p>
          <p className="mt-1 text-sm text-muted-foreground/80">
            De nouveaux programmes seront bientot disponibles dans cette ville.
          </p>
        </div>
      ) : (
        /* Programmes grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProgrammes.map((programme, index) => (
            <ProgrammeCard
              key={programme.id}
              programme={programme}
              priority={index < 2}
            />
          ))}
        </div>
      )}
    </section>
  );
}
