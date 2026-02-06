/**
 * SectionFiscalite.tsx
 * Explication Loi Jeanbrun + conditions eligibilite + avantages chiffres + DPE
 *
 * Server Component - Contenu statique SEO-friendly
 *
 * @see Phase 6 du plan page-programme
 */

import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  Euro,
  Home,
  MapPin,
  Shield,
  Wrench,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DPEBadge } from "@/components/programmes/DPEBadge";
import { FRAIS_ACQUISITION, JEANBRUN_NEUF } from "@/lib/calculs/constants";

interface SectionFiscaliteProps {
  /** Zone fiscale du programme */
  zoneFiscale: string;
  /** Prix minimum du programme en euros */
  prixMin: number | null;
  /** Economie impot annuelle estimee (reprise du hero) */
  economieImpotAnnuelle: number | null;
  /** Slug du programme pour le lien simulateur */
  programmeSlug: string;
}

/** Labels lisibles pour les zones */
const ZONE_LABELS: Record<string, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

/**
 * Format prix en EUR
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function SectionFiscalite({
  zoneFiscale,
  prixMin,
  economieImpotAnnuelle,
  programmeSlug,
}: SectionFiscaliteProps) {
  const zoneLabel = ZONE_LABELS[zoneFiscale] ?? zoneFiscale;

  // Calculs des avantages neuf vs ancien
  const fraisNotaireNeuf = prixMin != null ? Math.round(prixMin * FRAIS_ACQUISITION.tauxNeuf) : null;
  const fraisNotaireAncien = prixMin != null ? Math.round(prixMin * FRAIS_ACQUISITION.tauxAncien) : null;
  const economieNotaire =
    fraisNotaireNeuf != null && fraisNotaireAncien != null
      ? fraisNotaireAncien - fraisNotaireNeuf
      : null;

  // Economie impot sur 9 ans
  const economieImpot9ans =
    economieImpotAnnuelle != null ? economieImpotAnnuelle * JEANBRUN_NEUF.dureeEngagement : null;

  return (
    <div className="space-y-8">
      {/* Explication Loi Jeanbrun */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-primary" aria-hidden="true" />
            La Loi Jeanbrun en bref
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            La <strong>Loi Jeanbrun</strong> (PLF 2026) est un dispositif de
            defiscalisation immobiliere qui permet aux investisseurs de deduire
            une partie du prix d&apos;acquisition de leurs impots en echange
            d&apos;un engagement de location a loyer plafonne pendant{" "}
            <strong>{JEANBRUN_NEUF.dureeEngagement} ans</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour un logement neuf, la base d&apos;amortissement est de{" "}
            <strong>{JEANBRUN_NEUF.baseAmortissement * 100}%</strong> du prix
            d&apos;acquisition. Le taux d&apos;amortissement varie de{" "}
            <strong>
              {JEANBRUN_NEUF.niveaux.intermediaire.taux * 100}% a{" "}
              {JEANBRUN_NEUF.niveaux.tres_social.taux * 100}%
            </strong>{" "}
            selon le niveau de loyer pratique.
          </p>
        </CardContent>
      </Card>

      {/* Conditions d'eligibilite */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Conditions d&apos;eligibilite</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Home className="size-5 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">Logement neuf</p>
              <p className="text-sm text-muted-foreground">
                Logement neuf ou en VEFA (vente en l&apos;etat futur d&apos;achevement)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <MapPin className="size-5 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">Zone eligible</p>
              <p className="text-sm text-muted-foreground">
                Ce programme est en{" "}
                <Badge variant="outline" className="ml-1">
                  Zone {zoneLabel}
                </Badge>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
              <Clock className="size-5 text-orange-600" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">Engagement de location</p>
              <p className="text-sm text-muted-foreground">
                Location pendant {JEANBRUN_NEUF.dureeEngagement} ans minimum a
                loyer plafonne
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Euro className="size-5 text-purple-600" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">Plafonds de loyers</p>
              <p className="text-sm text-muted-foreground">
                Loyers plafonnes selon la zone fiscale et le niveau de loyer
                choisi
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Avantages chiffres */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Avantages du neuf</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Economie frais de notaire */}
          <Card className="border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10">
            <CardContent className="flex items-start gap-3 py-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" aria-hidden="true" />
              <div>
                <p className="font-medium">Frais de notaire reduits</p>
                <p className="text-sm text-muted-foreground">
                  ~3% dans le neuf vs ~8% dans l&apos;ancien
                </p>
                {economieNotaire != null && (
                  <p className="mt-1 text-sm font-semibold text-green-700 dark:text-green-400">
                    Economie estimee : {formatPrice(economieNotaire)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 0 travaux */}
          <Card className="border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10">
            <CardContent className="flex items-start gap-3 py-4">
              <Wrench className="mt-0.5 size-5 shrink-0 text-green-600" aria-hidden="true" />
              <div>
                <p className="font-medium">0 travaux</p>
                <p className="text-sm text-muted-foreground">
                  Logement neuf = pas de renovation, pas de mauvaise surprise
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Charges reduites */}
          <Card className="border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10">
            <CardContent className="flex items-start gap-3 py-4">
              <Zap className="mt-0.5 size-5 shrink-0 text-green-600" aria-hidden="true" />
              <div>
                <p className="font-medium">Charges divisees par 3</p>
                <p className="text-sm text-muted-foreground">
                  RE2020, isolation performante, equipements basse consommation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Economie impot */}
          <Card className="border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10">
            <CardContent className="flex items-start gap-3 py-4">
              <Building2 className="mt-0.5 size-5 shrink-0 text-green-600" aria-hidden="true" />
              <div>
                <p className="font-medium">Economie d&apos;impot</p>
                {economieImpotAnnuelle != null ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Estimee a {formatPrice(economieImpotAnnuelle)}/an (TMI 30%)
                    </p>
                    {economieImpot9ans != null && (
                      <p className="mt-1 text-sm font-semibold text-green-700 dark:text-green-400">
                        Soit {formatPrice(economieImpot9ans)} sur{" "}
                        {JEANBRUN_NEUF.dureeEngagement} ans
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Utilisez le simulateur pour calculer votre economie
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* DPE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Diagnostic de Performance Energetique</CardTitle>
        </CardHeader>
        <CardContent>
          <DPEBadge classeDPE="A" />
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-primary/5 p-6 text-center">
        <p className="text-lg font-semibold">
          Calculez votre economie d&apos;impot exacte
        </p>
        <p className="max-w-lg text-sm text-muted-foreground">
          Notre simulateur avance prend en compte votre revenu, votre situation
          familiale et le lot choisi pour un calcul personnalise.
        </p>
        <Button asChild size="lg">
          <Link href={`/simulateur/avance?programme=${programmeSlug}`}>
            Simuler mon economie d&apos;impot
          </Link>
        </Button>
      </div>
    </div>
  );
}
