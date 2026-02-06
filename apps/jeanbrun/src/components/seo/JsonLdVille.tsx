/**
 * JsonLdVille.tsx
 * Combined Place + LocalBusiness Schema.org pour les pages villes
 *
 * CRITIQUE SEO: Ce composant genere un schema JSON-LD multi-type
 * combinant Place et LocalBusiness pour maximiser la visibilite
 * des pages villes dans les resultats Google
 *
 * @see https://schema.org/Place
 * @see https://schema.org/LocalBusiness
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */

/**
 * Interface representant les donnees d'une ville depuis EspoCRM
 */
interface EspoVille {
  name: string;
  slug: string;
  codeInsee: string;
  departementName?: string | null;
  regionName?: string | null;
}

/**
 * Props du composant JsonLdVille
 */
interface JsonLdVilleProps {
  ville: EspoVille;
  baseUrl: string;
}

/**
 * Genere le schema JSON-LD combine Place + LocalBusiness
 */
function generateVilleJsonLd(props: JsonLdVilleProps) {
  const { ville, baseUrl } = props;

  const canonicalUrl = `${baseUrl}/villes/${ville.slug}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Place", "LocalBusiness"],
    name: `Investissement loi Jeanbrun a ${ville.name}`,
    description: `Simulez votre investissement immobilier loi Jeanbrun a ${ville.name}${ville.departementName ? ` (${ville.departementName})` : ""}. Avantages fiscaux et programmes eligibles.`,
    url: canonicalUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: ville.name,
      addressCountry: "FR",
      ...(ville.regionName && { addressRegion: ville.regionName }),
    },
    areaServed: {
      "@type": "City",
      name: ville.name,
      ...(ville.codeInsee && { identifier: ville.codeInsee }),
    },
  };

  // Informations additionnelles pour LocalBusiness
  jsonLd.priceRange = "$$";
  jsonLd.currenciesAccepted = "EUR";

  // Proprietes additionnelles
  const additionalProperties = [];

  if (ville.departementName) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Departement",
      value: ville.departementName,
    });
  }

  if (ville.regionName) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Region",
      value: ville.regionName,
    });
  }

  if (additionalProperties.length > 0) {
    jsonLd.additionalProperty = additionalProperties;
  }

  return jsonLd;
}

/**
 * Composant JSON-LD Ville (Place + LocalBusiness)
 * Injecte le schema structure pour les pages villes
 */
export function JsonLdVille(props: JsonLdVilleProps) {
  const jsonLdData = generateVilleJsonLd(props);

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
 */
export function getVilleJsonLdForMetadata(props: JsonLdVilleProps) {
  return generateVilleJsonLd(props);
}

export type { JsonLdVilleProps, EspoVille };
