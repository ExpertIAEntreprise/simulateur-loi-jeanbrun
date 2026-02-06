import { GraduationCap, Briefcase, Building, Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface Milestone {
  year: string
  title: string
  description: string
  icon: LucideIcon
}

const defaultMilestones: Milestone[] = [
  {
    year: "2008",
    title: "Diplome en Gestion de Patrimoine",
    description: "Master 2 en Gestion de Patrimoine et Ingenierie Financiere a l'Universite Paris-Dauphine",
    icon: GraduationCap,
  },
  {
    year: "2010",
    title: "Debut en Cabinet de Conseil",
    description: "Integration d'un cabinet de conseil en gestion de patrimoine specialise dans la defiscalisation",
    icon: Briefcase,
  },
  {
    year: "2015",
    title: "Creation de mon Cabinet",
    description: "Lancement de mon propre cabinet de conseil en investissement immobilier et optimisation fiscale",
    icon: Building,
  },
  {
    year: "2026",
    title: "Lancement du Simulateur Jeanbrun",
    description: "Creation du premier simulateur gratuit dedie a la nouvelle loi Jeanbrun (PLF 2026)",
    icon: Rocket,
  },
]

interface TimelineProps {
  milestones?: Milestone[]
}

export function Timeline({ milestones = defaultMilestones }: TimelineProps) {
  return (
    <section id="parcours" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Briefcase className="mr-2 h-4 w-4" />
              Parcours
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Mon parcours professionnel
            </h2>
            <p className="text-lg text-muted-foreground">
              Plus de 15 ans d&apos;experience au service de vos projets immobiliers
            </p>
          </div>

          {/* Timeline */}
          <div className="relative space-y-8">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-primary/20 md:left-1/2 md:-translate-x-1/2" />

            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              const isEven = index % 2 === 0

              return (
                <div key={milestone.year} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-8 top-6 z-10 -translate-x-1/2 md:left-1/2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border-4 border-background bg-primary" />
                  </div>

                  {/* Content card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    <Card className="transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge variant="secondary">{milestone.year}</Badge>
                        </div>
                        <CardTitle className="mt-3 text-lg">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">
                          {milestone.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
