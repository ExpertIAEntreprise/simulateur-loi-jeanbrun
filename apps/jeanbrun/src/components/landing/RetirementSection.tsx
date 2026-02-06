import { Clock, CheckCircle2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const timelineSteps = [
  {
    year: 9,
    title: "Fin d'engagement",
    description: "Periode minimum de location. Vous avez amorti jusqu'a 108 000\u00A0\u20AC.",
    icon: Clock,
    highlight: false,
  },
  {
    year: 22,
    title: "0% impot sur la plus-value IR",
    description: "Exoneration totale de l'impot sur le revenu (19%) sur la plus-value immobiliere.",
    icon: CheckCircle2,
    highlight: true,
  },
  {
    year: 30,
    title: "0% prelevements sociaux",
    description: "Exoneration complete des prelevements sociaux (17,2%). Votre patrimoine est totalement transmissible.",
    icon: Sparkles,
    highlight: true,
  },
] as const

const retirementAdvantages = [
  {
    title: "Revenus complementaires",
    description: "Les loyers perçus constituent un complement de retraite regulier",
  },
  {
    title: "Capital protege",
    description: "Votre investissement immobilier est a l'abri de l'inflation",
  },
  {
    title: "Patrimoine transmissible",
    description: "Un actif tangible a transmettre a vos heritiers avec avantages fiscaux",
  },
] as const

/**
 * RetirementSection - Section retraite avec timeline verticale
 *
 * Features:
 * - Timeline verticale 9 → 22 → 30 ans
 * - Highlight sur les annees cles (22 et 30 ans)
 * - 3 avantages retraite en grille
 * - Accessibilite: aria-labelledby, role="list"
 */
export function RetirementSection() {
  return (
    <section
      aria-labelledby="retirement-section-title"
      className="py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <h2
          id="retirement-section-title"
          className="text-2xl md:text-3xl font-serif text-center mb-4"
        >
          Preparez votre <span className="text-primary">retraite</span> sereinement
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Un investissement qui vous accompagne sur le long terme avec des avantages croissants
        </p>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto mb-16">
          <div
            role="list"
            aria-label="Etapes temporelles de l'investissement"
            className="relative"
          >
            {/* Vertical line */}
            <div
              className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-border"
              aria-hidden="true"
            />

            {timelineSteps.map((step, index) => (
              <div
                key={step.year}
                role="listitem"
                className={cn(
                  'relative flex gap-4 md:gap-6 pb-8 last:pb-0',
                  index !== timelineSteps.length - 1 && 'mb-4'
                )}
              >
                {/* Circle with icon */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center',
                    'w-12 h-12 md:w-16 md:h-16 rounded-full',
                    'border-2 transition-all',
                    step.highlight
                      ? 'bg-primary/10 border-primary shadow-glow'
                      : 'bg-card border-border'
                  )}
                >
                  <step.icon
                    className={cn(
                      'h-5 w-5 md:h-6 md:w-6',
                      step.highlight ? 'text-primary' : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className={cn(
                        'font-mono text-2xl md:text-3xl font-bold',
                        step.highlight ? 'text-primary' : 'text-foreground'
                      )}
                      style={step.highlight ? {
                        color: 'var(--anchor-amount)',
                        textShadow: 'var(--anchor-glow)',
                      } : undefined}
                    >
                      {step.year} ans
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retirement advantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {retirementAdvantages.map((advantage) => (
            <div
              key={advantage.title}
              className="p-6 rounded-lg bg-card border border-border text-center"
            >
              <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
              <p className="text-sm text-muted-foreground">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RetirementSection
