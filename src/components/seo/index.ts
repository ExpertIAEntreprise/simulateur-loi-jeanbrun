/**
 * SEO Components - JSON-LD Schema.org structured data
 *
 * Composants pour injecter des donnees structurees JSON-LD
 * permettant les rich snippets dans les resultats Google
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

// Breadcrumb - Fil d'Ariane
export { JsonLdBreadcrumb, getBreadcrumbJsonLdForMetadata } from "./JsonLdBreadcrumb";
export type { BreadcrumbItem, JsonLdBreadcrumbProps } from "./JsonLdBreadcrumb";

// Place - Informations de lieu pour les pages villes
export { JsonLdPlace, getPlaceJsonLdForMetadata } from "./JsonLdPlace";
export type { JsonLdPlaceProps, PostalAddress, GeoCoordinates } from "./JsonLdPlace";

// RealEstateListing - Programmes immobiliers
export { JsonLdRealEstate, getRealEstateJsonLdForMetadata } from "./JsonLdRealEstate";
export type { JsonLdRealEstateProps, RealEstateAddress, RealEstatePrice } from "./JsonLdRealEstate";

// Ville - Place + LocalBusiness combine pour les pages villes
export { JsonLdVille, getVilleJsonLdForMetadata } from "./JsonLdVille";
export type { JsonLdVilleProps, EspoVille } from "./JsonLdVille";

// WebPage - Schema WebPage pour la page d'accueil
export { JsonLdWebPage, getWebPageJsonLdForMetadata } from "./JsonLdWebPage";
export type { JsonLdWebPageProps } from "./JsonLdWebPage";

// SoftwareApplication - Schema pour l'application
export { JsonLdSoftwareApp, getSoftwareAppJsonLdForMetadata } from "./JsonLdSoftwareApp";
export type { JsonLdSoftwareAppProps } from "./JsonLdSoftwareApp";

// FAQPage - Schema pour la FAQ
export { JsonLdFaq, getFaqJsonLdForMetadata } from "./JsonLdFaq";
export type { JsonLdFaqProps, FaqItem } from "./JsonLdFaq";

// Organization - Schema pour l'organisation
export { JsonLdOrganization, getOrganizationJsonLdForMetadata } from "./JsonLdOrganization";
export type { JsonLdOrganizationProps } from "./JsonLdOrganization";
