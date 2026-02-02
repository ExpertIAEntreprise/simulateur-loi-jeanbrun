"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

interface SimulateurErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SimulateurError({ error, reset }: SimulateurErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking (Sentry, etc.)
      console.error("Simulateur error:", error.digest)
    } else {
      console.error("Simulateur error:", error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
          <p className="text-muted-foreground">
            {error.message || "Impossible de charger le simulateur."}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Code erreur: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} variant="default">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reessayer
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Retour a l&apos;accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
