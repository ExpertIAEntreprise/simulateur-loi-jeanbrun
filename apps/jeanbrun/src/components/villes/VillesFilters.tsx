"use client";

/**
 * VillesFilters.tsx
 * Composant client pour les filtres de recherche de villes
 * Gere la recherche, les filtres par zone/departement, et le toggle metropoles
 */

import { useCallback, useTransition, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
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
import type { ZoneFiscale } from "@/types/ville";

/**
 * Options pour le filtre de zone fiscale
 */
const ZONE_OPTIONS: { value: ZoneFiscale | "all"; label: string }[] = [
  { value: "all", label: "Toutes les zones" },
  { value: "A_BIS", label: "Zone A bis (Paris)" },
  { value: "A", label: "Zone A (Agglomeration parisienne)" },
  { value: "B1", label: "Zone B1 (Grandes villes)" },
  { value: "B2", label: "Zone B2 (Villes moyennes)" },
  { value: "C", label: "Zone C (Reste du territoire)" },
];

/**
 * Liste des departements francais les plus pertinents pour l'immobilier
 */
const DEPARTEMENT_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Tous les departements" },
  { value: "75", label: "75 - Paris" },
  { value: "92", label: "92 - Hauts-de-Seine" },
  { value: "93", label: "93 - Seine-Saint-Denis" },
  { value: "94", label: "94 - Val-de-Marne" },
  { value: "78", label: "78 - Yvelines" },
  { value: "91", label: "91 - Essonne" },
  { value: "95", label: "95 - Val-d'Oise" },
  { value: "77", label: "77 - Seine-et-Marne" },
  { value: "69", label: "69 - Rhone (Lyon)" },
  { value: "13", label: "13 - Bouches-du-Rhone (Marseille)" },
  { value: "31", label: "31 - Haute-Garonne (Toulouse)" },
  { value: "33", label: "33 - Gironde (Bordeaux)" },
  { value: "59", label: "59 - Nord (Lille)" },
  { value: "44", label: "44 - Loire-Atlantique (Nantes)" },
  { value: "06", label: "06 - Alpes-Maritimes (Nice)" },
  { value: "67", label: "67 - Bas-Rhin (Strasbourg)" },
  { value: "34", label: "34 - Herault (Montpellier)" },
  { value: "35", label: "35 - Ille-et-Vilaine (Rennes)" },
  { value: "38", label: "38 - Isere (Grenoble)" },
];

/**
 * Options pour le filtre de prix au m2
 */
const PRIX_OPTIONS: { value: string; label: string; min?: number; max?: number }[] = [
  { value: "all", label: "Tous les prix" },
  { value: "0-3000", label: "< 3 000 \u20AC/m\u00B2", max: 3000 },
  { value: "3000-5000", label: "3 000 - 5 000 \u20AC/m\u00B2", min: 3000, max: 5000 },
  { value: "5000-7000", label: "5 000 - 7 000 \u20AC/m\u00B2", min: 5000, max: 7000 },
  { value: "7000-10000", label: "7 000 - 10 000 \u20AC/m\u00B2", min: 7000, max: 10000 },
  { value: "10000-", label: "> 10 000 \u20AC/m\u00B2", min: 10000 },
];

/**
 * Options de tri
 */
const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "name_asc", label: "Nom (A-Z)" },
  { value: "name_desc", label: "Nom (Z-A)" },
  { value: "prix_asc", label: "Prix croissant" },
  { value: "prix_desc", label: "Prix decroissant" },
  { value: "population_asc", label: "Population croissante" },
  { value: "population_desc", label: "Population decroissante" },
];

interface VillesFiltersProps {
  totalVilles: number;
}

/**
 * Composant de filtres pour la page /villes
 * Utilise les URL search params pour persister les filtres
 */
export function VillesFilters({ totalVilles }: VillesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // Valeurs actuelles des filtres depuis l'URL
  const currentZone = searchParams.get("zone") ?? "all";
  const currentDepartement = searchParams.get("departement") ?? "all";
  const currentMetropoles = searchParams.get("metropoles") === "true";
  const currentSearch = searchParams.get("search") ?? "";

  // Reconstruire la valeur du filtre prix depuis prixMin/prixMax
  const prixMin = searchParams.get("prixMin");
  const prixMax = searchParams.get("prixMax");
  const currentPrix = (() => {
    if (!prixMin && !prixMax) return "all";
    if (!prixMin && prixMax === "3000") return "0-3000";
    if (prixMin === "3000" && prixMax === "5000") return "3000-5000";
    if (prixMin === "5000" && prixMax === "7000") return "5000-7000";
    if (prixMin === "7000" && prixMax === "10000") return "7000-10000";
    if (prixMin === "10000" && !prixMax) return "10000-";
    return "all";
  })();

  // Reconstruire la valeur du tri depuis sort
  const currentSort = searchParams.get("sort") ?? "name_asc";

  /**
   * Met a jour l'URL avec les nouveaux parametres
   */
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset page quand on change les filtres
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  /**
   * Gere le changement de recherche avec debounce
   */
  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateSearchParams({ search: value || null });
  }, 300);

  const handleSearchChange = useCallback(
    (value: string) => {
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  /**
   * Reset tous les filtres
   */
  const handleReset = useCallback(() => {
    debouncedSearch.cancel();
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [router, pathname, debouncedSearch]);

  /**
   * Gere le changement de filtre prix
   */
  const handlePrixChange = useCallback(
    (value: string) => {
      const option = PRIX_OPTIONS.find((o) => o.value === value);
      if (!option || value === "all") {
        updateSearchParams({ prixMin: null, prixMax: null });
      } else {
        updateSearchParams({
          prixMin: option.min !== undefined ? String(option.min) : null,
          prixMax: option.max !== undefined ? String(option.max) : null,
        });
      }
    },
    [updateSearchParams]
  );

  /**
   * Gere le changement de tri
   */
  const handleSortChange = useCallback(
    (value: string) => {
      if (value === "name_asc") {
        updateSearchParams({ sort: null }); // Default, pas besoin de param
      } else {
        updateSearchParams({ sort: value });
      }
    },
    [updateSearchParams]
  );

  /**
   * Compte le nombre de filtres actifs
   */
  const activeFiltersCount =
    (currentZone !== "all" ? 1 : 0) +
    (currentDepartement !== "all" ? 1 : 0) +
    (currentMetropoles ? 1 : 0) +
    (currentSearch ? 1 : 0) +
    (currentPrix !== "all" ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* Recherche */}
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Rechercher une ville
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Rechercher une ville..."
              defaultValue={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
              aria-label="Rechercher une ville par nom"
            />
            {currentSearch && (
              <button
                type="button"
                onClick={() => updateSearchParams({ search: null })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bouton toggle filtres (mobile) */}
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden"
          aria-expanded={isOpen}
          aria-controls="filters-panel"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Filtres desktop (toujours visibles) */}
        <div className="hidden gap-4 sm:flex sm:flex-wrap">
          {/* Zone fiscale */}
          <div className="w-52">
            <Label htmlFor="zone" className="sr-only">
              Zone fiscale
            </Label>
            <Select
              value={currentZone}
              onValueChange={(value: string) =>
                updateSearchParams({ zone: value === "all" ? null : value })
              }
            >
              <SelectTrigger id="zone" aria-label="Filtrer par zone fiscale">
                <SelectValue placeholder="Zone fiscale" />
              </SelectTrigger>
              <SelectContent>
                {ZONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Departement */}
          <div className="w-52">
            <Label htmlFor="departement" className="sr-only">
              Departement
            </Label>
            <Select
              value={currentDepartement}
              onValueChange={(value: string) =>
                updateSearchParams({
                  departement: value === "all" ? null : value,
                })
              }
            >
              <SelectTrigger
                id="departement"
                aria-label="Filtrer par departement"
              >
                <SelectValue placeholder="Departement" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTEMENT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prix au m2 */}
          <div className="w-48">
            <Label htmlFor="prix" className="sr-only">
              Fourchette de prix
            </Label>
            <Select value={currentPrix} onValueChange={handlePrixChange}>
              <SelectTrigger id="prix" aria-label="Filtrer par prix au m2">
                <SelectValue placeholder="Prix au m2" />
              </SelectTrigger>
              <SelectContent>
                {PRIX_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tri */}
          <div className="w-48">
            <Label htmlFor="sort" className="sr-only">
              Trier par
            </Label>
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger id="sort" aria-label="Trier les resultats">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Toggle metropoles */}
          <Button
            variant={currentMetropoles ? "default" : "outline"}
            onClick={() =>
              updateSearchParams({
                metropoles: currentMetropoles ? null : "true",
              })
            }
            aria-pressed={currentMetropoles}
          >
            Metropoles uniquement
          </Button>
        </div>
      </div>

      {/* Panel filtres mobile (collapsible) */}
      {isOpen && (
        <div
          id="filters-panel"
          className="grid gap-4 rounded-lg border bg-card p-4 sm:hidden"
        >
          {/* Zone fiscale */}
          <div className="space-y-2">
            <Label htmlFor="zone-mobile">Zone fiscale</Label>
            <Select
              value={currentZone}
              onValueChange={(value: string) =>
                updateSearchParams({ zone: value === "all" ? null : value })
              }
            >
              <SelectTrigger id="zone-mobile">
                <SelectValue placeholder="Toutes les zones" />
              </SelectTrigger>
              <SelectContent>
                {ZONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Departement */}
          <div className="space-y-2">
            <Label htmlFor="departement-mobile">Departement</Label>
            <Select
              value={currentDepartement}
              onValueChange={(value: string) =>
                updateSearchParams({
                  departement: value === "all" ? null : value,
                })
              }
            >
              <SelectTrigger id="departement-mobile">
                <SelectValue placeholder="Tous les departements" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTEMENT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prix au m2 */}
          <div className="space-y-2">
            <Label htmlFor="prix-mobile">Prix au m2</Label>
            <Select value={currentPrix} onValueChange={handlePrixChange}>
              <SelectTrigger id="prix-mobile">
                <SelectValue placeholder="Tous les prix" />
              </SelectTrigger>
              <SelectContent>
                {PRIX_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tri */}
          <div className="space-y-2">
            <Label htmlFor="sort-mobile">Trier par</Label>
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger id="sort-mobile">
                <SelectValue placeholder="Nom (A-Z)" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Toggle metropoles */}
          <Button
            variant={currentMetropoles ? "default" : "outline"}
            onClick={() =>
              updateSearchParams({
                metropoles: currentMetropoles ? null : "true",
              })
            }
            className="w-full"
            aria-pressed={currentMetropoles}
          >
            Metropoles uniquement
          </Button>
        </div>
      )}

      {/* Resume des filtres actifs et compteur */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
          <span className="font-semibold text-foreground">{totalVilles}</span>{" "}
          {totalVilles > 1 ? "villes eligibles" : "ville eligible"}
          {isPending && (
            <span className="ml-2 text-primary" role="status">Chargement...</span>
          )}
        </p>

        {/* Badges des filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {currentZone !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {ZONE_OPTIONS.find((o) => o.value === currentZone)?.label}
                <button
                  type="button"
                  onClick={() => updateSearchParams({ zone: null })}
                  className="ml-1 hover:text-destructive"
                  aria-label="Supprimer le filtre zone"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {currentDepartement !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {
                  DEPARTEMENT_OPTIONS.find((o) => o.value === currentDepartement)
                    ?.label
                }
                <button
                  type="button"
                  onClick={() => updateSearchParams({ departement: null })}
                  className="ml-1 hover:text-destructive"
                  aria-label="Supprimer le filtre departement"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {currentMetropoles && (
              <Badge variant="secondary" className="gap-1">
                Metropoles
                <button
                  type="button"
                  onClick={() => updateSearchParams({ metropoles: null })}
                  className="ml-1 hover:text-destructive"
                  aria-label="Supprimer le filtre metropoles"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {currentPrix !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {PRIX_OPTIONS.find((o) => o.value === currentPrix)?.label}
                <button
                  type="button"
                  onClick={() =>
                    updateSearchParams({ prixMin: null, prixMax: null })
                  }
                  className="ml-1 hover:text-destructive"
                  aria-label="Supprimer le filtre prix"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {currentSearch && (
              <Badge variant="secondary" className="gap-1">
                &quot;{currentSearch}&quot;
                <button
                  type="button"
                  onClick={() => updateSearchParams({ search: null })}
                  className="ml-1 hover:text-destructive"
                  aria-label="Supprimer la recherche"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              Reinitialiser
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
