import Link from 'next/link'
import { Building2, MapPin, Calendar, ArrowRight, Calculator } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const keyPoints = [
  {
    icon: Calculator,
    title: "Jusqu'a 12% de reduction",
    description: "Sur le montant de votre investissement immobilier",
  },
  {
    icon: MapPin,
    title: "Zones eligibles",
    description: "A bis, A et B1 en France metropolitaine",
  },
  {
    icon: Calendar,
    title: "Engagement 6 a 12 ans",
    description: "Duree de location minimum pour beneficier de l'avantage",
  },
] as const

export function HeroLoi() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge PLF 2026 */}
          <Badge className="mb-6 px-4 py-1.5 text-sm font-medium">
            <Building2 className="mr-2 h-4 w-4" />
            PLF 2026 - Nouveau dispositif fiscal
          </Badge>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Loi Jeanbrun 2026
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Le nouveau dispositif de defiscalisation immobiliere qui remplace la loi Pinel.
            Reduisez vos impots tout en investissant dans l&apos;immobilier neuf.
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">
                Simuler mon investissement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="#avantages-fiscaux">
                Decouvrir les avantages
              </Link>
            </Button>
          </div>

          {/* Key Points */}
          <div className="grid gap-6 md:grid-cols-3">
            {keyPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-xl border bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <point.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
