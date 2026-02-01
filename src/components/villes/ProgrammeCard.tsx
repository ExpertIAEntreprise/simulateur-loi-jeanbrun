import Image from "next/image";
import { Building2, Calendar, MapPin, Maximize2 } from "lucide-react";
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
    cPromoteur,
    cPrixMin,
    cSurfaceMin,
    cSurfaceMax,
    cDateLivraison,
    cImagePrincipale,
    cImageAlt,
    cNbLotsDisponibles,
    cVilleName,
    cCodePostal,
  } = programme;

  const hasImage = cImagePrincipale !== null && cImagePrincipale !== "";
  const hasSurface = cSurfaceMin !== null || cSurfaceMax !== null;
  const hasPrice = cPrixMin !== null;
  const hasDeliveryDate = cDateLivraison !== null && cDateLivraison !== "";
  const hasAvailableLots =
    cNbLotsDisponibles !== null && cNbLotsDisponibles > 0;
  const hasLocation = cVilleName !== undefined || cCodePostal !== null;

  // Build surface text
  const surfaceText = (() => {
    if (cSurfaceMin !== null && cSurfaceMax !== null) {
      if (cSurfaceMin === cSurfaceMax) {
        return `${cSurfaceMin} m²`;
      }
      return `De ${cSurfaceMin} à ${cSurfaceMax} m²`;
    }
    if (cSurfaceMin !== null) {
      return `À partir de ${cSurfaceMin} m²`;
    }
    if (cSurfaceMax !== null) {
      return `Jusqu'à ${cSurfaceMax} m²`;
    }
    return null;
  })();

  // Build location text
  const locationText = (() => {
    if (cVilleName !== undefined && cCodePostal !== null) {
      return `${cVilleName} (${cCodePostal})`;
    }
    if (cVilleName !== undefined) {
      return cVilleName;
    }
    if (cCodePostal !== null) {
      return cCodePostal;
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
            src={cImagePrincipale}
            alt={cImageAlt ?? `Programme immobilier ${name}`}
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
        {cPromoteur !== null && cPromoteur !== "" && (
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {cPromoteur}
            </Badge>
          </div>
        )}

        {/* Available lots badge overlay */}
        {hasAvailableLots && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-green-600 text-white hover:bg-green-600">
              {cNbLotsDisponibles} lot{cNbLotsDisponibles > 1 ? "s" : ""}{" "}
              disponible{cNbLotsDisponibles > 1 ? "s" : ""}
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
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Price */}
        {hasPrice && (
          <div className="text-lg font-semibold text-primary">
            À partir de {formatPrice(cPrixMin)}
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
              <span>Livraison {formatDeliveryDate(cDateLivraison)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
