import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          Simulateur PTZ 2026
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Stop Loyer
        </h1>
        <p className="mb-2 text-xl text-muted-foreground">
          Arrêtez de payer l'appartement des autres.
        </p>
        <p className="mb-8 text-lg text-muted-foreground">
          Découvrez si vous êtes éligible au Prêt à Taux Zéro et devenez propriétaire dans le neuf en 2026.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Simuler mon éligibilité
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-sm text-muted-foreground">
            Gratuit, sans inscription, résultat immédiat
          </p>
        </div>
        <div className="mt-12 rounded-xl border bg-card p-6 text-left">
          <h2 className="mb-3 text-lg font-semibold text-card-foreground">
            Bientôt disponible
          </h2>
          <p className="text-sm text-muted-foreground">
            Le simulateur PTZ stop-loyer.fr est en cours de développement.
            Revenez bientôt pour découvrir si vous pouvez devenir propriétaire
            dans le neuf avec un prêt sans intérêts.
          </p>
        </div>
      </div>
    </main>
  );
}
