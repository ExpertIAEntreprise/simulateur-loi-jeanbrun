/**
 * Trust Signals Components - Simulateur Loi Jeanbrun
 *
 * Composants pour renforcer la confiance utilisateur
 * Base sur l'analyse des 4 sites de defiscalisation
 *
 * @version 1.0
 * @date 01 fevrier 2026
 */

"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"
import {
  Trophy,
  Lock,
  Zap,
  Shield,
  Star,
  Users,
  CheckCircle2,
  Quote,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// =============================================================================
// 1. ANIMATED COUNTER
// =============================================================================

interface AnimatedCounterProps {
  /** Valeur cible */
  target: number
  /** Duree de l'animation en secondes */
  duration?: number
  /** Prefixe (ex: "+", "€") */
  prefix?: string
  /** Suffixe (ex: "%", "k") */
  suffix?: string
  /** Format avec separateurs de milliers */
  formatted?: boolean
  /** Classe CSS additionnelle */
  className?: string
}

/**
 * Compteur anime qui s'incremente au scroll
 *
 * Usage:
 * <AnimatedCounter target={41574} suffix=" simulations" />
 */
export function AnimatedCounter({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  formatted = true,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(0)

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  })

  useEffect(() => {
    if (isInView) {
      spring.set(target)
    }
  }, [isInView, spring, target])

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [spring])

  const formattedValue = formatted
    ? displayValue.toLocaleString("fr-FR")
    : displayValue.toString()

  return (
    <span
      ref={ref}
      className={cn("tabular-nums font-bold", className)}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}

// =============================================================================
// 2. TRUST SIGNALS BAR
// =============================================================================

interface TrustSignal {
  id: string
  icon: React.ReactNode
  value: string
  label: string
}

const defaultTrustSignals: TrustSignal[] = [
  {
    id: "rank",
    icon: <Trophy className="h-6 w-6" />,
    value: "N°1",
    label: "Simulateur Jeanbrun",
  },
  {
    id: "free",
    icon: <Lock className="h-6 w-6" />,
    value: "100%",
    label: "Gratuit sans CB",
  },
  {
    id: "speed",
    icon: <Zap className="h-6 w-6" />,
    value: "2 min",
    label: "Resultat immediat",
  },
  {
    id: "expert",
    icon: <Shield className="h-6 w-6" />,
    value: "CGP",
    label: "Valide par experts",
  },
]

interface TrustSignalsBarProps {
  signals?: TrustSignal[]
  className?: string
}

/**
 * Barre de trust signals sous le hero
 *
 * Usage:
 * <TrustSignalsBar />
 */
export function TrustSignalsBar({
  signals = defaultTrustSignals,
  className,
}: TrustSignalsBarProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 py-8",
        className
      )}
    >
      {signals.map((signal) => (
        <motion.div
          key={signal.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="flex flex-col items-center gap-3 p-4 text-center border-dashed border-accent/30 bg-card/50 backdrop-blur">
            <div className="rounded-full bg-accent/10 p-3 text-accent">
              {signal.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{signal.value}</p>
              <p className="text-sm text-muted-foreground">{signal.label}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

// =============================================================================
// 3. STATS COUNTER
// =============================================================================

interface Stat {
  id: string
  value: number
  suffix?: string
  label: string
}

const defaultStats: Stat[] = [
  { id: "simulations", value: 41574, label: "Simulations realisees" },
  { id: "economies", value: 2800000, suffix: " €", label: "Economies calculees" },
  { id: "satisfaction", value: 98, suffix: "%", label: "Satisfaits" },
  { id: "experts", value: 12, label: "Experts CGP" },
]

interface StatsCounterProps {
  stats?: Stat[]
  className?: string
}

/**
 * Section de stats avec compteurs animes
 *
 * Usage:
 * <StatsCounter />
 */
export function StatsCounter({
  stats = defaultStats,
  className,
}: StatsCounterProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 },
        },
      }}
      className={cn(
        "grid grid-cols-2 lg:grid-cols-4 gap-6 py-12",
        className
      )}
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="text-center"
        >
          <p className="text-4xl md:text-5xl font-bold text-foreground">
            <AnimatedCounter
              target={stat.value}
              suffix={stat.suffix}
              duration={2.5}
            />
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

// =============================================================================
// 4. RATING STARS
// =============================================================================

interface RatingStarsProps {
  rating: number
  maxRating?: number
  reviewCount?: number
  showCount?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Affichage de notation avec etoiles
 *
 * Usage:
 * <RatingStars rating={4.9} reviewCount={1799} />
 */
export function RatingStars({
  rating,
  maxRating = 5,
  reviewCount,
  showCount = true,
  size = "md",
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex">
        {/* Etoiles pleines */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizeClasses[size], "fill-amber-400 text-amber-400")}
          />
        ))}
        {/* Demi-etoile (optionnel) */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizeClasses[size], "text-muted")} />
            <Star
              className={cn(
                sizeClasses[size],
                "fill-amber-400 text-amber-400 absolute inset-0 overflow-hidden"
              )}
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        {/* Etoiles vides */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizeClasses[size], "text-muted")}
          />
        ))}
      </div>

      {showCount && (
        <>
          <span className="font-semibold">{rating.toFixed(1)}/5</span>
          {reviewCount !== undefined && (
            <span className="text-muted-foreground">
              ({reviewCount.toLocaleString("fr-FR")} avis)
            </span>
          )}
        </>
      )}
    </div>
  )
}

// =============================================================================
// 5. CERTIFICATION BADGES
// =============================================================================

interface Certification {
  id: string
  name: string
  logo?: React.ReactNode
  description?: string
}

const defaultCertifications: Certification[] = [
  {
    id: "orias",
    name: "ORIAS",
    description: "Intermediaire en operations bancaires",
  },
  {
    id: "cncef",
    name: "CNCEF",
    description: "Conseil National des Conseillers",
  },
  {
    id: "rgpd",
    name: "RGPD",
    description: "Donnees protegees",
  },
]

interface CertificationBadgesProps {
  certifications?: Certification[]
  className?: string
}

/**
 * Badges de certification (ORIAS, CNCEF, etc.)
 *
 * Usage:
 * <CertificationBadges />
 */
export function CertificationBadges({
  certifications = defaultCertifications,
  className,
}: CertificationBadgesProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="inline-flex items-center gap-2 rounded-lg border border-trust/30 bg-trust-background px-3 py-2"
        >
          {cert.logo || (
            <CheckCircle2 className="h-4 w-4 text-trust-light" />
          )}
          <div>
            <p className="text-sm font-medium text-trust-foreground">
              {cert.name}
            </p>
            {cert.description && (
              <p className="text-xs text-muted-foreground">
                {cert.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// 6. TESTIMONIAL CARD
// =============================================================================

interface Testimonial {
  id: string
  name: string
  role?: string
  avatar?: string
  rating: number
  content: string
  date?: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

/**
 * Card de temoignage client
 *
 * Usage:
 * <TestimonialCard testimonial={...} />
 */
export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <Card className={cn("p-6 relative", className)}>
      {/* Quote decoration */}
      <Quote className="absolute top-4 right-4 h-8 w-8 text-accent/20" />

      <div className="space-y-4">
        {/* Rating */}
        <RatingStars rating={testimonial.rating} showCount={false} size="sm" />

        {/* Content */}
        <p className="text-foreground leading-relaxed">
          "{testimonial.content}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-accent font-semibold">
                {testimonial.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">{testimonial.name}</p>
            {testimonial.role && (
              <p className="text-sm text-muted-foreground">
                {testimonial.role}
              </p>
            )}
          </div>
          {testimonial.date && (
            <span className="ml-auto text-xs text-muted-foreground">
              {testimonial.date}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

// =============================================================================
// 7. GUARANTEES BAR
// =============================================================================

interface Guarantee {
  id: string
  icon: React.ReactNode
  text: string
}

const defaultGuarantees: Guarantee[] = [
  { id: "free", icon: <Lock className="h-4 w-4" />, text: "Gratuit et sans engagement" },
  { id: "fast", icon: <Zap className="h-4 w-4" />, text: "Resultat en 2 minutes" },
  { id: "secure", icon: <Shield className="h-4 w-4" />, text: "Donnees securisees (RGPD)" },
]

interface GuaranteesBarProps {
  guarantees?: Guarantee[]
  className?: string
}

/**
 * Barre horizontale de garanties
 *
 * Usage:
 * <GuaranteesBar />
 */
export function GuaranteesBar({
  guarantees = defaultGuarantees,
  className,
}: GuaranteesBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 md:gap-8 py-4 text-sm text-muted-foreground",
        className
      )}
    >
      {guarantees.map((guarantee) => (
        <div
          key={guarantee.id}
          className="flex items-center gap-2"
        >
          <span className="text-accent">{guarantee.icon}</span>
          <span>{guarantee.text}</span>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// 8. USERS COUNT BADGE
// =============================================================================

interface UsersCountBadgeProps {
  count: number
  label?: string
  animated?: boolean
  className?: string
}

/**
 * Badge affichant le nombre d'utilisateurs avec avatars
 *
 * Usage:
 * <UsersCountBadge count={2847} />
 */
export function UsersCountBadge({
  count,
  label = "utilisateurs aujourd'hui",
  animated = true,
  className,
}: UsersCountBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full bg-card border border-border px-4 py-2",
        className
      )}
    >
      {/* Stacked avatars */}
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-7 w-7 rounded-full bg-accent/20 border-2 border-card flex items-center justify-center"
          >
            <Users className="h-3 w-3 text-accent" />
          </div>
        ))}
      </div>

      {/* Count */}
      <div className="flex items-baseline gap-1.5">
        <span className="font-bold text-foreground">
          {animated ? (
            <AnimatedCounter target={count} prefix="+" duration={1.5} />
          ) : (
            `+${count.toLocaleString("fr-FR")}`
          )}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

// =============================================================================
// 9. PRESS MENTIONS
// =============================================================================

interface PressMention {
  id: string
  name: string
  logo?: React.ReactNode
}

const defaultPressMentions: PressMention[] = [
  { id: "lefigaro", name: "Le Figaro" },
  { id: "bfm", name: "BFM Business" },
  { id: "lci", name: "LCI" },
  { id: "capital", name: "Capital" },
]

interface PressMentionsProps {
  mentions?: PressMention[]
  title?: string
  className?: string
}

/**
 * Section "Vu dans la presse"
 *
 * Usage:
 * <PressMentions />
 */
export function PressMentions({
  mentions = defaultPressMentions,
  title = "Ils parlent de nous",
  className,
}: PressMentionsProps) {
  return (
    <div className={cn("text-center py-8", className)}>
      <p className="text-sm text-muted-foreground mb-6">{title}</p>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {mentions.map((mention) => (
          <div
            key={mention.id}
            className="text-lg font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            {mention.logo || mention.name}
          </div>
        ))}
      </div>
    </div>
  )
}
