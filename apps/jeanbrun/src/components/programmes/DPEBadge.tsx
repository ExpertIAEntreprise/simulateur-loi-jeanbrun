/**
 * DPEBadge.tsx
 * Echelle visuelle DPE A-G avec badge vert pour programmes neufs
 *
 * Server Component - Affiche le DPE vise (A ou B pour le neuf)
 *
 * @see Phase 6 du plan page-programme
 */

import { cn } from "@/lib/utils";

interface DPEBadgeProps {
  /** Classe DPE visee (defaut: "A" pour le neuf) */
  classeDPE?: string;
}

const DPE_CLASSES = [
  { label: "A", color: "bg-green-600", textColor: "text-white" },
  { label: "B", color: "bg-green-500", textColor: "text-white" },
  { label: "C", color: "bg-yellow-400", textColor: "text-gray-900" },
  { label: "D", color: "bg-yellow-500", textColor: "text-gray-900" },
  { label: "E", color: "bg-orange-500", textColor: "text-white" },
  { label: "F", color: "bg-red-500", textColor: "text-white" },
  { label: "G", color: "bg-red-700", textColor: "text-white" },
] as const;

export function DPEBadge({ classeDPE = "A" }: DPEBadgeProps) {
  const activeLabel = classeDPE.toUpperCase();

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">
        DPE vise : {activeLabel} - Performance energetique{" "}
        {activeLabel === "A" ? "maximale" : "elevee"}
      </p>

      {/* Echelle A-G */}
      <div className="flex gap-1" role="img" aria-label={`DPE classe ${activeLabel}`}>
        {DPE_CLASSES.map((classe) => {
          const isActive = classe.label === activeLabel;
          return (
            <div
              key={classe.label}
              className={cn(
                "flex h-8 flex-1 items-center justify-center rounded text-xs font-bold transition-all",
                classe.color,
                classe.textColor,
                isActive
                  ? "scale-110 ring-2 ring-offset-2 ring-green-600 shadow-lg"
                  : "opacity-40"
              )}
            >
              {classe.label}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Tous les logements neufs visent un DPE A ou B (RE2020).
      </p>
    </div>
  );
}
