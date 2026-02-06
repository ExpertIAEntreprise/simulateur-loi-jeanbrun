"use client";

/**
 * SectionFinancement.tsx
 * Section financement interactive avec sliders pour duree, taux et apport
 *
 * Client Component - Calculs 100% client-side (pas d'API call)
 * Utilise les formules de financement.ts et calculerLoyerEstime
 *
 * @see Phase 6 du plan page-programme
 */

import { useState, useMemo } from "react";
import { Calculator, CreditCard, Euro, PiggyBank, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  calculerMensualiteCredit,
  calculerFraisNotaireNeuf,
  calculerMontantEmprunte,
  calculerEffortMensuel,
  calculerCoutTotal,
} from "@/lib/calculs/financement";
import { calculerLoyerEstime } from "@/lib/calculs/orchestrateur";
import type { ZoneFiscale } from "@/lib/calculs/types/common";
import type { NiveauLoyerJeanbrun } from "@/lib/calculs/types/jeanbrun";

interface SectionFinancementProps {
  /** Prix minimum du programme en euros */
  prixMin: number;
  /** Zone fiscale du programme */
  zoneFiscale: ZoneFiscale;
  /** Surface moyenne estimee en m2 */
  surfaceMoyenne: number;
}

/** Defaults pour les sliders */
const DEFAULTS = {
  duree: 20,
  taux: 3.4,
  apportPourcent: 10,
} as const;

/** Limites des sliders */
const LIMITES = {
  dureeMin: 15,
  dureeMax: 25,
  tauxMin: 2.5,
  tauxMax: 5.0,
  apportMin: 0,
  apportMax: 30,
} as const;

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

export function SectionFinancement({
  prixMin,
  zoneFiscale,
  surfaceMoyenne,
}: SectionFinancementProps) {
  // Etat des sliders
  const [duree, setDuree] = useState<number>(DEFAULTS.duree);
  const [taux, setTaux] = useState<number>(DEFAULTS.taux);
  const [apportPourcent, setApportPourcent] = useState<number>(DEFAULTS.apportPourcent);

  // Calculs derives (recalcules a chaque changement de slider)
  const resultats = useMemo(() => {
    const fraisNotaire = calculerFraisNotaireNeuf(prixMin);
    const coutTotal = calculerCoutTotal(prixMin, fraisNotaire);
    const apportMontant = Math.round(prixMin * (apportPourcent / 100));
    const montantEmprunte = calculerMontantEmprunte(prixMin, fraisNotaire, apportMontant);
    const mensualite = calculerMensualiteCredit(montantEmprunte, taux / 100, duree);
    const niveauLoyer: NiveauLoyerJeanbrun = "intermediaire";
    const loyerEstime = calculerLoyerEstime(surfaceMoyenne, zoneFiscale, niveauLoyer);
    const effortMensuel = calculerEffortMensuel(mensualite, loyerEstime);

    return {
      fraisNotaire,
      coutTotal,
      apportMontant,
      montantEmprunte,
      mensualite,
      loyerEstime,
      effortMensuel,
    };
  }, [prixMin, zoneFiscale, surfaceMoyenne, duree, taux, apportPourcent]);

  return (
    <div className="space-y-8">
      {/* Bloc statique : Cout total */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" aria-hidden="true" />
            Cout total de l&apos;investissement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Prix du logement</span>
              <span className="font-semibold tabular-nums">{formatPrice(prixMin)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Frais de notaire estimes (~3%)
              </span>
              <span className="font-semibold tabular-nums">
                {formatPrice(resultats.fraisNotaire)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total investissement</span>
              <span className="text-lg font-bold tabular-nums text-primary">
                {formatPrice(resultats.coutTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloc interactif : Sliders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" aria-hidden="true" />
            Simulateur de financement
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ajustez les parametres pour estimer votre effort mensuel
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Slider Duree */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="slider-duree">
                Duree du credit
              </label>
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-primary">
                {duree} ans
              </span>
            </div>
            <Slider
              id="slider-duree"
              aria-label="Duree du credit en annees"
              min={LIMITES.dureeMin}
              max={LIMITES.dureeMax}
              step={1}
              value={[duree]}
              onValueChange={(values) => {
                const val = values[0];
                if (val !== undefined) setDuree(val);
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{LIMITES.dureeMin} ans</span>
              <span>{LIMITES.dureeMax} ans</span>
            </div>
          </div>

          {/* Slider Taux */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="slider-taux">
                Taux d&apos;interet
              </label>
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-primary">
                {taux.toFixed(1)}%
              </span>
            </div>
            <Slider
              id="slider-taux"
              aria-label="Taux d'interet annuel en pourcentage"
              min={LIMITES.tauxMin * 10}
              max={LIMITES.tauxMax * 10}
              step={1}
              value={[taux * 10]}
              onValueChange={(values) => {
                const val = values[0];
                if (val !== undefined) setTaux(val / 10);
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{LIMITES.tauxMin}%</span>
              <span>{LIMITES.tauxMax}%</span>
            </div>
          </div>

          {/* Slider Apport */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="slider-apport">
                Apport personnel
              </label>
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-primary">
                {apportPourcent}% ({formatPrice(resultats.apportMontant)})
              </span>
            </div>
            <Slider
              id="slider-apport"
              aria-label="Apport personnel en pourcentage du prix"
              min={LIMITES.apportMin}
              max={LIMITES.apportMax}
              step={1}
              value={[apportPourcent]}
              onValueChange={(values) => {
                const val = values[0];
                if (val !== undefined) setApportPourcent(val);
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{LIMITES.apportMin}%</span>
              <span>{LIMITES.apportMax}%</span>
            </div>
          </div>

          <Separator />

          {/* Resultats temps reel */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Mensualite */}
            <div className="rounded-xl border p-4 text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Euro className="size-5 text-blue-600" aria-hidden="true" />
              </div>
              <p className="text-xs text-muted-foreground">Mensualite credit</p>
              <p className="text-xl font-bold tabular-nums">
                {formatPrice(resultats.mensualite)}
              </p>
              <p className="text-xs text-muted-foreground">/mois</p>
            </div>

            {/* Loyer estime */}
            <div className="rounded-xl border p-4 text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <PiggyBank className="size-5 text-green-600" aria-hidden="true" />
              </div>
              <p className="text-xs text-muted-foreground">Loyer estime</p>
              <p className="text-xl font-bold tabular-nums text-green-600">
                {formatPrice(resultats.loyerEstime)}
              </p>
              <p className="text-xs text-muted-foreground">/mois</p>
            </div>

            {/* Effort mensuel */}
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10">
                <TrendingDown className="size-5 text-primary" aria-hidden="true" />
              </div>
              <p className="text-xs text-muted-foreground">Effort mensuel</p>
              <p className="text-xl font-bold tabular-nums text-primary">
                {formatPrice(resultats.effortMensuel)}
              </p>
              <p className="text-xs text-muted-foreground">/mois</p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Effort mensuel = Mensualite credit - Loyer estime (hors assurance
            emprunteur et charges)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
