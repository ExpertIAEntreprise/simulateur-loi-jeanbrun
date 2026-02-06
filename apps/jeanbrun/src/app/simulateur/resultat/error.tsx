"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

interface ResultatErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ResultatError({ error, reset }: ResultatErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking (Sentry, etc.)
      console.error("Resultat error:", error.digest)
    } else {
      console.error("Resultat error:", error)
    }
  }, [error])

  return (
    <div className="container max-w-5xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
          <p className="text-muted-foreground max-w-md">
            {error.message || "Impossible de charger les resultats de votre simulation."}
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
            <Link href="/simulateur/avance">
              <Home className="h-4 w-4 mr-2" />
              Recommencer la simulation
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
