/**
 * JsonLdOrganization.tsx
 * Organization Schema.org pour Google Rich Snippets
 *
 * CRITIQUE SEO: Ce composant genere le schema JSON-LD Organization
 * qui permet d'afficher les informations de l'entreprise dans les resultats Google
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/organization
 */

interface SocialProfile {
  type: "LinkedIn" | "Twitter" | "Facebook" | "YouTube";
  url: string;
}

interface JsonLdOrganizationProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality: string;
    postalCode?: string;
    addressCountry: string;
  };
  sameAs?: string[];
}

const defaultProps: JsonLdOrganizationProps = {
  name: "Expert IA Entreprise",
  url: "https://expert-ia-entreprise.fr",
  description: "Expert IA Entreprise developpe des solutions innovantes pour la simulation fiscale immobiliere, notamment le Simulateur Loi Jeanbrun.",
  address: {
    addressLocality: "Lyon",
    addressCountry: "FR",
  },
};

/**
 * Genere le schema JSON-LD Organization
 */
function generateOrganizationJsonLd(props: JsonLdOrganizationProps) {
  const merged = { ...defaultProps, ...props };

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: merged.name,
    url: merged.url,
    ...(merged.logo ? { logo: merged.logo } : {}),
    ...(merged.description ? { description: merged.description } : {}),
    ...(merged.email ? { email: merged.email } : {}),
    ...(merged.telephone ? { telephone: merged.telephone } : {}),
    ...(merged.address
      ? {
          address: {
            "@type": "PostalAddress",
            ...(merged.address.streetAddress ? { streetAddress: merged.address.streetAddress } : {}),
            addressLocality: merged.address.addressLocality,
            ...(merged.address.postalCode ? { postalCode: merged.address.postalCode } : {}),
            addressCountry: merged.address.addressCountry,
          },
        }
      : {}),
    ...(merged.sameAs && merged.sameAs.length > 0 ? { sameAs: merged.sameAs } : {}),
  };
}

/**
 * Composant JSON-LD Organization
 * Injecte le schema structure pour l'organisation
 *
 * @example
 * <JsonLdOrganization />
 * // ou avec des props personnalisees
 * <JsonLdOrganization
 *   name="Expert IA Entreprise"
 *   url="https://expert-ia-entreprise.fr"
 *   logo="https://expert-ia-entreprise.fr/logo.png"
 * />
 */
export function JsonLdOrganization(props: Partial<JsonLdOrganizationProps> = {}) {
  const mergedProps = { ...defaultProps, ...props } as JsonLdOrganizationProps;
  const jsonLdData = generateOrganizationJsonLd(mergedProps);

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
export function getOrganizationJsonLdForMetadata(props: Partial<JsonLdOrganizationProps> = {}) {
  const mergedProps = { ...defaultProps, ...props } as JsonLdOrganizationProps;
  return generateOrganizationJsonLd(mergedProps);
}

export type { JsonLdOrganizationProps, SocialProfile };
