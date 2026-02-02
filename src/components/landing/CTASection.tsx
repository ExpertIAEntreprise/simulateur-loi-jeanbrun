import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * CTASection - Section CTA finale avec effet glow
 *
 * Features:
 * - Background noir avec gradient subtil
 * - Titre angle retraite
 * - Bouton avec effet pulse/glow
 * - Accessibilite: aria-label sur section
 */
export function CTASection() {
  return (
    <section
      aria-label="Appel a l'action"
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"
        aria-hidden="true"
      />

      {/* Glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <Sparkles
            className="h-12 w-12 text-primary animate-pulse"
            aria-hidden="true"
          />
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 max-w-3xl mx-auto">
          Preparez votre{" "}
          <span
            className="text-primary"
            style={{
              textShadow: "var(--anchor-glow)",
            }}
          >
            avenir fiscal
          </span>{" "}
          maintenant
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Decouvrez en 60 secondes combien vous pouvez economiser avec la Loi Jeanbrun.
          Simulation gratuite et sans engagement.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className={cn(
              "text-lg px-8 py-6 h-auto",
              "animate-glow hover:shadow-glow-lg",
              "transition-all duration-300"
            )}
          >
            <Link href="/simulateur">
              Je calcule mon economie d'impot
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Rejoint par plus de{" "}
          <span className="font-semibold text-foreground">2 500</span>{" "}
          investisseurs cette annee
        </p>
      </div>
    </section>
  )
}

export default CTASection
