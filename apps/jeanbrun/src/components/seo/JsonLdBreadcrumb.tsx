/**
 * JsonLdBreadcrumb.tsx
 * BreadcrumbList Schema.org pour Google Rich Snippets
 *
 * CRITIQUE SEO: Ce composant genere le schema JSON-LD BreadcrumbList
 * qui permet d'afficher le fil d'Ariane dans les resultats Google
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface JsonLdBreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Genere le schema JSON-LD BreadcrumbList pour Google Rich Snippets
 */
function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Composant JSON-LD BreadcrumbList
 * Injecte le schema structure pour le fil d'Ariane
 *
 * @example
 * <JsonLdBreadcrumb
 *   items={[
 *     { name: "Accueil", url: "https://example.com" },
 *     { name: "Villes", url: "https://example.com/villes" },
 *     { name: "Lyon", url: "https://example.com/villes/lyon" },
 *   ]}
 * />
 */
export function JsonLdBreadcrumb({ items }: JsonLdBreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  const jsonLdData = generateBreadcrumbJsonLd(items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdData),
      }}
    />
  );
}

/**
 * Version serveur du JSON-LD pour injection dans le head via metadata
 * Utiliser cette fonction dans generateMetadata() de la page
 *
 * @example
 * // Dans app/villes/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
 *   return {
 *     other: {
 *       'script:ld+json': JSON.stringify(getBreadcrumbJsonLdForMetadata([
 *         { name: "Accueil", url: baseUrl },
 *         { name: "Villes", url: `${baseUrl}/villes` },
 *         { name: ville.nom, url: `${baseUrl}/villes/${ville.slug}` },
 *       ])),
 *     },
 *   };
 * }
 */
export function getBreadcrumbJsonLdForMetadata(items: BreadcrumbItem[]) {
  return generateBreadcrumbJsonLd(items);
}

export type { BreadcrumbItem, JsonLdBreadcrumbProps };
