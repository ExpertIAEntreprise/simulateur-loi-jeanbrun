/**
 * PeripheriqueLayout.tsx
 * Layout 2 colonnes pour les ~330 villes peripheriques
 *
 * Structure:
 * - Breadcrumb avec JSON-LD
 * - Header compact avec badge departement
 * - Main Content (2/3): Editorial, programmes, simulateur, FAQ, villes proches
 * - Sidebar (1/3): Arguments, barometre, donnees rapides, carte
 */

import { MapPin, Users, Euro, Building2, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EspoVille, EspoProgramme, EspoBarometre } from "@/lib/espocrm/types";
import { getVilleArguments, getVilleFaq } from "@/lib/espocrm/types";
import { cn } from "@/lib/utils";
import type { ZoneFiscale } from "@/types/ville";
import { ArgumentsInvestissement } from "./ArgumentsInvestissement";
import { BarometreSidebar } from "./BarometreSidebar";
import { Breadcrumb } from "./Breadcrumb";
import { CarteVille } from "./CarteVille";
import { ContenuEditorial } from "./ContenuEditorial";
import { FaqVille } from "./FaqVille";
import { LienMetropoleParent } from "./LienMetropoleParent";
import { ProgrammesList } from "./ProgrammesList";
import { SimulateurPreRempli } from "./SimulateurPreRempli";
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
 * Ville proche pour le maillage interne
 */
interface VilleProche {
  nom: string;
  slug: string;
  zoneFiscale: ZoneFiscale;
}

/**
 * Props du layout peripherique
 */
interface PeripheriqueLayoutProps {
  /** Donnees de la ville */
  ville: EspoVille;
  /** Liste des programmes immobiliers */
  programmes: EspoProgramme[];
  /** Barometre mensuel (peut etre null) */
  barometre: EspoBarometre | null;
  /** Metropole parent (peut etre null) */
  metropoleParent: EspoVille | null;
  /** Nombre de programmes dans la metropole parent (optionnel) */
  nbProgrammesMetropole?: number;
  /** Villes proches pour le maillage interne (optionnel) */
  villesProches?: VilleProche[];
  /** Contenu enfant additionnel */
  children?: React.ReactNode;
}

/**
 * Ligne de donnee rapide pour la sidebar
 */
function QuickDataRow({
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
    <div className={cn("flex items-center justify-between py-2", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

/**
 * Card de donnees rapides pour la sidebar
 */
function QuickDataCard({ ville }: { ville: EspoVille }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Map className="size-4" />
          Donnees cles
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        <QuickDataRow
          icon={Users}
          label="Population"
          value={formatNumber(ville.cPopulationCommune)}
        />
        <QuickDataRow
          icon={Euro}
          label="Prix m2"
          value={formatEuros(ville.cPrixM2Moyen)}
        />
        <QuickDataRow
          icon={Building2}
          label="Zone fiscale"
          value={`Zone ${ZONE_LABELS[ville.cZoneFiscale]}`}
        />
        {ville.cDepartement && (
          <QuickDataRow
            icon={MapPin}
            label="Departement"
            value={ville.cDepartement}
          />
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Layout 2 colonnes pour les pages ville peripherique (~330 villes)
 * Main content (2/3) + Sidebar (1/3)
 */
export function PeripheriqueLayout({
  ville,
  programmes,
  barometre,
  metropoleParent,
  nbProgrammesMetropole = 0,
  villesProches = [],
  children,
}: PeripheriqueLayoutProps) {
  // Extraction des donnees de la ville
  const arguments_ = getVilleArguments(ville);
  const faqItems = getVilleFaq(ville);

  // Construction des items du breadcrumb
  const breadcrumbItems = [{ label: "Villes", href: "/villes" }];

  // Ajouter la metropole parent si elle existe
  if (metropoleParent) {
    breadcrumbItems.push({
      label: metropoleParent.name,
      href: `/villes/${metropoleParent.cSlug}`,
    });
  }

  // Ajouter la ville actuelle
  breadcrumbItems.push({
    label: ville.name,
    href: `/villes/${ville.cSlug}`,
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Header compact */}
        <header className="mb-8">
          {/* Departement badge */}
          {ville.cDepartement && (
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              <span>Departement {ville.cDepartement}</span>
              {ville.cRegion && (
                <>
                  <span className="text-muted-foreground/50">|</span>
                  <span>{ville.cRegion}</span>
                </>
              )}
            </div>
          )}

          {/* H1 + Badge zone */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Loi Jeanbrun a {ville.name}
            </h1>
            <Badge
              variant={getZoneBadgeVariant(ville.cZoneFiscale)}
              className="text-sm"
            >
              Zone {ZONE_LABELS[ville.cZoneFiscale]}
            </Badge>
          </div>

          {/* Sous-titre avec metropole parent */}
          {metropoleParent && (
            <p className="mt-2 text-muted-foreground">
              Ville de la peripherie de{" "}
              <span className="font-medium text-foreground">
                {metropoleParent.name}
              </span>
            </p>
          )}
        </header>

        {/* Contenu enfant additionnel (si fourni) */}
        {children}

        {/* Grid 2 colonnes */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content (2/3) */}
          <div className="space-y-10 lg:col-span-2">
            {/* Contenu editorial */}
            <section aria-labelledby="section-editorial">
              <h2 id="section-editorial" className="sr-only">
                Investir a {ville.name}
              </h2>
              <ContenuEditorial
                contenu={ville.cContenuEditorial}
                villeNom={ville.name}
              />
            </section>

            {/* Programmes (si disponibles) */}
            {programmes.length > 0 && (
              <ProgrammesList programmes={programmes} maxItems={4} />
            )}

            {/* Simulateur */}
            <section aria-labelledby="section-simulateur">
              <h2
                id="section-simulateur"
                className="mb-4 text-xl font-bold tracking-tight md:text-2xl"
              >
                Simulez votre investissement
              </h2>
              <SimulateurPreRempli
                villeNom={ville.name}
                villeSlug={ville.cSlug}
                zoneFiscale={ville.cZoneFiscale}
              />
            </section>

            {/* FAQ */}
            {faqItems.length > 0 && (
              <section aria-labelledby="section-faq">
                <FaqVille faqItems={faqItems} villeNom={ville.name} />
              </section>
            )}

            {/* Villes proches */}
            {villesProches.length > 0 && (
              <section aria-labelledby="section-villes-proches">
                <h2 id="section-villes-proches" className="sr-only">
                  Villes proches pour investir
                </h2>
                <VillesProches villes={villesProches} />
              </section>
            )}

            {/* Lien vers metropole parent */}
            {metropoleParent && (
              <section aria-labelledby="section-metropole-parent">
                <h2 id="section-metropole-parent" className="sr-only">
                  Voir la metropole parent
                </h2>
                <LienMetropoleParent
                  metropoleNom={metropoleParent.name}
                  metropoleSlug={metropoleParent.cSlug}
                  nbProgrammes={nbProgrammesMetropole}
                />
              </section>
            )}
          </div>

          {/* Sidebar (1/3) */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Sticky container pour la sidebar */}
            <div className="lg:sticky lg:top-6 lg:space-y-6">
              {/* Arguments d'investissement */}
              {arguments_.length > 0 && (
                <ArgumentsInvestissement
                  arguments={arguments_}
                  villeNom={ville.name}
                />
              )}

              {/* Barometre sidebar */}
              <BarometreSidebar barometre={barometre} />

              {/* Donnees rapides */}
              <QuickDataCard ville={ville} />

              {/* Carte de la ville */}
              <CarteVille
                latitude={ville.cLatitude}
                longitude={ville.cLongitude}
                villeNom={ville.name}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
