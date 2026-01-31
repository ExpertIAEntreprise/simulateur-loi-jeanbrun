"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Props pour le composant ContenuEditorial
 */
interface ContenuEditorialProps {
  /** Contenu editorial HTML ou texte (peut etre null) */
  contenu: string | null;
  /** Nom de la ville pour le fallback */
  villeNom: string;
}

/**
 * Affichage du contenu editorial formate pour une ville
 * Utilise la classe prose de Tailwind pour un rendu typographique soigne
 */
export function ContenuEditorial({ contenu, villeNom }: ContenuEditorialProps) {
  // Affichage fallback si pas de contenu
  if (!contenu || contenu.trim() === "") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-lg">Investir a {villeNom}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Le contenu editorial pour {villeNom} sera bientot disponible.
            Revenez prochainement pour decouvrir les opportunites
            d&apos;investissement dans cette ville.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-primary" aria-hidden="true" />
          <CardTitle className="text-lg">Investir a {villeNom}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <article
          className="prose prose-lg prose-slate dark:prose-invert max-w-none"
          aria-label={`Contenu editorial sur l'investissement a ${villeNom}`}
        >
          {/*
            Le contenu est stocke en texte brut dans EspoCRM.
            On le decoupe en paragraphes pour un meilleur rendu.
          */}
          {contenu.split("\n\n").map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            return (
              <p key={index} className="text-muted-foreground">
                {trimmed}
              </p>
            );
          })}
        </article>
      </CardContent>
    </Card>
  );
}
