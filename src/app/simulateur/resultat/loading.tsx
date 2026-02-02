import { Skeleton } from "@/components/ui/skeleton"

export default function ResultatLoading() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-muted" />
        <Skeleton className="h-4 w-96 bg-muted" />
      </div>

      {/* Synthese - 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full bg-muted" />
        ))}
      </div>

      {/* Graphique */}
      <Skeleton className="h-[400px] w-full bg-muted" />

      {/* Financement */}
      <Skeleton className="h-64 w-full bg-muted" />

      {/* Premium sections */}
      <Skeleton className="h-96 w-full bg-muted" />
      <Skeleton className="h-96 w-full bg-muted" />
    </div>
  )
}
