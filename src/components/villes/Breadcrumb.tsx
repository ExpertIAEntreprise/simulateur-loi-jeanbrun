/**
 * Breadcrumb.tsx
 * Composant breadcrumb accessible avec JSON-LD BreadcrumbList integre
 *
 * CRITIQUE SEO: Genere le schema BreadcrumbList pour Google Rich Snippets
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Item de breadcrumb
 */
export interface BreadcrumbItem {
  /** Label affiche */
  label: string;
  /** URL de destination */
  href: string;
}

interface BreadcrumbProps {
  /** Liste des items du breadcrumb (sans l'accueil, ajoute automatiquement) */
  items: BreadcrumbItem[];
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Genere le schema JSON-LD BreadcrumbList pour Google
 * @see https://schema.org/BreadcrumbList
 */
function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): object {
  // Ajouter "Accueil" au debut
  const allItems: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    ...items,
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://simulateur-loi-jeanbrun.vercel.app"}${item.href}`,
    })),
  };
}

/**
 * Breadcrumb accessible avec JSON-LD BreadcrumbList
 * Affiche le fil d'Ariane avec separateurs chevron
 * Injecte automatiquement le schema JSON-LD pour le SEO
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  // Ajouter l'accueil au debut pour l'affichage
  const allItems: BreadcrumbItem[] = [
    { label: "Accueil", href: "/" },
    ...items,
  ];

  const jsonLdData = generateBreadcrumbJsonLd(items);

  return (
    <>
      {/* JSON-LD BreadcrumbList pour Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdData),
        }}
      />

      {/* Navigation accessible */}
      <nav
        aria-label="Fil d'Ariane"
        className={cn("mb-4", className)}
      >
        <ol
          className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isFirst = index === 0;

            return (
              <li
                key={item.href}
                className="flex items-center gap-1.5"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {/* Separateur (sauf pour le premier element) */}
                {!isFirst && (
                  <ChevronRight
                    className="size-4 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  // Dernier element: texte sans lien, couleur plus foncee
                  <span
                    className="font-medium text-foreground"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  // Elements intermediaires: liens cliquables
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 transition-colors hover:text-foreground hover:underline"
                    itemProp="item"
                  >
                    {isFirst && (
                      <Home className="size-3.5" aria-hidden="true" />
                    )}
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}

                {/* Meta position pour schema.org */}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Version serveur du JSON-LD pour injection dans generateMetadata()
 *
 * @example
 * // Dans app/villes/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   const ville = await getVille(params.slug);
 *   return {
 *     other: {
 *       'script:ld+json': JSON.stringify(getBreadcrumbJsonLdForMetadata([
 *         { label: 'Villes', href: '/villes' },
 *         { label: ville.name, href: `/villes/${ville.slug}` },
 *       ])),
 *     },
 *   };
 * }
 */
export function getBreadcrumbJsonLdForMetadata(items: BreadcrumbItem[]): object {
  return generateBreadcrumbJsonLd(items);
}
