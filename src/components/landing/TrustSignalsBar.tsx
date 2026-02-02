import { Wallet, TrendingUp, Shield, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const trustBadges = [
  {
    icon: Wallet,
    text: "Jusqu'a 50 000EUR d'economie",
  },
  {
    icon: TrendingUp,
    text: "Plafond DOUBLE jusqu'en 2027",
  },
  {
    icon: Shield,
    text: "0EUR impot apres 22 ans",
  },
  {
    icon: Clock,
    text: "Resultat en 60 sec",
  },
] as const

export function TrustSignalsBar() {
  return (
    <section
      aria-label="Avantages cles"
      className="border-y border-border py-8 md:py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {trustBadges.map((badge) => (
            <div
              key={badge.text}
              className={cn(
                'flex flex-col items-center text-center p-4 rounded-lg',
                'hover:bg-muted transition-colors'
              )}
            >
              <badge.icon
                className="h-6 w-6 text-primary mb-2"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
