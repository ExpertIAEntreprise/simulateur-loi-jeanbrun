import {
  Building2,
  Gift,
  Handshake,
  BadgeCheck,
  Shield,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface DirectPromoteurBannerProps {
  /** Classe CSS additionnelle */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

interface BenefitItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BENEFITS: readonly BenefitItem[] = [
  {
    id: "tarifs-directs",
    icon: <Building2 className="h-6 w-6" aria-hidden="true" />,
    title: "Tarifs directs promoteur",
    description:
      "Beneficiez du prix catalogue, sans marge d'intermediation",
  },
  {
    id: "offres-speciales",
    icon: <Gift className="h-6 w-6" aria-hidden="true" />,
    title: "Offres speciales en cours",
    description:
      "Frais de notaire offerts, remises commerciales, prestations incluses selon le programme",
  },
  {
    id: "accompagnement",
    icon: <Handshake className="h-6 w-6" aria-hidden="true" />,
    title: "Accompagnement personnalise",
    description:
      "Votre interlocuteur dedie chez le promoteur pour un suivi sur mesure",
  },
] as const;

interface SpecialOffer {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SPECIAL_OFFERS: readonly SpecialOffer[] = [
  {
    id: "notaire",
    label: "Frais de notaire offerts",
    icon: <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  {
    id: "remise",
    label: "Remise -5%",
    icon: <Star className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  {
    id: "cuisine",
    label: "Cuisine equipee offerte",
    icon: <Gift className="h-3.5 w-3.5" aria-hidden="true" />,
  },
] as const;

// ============================================================================
// Sub-components
// ============================================================================

function BenefitCard({ benefit, index }: { benefit: BenefitItem; index: number }) {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-xl p-5",
        "bg-card/80 dark:bg-card/50",
        "border border-amber-200/60 dark:border-amber-500/20",
        "text-center transition-all duration-300",
        "hover:border-amber-300 dark:hover:border-amber-500/40",
        "hover:shadow-md",
        "animate-fade-in"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Icon container with amber gradient */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          "bg-gradient-to-br from-amber-100 to-amber-200/80",
          "dark:from-amber-500/20 dark:to-amber-600/10",
          "text-amber-700 dark:text-amber-400",
          "transition-transform duration-300 group-hover:scale-110"
        )}
      >
        {benefit.icon}
      </div>

      {/* Text content */}
      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-foreground">
          {benefit.title}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}

function SpecialOfferBadge({ offer }: { offer: SpecialOffer }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-amber-300 bg-amber-50 text-amber-800",
        "dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
        "px-3 py-1 text-xs font-medium"
      )}
    >
      {offer.icon}
      {offer.label}
    </Badge>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * DirectPromoteurBanner - Banniere de proposition de valeur "Direct Promoteur"
 *
 * Communique les avantages exclusifs de travailler directement
 * avec le promoteur : tarifs directs, offres speciales, accompagnement.
 * Inclut un message de transparence sur la remuneration.
 *
 * Composant purement presentationnel, sans etat.
 */
export function DirectPromoteurBanner({ className }: DirectPromoteurBannerProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-amber-200/60 dark:border-amber-500/20",
        className
      )}
    >
      {/* Gradient background overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-gradient-to-br from-amber-50/80 via-amber-100/40 to-orange-50/30",
          "dark:from-amber-500/5 dark:via-amber-600/5 dark:to-amber-700/5"
        )}
        aria-hidden="true"
      />

      {/* Decorative corner accent */}
      <div
        className={cn(
          "absolute -top-12 -right-12 h-32 w-32 rounded-full",
          "bg-gradient-to-br from-amber-200/30 to-transparent",
          "dark:from-amber-500/10 dark:to-transparent",
          "blur-2xl"
        )}
        aria-hidden="true"
      />

      <CardContent className="relative space-y-6 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              "bg-gradient-to-br from-amber-400 to-amber-500",
              "dark:from-amber-500 dark:to-amber-600",
              "text-white shadow-sm"
            )}
          >
            <Shield className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Direct Promoteur : vos avantages
            </h2>
            <p className="text-xs text-muted-foreground">
              Des conditions exclusives sans intermediaire
            </p>
          </div>
        </div>

        {/* Benefits grid - 3 columns on desktop, stacked on mobile */}
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          role="list"
          aria-label="Avantages direct promoteur"
        >
          {BENEFITS.map((benefit, index) => (
            <div key={benefit.id} role="listitem">
              <BenefitCard benefit={benefit} index={index} />
            </div>
          ))}
        </div>

        {/* Special offers badges */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Offres en cours selon le programme
          </p>
          <div className="flex flex-wrap gap-2">
            {SPECIAL_OFFERS.map((offer) => (
              <SpecialOfferBadge key={offer.id} offer={offer} />
            ))}
          </div>
        </div>

        {/* Transparency message */}
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-lg p-3",
            "bg-muted/50 dark:bg-muted/30",
            "border border-border/50"
          )}
        >
          <BadgeCheck
            className="h-4 w-4 mt-0.5 shrink-0 text-success"
            aria-hidden="true"
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Aucune commission ne s'ajoute a votre prix d'achat.
            Notre remuneration provient uniquement du promoteur.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
