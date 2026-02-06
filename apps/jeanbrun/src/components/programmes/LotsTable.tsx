"use client";

import { useState, useMemo, useCallback } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Calculator, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Lot } from "@/lib/espocrm";

/**
 * Cles de tri disponibles pour les colonnes
 */
type SortKey = "type" | "surface" | "etage" | "prix";
type SortDir = "asc" | "desc";

interface LotsTableProps {
  lots: Lot[];
  onSimuler: (lot: Lot) => void;
  onContact: (lot: Lot) => void;
}

/**
 * Couleur du badge selon le type de lot
 */
const TYPE_BADGE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  T1: "outline",
  T2: "secondary",
  T3: "default",
  T4: "default",
  T5: "default",
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
 * Format etage
 */
function formatEtage(etage: number | null): string {
  if (etage == null) return "-";
  if (etage === 0) return "RDC";
  return `${etage}${etage === 1 ? "er" : "e"}`;
}

/**
 * Comparateur generique pour tri par colonne
 */
function compareLots(a: Lot, b: Lot, key: SortKey, dir: SortDir): number {
  let result = 0;

  switch (key) {
    case "type": {
      // Tri par numero de type (T1 < T2 < T3...)
      const numA = parseInt(a.type.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.type.replace(/\D/g, ""), 10) || 0;
      result = numA - numB;
      break;
    }
    case "surface":
      result = a.surface - b.surface;
      break;
    case "etage": {
      const ea = a.etage ?? -1;
      const eb = b.etage ?? -1;
      result = ea - eb;
      break;
    }
    case "prix":
      result = a.prix - b.prix;
      break;
  }

  return dir === "asc" ? result : -result;
}

/**
 * LotsTable - Tableau des lots disponibles d'un programme
 *
 * Desktop : tableau triable par colonnes
 * Mobile : cards empilees responsive
 *
 * @see Phase 3 du plan page-programme
 */
export function LotsTable({ lots, onSimuler, onContact }: LotsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("prix");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  const sortedLots = useMemo(
    () => [...lots].sort((a, b) => compareLots(a, b, sortKey, sortDir)),
    [lots, sortKey, sortDir]
  );

  if (lots.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Les details des lots ne sont pas encore disponibles pour ce programme.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header compteur */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {lots.length}
          </span>{" "}
          lot{lots.length > 1 ? "s" : ""} disponible{lots.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Desktop : tableau */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead
                label="Type"
                sortKey="type"
                currentKey={sortKey}
                currentDir={sortDir}
                onSort={handleSort}
              />
              <SortableHead
                label="Surface"
                sortKey="surface"
                currentKey={sortKey}
                currentDir={sortDir}
                onSort={handleSort}
              />
              <SortableHead
                label="Etage"
                sortKey="etage"
                currentKey={sortKey}
                currentDir={sortDir}
                onSort={handleSort}
              />
              <SortableHead
                label="Prix"
                sortKey="prix"
                currentKey={sortKey}
                currentDir={sortDir}
                onSort={handleSort}
              />
              <TableHead>Prestations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLots.map((lot, index) => (
              <TableRow key={`${lot.numero ?? lot.type}-${index}`}>
                <TableCell>
                  <Badge variant={TYPE_BADGE_VARIANT[lot.type] ?? "secondary"}>
                    {lot.type}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">
                  {lot.surface} m&sup2;
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatEtage(lot.etage)}
                </TableCell>
                <TableCell className="font-semibold tabular-nums">
                  {formatPrice(lot.prix)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {lot.prestations ?? "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onSimuler(lot)}
                      aria-label={`Simuler le lot ${lot.type} ${lot.surface}m2`}
                    >
                      <Calculator className="size-3.5" aria-hidden="true" />
                      Simuler
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onContact(lot)}
                      aria-label={`Demander des infos sur le lot ${lot.type} ${lot.surface}m2`}
                    >
                      <Info className="size-3.5" aria-hidden="true" />
                      Infos
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile : cards empilees */}
      <div className="flex flex-col gap-3 sm:hidden">
        {sortedLots.map((lot, index) => (
          <Card key={`mobile-${lot.numero ?? lot.type}-${index}`}>
            <CardContent className="space-y-3 py-4">
              {/* Header card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={TYPE_BADGE_VARIANT[lot.type] ?? "secondary"}>
                    {lot.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {lot.surface} m&sup2;
                  </span>
                  {lot.etage != null && (
                    <span className="text-sm text-muted-foreground">
                      &middot; {formatEtage(lot.etage)}
                    </span>
                  )}
                </div>
                <span className="font-bold tabular-nums">
                  {formatPrice(lot.prix)}
                </span>
              </div>

              {/* Prestations */}
              {lot.prestations && (
                <p className="text-sm text-muted-foreground">{lot.prestations}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => onSimuler(lot)}
                  aria-label={`Simuler le lot ${lot.type} ${lot.surface}m2`}
                >
                  <Calculator className="size-3.5" aria-hidden="true" />
                  Simuler
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onContact(lot)}
                  aria-label={`Demander des infos sur le lot ${lot.type} ${lot.surface}m2`}
                >
                  <Info className="size-3.5" aria-hidden="true" />
                  Infos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * En-tete de colonne triable
 */
function SortableHead({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const isActive = currentKey === sortKey;

  const Icon = isActive
    ? currentDir === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <TableHead>
      <button
        type="button"
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => onSort(sortKey)}
        aria-label={`Trier par ${label.toLowerCase()}`}
      >
        {label}
        <Icon
          className={`size-3.5 ${isActive ? "text-foreground" : "text-muted-foreground/50"}`}
          aria-hidden="true"
        />
      </button>
    </TableHead>
  );
}
