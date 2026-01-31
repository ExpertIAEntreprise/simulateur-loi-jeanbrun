"use client";

import Link from "next/link";
import { Star, Building2, ArrowRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MeilleureOpportuniteProps {
  /** ID du programme recommande */
  programmeId: string | null;
  /** Nom du programme recommande */
  programmeName: string | null;
  /** Slug de la ville pour les liens */
  villeSlug: string;
}

/**
 * Card affichant le programme recommande du mois
 * Avec badge "Recommande" et lien vers la page programme
 */
export function MeilleureOpportunite({
  programmeId,
  programmeName,
  villeSlug,
}: MeilleureOpportuniteProps) {
  // Pas de programme recommande
  if (!programmeId || !programmeName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Meilleure opportunite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Aucun programme recommande pour ce mois.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/villes/${villeSlug}/programmes`}>
                  Voir tous les programmes
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-amber-500" aria-hidden="true" />
          Meilleure opportunite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-950/20 dark:to-orange-950/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <Building2
                  className="h-5 w-5 text-amber-700 dark:text-amber-400"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{programmeName}</h3>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-900/70">
                    <Star className="mr-1 h-3 w-3" aria-hidden="true" />
                    Recommande
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Programme selectionne par notre algorithme ce mois-ci
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button asChild size="sm">
              <Link href={`/villes/${villeSlug}/programmes/${programmeId}`}>
                Voir le programme
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/villes/${villeSlug}/programmes`}>
                Comparer avec les autres
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
