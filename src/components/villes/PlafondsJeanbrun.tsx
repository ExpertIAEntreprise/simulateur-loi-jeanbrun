"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ZoneFiscale } from "@/types/ville";
import { Scale } from "lucide-react";

interface PlafondsJeanbrunProps {
  zoneFiscale: ZoneFiscale;
}

/**
 * Plafonds de loyer Loi Jeanbrun 2026 par zone fiscale
 * Source: PLF 2026 (plafonds en euros/m2/mois)
 */
const PLAFONDS_LOYER: Record<ZoneFiscale, { base: number; intermediaire: number; social: number }> = {
  A_BIS: { base: 18.89, intermediaire: 15.11, social: 11.33 },
  A: { base: 14.03, intermediaire: 11.22, social: 8.42 },
  B1: { base: 11.31, intermediaire: 9.05, social: 6.79 },
  B2: { base: 9.83, intermediaire: 7.86, social: 5.90 },
  C: { base: 8.61, intermediaire: 6.89, social: 5.17 },
};

/**
 * Labels des zones fiscales
 */
const ZONE_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

/**
 * Formate un prix en euros avec 2 decimales
 */
function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Tableau des plafonds de loyer Loi Jeanbrun par zone fiscale
 * Met en evidence la zone de la ville selectionnee
 */
export function PlafondsJeanbrun({ zoneFiscale }: PlafondsJeanbrunProps) {
  const zones: ZoneFiscale[] = ["A_BIS", "A", "B1", "B2", "C"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scale className="h-5 w-5" aria-hidden="true" />
          Plafonds de loyer Loi Jeanbrun
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Plafonds mensuels par m2 selon le taux de reduction fiscale
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Zone</TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="secondary">6%</Badge>
                  <span className="text-xs font-normal">Loyer libre</span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="secondary">9%</Badge>
                  <span className="text-xs font-normal">Intermediaire</span>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="default">12%</Badge>
                  <span className="text-xs font-normal">Social</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((zone) => {
              const isCurrentZone = zone === zoneFiscale;
              const plafonds = PLAFONDS_LOYER[zone];

              return (
                <TableRow
                  key={zone}
                  className={isCurrentZone ? "bg-primary/5" : undefined}
                  data-state={isCurrentZone ? "selected" : undefined}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>Zone {ZONE_LABELS[zone]}</span>
                      {isCurrentZone && (
                        <Badge variant="default" className="text-xs">
                          Votre zone
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={isCurrentZone ? "font-semibold" : undefined}>
                      {formatPrice(plafonds.base)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={isCurrentZone ? "font-semibold" : undefined}>
                      {formatPrice(plafonds.intermediaire)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={isCurrentZone ? "font-semibold" : undefined}>
                      {formatPrice(plafonds.social)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <p className="text-muted-foreground mt-4 text-xs">
          * Plafonds PLF 2026. Le taux de reduction fiscale augmente avec la baisse du loyer pratique.
        </p>
      </CardContent>
    </Card>
  );
}
