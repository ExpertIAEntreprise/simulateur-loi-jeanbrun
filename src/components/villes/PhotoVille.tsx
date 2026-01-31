"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant PhotoVille
 */
interface PhotoVilleProps {
  /** URL de la photo de la ville (peut etre null) */
  photoUrl: string | null;
  /** Texte alternatif pour l'accessibilite (peut etre null) */
  alt: string | null;
  /** Nom de la ville pour le fallback */
  villeNom: string;
  /** Forme de l'image */
  shape?: "rectangle" | "circle";
  /** Classes CSS additionnelles */
  className?: string;
  /** Priorite de chargement (pour LCP) */
  priority?: boolean;
}

/**
 * Placeholder SVG/gradient quand pas de photo disponible
 */
function PhotoPlaceholder({
  villeNom,
  shape,
  className,
}: {
  villeNom: string;
  shape: "rectangle" | "circle";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20",
        shape === "circle" ? "rounded-full aspect-square" : "rounded-lg aspect-video",
        className
      )}
      role="img"
      aria-label={`Placeholder pour ${villeNom}`}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Building2 className="size-12 opacity-50" aria-hidden="true" />
        <span className="text-sm font-medium opacity-70">{villeNom}</span>
      </div>
    </div>
  );
}

/**
 * Image hero de la ville avec fallback intelligent
 * Supporte les formes rectangle et cercle avec optimisation Next.js Image
 */
export function PhotoVille({
  photoUrl,
  alt,
  villeNom,
  shape = "rectangle",
  className,
  priority = false,
}: PhotoVilleProps) {
  // Utiliser le placeholder si pas de photo
  if (!photoUrl) {
    return (
      <PhotoPlaceholder
        villeNom={villeNom}
        shape={shape}
        {...(className !== undefined && { className })}
      />
    );
  }

  // Alt text par defaut si non fourni
  const imageAlt = alt ?? `Photo de ${villeNom}`;

  // Dimensions responsive selon la forme
  const containerClasses = cn(
    "relative overflow-hidden",
    shape === "circle"
      ? "rounded-full aspect-square"
      : "rounded-lg aspect-video",
    className
  );

  return (
    <div className={containerClasses}>
      <Image
        src={photoUrl}
        alt={imageAlt}
        fill
        sizes={shape === "circle"
          ? "(max-width: 768px) 150px, 200px"
          : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        }
        className="object-cover"
        priority={priority}
        onError={(e) => {
          // Fallback en cas d'erreur de chargement
          const target = e.currentTarget;
          target.style.display = "none";
          // Le parent affichera le placeholder grace au CSS
          const parent = target.parentElement;
          if (parent) {
            parent.classList.add("bg-gradient-to-br", "from-primary/20", "via-primary/10", "to-secondary/20");
            parent.innerHTML = `
              <div class="flex h-full w-full items-center justify-center">
                <span class="text-sm font-medium text-muted-foreground opacity-70">${villeNom}</span>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}
