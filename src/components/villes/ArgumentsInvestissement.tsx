/**
 * ArgumentsInvestissement.tsx
 * Checklist d'arguments dynamiques pour investir dans une ville
 */

import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArgumentItem {
  titre: string;
  description?: string;
}

interface ArgumentsInvestissementProps {
  arguments: ArgumentItem[];
  villeNom: string;
}

/**
 * Affiche une liste d'arguments d'investissement avec checkmarks verts
 * Maximum 6 arguments affiches
 */
export function ArgumentsInvestissement({
  arguments: args,
  villeNom,
}: ArgumentsInvestissementProps) {
  // Limiter a 6 arguments maximum
  const displayedArgs = args.slice(0, 6);

  if (displayedArgs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">
          Pourquoi investir a {villeNom} ?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" role="list" aria-label="Arguments d'investissement">
          {displayedArgs.map((arg, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                aria-hidden="true"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <div className="flex-1">
                <span className="font-medium text-foreground">{arg.titre}</span>
                {arg.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {arg.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
