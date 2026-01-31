import Image from 'next/image'
import Link from 'next/link'
import { User, Award, Calendar, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const expertise = [
  {
    icon: Award,
    title: "15+ ans d'experience",
    description: "Expert en defiscalisation immobiliere",
  },
  {
    icon: User,
    title: "500+ clients accompagnes",
    description: "Investisseurs particuliers et professionnels",
  },
  {
    icon: Calendar,
    title: "Conseils personnalises",
    description: "Rendez-vous gratuit sur Calendly",
  },
] as const

interface HeroProfilProps {
  name?: string
  title?: string
  tagline?: string
  image?: string
}

export function HeroProfil({
  name = "Expert Defiscalisation",
  title = "Expert en Defiscalisation Immobiliere",
  tagline = "Je vous accompagne dans vos projets d'investissement locatif et de reduction d'impots grace a la loi Jeanbrun.",
  image = "/images/profil/expert.webp",
}: HeroProfilProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Profile Header */}
          <div className="mb-12 flex flex-col items-center text-center md:flex-row md:text-left md:gap-8">
            {/* Profile Image */}
            <div className="mb-6 md:mb-0">
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-primary/20 shadow-lg md:h-48 md:w-48">
                <Image
                  src={image}
                  alt={`Photo de ${name}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <Badge className="mb-4 px-4 py-1.5 text-sm font-medium">
                <User className="mr-2 h-4 w-4" />
                {title}
              </Badge>

              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                {name}
              </h1>

              <p className="mb-6 max-w-2xl text-lg text-muted-foreground">
                {tagline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
                <Button asChild size="lg">
                  <Link href="#calendly">
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#biographie">
                    En savoir plus
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Expertise Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {expertise.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
