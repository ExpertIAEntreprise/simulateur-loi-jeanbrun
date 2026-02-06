"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgrammeCard } from "@/components/villes/ProgrammeCard";
import type { EspoProgramme } from "@/lib/espocrm/types";

const PROGRAMMES_PER_PAGE = 24;

interface ProgrammesListingProps {
  programmes: EspoProgramme[];
}

/**
 * Extrait les villes uniques triees alphabetiquement
 */
function extractVilles(programmes: EspoProgramme[]): string[] {
  const villes = new Set<string>();
  for (const p of programmes) {
    if (p.villeName != null && p.villeName !== "") {
      villes.add(p.villeName);
    }
  }
  return [...villes].sort((a, b) => a.localeCompare(b, "fr"));
}

/**
 * Extrait les zones fiscales uniques triees
 */
function extractZones(programmes: EspoProgramme[]): string[] {
  const zones = new Set<string>();
  for (const p of programmes) {
    if (p.zoneFiscale != null && p.zoneFiscale !== "") {
      zones.add(p.zoneFiscale);
    }
  }
  return [...zones].sort();
}

/**
 * Labels lisibles pour les zones fiscales
 */
function zoneLabel(zone: string): string {
  const labels: Record<string, string> = {
    A_BIS: "Zone A bis",
    A: "Zone A",
    B1: "Zone B1",
    B2: "Zone B2",
    C: "Zone C",
  };
  return labels[zone] ?? `Zone ${zone}`;
}

export function ProgrammesListing({ programmes }: ProgrammesListingProps) {
  const [selectedVille, setSelectedVille] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);

  const villes = useMemo(() => extractVilles(programmes), [programmes]);
  const zones = useMemo(() => extractZones(programmes), [programmes]);

  // Filtrer les programmes
  const filtered = useMemo(() => {
    return programmes.filter((p) => {
      if (selectedVille !== "all" && p.villeName !== selectedVille) {
        return false;
      }
      if (selectedZone !== "all" && p.zoneFiscale !== selectedZone) {
        return false;
      }
      return true;
    });
  }, [programmes, selectedVille, selectedZone]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PROGRAMMES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PROGRAMMES_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + PROGRAMMES_PER_PAGE);

  const hasActiveFilters = selectedVille !== "all" || selectedZone !== "all";

  const scrollToTop = useCallback(() => {
    listTopRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function handleVilleChange(value: string) {
    setSelectedVille(value);
    setCurrentPage(1);
  }

  function handleZoneChange(value: string) {
    setSelectedZone(value);
    setCurrentPage(1);
  }

  function resetFilters() {
    setSelectedVille("all");
    setSelectedZone("all");
    setCurrentPage(1);
  }

  return (
    <div ref={listTopRef} className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="size-4 text-muted-foreground" aria-hidden="true" />

        {/* Filtre ville */}
        <Select value={selectedVille} onValueChange={handleVilleChange}>
          <SelectTrigger className="w-[200px]" aria-label="Filtrer par ville">
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {villes.map((ville) => (
              <SelectItem key={ville} value={ville}>
                {ville}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre zone fiscale */}
        <Select value={selectedZone} onValueChange={handleZoneChange}>
          <SelectTrigger className="w-[160px]" aria-label="Filtrer par zone fiscale">
            <SelectValue placeholder="Toutes les zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les zones</SelectItem>
            {zones.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zoneLabel(zone)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset filtres */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-1.5 text-muted-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
            Réinitialiser
          </Button>
        )}

        {/* Compteur resultats */}
        <Badge variant="outline" className="ml-auto" aria-live="polite">
          {filtered.length} programme{filtered.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Grille de programmes */}
      {paginated.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((programme, index) => (
            <ProgrammeCard
              key={programme.id}
              programme={programme}
              priority={index < 3 && safePage === 1}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          Aucun programme ne correspond aux filtres sélectionnés.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-2"
          aria-label="Pagination des programmes"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); scrollToTop(); }}
            disabled={safePage <= 1}
            aria-label="Page précédente"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Précédent
          </Button>

          <span className="px-3 text-sm text-muted-foreground">
            Page {safePage} sur {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); scrollToTop(); }}
            disabled={safePage >= totalPages}
            aria-label="Page suivante"
          >
            Suivant
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </nav>
      )}
    </div>
  );
}
