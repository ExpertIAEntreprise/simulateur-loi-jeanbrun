/**
 * ProgrammeHero.tsx
 * Hero section pour la page detail programme
 *
 * Server Component - KPIs calcules cote serveur
 * Affiche image principale + sidebar KPIs investisseur
 */

import Image from "next/image";
import {
  Building2,
  Calendar,
  Euro,
  MapPin,
  PiggyBank,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { EspoProgramme } from "@/lib/espocrm/types";
import type { KPIsInvestisseur } from "@/lib/calculs/investisseur-kpis";

interface ProgrammeHeroProps {
  programme: EspoProgramme;
  kpis: KPIsInvestisseur | null;
  villeName: string | null;
}

/**
 * Labels des zones fiscales
 */
const ZONE_LABELS: Record<string, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

/**
 * Format prix en EUR (ex: 250 000 EUR)
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format date ISO vers mois + annee francais (ex: "janvier 2027")
 */
function formatDeliveryDate(dateString: string | null | undefined): string {
  if (!dateString) return "Non communiquee";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Verifie qu'une URL d'image est valide pour Next.js Image
 * Rejette les paths relatifs de CMS externes (ex: /sites/default/files/...)
 */
function isValidImageUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}

/**
 * Nettoie une URL d'image pour Next.js Image
 * Les images locales (commencant par /) ne doivent pas avoir de query strings
 * sauf si configurees dans localPatterns
 */
function sanitizeImageUrl(url: string): string | null {
  if (!isValidImageUrl(url)) return null;
  // Les URLs absolues (http/https) sont gerees par remotePatterns
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Les paths locaux avec query strings ne sont pas supportes par defaut
  if (url.includes("?")) return null;
  return url;
}

/**
 * Resout l'image principale du programme
 */
function resolveImage(programme: EspoProgramme): string | null {
  if (programme.imagePrincipale) {
    const sanitized = sanitizeImageUrl(programme.imagePrincipale);
    if (sanitized) return sanitized;
  }
  if (!programme.images) return null;
  try {
    const parsed: unknown = JSON.parse(programme.images);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      const sanitized = sanitizeImageUrl(parsed[0] as string);
      if (sanitized) return sanitized;
    }
  } catch {
    // ignore
  }
  return null;
}

export function ProgrammeHero({ programme, kpis, villeName }: ProgrammeHeroProps) {
  const imageUrl = resolveImage(programme);
  const zoneFiscale = programme.zoneFiscale ?? "B1";
  const zoneLabel = ZONE_LABELS[zoneFiscale] ?? zoneFiscale;

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {/* Image principale (2/3) */}
      <div className="lg:col-span-2">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={programme.imageAlt ?? `Programme immobilier ${programme.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5"
              role="img"
              aria-label={`Programme immobilier ${programme.name}`}
            >
              <Building2 className="size-24 text-primary/30" aria-hidden="true" />
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {programme.promoteur && (
              <Badge variant="secondary" className="bg-white/90 text-foreground capitalize">
                {programme.promoteur}
              </Badge>
            )}
            <Badge className="bg-blue-600 text-white hover:bg-blue-600">
              <MapPin className="mr-1 size-3" aria-hidden="true" />
              Zone {zoneLabel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Sidebar KPIs investisseur (1/3) */}
      <div className="flex flex-col gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">KPIs Investisseur</CardTitle>
            <p className="text-xs text-muted-foreground">
              Estimations basees sur TMI 30%, credit 20 ans, taux 3.4%
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpis ? (
              <>
                {/* Loyer estime */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                    <Euro className="size-4 text-green-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loyer estime</p>
                    <p className="text-lg font-semibold tabular-nums">
                      {formatPrice(kpis.loyerEstimeMensuel)}/mois
                    </p>
                  </div>
                </div>

                {/* Economie impot */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                    <PiggyBank className="size-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Economie impot/an</p>
                    <p className="text-lg font-semibold tabular-nums text-primary">
                      {formatPrice(kpis.economieImpotAnnuelle)}
                    </p>
                  </div>
                </div>

                {/* Effort mensuel */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                    <Wallet className="size-4 text-orange-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Effort mensuel</p>
                    <p className="text-lg font-semibold tabular-nums">
                      {formatPrice(kpis.effortMensuelEstime)}/mois
                    </p>
                  </div>
                </div>

                <Separator />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Donnees insuffisantes pour calculer les KPIs.
              </p>
            )}

            {/* Infos fixes */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Zone fiscale</span>
                <Badge variant="outline">Zone {zoneLabel}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dispositif</span>
                <span className="font-medium">Loi Jeanbrun</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="size-3" aria-hidden="true" />
                  {formatDeliveryDate(programme.dateLivraison)}
                </span>
              </div>
              {villeName && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ville</span>
                  <span className="font-medium">{villeName}</span>
                </div>
              )}
              {programme.prixMin != null && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">A partir de</span>
                  <span className="font-semibold text-primary tabular-nums">
                    {formatPrice(programme.prixMin)}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <Button asChild size="lg" className="w-full">
                <a href="#lots">
                  <TrendingDown className="mr-2 size-4" aria-hidden="true" />
                  Simuler un lot
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <a href="#contact">Contactez-nous</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
