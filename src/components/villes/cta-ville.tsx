import Link from "next/link";
import { Calculator, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ZoneFiscale } from "@/types/ville";

const ZONE_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

interface CTAVilleProps {
  villeNom: string;
  villeSlug: string;
  zoneFiscale: ZoneFiscale | null;
}

/**
 * CTA conversion pour les pages villes
 * Incite l'utilisateur a simuler son investissement ou prendre RDV
 */
export function CTAVille({ villeNom, villeSlug, zoneFiscale }: CTAVilleProps) {
  return (
    <section aria-labelledby="cta-ville" className="my-12">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
        <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center md:px-12">
          <h2
            id="cta-ville"
            className="text-2xl font-bold tracking-tight md:text-3xl"
          >
            Simulez votre investissement a {villeNom}
          </h2>

          {zoneFiscale && (
            <Badge variant="secondary" className="text-sm">
              Zone {ZONE_LABELS[zoneFiscale]}
            </Badge>
          )}

          <p className="max-w-lg text-muted-foreground">
            Decouvrez votre economie d&apos;impot avec la Loi Jeanbrun 2026.
            Simulation gratuite, resultat immediat.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={`/simulateur?ville=${villeSlug}`}>
                <Calculator className="mr-2 size-4" aria-hidden="true" />
                Lancer ma simulation gratuite
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/a-propos#contact">
                <CalendarDays className="mr-2 size-4" aria-hidden="true" />
                Prendre RDV avec un expert
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
