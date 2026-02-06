"use client"

import { useMemo } from "react"
import { AlertTriangle, CheckCircle2, Calculator } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { PARAMETRES_JEANBRUN } from "@/types/simulation"
import type { ZoneFiscale } from "@/types/ville"

interface RecapProjetProps {
  typeBien: "neuf" | "ancien"
  prixAcquisition: number
  surface: number
  montantTravaux?: number
  zoneFiscale?: ZoneFiscale
  className?: string
}

// Couleurs par zone fiscale
const ZONE_COLORS: Record<ZoneFiscale, string> = {
  A_BIS: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  A: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  B1: "bg-green-500/20 text-green-300 border-green-500/30",
  B2: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  C: "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

// Labels zone fiscale
const ZONE_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
}

/**
 * Formate un nombre en devise euro
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formate un nombre avec separateur de milliers
 */
function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value)
}

export function RecapProjet({
  typeBien,
  prixAcquisition,
  surface,
  montantTravaux,
  zoneFiscale,
  className,
}: RecapProjetProps) {
  // Calculs
  const calculs = useMemo(() => {
    // Taux de frais de notaire
    const tauxNotaire = typeBien === "neuf" ? 0.025 : 0.075

    // Frais de notaire
    const fraisNotaire = Math.round(prixAcquisition * tauxNotaire)

    // Prix au m2
    const prixM2 = surface > 0 ? Math.round(prixAcquisition / surface) : 0

    // Plafond prix m2 selon zone
    const plafondPrixM2 = zoneFiscale
      ? PARAMETRES_JEANBRUN.plafondsPrixM2[zoneFiscale]
      : null

    // Depassement plafond
    const depassePlafond = plafondPrixM2 !== null && prixM2 > plafondPrixM2

    // Travaux (uniquement pour ancien)
    const travaux = typeBien === "ancien" ? (montantTravaux ?? 0) : 0

    // Total investissement
    const totalInvestissement = prixAcquisition + fraisNotaire + travaux

    return {
      tauxNotaire,
      fraisNotaire,
      prixM2,
      plafondPrixM2,
      depassePlafond,
      travaux,
      totalInvestissement,
    }
  }, [typeBien, prixAcquisition, surface, montantTravaux, zoneFiscale])

  const showTravaux = typeBien === "ancien"

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calculator className="h-5 w-5 text-accent" />
          Recapitulatif du projet
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tableau recapitulatif */}
        <Table>
          <TableBody>
            {/* Prix d'acquisition */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="font-medium">Prix d&apos;acquisition</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(prixAcquisition)}
              </TableCell>
            </TableRow>

            {/* Frais de notaire */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="font-medium">
                Frais de notaire ({(calculs.tauxNotaire * 100).toFixed(1)}%)
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(calculs.fraisNotaire)}
              </TableCell>
            </TableRow>

            {/* Travaux (si ancien) */}
            {showTravaux && (
              <TableRow className="hover:bg-muted/30">
                <TableCell className="font-medium">Travaux de renovation</TableCell>
                <TableCell className="text-right tabular-nums">
                  {calculs.travaux > 0
                    ? formatCurrency(calculs.travaux)
                    : "-"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* Total */}
          <TableFooter>
            <TableRow className="bg-accent/10 hover:bg-accent/15">
              <TableCell className="font-bold text-foreground">
                Total investissement
              </TableCell>
              <TableCell className="text-right font-bold text-accent tabular-nums text-base">
                {formatCurrency(calculs.totalInvestissement)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Informations complementaires */}
        <div className="mt-4 space-y-3 pt-4 border-t border-border">
          {/* Prix au m2 */}
          {surface > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Prix au m2</span>
              <div className="flex items-center gap-2">
                <span className="font-medium tabular-nums">
                  {formatNumber(calculs.prixM2)} euros/m2
                </span>
                {calculs.plafondPrixM2 !== null && (
                  <>
                    {calculs.depassePlafond ? (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Plafond zone fiscale */}
          {zoneFiscale && calculs.plafondPrixM2 !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Plafond zone {ZONE_LABELS[zoneFiscale]}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium tabular-nums">
                  {formatNumber(calculs.plafondPrixM2)} euros/m2
                </span>
                <Badge
                  className={cn(
                    "border text-xs",
                    ZONE_COLORS[zoneFiscale]
                  )}
                >
                  Zone {ZONE_LABELS[zoneFiscale]}
                </Badge>
              </div>
            </div>
          )}

          {/* Alerte depassement */}
          {calculs.depassePlafond && zoneFiscale && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-300">
                  Prix au m2 superieur au plafond
                </p>
                <p className="text-muted-foreground mt-1">
                  Le prix au m2 ({formatNumber(calculs.prixM2)} euros) depasse le plafond
                  de la zone {ZONE_LABELS[zoneFiscale]} ({formatNumber(calculs.plafondPrixM2 ?? 0)} euros).
                  L&apos;avantage fiscal sera calcule sur la base du plafond.
                </p>
              </div>
            </div>
          )}

          {/* Message si pas de zone selectionnee */}
          {!zoneFiscale && (
            <div className="text-sm text-muted-foreground italic text-center py-2">
              Selectionnez une ville pour voir le plafond de zone applicable.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
