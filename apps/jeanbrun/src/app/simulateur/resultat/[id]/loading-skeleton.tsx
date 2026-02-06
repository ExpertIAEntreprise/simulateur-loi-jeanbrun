/**
 * Loading skeleton pour la page resultats
 * @module simulateur/resultat/loading-skeleton
 */

import { Skeleton } from "@/components/ui/skeleton";

export function ResultatLoadingSkeleton() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Synthese */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>

      {/* Graphique */}
      <Skeleton className="h-[400px] w-full" />

      {/* Financement */}
      <Skeleton className="h-64 w-full" />

      {/* Detailed sections */}
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
