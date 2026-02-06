"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLATFORM_OPTIONS = [
  { value: "all", label: "Toutes" },
  { value: "jeanbrun", label: "Jeanbrun" },
  { value: "stop-loyer", label: "Stop Loyer" },
] as const;

const STATUS_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "new", label: "Nouveau" },
  { value: "dispatched", label: "Dispatche" },
  { value: "contacted", label: "Contacte" },
  { value: "converted", label: "Converti" },
  { value: "lost", label: "Perdu" },
] as const;

export function LeadsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPlatform = searchParams.get("platform") ?? "all";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentDateFrom = searchParams.get("dateFrom") ?? "";
  const currentDateTo = searchParams.get("dateTo") ?? "";
  const currentScoreMin = searchParams.get("scoreMin") ?? "";

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // Reset to page 1 when filters change
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const handleReset = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  const hasActiveFilters =
    currentPlatform !== "all" ||
    currentStatus !== "all" ||
    currentDateFrom !== "" ||
    currentDateTo !== "" ||
    currentScoreMin !== "";

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Plateforme</Label>
        <Select
          value={currentPlatform}
          onValueChange={(value) => updateFilters("platform", value)}
        >
          <SelectTrigger className="w-[140px]" aria-label="Filtrer par plateforme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLATFORM_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Statut</Label>
        <Select
          value={currentStatus}
          onValueChange={(value) => updateFilters("status", value)}
        >
          <SelectTrigger className="w-[140px]" aria-label="Filtrer par statut">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Date debut</Label>
        <Input
          type="date"
          value={currentDateFrom}
          onChange={(e) => updateFilters("dateFrom", e.target.value)}
          className="w-[150px]"
          aria-label="Date de debut"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Date fin</Label>
        <Input
          type="date"
          value={currentDateTo}
          onChange={(e) => updateFilters("dateTo", e.target.value)}
          className="w-[150px]"
          aria-label="Date de fin"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Score min</Label>
        <Input
          type="number"
          min={0}
          max={100}
          placeholder="0"
          value={currentScoreMin}
          onChange={(e) => updateFilters("scoreMin", e.target.value)}
          className="w-[90px]"
          aria-label="Score minimum"
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={isPending}
          className="text-muted-foreground"
        >
          Reinitialiser
        </Button>
      )}

      {isPending && (
        <span className="text-xs text-muted-foreground animate-pulse">
          Chargement...
        </span>
      )}
    </div>
  );
}
