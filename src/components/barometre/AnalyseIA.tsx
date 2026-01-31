"use client";

import { Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyseIAProps {
  /** Texte de l'analyse IA (~300 mots) */
  analyse: string | null;
  /** Nom de la ville pour le fallback */
  villeName?: string;
}

/**
 * Affiche l'analyse IA du marche immobilier
 * Prose Tailwind formatee avec fallback si analyse absente
 */
export function AnalyseIA({ analyse, villeName }: AnalyseIAProps) {
  // Fallback si pas d'analyse disponible
  if (!analyse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            Analyse IA du marche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">Analyse non disponible</p>
              <p className="text-sm text-muted-foreground">
                {villeName
                  ? `L'analyse IA pour ${villeName} sera disponible prochainement.`
                  : "L'analyse IA de ce barometre sera disponible prochainement."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Decoupe l'analyse en paragraphes
  const paragraphs = analyse
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          Analyse IA du marche
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground leading-relaxed">{analyse}</p>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span>Analyse generee par intelligence artificielle</span>
        </div>
      </CardContent>
    </Card>
  );
}
