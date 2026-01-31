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
  cSlug: string;
  cCodeInsee: string;
  cDepartement: string;
  cRegion: string | null;
  cZoneFiscale: string;
  cLatitude: number | null;
  cLongitude: number | null;
  cPhotoVille: string | null;
  cPhotoVilleAlt: string | null;
  cPopulationCommune: number | null;
  cMetaDescription: string | null;
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

  const canonicalUrl = `${baseUrl}/villes/${ville.cSlug}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Place", "LocalBusiness"],
    name: `Investissement loi Jeanbrun a ${ville.name}`,
    description:
      ville.cMetaDescription ??
      `Simulez votre investissement immobilier loi Jeanbrun a ${ville.name} (${ville.cDepartement}). Zone ${ville.cZoneFiscale}, avantages fiscaux et programmes eligibles.`,
    url: canonicalUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: ville.name,
      addressCountry: "FR",
      ...(ville.cRegion && { addressRegion: ville.cRegion }),
    },
    areaServed: {
      "@type": "City",
      name: ville.name,
      ...(ville.cCodeInsee && { identifier: ville.cCodeInsee }),
    },
  };

  // Ajouter les coordonnees geo si disponibles
  if (ville.cLatitude !== null && ville.cLongitude !== null) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: ville.cLatitude,
      longitude: ville.cLongitude,
    };
  }

  // Ajouter l'image si disponible
  if (ville.cPhotoVille) {
    jsonLd.image = {
      "@type": "ImageObject",
      url: ville.cPhotoVille,
      ...(ville.cPhotoVilleAlt && { caption: ville.cPhotoVilleAlt }),
    };
  }

  // Informations additionnelles pour LocalBusiness
  jsonLd.priceRange = "$$";
  jsonLd.currenciesAccepted = "EUR";

  // Ajouter des informations supplementaires sur la ville
  if (ville.cPopulationCommune !== null) {
    jsonLd.additionalProperty = [
      {
        "@type": "PropertyValue",
        name: "Population",
        value: ville.cPopulationCommune,
      },
      {
        "@type": "PropertyValue",
        name: "Zone fiscale",
        value: ville.cZoneFiscale,
      },
      {
        "@type": "PropertyValue",
        name: "Departement",
        value: ville.cDepartement,
      },
    ];
  } else {
    jsonLd.additionalProperty = [
      {
        "@type": "PropertyValue",
        name: "Zone fiscale",
        value: ville.cZoneFiscale,
      },
      {
        "@type": "PropertyValue",
        name: "Departement",
        value: ville.cDepartement,
      },
    ];
  }

  return jsonLd;
}

/**
 * Composant JSON-LD Ville (Place + LocalBusiness)
 * Injecte le schema structure pour les pages villes
 *
 * @example
 * <JsonLdVille
 *   ville={{
 *     name: "Lyon",
 *     cSlug: "lyon",
 *     cCodeInsee: "69123",
 *     cDepartement: "Rhone",
 *     cRegion: "Auvergne-Rhone-Alpes",
 *     cZoneFiscale: "A",
 *     cLatitude: 45.764043,
 *     cLongitude: 4.835659,
 *     cPhotoVille: "https://example.com/lyon.jpg",
 *     cPhotoVilleAlt: "Vue panoramique de Lyon",
 *     cPopulationCommune: 516092,
 *     cMetaDescription: "Investissement loi Jeanbrun a Lyon...",
 *   }}
 *   baseUrl="https://simulateur-loi-jeanbrun.vercel.app"
 * />
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
 *
 * @example
 * // Dans app/villes/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   const ville = await getVilleBySlug(params.slug);
 *   const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://simulateur-loi-jeanbrun.vercel.app";
 *
 *   return {
 *     title: `Loi Jeanbrun ${ville.name} - Simulation et programmes`,
 *     description: ville.cMetaDescription,
 *     other: {
 *       'script:ld+json': JSON.stringify(getVilleJsonLdForMetadata({
 *         ville,
 *         baseUrl,
 *       })),
 *     },
 *   };
 * }
 */
export function getVilleJsonLdForMetadata(props: JsonLdVilleProps) {
  return generateVilleJsonLd(props);
}

export type { JsonLdVilleProps, EspoVille };
