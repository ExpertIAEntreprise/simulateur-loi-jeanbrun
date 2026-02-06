import { Wallet, TrendingUp, Shield, Coins, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const featureCards = [
  {
    icon: Wallet,
    title: "50 000\u00A0\u20AC d'economie",
    description: "Jusqu'a 12 000\u00A0\u20AC/an d'amortissement deductible pour les TMI 45%",
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: "Plafond DOUBLE jusqu'en 2027",
    description: "21 400\u00A0\u20AC/an deductible au lieu de 10 700\u00A0\u20AC apres",
    highlight: true,
    badge: "Offre limitee",
  },
  {
    icon: Shield,
    title: "0\u00A0\u20AC impot a 22 ans",
    description: "Exoneration totale de la plus-value IR + PS apres 30 ans de detention",
    highlight: false,
  },
  {
    icon: Coins,
    title: "Amortissements acquis",
    description: "Jamais reintegres a la revente, contrairement au regime LMNP",
    highlight: false,
  },
] as const

/**
 * FeatureCards - 4 cards d'avantages avec angle retraite
 *
 * Features:
 * - Grid responsive 2x2 mobile, 4x1 desktop
 * - Badge "Offre limitee" sur la card bonification 2027
 * - Icones Lucide avec couleur accent
 * - Accessibilite: aria-label sur section, aria-hidden sur icones decoratives
 */
export function FeatureCards() {
  return (
    <section
      aria-label="Avantages du dispositif Jeanbrun"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-4">
          Pourquoi choisir la <span className="text-primary">Loi Jeanbrun</span> ?
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Le dispositif d'excellence pour preparer votre retraite et reduire vos impots
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className={cn(
                'relative flex flex-col p-6 rounded-lg border transition-all',
                'hover:shadow-glow hover:border-primary/50',
                card.highlight
                  ? 'bg-primary/5 border-primary/30'
                  : 'bg-card border-border'
              )}
            >
              {card.highlight && card.badge && (
                <span className="absolute -top-3 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  {card.badge}
                </span>
              )}

              <card.icon
                className="h-10 w-10 text-primary mb-4"
                aria-hidden="true"
              />

              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>

              <p className="text-sm text-muted-foreground flex-grow">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureCards
