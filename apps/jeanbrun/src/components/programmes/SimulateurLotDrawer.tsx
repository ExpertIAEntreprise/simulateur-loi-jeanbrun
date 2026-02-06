"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  BarChart3,
  ArrowRight,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { orchestrerSimulation } from "@/lib/calculs/orchestrateur";
import { calculerTMI } from "@/lib/calculs/tmi";
import type { ZoneFiscale } from "@/lib/calculs/types/common";
import type { SimulationCalculResult } from "@/lib/calculs/types/simulation";
import type { Lot } from "@/lib/espocrm";

/**
 * Situation familiale pour le nombre de parts fiscales
 */
type SituationFamiliale = "celibataire" | "marie_pacse";

/**
 * Options du nombre de parts disponibles
 */
const PARTS_OPTIONS: { value: string; label: string }[] = [
  { value: "1", label: "1 part" },
  { value: "1.5", label: "1,5 parts" },
  { value: "2", label: "2 parts" },
  { value: "2.5", label: "2,5 parts" },
  { value: "3", label: "3 parts" },
  { value: "3.5", label: "3,5 parts" },
  { value: "4", label: "4 parts" },
];

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
 * Format prix en EUR
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format pourcentage
 */
function formatPercent(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

interface SimulateurLotDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lot: Lot | null;
  programmeName: string;
  villeName: string | null;
  zoneFiscale: ZoneFiscale;
  onContact?: (lot: Lot) => void;
}

/**
 * SimulateurLotDrawer - Drawer de simulation rapide par lot
 *
 * S'ouvre depuis la droite quand l'utilisateur clique "Simuler" sur un lot.
 * Calcul instantane via orchestrerSimulation() cote client.
 *
 * @see Phase 4 du plan page-programme
 */
export function SimulateurLotDrawer({
  open,
  onOpenChange,
  lot,
  programmeName,
  villeName,
  zoneFiscale,
  onContact,
}: SimulateurLotDrawerProps) {
  // Formulaire utilisateur
  const [revenuNet, setRevenuNet] = useState<string>("");
  const [situation, setSituation] = useState<SituationFamiliale>("celibataire");
  const [nombreParts, setNombreParts] = useState<string>("1");

  // Valeurs parsees
  const revenuNetValue = useMemo(() => {
    const parsed = parseInt(revenuNet, 10);
    return isNaN(parsed) || parsed <= 0 ? null : parsed;
  }, [revenuNet]);

  const partsValue = useMemo(() => {
    return parseFloat(nombreParts) || 1;
  }, [nombreParts]);

  // Calcul de simulation via le moteur existant
  const simulationResult = useMemo<SimulationCalculResult | null>(() => {
    if (!lot || !revenuNetValue) return null;

    try {
      return orchestrerSimulation({
        revenuNetImposable: revenuNetValue,
        nombreParts: partsValue,
        typeBien: "neuf",
        prixAcquisition: lot.prix,
        surface: lot.surface,
        zoneFiscale,
        niveauLoyer: "intermediaire",
      });
    } catch {
      return null;
    }
  }, [lot, revenuNetValue, partsValue, zoneFiscale]);

  // TMI separee pour affichage
  const tmiResult = useMemo(() => {
    if (!revenuNetValue) return null;
    try {
      return calculerTMI({
        revenuNetImposable: revenuNetValue,
        nombreParts: partsValue,
      });
    } catch {
      return null;
    }
  }, [revenuNetValue, partsValue]);

  // Mise a jour automatique des parts selon la situation
  const handleSituationChange = useCallback(
    (value: SituationFamiliale) => {
      setSituation(value);
      if (value === "marie_pacse" && parseFloat(nombreParts) < 2) {
        setNombreParts("2");
      } else if (value === "celibataire" && parseFloat(nombreParts) >= 2) {
        setNombreParts("1");
      }
    },
    [nombreParts]
  );

  // URL du wizard pre-rempli avec les params de simulation
  const wizardUrl = useMemo(() => {
    if (!lot || !revenuNetValue) return "/simulateur/avance";
    const params = new URLSearchParams({
      revenu: revenuNetValue.toString(),
      parts: partsValue.toString(),
      prix: lot.prix.toString(),
      surface: lot.surface.toString(),
      zone: zoneFiscale,
      type: "neuf",
    });
    return `/simulateur/avance?${params.toString()}`;
  }, [lot, revenuNetValue, partsValue, zoneFiscale]);

  if (!lot) return null;

  const zoneLabel = ZONE_LABELS[zoneFiscale] ?? zoneFiscale;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-y-auto sm:max-w-lg"
        aria-label={`Simulation pour le lot ${lot.type} ${lot.surface}m2`}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" aria-hidden="true" />
            Simuler ce lot
          </SheetTitle>
          <SheetDescription>
            Estimez votre economie d&apos;impot avec la Loi Jeanbrun
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
          {/* Donnees du lot (non editables) */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Lot selectionne
            </h3>
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="font-semibold">{programmeName}</p>
              {villeName && (
                <p className="text-sm text-muted-foreground">{villeName}</p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{lot.type}</Badge>
                <span className="text-sm tabular-nums">
                  {lot.surface} m&sup2;
                </span>
                {lot.etage != null && (
                  <span className="text-sm text-muted-foreground">
                    {lot.etage === 0
                      ? "RDC"
                      : `${lot.etage}${lot.etage === 1 ? "er" : "e"} etage`}
                  </span>
                )}
                <Badge variant="outline">Zone {zoneLabel}</Badge>
              </div>
              <p className="text-lg font-bold tabular-nums text-primary">
                {formatPrice(lot.prix)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Formulaire utilisateur */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Votre situation fiscale
            </h3>

            {/* Revenu net imposable */}
            <div className="space-y-2">
              <Label htmlFor="drawer-revenu">Revenu net imposable annuel</Label>
              <div className="relative">
                <Input
                  id="drawer-revenu"
                  type="number"
                  inputMode="numeric"
                  placeholder="Ex: 50 000"
                  value={revenuNet}
                  onChange={(e) => setRevenuNet(e.target.value)}
                  min={0}
                  max={1000000}
                  aria-describedby="drawer-revenu-hint"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  EUR/an
                </span>
              </div>
              <p
                id="drawer-revenu-hint"
                className="text-xs text-muted-foreground"
              >
                Ligne 236 de votre avis d&apos;imposition
              </p>
            </div>

            {/* Situation familiale */}
            <div className="space-y-2">
              <Label htmlFor="drawer-situation">Situation familiale</Label>
              <Select
                value={situation}
                onValueChange={(v) =>
                  handleSituationChange(v as SituationFamiliale)
                }
              >
                <SelectTrigger id="drawer-situation" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celibataire">Celibataire</SelectItem>
                  <SelectItem value="marie_pacse">
                    Marie(e) / Pacse(e)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nombre de parts */}
            <div className="space-y-2">
              <Label htmlFor="drawer-parts">Nombre de parts fiscales</Label>
              <Select value={nombreParts} onValueChange={setNombreParts}>
                <SelectTrigger id="drawer-parts" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PARTS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resultats de simulation */}
          {simulationResult && tmiResult ? (
            <>
              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Resultats de la simulation
                </h3>

                {/* TMI */}
                <ResultRow
                  icon={
                    <BarChart3
                      className="size-4 text-blue-600"
                      aria-hidden="true"
                    />
                  }
                  label="Votre TMI"
                  value={formatPercent(tmiResult.tmi)}
                  sublabel={`Tranche ${tmiResult.numeroTranche}`}
                />

                {/* Economie annuelle */}
                <ResultRow
                  icon={
                    <PiggyBank
                      className="size-4 text-green-600"
                      aria-hidden="true"
                    />
                  }
                  label="Economie d'impot / an"
                  value={formatPrice(
                    simulationResult.synthese.economieImpotsAnnuelle
                  )}
                  highlight
                />

                {/* Economie 9 ans */}
                <ResultRow
                  icon={
                    <TrendingUp
                      className="size-4 text-green-600"
                      aria-hidden="true"
                    />
                  }
                  label="Economie totale (9 ans)"
                  value={formatPrice(
                    simulationResult.synthese.economieImpots9ans
                  )}
                  highlight
                />

                {/* Rendement brut */}
                <ResultRow
                  icon={
                    <BarChart3
                      className="size-4 text-amber-600"
                      aria-hidden="true"
                    />
                  }
                  label="Rendement brut"
                  value={`${simulationResult.synthese.rendementBrut.toFixed(1)} %`}
                />

                {/* Cash-flow mensuel */}
                <ResultRow
                  icon={
                    <TrendingUp
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                  }
                  label="Cash-flow mensuel"
                  value={formatPrice(
                    simulationResult.synthese.cashflowMensuel
                  )}
                  sublabel="Loyer - charges (hors credit)"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                * Estimation basee sur un loyer intermediaire, TMI{" "}
                {formatPercent(tmiResult.tmi)}. Resultat non contractuel.
              </p>
            </>
          ) : revenuNet.length > 0 && !revenuNetValue ? (
            <p className="text-sm text-destructive">
              Veuillez saisir un revenu valide superieur a 0.
            </p>
          ) : null}
        </div>

        {/* CTAs */}
        <SheetFooter>
          {simulationResult ? (
            <div className="flex w-full flex-col gap-2">
              <Button asChild className="w-full">
                <Link href={wizardUrl}>
                  <Calculator className="size-4" aria-hidden="true" />
                  Simulation complete
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              {onContact && lot && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onContact(lot);
                    onOpenChange(false);
                  }}
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Recevoir l&apos;analyse
                </Button>
              )}
            </div>
          ) : (
            <p className="w-full text-center text-sm text-muted-foreground">
              Saisissez votre revenu pour voir les resultats
            </p>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Ligne de resultat avec icone et valeur
 */
function ResultRow({
  icon,
  label,
  value,
  sublabel,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium">{label}</p>
          {sublabel && (
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          )}
        </div>
      </div>
      <span
        className={`tabular-nums font-bold ${highlight ? "text-green-600 dark:text-green-400" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
