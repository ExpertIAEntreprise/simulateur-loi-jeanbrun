/**
 * Composants pour les pages villes du simulateur Loi Jeanbrun
 *
 * Ces composants sont utilises pour construire les pages SEO des 382 villes
 * eligibles (52 metropoles + 330 peripheriques).
 */

// Layouts principaux
export { MetropoleLayout } from "./MetropoleLayout";
export { PeripheriqueLayout } from "./PeripheriqueLayout";
export { Breadcrumb, getBreadcrumbJsonLdForMetadata } from "./Breadcrumb";
export type { BreadcrumbItem } from "./Breadcrumb";

// Composants donnees marche
export { DonneesMarche } from "./DonneesMarche";
export { HistoriquePrix } from "./HistoriquePrix";
export type { HistoriquePrixDataPoint } from "./HistoriquePrix";
export { DonneesInsee } from "./DonneesInsee";
export { PlafondsJeanbrun } from "./PlafondsJeanbrun";

// Composants programmes
export { ProgrammeCard } from "./ProgrammeCard";
export { ProgrammesList } from "./ProgrammesList";

// Composants ville generaux
export { SimulateurPreRempli } from "./SimulateurPreRempli";
export { VillesProches } from "./VillesProches";
export { BarometreResume } from "./BarometreResume";
export { ContenuEditorial } from "./ContenuEditorial";
export { PhotoVille } from "./PhotoVille";

// Composants pages peripheriques
export { BarometreSidebar } from "./BarometreSidebar";
export { CarteVille } from "./CarteVille";
export { ArgumentsInvestissement } from "./ArgumentsInvestissement";
export { FaqVille, getFaqJsonLdForMetadata } from "./FaqVille";
export { LienMetropoleParent, LienMetropoleParentCompact } from "./LienMetropoleParent";
export { TemoignageLocalise } from "./TemoignageLocalise";
export { VillePeripheriqueCard, VillesPeripheriquesList } from "./VillePeripheriqueCard";
export { ZonesInvestissement, ZonesInvestissementCompact } from "./ZonesInvestissement";

// Composant footer maillage interne
export { FooterVilles, FooterVillesCompact } from "./FooterVilles";
