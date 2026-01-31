/**
 * MetropoleLayout.tsx
 * Layout full-width pour les 52 metropoles principales
 *
 * Structure:
 * - Header hero avec PhotoVille
 * - Breadcrumb avec JSON-LD
 * - H1 + Badge zone fiscale
 * - Grid principale avec toutes les sections
 */

import { Building2, Users, Euro, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EspoVille, EspoProgramme, EspoBarometre } from "@/lib/espocrm/types";
import { getVilleArguments, getVilleFaq } from "@/lib/espocrm/types";
import { cn } from "@/lib/utils";
import type { ZoneFiscale } from "@/types/ville";
import { BarometreResume } from "./BarometreResume";
import { Breadcrumb } from "./Breadcrumb";
import { ContenuEditorial } from "./ContenuEditorial";
import { DonneesMarche } from "./DonneesMarche";
import { FaqVille } from "./FaqVille";
import { HistoriquePrix, type HistoriquePrixDataPoint } from "./HistoriquePrix";
import { PhotoVille } from "./PhotoVille";
import { PlafondsJeanbrun } from "./PlafondsJeanbrun";
import { ProgrammesList } from "./ProgrammesList";
import { SimulateurPreRempli } from "./SimulateurPreRempli";
import { VillesPeripheriquesList } from "./VillePeripheriqueCard";
import { VillesProches } from "./VillesProches";

/**
 * Labels courts pour les zones fiscales
 */
const ZONE_LABELS: Record<ZoneFiscale, string> = {
  A_BIS: "A bis",
  A: "A",
  B1: "B1",
  B2: "B2",
  C: "C",
};

/**
 * Couleurs pour les badges de zone fiscale
 */
function getZoneBadgeVariant(zone: ZoneFiscale): "default" | "secondary" | "outline" {
  switch (zone) {
    case "A_BIS":
    case "A":
      return "default";
    case "B1":
      return "secondary";
    default:
      return "outline";
  }
}

/**
 * Formate un nombre avec separateurs de milliers
 */
function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("fr-FR").format(Math.round(value));
}

/**
 * Formate un prix en euros
 */
function formatEuros(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Ville peripherique simplifiee pour la liste
 */
interface VillePeripherique {
  nom: string;
  slug: string;
  zoneFiscale: ZoneFiscale;
}

/**
 * Ville proche pour le maillage interne
 */
interface VilleProche {
  nom: string;
  slug: string;
  zoneFiscale: ZoneFiscale;
}

/**
 * Props du layout metropole
 */
interface MetropoleLayoutProps {
  /** Donnees de la ville */
  ville: EspoVille;
  /** Liste des programmes immobiliers */
  programmes: EspoProgramme[];
  /** Barometre mensuel (peut etre null) */
  barometre: EspoBarometre | null;
  /** Villes peripheriques rattachees */
  villesPeripheriques: VillePeripherique[];
  /** Villes proches pour le maillage interne (optionnel) */
  villesProches?: VilleProche[];
  /** Historique des prix pour le graphique (optionnel) */
  historiquePrix?: HistoriquePrixDataPoint[];
  /** Contenu enfant additionnel */
  children?: React.ReactNode;
}

/**
 * Card de statistique rapide pour le header
 */
function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <Card className={cn("bg-background/80 backdrop-blur-sm", className)}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="truncate text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Layout complet pour les pages metropole (52 villes principales)
 * Full-width avec toutes les sections de contenu
 */
export function MetropoleLayout({
  ville,
  programmes,
  barometre,
  villesPeripheriques,
  villesProches = [],
  historiquePrix = [],
  children,
}: MetropoleLayoutProps) {
  // Extraction des donnees de la ville
  const arguments_ = getVilleArguments(ville);
  const faqItems = getVilleFaq(ville);

  return (
    <div className="min-h-screen">
      {/* Hero Header avec photo */}
      <header className="relative">
        {/* Photo de fond */}
        <div className="relative h-64 w-full md:h-80 lg:h-96">
          <PhotoVille
            photoUrl={ville.cPhotoVille}
            alt={ville.cPhotoVilleAlt}
            villeNom={ville.name}
            shape="rectangle"
            className="h-full w-full"
            priority
          />
          {/* Overlay gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Contenu superpose sur le hero */}
        <div className="absolute inset-x-0 bottom-0 pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Stats cards en bas du hero */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard
                icon={Users}
                label="Population"
                value={formatNumber(ville.cPopulationCommune)}
              />
              <StatCard
                icon={Euro}
                label="Prix m2 moyen"
                value={formatEuros(ville.cPrixM2Moyen)}
              />
              <StatCard
                icon={TrendingUp}
                label="Evolution 1 an"
                value={
                  ville.cEvolutionPrix1An !== null
                    ? `${ville.cEvolutionPrix1An >= 0 ? "+" : ""}${ville.cEvolutionPrix1An.toFixed(1)}%`
                    : "N/A"
                }
              />
              <StatCard
                icon={Building2}
                label="Programmes"
                value={String(programmes.length)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Villes", href: "/villes" },
            { label: ville.name, href: `/villes/${ville.cSlug}` },
          ]}
          className="mb-6"
        />

        {/* H1 + Badge zone */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Loi Jeanbrun a {ville.name}
          </h1>
          <Badge
            variant={getZoneBadgeVariant(ville.cZoneFiscale)}
            className="text-sm"
          >
            Zone {ZONE_LABELS[ville.cZoneFiscale]}
          </Badge>
        </div>

        {/* Contenu enfant additionnel (si fourni) */}
        {children}

        {/* Grid des sections */}
        <div className="space-y-12">
          {/* Section marche immobilier */}
          <section aria-labelledby="section-marche">
            <h2 id="section-marche" className="sr-only">
              Donnees du marche immobilier
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <DonneesMarche ville={ville} />
              <HistoriquePrix data={historiquePrix} />
            </div>
          </section>

          {/* Section plafonds Loi Jeanbrun */}
          <section aria-labelledby="section-plafonds">
            <h2 id="section-plafonds" className="sr-only">
              Plafonds de loyer Loi Jeanbrun
            </h2>
            <PlafondsJeanbrun zoneFiscale={ville.cZoneFiscale} />
          </section>

          {/* Section programmes neufs */}
          <ProgrammesList programmes={programmes} maxItems={6} />

          {/* Section zones d'investissement (villes peripheriques) */}
          {villesPeripheriques.length > 0 && (
            <section aria-labelledby="section-peripheriques">
              <h2
                id="section-peripheriques"
                className="mb-6 text-2xl font-bold tracking-tight md:text-3xl"
              >
                Zones d&apos;investissement autour de {ville.name}
              </h2>
              <p className="mb-6 text-muted-foreground">
                Decouvrez les {villesPeripheriques.length} villes eligibles a la
                Loi Jeanbrun dans la peripherie de {ville.name}.
              </p>
              <VillesPeripheriquesList
                villes={villesPeripheriques}
                metropoleNom={ville.name}
              />
            </section>
          )}

          {/* Section barometre du marche */}
          <section aria-labelledby="section-barometre">
            <h2
              id="section-barometre"
              className="mb-6 text-2xl font-bold tracking-tight md:text-3xl"
            >
              Barometre du marche
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <BarometreResume
                barometre={barometre}
                villeSlug={ville.cSlug}
              />
              {/* Arguments d'investissement dans la seconde colonne */}
              {arguments_.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Pourquoi investir a {ville.name} ?
                    </h3>
                    <ul className="space-y-3">
                      {arguments_.slice(0, 5).map((arg, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span
                            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            aria-hidden="true"
                          >
                            <svg
                              className="size-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                          <div>
                            <span className="font-medium">{arg.titre}</span>
                            {arg.description && (
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {arg.description}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Section contenu editorial */}
          <section aria-labelledby="section-editorial">
            <h2 id="section-editorial" className="sr-only">
              Investir a {ville.name}
            </h2>
            <ContenuEditorial
              contenu={ville.cContenuEditorial}
              villeNom={ville.name}
            />
          </section>

          {/* Section simulateur */}
          <section aria-labelledby="section-simulateur">
            <h2
              id="section-simulateur"
              className="mb-6 text-2xl font-bold tracking-tight md:text-3xl"
            >
              Simulez votre investissement
            </h2>
            <div className="mx-auto max-w-2xl">
              <SimulateurPreRempli
                villeNom={ville.name}
                villeSlug={ville.cSlug}
                zoneFiscale={ville.cZoneFiscale}
              />
            </div>
          </section>

          {/* Section FAQ */}
          {faqItems.length > 0 && (
            <section aria-labelledby="section-faq">
              <FaqVille faqItems={faqItems} villeNom={ville.name} />
            </section>
          )}

          {/* Section villes proches (maillage interne) */}
          {villesProches.length > 0 && (
            <section aria-labelledby="section-villes-proches">
              <h2 id="section-villes-proches" className="sr-only">
                Villes proches pour investir
              </h2>
              <VillesProches villes={villesProches} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
