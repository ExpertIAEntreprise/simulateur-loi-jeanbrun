/**
 * JsonLdSoftwareApp.tsx
 * SoftwareApplication Schema.org pour Google Rich Snippets
 *
 * CRITIQUE SEO: Ce composant genere le schema JSON-LD SoftwareApplication
 * qui permet d'afficher les informations de l'application dans les resultats Google
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/software-app
 */

interface JsonLdSoftwareAppProps {
  name: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
  url: string;
  offers?: {
    price: string;
    priceCurrency: string;
    description?: string;
  };
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
}

const defaultProps = {
  name: "Simulateur Loi Jeanbrun",
  description: "Simulez gratuitement votre economie d'impot avec la Loi Jeanbrun. Jusqu'a 50 000EUR d'economie pour les TMI 45%. Le produit ideal pour preparer votre retraite.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://simulateur-loi-jeanbrun.vercel.app",
  offers: {
    price: "0",
    priceCurrency: "EUR",
    description: "Simulation gratuite",
  },
};

/**
 * Genere le schema JSON-LD SoftwareApplication
 */
function generateSoftwareAppJsonLd(props: JsonLdSoftwareAppProps) {
  const merged = { ...defaultProps, ...props };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: merged.name,
    description: merged.description,
    applicationCategory: merged.applicationCategory,
    operatingSystem: merged.operatingSystem,
    url: merged.url,
    inLanguage: "fr-FR",
    offers: {
      "@type": "Offer",
      price: merged.offers?.price ?? "0",
      priceCurrency: merged.offers?.priceCurrency ?? "EUR",
      ...(merged.offers?.description ? { description: merged.offers.description } : {}),
    },
    ...(merged.aggregateRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: merged.aggregateRating.ratingValue,
            ratingCount: merged.aggregateRating.ratingCount,
          },
        }
      : {}),
    author: {
      "@type": "Organization",
      name: "Expert IA Entreprise",
      url: "https://expert-ia-entreprise.fr",
    },
    potentialAction: {
      "@type": "UseAction",
      target: merged.url,
    },
  };
}

/**
 * Composant JSON-LD SoftwareApplication
 * Injecte le schema structure pour l'application
 *
 * @example
 * <JsonLdSoftwareApp />
 * // ou avec des props personnalisees
 * <JsonLdSoftwareApp
 *   name="Simulateur Loi Jeanbrun"
 *   description="..."
 *   url="https://..."
 * />
 */
export function JsonLdSoftwareApp(props: Partial<JsonLdSoftwareAppProps> = {}) {
  const mergedProps = { ...defaultProps, ...props } as JsonLdSoftwareAppProps;
  const jsonLdData = generateSoftwareAppJsonLd(mergedProps);

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
export function getSoftwareAppJsonLdForMetadata(props: Partial<JsonLdSoftwareAppProps> = {}) {
  const mergedProps = { ...defaultProps, ...props } as JsonLdSoftwareAppProps;
  return generateSoftwareAppJsonLd(mergedProps);
}

export type { JsonLdSoftwareAppProps };
