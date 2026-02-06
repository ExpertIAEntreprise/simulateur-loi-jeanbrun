/**
 * JsonLdPlace.tsx
 * Place Schema.org pour les pages villes
 *
 * CRITIQUE SEO: Ce composant genere le schema JSON-LD Place
 * qui enrichit les informations de localisation dans Google
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 * @see https://schema.org/Place
 */

interface PostalAddress {
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
}

interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

interface JsonLdPlaceProps {
  name: string;
  description?: string;
  address: PostalAddress;
  geo?: GeoCoordinates;
  image?: string;
  url?: string;
}

/**
 * Genere le schema JSON-LD Place pour Google Rich Snippets
 */
function generatePlaceJsonLd(props: JsonLdPlaceProps) {
  const { name, description, address, geo, image, url } = props;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    address: {
      "@type": "PostalAddress",
      addressLocality: address.addressLocality,
      addressCountry: address.addressCountry,
      ...(address.addressRegion && { addressRegion: address.addressRegion }),
      ...(address.postalCode && { postalCode: address.postalCode }),
    },
  };

  if (description) {
    jsonLd.description = description;
  }

  if (geo) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  if (image) {
    jsonLd.image = image;
  }

  if (url) {
    jsonLd.url = url;
  }

  return jsonLd;
}

/**
 * Composant JSON-LD Place
 * Injecte le schema structure pour les informations de lieu
 *
 * @example
 * <JsonLdPlace
 *   name="Lyon"
 *   description="Investissement locatif loi Jeanbrun a Lyon"
 *   address={{
 *     addressLocality: "Lyon",
 *     addressRegion: "Auvergne-Rhone-Alpes",
 *     addressCountry: "FR",
 *   }}
 *   geo={{
 *     latitude: 45.764043,
 *     longitude: 4.835659,
 *   }}
 * />
 */
export function JsonLdPlace(props: JsonLdPlaceProps) {
  const jsonLdData = generatePlaceJsonLd(props);

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
 *   const ville = await getVille(params.slug);
 *   return {
 *     other: {
 *       'script:ld+json': JSON.stringify(getPlaceJsonLdForMetadata({
 *         name: ville.nom,
 *         description: `Investissement loi Jeanbrun a ${ville.nom}`,
 *         address: {
 *           addressLocality: ville.nom,
 *           addressRegion: ville.region,
 *           addressCountry: "FR",
 *         },
 *         geo: ville.coordonnees,
 *       })),
 *     },
 *   };
 * }
 */
export function getPlaceJsonLdForMetadata(props: JsonLdPlaceProps) {
  return generatePlaceJsonLd(props);
}

export type { JsonLdPlaceProps, PostalAddress, GeoCoordinates };
