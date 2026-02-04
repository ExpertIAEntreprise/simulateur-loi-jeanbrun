import Image from "next/image";
import { Building2, Calendar, MapPin, Maximize2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EspoProgramme } from "@/lib/espocrm/types";
import { cn } from "@/lib/utils";

interface ProgrammeCardProps {
  /** Programme immobilier to display */
  programme: EspoProgramme;
  /** Load image with priority (for above-the-fold content) */
  priority?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format price to French currency format
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format ISO date string to French locale (month + year)
 */
function formatDeliveryDate(dateString: string | null | undefined): string {
  if (!dateString) return "Date non communiquée";

  const date = new Date(dateString);

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    return "Date non communiquée";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * ProgrammeCard - Card component for displaying a real estate program
 *
 * Features:
 * - Main image with Next.js Image optimization and fallback
 * - Promoter badge
 * - Starting price formatted in EUR
 * - Surface range (min to max m2)
 * - Delivery date
 * - Available lots badge
 * - Hover effect with shadow
 * - Fully responsive
 * - Accessible with proper alt text
 */
export function ProgrammeCard({
  programme,
  priority = false,
  className,
}: ProgrammeCardProps) {
  const {
    name,
    promoteur,
    prixMin,
    prixMax,
    prixM2Moyen,
    surfaceMin,
    surfaceMax,
    dateLivraison,
    imagePrincipale,
    imageAlt,
    nbLotsTotal,
    nbLotsDisponibles,
    typesLots: typesLotsRaw,
    adresse,
    villeName,
    codePostal,
  } = programme;

  const hasImage = imagePrincipale != null && imagePrincipale !== "";
  const hasSurface = surfaceMin != null || surfaceMax != null;
  const hasPrice = prixMin != null;
  const hasPriceRange = prixMin != null && prixMax != null;
  const hasDeliveryDate = dateLivraison != null && dateLivraison !== "";
  const hasLocation = villeName != null || codePostal != null;

  // Parse types de lots
  const typesLots: string[] = (() => {
    if (!typesLotsRaw) return [];
    try {
      return JSON.parse(typesLotsRaw) as string[];
    } catch {
      return [];
    }
  })();

  // Lots texte (5/12 lots disponibles)
  const lotsText = (() => {
    if (nbLotsDisponibles != null && nbLotsTotal != null && nbLotsTotal > 0) {
      return `${nbLotsDisponibles}/${nbLotsTotal} lots disponibles`;
    }
    if (nbLotsDisponibles != null && nbLotsDisponibles > 0) {
      return `${nbLotsDisponibles} lot${nbLotsDisponibles > 1 ? "s" : ""} disponible${nbLotsDisponibles > 1 ? "s" : ""}`;
    }
    return null;
  })();

  // Build surface text
  const surfaceText = (() => {
    if (surfaceMin != null && surfaceMax != null) {
      if (surfaceMin === surfaceMax) {
        return `${surfaceMin} m²`;
      }
      return `De ${surfaceMin} à ${surfaceMax} m²`;
    }
    if (surfaceMin != null) {
      return `À partir de ${surfaceMin} m²`;
    }
    if (surfaceMax != null) {
      return `Jusqu'à ${surfaceMax} m²`;
    }
    return null;
  })();

  // Build location text
  const locationText = (() => {
    if (villeName != null && codePostal != null) {
      return `${villeName} (${codePostal})`;
    }
    if (villeName != null) {
      return villeName;
    }
    if (codePostal != null) {
      return codePostal;
    }
    return null;
  })();

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {hasImage ? (
          <Image
            src={imagePrincipale}
            alt={imageAlt ?? `Programme immobilier ${name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div
            className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5"
            role="img"
            aria-label={`Programme immobilier ${name}`}
          >
            <Building2
              className="size-16 text-primary/40"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Promoter badge overlay */}
        {promoteur != null && promoteur !== "" && (
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {promoteur}
            </Badge>
          </div>
        )}

        {/* Available lots badge overlay */}
        {lotsText !== null && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-green-600 text-white hover:bg-green-600">
              {lotsText}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="flex-1 space-y-2 pb-3">
        {/* Programme name */}
        <CardTitle className="line-clamp-2 text-lg leading-snug">
          {name}
        </CardTitle>

        {/* Location */}
        {hasLocation && locationText !== null && (
          <CardDescription className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{locationText}</span>
          </CardDescription>
        )}

        {/* Adresse */}
        {adresse != null && adresse !== "" && (
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            <span>{adresse}</span>
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Price */}
        {hasPrice && (
          <div>
            <div className="text-lg font-semibold text-primary">
              {hasPriceRange && prixMax > prixMin
                ? `${formatPrice(prixMin)} - ${formatPrice(prixMax)}`
                : `A partir de ${formatPrice(prixMin)}`}
            </div>
            {prixM2Moyen != null && (
              <p className="text-xs text-muted-foreground">
                soit ~{formatPrice(prixM2Moyen)}/m2
              </p>
            )}
          </div>
        )}

        {/* Details row */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {/* Surface */}
          {hasSurface && surfaceText !== null && (
            <div className="flex items-center gap-1.5">
              <Maximize2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{surfaceText}</span>
            </div>
          )}

          {/* Delivery date */}
          {hasDeliveryDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Livraison {formatDeliveryDate(dateLivraison)}</span>
            </div>
          )}
        </div>

        {/* Types de lots */}
        {typesLots.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Layers className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {typesLots.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
