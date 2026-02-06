/**
 * JsonLdRealEstate.tsx
 * RealEstateListing Schema.org pour les programmes immobiliers
 *
 * CRITIQUE SEO: Ce composant genere le schema JSON-LD RealEstateListing
 * qui permet d'afficher les annonces immobilieres dans les resultats Google
 *
 * @see https://schema.org/RealEstateListing
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */

interface RealEstateAddress {
  streetAddress?: string;
  addressLocality: string;
  postalCode?: string;
  addressCountry: string;
}

interface RealEstatePrice {
  minPrice: number;
  maxPrice: number;
  currency: string;
}

interface JsonLdRealEstateProps {
  name: string;
  description?: string;
  address: RealEstateAddress;
  price?: RealEstatePrice;
  image?: string;
  url?: string;
  datePosted?: string;
  validThrough?: string;
}

/**
 * Genere le schema JSON-LD RealEstateListing pour Google Rich Snippets
 */
function generateRealEstateJsonLd(props: JsonLdRealEstateProps) {
  const {
    name,
    description,
    address,
    price,
    image,
    url,
    datePosted,
    validThrough,
  } = props;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name,
    address: {
      "@type": "PostalAddress",
      addressLocality: address.addressLocality,
      addressCountry: address.addressCountry,
      ...(address.streetAddress && { streetAddress: address.streetAddress }),
      ...(address.postalCode && { postalCode: address.postalCode }),
    },
  };

  if (description) {
    jsonLd.description = description;
  }

  if (price) {
    jsonLd.offers = {
      "@type": "AggregateOffer",
      lowPrice: price.minPrice,
      highPrice: price.maxPrice,
      priceCurrency: price.currency,
      availability: "https://schema.org/InStock",
    };
  }

  if (image) {
    jsonLd.image = image;
  }

  if (url) {
    jsonLd.url = url;
  }

  if (datePosted) {
    jsonLd.datePosted = datePosted;
  }

  if (validThrough) {
    jsonLd.validThrough = validThrough;
  }

  return jsonLd;
}

/**
 * Composant JSON-LD RealEstateListing
 * Injecte le schema structure pour les programmes immobiliers
 *
 * @example
 * <JsonLdRealEstate
 *   name="Programme Les Terrasses"
 *   description="Programme neuf eligible loi Jeanbrun a Lyon"
 *   address={{
 *     streetAddress: "15 rue de la Republique",
 *     addressLocality: "Lyon",
 *     postalCode: "69001",
 *     addressCountry: "FR",
 *   }}
 *   price={{
 *     minPrice: 180000,
 *     maxPrice: 450000,
 *     currency: "EUR",
 *   }}
 *   image="https://example.com/programme-image.jpg"
 *   url="https://example.com/programmes/les-terrasses"
 * />
 */
export function JsonLdRealEstate(props: JsonLdRealEstateProps) {
  const jsonLdData = generateRealEstateJsonLd(props);

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
 * // Dans app/programmes/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   const programme = await getProgramme(params.slug);
 *   return {
 *     other: {
 *       'script:ld+json': JSON.stringify(getRealEstateJsonLdForMetadata({
 *         name: programme.nom,
 *         description: programme.description,
 *         address: {
 *           addressLocality: programme.ville,
 *           postalCode: programme.codePostal,
 *           addressCountry: "FR",
 *         },
 *         price: {
 *           minPrice: programme.prixMin,
 *           maxPrice: programme.prixMax,
 *           currency: "EUR",
 *         },
 *       })),
 *     },
 *   };
 * }
 */
export function getRealEstateJsonLdForMetadata(props: JsonLdRealEstateProps) {
  return generateRealEstateJsonLd(props);
}

export type { JsonLdRealEstateProps, RealEstateAddress, RealEstatePrice };
