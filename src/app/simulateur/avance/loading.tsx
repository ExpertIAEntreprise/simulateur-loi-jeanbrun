import { Skeleton } from "@/components/ui/skeleton"

export default function SimulateurLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec progress bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32 bg-muted" />
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-3 rounded-full bg-muted" />
              ))}
            </div>
          </div>
          {/* Progress bar */}
          <Skeleton className="h-1 w-full mt-4 bg-muted" />
        </div>
      </header>

      {/* Contenu */}
      <main className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Titre etape */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-muted" />
          <Skeleton className="h-4 w-72 bg-muted" />
        </div>

        {/* Formulaire skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-12 w-full bg-muted" />
          <Skeleton className="h-24 w-full bg-muted" />
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex justify-between">
          <Skeleton className="h-10 w-24 bg-muted" />
          <Skeleton className="h-10 w-32 bg-muted" />
        </div>
      </footer>
    </div>
  )
}
