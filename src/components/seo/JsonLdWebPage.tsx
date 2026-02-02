/**
 * JsonLdWebPage.tsx
 * WebPage Schema.org pour Google Rich Snippets
 *
 * CRITIQUE SEO: Ce composant genere le schema JSON-LD WebPage
 * qui aide Google a comprendre la structure de la page
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/webpage
 */

interface JsonLdWebPageProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  inLanguage?: string;
}

/**
 * Genere le schema JSON-LD WebPage
 */
function generateWebPageJsonLd({
  name,
  description,
  url,
  datePublished,
  dateModified,
  inLanguage = "fr-FR",
}: JsonLdWebPageProps) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: "Simulateur Loi Jeanbrun",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://simulateur-loi-jeanbrun.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Expert IA Entreprise",
      url: "https://expert-ia-entreprise.fr",
    },
  };
}

/**
 * Composant JSON-LD WebPage
 * Injecte le schema structure pour la page web
 *
 * @example
 * <JsonLdWebPage
 *   name="Simulateur Loi Jeanbrun"
 *   description="Simulez votre economie d'impot"
 *   url="https://simulateur-loi-jeanbrun.vercel.app"
 * />
 */
export function JsonLdWebPage(props: JsonLdWebPageProps) {
  const jsonLdData = generateWebPageJsonLd(props);

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
 */
export function getWebPageJsonLdForMetadata(props: JsonLdWebPageProps) {
  return generateWebPageJsonLd(props);
}

export type { JsonLdWebPageProps };
