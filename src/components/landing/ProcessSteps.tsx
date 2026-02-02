import { Calculator, FileText, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const processSteps = [
  {
    number: 1,
    icon: Calculator,
    title: "Simulez",
    description: "Renseignez votre situation fiscale en 60 secondes. Notre algorithme calcule votre economie d'impot personnalisee.",
  },
  {
    number: 2,
    icon: FileText,
    title: "Recevez",
    description: "Obtenez immediatement votre estimation detaillee avec le montant exact de votre reduction d'impot sur 9 ans.",
  },
  {
    number: 3,
    icon: Phone,
    title: "Contactez",
    description: "Un expert vous rappelle sous 24h pour affiner votre projet et vous presenter les programmes eligibles.",
  },
] as const

/**
 * ProcessSteps - 3 etapes du processus avec connecteurs visuels
 *
 * Features:
 * - 3 etapes numerotees avec icones
 * - Connecteurs visuels entre les etapes (desktop)
 * - Layout responsive (vertical mobile, horizontal desktop)
 * - Accessibilite: role="list", aria-label
 */
export function ProcessSteps() {
  return (
    <section
      aria-label="Comment ca marche"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-4">
          Comment <span className="text-primary">ca marche</span> ?
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Trois etapes simples pour decouvrir votre economie d'impot
        </p>

        <div
          role="list"
          aria-label="Etapes du processus"
          className="relative max-w-5xl mx-auto"
        >
          {/* Horizontal connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-border"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                role="listitem"
                className="relative flex flex-col items-center text-center"
              >
                {/* Vertical connector (mobile only) */}
                {index < processSteps.length - 1 && (
                  <div
                    className="md:hidden absolute top-32 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border"
                    aria-hidden="true"
                  />
                )}

                {/* Step number with icon */}
                <div className="relative mb-6">
                  {/* Background circle */}
                  <div
                    className={cn(
                      'w-32 h-32 rounded-full flex items-center justify-center',
                      'bg-card border-2 border-border',
                      'transition-all hover:border-primary/50 hover:shadow-glow'
                    )}
                  >
                    <step.icon
                      className="h-12 w-12 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Number badge */}
                  <span
                    className={cn(
                      'absolute -top-2 -right-2',
                      'w-10 h-10 rounded-full',
                      'flex items-center justify-center',
                      'bg-primary text-primary-foreground',
                      'font-mono text-lg font-bold'
                    )}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSteps
