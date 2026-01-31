'use client'

import { useEffect, useState } from 'react'
import { Calendar, ArrowRight, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface CalendlyEmbedProps {
  calendlyUrl?: string
  title?: string
  description?: string
}

export function CalendlyEmbed({
  calendlyUrl = "https://calendly.com/expert-jeanbrun/consultation",
  title = "Reservez votre consultation gratuite",
  description = "30 minutes pour analyser votre situation fiscale et decouvrir comment la loi Jeanbrun peut vous aider a reduire vos impots.",
}: CalendlyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasCalendly, setHasCalendly] = useState(false)

  useEffect(() => {
    // Check if Calendly script is available
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    script.onload = () => {
      setHasCalendly(true)
      setIsLoading(false)
    }
    script.onerror = () => {
      setIsLoading(false)
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <section id="calendly" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Calendar className="mr-2 h-4 w-4" />
              Rendez-vous
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Calendly Embed or Fallback */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Consultation personnalisee
              </CardTitle>
              <CardDescription>
                Choisissez un creneau qui vous convient
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              ) : hasCalendly ? (
                <div
                  className="calendly-inline-widget min-h-[630px] w-full"
                  data-url={calendlyUrl}
                />
              ) : (
                /* Fallback if Calendly fails to load */
                <div className="py-8 text-center">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-semibold">
                    Prenez rendez-vous directement
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Cliquez sur le bouton ci-dessous pour acceder a mon calendrier
                  </p>
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Button asChild size="lg">
                      <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                        Ouvrir Calendly
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href="mailto:contact@simulateur-jeanbrun.fr">
                        M&apos;envoyer un email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits List */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: "Gratuit", description: "Premiere consultation offerte" },
              { title: "Sans engagement", description: "Decouvrez vos options" },
              { title: "30 minutes", description: "Analyse personnalisee" },
            ].map((benefit) => (
              <div key={benefit.title} className="rounded-lg border bg-card p-4 text-center">
                <h4 className="font-semibold text-primary">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
