/**
 * LienMetropoleParent.tsx
 * Lien retour vers la metropole parent pour les villes peripheriques
 */

import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LienMetropoleParentProps {
  metropoleNom: string;
  metropoleSlug: string;
  nbProgrammes?: number;
}

/**
 * Card avec lien vers la metropole parent
 * Affiche le nombre de programmes si disponible
 */
export function LienMetropoleParent({
  metropoleNom,
  metropoleSlug,
  nbProgrammes,
}: LienMetropoleParentProps) {
  return (
    <Link
      href={`/villes/${metropoleSlug}`}
      className="group block"
      aria-label={`Retour vers ${metropoleNom}${nbProgrammes ? ` - ${nbProgrammes} programmes disponibles` : ""}`}
    >
      <Card className="bg-primary/5 transition-all duration-200 hover:bg-primary/10 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <CardContent className="flex items-center gap-4 p-4">
          {/* Icone avec fleche retour */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
          </div>

          {/* Contenu */}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Voir aussi</p>
            <p className="truncate font-semibold text-foreground group-hover:text-primary">
              {metropoleNom}
            </p>
            {nbProgrammes !== undefined && nbProgrammes > 0 && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="size-3.5" />
                <span>
                  {nbProgrammes} programme{nbProgrammes > 1 ? "s" : ""} neuf
                  {nbProgrammes > 1 ? "s" : ""}
                </span>
              </p>
            )}
          </div>

          {/* Chevron */}
          <div className="flex items-center text-muted-foreground transition-colors group-hover:text-primary">
            <ArrowLeft className="size-5 rotate-180 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Version compacte pour sidebar ou espaces reduits
 */
interface LienMetropoleParentCompactProps {
  metropoleNom: string;
  metropoleSlug: string;
}

export function LienMetropoleParentCompact({
  metropoleNom,
  metropoleSlug,
}: LienMetropoleParentCompactProps) {
  return (
    <Link
      href={`/villes/${metropoleSlug}`}
      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      aria-label={`Retour vers ${metropoleNom}`}
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      <span>
        Retour vers <span className="font-medium">{metropoleNom}</span>
      </span>
    </Link>
  );
}
