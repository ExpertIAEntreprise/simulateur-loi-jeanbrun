/**
 * FooterVilles.tsx
 * Section footer avec les villes populaires par zone fiscale
 * Maillage interne SEO pour les pages villes
 */

import Link from "next/link";
import { MapPin } from "lucide-react";

/**
 * Villes populaires par zone fiscale
 * Liste statique des top villes pour le maillage interne
 * Mise a jour manuelle selon les donnees EspoCRM
 */
const VILLES_PAR_ZONE: Record<string, Array<{ nom: string; slug: string }>> = {
  "A bis": [
    { nom: "Paris", slug: "paris" },
    { nom: "Boulogne-Billancourt", slug: "boulogne-billancourt" },
    { nom: "Saint-Denis", slug: "saint-denis" },
    { nom: "Montreuil", slug: "montreuil" },
  ],
  A: [
    { nom: "Lyon", slug: "lyon" },
    { nom: "Marseille", slug: "marseille" },
    { nom: "Nice", slug: "nice" },
    { nom: "Toulouse", slug: "toulouse" },
    { nom: "Montpellier", slug: "montpellier" },
    { nom: "Bordeaux", slug: "bordeaux" },
  ],
  B1: [
    { nom: "Nantes", slug: "nantes" },
    { nom: "Rennes", slug: "rennes" },
    { nom: "Strasbourg", slug: "strasbourg" },
    { nom: "Lille", slug: "lille" },
    { nom: "Grenoble", slug: "grenoble" },
    { nom: "Angers", slug: "angers" },
  ],
  B2: [
    { nom: "Le Mans", slug: "le-mans" },
    { nom: "Amiens", slug: "amiens" },
    { nom: "Limoges", slug: "limoges" },
    { nom: "Tours", slug: "tours" },
  ],
};

/**
 * Section footer avec les villes populaires organisees par zone fiscale
 * Optimise pour le maillage interne SEO
 */
export function FooterVilles() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(VILLES_PAR_ZONE).map(([zone, villes]) => (
        <div key={zone}>
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            Zone {zone}
          </h3>
          <ul className="space-y-1.5">
            {villes.map((ville) => (
              <li key={ville.slug}>
                <Link
                  href={`/villes/${ville.slug}`}
                  className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
                  aria-label={`Loi Jeanbrun a ${ville.nom}`}
                >
                  {ville.nom}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Version compacte pour footer mobile
 */
export function FooterVillesCompact() {
  // Juste les top villes toutes zones confondues
  const topVilles = [
    { nom: "Paris", slug: "paris" },
    { nom: "Lyon", slug: "lyon" },
    { nom: "Marseille", slug: "marseille" },
    { nom: "Toulouse", slug: "toulouse" },
    { nom: "Bordeaux", slug: "bordeaux" },
    { nom: "Nantes", slug: "nantes" },
    { nom: "Nice", slug: "nice" },
    { nom: "Lille", slug: "lille" },
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {topVilles.map((ville) => (
        <Link
          key={ville.slug}
          href={`/villes/${ville.slug}`}
          className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
        >
          {ville.nom}
        </Link>
      ))}
      <Link
        href="/villes"
        className="text-xs font-medium text-primary hover:underline"
      >
        Toutes les villes
      </Link>
    </div>
  );
}
